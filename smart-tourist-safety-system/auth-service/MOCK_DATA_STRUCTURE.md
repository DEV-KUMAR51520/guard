# Mock Data Structure for Auth Service

This document provides comprehensive details about the mock data structure used for user registration and login functionality in the auth service when real-time database connections are not available.

## Overview

The mock database implementation is designed to simulate a PostgreSQL database for testing and development purposes. It is enabled by setting `MOCK_DB=true` in the `.env` file.

## Data Models

### Users

The `users` table stores information about registered users in the system.

```javascript
{
  id: Number,               // Unique identifier
  name: String,             // Full name of the user
  email: String,            // Email address (unique)
  phone: String,            // Phone number (unique)
  password: String,         // Bcrypt hashed password
  role: String,             // User role (admin, user)
  emergency_contact: String, // Emergency contact phone number
  created_at: String,       // ISO timestamp of creation
  updated_at: String        // ISO timestamp of last update
}
```

**Validation Requirements:**
- `name`: Required, non-empty string
- `email` or `phone`: At least one is required and must be unique
- `password`: Minimum 6 characters, stored as bcrypt hash
- `role`: Default is 'user'

### Tourists

The `tourists` table stores information specific to tourists, which can be linked to a user account or exist independently for phone-based authentication.

```javascript
{
  id: Number,                 // Unique identifier
  user_id: Number,            // Optional reference to users table
  name: String,               // Tourist's full name
  phone: String,              // Phone number (unique)
  password_hash: String,      // Bcrypt hashed password
  aadhaar_hash: String,       // Hashed ID number (unique)
  blockchain_id: String,      // Blockchain reference ID (unique)
  emergency_contact: String,  // Emergency contact phone number
  entry_point: String,        // Entry point to the tourist destination
  trip_duration: String,      // Duration of the trip
  current_latitude: Number,   // Current latitude coordinate
  current_longitude: Number,  // Current longitude coordinate
  status: String,             // Current status (Safe, Alert, Emergency)
  last_updated: String        // ISO timestamp of last update
}
```

**Validation Requirements:**
- `name`: Required, non-empty string
- `phone`: Required, unique
- `password_hash`: Required, bcrypt hash
- `status`: Default is 'Safe'

### Refresh Tokens

The `refresh_tokens` table stores JWT refresh tokens for maintaining user sessions.

```javascript
{
  id: Number,        // Unique identifier
  user_id: Number,   // Reference to users table
  token: String,     // JWT refresh token (unique)
  expires_at: String, // ISO timestamp of expiration
  created_at: String  // ISO timestamp of creation
}
```

### Incidents

The `incidents` table stores information about reported incidents involving tourists.

```javascript
{
  id: Number,              // Unique identifier
  tourist_id: Number,      // Reference to tourists table
  incident_type: String,   // Type of incident
  description: String,     // Description of the incident
  latitude: Number,        // Latitude coordinate of incident
  longitude: Number,       // Longitude coordinate of incident
  status: String,          // Status (Reported, In Progress, Resolved)
  reported_at: String,     // ISO timestamp of report
  resolved_at: String      // ISO timestamp of resolution (if resolved)
}
```

### Alerts

The `alerts` table stores information about alerts for specific regions.

```javascript
{
  id: Number,           // Unique identifier
  region: String,       // Region name
  alert_type: String,   // Type of alert (Weather, Security, etc.)
  severity: String,     // Severity level (Low, Medium, High)
  message: String,      // Alert message
  latitude: Number,     // Latitude coordinate of alert center
  longitude: Number,    // Longitude coordinate of alert center
  radius: Number,       // Radius of affected area in km
  created_at: String,   // ISO timestamp of creation
  expires_at: String    // ISO timestamp of expiration
}
```

## Authentication Flow

### User Registration

1. Validate input data (name, email/phone, password)
2. Check if user already exists
3. Hash the password using bcrypt
4. Create new user record
5. Optionally create tourist record if tourist-specific data is provided
6. Generate JWT token and refresh token
7. Store refresh token in database
8. Return token and user information

### User Login

1. Validate input data (email/phone, password)
2. Find user by email or phone
3. If not found in users table, try tourists table for phone-based login
4. Verify password using bcrypt
5. Generate JWT token and refresh token
6. Store refresh token in database
7. Return token and user information

## Mock Implementation

The mock database implementation in `db.js` provides simulated responses for common database operations:

- Table existence checks
- User registration
- Tourist registration
- User login by email or phone
- Refresh token management
- Health checks and diagnostics

## Sample Data

The mock database is pre-populated with sample data for testing:

- Admin user: `admin@example.com` / `password123`
- Regular user: `user@example.com` / `password123`
- Tourist: Phone `+9876543210` / `password123`

## Usage

To use the mock database implementation:

1. Set `MOCK_DB=true` in the `.env` file
2. Start the auth service
3. Use the API endpoints as normal

The mock implementation will simulate database operations without requiring a real PostgreSQL connection.