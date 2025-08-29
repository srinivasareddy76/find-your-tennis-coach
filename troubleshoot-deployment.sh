



#!/bin/bash

# Deployment Troubleshooting Script
echo "🔍 Find Your Tennis Coach - Deployment Troubleshooting"
echo "====================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

echo ""
print_status "Checking Terraform state and deployment status..."

# Check if terraform is initialized
if [ ! -d ".terraform" ]; then
    print_error "Terraform not initialized!"
    echo ""
    echo "Solutions:"
    echo "1. Run: terraform init"
    echo "2. Then run: terraform plan"
    echo "3. Finally run: terraform apply"
    exit 1
else
    print_success "Terraform is initialized"
fi

# Check if state file exists
if [ ! -f "terraform.tfstate" ]; then
    print_error "No Terraform state file found!"
    echo ""
    echo "This means the deployment hasn't been applied yet."
    echo ""
    echo "Solutions:"
    echo "1. Run: terraform plan -var-file='terraform.tfvars'"
    echo "2. Then run: terraform apply -var-file='terraform.tfvars'"
    echo "3. Or use the deployment script: ./deploy.sh"
    exit 1
else
    print_success "Terraform state file exists"
fi

# Check state file content
echo ""
print_status "Analyzing Terraform state..."

# Get basic state info
state_resources=$(terraform state list 2>/dev/null | wc -l)
if [ "$state_resources" -eq 0 ]; then
    print_error "Terraform state is empty - no resources deployed!"
    echo ""
    echo "This means the 'terraform apply' command wasn't successful."
    echo ""
    echo "Solutions:"
    echo "1. Check for any error messages from the previous deployment"
    echo "2. Run: terraform plan -var-file='terraform.tfvars' to see what needs to be created"
    echo "3. Run: terraform apply -var-file='terraform.tfvars' to deploy"
    echo "4. Or use: ./deploy.sh for automated deployment"
    exit 1
else
    print_success "Found $state_resources resources in Terraform state"
fi

# List resources
echo ""
print_status "Deployed resources:"
terraform state list | sed 's/^/  - /'

# Check specific critical resources
echo ""
print_status "Checking critical resources..."

# Check API Gateway
if terraform state list | grep -q "aws_api_gateway_rest_api"; then
    print_success "✅ API Gateway REST API created"
else
    print_error "❌ API Gateway REST API missing"
fi

if terraform state list | grep -q "aws_api_gateway_deployment"; then
    print_success "✅ API Gateway deployment created"
else
    print_error "❌ API Gateway deployment missing"
fi

# Check Lambda functions
if terraform state list | grep -q "aws_lambda_function.frontend"; then
    print_success "✅ Frontend Lambda function created"
else
    print_error "❌ Frontend Lambda function missing"
fi

if terraform state list | grep -q "aws_lambda_function.backend"; then
    print_success "✅ Backend Lambda function created"
else
    print_error "❌ Backend Lambda function missing"
fi

# Check DynamoDB
if terraform state list | grep -q "aws_dynamodb_table"; then
    print_success "✅ DynamoDB table created"
else
    print_error "❌ DynamoDB table missing"
fi

# Check S3
if terraform state list | grep -q "aws_s3_bucket"; then
    print_success "✅ S3 bucket created"
else
    print_error "❌ S3 bucket missing"
fi

echo ""
print_status "Attempting to retrieve outputs..."

# Try to get outputs with more verbose error handling
terraform_output=$(terraform output -json 2>&1)
terraform_exit_code=$?

if [ $terraform_exit_code -eq 0 ]; then
    print_success "Terraform outputs retrieved successfully!"
    echo ""
    echo "Raw outputs:"
    echo "$terraform_output" | jq . 2>/dev/null || echo "$terraform_output"
    
    # Try to extract specific values
    api_url=$(echo "$terraform_output" | jq -r '.api_gateway_invoke_url.value // empty' 2>/dev/null)
    if [ -n "$api_url" ] && [ "$api_url" != "null" ]; then
        echo ""
        print_success "🌐 Your website URL: $api_url"
    fi
else
    print_error "Failed to retrieve Terraform outputs"
    echo ""
    echo "Error details:"
    echo "$terraform_output"
fi

echo ""
print_status "Checking AWS resources directly..."

# Check if we can find the API Gateway directly
print_status "Looking for API Gateway..."
aws_apis=$(aws apigateway get-rest-apis --query 'items[?contains(name, `tennis-coach`) || contains(name, `find-your-tennis-coach`)].{Name:name,Id:id}' --output table 2>/dev/null)
if [ $? -eq 0 ] && [ -n "$aws_apis" ]; then
    echo "$aws_apis"
    
    # Try to get the API Gateway URL manually
    api_id=$(aws apigateway get-rest-apis --query 'items[?contains(name, `tennis-coach`) || contains(name, `find-your-tennis-coach`)].id' --output text 2>/dev/null | head -1)
    if [ -n "$api_id" ] && [ "$api_id" != "None" ]; then
        region=$(aws configure get region 2>/dev/null || echo "us-east-1")
        manual_url="https://${api_id}.execute-api.${region}.amazonaws.com/prod"
        echo ""
        print_success "🌐 Found your website URL: $manual_url"
        echo ""
        echo "Try opening this URL in your browser!"
    fi
else
    print_warning "Could not find API Gateway or AWS CLI access issue"
fi

echo ""
print_status "Recommended next steps:"

if [ "$state_resources" -eq 0 ]; then
    echo "1. 🚀 Run deployment: ./deploy.sh"
    echo "2. 📋 Or manually: terraform apply -var-file='terraform.tfvars'"
elif [ $terraform_exit_code -ne 0 ]; then
    echo "1. 🔄 Refresh Terraform state: terraform refresh -var-file='terraform.tfvars'"
    echo "2. 📋 Check outputs again: terraform output"
    echo "3. 🚀 Or redeploy: ./deploy.sh"
else
    echo "1. ✅ Deployment appears successful!"
    echo "2. 🌐 Use the website URL shown above"
    echo "3. 📱 Test the website functionality"
fi

echo ""
echo "💡 If you continue having issues:"
echo "- Check AWS CloudWatch logs for Lambda function errors"
echo "- Verify all AWS permissions are correct"
echo "- Try destroying and redeploying: ./destroy.sh then ./deploy.sh"



