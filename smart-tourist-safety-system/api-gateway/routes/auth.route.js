const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const multer = require('multer');
const path = require('path');

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
// @desc    Register a new tourist
// @access  Public
router.post('/register', upload.single('profile_picture'), [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('phone').not().isEmpty().withMessage('Phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('emergency_contact').optional(),
  body('entry_point').optional(),
  body('trip_duration').optional()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, phone, password, email, emergency_contact, entry_point, trip_duration } = req.body;
  const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Check if tourist already exists
    const checkUserQuery = 'SELECT * FROM tourists WHERE phone = $1 OR email = $2';
    const existingUser = await db.query(checkUserQuery, [phone, email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Tourist already exists with this phone number or email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Insert new tourist
    const insertUserQuery = `
      INSERT INTO tourists (
        name, phone, email, password_hash, profile_picture, emergency_contact, entry_point, trip_duration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, name, phone, email
    `;
    const values = [name, phone, email, passwordHash, profilePicture, emergency_contact, entry_point, trip_duration];
    const newUserResult = await db.query(insertUserQuery, values);
    const newTourist = newUserResult.rows[0];

    // Generate a unique identifier for blockchain (using email hash instead of Aadhaar)
    const uniqueIdentifier = await bcrypt.hash(email, 10);
    
    // Call the Blockchain Microservice via HTTP to register the tourist
    (async () => {
      try {
        const response = await axios.post('http://localhost:5002/api/blockchain/register', {
          uniqueIdentifier: uniqueIdentifier
        });
        const { blockchainId } = response.data;
        
        const updateQuery = 'UPDATE tourists SET blockchain_id = $1 WHERE id = $2';
        await db.query(updateQuery, [blockchainId, newTourist.id]);

        console.log(`Successfully updated tourist ${newTourist.id} with blockchain ID: ${blockchainId}`);
      } catch (e) {
        console.error(`Failed to update blockchain ID for tourist ${newTourist.id}: ${e.message}`);
      }
    })();

    // Create and sign a JWT token
    const payload = {
      tourist: { id: newTourist.id },
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Tourist registered successfully. Your digital ID is being generated.',
      tourist: {
        id: newTourist.id,
        name: newTourist.name,
        phone: newTourist.phone,
        email: newTourist.email,
        profile_picture: profilePicture,
        blockchainId: null, // Return null to indicate it's not ready yet
      },
      accessToken,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate tourist & get token
// @access  Public
router.post('/login', [
  body('phone').not().isEmpty().withMessage('Phone number is required'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { phone, password } = req.body;

  try {
    // Check if tourist exists
    const touristQuery = 'SELECT id, name, phone, password_hash, status FROM tourists WHERE phone = $1';
    const result = await db.query(touristQuery, [phone]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const tourist = result.rows[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, tourist.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT token
    const payload = {
      tourist: { id: tourist.id }
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      tourist: {
        id: tourist.id,
        name: tourist.name,
        phone: tourist.phone,
        status: tourist.status
      },
      accessToken
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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

// @route   GET /api/auth/verify
// @desc    Verify token and get user data
// @access  Private
router.get('/verify', auth, async (req, res) => {
  try {
    const touristQuery = `
      SELECT id, name, phone, email, status 
      FROM tourists 
      WHERE id = $1
    `;
    const result = await db.query(touristQuery, [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    
    res.json({
      user: result.rows[0],
      isAuthenticated: true
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
