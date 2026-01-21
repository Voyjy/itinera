const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
    console.log(`📦 Assets Service: ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.send('Assets Service is running 📦');
});

// Serve static assets from /assets route
// Assets are mounted at /app/assets via Docker volume
const assetsPath = process.env.ASSETS_PATH || '/app/assets';
app.use('/assets', express.static(assetsPath, {
    maxAge: '1d', // Cache for 1 day
    etag: true,
    lastModified: true
}));

// 404 handler for missing assets
app.use('/assets', (req, res) => {
    console.error(`❌ Asset not found: ${req.path}`);
    res.status(404).json({ error: 'Asset not found' });
});

// Start server
const PORT = process.env.PORT || 4007;
app.listen(PORT, () => {
    console.log(`📦 Assets Service running on port ${PORT}`);
    console.log(`   📂 Serving assets from: ${assetsPath}`);
});
