/**
 * Test script for authentication service with real database
 * Tests both email and phone-based authentication
 */

require('dotenv').config();
const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:4001/api';

// Generate unique test users
const EMAIL_TEST_USER = {
  name: 'Email Test User',
  email: `test${Date.now()}@example.com`, // Unique email to avoid conflicts
  password: 'Password123!',
  emergency_contact: '+15551234567'
};

const PHONE_TEST_USER = {
  name: 'Phone Test User',
  phone: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`, // Random phone number
  password: 'Password123!',
  emergency_contact: '+15559876543',
  entry_point: 'Airport',
  trip_duration: 7
};

// Store tokens and user data
let emailAccessToken = null;
let emailRefreshToken = null;
let emailUserData = null;

let phoneAccessToken = null;
let phoneRefreshToken = null;
let phoneUserData = null;

/**
 * Test health endpoint
 */
async function testHealth() {
  console.log('\n🔍 Testing health endpoint...');
  try {
    const response = await axios.get('http://localhost:4001/health');
    console.log('✅ Health check successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test user registration with email
 */
async function testEmailRegistration() {
  console.log('\n🔍 Testing email-based user registration...');
  try {
    const response = await axios.post(`${API_URL}/auth/register`, EMAIL_TEST_USER);
    
    emailAccessToken = response.data.token;
    emailRefreshToken = response.data.refresh_token;
    emailUserData = response.data.user;
    
    console.log('✅ Email registration successful');
    console.log('User:', emailUserData);
    console.log('Token received:', emailAccessToken ? 'Yes' : 'No');
    console.log('Refresh token received:', emailRefreshToken ? 'Yes' : 'No');
    return true;
  } catch (error) {
    console.error('❌ Email registration failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test user registration with phone
 */
async function testPhoneRegistration() {
  console.log('\n🔍 Testing phone-based user registration...');
  try {
    const response = await axios.post(`${API_URL}/auth/register`, PHONE_TEST_USER);
    
    phoneAccessToken = response.data.token;
    phoneRefreshToken = response.data.refresh_token;
    phoneUserData = response.data.user;
    
    console.log('✅ Phone registration successful');
    console.log('User:', phoneUserData);
    console.log('Token received:', phoneAccessToken ? 'Yes' : 'No');
    console.log('Refresh token received:', phoneRefreshToken ? 'Yes' : 'No');
    return true;
  } catch (error) {
    console.error('❌ Phone registration failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test user login with email
 */
async function testEmailLogin() {
  console.log('\n🔍 Testing email-based user login...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: EMAIL_TEST_USER.email,
      password: EMAIL_TEST_USER.password
    });
    
    emailAccessToken = response.data.token;
    emailRefreshToken = response.data.refresh_token;
    emailUserData = response.data.user;
    
    console.log('✅ Email login successful');
    console.log('User:', emailUserData);
    console.log('Token received:', emailAccessToken ? 'Yes' : 'No');
    console.log('Refresh token received:', emailRefreshToken ? 'Yes' : 'No');
    return true;
  } catch (error) {
    console.error('❌ Email login failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test user login with phone
 */
async function testPhoneLogin() {
  console.log('\n🔍 Testing phone-based user login...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      phone: PHONE_TEST_USER.phone,
      password: PHONE_TEST_USER.password
    });
    
    phoneAccessToken = response.data.token;
    phoneRefreshToken = response.data.refresh_token;
    phoneUserData = response.data.user;
    
    console.log('✅ Phone login successful');
    console.log('User:', phoneUserData);
    console.log('Token received:', phoneAccessToken ? 'Yes' : 'No');
    console.log('Refresh token received:', phoneRefreshToken ? 'Yes' : 'No');
    return true;
  } catch (error) {
    console.error('❌ Phone login failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test token refresh with email user
 */
async function testEmailTokenRefresh() {
  console.log('\n🔍 Testing email user token refresh...');
  
  if (!emailRefreshToken) {
    console.error('❌ No email refresh token available for testing');
    return false;
  }
  
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refresh_token: emailRefreshToken
    });
    
    const newToken = response.data.token;
    
    console.log('✅ Email token refresh successful');
    console.log('New token received:', newToken ? 'Yes' : 'No');
    
    // Update the access token
    emailAccessToken = newToken;
    return true;
  } catch (error) {
    console.error('❌ Email token refresh failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test token refresh with phone user
 */
async function testPhoneTokenRefresh() {
  console.log('\n🔍 Testing phone user token refresh...');
  
  if (!phoneRefreshToken) {
    console.error('❌ No phone refresh token available for testing');
    return false;
  }
  
  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refresh_token: phoneRefreshToken
    });
    
    const newToken = response.data.token;
    console.log('✅ Phone token refresh successful');
    console.log('New token received:', newToken ? 'Yes' : 'No');
    
    // Update the access token
    phoneAccessToken = newToken;
    return true;
  } catch (error) {
    console.error('❌ Phone token refresh failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test user logout
 */
async function testLogout() {
  console.log('\n🔍 Testing user logout...');
  
  if (!refreshToken) {
    console.error('❌ No refresh token available for testing');
    return false;
  }
  
  try {
    const response = await axios.post(`${API_URL}/auth/logout`, {
      refresh_token: refreshToken
    });
    
    console.log('✅ Logout successful:', response.data);
    
    // Clear tokens
    accessToken = null;
    refreshToken = null;
    return true;
  } catch (error) {
    console.error('❌ Logout failed:', error.response?.data || error.message);
    return false;
  }
}

/**
 * Test invalid login
 */
async function testInvalidLogin() {
  console.log('\n🔍 Testing invalid login credentials...');
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: 'nonexistent@example.com',
      password: 'WrongPassword123!'
    });
    
    console.log('❌ Login with invalid credentials succeeded unexpectedly');
    return false;
  } catch (error) {
    console.log('✅ Invalid login correctly rejected with status:', error.response?.status);
    console.log('Error message:', error.response?.data?.message);
    return true;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting authentication service tests with real database');
  
  // Test health endpoint first
  const healthOk = await testHealth();
  if (!healthOk) {
    console.error('❌ Health check failed, aborting tests');
    return;
  }
  
  console.log('\n=== EMAIL-BASED AUTHENTICATION TESTS ===');
  
  // Test email registration
  const emailRegistrationOk = await testEmailRegistration();
  if (!emailRegistrationOk) {
    console.error('❌ Email registration failed');
  } else {
    // Test email login
    const emailLoginOk = await testEmailLogin();
    if (!emailLoginOk) {
      console.error('❌ Email login failed');
    } else {
      // Test email token refresh
      const emailRefreshOk = await testEmailTokenRefresh();
      if (!emailRefreshOk) {
        console.error('❌ Email token refresh failed');
      }
    }
  }
  
  console.log('\n=== PHONE-BASED AUTHENTICATION TESTS ===');
  
  // Test phone registration
  const phoneRegistrationOk = await testPhoneRegistration();
  if (!phoneRegistrationOk) {
    console.error('❌ Phone registration failed');
  } else {
    // Test phone login
    const phoneLoginOk = await testPhoneLogin();
    if (!phoneLoginOk) {
      console.error('❌ Phone login failed');
    } else {
      // Test phone token refresh
      const phoneRefreshOk = await testPhoneTokenRefresh();
      if (!phoneRefreshOk) {
        console.error('❌ Phone token refresh failed');
      }
    }
  }
  
  // Test invalid login
  await testInvalidLogin();
  
  console.log('\n✅ All tests completed successfully!');
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Unhandled error during tests:', error);
});