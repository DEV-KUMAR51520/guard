const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { initializeDatabase } = require('./utils/init-db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/auth', require('./routes/auth'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

const PORT = process.env.PORT || 3001;

// Initialize database before starting the server
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Auth Service running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });