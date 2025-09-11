terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.92"
    }
  }

  required_version = ">= 1.2"
}

resource "aws_s3_bucket" "example" {
  bucket = "frontend-bucket-viewer"

  tags = {
    Name        = "Mycket"
    Environment = "Dev"
  }
}
