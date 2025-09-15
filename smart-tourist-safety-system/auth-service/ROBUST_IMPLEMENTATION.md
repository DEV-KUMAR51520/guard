# Auth Service Robust Implementation

## Overview

This document describes the robust implementation of the auth-service that provides secure user authentication with persistent storage in PostgreSQL.

## Implementation Details

### Database Integration

The auth-service now uses a PostgreSQL database for persistent storage of user data and refresh tokens:

- `utils/db.js`: Implements a connection pool with proper error handling and query logging
- `utils/db-health.js`: Performs real health checks on the database connection
- `utils/init-db.js`: Creates necessary database tables if they don't exist

### Database Schema

The implementation includes two main tables:

1. **users** - Stores user information
   - id (SERIAL PRIMARY KEY)
   - name (VARCHAR)
   - email (VARCHAR, UNIQUE)
   - password (VARCHAR, hashed)
   - role (VARCHAR)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. **refresh_tokens** - Stores refresh tokens for JWT authentication
   - id (SERIAL PRIMARY KEY)
   - user_id (INTEGER, FOREIGN KEY)
   - token (VARCHAR, UNIQUE)
   - expires_at (TIMESTAMP)
   - created_at (TIMESTAMP)

### Authentication Features

The authentication system now includes:

- Secure password hashing using bcrypt
- JWT token generation for authentication
- Refresh token mechanism for extended sessions
- Input validation using express-validator
- Proper error handling and logging

### API Endpoints

1. **Register** - `POST /api/auth/register`
   - Creates a new user account
   - Validates input data
   - Hashes password securely
   - Returns JWT token, refresh token, and user data

2. **Login** - `POST /api/auth/login`
   - Authenticates existing users
   - Verifies password against hashed value
   - Returns JWT token, refresh token, and user data

3. **Refresh Token** - `POST /api/auth/refresh`
   - Generates a new JWT token using a valid refresh token
   - Verifies refresh token validity and expiration
   - Returns a new JWT token and user data

4. **Logout** - `POST /api/auth/logout`
   - Invalidates refresh token
   - Provides clean session termination

## Usage

### Starting the Service

To start the auth-service with the robust implementation:

```bash
cd auth-service
node index.js
```

### Testing the Authentication Flow

A test script is provided to verify the complete authentication flow:

```bash
cd auth-service
node test-auth-real.js
```

The test script verifies:
- Health endpoint
- User registration
- User login
- Token refresh
- User logout

## Configuration

The service is configured using environment variables in the `.env` file:

```
# Database Connection
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
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
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=86400
```

## Security Considerations

- Passwords are hashed using bcrypt with salt
- JWT tokens have configurable expiration
- Refresh tokens are stored in the database with expiration
- Input validation prevents common injection attacks
- Database queries use parameterized statements to prevent SQL injection

## Notes

- This implementation provides a robust authentication system suitable for production use
- The PostgreSQL database must be properly configured and running
- For production deployment, ensure proper security measures for the JWT secret