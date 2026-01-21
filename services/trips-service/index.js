const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const tripRoutes = require('./routes/trips');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`🧳 Trips Service: ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.send('Trips Service is running 🧳');
});

// Routes
app.use('/api/trips', tripRoutes);

// MongoDB connection
const PORT = process.env.PORT || 4004;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Trips Service: Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🧳 Trips Service running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Trips Service MongoDB connection error:', err.message);
    });
