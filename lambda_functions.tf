
# Frontend Lambda Function (serves the website)
resource "aws_lambda_function" "frontend" {
  filename         = "frontend.zip"
  function_name    = "${var.project_name}-frontend"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30

  depends_on = [data.archive_file.frontend_zip]

  environment {
    variables = {
      API_GATEWAY_URL = aws_api_gateway_rest_api.tennis_coach_api.execution_arn
      S3_BUCKET_URL   = "https://${aws_s3_bucket.static_assets.bucket}.s3.amazonaws.com"
    }
  }
}

# Backend Lambda Function (API endpoints)
resource "aws_lambda_function" "backend" {
  filename         = "backend.zip"
  function_name    = "${var.project_name}-backend"
  role            = aws_iam_role.lambda_role.arn
  handler         = "index.handler"
  runtime         = "nodejs18.x"
  timeout         = 30

  depends_on = [data.archive_file.backend_zip]

  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.coaches.name
      AWS_REGION     = var.aws_region
    }
  }
}

# Archive files for Lambda deployment
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

# API Gateway resources and methods
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

# GET /coaches - List all coaches
resource "aws_api_gateway_method" "get_coaches" {
  rest_api_id   = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id   = aws_api_gateway_resource.coaches.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_coaches_integration" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_resource.coaches.id
  http_method = aws_api_gateway_method.get_coaches.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.backend.invoke_arn
}

# POST /coaches - Create a new coach
resource "aws_api_gateway_method" "post_coaches" {
  rest_api_id   = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id   = aws_api_gateway_resource.coaches.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "post_coaches_integration" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_resource.coaches.id
  http_method = aws_api_gateway_method.post_coaches.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.backend.invoke_arn
}

# GET /coaches/{id} - Get specific coach
resource "aws_api_gateway_method" "get_coach_by_id" {
  rest_api_id   = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id   = aws_api_gateway_resource.coach_by_id.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "get_coach_by_id_integration" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_resource.coach_by_id.id
  http_method = aws_api_gateway_method.get_coach_by_id.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.backend.invoke_arn
}

# Frontend Lambda integration with API Gateway
resource "aws_api_gateway_method" "frontend_method" {
  rest_api_id   = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id   = aws_api_gateway_rest_api.tennis_coach_api.root_resource_id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "frontend_integration" {
  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  resource_id = aws_api_gateway_rest_api.tennis_coach_api.root_resource_id
  http_method = aws_api_gateway_method.frontend_method.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.frontend.invoke_arn
}

# Lambda permissions for API Gateway
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

# API Gateway deployment
resource "aws_api_gateway_deployment" "tennis_coach_deployment" {
  depends_on = [
    aws_api_gateway_integration.frontend_integration,
    aws_api_gateway_integration.get_coaches_integration,
    aws_api_gateway_integration.post_coaches_integration,
    aws_api_gateway_integration.get_coach_by_id_integration,
  ]

  rest_api_id = aws_api_gateway_rest_api.tennis_coach_api.id
  stage_name  = "prod"
}

# Update outputs
output "api_gateway_invoke_url" {
  description = "Invoke URL for the API Gateway"
  value       = aws_api_gateway_deployment.tennis_coach_deployment.invoke_url
}

output "frontend_lambda_function_name" {
  description = "Name of the frontend Lambda function"
  value       = aws_lambda_function.frontend.function_name
}

output "backend_lambda_function_name" {
  description = "Name of the backend Lambda function"
  value       = aws_lambda_function.backend.function_name
}
