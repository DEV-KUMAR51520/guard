/**
 * Database health check utilities
 */
const db = require('./db');

// Health check configuration
const HEALTH_CHECK_CONFIG = {
  query: 'SELECT 1',                // Simple query to test database connectivity
  timeout: 5000,                    // Timeout for health check query in ms
  interval: 30000,                  // Interval between health checks in ms
  unhealthyThreshold: 3,            // Number of consecutive failures to mark as unhealthy
  healthyThreshold: 2,              // Number of consecutive successes to mark as healthy
  maxResponseTime: 1000,            // Maximum acceptable response time in ms
};

// Health status tracking
let healthStatus = {
  isHealthy: true,                  // Current health status
  lastChecked: null,                // Timestamp of last check
  consecutiveFailures: 0,           // Count of consecutive failures
  consecutiveSuccesses: 0,          // Count of consecutive successes
  responseTime: 0,                  // Last response time in ms
  error: null,                      // Last error message
};

// Health check interval reference
let healthCheckInterval = null;

/**
 * Start periodic health checks
 * @param {Object} config - Health check configuration
 * @param {Function} onStatusChange - Callback for status changes
 */
function startHealthChecks(config = {}, onStatusChange = null) {
  const mergedConfig = { ...HEALTH_CHECK_CONFIG, ...config };
  
  // Clear any existing interval
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  // Start periodic health checks
  healthCheckInterval = setInterval(async () => {
    const prevStatus = healthStatus.isHealthy;
    await checkHealth(mergedConfig);
    
    // Notify if status changed
    if (onStatusChange && prevStatus !== healthStatus.isHealthy) {
      onStatusChange(healthStatus);
    }
  }, mergedConfig.interval);
  
  // Run an initial health check
  checkHealth(mergedConfig);
  
  return healthCheckInterval;
}

/**
 * Stop periodic health checks
 */
function stopHealthChecks() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
  }
}

/**
 * Perform a single health check
 * @param {Object} config - Health check configuration
 * @returns {Object} - Current health status
 */
async function checkHealth(config = {}) {
  const mergedConfig = { ...HEALTH_CHECK_CONFIG, ...config };
  const startTime = Date.now();
  
  try {
    // Set up a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Health check query timed out')), mergedConfig.timeout);
    });
    
    // Execute the health check query with timeout
    await Promise.race([
      db.query(mergedConfig.query),
      timeoutPromise
    ]);
    
    // Calculate response time
    const responseTime = Date.now() - startTime;
    
    // Check if response time is acceptable
    if (responseTime > mergedConfig.maxResponseTime) {
      throw new Error(`Response time (${responseTime}ms) exceeded threshold (${mergedConfig.maxResponseTime}ms)`);
    }
    
    // Update health status for success
    healthStatus.consecutiveSuccesses++;
    healthStatus.consecutiveFailures = 0;
    healthStatus.responseTime = responseTime;
    healthStatus.lastChecked = new Date();
    healthStatus.error = null;
    
    // Mark as healthy if we've reached the threshold
    if (healthStatus.consecutiveSuccesses >= mergedConfig.healthyThreshold) {
      healthStatus.isHealthy = true;
    }
  } catch (error) {
    // Update health status for failure
    healthStatus.consecutiveFailures++;
    healthStatus.consecutiveSuccesses = 0;
    healthStatus.responseTime = Date.now() - startTime;
    healthStatus.lastChecked = new Date();
    healthStatus.error = error.message;
    
    // Mark as unhealthy if we've reached the threshold
    if (healthStatus.consecutiveFailures >= mergedConfig.unhealthyThreshold) {
      healthStatus.isHealthy = false;
    }
    
    console.error('Database health check failed:', error.message);
  }
  
  return healthStatus;
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