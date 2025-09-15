# Auth Service and API Gateway: Roles and Responsibilities

## System Architecture Overview

The Smart Tourist Safety System employs a microservices architecture where the Auth Service and API Gateway play distinct but complementary roles. This document clarifies their responsibilities and interactions.

## Auth Service

### Primary Responsibilities

1. **Centralized Authentication Logic**
   - User registration with validation
   - Secure login with JWT token generation
   - Token verification
   - Password hashing and security

2. **User Data Management**
   - Storing user credentials securely
   - Managing user profiles
   - Handling role-based access control

3. **Integration with Blockchain**
   - Creating digital identities for users
   - Verifying digital IDs

4. **Database Operations**
   - Direct interaction with the PostgreSQL database for user data
   - Connection pooling and optimization
   - Health monitoring of database connections

### API Endpoints

- `POST /api/auth/register` - Register new users
- `POST /api/auth/login` - Authenticate users and issue tokens
- `GET /api/auth/verify` - Verify JWT tokens
- `GET /api/auth/role` - Get user role information
- `GET /health` - Check service health status

## API Gateway

### Primary Responsibilities

1. **Request Routing**
   - Acting as the single entry point for all client requests
   - Routing requests to appropriate microservices
   - Load balancing across service instances

2. **Authentication Proxy**
   - Forwarding authentication requests to the Auth Service
   - Validating tokens for protected routes
   - Adding user context to requests

3. **Request/Response Transformation**
   - Handling file uploads (e.g., profile pictures)
   - Transforming data between clients and services

4. **Business Logic**
   - Managing incidents, alerts, and tourist tracking
   - Handling emergency response workflows
   - Coordinating between multiple services

5. **Direct Database Access**
   - For non-authentication related operations
   - Tourist location updates
   - Incident management

### API Endpoints

- Authentication routes (proxied to Auth Service)
- Tourist management routes
- Incident and alert management
- Location tracking
- Health checks

## Interaction Between Components

### Authentication Flow

1. Client sends authentication request to API Gateway
2. API Gateway forwards request to Auth Service
3. Auth Service processes the request and returns response (token/user data)
4. API Gateway forwards response back to client

### Protected Route Access

1. Client sends request with JWT token to API Gateway
2. API Gateway middleware extracts token
3. API Gateway calls Auth Service to verify token
4. Upon successful verification, API Gateway adds user context to request
5. Request is forwarded to appropriate service

## Configuration Relationship

### Shared Configuration

Both services require access to:
- Database credentials
- JWT secret (must be identical for token validation)
- Service URLs

### Configuration Independence

Each service maintains its own:
- Port configuration
- Connection pool settings
- Health check parameters
- Service-specific settings

## Potential Configuration Conflicts

1. **Database Access**
   - Both services connect to the same database
   - Credentials must be consistent
   - No conflict if using the same connection parameters

2. **JWT Secret**
   - Must be identical across services for token validation
   - Different secrets would cause authentication failures

3. **Service URLs**
   - API Gateway must know the correct Auth Service URL
   - In containerized environments, service discovery is critical

## Best Practices

1. **Environment Variables**
   - Use environment-specific .env files
   - Keep sensitive information out of source control
   - Use consistent naming conventions

2. **Service Discovery**
   - In production, implement service discovery
   - For development, use consistent localhost ports

3. **Configuration Management**
   - Centralize configuration when possible
   - Document all required environment variables
   - Provide example configurations

4. **Error Handling**
   - Implement graceful degradation
   - Handle service unavailability
   - Provide meaningful error messages