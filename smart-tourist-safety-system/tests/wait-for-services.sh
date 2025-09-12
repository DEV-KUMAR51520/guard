#!/bin/bash

# wait-for-services.sh
# Script to wait for all required services to be available before running tests

set -e

# Define colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Waiting for services to be ready...${NC}"

# Function to wait for a service to be available
wait_for_service() {
  local service_name=$1
  local service_url=$2
  local max_attempts=$3
  local attempt=1
  
  echo -e "${YELLOW}Checking $service_name at $service_url...${NC}"
  
  while [ $attempt -le $max_attempts ]; do
    if curl -s -f $service_url > /dev/null 2>&1; then
      echo -e "${GREEN}✓ $service_name is available${NC}"
      return 0
    else
      echo -e "${YELLOW}Waiting for $service_name (attempt $attempt/$max_attempts)...${NC}"
      sleep 5
      attempt=$((attempt + 1))
    fi
  done
  
  echo -e "${RED}✗ $service_name is not available after $max_attempts attempts${NC}"
  return 1
}

# Wait for API Gateway
wait_for_service "API Gateway" "${API_URL:-http://api-gateway:3000/api}/health" 12

# Wait for Admin Dashboard
wait_for_service "Admin Dashboard" "${ADMIN_DASHBOARD_URL:-http://admin-dashboard}/" 6

# Wait for User Dashboard
wait_for_service "User Dashboard" "${USER_DASHBOARD_URL:-http://user-dashboard}/" 6

echo -e "${GREEN}All services are ready!${NC}"

# Execute the command passed to this script
exec "$@"