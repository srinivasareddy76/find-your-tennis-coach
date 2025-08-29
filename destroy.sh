


#!/bin/bash

# Find Your Tennis Coach - Cleanup Script
set -e

echo "🎾 Find Your Tennis Coach - Cleanup Script"
echo "=========================================="

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

# Check if Terraform is initialized
check_terraform() {
    if [ ! -d ".terraform" ]; then
        print_error "Terraform not initialized. Nothing to destroy."
        exit 1
    fi
}

# Show what will be destroyed
show_plan() {
    print_status "Showing resources that will be destroyed..."
    terraform plan -destroy -var-file="terraform.tfvars"
}

# Destroy infrastructure
destroy_infrastructure() {
    print_status "Destroying infrastructure..."
    terraform destroy -var-file="terraform.tfvars" -auto-approve
    print_success "Infrastructure destroyed!"
}

# Clean up local files
cleanup_files() {
    print_status "Cleaning up local files..."
    
    # Remove Terraform files
    rm -rf .terraform
    rm -f .terraform.lock.hcl
    rm -f terraform.tfstate*
    rm -f tfplan
    
    # Remove Lambda packages
    rm -f frontend.zip
    rm -f backend.zip
    
    print_success "Local files cleaned up!"
}

# Main cleanup process
main() {
    echo ""
    check_terraform
    echo ""
    
    print_warning "This will destroy ALL resources created by Terraform!"
    print_warning "This action cannot be undone!"
    echo ""
    
    show_plan
    echo ""
    
    echo -e "${RED}Are you sure you want to destroy all resources? (y/N):${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo ""
        destroy_infrastructure
        echo ""
        cleanup_files
        echo ""
        print_success "All resources have been destroyed and cleaned up!"
        echo ""
        echo "💡 To redeploy, run: ./deploy.sh"
    else
        print_warning "Destruction cancelled."
        exit 0
    fi
}

# Run main function
main


