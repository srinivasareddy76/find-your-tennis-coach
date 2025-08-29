
#!/bin/bash

# Update Test BASE_URL with API Gateway URL
# Usage: ./update-test-url.sh [API_GATEWAY_URL]

set -e

# Function to get API Gateway URL from Terraform
get_api_url_from_terraform() {
    if [ -f "terraform.tfstate" ] || [ -d ".terraform" ]; then
        echo "🔍 Getting API Gateway URL from Terraform..."
        API_URL=$(terraform output -raw api_gateway_url 2>/dev/null || terraform output -raw api_gateway_invoke_url 2>/dev/null || echo "")
        if [ -n "$API_URL" ]; then
            echo "✅ Found API Gateway URL from Terraform: $API_URL"
            return 0
        fi
    fi
    return 1
}

# Check if URL was provided as argument
if [ $# -eq 1 ]; then
    API_URL="$1"
    echo "📍 Using provided API Gateway URL: $API_URL"
elif get_api_url_from_terraform; then
    # URL was set by the function
    :
else
    echo "❌ No API Gateway URL provided and none found in Terraform state."
    echo ""
    echo "Usage:"
    echo "  $0 https://your-api-id.execute-api.us-east-1.amazonaws.com/prod"
    echo ""
    echo "Or deploy first with:"
    echo "  ./deploy-and-update-tests.sh"
    exit 1
fi

# Validate URL format
if [[ ! $API_URL =~ ^https://.*\.execute-api\..*\.amazonaws\.com/prod$ ]]; then
    echo "⚠️  Warning: URL doesn't match expected API Gateway format"
    echo "   Expected: https://api-id.execute-api.region.amazonaws.com/prod"
    echo "   Got: $API_URL"
    echo ""
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Update cancelled."
        exit 1
    fi
fi

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
# Updated: $(date)

# Base URL of your deployed Tennis Coach platform
# This is the API Gateway URL from your Terraform deployment
BASE_URL=$API_URL

# Test Configuration
TEST_TIMEOUT=60000
TEST_RETRIES=2

# Test Environment
NODE_ENV=production
EOF

echo "✅ Updated tests/.env with API Gateway URL"
echo ""

# Test connectivity
echo "🧪 Testing connectivity to: $API_URL"
if curl -s --max-time 10 "$API_URL" > /dev/null 2>&1; then
    echo "✅ Platform is responding"
else
    echo "⚠️  Platform not responding (may still be starting up)"
fi

echo ""
echo "🎉 Test configuration updated successfully!"
echo ""
echo "📊 Configuration:"
echo "  • BASE_URL: $API_URL"
echo "  • Config file: tests/.env"
echo ""
echo "🧪 Run tests with:"
echo "  cd tests"
echo "  npx playwright test --project=chromium --project=firefox --project=webkit"

