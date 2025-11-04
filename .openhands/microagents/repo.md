# Find Your Tennis Coach - Repository Overview

## Project Description

Find Your Tennis Coach is a complete serverless web application that connects tennis players with certified coaches. Built using AWS services and Terraform Infrastructure as Code, this platform provides a modern, responsive interface for discovering and contacting tennis coaches based on location and specialty.

The application features a full-stack serverless architecture with AWS Lambda functions serving both the frontend website and backend REST API, DynamoDB for data storage, S3 for static assets, and API Gateway for routing. The platform comes pre-loaded with sample coach profiles and includes comprehensive search and filtering capabilities.

## File Structure Overview

```
find-your-tennis-coach/
├── Infrastructure & Configuration
│   ├── main.tf                 # Core AWS infrastructure (DynamoDB, S3, IAM)
│   ├── lambda_functions.tf     # Lambda functions & API Gateway setup
│   └── terraform.tfvars        # Configuration variables
├── Application Code
│   ├── frontend/
│   │   └── index.js           # Frontend Lambda (HTML/CSS/JS website)
│   └── backend/
│       ├── index.js           # Backend API Lambda (CRUD operations)
│       └── package.json       # Node.js dependencies
├── Static Assets
│   └── images/                # Professional tennis graphics and icons
├── Testing
│   └── tests/                 # Comprehensive Playwright test suite
│       ├── e2e/              # End-to-end tests (API, frontend, integration)
│       ├── package.json      # Test dependencies
│       └── run-tests.sh      # Test execution script
├── Deployment Scripts
│   ├── deploy.sh             # Automated deployment script
│   ├── destroy.sh            # Cleanup script
│   └── setup-everything.sh   # Complete setup automation
└── Documentation
    ├── README.md             # Detailed project documentation
    ├── PROJECT_OVERVIEW.md   # Architecture and features overview
    ├── DEPLOYMENT_GUIDE.md   # Step-by-step deployment instructions
    └── TEST_SUITE_OVERVIEW.md # Testing documentation
```

## Running Tests

The project includes a comprehensive test suite built with Playwright and TypeScript:

```bash
# Navigate to tests directory
cd tests/

# Install test dependencies
npm install

# Run all tests
./run-tests.sh

# Run tests with video recording
./run-tests-with-videos.sh

# View test results
./view-test-videos.sh
```

The test suite covers API endpoints, frontend UI, integration workflows, accessibility compliance, and performance benchmarks.

## Deployment Commands

### Quick Deployment (Recommended)
```bash
# Automated deployment with all checks
./deploy.sh
```

### Manual Deployment
```bash
# Initialize Terraform
terraform init

# Plan deployment
terraform plan -var-file="terraform.tfvars"

# Apply infrastructure
terraform apply -var-file="terraform.tfvars"
```

### Cleanup
```bash
# Destroy all AWS resources
./destroy.sh
```

## Developer Getting Started

1. **Prerequisites**: Ensure you have AWS CLI configured, Terraform installed, and appropriate AWS permissions
2. **Clone & Deploy**: Run `./deploy.sh` for automated setup
3. **Test**: Navigate to `tests/` directory and run `./run-tests.sh` to verify deployment
4. **Develop**: Modify `frontend/index.js` for UI changes or `backend/index.js` for API changes
5. **Monitor**: Check CloudWatch logs for debugging and monitoring

The application provides a REST API with full CRUD operations for coach management and a responsive web interface with search functionality. All infrastructure is defined as code using Terraform, making it easy to deploy, modify, and maintain.
