const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./utils/init-db');
const dbHealth = require('./utils/db-health');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/auth', require('./routes/auth'));

// Enhanced health check endpoint with database status
app.get('/health', (req, res) => {
  const dbStatus = dbHealth.getHealthStatus();
  console.log('Health check requested. Current DB status:', dbStatus);
  res.json({
    status: dbStatus.isHealthy ? 'UP' : 'DEGRADED',
    database: {
      healthy: dbStatus.isHealthy,
      lastChecked: dbStatus.lastChecked,
      responseTime: dbStatus.responseTime,
      error: dbStatus.error
    }
  });
});

const PORT = process.env.PORT || 3001;

// Initialize database before starting the server
console.log('Starting auth service with DB config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE, // ✅ FIX: Was hardcoded, now uses .env variable
  user: process.env.DB_USER,
  // Password hidden for security
});

initializeDatabase()
  .then(() => {
    // Start database health checks
    dbHealth.startHealthChecks({
      interval: parseInt(process.env.DB_HEALTH_CHECK_INTERVAL || '30000'),
      unhealthyThreshold: parseInt(process.env.DB_UNHEALTHY_THRESHOLD || '3'),
    }, (status) => {
      console.log(`Database health status changed to: ${status.isHealthy ? 'healthy' : 'unhealthy'}`);
    });
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Auth Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

function gracefulShutdown() {
  console.log('Received shutdown signal, closing connections...');
  dbHealth.stopHealthChecks();
  
  // Close database pool
  const db = require('./utils/db');
  db.pool.end(() => {
    console.log('Database connections closed');
    process.exit(0);
  });
  
  // Force exit after timeout
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
}