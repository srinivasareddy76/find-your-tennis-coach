




#!/bin/bash

# Find Your Tennis Coach - Interactive Setup Script
# This script will guide you through the complete setup process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Welcome message
print_header "🎾 Find Your Tennis Coach - Complete Setup"
echo ""
echo "This script will help you:"
echo "1. Configure AWS credentials"
echo "2. Deploy your tennis coach platform"
echo "3. Set up the comprehensive test suite"
echo "4. Run your first tests"
echo ""

# Check if user wants to continue
read -p "Ready to start? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled. Run this script again when you're ready!"
    exit 0
fi

echo ""
print_header "Step 1: AWS Credentials Setup"

# Check if AWS is configured
if aws sts get-caller-identity &>/dev/null; then
    print_success "AWS credentials are already configured!"
    aws sts get-caller-identity
    echo ""
    read -p "Do you want to reconfigure AWS credentials? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Reconfiguring AWS credentials..."
        aws configure
    fi
else
    print_warning "AWS credentials not found. Let's set them up!"
    echo ""
    echo "You'll need:"
    echo "- AWS Access Key ID (starts with AKIA...)"
    echo "- AWS Secret Access Key"
    echo "- AWS Region (recommend: us-east-1)"
    echo ""
    echo "Get these from: AWS Console → IAM → Users → Your User → Security Credentials"
    echo ""
    read -p "Press Enter when you have your credentials ready..."
    echo ""
    
    aws configure
    
    # Verify configuration
    if aws sts get-caller-identity &>/dev/null; then
        print_success "AWS credentials configured successfully!"
        aws sts get-caller-identity
    else
        print_error "AWS configuration failed. Please check your credentials."
        exit 1
    fi
fi

echo ""
print_header "Step 2: Deploy Tennis Coach Platform"

print_step "Deploying your serverless tennis coach platform..."
echo ""

if ./deploy.sh; then
    print_success "Platform deployed successfully!"
else
    print_error "Deployment failed. Check the error messages above."
    echo ""
    print_info "You can run './troubleshoot-deployment.sh' for help"
    exit 1
fi

echo ""
print_header "Step 3: Get Your Website URL"

print_step "Retrieving your website URL..."

if ./get-website-url.sh; then
    # Get the URL from terraform output
    WEBSITE_URL=$(terraform output -raw api_gateway_invoke_url 2>/dev/null || echo "")
    
    if [ -n "$WEBSITE_URL" ]; then
        print_success "Your website is available at:"
        echo -e "${GREEN}$WEBSITE_URL${NC}"
        echo ""
        
        # Test the URL
        print_step "Testing website accessibility..."
        if curl -s -I "$WEBSITE_URL" | grep -q "200 OK"; then
            print_success "Website is accessible and responding!"
        else
            print_warning "Website deployed but may still be starting up..."
            print_info "Try accessing it in a few minutes: $WEBSITE_URL"
        fi
    else
        print_error "Could not retrieve website URL"
        exit 1
    fi
else
    print_error "Failed to get website URL"
    exit 1
fi

echo ""
print_header "Step 4: Configure Test Suite"

print_step "Setting up comprehensive test suite..."

# Navigate to tests directory
cd tests

# Copy environment file
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_success "Created test environment configuration"
else
    print_info "Test environment file already exists"
fi

# Update .env with the website URL
if [ -n "$WEBSITE_URL" ]; then
    sed -i "s|BASE_URL=.*|BASE_URL=$WEBSITE_URL|" .env
    print_success "Updated test configuration with your website URL"
else
    print_warning "Please manually update tests/.env with your website URL"
fi

# Install test dependencies
print_step "Installing test dependencies..."

if command -v npm &> /dev/null; then
    npm install
    print_success "Test dependencies installed"
    
    print_step "Installing Playwright browsers..."
    npx playwright install
    print_success "Playwright browsers installed"
else
    print_warning "Node.js/npm not found. You'll need to install test dependencies manually:"
    echo "  cd tests"
    echo "  npm install"
    echo "  npx playwright install"
fi

echo ""
print_header "Step 5: Run Your First Test"

print_step "Running a quick API test to verify everything works..."

if command -v npm &> /dev/null; then
    if npx playwright test e2e/api.spec.ts --grep "should return list of coaches" --reporter=line; then
        print_success "Test passed! Your platform is working correctly!"
    else
        print_warning "Test failed, but this might be expected if coaches are still loading"
        print_info "Try running the full test suite in a few minutes"
    fi
else
    print_info "Skipping test run - install Node.js to run tests"
fi

echo ""
print_header "🎉 Setup Complete!"

echo ""
print_success "Your Find Your Tennis Coach platform is ready!"
echo ""
echo "📍 Website URL: ${GREEN}$WEBSITE_URL${NC}"
echo ""
echo "🎯 What you can do now:"
echo "  • Visit your website in a browser"
echo "  • Search for tennis coaches by location"
echo "  • Test the responsive design on mobile"
echo "  • Run comprehensive tests: cd tests && ./run-tests.sh"
echo ""
echo "📊 Test Suite Commands:"
echo "  • All tests:        cd tests && ./run-tests.sh"
echo "  • API tests only:   cd tests && ./run-tests.sh --api"
echo "  • Frontend tests:   cd tests && ./run-tests.sh --frontend"
echo "  • Debug mode:       cd tests && ./run-tests.sh --debug --headed"
echo ""
echo "📚 Documentation:"
echo "  • Setup Guide:      STEP_BY_STEP_SETUP.md"
echo "  • Test Suite:       TEST_SUITE_OVERVIEW.md"
echo "  • Deployment:       DEPLOYMENT_GUIDE.md"
echo "  • Troubleshooting:  ./troubleshoot-deployment.sh"
echo ""
print_success "Happy coaching! 🎾"




