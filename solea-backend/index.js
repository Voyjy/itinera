const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tripRoutes = require('./routes/trips');
const cityRoutes = require('./routes/cities');
const hotelRoutes = require('./routes/hotels');
const recommendationRoutes = require('./routes/recommendations');
const blogRoutes = require('./routes/blogs');
const redisRoutes = require('./routes/redis');
const serpHotelsRoutes = require('./routes/serpHotels');

// CORS Configuration - Allow Vercel production + preview domains
const allowedOrigins = [
  'https://itinera-xi.vercel.app', // Vercel production
  'https://voluble-scone-617f6ee.netlify.app', // Netlify (legacy)
  'http://localhost:5173', // Local dev
  'http://localhost:3000', // Local dev alt
];

// Pattern match for Vercel preview deployments
const vercelPreviewPattern = /^https:\/\/itinera(-[a-z0-9]+)?(-jessk10s-projects)?\.vercel\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin)
    if (!origin) {
      return callback(null, true);
    }

    // Check exact match first
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Check Vercel preview pattern
    if (vercelPreviewPattern.test(origin)) {
      console.log('✅ CORS: Allowing Vercel preview:', origin);
      return callback(null, true);
    }

    console.log('❌ CORS blocked:', origin);
    callback(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Handle preflight OPTIONS for all routes
app.options('*', cors());

app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Optional debug log for CORS origin (can remove later)
app.use((req, res, next) => {
  console.log("🔥 Request from:", req.headers.origin);
  next();
});

// Custom Middleware — attach timestamp to request object
app.use((req, res, next) => {
  const now = Date.now();
  req.requestTime = now;
  console.log("Request Time:", new Date(now).toLocaleString());
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send(`Solea Backend is running 🚀 — Request Time: ${new Date(req.requestTime).toLocaleString()}`);
});

// Health check endpoint for Render
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/redis', redisRoutes);
app.use('/api/serp/hotels', serpHotelsRoutes);

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });
