

# Find Your Tennis Coach - Terraform Infrastructure

This project creates a complete serverless website for connecting tennis players with certified coaches using AWS Lambda, API Gateway, DynamoDB, and S3.

## Architecture

- **Frontend**: AWS Lambda function serving a responsive HTML/CSS/JavaScript website
- **Backend**: AWS Lambda function providing REST API endpoints
- **Database**: DynamoDB table for storing coach information
- **Static Assets**: S3 bucket for images and other static content
- **API Gateway**: RESTful API routing and CORS handling

## Features

- 🎾 **Responsive Design**: Mobile-friendly interface with modern CSS
- 🔍 **Search Functionality**: Find coaches by location and specialty
- 📊 **Coach Profiles**: Detailed information including ratings, experience, and availability
- 🌐 **REST API**: Full CRUD operations for coach management
- 🔒 **CORS Enabled**: Cross-origin resource sharing configured
- 📱 **Progressive Enhancement**: Works without JavaScript for basic functionality

## Prerequisites

- AWS CLI configured with appropriate permissions
- Terraform >= 1.0 installed
- Node.js (for local development/testing)

## Deployment

1. **Clone and navigate to the project directory**:
   ```bash
   git clone <repository-url>
   cd find-your-tennis-coach
   ```

2. **Initialize Terraform**:
   ```bash
   terraform init
   ```

3. **Plan the deployment**:
   ```bash
   terraform plan
   ```

4. **Apply the infrastructure**:
   ```bash
   terraform apply
   ```

5. **Note the outputs** for API Gateway URL and S3 bucket information.

## Project Structure

```
.
├── main.tf                 # Main Terraform configuration
├── lambda_functions.tf     # Lambda functions and API Gateway setup
├── frontend/
│   └── index.js           # Frontend Lambda function code
├── backend/
│   ├── index.js           # Backend API Lambda function code
│   └── package.json       # Node.js dependencies
├── images/                # Tennis-related images for the website
└── README.md             # This file
```

## API Endpoints

### GET /coaches
Returns a list of all coaches or filtered by query parameters.

**Query Parameters:**
- `location`: Filter by coach location
- `specialty`: Filter by coaching specialty

**Example:**
```bash
curl "https://your-api-gateway-url/prod/coaches?location=New York&specialty=Beginner"
```

### GET /coaches/{id}
Returns detailed information about a specific coach.

**Example:**
```bash
curl "https://your-api-gateway-url/prod/coaches/1"
```

### POST /coaches
Creates a new coach profile.

**Request Body:**
```json
{
  "name": "John Doe",
  "specialty": "Advanced Training",
  "location": "Boston",
  "email": "john.doe@email.com",
  "phone": "+1-555-0123",
  "bio": "Experienced tennis coach...",
  "hourly_rate": 90,
  "availability": ["Monday", "Wednesday", "Friday"],
  "certifications": ["USPTA Certified"]
}
```

### PUT /coaches/{id}
Updates an existing coach profile.

### DELETE /coaches/{id}
Deletes a coach profile.

## Sample Data

The application comes pre-loaded with sample coach data including:

- **Sarah Johnson** - Beginner & Intermediate specialist in New York
- **Mike Rodriguez** - Advanced & Competition coach in Los Angeles  
- **Emily Chen** - Youth & Junior Development in Chicago
- **David Thompson** - Adult Beginner Specialist in Miami
- **Lisa Park** - Women's Tennis & Fitness in Seattle
- **Carlos Martinez** - Clay Court Specialist in Phoenix

## Customization

### Adding New Features

1. **Frontend Changes**: Modify `frontend/index.js` to update the UI
2. **Backend Changes**: Update `backend/index.js` to add new API endpoints
3. **Database Schema**: Modify the DynamoDB table structure in `main.tf`

### Styling

The frontend uses modern CSS with:
- Gradient backgrounds
- Card-based layouts
- Responsive grid systems
- Smooth animations and transitions
- Mobile-first design approach

### Environment Variables

The Lambda functions use these environment variables:
- `DYNAMODB_TABLE`: Name of the DynamoDB table
- `AWS_REGION`: AWS region for DynamoDB operations
- `API_GATEWAY_URL`: Base URL for API calls (frontend)
- `S3_BUCKET_URL`: URL for static assets (frontend)

## Security Considerations

- CORS is configured to allow all origins (`*`) for development
- For production, restrict CORS to specific domains
- Consider adding authentication/authorization for coach management endpoints
- Implement rate limiting on API Gateway
- Use HTTPS only in production

## Cost Optimization

- Lambda functions use pay-per-request pricing
- DynamoDB is configured with on-demand billing
- S3 bucket uses standard storage class
- Consider Reserved Capacity for high-traffic scenarios

## Monitoring and Logging

- CloudWatch logs are automatically created for Lambda functions
- Consider adding X-Ray tracing for performance monitoring
- Set up CloudWatch alarms for error rates and latency

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

## Support

For issues and questions:
1. Check the CloudWatch logs for Lambda function errors
2. Verify API Gateway configuration and CORS settings
3. Ensure DynamoDB table permissions are correct
4. Review Terraform state for resource dependencies

## License

This project is licensed under the MIT License - see the LICENSE file for details.

