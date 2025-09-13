const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const axios = require('axios');
const db = require('../utils/db');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Please include a valid phone number').not().isEmpty(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, password, aadhaar } = req.body;

  try {
    // Check if user exists
    const userResult = await db.query('SELECT * FROM tourists WHERE email = $1 OR phone = $2', [email, phone]);
    
    if (userResult.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await db.query(
      'INSERT INTO tourists (name, email, phone, password, aadhaar) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, aadhaar',
      [name, email, phone, hashedPassword, aadhaar || null]
    );

    const user = result.rows[0];

    // Generate blockchain ID
    try {
      const blockchainResponse = await axios.post(`${process.env.BLOCKCHAIN_API_URL}/api/blockchain/register`, {
        email: email,
        userId: user.id
      });
      
      // Update user with blockchain ID
      if (blockchainResponse.data && blockchainResponse.data.blockchainId) {
        await db.query(
          'UPDATE tourists SET blockchain_id = $1 WHERE id = $2',
          [blockchainResponse.data.blockchainId, user.id]
        );
        user.blockchain_id = blockchainResponse.data.blockchainId;
      }
    } catch (blockchainError) {
      console.error('Blockchain service error:', blockchainError.message);
      // Continue registration process even if blockchain service fails
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || 86400 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').optional().isEmail(),
  check('phone', 'Please include a valid phone number').optional(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, phone, password } = req.body;

  // Ensure either email or phone is provided
  if (!email && !phone) {
    return res.status(400).json({ message: 'Either email or phone is required' });
  }

  try {
    // Find user by email or phone
    let query = 'SELECT * FROM tourists WHERE ';
    let params = [];
    
    if (email) {
      query += 'email = $1';
      params.push(email);
    } else {
      query += 'phone = $1';
      params.push(phone);
    }
    
    const result = await db.query(query, params);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || 86400 },
      (err, token) => {
        if (err) throw err;
        
        // Remove password from response
        delete user.password;
        
        res.json({
          token,
          user
        });
      }
    );
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/verify
// @desc    Verify token and get user data
// @access  Private
router.get('/verify', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, phone, aadhaar, blockchain_id FROM tourists WHERE id = $1', [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Verification error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET api/auth/role
// @desc    Check if user has admin role
// @access  Private
router.get('/role', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT email, role FROM tourists WHERE id = $1', [req.user.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = result.rows[0];
    const isAdmin = user.role === 'admin';
    
    res.json({ isAdmin });
  } catch (err) {
    console.error('Role check error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;