const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const multer = require('multer');
const path = require('path');

// Service URLs from environment variables
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const BLOCKCHAIN_SERVICE_URL = process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:5002';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// @route   GET /api/auth/tourists
// @desc    Get all tourists
// @access  Private (Admin)
router.get('/tourists', auth, async (req, res) => {
  try {
    const touristsQuery = 'SELECT id, name, phone, status, entry_point, trip_duration FROM tourists';
    const result = await db.query(touristsQuery);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/register
// @desc    Register a tourist
// @access  Public
router.post('/register', upload.single('profile_picture'), async (req, res) => {
  try {
    const { name, phone, email, password, emergency_contact, entry_point, trip_duration } = req.body;
    
    // Validate required fields
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get profile picture path if uploaded
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;
    
    // Forward registration request to Auth Service
    const registrationData = {
      name,
      phone,
      email,
      password,
      emergency_contact,
      entry_point,
      trip_duration,
      profile_picture: profilePicture
    };
    
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/register`, registrationData);
    
    // Return the response from Auth Service
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Registration error:', err.message);
    
    // Forward error response from Auth Service if available
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate tourist & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;
    
    // Validate required fields
    if (!phone || !password) {
      return res.status(400).json({ message: 'Please provide phone and password' });
    }
    
    // Forward login request to Auth Service
    const loginData = { phone, password };
    const response = await axios.post(`${AUTH_SERVICE_URL}/api/auth/login`, loginData);
    
    // Return the response from Auth Service
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error('Login error:', err.message);
    
    // Forward error response from Auth Service if available
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/auth/panic
// @desc    Trigger a panic incident
// @access  Private (Tourist)
router.post('/panic', auth, async (req, res) => {
  const { latitude, longitude } = req.body;
  try {
    const touristId = req.user.id;
    
    // Get tourist blockchain ID
    const touristQuery = 'SELECT blockchain_id FROM tourists WHERE id = $1';
    const result = await db.query(touristQuery, [touristId]);
    const blockchainId = result.rows[0]?.blockchain_id;
    
    if (!blockchainId) {
      return res.status(400).json({ message: 'Tourist has no blockchain ID. Please re-register.' });
    }
    
    // Call the Blockchain microservice to record an immutable incident
    const blockchainResponse = await axios.post('http://localhost:5002/api/blockchain/incident', {
      touristId: blockchainId,
    });
    
    const txHash = blockchainResponse.data.txHash;
    
    // Update tourist status
    const updateStatusQuery = `
      UPDATE tourists
      SET status = 'Emergency'
      WHERE id = $1
    `;
    await db.query(updateStatusQuery, [touristId]);
    
    // Insert the incident into database
    const insertIncidentQuery = `
      INSERT INTO incidents (tourist_id, latitude, longitude, transaction_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const incidentResult = await db.query(insertIncidentQuery, [touristId, latitude, longitude, txHash]);
    
    // Emit real-time alert via WebSocket if available
    if (req.io) {
      req.io.emit('newAlert', { 
        incident: {
          id: incidentResult.rows[0].id,
          touristId,
          location: { latitude, longitude },
          status: 'Emergency',
          timestamp: new Date()
        } 
      });
    }
    
    res.status(201).json({ message: 'Panic alert created', transactionHash: txHash });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/incidents/:id/acknowledge
// @desc    Acknowledge an incident
// @access  Private (Admin)
router.post('/incidents/:id/acknowledge', auth, async (req, res) => {
  try {
    const incidentQuery = 'SELECT * FROM incidents WHERE id = $1';
    const result = await db.query(incidentQuery, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    const updateQuery = `
      UPDATE incidents 
      SET status = 'pending' 
      WHERE id = $1 
      RETURNING *
    `;
    const updateResult = await db.query(updateQuery, [req.params.id]);
    
    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/incidents/:id/resolve
// @desc    Resolve an incident
// @access  Private (Admin)
router.post('/incidents/:id/resolve', auth, async (req, res) => {
  try {
    const incidentQuery = 'SELECT * FROM incidents WHERE id = $1';
    const result = await db.query(incidentQuery, [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    
    const updateQuery = `
      UPDATE incidents 
      SET status = 'resolved', resolved_at = NOW() 
      WHERE id = $1 
      RETURNING *
    `;
    const updateResult = await db.query(updateQuery, [req.params.id]);
    
    // Update tourist status back to safe
    const updateTouristQuery = `
      UPDATE tourists
      SET status = 'Safe'
      WHERE id = $1
    `;
    await db.query(updateTouristQuery, [updateResult.rows[0].tourist_id]);
    
    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/auth/profile
// @desc    Get current tourist profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const touristQuery = `
      SELECT id, name, phone, emergency_contact, entry_point, trip_duration, status, 
             current_latitude, current_longitude, blockchain_id 
      FROM tourists 
      WHERE id = $1
    `;
    const result = await db.query(touristQuery, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
