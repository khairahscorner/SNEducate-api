#!/bin/bash

export $(grep -v '^#' ../.env | xargs)

API_SERVICE_ARN=$(terraform output -raw api_service_arn)

# Update the App Runner service with updates defined in the input.json file
aws apprunner update-service --service-arn $API_SERVICE_ARN \
    --cli-input-json file://input.json

echo "App Runner service has been updated"
