

# 🎾 Find Your Tennis Coach - Complete Setup Guide

## 📋 Prerequisites Checklist

✅ **AWS CLI Installed** - Version 2.28.20  
✅ **Terraform Installed** - Version 1.13.1  
⏳ **AWS Credentials** - Need to configure  
⏳ **Platform Deployment** - Ready to deploy  
⏳ **Test Suite Setup** - Ready to configure  

## 🚀 Step-by-Step Setup Process

### Step 1: Configure AWS Credentials

You need AWS credentials to deploy your platform. Choose one of these methods:

#### Method A: Interactive Configuration (Recommended)
```bash
aws configure
```

**You'll be prompted for:**
- **AWS Access Key ID**: `AKIA...` (from your AWS account)
- **AWS Secret Access Key**: `your-secret-key` (from your AWS account)
- **Default region name**: `us-east-1` (recommended)
- **Default output format**: `json`

#### Method B: Environment Variables
```bash
export AWS_ACCESS_KEY_ID="your-access-key-id"
export AWS_SECRET_ACCESS_KEY="your-secret-access-key"
export AWS_DEFAULT_REGION="us-east-1"
```

#### Method C: AWS Profile
```bash
aws configure --profile tennis-coach
export AWS_PROFILE=tennis-coach
```

**🔍 How to Get AWS Credentials:**
1. Log into AWS Console
2. Go to IAM → Users → Your User → Security Credentials
3. Create Access Key → Command Line Interface (CLI)
4. Download or copy the Access Key ID and Secret Access Key

### Step 2: Verify AWS Configuration

```bash
# Test AWS connection
aws sts get-caller-identity

# Should return something like:
# {
#     "UserId": "AIDACKCEVSQ6C2EXAMPLE",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/your-username"
# }
```

### Step 3: Deploy Your Tennis Coach Platform

```bash
# Navigate to project directory
cd /workspace

# Run the deployment script
./deploy.sh
```

**What this does:**
- Creates Lambda function packages
- Initializes Terraform
- Deploys all AWS resources
- Sets up API Gateway, Lambda functions, DynamoDB, S3

**Expected output:**
```
🎾 Find Your Tennis Coach - Deployment Script
===========================================
✅ Creating Lambda packages...
✅ Initializing Terraform...
✅ Planning deployment...
✅ Applying deployment...

Outputs:
api_gateway_invoke_url = "https://abc123def.execute-api.us-east-1.amazonaws.com/prod"
```

### Step 4: Get Your Website URL

After successful deployment:

```bash
# Get your website URL
./get-website-url.sh

# Or manually check Terraform outputs
terraform output api_gateway_invoke_url
```

**Your URL will look like:**
```
https://abc123def.execute-api.us-east-1.amazonaws.com/prod
```

### Step 5: Test Your Deployed Website

```bash
# Test that your website is working
curl -I https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod

# Should return HTTP 200 OK
```

### Step 6: Configure Test Suite

```bash
# Navigate to tests directory
cd tests

# Copy environment template
cp .env.example .env

# Edit the .env file with your website URL
nano .env
```

**Update `.env` file:**
```bash
# Replace with your actual API Gateway URL from Step 4
BASE_URL=https://abc123def.execute-api.us-east-1.amazonaws.com/prod

# Optional: Customize test settings
TEST_TIMEOUT=60000
TEST_RETRIES=2
HEADLESS=true
MAX_PAGE_LOAD_TIME=5000
MAX_API_RESPONSE_TIME=3000
```

### Step 7: Install Test Dependencies

```bash
# Make sure you're in the tests directory
cd /workspace/tests

# Install Node.js dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Step 8: Run Your First Test

```bash
# Run a quick test to verify everything works
npx playwright test e2e/api.spec.ts --grep "should return list of coaches"

# If successful, run all tests
./run-tests.sh
```

## 🎯 Quick Commands Summary

```bash
# 1. Configure AWS (one-time setup)
aws configure

# 2. Deploy platform
cd /workspace && ./deploy.sh

# 3. Get website URL
./get-website-url.sh

# 4. Setup tests
cd tests && cp .env.example .env
# Edit .env with your URL

# 5. Install test dependencies
npm install && npx playwright install

# 6. Run tests
./run-tests.sh
```

## 🚨 Troubleshooting

### Problem: AWS Credentials Error
```bash
# Check credentials
aws sts get-caller-identity

# Reconfigure if needed
aws configure
```

### Problem: Terraform Deployment Fails
```bash
# Check AWS permissions
aws iam get-user

# Run troubleshooting script
./troubleshoot-deployment.sh
```

### Problem: Website Not Accessible
```bash
# Check deployment status
terraform show

# Verify API Gateway
aws apigateway get-rest-apis
```

### Problem: Tests Fail to Connect
```bash
# Verify URL in .env file
cat tests/.env

# Test URL manually
curl -I $BASE_URL
```

## 📞 Need Help?

### Check These Files:
- `DEPLOYMENT_GUIDE.md` - Detailed deployment information
- `troubleshoot-deployment.sh` - Automated troubleshooting
- `tests/README.md` - Comprehensive test documentation

### Common Issues:
1. **AWS Credentials**: Make sure you have proper IAM permissions
2. **Region**: Use `us-east-1` for best compatibility
3. **URL Format**: Must include `https://` and `/prod` path
4. **Network**: Ensure your deployed site is publicly accessible

## 🎾 What You'll Have After Setup

✅ **Professional Tennis Coach Website**
- Responsive design for all devices
- 6 pre-loaded professional coaches
- Search by location and specialty
- Contact functionality

✅ **Serverless AWS Infrastructure**
- Lambda functions for frontend and backend
- API Gateway for routing
- DynamoDB for data storage
- S3 for static assets

✅ **Comprehensive Test Suite**
- API endpoint testing
- Frontend UI validation
- Accessibility compliance
- Performance benchmarking
- Cross-browser compatibility

✅ **CI/CD Integration**
- Automated testing on code changes
- GitHub Actions workflow
- Test reports and artifacts

**Ready to serve up excellence! 🎾**

