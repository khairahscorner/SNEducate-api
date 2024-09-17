variable "api_name" {
  type = string
  default = "thesis-api-v3"
}

variable "github_repo" {
  type = string
  default = "https://github.com/khairahscorner/SNEducate-api"
}

variable "apprunner_connection_arn" {
  type = string
}

variable "vpc_connector_arn" {
    type = string
}

variable "env_alt_fe_url" {
  type = string
}
variable "env_fe_url" {
  type = string
}
variable "env_jwt_key" {
  type = string
}
variable "env_outlook_email" {
  type = string
}
variable "env_outlook_password" {
  type = string
}
variable "env_prod_api_url" {
  type = string
}
variable "env_prod_db_hostname" {
  type = string
}
variable "env_prod_db_name" {
  type = string
}
variable "env_prod_db_username" {
  type = string
}
variable "env_prod_db_password" {
  type = string
}
variable "env_prod_fe_url" {
  type = string
}
