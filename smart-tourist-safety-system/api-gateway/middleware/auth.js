const axios = require('axios');

// Auth Service URL from environment variables
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token with Auth Service
    const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      headers: { 'x-auth-token': token }
    });
    
    // Add user from Auth Service response
    req.user = { id: response.data.id };
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    
    // Forward error response from Auth Service if available
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    
    res.status(401).json({ message: 'Token is not valid' });
  }
};
