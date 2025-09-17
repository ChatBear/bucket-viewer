# S3 bucket for Terraform state
resource "aws_s3_bucket" "terraform_state" {
  bucket = "bucket-viewer-terraform-state-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "Terraform State Bucket"
    Environment = "infrastructure"
  }
}

# Random suffix to ensure unique bucket name
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Enable versioning for state file history
resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block public access
resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# DynamoDB table for state locking
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-state-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name        = "Terraform State Locks"
    Environment = "infrastructure"
  }
}

# Output the bucket name and DynamoDB table name
output "s3_bucket_name" {
  value       = aws_s3_bucket.terraform_state.bucket
  description = "Name of the S3 bucket for Terraform state"
}

output "dynamodb_table_name" {
  value       = aws_dynamodb_table.terraform_locks.name
  description = "Name of the DynamoDB table for state locking"
}

output "backend_configuration" {
  value       = <<-EOT
    Add this to your main.tf:
    
    terraform {
      backend "s3" {
        bucket         = "${aws_s3_bucket.terraform_state.bucket}"
        key            = "bucket-viewer/terraform.tfstate"
        region         = "ap-southeast-1"
        dynamodb_table = "${aws_dynamodb_table.terraform_locks.name}"
        encrypt        = true
      }
    }
  EOT
  description = "Backend configuration to add to your main Terraform files"
}
