#!/bin/bash

export $(grep -v '^#' .env | xargs)

terraform apply \
  -var="apprunner_connection_arn=$APPRUNNER_CONNECTION_ARN" \
  -var="vpc_connector_arn=$VPC_CONNECTOR_ARN" \
  -var="env_alt_fe_url=$ALT_PROD_FRONTEND_URL" \
  -var="env_fe_url=$FRONTEND_URL" \
  -var="env_jwt_key=$JWT_SECRET_KEY" \
  -var="env_outlook_email=$OUTLOOK_EMAIL" \
  -var="env_outlook_password=$OUTLOOK_PASSWORD" \
  -var="env_prod_api_url=$PROD_API_URL" \
  -var="env_prod_db_hostname=$PROD_DB_HOSTNAME" \
  -var="env_prod_db_name=$PROD_DB_NAME" \
  -var="env_prod_db_username=$PROD_DB_USERNAME" \
  -var="env_prod_db_password=$PROD_DB_PASSWORD" \
  -var="env_prod_fe_url=$PROD_FRONTEND_URL" \
