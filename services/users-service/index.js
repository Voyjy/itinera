const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`📡 Users Service: ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.send('Users Service is running 👤');
});

// Routes
app.use('/api/users', userRoutes);

// MongoDB connection
const PORT = process.env.PORT || 4002;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Users Service: Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`👤 Users Service running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Users Service MongoDB connection error:', err.message);
    });
