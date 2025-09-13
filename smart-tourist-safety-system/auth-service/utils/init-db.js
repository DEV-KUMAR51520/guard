const db = require('./db');

async function initializeDatabase() {
  try {
    console.log('Initializing database schema...');
    
    // Check if tourists table exists
    const tableCheck = await db.query(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tourists')"
    );
    
    if (!tableCheck.rows[0].exists) {
      console.log('Creating tourists table...');
      
      // Create tourists table
      await db.query(`
        CREATE TABLE tourists (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE,
          phone VARCHAR(20) UNIQUE,
          password VARCHAR(100) NOT NULL,
          aadhaar VARCHAR(12) UNIQUE,
          blockchain_id VARCHAR(100),
          role VARCHAR(20) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Tourists table created successfully');
    } else {
      console.log('Tourists table already exists');
      
      // Check if role column exists
      const roleColumnCheck = await db.query(
        "SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'tourists' AND column_name = 'role')"
      );
      
      if (!roleColumnCheck.rows[0].exists) {
        console.log('Adding role column to tourists table...');
        await db.query("ALTER TABLE tourists ADD COLUMN role VARCHAR(20) DEFAULT 'user'");
        console.log('Role column added successfully');
      }
    }
    
    console.log('Database initialization completed successfully');
  } catch (err) {
    console.error('Database initialization error:', err.message);
    throw err;
  }
}

module.exports = { initializeDatabase };