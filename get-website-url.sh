


#!/bin/bash

# Get Website URL Script
echo "🎾 Find Your Tennis Coach - Website URL Retrieval"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[NOTE]${NC} $1"
}

echo ""
print_status "Retrieving deployment information..."

# Check if terraform state exists
if [ ! -f "terraform.tfstate" ]; then
    echo "❌ Terraform state file not found. Make sure you're in the project directory and deployment was successful."
    exit 1
fi

echo ""
print_success "🌐 Your Tennis Coach Website URLs:"
echo ""

# Get API Gateway URL (this serves the website)
API_URL=$(terraform output -raw api_gateway_invoke_url 2>/dev/null)
if [ -n "$API_URL" ] && [ "$API_URL" != "null" ]; then
    echo -e "${GREEN}🏠 Main Website URL:${NC}"
    echo "   $API_URL"
    echo ""
    echo -e "${GREEN}📱 Direct Link (click to open):${NC}"
    echo "   $API_URL"
    echo ""
else
    print_warning "Could not retrieve API Gateway URL from Terraform output"
fi

# Get API endpoints
echo -e "${GREEN}🔗 API Endpoints:${NC}"
if [ -n "$API_URL" ]; then
    echo "   📋 List all coaches: $API_URL/coaches"
    echo "   👨‍🏫 Get specific coach: $API_URL/coaches/{id}"
    echo "   ➕ Create new coach: POST $API_URL/coaches"
    echo "   ✏️  Update coach: PUT $API_URL/coaches/{id}"
    echo "   🗑️  Delete coach: DELETE $API_URL/coaches/{id}"
else
    echo "   ❌ API URL not available"
fi

echo ""

# Get S3 bucket info
S3_BUCKET=$(terraform output -raw s3_bucket_name 2>/dev/null)
if [ -n "$S3_BUCKET" ] && [ "$S3_BUCKET" != "null" ]; then
    echo -e "${GREEN}🪣 S3 Bucket for Images:${NC}"
    echo "   Bucket Name: $S3_BUCKET"
    
    S3_WEBSITE=$(terraform output -raw s3_website_url 2>/dev/null)
    if [ -n "$S3_WEBSITE" ] && [ "$S3_WEBSITE" != "null" ]; then
        echo "   S3 Website URL: http://$S3_WEBSITE"
    fi
fi

echo ""

# Get DynamoDB table
DYNAMODB_TABLE=$(terraform output -raw dynamodb_table_name 2>/dev/null)
if [ -n "$DYNAMODB_TABLE" ] && [ "$DYNAMODB_TABLE" != "null" ]; then
    echo -e "${GREEN}🗄️  Database:${NC}"
    echo "   DynamoDB Table: $DYNAMODB_TABLE"
fi

echo ""

# Get Lambda function names
FRONTEND_LAMBDA=$(terraform output -raw frontend_lambda_function_name 2>/dev/null)
BACKEND_LAMBDA=$(terraform output -raw backend_lambda_function_name 2>/dev/null)

if [ -n "$FRONTEND_LAMBDA" ] || [ -n "$BACKEND_LAMBDA" ]; then
    echo -e "${GREEN}⚡ Lambda Functions:${NC}"
    [ -n "$FRONTEND_LAMBDA" ] && echo "   Frontend: $FRONTEND_LAMBDA"
    [ -n "$BACKEND_LAMBDA" ] && echo "   Backend: $BACKEND_LAMBDA"
fi

echo ""
echo "🎉 Your tennis coach platform is live and ready!"
echo ""
echo "📋 What you can do now:"
echo "1. 🌐 Visit the main website URL above to see your platform"
echo "2. 🔍 Search for coaches by location and specialty"
echo "3. 👀 Browse the 6 pre-loaded professional coach profiles"
echo "4. 🛠️  Use the API endpoints to add more coaches"
echo "5. 📊 Monitor usage in AWS CloudWatch console"
echo ""
echo "💡 Tips:"
echo "- The website is mobile-responsive and works on all devices"
echo "- Sample coaches are from major US cities (NY, LA, Chicago, Miami, Seattle, Phoenix)"
echo "- You can add your own coaches using the POST API endpoint"
echo "- All data is stored in DynamoDB and automatically backed up"
echo ""

# Test if the website is accessible
if [ -n "$API_URL" ]; then
    print_status "Testing website accessibility..."
    
    # Test with curl (suppress output, just check if accessible)
    if curl -s --max-time 10 "$API_URL" > /dev/null 2>&1; then
        print_success "✅ Website is accessible and responding!"
    else
        print_warning "⚠️  Website might still be initializing. Try again in 1-2 minutes."
    fi
fi

echo ""


