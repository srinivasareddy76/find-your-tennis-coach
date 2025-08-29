
# Simplified deployment for Find Your Tennis Coach
# This version removes S3 and focuses on core functionality

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Variables
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "find-your-tennis-coach"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

# DynamoDB table for storing coach data
resource "aws_dynamodb_table" "coaches" {
  name           = "${var.project_name}-coaches"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "coach_id"

  attribute {
    name = "coach_id"
    type = "S"
  }

  attribute {
    name = "location"
    type = "S"
  }

  global_secondary_index {
    name     = "location-index"
    hash_key = "location"
    projection_type = "ALL"
  }

  tags = {
    Name = "Tennis Coaches Table"
  }
}

# IAM role for Lambda functions
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM policy for Lambda functions
resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.project_name}-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Scan",
          "dynamodb:Query"
        ]
        Resource = [
          aws_dynamodb_table.coaches.arn,
          "${aws_dynamodb_table.coaches.arn}/index/*"
        ]
      }
    ]
  })
}

# Archive files for Lambda functions
data "archive_file" "frontend_zip" {
  type        = "zip"
  source_dir  = "${path.module}/frontend"
  output_path = "${path.module}/frontend.zip"
}

data "archive_file" "backend_zip" {
  type        = "zip"
  source_dir  = "${path.module}/backend"
  output_path = "${path.module}/backend.zip"
}

# Frontend Lambda function
resource "aws_lambda_function" "frontend" {
  filename         = "frontend.zip"
  function_name    = "${var.project_name}-frontend"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 128

  source_code_hash = data.archive_file.frontend_zip.output_base64sha256

  depends_on = [aws_iam_role_policy.lambda_policy]
}

# Backend Lambda function
resource "aws_lambda_function" "backend" {
  filename         = "backend.zip"
  function_name    = "${var.project_name}-backend"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30
  memory_size     = 128

  source_code_hash = data.archive_file.backend_zip.output_base64sha256

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.coaches.name
    }
  }

  depends_on = [aws_iam_role_policy.lambda_policy]
}

# API Gateway
resource "aws_api_gateway_rest_api" "tennis_coach_api" {
  name        = "${var.project_name}-api"
  description = "API for Find Your Tennis Coach website"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# API Gateway Resources
resource "aws_api_gateway_resource" "coaches" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  parent_id   = aws_api_gateway_rest_api.tennis_coach_api.root_resource_id
  path_part   = "coaches"
}

resource "aws_api_gateway_resource" "coach_by_id" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  parent_id   = aws_api_gateway_resource.coaches.id
  path_part   = "{id}"
}

# API Gateway Methods
resource "aws_api_gateway_method" "frontend_method" {
  rest_api_id   = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id   = aws_api_gateway_rest_api.tennis_coach_api.root_resource_id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "get_coaches" {
  rest_api_id   = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id   = aws_api_gateway_resource.coaches.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "post_coaches" {
  rest_api_id   = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id   = aws_api_gateway_resource.coaches.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "get_coach_by_id" {
  rest_api_id   = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id   = aws_api_gateway_resource.coach_by_id.id
  http_method   = "GET"
  authorization = "NONE"
}

# CORS Options method
resource "aws_api_gateway_method" "options_method" {
  rest_api_id   = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id   = aws_api_gateway_resource.coaches.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

# API Gateway Integrations
resource "aws_api_gateway_integration" "frontend_integration" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_rest_api.tennis_coach_api.root_resource_id
  http_method = aws_api_gateway_method.frontend_method.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.frontend.invoke_arn
}

resource "aws_api_gateway_integration" "get_coaches_integration" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_resource.coaches.id
  http_method = aws_api_gateway_method.get_coaches.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.backend.invoke_arn
}

resource "aws_api_gateway_integration" "post_coaches_integration" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_resource.coaches.id
  http_method = aws_api_gateway_method.post_coaches.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.backend.invoke_arn
}

resource "aws_api_gateway_integration" "get_coach_by_id_integration" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_resource.coach_by_id.id
  http_method = aws_api_gateway_method.get_coach_by_id.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.backend.invoke_arn
}

# CORS Integration
resource "aws_api_gateway_integration" "options_integration" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_resource.coaches.id
  http_method = aws_api_gateway_method.options_method.http_method

  type = "MOCK"
  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

# Method Response for CORS
resource "aws_api_gateway_method_response" "options_response" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_resource.coaches.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# Integration Response for CORS
resource "aws_api_gateway_integration_response" "options_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_resource.coaches.id
  http_method = aws_api_gateway_method.options_method.http_method
  status_code = aws_api_gateway_method_response.options_response.status_code

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

# Lambda permissions
resource "aws_lambda_permission" "frontend_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.frontend.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.tennis_coach_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "backend_api_gateway" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.tennis_coach_api.execution_arn}/*/*"
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "tennis_coach_deployment" {
  depends_on = [
    aws_api_gateway_integration.frontend_integration,
    aws_api_gateway_integration.get_coaches_integration,
    aws_api_gateway_integration.post_coaches_integration,
    aws_api_gateway_integration.get_coach_by_id_integration,
    aws_api_gateway_integration.options_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  stage_name  = "prod"
}

# Outputs
output "api_gateway_url" {
  description = "URL of the API Gateway"
  value       = "https://${aws_api_gateway_rest_api.tennis_coach_api.id}.execute-api.${var.aws_region}.amazonaws.com/prod"
}

output "dynamodb_table_name" {
  description = "Name of the DynamoDB table"
  value       = aws_dynamodb_table.coaches.name
}

output "frontend_lambda_function_name" {
  description = "Name of the frontend Lambda function"
  value       = aws_lambda_function.frontend.function_name
}

output "backend_lambda_function_name" {
  description = "Name of the backend Lambda function"
  value       = aws_lambda_function.backend.function_name
}

