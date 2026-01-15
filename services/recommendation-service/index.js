const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recommendationRoutes = require('./routes/recommendations');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`📡 Recommendation Service: ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.send('Recommendation Service is running 🚀');
});

// Routes
app.use('/api/recommendations', recommendationRoutes);

// Start server
const PORT = process.env.PORT || 4005;
app.listen(PORT, () => {
    console.log(`🎯 Recommendation Service running on port ${PORT}`);
});
