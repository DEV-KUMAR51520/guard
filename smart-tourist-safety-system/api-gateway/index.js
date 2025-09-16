const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
app.use(cors());
app.use(express.json());

// --- Service URLs ---
const AUTH_SERVICE_URL = 'http://localhost:5002';
const BACKEND_SERVICE_URL = 'http://localhost:5000';

// --- Routing Rules ---
// Any request to '/api/auth' goes to the Node.js auth-service.
app.use('/api/auth', proxy(AUTH_SERVICE_URL));

// All other '/api' requests go to the Python backend.
app.use('/api', proxy(BACKEND_SERVICE_URL));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ API Gateway is live and routing traffic on port ${PORT}`);
});