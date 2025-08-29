#!/bin/bash

# Deploy Tennis Coach Platform and Update Test Configuration
# This script deploys the AWS infrastructure and updates the test BASE_URL

set -e

echo "🚀 Starting Tennis Coach Platform Deployment and Test Configuration..."
echo ""

# Check if AWS credentials are configured
echo "🔍 Checking AWS credentials..."
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS credentials not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS credentials verified"
echo ""

# Initialize Terraform if needed
if [ ! -d ".terraform" ]; then
    echo "🔧 Initializing Terraform..."
    terraform init
    echo ""
fi

# Create Lambda packages
echo "📦 Creating Lambda function packages..."
./deploy-with-credentials.sh --package-only
echo ""

# Plan the deployment
echo "📋 Planning Terraform deployment..."
terraform plan -out=tfplan
echo ""

# Ask for confirmation
read -p "🤔 Do you want to proceed with the deployment? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

# Apply the deployment
echo "🚀 Deploying infrastructure to AWS..."
terraform apply tfplan
echo ""

# Get the API Gateway URL
echo "🔍 Retrieving API Gateway URL..."
API_URL=$(terraform output -raw api_gateway_url)

if [ -z "$API_URL" ]; then
    echo "❌ Failed to retrieve API Gateway URL from Terraform output"
    exit 1
fi

echo "✅ API Gateway URL: $API_URL"
echo ""

# Update the test configuration
echo "🔧 Updating test configuration..."
cd tests

# Backup the current .env file
if [ -f ".env" ]; then
    cp .env .env.backup
    echo "📋 Backed up existing .env to .env.backup"
fi

# Update BASE_URL in .env file
cat > .env << EOF
# Environment Configuration for Tennis Coach Platform Tests
# Updated automatically after deployment

# Base URL of your deployed Tennis Coach platform
# This is the API Gateway URL from your Terraform deployment
BASE_URL=$API_URL

# Test Configuration
TEST_TIMEOUT=60000
TEST_RETRIES=2

# Test Environment
NODE_ENV=production
EOF

echo "✅ Updated tests/.env with production API URL"
echo ""

# Test the deployment
echo "🧪 Testing the deployed platform..."
echo "📍 Testing against: $API_URL"

# Run a quick connectivity test
if curl -s --max-time 30 "$API_URL" > /dev/null; then
    echo "✅ Platform is responding"
else
    echo "⚠️  Platform may still be starting up"
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Summary:"
echo "  • API Gateway URL: $API_URL"
echo "  • Test configuration updated: tests/.env"
echo "  • Ready to run tests: cd tests && npx playwright test"
echo ""
echo "🧪 To run frontend tests against your deployed platform:"
echo "  cd tests"
echo "  npx playwright test --project=chromium --project=firefox --project=webkit"
echo ""
echo "🌐 Your Tennis Coach platform is now live at: $API_URL"
