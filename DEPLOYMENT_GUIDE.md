


# 🚀 Find Your Tennis Coach - Deployment Guide

## Overview
This guide will help you deploy the complete "Find Your Tennis Coach" serverless website infrastructure on AWS using Terraform.

## 📋 Prerequisites

### Required Software
1. **AWS CLI** - [Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
2. **Terraform** - [Install Guide](https://learn.hashicorp.com/tutorials/terraform/install-cli)
3. **Node.js** (optional, for local development)

### AWS Account Setup
1. **AWS Account** with appropriate permissions
2. **AWS CLI configured** with access keys
3. **Permissions needed**:
   - Lambda (create, update, delete functions)
   - API Gateway (create, manage APIs)
   - DynamoDB (create, manage tables)
   - S3 (create, manage buckets)
   - IAM (create roles and policies)
   - CloudWatch (logging)

## 🎯 Quick Deployment (Recommended)

### Step 1: Verify Prerequisites
```bash
# Check AWS CLI
aws --version
aws sts get-caller-identity

# Check Terraform
terraform --version
```

### Step 2: Clone and Deploy
```bash
# Navigate to project directory
cd find-your-tennis-coach

# Run automated deployment
./deploy.sh
```

The script will:
- ✅ Check all prerequisites
- 📦 Create Lambda deployment packages
- 🏗️ Initialize Terraform
- 📋 Show deployment plan
- 🚀 Deploy infrastructure (with confirmation)
- 📤 Upload images to S3
- 📊 Display deployment information

### Step 3: Access Your Website
After deployment, you'll receive:
- **Website URL**: Your live tennis coach platform
- **API Gateway URL**: Backend API endpoints
- **S3 Bucket**: Static assets storage
- **DynamoDB Table**: Coach data storage

## 🔧 Manual Deployment

If you prefer manual control:

### Step 1: Prepare Lambda Packages
```bash
# Create frontend package
cd frontend
zip -r ../frontend.zip .
cd ..

# Create backend package
cd backend
npm install --production  # Optional: install dependencies
zip -r ../backend.zip .
cd ..
```

### Step 2: Initialize Terraform
```bash
terraform init
```

### Step 3: Plan Deployment
```bash
terraform plan -var-file="terraform.tfvars"
```

### Step 4: Apply Infrastructure
```bash
terraform apply -var-file="terraform.tfvars"
```

### Step 5: Upload Images (Optional)
```bash
# Get S3 bucket name from Terraform output
S3_BUCKET=$(terraform output -raw s3_bucket_name)

# Upload images
aws s3 sync images/ s3://$S3_BUCKET/images/ --acl public-read
```

## 🌐 Testing Your Deployment

### Frontend Testing
1. Visit the website URL provided in the deployment output
2. Verify the responsive design on different screen sizes
3. Test the search functionality
4. Check coach profile cards and interactions

### Backend API Testing
```bash
# Get API URL
API_URL=$(terraform output -raw api_gateway_invoke_url)

# Test GET all coaches
curl "$API_URL/coaches"

# Test GET specific coach
curl "$API_URL/coaches/1"

# Test POST new coach
curl -X POST "$API_URL/coaches" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Coach",
    "specialty": "Beginner",
    "location": "Test City",
    "email": "test@example.com",
    "hourly_rate": 75
  }'
```

## 📊 Monitoring Your Deployment

### CloudWatch Logs
- **Frontend Lambda**: `/aws/lambda/find-your-tennis-coach-frontend`
- **Backend Lambda**: `/aws/lambda/find-your-tennis-coach-backend`

### AWS Console Access
- **Lambda Functions**: AWS Lambda Console
- **API Gateway**: AWS API Gateway Console
- **DynamoDB**: AWS DynamoDB Console
- **S3 Bucket**: AWS S3 Console

## 🔧 Customization Options

### Modify Configuration
Edit `terraform.tfvars`:
```hcl
aws_region = "us-west-2"  # Change region
project_name = "my-tennis-app"  # Change project name
```

### Update Frontend
Modify `frontend/index.js` to:
- Change styling and colors
- Add new features
- Modify the layout
- Update content

### Update Backend
Modify `backend/index.js` to:
- Add new API endpoints
- Change data validation
- Add authentication
- Integrate external services

### Add More Sample Data
Edit the `sampleCoaches` array in `backend/index.js` to add more coaches.

## 🚨 Troubleshooting

### Common Issues

#### 1. AWS Permissions Error
```
Error: AccessDenied: User is not authorized to perform: lambda:CreateFunction
```
**Solution**: Ensure your AWS user has the required permissions listed above.

#### 2. Terraform State Lock
```
Error: Error locking state: Error acquiring the state lock
```
**Solution**: Wait a few minutes or delete the lock file if safe to do so.

#### 3. Lambda Package Too Large
```
Error: InvalidParameterValueException: Unzipped size must be smaller than 262144000 bytes
```
**Solution**: Remove unnecessary files from the Lambda packages.

#### 4. API Gateway CORS Issues
```
Access to fetch at 'API_URL' from origin 'WEBSITE_URL' has been blocked by CORS policy
```
**Solution**: CORS is pre-configured, but check the API Gateway console for proper setup.

### Debug Steps
1. **Check CloudWatch Logs** for detailed error messages
2. **Verify AWS CLI configuration**: `aws configure list`
3. **Check Terraform state**: `terraform show`
4. **Validate Terraform files**: `terraform validate`

## 💰 Cost Management

### Expected Monthly Costs
- **Development/Testing**: $5-10/month
- **Low Traffic Production**: $10-25/month
- **Medium Traffic**: $25-100/month

### Cost Optimization Tips
1. **Monitor usage** in AWS Cost Explorer
2. **Set up billing alerts** for unexpected charges
3. **Use DynamoDB on-demand** for variable workloads
4. **Clean up unused resources** regularly

## 🗑️ Cleanup

### Automated Cleanup
```bash
./destroy.sh
```

### Manual Cleanup
```bash
terraform destroy -var-file="terraform.tfvars"
```

**⚠️ Warning**: This will permanently delete all resources and data!

## 🔄 Updates and Maintenance

### Updating the Application
1. Modify the code in `frontend/` or `backend/`
2. Run `./deploy.sh` to redeploy
3. Terraform will update only the changed resources

### Updating Infrastructure
1. Modify the `.tf` files
2. Run `terraform plan` to see changes
3. Run `terraform apply` to update infrastructure

## 📞 Support

### Getting Help
1. **Check this guide** for common solutions
2. **Review AWS documentation** for service-specific issues
3. **Check Terraform documentation** for infrastructure issues
4. **Examine CloudWatch logs** for runtime errors

### Useful Commands
```bash
# Show current infrastructure
terraform show

# List all resources
terraform state list

# Get specific output
terraform output api_gateway_invoke_url

# Refresh state
terraform refresh

# Import existing resource (if needed)
terraform import aws_s3_bucket.example bucket-name
```

## 🎉 Success!

Once deployed successfully, you'll have:
- ✅ A professional tennis coach website
- ✅ Fully functional REST API
- ✅ Scalable serverless infrastructure
- ✅ Professional visual design
- ✅ Sample data ready for testing
- ✅ Monitoring and logging setup

**Your "Find Your Tennis Coach" platform is now live and ready to connect tennis players with professional coaches!**


