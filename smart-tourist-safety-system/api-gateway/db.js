const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool with configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // How long to wait for a connection to become available
});

// Pool error handling
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Pool connect event
pool.on('connect', (client) => {
  console.log('New client connected to PostgreSQL');
});

/**
 * Execute a query with proper error handling
 * @param {string} text - The SQL query text
 * @param {Array} params - The query parameters
 * @returns {Promise} - Query result
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    console.error('Error executing query', { text, error: err.message });
    throw err;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns {Promise} - Client from the pool
 */
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query;
  const release = client.release;
  
  // Set a timeout of 5 seconds on idle clients
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for too long!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);
  
  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return query.apply(client, args);
  };
  
  client.release = () => {
    // Clear the timeout
    clearTimeout(timeout);
    // Set the methods back to their old implementation
    client.query = query;
    client.release = release;
    return release.apply(client);
  };
  
  return client;
};

module.exports = {
  query,
  getClient,
  pool
};
