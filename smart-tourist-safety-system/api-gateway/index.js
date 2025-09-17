const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config(); // Good practice to include this

const app = express();
app.use(cors());

// --- Configuration ---
const PORT = process.env.PORT || 8000;
// ✅ FIX: Read service URLs from environment variables
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL;

console.log(`Proxying to Auth Service: ${AUTH_SERVICE_URL}`);
console.log(`Proxying to Flask Backend: ${FLASK_BACKEND_URL}`);

// --- Routing Rules ---
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    // No pathRewrite needed if the target URL already includes the base path
}));

app.use('/api', createProxyMiddleware({
    target: FLASK_BACKEND_URL,
    changeOrigin: true,
}));

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`✅ API Gateway is live and routing traffic on port ${PORT}`);
});