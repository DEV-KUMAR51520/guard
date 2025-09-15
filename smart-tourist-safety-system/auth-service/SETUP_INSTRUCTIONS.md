# Auth Service Setup Instructions

## Overview

The Auth Service is a critical component of the Smart Tourist Safety System that handles user authentication, registration, and token validation. This document provides instructions for setting up and running the Auth Service properly.

## Prerequisites

- Node.js 14+ installed
- PostgreSQL database accessible
- Other services (API Gateway, Blockchain Service) running if needed for full functionality

## Setup Steps

### 1. Environment Configuration

The Auth Service requires a `.env` file with proper configuration. A `.env` file has been created with the following settings:

```
# Database Connection
DB_USER=admin
DB_PASSWORD=devpassword123
DB_HOST=postgres
DB_PORT=5432
DB_NAME=tourist_safety_dev

# Connection Pool
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000

# Health Checks
DB_HEALTH_CHECK_INTERVAL=30000
DB_UNHEALTHY_THRESHOLD=3

# Authentication
PORT=3001
JWT_SECRET=dev_jwt_secret_key_for_testing
JWT_EXPIRATION=86400
BCRYPT_SALT_ROUNDS=10

# External Services
BLOCKCHAIN_API_URL=http://blockchain:5002
AI_SERVICE_URL=http://ai-service:5000
```

**Important Notes:**
- The database credentials match those in the API Gateway configuration
- The JWT_SECRET matches the one used in the API Gateway for consistent token validation
- The PORT is set to 3001 to avoid conflicts with other services

### 2. Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

### 3. Start the Service

Start the Auth Service with:

```bash
npm start
```

Verify that the service is running by checking the console output for "Auth Service running on port 3001" and "Connected to the database".

### 4. Verify Health Status

Check the health status of the service by making a GET request to:

```
http://localhost:3001/health
```

You should receive a JSON response with the service and database status.

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify that the PostgreSQL database is running and accessible
2. Check that the database credentials in the `.env` file are correct
3. Ensure the database name exists in your PostgreSQL instance
4. For Docker environments, ensure the network allows communication between services

### Service Not Starting

If the service fails to start:

1. Check the console output for error messages
2. Verify that port 3001 is not already in use by another service
3. Ensure all required environment variables are set in the `.env` file

## Integration with API Gateway

The API Gateway is configured to communicate with the Auth Service at `http://auth-service:3001`. In a local development environment, you may need to update the `AUTH_SERVICE_URL` in the API Gateway's `.env` file to `http://localhost:3001` if services are not running in Docker containers.