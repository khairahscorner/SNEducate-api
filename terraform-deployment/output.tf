output "api_service_url" {
  value = aws_apprunner_service.express-api-service.service_url
}

output "api_service_arn" {
  value = aws_apprunner_service.express-api-service.arn
}

output "api_service_status" {
  value = aws_apprunner_service.express-api-service.status
}