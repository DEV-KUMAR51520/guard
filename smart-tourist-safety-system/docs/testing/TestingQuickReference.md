# Smart Tourist Safety System - Testing Quick Reference

This document provides a concise reference for executing the testing workflow for the Smart Tourist Safety System.

## Testing Workflow Summary

### Component Initialization Order

1. **Infrastructure Services**
   - MongoDB → PostgreSQL → RabbitMQ

2. **Backend Services**
   - Blockchain Service → AI Service → Backend API → API Gateway

3. **Frontend Applications**
   - Admin Dashboard → User Dashboard

4. **Test Runner**
   - Integration Test Suite

### Quick Start Commands

#### Start Complete Testing Environment

**Windows:**
```powershell
.\scripts\run-integration-tests.ps1
```

**Linux/macOS:**
```bash
./scripts/run-integration-tests.sh
```

#### Start Individual Components

```bash
# Infrastructure only
docker-compose -f docker-compose.test.yml up -d mongodb postgres rabbitmq

# Backend services only
docker-compose -f docker-compose.test.yml up -d api-gateway backend ai-service blockchain

# Frontend applications only
docker-compose -f docker-compose.test.yml up -d admin-dashboard user-dashboard
```

#### Run Tests

```bash
# Run all tests
docker-compose -f docker-compose.test.yml up test-runner

# Run specific test
docker-compose -f docker-compose.test.yml run --rm test-runner npx playwright test panic-alert-flow.test.js
```

### Verification Checklist

- [ ] MongoDB is running and accessible
- [ ] PostgreSQL is running and accessible
- [ ] RabbitMQ is running and accessible
- [ ] API Gateway is running and returns 200 on health check
- [ ] Backend API is running and returns 200 on health check
- [ ] AI Service is running and returns 200 on health check
- [ ] Blockchain Service is running and returns 200 on health check
- [ ] Admin Dashboard is accessible
- [ ] User Dashboard is accessible
- [ ] Test runner can connect to all services

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Service fails to start | Check logs: `docker-compose -f docker-compose.test.yml logs <service-name>` |
| Database connection error | Verify database is running: `docker-compose -f docker-compose.test.yml ps` |
| Network communication issue | Check Docker network: `docker network inspect tourist-safety-test-network` |
| Test failures | Examine test logs: `cat test-results/test-output.log` |

## Key Test Scenarios

1. **User Registration and Login**
   - Register new user
   - Verify user data in MongoDB
   - Login with created credentials

2. **Panic Alert Flow**
   - User activates panic button
   - Alert stored in PostgreSQL
   - Message published to RabbitMQ
   - Record created in Blockchain
   - Admin receives alert notification

3. **Admin Alert Management**
   - Admin views panic alert
   - Admin resolves alert
   - Alert status updated in PostgreSQL
   - User receives resolution notification

## Environment Variables

Key environment variables for testing:

```
NODE_ENV=test
MONGODB_URI=mongodb://mongodb:27017/tourist_safety_test
POSTGRES_URI=postgresql://postgres:postgres@postgres:5432/tourist_safety_test
RABBITMQ_URI=amqp://guest:guest@rabbitmq:5672
API_GATEWAY_URL=http://api-gateway:3000
JWT_SECRET=test_jwt_secret_key
```

For a complete list, see `tests/test.env`.

## Test Results

Test results are available in the following locations:

- HTML Report: `test-results/html-report/index.html`
- JSON Report: `test-results/test-results.json`
- Screenshots: `test-results/screenshots/`
- Videos: `test-results/videos/` (if enabled)

## Additional Resources

- [Comprehensive Testing Workflow](./ComprehensiveTestingWorkflow.md)
- [Component Interaction Diagram](./ComponentInteractionDiagram.md)
- [Docker Compose Test Configuration](../../docker-compose.test.yml)