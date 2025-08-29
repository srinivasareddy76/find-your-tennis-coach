

#!/bin/bash

# Find Your Tennis Coach - Deployment Script
set -e

echo "🎾 Find Your Tennis Coach - Deployment Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install Terraform first."
        exit 1
    fi
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install AWS CLI first."
        exit 1
    fi
    
    # Check AWS credentials
    print_status "Verifying AWS credentials..."
    
    # Try to get caller identity and capture both output and error
    aws_check_output=$(aws sts get-caller-identity 2>&1)
    aws_check_exit_code=$?
    
    if [ $aws_check_exit_code -ne 0 ]; then
        print_error "AWS credentials verification failed:"
        echo "  $aws_check_output"
        echo ""
        print_error "Please ensure your AWS credentials are properly configured."
        echo ""
        echo "Options to fix this:"
        echo "1. Run 'aws configure' to set up credentials"
        echo "2. Set environment variables: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY"
        echo "3. Use AWS SSO: 'aws sso login'"
        echo "4. Use IAM roles if running on EC2"
        echo ""
        exit 1
    else
        print_success "AWS credentials verified successfully!"
        echo "  Account: $(echo "$aws_check_output" | grep -o '"Account": "[^"]*"' | cut -d'"' -f4)"
        echo "  User/Role: $(echo "$aws_check_output" | grep -o '"Arn": "[^"]*"' | cut -d'"' -f4)"
    fi
    
    print_success "All requirements met!"
}

# Create Lambda deployment packages
create_lambda_packages() {
    print_status "Creating Lambda deployment packages..."
    
    # Create frontend package
    if [ -d "frontend" ]; then
        cd frontend
        zip -r ../frontend.zip . > /dev/null 2>&1
        cd ..
        print_success "Frontend package created: frontend.zip"
    else
        print_error "Frontend directory not found!"
        exit 1
    fi
    
    # Create backend package
    if [ -d "backend" ]; then
        cd backend
        # Install dependencies if package.json exists
        if [ -f "package.json" ]; then
            print_status "Installing backend dependencies..."
            npm install --production > /dev/null 2>&1 || true
        fi
        zip -r ../backend.zip . > /dev/null 2>&1
        cd ..
        print_success "Backend package created: backend.zip"
    else
        print_error "Backend directory not found!"
        exit 1
    fi
}

# Initialize Terraform
init_terraform() {
    print_status "Initializing Terraform..."
    terraform init > /dev/null 2>&1
    print_success "Terraform initialized!"
}

# Plan deployment
plan_deployment() {
    print_status "Planning deployment..."
    terraform plan -var-file="terraform.tfvars" -out=tfplan
    print_success "Deployment plan created!"
}

# Apply deployment
apply_deployment() {
    print_status "Applying deployment..."
    terraform apply tfplan
    print_success "Deployment completed!"
}

# Display outputs
show_outputs() {
    print_status "Deployment Information:"
    echo ""
    
    API_URL=$(terraform output -raw api_gateway_invoke_url 2>/dev/null || echo "Not available")
    S3_BUCKET=$(terraform output -raw s3_bucket_name 2>/dev/null || echo "Not available")
    S3_WEBSITE=$(terraform output -raw s3_website_url 2>/dev/null || echo "Not available")
    DYNAMODB_TABLE=$(terraform output -raw dynamodb_table_name 2>/dev/null || echo "Not available")
    
    echo -e "${GREEN}🌐 Website URL:${NC} https://$API_URL"
    echo -e "${GREEN}📡 API Gateway URL:${NC} https://$API_URL"
    echo -e "${GREEN}🪣 S3 Bucket:${NC} $S3_BUCKET"
    echo -e "${GREEN}🌍 S3 Website URL:${NC} http://$S3_WEBSITE"
    echo -e "${GREEN}🗄️  DynamoDB Table:${NC} $DYNAMODB_TABLE"
    echo ""
    
    print_success "Your Find Your Tennis Coach website is now live!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Visit the website URL above to see your tennis coach platform"
    echo "2. The API is pre-loaded with sample coach data"
    echo "3. You can add more coaches using the API endpoints"
    echo "4. Upload images to the S3 bucket for enhanced visuals"
    echo ""
    echo "🔧 Management:"
    echo "- View logs: AWS CloudWatch Console"
    echo "- Manage data: AWS DynamoDB Console"
    echo "- Monitor API: AWS API Gateway Console"
}

# Upload images to S3
upload_images() {
    if [ -d "images" ]; then
        print_status "Uploading images to S3..."
        S3_BUCKET=$(terraform output -raw s3_bucket_name 2>/dev/null)
        if [ "$S3_BUCKET" != "Not available" ] && [ -n "$S3_BUCKET" ]; then
            aws s3 sync images/ s3://$S3_BUCKET/images/ --acl public-read > /dev/null 2>&1 || true
            print_success "Images uploaded to S3!"
        else
            print_warning "Could not determine S3 bucket name. Images not uploaded."
        fi
    fi
}

# Cleanup function
cleanup() {
    print_status "Cleaning up temporary files..."
    rm -f tfplan frontend.zip backend.zip
    print_success "Cleanup completed!"
}

# Main deployment process
main() {
    echo ""
    check_requirements
    echo ""
    create_lambda_packages
    echo ""
    init_terraform
    echo ""
    plan_deployment
    echo ""
    
    # Ask for confirmation
    echo -e "${YELLOW}Do you want to proceed with the deployment? (y/N):${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo ""
        apply_deployment
        echo ""
        upload_images
        echo ""
        show_outputs
    else
        print_warning "Deployment cancelled."
        cleanup
        exit 0
    fi
    
    cleanup
}

# Handle script interruption
trap cleanup EXIT

# Run main function
main


