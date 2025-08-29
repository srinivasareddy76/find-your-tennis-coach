


#!/bin/bash

# AWS Credentials Troubleshooting Script
echo "🔍 AWS Credentials Troubleshooting Script"
echo "========================================"

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
print_status "Checking AWS CLI installation..."
if command -v aws &> /dev/null; then
    aws_version=$(aws --version 2>&1)
    print_success "AWS CLI is installed: $aws_version"
else
    print_error "AWS CLI is not installed!"
    echo "Please install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

echo ""
print_status "Checking AWS configuration files..."

# Check AWS config directory
if [ -d "$HOME/.aws" ]; then
    print_success "AWS config directory exists: $HOME/.aws"
    
    # Check credentials file
    if [ -f "$HOME/.aws/credentials" ]; then
        print_success "AWS credentials file exists"
        echo "  Profiles found:"
        grep '^\[' "$HOME/.aws/credentials" | sed 's/\[/  - /' | sed 's/\]//'
    else
        print_warning "AWS credentials file not found"
    fi
    
    # Check config file
    if [ -f "$HOME/.aws/config" ]; then
        print_success "AWS config file exists"
    else
        print_warning "AWS config file not found"
    fi
else
    print_warning "AWS config directory not found: $HOME/.aws"
fi

echo ""
print_status "Checking environment variables..."

# Check AWS environment variables
if [ -n "$AWS_ACCESS_KEY_ID" ]; then
    print_success "AWS_ACCESS_KEY_ID is set"
else
    print_warning "AWS_ACCESS_KEY_ID is not set"
fi

if [ -n "$AWS_SECRET_ACCESS_KEY" ]; then
    print_success "AWS_SECRET_ACCESS_KEY is set"
else
    print_warning "AWS_SECRET_ACCESS_KEY is not set"
fi

if [ -n "$AWS_SESSION_TOKEN" ]; then
    print_success "AWS_SESSION_TOKEN is set (temporary credentials)"
else
    print_status "AWS_SESSION_TOKEN is not set (using long-term credentials)"
fi

if [ -n "$AWS_PROFILE" ]; then
    print_success "AWS_PROFILE is set to: $AWS_PROFILE"
else
    print_status "AWS_PROFILE is not set (using default profile)"
fi

if [ -n "$AWS_DEFAULT_REGION" ]; then
    print_success "AWS_DEFAULT_REGION is set to: $AWS_DEFAULT_REGION"
else
    print_warning "AWS_DEFAULT_REGION is not set"
fi

echo ""
print_status "Testing AWS credentials..."

# Test AWS credentials
aws_output=$(aws sts get-caller-identity 2>&1)
aws_exit_code=$?

if [ $aws_exit_code -eq 0 ]; then
    print_success "AWS credentials are working!"
    echo ""
    echo "Account Details:"
    echo "$aws_output" | jq . 2>/dev/null || echo "$aws_output"
else
    print_error "AWS credentials test failed!"
    echo ""
    echo "Error details:"
    echo "$aws_output"
    echo ""
    
    # Provide specific troubleshooting based on error
    if echo "$aws_output" | grep -q "Unable to locate credentials"; then
        print_error "No credentials found!"
        echo ""
        echo "Solutions:"
        echo "1. Run 'aws configure' to set up credentials"
        echo "2. Set environment variables:"
        echo "   export AWS_ACCESS_KEY_ID=your_access_key"
        echo "   export AWS_SECRET_ACCESS_KEY=your_secret_key"
        echo "3. Use AWS SSO: 'aws sso login'"
    elif echo "$aws_output" | grep -q "The security token included in the request is invalid"; then
        print_error "Invalid or expired session token!"
        echo ""
        echo "Solutions:"
        echo "1. If using AWS SSO: run 'aws sso login'"
        echo "2. If using temporary credentials: refresh your session"
        echo "3. Check if your credentials have expired"
    elif echo "$aws_output" | grep -q "The AWS Access Key Id you provided does not exist"; then
        print_error "Invalid Access Key ID!"
        echo ""
        echo "Solutions:"
        echo "1. Verify your Access Key ID is correct"
        echo "2. Run 'aws configure' to update credentials"
    elif echo "$aws_output" | grep -q "SignatureDoesNotMatch"; then
        print_error "Invalid Secret Access Key!"
        echo ""
        echo "Solutions:"
        echo "1. Verify your Secret Access Key is correct"
        echo "2. Run 'aws configure' to update credentials"
    else
        print_error "Unknown error occurred"
        echo ""
        echo "General solutions:"
        echo "1. Run 'aws configure' to reconfigure credentials"
        echo "2. Check your internet connection"
        echo "3. Verify your AWS account is active"
    fi
fi

echo ""
print_status "Checking required AWS permissions..."

# Test basic permissions needed for Terraform
echo "Testing permissions for Terraform deployment..."

# Test Lambda permissions
print_status "Testing Lambda permissions..."
lambda_test=$(aws lambda list-functions --max-items 1 2>&1)
if echo "$lambda_test" | grep -q "AccessDenied\|UnauthorizedOperation"; then
    print_warning "Limited Lambda permissions detected"
else
    print_success "Lambda permissions OK"
fi

# Test API Gateway permissions
print_status "Testing API Gateway permissions..."
apigw_test=$(aws apigateway get-rest-apis --limit 1 2>&1)
if echo "$apigw_test" | grep -q "AccessDenied\|UnauthorizedOperation"; then
    print_warning "Limited API Gateway permissions detected"
else
    print_success "API Gateway permissions OK"
fi

# Test DynamoDB permissions
print_status "Testing DynamoDB permissions..."
dynamo_test=$(aws dynamodb list-tables 2>&1)
if echo "$dynamo_test" | grep -q "AccessDenied\|UnauthorizedOperation"; then
    print_warning "Limited DynamoDB permissions detected"
else
    print_success "DynamoDB permissions OK"
fi

# Test S3 permissions
print_status "Testing S3 permissions..."
s3_test=$(aws s3 ls 2>&1)
if echo "$s3_test" | grep -q "AccessDenied\|UnauthorizedOperation"; then
    print_warning "Limited S3 permissions detected"
else
    print_success "S3 permissions OK"
fi

echo ""
if [ $aws_exit_code -eq 0 ]; then
    print_success "✅ AWS credentials are properly configured!"
    echo ""
    echo "You can now run the deployment script:"
    echo "  ./deploy.sh"
else
    print_error "❌ AWS credentials need to be fixed before deployment"
    echo ""
    echo "Please resolve the credential issues above and try again."
fi

echo ""
echo "For more help, visit:"
echo "- AWS CLI Configuration: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html"
echo "- AWS Credentials: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html"


