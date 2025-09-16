// File: auth-service/utils/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  // Add connection timeout to prevent hanging
  connectionTimeoutMillis: 5000, 
});

// Add an error listener to the pool to catch connection issues
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

console.log("PostgreSQL pool configured for auth-service.");

module.exports = {
  query: (text, params) => pool.query(text, params),
};