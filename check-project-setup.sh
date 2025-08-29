



#!/bin/bash

# Project Setup Verification Script
echo "🔍 Find Your Tennis Coach - Project Setup Check"
echo "=============================================="

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
print_status "Checking current directory and project files..."

# Show current directory
echo "Current directory: $(pwd)"
echo ""

# Check for Terraform files
print_status "Checking for Terraform configuration files..."

terraform_files_found=0

if [ -f "main.tf" ]; then
    print_success "✅ main.tf found"
    terraform_files_found=$((terraform_files_found + 1))
else
    print_error "❌ main.tf missing"
fi

if [ -f "lambda_functions.tf" ]; then
    print_success "✅ lambda_functions.tf found"
    terraform_files_found=$((terraform_files_found + 1))
else
    print_error "❌ lambda_functions.tf missing"
fi

if [ -f "terraform.tfvars" ]; then
    print_success "✅ terraform.tfvars found"
    terraform_files_found=$((terraform_files_found + 1))
else
    print_error "❌ terraform.tfvars missing"
fi

if [ -f "variables.tf" ]; then
    print_success "✅ variables.tf found"
    terraform_files_found=$((terraform_files_found + 1))
else
    print_warning "⚠️  variables.tf missing (optional)"
fi

echo ""
print_status "Checking for application code..."

# Check for frontend directory
if [ -d "frontend" ]; then
    print_success "✅ frontend/ directory found"
    if [ -f "frontend/index.js" ]; then
        print_success "  ✅ frontend/index.js found"
    else
        print_error "  ❌ frontend/index.js missing"
    fi
else
    print_error "❌ frontend/ directory missing"
fi

# Check for backend directory
if [ -d "backend" ]; then
    print_success "✅ backend/ directory found"
    if [ -f "backend/index.js" ]; then
        print_success "  ✅ backend/index.js found"
    else
        print_error "  ❌ backend/index.js missing"
    fi
    if [ -f "backend/package.json" ]; then
        print_success "  ✅ backend/package.json found"
    else
        print_error "  ❌ backend/package.json missing"
    fi
else
    print_error "❌ backend/ directory missing"
fi

# Check for images directory
if [ -d "images" ]; then
    print_success "✅ images/ directory found"
    image_count=$(find images -name "*.svg" | wc -l)
    print_success "  ✅ Found $image_count SVG images"
else
    print_warning "⚠️  images/ directory missing (optional)"
fi

echo ""
print_status "Checking for deployment scripts..."

if [ -f "deploy.sh" ]; then
    print_success "✅ deploy.sh found"
    if [ -x "deploy.sh" ]; then
        print_success "  ✅ deploy.sh is executable"
    else
        print_warning "  ⚠️  deploy.sh is not executable (run: chmod +x deploy.sh)"
    fi
else
    print_error "❌ deploy.sh missing"
fi

if [ -f "destroy.sh" ]; then
    print_success "✅ destroy.sh found"
else
    print_warning "⚠️  destroy.sh missing (optional)"
fi

echo ""
print_status "Checking for Lambda packages..."

if [ -f "frontend.zip" ]; then
    print_success "✅ frontend.zip found"
else
    print_warning "⚠️  frontend.zip missing (will be created during deployment)"
fi

if [ -f "backend.zip" ]; then
    print_success "✅ backend.zip found"
else
    print_warning "⚠️  backend.zip missing (will be created during deployment)"
fi

echo ""
print_status "Checking Git repository status..."

if [ -d ".git" ]; then
    print_success "✅ Git repository initialized"
    
    # Check current branch
    current_branch=$(git branch --show-current 2>/dev/null)
    if [ -n "$current_branch" ]; then
        print_success "  ✅ Current branch: $current_branch"
    fi
    
    # Check remote
    remote_url=$(git remote get-url origin 2>/dev/null)
    if [ -n "$remote_url" ]; then
        print_success "  ✅ Remote repository: $remote_url"
    fi
else
    print_warning "⚠️  Not a Git repository"
fi

echo ""
print_status "Summary and Recommendations:"

if [ $terraform_files_found -ge 2 ]; then
    print_success "✅ Essential Terraform files are present"
    echo ""
    echo "🚀 You can proceed with deployment:"
    echo "   1. Make sure you're in the project directory"
    echo "   2. Run: ./deploy.sh"
    echo "   3. Or manually: terraform init && terraform plan && terraform apply"
else
    print_error "❌ Missing essential Terraform files"
    echo ""
    echo "🔧 Solutions:"
    echo "   1. Make sure you're in the correct project directory"
    echo "   2. Clone the repository: git clone https://github.com/srinivasareddy76/find-your-tennis-coach.git"
    echo "   3. Navigate to the project: cd find-your-tennis-coach"
    echo "   4. Pull latest changes: git pull origin main"
fi

echo ""
echo "📁 Current directory contents:"
ls -la

echo ""
echo "💡 If files are missing, try:"
echo "   git clone https://github.com/srinivasareddy76/find-your-tennis-coach.git"
echo "   cd find-your-tennis-coach"
echo "   git pull origin main"



