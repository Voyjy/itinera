const express = require('express');
const cors = require('cors');
require('dotenv').config();

const redisRoutes = require('./routes/redis');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`📡 Cache Service: ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.send('Cache Service is running 🚀');
});

// Routes
app.use('/api/redis', redisRoutes);

// Start server
const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
    console.log(`💾 Cache Service running on port ${PORT}`);
});
