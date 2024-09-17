
resource "aws_apprunner_service" "express-api-service" {
  service_name = var.api_name

  source_configuration {
    auto_deployments_enabled = true
    authentication_configuration {
      connection_arn = var.apprunner_connection_arn
    }

    code_repository {
      repository_url = var.github_repo
      source_code_version {
        type  = "BRANCH"
        value = "master"
      }
      code_configuration {
        configuration_source = "API"
        code_configuration_values {
          build_command = "npm install"
          port          = "8000"
          runtime       = "NODEJS_16"
          start_command = "npm run start"
          runtime_environment_variables = {
            ALT_PROD_FRONTEND_URL = var.env_alt_fe_url
            PROD_DB_PORT          = "3306"
            NODE_ENV              = "production"
            FRONTEND_URL          = var.env_fe_url
            JWT_SECRET_KEY        = var.env_jwt_key
            OUTLOOK_EMAIL         = var.env_outlook_email
            OUTLOOK_PASSWORD      = var.env_outlook_password
            PROD_API_URL          = var.env_prod_api_url
            PROD_DB_HOSTNAME      = var.env_prod_db_hostname
            PROD_DB_NAME          = var.env_prod_db_name
            PROD_DB_PASSWORD      = var.env_prod_db_password
            PROD_DB_USERNAME      = var.env_prod_db_username
            PROD_FRONTEND_URL     = var.env_prod_fe_url
          }
        }
      }
    }
  }

  network_configuration {
    ingress_configuration {
      is_publicly_accessible = true
    }
    egress_configuration {
      egress_type       = "VPC"
      vpc_connector_arn = var.vpc_connector_arn
    }
  }
  
  instance_configuration {
    cpu    = "2048" // 2vCPU
    memory = "4096" // 4GB
  }

  health_check_configuration {
    // defaults
    interval = 10
    timeout = 5
  }

  tags = {
    DEPLOYED = "via-terraform"
  }
}
