/**
 * Database health check utilities
 */

const db = require('./db');

// Health status tracking
let healthStatus = {
  isHealthy: true,                  // Current health status
  lastChecked: new Date(),          // Timestamp of last check
  consecutiveFailures: 0,           // Count of consecutive failures
  consecutiveSuccesses: 1,          // Count of consecutive successes
  responseTime: 0,                  // Last response time in ms
  error: null,                      // Last error message
};

// Health check interval reference
let healthCheckInterval = null;

// Default configuration
const defaultConfig = {
  interval: 30000,                  // Check every 30 seconds
  unhealthyThreshold: 3,            // Number of failures before marking unhealthy
  healthyThreshold: 2,              // Number of successes before marking healthy
  timeout: 5000,                    // Query timeout in ms
};

/**
 * Start periodic health checks
 * @param {Object} config - Health check configuration
 * @param {Function} onStatusChange - Callback for status changes
 */
function startHealthChecks(config = {}, onStatusChange = null) {
  // Merge provided config with defaults
  const mergedConfig = { ...defaultConfig, ...config };
  console.log('Starting database health checks with config:', mergedConfig);
  
  // Clear any existing interval
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  // Perform an initial health check
  checkHealth().then(status => {
    if (onStatusChange) {
      onStatusChange(status);
    }
  });
  
  // Set up periodic health checks
  healthCheckInterval = setInterval(async () => {
    const status = await checkHealth();
    
    // If status changed and callback provided, call it
    if (onStatusChange && 
        (status.consecutiveFailures === mergedConfig.unhealthyThreshold || 
         status.consecutiveSuccesses === mergedConfig.healthyThreshold)) {
      onStatusChange(status);
    }
  }, mergedConfig.interval);
  
  return healthCheckInterval;
}

/**
 * Stop periodic health checks
 */
function stopHealthChecks() {
  console.log('Stopping database health checks');
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
}

/**
 * Perform a single health check
 * @returns {Object} - Current health status
 */
async function checkHealth() {
  console.log('Performing database health check');
  const start = Date.now();
  
  try {
    // Comprehensive health check with multiple queries
    const results = {};
    
    // Test 1: Basic connectivity check
    const connectivityResult = await db.query('SELECT 1 as connectivity_check', []);
    results.connectivity = connectivityResult.rows[0].connectivity_check === 1;
    
    // Test 2: Check database version
    const versionResult = await db.query('SELECT version()', []);
    results.version = versionResult.rows[0].version;
    
    // Test 3: Check if critical tables exist
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND 
            table_name IN ('users', 'refresh_tokens', 'tourists', 'incidents', 'alerts')
    `, []);
    results.tables = {
      count: tablesResult.rowCount,
      names: tablesResult.rows.map(row => row.table_name)
    };
    
    // Test 4: Check database size and statistics
    const dbStatsResult = await db.query(`
      SELECT pg_database_size(current_database()) as db_size,
             pg_size_pretty(pg_database_size(current_database())) as db_size_pretty
    `, []);
    results.dbSize = {
      bytes: parseInt(dbStatsResult.rows[0].db_size),
      pretty: dbStatsResult.rows[0].db_size_pretty
    };
    
    // Test 5: Check active connections
    const connectionsResult = await db.query(`
      SELECT count(*) as connection_count 
      FROM pg_stat_activity 
      WHERE datname = current_database()
    `, []);
    results.connections = parseInt(connectionsResult.rows[0].connection_count);
    
    // Calculate response time
    const responseTime = Date.now() - start;
    
    // Update health status
    healthStatus.lastChecked = new Date();
    healthStatus.responseTime = responseTime;
    healthStatus.consecutiveSuccesses += 1;
    healthStatus.consecutiveFailures = 0;
    healthStatus.error = null;
    healthStatus.details = results;
    
    // Mark as healthy after consecutive successes
    if (healthStatus.consecutiveSuccesses >= defaultConfig.healthyThreshold) {
      healthStatus.isHealthy = true;
    }
    
    console.log(`Database health check successful (${responseTime}ms)`);
    console.log(`Database version: ${results.version}`);
    console.log(`Tables found: ${results.tables.count}/${5} (${results.tables.names.join(', ')})`);
    console.log(`Database size: ${results.dbSize.pretty}`);
    console.log(`Active connections: ${results.connections}`);
  } catch (error) {
    // Calculate response time even for failures
    const responseTime = Date.now() - start;
    
    // Update health status
    healthStatus.lastChecked = new Date();
    healthStatus.responseTime = responseTime;
    healthStatus.consecutiveSuccesses = 0;
    healthStatus.consecutiveFailures += 1;
    healthStatus.error = error.message;
    
    // Mark as unhealthy after consecutive failures
    if (healthStatus.consecutiveFailures >= defaultConfig.unhealthyThreshold) {
      healthStatus.isHealthy = false;
    }
    
    console.error(`Database health check failed (${responseTime}ms):`, error.message);
  }
  
  return { ...healthStatus };
}

/**
 * Get current health status
 * @returns {Object} - Current health status
 */
function getHealthStatus() {
  return { ...healthStatus };
}

module.exports = {
  startHealthChecks,
  stopHealthChecks,
  checkHealth,
  getHealthStatus,
};