
data "aws_ecr_repository" "ecr" {
  name = var.registry_name
}
# Assume role policy - who can assume this role
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

# Permissions policy - what this role can do
data "aws_iam_policy_document" "s3_read_access" {
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:ListBucket",
      "s3:ListObject",
    ]

    resources = [
      "arn:aws:s3:::*",
      "arn:aws:s3:::*/*",
    ]
  }
}

resource "aws_iam_role" "bucket_role" {
  name               = "lambda_execution_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# Attach the permissions policy to the role
resource "aws_iam_role_policy" "s3_access" {
  name   = "s3_read_access"
  role   = aws_iam_role.bucket_role.id
  policy = data.aws_iam_policy_document.s3_read_access.json
}

# Also attach basic Lambda execution role for CloudWatch logs
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.bucket_role.name
}


resource "aws_lambda_function" "bucket-lambda" {
  function_name = "bucket_container_function"
  role          = aws_iam_role.bucket_role.arn
  package_type  = "Image"
  image_uri     = "${data.aws_ecr_repository.ecr.repository_url}:latest"

  memory_size = 512
  timeout     = 30

  architectures = ["arm64"] # Graviton support for better price/performance

  environment {
    variables = {
      ALLOWED_ORIGINS = "[\"https://${var.cloudfront_domain}\", \"https://ft.bucket-viewer.org\"]"
    }
  }

}

resource "aws_apigatewayv2_api" "bu" {
  name          = "bu-gateway"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "bu" {
  api_id           = aws_apigatewayv2_api.bu.id
  integration_type = "AWS_PROXY"

  connection_type    = "INTERNET"
  description        = "BU LAMBDA"
  integration_method = "POST"
  integration_uri    = aws_lambda_function.bucket-lambda.invoke_arn
}


resource "aws_apigatewayv2_route" "bu" {
  api_id    = aws_apigatewayv2_api.bu.id
  route_key = "ANY /{proxy+}"

  target = "integrations/${aws_apigatewayv2_integration.bu.id}"
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.bucket-lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.bu.execution_arn}/*/*"
}


resource "aws_apigatewayv2_stage" "bu" {
  api_id      = aws_apigatewayv2_api.bu.id
  name        = "$default"
  auto_deploy = true
}
