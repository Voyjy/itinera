const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const cityRoutes = require('./routes/cities');
const hotelRoutes = require('./routes/hotels');
const blogRoutes = require('./routes/blogs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`📡 Catalog Service: ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/', (req, res) => {
    res.send('Catalog Service is running 📚');
});

// Routes
app.use('/api/cities', cityRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/blogs', blogRoutes);

// MongoDB connection
const PORT = process.env.PORT || 4003;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ Catalog Service: Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`📚 Catalog Service running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Catalog Service MongoDB connection error:', err.message);
    });
