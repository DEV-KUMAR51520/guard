/**
 * Database initialization for authentication service
 */

const db = require('./db');

/**
 * Initialize the database schema
 */
async function initializeDatabase() {
  console.log('Initializing database schema...');
  
  try {
    // Check if users table exists
    const usersTableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users')"
    );
    
    // If users table doesn't exist, create it
    if (!usersTableCheck.rows[0].exists) {
      console.log('Creating users table...');
      await db.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          phone VARCHAR(20) UNIQUE,
          password VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL DEFAULT 'user',
          emergency_contact VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Users table created successfully');
    } else {
      console.log('Users table already exists');
    }
    
    // Check if refresh_tokens table exists
    const tokenTableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'refresh_tokens')"
    );
    
    // If refresh_tokens table doesn't exist, create it
    if (!tokenTableCheck.rows[0].exists) {
      console.log('Creating refresh_tokens table...');
      await db.query(`
        CREATE TABLE refresh_tokens (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Refresh tokens table created successfully');
    } else {
      console.log('Refresh tokens table already exists');
    }
    
    // Check if tourists table exists
    const touristsTableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tourists')"
    );
    
    // If tourists table doesn't exist, create it
    if (!touristsTableCheck.rows[0].exists) {
      console.log('Creating tourists table...');
      await db.query(`
        CREATE TABLE tourists (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(20) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          aadhaar_hash VARCHAR(64) UNIQUE,
          blockchain_id VARCHAR(255) UNIQUE,
          emergency_contact VARCHAR(255),
          entry_point VARCHAR(255),
          trip_duration VARCHAR(50),
          current_latitude NUMERIC(10, 8),
          current_longitude NUMERIC(11, 8),
          status VARCHAR(50) DEFAULT 'Safe' NOT NULL,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Tourists table created successfully');
    } else {
      console.log('Tourists table already exists');
    }
    
    // Check if incidents table exists
    const incidentsTableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'incidents')"
    );
    
    // If incidents table doesn't exist, create it
    if (!incidentsTableCheck.rows[0].exists) {
      console.log('Creating incidents table...');
      await db.query(`
        CREATE TABLE incidents (
          id SERIAL PRIMARY KEY,
          tourist_id INTEGER REFERENCES tourists(id) ON DELETE CASCADE NOT NULL,
          latitude NUMERIC(10, 8),
          longitude NUMERIC(11, 8),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
          resolved_at TIMESTAMP WITH TIME ZONE,
          transaction_hash VARCHAR(66) UNIQUE
        )
      `);
      console.log('Incidents table created successfully');
    } else {
      console.log('Incidents table already exists');
    }
    
    // Check if alerts table exists
    const alertsTableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'alerts')"
    );
    
    // If alerts table doesn't exist, create it
    if (!alertsTableCheck.rows[0].exists) {
      console.log('Creating alerts table...');
      await db.query(`
        CREATE TABLE alerts (
          id SERIAL PRIMARY KEY,
          tourist_id INTEGER REFERENCES tourists(id) ON DELETE CASCADE NOT NULL,
          risk_level VARCHAR(50) NOT NULL,
          latitude NUMERIC(10, 8),
          longitude NUMERIC(11, 8),
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
      `);
      console.log('Alerts table created successfully');
    } else {
      console.log('Alerts table already exists');
    }
    
    console.log('Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database schema:', error.message);
    return false;
  }
}

module.exports = { initializeDatabase };