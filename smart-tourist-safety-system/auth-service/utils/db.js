const { Pool } = require('pg');
require('dotenv').config();

// Log database configuration parameters (without sensitive info)
console.log('Database configuration:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'tourist_safety',
  user: process.env.DB_USER,
  // Password hidden for security
});

// For testing purposes, we'll create a mock database connection
// This allows us to test the auth service without an actual database connection
const isTesting = process.env.NODE_ENV === 'test' || process.env.MOCK_DB === 'true';

// Enhanced pool configuration with connection pooling optimization
let pool;

// Mock database storage for testing with comprehensive data structure
const mockDb = {
  users: [
    {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      phone: null,
      password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // password123
      role: 'admin',
      emergency_contact: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'Regular User',
      email: 'user@example.com',
      phone: '+1122334455',
      password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // password123
      role: 'user',
      emergency_contact: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],
  tourists: [
    {
      id: 1,
      name: 'Test Tourist',
      phone: '+9876543210',
      password_hash: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // password123
      aadhaar_hash: 'test-aadhaar-hash',
      blockchain_id: 'test-blockchain-id',
      emergency_contact: '+1234567890',
      entry_point: 'North Gate',
      trip_duration: '5 days',
      current_latitude: 34.0522,
      current_longitude: -118.2437,
      status: 'Safe',
      last_updated: new Date().toISOString()
    },
    {
      id: 2,
      user_id: 2,
      name: 'Tourist Two',
      phone: '+8765432109',
      password_hash: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1BD7WC', // 'password123'
      aadhaar_hash: 'j9i8h7g6f5e4d3c2b1a0', // Hashed ID number
      blockchain_id: 'tourist_blockchain_id_2',
      emergency_contact: '+2233445566',
      entry_point: 'Train Station',
      trip_duration: '14 days',
      current_latitude: 19.0760,
      current_longitude: 72.8777,
      status: 'Safe',
      last_updated: new Date().toISOString()
    }
  ],
  refresh_tokens: [],
  incidents: [
    {
      id: 1,
      tourist_id: 1,
      incident_type: 'Medical Emergency',
      description: 'Tourist reported feeling unwell',
      latitude: 28.7041,
      longitude: 77.1025,
      status: 'Resolved',
      reported_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  alerts: [
    {
      id: 1,
      region: 'North Delhi',
      alert_type: 'Weather',
      severity: 'Medium',
      message: 'Heavy rainfall expected in the next 24 hours',
      latitude: 28.7041,
      longitude: 77.1025,
      radius: 50, // km
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

if (isTesting) {
  // Mock pool for testing
  console.log('Using mock database connection for testing');
  pool = {
    query: async (text, params) => {
      console.log('Mock query:', { text, params });
      
      // Table existence checks
      if (text.includes("information_schema.tables WHERE table_name = '")) {
        const tableName = text.match(/table_name = '(\w+)'/)[1];
        return { rows: [{ exists: Object.keys(mockDb).includes(tableName) }] };
      }
      
      // User registration
      if (text.includes('INSERT INTO users')) {
        const newUser = {
          id: mockDb.users.length + 1,
          name: params[0],
          email: params[1],
          phone: params[2] || null,
          password: params[3], // Hashed password
          role: 'user',
          emergency_contact: params[4] || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockDb.users.push(newUser);
        return { rows: [newUser] };
      }
      
      // Tourist registration
      if (text.includes('INSERT INTO tourists')) {
        const newTourist = {
          id: mockDb.tourists.length + 1,
          user_id: params[0],
          current_location: params[1] || null,
          travel_start_date: params[2] || new Date().toISOString(),
          travel_end_date: params[3] || null,
          emergency_contact_name: params[4] || null,
          emergency_contact_phone: params[5] || null,
          medical_conditions: params[6] || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockDb.tourists.push(newTourist);
        return { rows: [newTourist] };
      }
      
      // User login by email
      if (text.includes('SELECT * FROM users WHERE email =')) {
        const email = params[0];
        const user = mockDb.users.find(u => u.email === email);
        if (user) {
          // Clone the user object to avoid modifying the original
          const userClone = {...user};
          // Ensure the password field is named correctly for bcrypt.compare
          userClone.password = user.password;
          console.log('Login by email - User found:', true, 'Email:', email);
          console.log('User password hash:', userClone.password);
          return {
            rows: [userClone],
            rowCount: 1
          };
        }
        console.log('Login by email - User found:', false, 'Email:', email);
        return {
          rows: [],
          rowCount: 0
        };
      }
      
      // User login by phone
      if (text.includes('SELECT * FROM users WHERE phone =')) {
        const phone = params[0];
        const user = mockDb.users.find(u => u.phone === phone);
        if (user) {
          // Clone the user object to avoid modifying the original
          const userClone = {...user};
          // Ensure the password field is named correctly for bcrypt.compare
          userClone.password = user.password;
          console.log('Mock DB: Found user by phone:', phone);
          console.log('User password hash:', userClone.password);
          return {
            rows: [userClone],
            rowCount: 1
          };
        }
        console.log('Mock DB: User not found by phone:', phone);
        return {
          rows: [],
          rowCount: 0
        };
      }
      
      // Tourist login by phone
      if (text.includes('SELECT * FROM tourists WHERE phone =')) {
        const phone = params[0];
        const tourist = mockDb.tourists.find(t => t.phone === phone);
        if (tourist) {
          // Clone the tourist object to avoid modifying the original
          const touristClone = {...tourist};
          // Ensure the password_hash field is named correctly for bcrypt.compare
          touristClone.password_hash = tourist.password_hash;
          console.log('Mock DB: Found tourist by phone:', phone);
          console.log('Tourist password hash:', touristClone.password_hash);
          return {
            rows: [touristClone],
            rowCount: 1
          };
        }
        console.log('Mock DB: Tourist not found by phone:', phone);
        return {
          rows: [],
          rowCount: 0
        };
      }
      
      // Store refresh token
      if (text.includes('INSERT INTO refresh_tokens')) {
        const token = {
          id: mockDb.refresh_tokens.length + 1,
          user_id: params[0],
          token: params[1],
          expires_at: params[2],
          created_at: new Date().toISOString()
        };
        mockDb.refresh_tokens.push(token);
        return { rows: [token] };
      }
      
      // Validate refresh token
      if (text.includes('SELECT * FROM refresh_tokens WHERE token =')) {
        const token = mockDb.refresh_tokens.find(t => t.token === params[0]);
        return { rows: token ? [token] : [] };
      }
      
      // Delete refresh token
      if (text.includes('DELETE FROM refresh_tokens WHERE token =')) {
        const tokenIndex = mockDb.refresh_tokens.findIndex(t => t.token === params[0]);
        if (tokenIndex !== -1) {
          mockDb.refresh_tokens.splice(tokenIndex, 1);
        }
        return { rows: [], rowCount: tokenIndex !== -1 ? 1 : 0 };
      }
      
      // Connectivity check
      if (text === 'SELECT 1 as connectivity_check' || text === 'SELECT 1 as connection_test') {
        return { rows: [{ connectivity_check: 1 }], rowCount: 1 };
      }
      
      // Version check
      if (text === 'SELECT version()') {
        return { rows: [{ version: 'PostgreSQL 14.0 (Mock)' }], rowCount: 1 };
      }
      
      // Table information query
      if (text.includes('SELECT table_name') && text.includes('information_schema.tables')) {
        return { 
          rows: [
            { table_name: 'users' },
            { table_name: 'refresh_tokens' },
            { table_name: 'tourists' },
            { table_name: 'incidents' },
            { table_name: 'alerts' }
          ], 
          rowCount: 5 
        };
      }
      
      // Database size query
      if (text.includes('pg_database_size') || text.includes('pg_size_pretty')) {
        return { 
          rows: [{ 
            db_size: 8388608, 
            db_size_pretty: '8192 kB' 
          }], 
          rowCount: 1 
        };
      }
      
      // Connection count query
      if (text.includes('SELECT count(*) as connection_count') && text.includes('pg_stat_activity')) {
        return { 
          rows: [{ 
            connection_count: 5 
          }], 
          rowCount: 1 
        };
      }
      
      // Get user by ID
      if (text.includes('SELECT * FROM users WHERE id =')) {
        const userId = parseInt(params[0]);
        const user = mockDb.users.find(u => u.id === userId);
        return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
      }
      
      // Get tourist by ID
      if (text.includes('SELECT * FROM tourists WHERE id =')) {
        const touristId = parseInt(params[0]);
        const tourist = mockDb.tourists.find(t => t.id === touristId);
        return { rows: tourist ? [tourist] : [], rowCount: tourist ? 1 : 0 };
      }
      
      // Get tourist by user ID
      if (text.includes('SELECT * FROM tourists WHERE user_id =')) {
        const userId = parseInt(params[0]);
        const tourist = mockDb.tourists.find(t => t.user_id === userId);
        return { rows: tourist ? [tourist] : [], rowCount: tourist ? 1 : 0 };
      }
      
      // Get incidents by tourist ID
      if (text.includes('SELECT * FROM incidents WHERE tourist_id =')) {
        const touristId = parseInt(params[0]);
        const incidents = mockDb.incidents.filter(i => i.tourist_id === touristId);
        return { rows: incidents, rowCount: incidents.length };
      }
      
      // Get alerts for a region
      if (text.includes('SELECT * FROM alerts WHERE region =')) {
        const region = params[0];
        const alerts = mockDb.alerts.filter(a => a.region === region);
        return { rows: alerts, rowCount: alerts.length };
      }
      
      // Default response for unhandled queries
      console.warn('Unhandled mock query:', text);
      return { rows: [], rowCount: 0 };
    },
    on: (event, callback) => {},
    connect: () => ({
      query: async () => ({ rows: [] }),
      release: () => {}
    })
  };
} else {
  // Real pool for production
  pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: 'tourist_safety',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    max: parseInt(process.env.DB_POOL_MAX || '20'), // Maximum number of clients in the pool
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'), // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '5000'), // How long to wait for a connection
  });
}

// Connection event handlers
if (!isTesting) {
  pool.on('connect', () => {
    console.log('Connected to the database successfully');
  });

  pool.on('error', (err) => {
    console.error('Unexpected database error:', err.message);
    // Don't crash the application on connection errors
    // Instead, let the health check system handle reconnection
  });

  // Test the connection immediately
  pool.query('SELECT 1 as connection_test')
    .then(() => {
      console.log('Database connection verified');
    })
    .catch(err => {
      console.error('Initial database connection failed:', err.message);
      console.log('Check your database credentials and ensure PostgreSQL is running');
      console.log('The application will continue running but database operations will fail');
      console.log('To use mock data for testing, set MOCK_DB=true in your .env file');
    });
}

// Handle errors on the pool itself
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process on connection errors, let the application handle it
  // process.exit(-1);
});

/**
 * Execute a query with parameters
 * @param {string} text - SQL query text
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} - Query result
 */
async function query(text, params) {
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
}

/**
 * Get a client from the pool with transaction support
 * @returns {Promise<Object>} - Database client
 */
async function getClient() {
  const client = await pool.connect();
  const originalQuery = client.query;
  const release = client.release;
  
  // Set a timeout of 5 seconds on idle clients
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for too long!');
    console.error(`The last executed query on this client was: ${client.lastQuery}`);
  }, 5000);
  
  // Monkey patch the query method to keep track of the last query executed
  client.query = (...args) => {
    client.lastQuery = args;
    return originalQuery.apply(client, args);
  };
  
  client.release = () => {
    // Clear the timeout
    clearTimeout(timeout);
    // Set the methods back to their old implementation
    client.query = originalQuery;
    client.release = release;
    return release.apply(client);
  };
  
  return client;
}

// Export database interface
module.exports = {
  query,
  getClient,
  pool
};