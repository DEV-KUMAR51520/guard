# Centralized Authentication Service

This service provides a unified authentication layer for the Smart Tourist Safety System. It handles user registration, login, and token validation consistently across all services.

## Database Connection Management

The Auth Service uses PostgreSQL for data storage with the following features:

### Connection Pooling

The service implements connection pooling to efficiently manage database connections:

- **Pool Size**: Configurable maximum number of clients in the pool
- **Idle Timeout**: Connections are closed after a configurable idle period
- **Connection Timeout**: Configurable timeout for new connection attempts

### Error Handling and Retry Logic

The service includes robust error handling with retry capabilities:

- **Automatic Retries**: Failed queries are automatically retried with exponential backoff
- **Error Classification**: Errors are classified as retryable or non-retryable
- **Transaction Support**: Transactions are automatically retried on connection failures

### Health Monitoring

Database health is continuously monitored:

- **Periodic Checks**: Regular health checks verify database connectivity
- **Response Time Monitoring**: Alerts when query response time exceeds thresholds
- **Health Status API**: The `/health` endpoint provides database health information
- **Graceful Shutdown**: Connections are properly closed on service shutdown

## Configuration

Database connection settings can be configured through environment variables:

```
# Database Connection
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tourist_safety

# Connection Pool
DB_POOL_MAX=20
DB_IDLE_TIMEOUT=30000
DB_CONNECTION_TIMEOUT=5000

# Mock Database (for development and testing)
MOCK_DB=true

# Health Checks
DB_HEALTH_CHECK_INTERVAL=30000
```

## Mock Database Implementation

The Auth Service includes a mock database implementation for development and testing purposes. When `MOCK_DB=true` is set in the environment, the service will use an in-memory database instead of connecting to PostgreSQL.

### Features

- **In-Memory Storage**: Simulates database tables and relationships without requiring a real database
- **Pre-populated Data**: Includes sample users, tourists, incidents, and alerts for testing
- **Query Simulation**: Handles common database operations like inserts, selects, and updates
- **Health Check Responses**: Provides realistic responses to database health checks

### Usage

To enable the mock database:

1. Set `MOCK_DB=true` in your `.env` file or environment variables
2. Start the service normally with `node index.js`

### Testing

A test script is provided to verify functionality with the mock database:

```bash
# Set environment variable for mock database
$env:MOCK_DB="true"  # PowerShell
# OR
export MOCK_DB=true   # Bash

# Run tests
node test-auth.js
```

For detailed information about the mock data structure, see `MOCK_DATA_STRUCTURE.md`.
DB_UNHEALTHY_THRESHOLD=3
```

See `.env.example` for all available configuration options.

## Purpose

The Auth Service was created to address the fragmented authentication logic that existed between the API Gateway and the backend service. By centralizing authentication, we ensure:

1. Consistent data models across all services
2. Unified password handling and security practices
3. Centralized role-based access control
4. Single source of truth for authentication logic

## Features

- User registration with validation
- Secure login with JWT token generation
- Token verification
- Role-based access control
- Integration with blockchain service for digital ID

## API Endpoints

### POST /api/auth/register

Registers a new tourist in the system.

**Required fields:**
- name
- phone
- email
- password
- emergency_contact
- entry_point
- trip_duration

### POST /api/auth/login

Authenticates a tourist and returns a JWT token.

**Required fields:**
- phone
- password

### GET /api/auth/verify

Verifies the JWT token and returns tourist data.

**Required headers:**
- x-auth-token

### GET /api/auth/role

Returns the role information for the authenticated tourist.

**Required headers:**
- x-auth-token

## Setup

### Prerequisites

- Node.js 14+
- PostgreSQL database

### Installation

```bash
# Install dependencies
npm install

# Start the service
npm start
```

### Environment Variables

Create a `.env` file with the following variables:

```
PORT=3001
JWT_SECRET=your_jwt_secret
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres_user
DB_PASSWORD=postgres_password
DB_NAME=tourist_safety_dev
BLOCKCHAIN_API_URL=http://blockchain:5002
AI_SERVICE_URL=http://ai-service:5000
```

## Docker

Build and run the Docker container:

```bash
# Build the image
docker build -t auth-service .

# Run the container
docker run -p 3001:3001 --env-file .env auth-service
```

## Integration

To integrate with this service, update the API Gateway and backend service to forward authentication requests to this service instead of handling them directly.