/**
 * Database connection tests
 */
const db = require('../utils/db');
const dbOperations = require('../utils/db-operations');
const dbHealth = require('../utils/db-health');

// Load environment variables
require('dotenv').config();

// Simple test to verify database connection
async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    // Test basic connection
    const result = await db.query('SELECT NOW() as current_time');
    console.log('Database connection successful!');
    console.log('Current database time:', result.rows[0].current_time);
    
    // Test connection pool
    console.log('\nTesting connection pool...');
    const client = await db.getClient();
    console.log('Successfully acquired client from pool');
    client.release();
    console.log('Successfully released client back to pool');
    
    // Test retry logic
    console.log('\nTesting retry logic with valid query...');
    const retryResult = await dbOperations.query('SELECT 1 as test');
    console.log('Retry logic test successful:', retryResult.rows[0].test === 1);
    
    // Test health check
    console.log('\nTesting health check...');
    const healthStatus = await dbHealth.checkHealth();
    console.log('Health check result:', healthStatus.isHealthy ? 'HEALTHY' : 'UNHEALTHY');
    console.log('Response time:', healthStatus.responseTime, 'ms');
    
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error.message);
    return false;
  } finally {
    // Close the pool
    console.log('\nClosing connection pool...');
    await db.pool.end();
    console.log('Connection pool closed');
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    console.log('\nTest completed:', success ? 'SUCCESS' : 'FAILURE');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Test error:', err);
    process.exit(1);
  });