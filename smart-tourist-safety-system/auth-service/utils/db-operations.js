/**
 * Database operations with retry logic and error handling
 */
const db = require('./db');

// Default retry configuration
const DEFAULT_RETRY_OPTIONS = {
  retries: 3,           // Number of retry attempts
  factor: 2,            // Exponential backoff factor
  minTimeout: 1000,     // Minimum retry timeout in ms
  maxTimeout: 10000,    // Maximum retry timeout in ms
  randomize: true,      // Randomize timeouts
};

/**
 * Execute a database query with retry logic
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @param {Object} options - Retry options
 * @returns {Promise} - Query result
 */
async function executeQuery(text, params, options = {}) {
  const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError = null;
  let attempt = 0;
  
  while (attempt < retryOptions.retries) {
    try {
      return await db.query(text, params);
    } catch (error) {
      lastError = error;
      attempt++;
      
      // Check if we should retry based on error type
      if (!isRetryableError(error) || attempt >= retryOptions.retries) {
        break;
      }
      
      // Calculate backoff delay with exponential factor and randomization
      const delay = calculateBackoff(attempt, retryOptions);
      console.log(`Database query failed, retrying in ${delay}ms (attempt ${attempt}/${retryOptions.retries})`);
      await sleep(delay);
    }
  }
  
  // If we've exhausted all retries, throw the last error
  console.error('Database query failed after multiple retries:', lastError);
  throw lastError;
}

/**
 * Execute a transaction with retry logic
 * @param {Function} callback - Transaction callback function that receives a client
 * @param {Object} options - Retry options
 * @returns {Promise} - Transaction result
 */
async function executeTransaction(callback, options = {}) {
  const retryOptions = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError = null;
  let attempt = 0;
  
  while (attempt < retryOptions.retries) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      lastError = error;
      attempt++;
      
      // Check if we should retry based on error type
      if (!isRetryableError(error) || attempt >= retryOptions.retries) {
        break;
      }
      
      // Calculate backoff delay with exponential factor and randomization
      const delay = calculateBackoff(attempt, retryOptions);
      console.log(`Transaction failed, retrying in ${delay}ms (attempt ${attempt}/${retryOptions.retries})`);
      await sleep(delay);
    } finally {
      client.release();
    }
  }
  
  // If we've exhausted all retries, throw the last error
  console.error('Transaction failed after multiple retries:', lastError);
  throw lastError;
}

/**
 * Check if an error is retryable
 * @param {Error} error - The error to check
 * @returns {boolean} - Whether the error is retryable
 */
function isRetryableError(error) {
  // PostgreSQL error codes that are typically transient and can be retried
  const retryableCodes = [
    '08000', // connection_exception
    '08003', // connection_does_not_exist
    '08006', // connection_failure
    '08001', // sqlclient_unable_to_establish_sqlconnection
    '08004', // sqlserver_rejected_establishment_of_sqlconnection
    '08007', // transaction_resolution_unknown
    '40001', // serialization_failure
    '40P01', // deadlock_detected
    '57P01', // admin_shutdown
    '57P02', // crash_shutdown
    '57P03', // cannot_connect_now
  ];
  
  return (
    error.code && retryableCodes.includes(error.code) ||
    error.message && error.message.includes('connection') ||
    error.message && error.message.includes('timeout')
  );
}

/**
 * Calculate backoff delay with exponential factor and randomization
 * @param {number} attempt - Current attempt number
 * @param {Object} options - Retry options
 * @returns {number} - Delay in milliseconds
 */
function calculateBackoff(attempt, options) {
  let delay = Math.min(
    options.maxTimeout,
    options.minTimeout * Math.pow(options.factor, attempt)
  );
  
  if (options.randomize) {
    delay = Math.random() * delay;
  }
  
  return Math.floor(delay);
}

/**
 * Sleep for a specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Resolves after the specified duration
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  query: executeQuery,
  transaction: executeTransaction,
  // Export the original db methods for direct access
  rawQuery: db.query,
  getClient: db.getClient,
  pool: db.pool,
};