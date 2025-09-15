/**
 * Test script for auth-service with mock database support
 * 
 * This script tests the user registration and login functionality
 * using the mock database implementation.
 * 
 * Usage: node test-auth.js
 */

const axios = require('axios');

// Auth service URL
const AUTH_SERVICE_URL = 'http://localhost:3006';

// Test user credentials for email login
const TEST_USER = {
  email: 'admin@example.com',
  password: 'password123', // This should match the hashed password in mock database
  name: 'Admin User',
  role: 'admin'
};

// Test user credentials for phone login
const TEST_USER_PHONE = {
  phone: '+1122334455',
  password: 'password123',
  name: 'Regular User',
  role: 'user',
  email: 'user@example.com' // Added email to match mock database
};

// Test new user for registration
const NEW_USER = {
  name: 'New Test User',
  email: 'newuser@example.com',
  phone: '+1234567890',
  password: 'password123',
  role: 'user',
  emergency_contact: '+0987654321'
};

// Test new tourist for registration
const NEW_TOURIST = {
  name: 'New Test Tourist',
  phone: '+5566778899',
  password: 'password123',
  aadhaar_hash: 'new-test-aadhaar-hash',
  emergency_contact: '+5566778899',
  entry_point: 'North Gate',
  trip_duration: '7 days'
};

/**
 * Test health endpoint
 */
async function testHealth() {
  try {
    console.log('\n--- Testing Health Endpoint ---');
    const response = await axios.get(`${AUTH_SERVICE_URL}/health`);
    console.log('Health Status:', response.data);
    return true;
  } catch (error) {
    console.error('Health check failed:', error.message);
    return false;
  }
}

/**
 * Test login endpoint with email
 */
async function testLoginWithEmail() {
  try {
    console.log('\n--- Testing Login with Email ---');
    
    // Log the request for debugging
    console.log('Sending login request with email:', 'admin@example.com');
    
    // Use the admin credentials from the mock database
    // The password must match the bcrypt hash in the mock database
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return null;
  }
}

/**
 * Test login endpoint with phone
 */
async function testLoginWithPhone() {
  try {
    console.log('\n--- Testing Login with Phone ---');
    
    // Log the request for debugging
    console.log('Sending login request with phone:', '+1122334455');
    
    // Only send phone and password for phone login
    // Using the phone number from the mock database
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, {
      phone: '+1122334455', // This matches the Regular User in mock database
      password: 'password123'
    });
    console.log('Login successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return null;
  }
}

/**
 * Test user registration endpoint
 */
async function testRegisterUser() {
  try {
    console.log('\n--- Testing User Registration ---');
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/register`, NEW_USER);
    console.log('Registration successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    return response.data.token;
  } catch (error) {
    console.error('Registration failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

/**
 * Test tourist registration endpoint
 */
async function testRegisterTourist() {
  try {
    console.log('\n--- Testing Tourist Registration ---');
    // Use the regular registration endpoint with tourist-specific fields
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/register`, NEW_TOURIST);
    console.log('Registration successful!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    return response.data.token;
  } catch (error) {
    console.error('Registration failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting auth-service tests with mock database...');
  
  // Test health endpoint
  const healthOk = await testHealth();
  if (!healthOk) {
    console.error('Health check failed, aborting tests');
    return;
  }
  
  // Test login endpoints with existing users
  const loginEmailToken = await testLoginWithEmail();
  const loginPhoneToken = await testLoginWithPhone();
  
  // Test registration endpoints
  const registerUserToken = await testRegisterUser();
  const registerTouristToken = await testRegisterTourist();
  
  console.log('\n--- Test Summary ---');
  console.log('Health Check:', healthOk ? 'PASSED' : 'FAILED');
  console.log('Login with Email Test:', loginEmailToken ? 'PASSED' : 'FAILED');
  console.log('Login with Phone Test:', loginPhoneToken ? 'PASSED' : 'FAILED');
  console.log('User Registration Test:', registerUserToken ? 'PASSED' : 'FAILED');
  console.log('Tourist Registration Test:', registerTouristToken ? 'PASSED' : 'FAILED');
  console.log('\nMock database is ' + (process.env.MOCK_DB === 'true' ? 'ENABLED' : 'DISABLED'));
}

// Run the tests
runTests().catch(error => {
  console.error('Test error:', error);
});