const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`📡 Auth Service: ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.send('Auth Service is running 🔐');
});

// Routes
app.use('/api/auth', authRoutes);

// MongoDB connection
const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Auth Service: Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`🔐 Auth Service running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Auth Service MongoDB connection error:', err.message);
    });
