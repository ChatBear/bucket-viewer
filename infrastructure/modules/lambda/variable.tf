variable "registry_name" {
  default = "bucket-viewer"
  type    = string
}

variable "cloudfront_domain" {
  description = "Cloudfront distribution name"
  type        = string
}
