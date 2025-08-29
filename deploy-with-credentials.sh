#!/bin/bash

# Find Your Tennis Coach - Deployment Script with Custom Credentials
# This script allows you to deploy using your own AWS credentials

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
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

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Welcome message
print_header "🎾 Find Your Tennis Coach - AWS Deployment"
echo ""
echo "This script will deploy your tennis coach platform to AWS."
echo "You'll need AWS credentials with administrator access."
echo ""

# Check if credentials are provided as environment variables
if [[ -n "$AWS_ACCESS_KEY_ID" && -n "$AWS_SECRET_ACCESS_KEY" ]]; then
    print_success "AWS credentials found in environment variables"
else
    print_info "Please provide your AWS credentials:"
    echo ""
    read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
    read -s -p "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
    echo ""
    read -p "AWS Region (default: us-east-1): " AWS_REGION
    AWS_REGION=${AWS_REGION:-us-east-1}
    
    # Export credentials
    export AWS_ACCESS_KEY_ID
    export AWS_SECRET_ACCESS_KEY
    export AWS_DEFAULT_REGION=$AWS_REGION
fi

echo ""
print_info "Verifying AWS credentials..."

# Test AWS credentials
if aws sts get-caller-identity --no-cli-pager > /dev/null 2>&1; then
    print_success "AWS credentials verified successfully"
    aws sts get-caller-identity --no-cli-pager
else
    print_error "Failed to verify AWS credentials"
    exit 1
fi

echo ""
print_header "Step 1: Prepare Lambda Packages"

# Create Lambda packages
print_info "Creating Lambda function packages..."
zip -r frontend.zip frontend/ > /dev/null 2>&1
zip -r backend.zip backend/ > /dev/null 2>&1
print_success "Lambda packages created"

echo ""
print_header "Step 2: Initialize Terraform"

# Initialize Terraform with simplified configuration
print_info "Initializing Terraform..."
terraform init -reconfigure > /dev/null 2>&1
print_success "Terraform initialized"

echo ""
print_header "Step 3: Plan Deployment"

print_info "Planning deployment..."
if terraform plan -var="aws_region=$AWS_DEFAULT_REGION" -input=false -out=tfplan > /dev/null 2>&1; then
    print_success "Deployment plan created successfully"
else
    print_error "Failed to create deployment plan"
    terraform plan -var="aws_region=$AWS_DEFAULT_REGION" -input=false
    exit 1
fi

echo ""
print_header "Step 4: Deploy Infrastructure"

print_info "Deploying infrastructure to AWS..."
echo "This may take a few minutes..."

if terraform apply tfplan; then
    print_success "Infrastructure deployed successfully!"
else
    print_error "Deployment failed"
    exit 1
fi

echo ""
print_header "Step 5: Get Deployment Information"

# Get outputs
API_URL=$(terraform output -raw api_gateway_url 2>/dev/null || echo "Not available")
DYNAMODB_TABLE=$(terraform output -raw dynamodb_table_name 2>/dev/null || echo "Not available")
FRONTEND_LAMBDA=$(terraform output -raw frontend_lambda_function_name 2>/dev/null || echo "Not available")
BACKEND_LAMBDA=$(terraform output -raw backend_lambda_function_name 2>/dev/null || echo "Not available")

echo ""
print_success "🎉 Deployment Complete!"
echo ""
echo -e "${GREEN}🌐 API Gateway URL:${NC} $API_URL"
echo -e "${GREEN}🗄️  DynamoDB Table:${NC} $DYNAMODB_TABLE"
echo -e "${GREEN}⚡ Frontend Lambda:${NC} $FRONTEND_LAMBDA"
echo -e "${GREEN}⚡ Backend Lambda:${NC} $BACKEND_LAMBDA"
echo ""

print_header "Step 6: Update Test Configuration"

# Update test configuration
if [[ "$API_URL" != "Not available" ]]; then
    print_info "Updating test configuration..."
    
    # Update .env file in tests directory
    if [[ -f "tests/.env" ]]; then
        sed -i.bak "s|BASE_URL=.*|BASE_URL=$API_URL|g" tests/.env
        print_success "Test configuration updated"
        echo ""
        echo "Updated tests/.env with:"
        echo "BASE_URL=$API_URL"
    else
        print_warning "tests/.env file not found"
    fi
fi

echo ""
print_header "🎯 Next Steps"
echo ""
echo "1. Test your API:"
echo "   curl $API_URL"
echo ""
echo "2. Run the test suite:"
echo "   cd tests && npx playwright test"
echo ""
echo "3. View your platform:"
echo "   Open: $API_URL"
echo ""
print_success "Your Find Your Tennis Coach platform is now live! 🎾"

# Cleanup
rm -f tfplan

