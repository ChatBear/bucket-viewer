variable "aws_region" {
  description = "Region AWS"
  type        = string
  default     = "ap-southeast-1"
}


variable "bucket_name" {
  description = "name of the frontend bucket"
  type        = string
  default     = "frontend-bu-viewer"
}


variable "domain_name" {
  default = "frnt.bucker-viewer.org"
}

