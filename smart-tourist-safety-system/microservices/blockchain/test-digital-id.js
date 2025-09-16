/**
 * Test script for Digital ID generation
 */

const axios = require('axios');

// Blockchain service URL
const BLOCKCHAIN_SERVICE_URL = 'http://localhost:5002';

// Test data for Digital ID generation
const TEST_DATA = {
  aadhaarHash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
};

async function testDigitalIdGeneration() {
  console.log('Testing Digital ID generation...');
  
  try {
    // Test health endpoint
    console.log('\n--- Testing Blockchain Service Health ---');
    try {
      await axios.get(`${BLOCKCHAIN_SERVICE_URL}/health`);
      console.log('Health check successful!');
    } catch (error) {
      console.log('Health check failed. This is expected if the health endpoint is not implemented.');
    }
    
    // Test Digital ID generation
    console.log('\n--- Testing Digital ID Generation ---');
    console.log(`Sending request with Aadhaar hash: ${TEST_DATA.aadhaarHash}`);
    
    try {
      const response = await axios.post(`${BLOCKCHAIN_SERVICE_URL}/api/blockchain/register`, {
        aadhaarHash: TEST_DATA.aadhaarHash
      });
      
      console.log('Digital ID generation successful!');
      console.log(`Blockchain ID: ${response.data.blockchainId}`);
      
      // Test fetching Aadhaar hash
      console.log('\n--- Testing Fetching Aadhaar Hash ---');
      const touristId = response.data.blockchainId;
      console.log(`Fetching Aadhaar hash for tourist ID: ${touristId}`);
      
      try {
        const hashResponse = await axios.get(`${BLOCKCHAIN_SERVICE_URL}/api/blockchain/tourist/${touristId}`);
        console.log('Fetching Aadhaar hash successful!');
        console.log(`Aadhaar hash: ${hashResponse.data.aadhaarHash}`);
        
        // Verify the hash matches
        if (hashResponse.data.aadhaarHash === TEST_DATA.aadhaarHash) {
          console.log('Hash verification successful!');
        } else {
          console.log('Hash verification failed!');
          console.log(`Expected: ${TEST_DATA.aadhaarHash}`);
          console.log(`Received: ${hashResponse.data.aadhaarHash}`);
        }
      } catch (error) {
        console.error('Error fetching Aadhaar hash:', error.message);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error config:', error.config);
        }
      }
    } catch (error) {
      console.error('Error generating Digital ID:', error.message);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error config:', error.config);
      }
    }
    
    console.log('\n--- Test Summary ---');
    console.log('Digital ID Generation Test Completed');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the tests
testDigitalIdGeneration();