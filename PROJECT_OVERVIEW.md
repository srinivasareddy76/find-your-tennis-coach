


# 🎾 Find Your Tennis Coach - Complete Terraform Infrastructure

## Project Summary

This is a complete serverless web application built with AWS services using Terraform Infrastructure as Code. The "Find Your Tennis Coach" platform connects tennis players with certified coaches through a modern, responsive web interface.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway    │    │   Backend       │
│   Lambda        │◄──►│   REST API       │◄──►│   Lambda        │
│   (Website)     │    │   (Routing)      │    │   (CRUD API)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   S3 Bucket     │    │   CloudWatch     │    │   DynamoDB      │
│   (Images)      │    │   (Logs)         │    │   (Coach Data)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Key Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with modern CSS Grid and Flexbox
- **Interactive UI**: Smooth animations, hover effects, and professional styling
- **Search Functionality**: Filter coaches by location and specialty
- **Coach Profiles**: Detailed cards with ratings, experience, and contact info
- **Progressive Enhancement**: Works without JavaScript for accessibility

### Backend Features
- **RESTful API**: Complete CRUD operations for coach management
- **Sample Data**: Pre-loaded with 6 professional coach profiles
- **Search & Filter**: Query by location using DynamoDB GSI
- **CORS Enabled**: Cross-origin requests properly configured
- **Error Handling**: Comprehensive error responses and logging

### Infrastructure Features
- **Serverless**: Pay-per-use Lambda functions with automatic scaling
- **Secure**: IAM roles with least-privilege access
- **Monitored**: CloudWatch logging for all components
- **Scalable**: DynamoDB on-demand billing for flexible capacity

## 📁 Project Structure

```
find-your-tennis-coach/
├── 📄 main.tf                 # Core AWS infrastructure
├── 📄 lambda_functions.tf     # Lambda functions & API Gateway
├── 📄 terraform.tfvars        # Configuration variables
├── 📄 README.md              # Detailed documentation
├── 📄 PROJECT_OVERVIEW.md    # This overview file
├── 🚀 deploy.sh              # Automated deployment script
├── 🗑️  destroy.sh            # Cleanup script
├── 🐍 create_images.py       # Image generation script
├── 📁 frontend/
│   └── 📄 index.js           # Frontend Lambda (HTML/CSS/JS)
├── 📁 backend/
│   ├── 📄 index.js           # Backend API Lambda
│   └── 📄 package.json       # Node.js dependencies
└── 📁 images/                # Professional tennis graphics
    ├── 🎾 tennis-logo.svg
    ├── 👨‍🏫 coach-icon.svg
    ├── 🏟️ tennis-court.svg
    ├── 🏆 trophy-icon.svg
    ├── 📍 location-icon.svg
    └── ⭐ star-rating.svg
```

## 🎨 Visual Design

### Color Scheme
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Secondary**: Coral (#ff6b6b) for call-to-action buttons
- **Accent**: Gold (#FFD700) for ratings and achievements
- **Tennis Theme**: Yellow-green (#FFE135) for tennis balls

### Typography
- **Font**: Arial, sans-serif for maximum compatibility
- **Hierarchy**: Clear heading structure (3.5rem → 1.2rem)
- **Readability**: High contrast ratios and proper line spacing

### Layout
- **Grid System**: CSS Grid for coach cards and features
- **Responsive**: Breakpoints at 768px for mobile optimization
- **Cards**: Elevated design with shadows and hover effects
- **Navigation**: Sticky header with smooth scrolling

## 🏃‍♂️ Quick Start

### Prerequisites
- AWS CLI configured with appropriate permissions
- Terraform >= 1.0 installed
- Node.js (for local development)

### Deployment (Automated)
```bash
# Clone the repository
git clone <repository-url>
cd find-your-tennis-coach

# Run the automated deployment
./deploy.sh
```

### Deployment (Manual)
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
# Destroy all resources
./destroy.sh
```

## 📊 Sample Data

The application includes 6 professional coach profiles:

1. **Sarah Johnson** - Beginner & Intermediate (New York)
2. **Mike Rodriguez** - Advanced & Competition (Los Angeles)
3. **Emily Chen** - Youth & Junior Development (Chicago)
4. **David Thompson** - Adult Beginner Specialist (Miami)
5. **Lisa Park** - Women's Tennis & Fitness (Seattle)
6. **Carlos Martinez** - Clay Court Specialist (Phoenix)

Each profile includes:
- Professional bio and experience
- Hourly rates ($60-$120)
- Availability schedule
- Certifications (USPTA, PTR, etc.)
- Contact information
- 5-star ratings

## 🔧 API Endpoints

### GET /coaches
List all coaches or filter by parameters
```bash
curl "https://api-url/prod/coaches?location=New York&specialty=Beginner"
```

### GET /coaches/{id}
Get specific coach details
```bash
curl "https://api-url/prod/coaches/1"
```

### POST /coaches
Create new coach profile
```bash
curl -X POST "https://api-url/prod/coaches" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","specialty":"Advanced","location":"Boston"}'
```

### PUT /coaches/{id}
Update existing coach
```bash
curl -X PUT "https://api-url/prod/coaches/1" \
  -H "Content-Type: application/json" \
  -d '{"hourly_rate":95}'
```

### DELETE /coaches/{id}
Remove coach profile
```bash
curl -X DELETE "https://api-url/prod/coaches/1"
```

## 💰 Cost Estimation

### Monthly Costs (Low Traffic)
- **Lambda**: ~$0.20 (1M requests)
- **API Gateway**: ~$3.50 (1M requests)
- **DynamoDB**: ~$1.25 (25 RCU/WCU)
- **S3**: ~$0.50 (10GB storage)
- **Total**: ~$5.45/month

### Scaling Considerations
- Lambda automatically scales to handle traffic spikes
- DynamoDB on-demand pricing adjusts to usage
- S3 costs scale with storage and bandwidth
- No fixed costs or minimum commitments

## 🔒 Security Features

- **IAM Roles**: Least-privilege access for Lambda functions
- **CORS**: Properly configured for web browser security
- **HTTPS**: All API endpoints use SSL/TLS encryption
- **Input Validation**: Backend validates all user inputs
- **Error Handling**: No sensitive information in error messages

## 📈 Monitoring & Logging

- **CloudWatch Logs**: Automatic logging for all Lambda functions
- **API Gateway Logs**: Request/response logging available
- **DynamoDB Metrics**: Built-in performance monitoring
- **Custom Metrics**: Can be added for business intelligence

## 🎯 Future Enhancements

### Phase 2 Features
- User authentication (AWS Cognito)
- Payment processing (Stripe integration)
- Real-time messaging (WebSocket API)
- Email notifications (SES)
- Image uploads (S3 presigned URLs)

### Phase 3 Features
- Mobile app (React Native)
- Advanced search (Elasticsearch)
- Booking system with calendar
- Review and rating system
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check CloudWatch logs for errors
- Verify AWS permissions and quotas
- Review Terraform state for resource status
- Consult the detailed README.md

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for the tennis community**


