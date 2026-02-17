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

// Phase 1+2 Routes
const placesRoutes = require('./routes/places');
const itineraryRoutes = require('./routes/itinerary');

// Phase 3 Routes
const savedTripsRoutes = require('./routes/savedTrips');

// CORS Configuration - Allow Vercel production + preview domains
const allowedOrigins = [
  'https://itinera-xi.vercel.app', // Vercel production
  'https://voluble-scone-617f6ee.netlify.app', // Netlify (legacy)
  'http://localhost:5173', // Local dev (Vite)
  'http://localhost:5174', // Vite fallback port
  'http://localhost:5175', // Vite fallback port
  'http://localhost:3000', // Local dev alt
];

// Pattern match for ALL Vercel preview deployments (itinera-*.vercel.app)
const vercelPreviewPattern = /^https:\/\/itinera[a-z0-9-]*\.vercel\.app$/;

// CORS options (reusable for middleware and preflight)
const corsOptions = {
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
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight OPTIONS for all routes (Express 5 compatible - uses RegExp instead of '*')
app.options(/.*/, cors(corsOptions));

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

// Phase 1+2: Places deck + Itinerary generation
app.use('/api/places', placesRoutes);
app.use('/api/itinerary', itineraryRoutes);

// Phase 3: Saved trips (file-based, no auth required)
app.use('/api/saved-trips', savedTripsRoutes);

// Start the HTTP server FIRST (Places API + Itinerary API don't need MongoDB)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);

  // Connect to MongoDB in the background (non-blocking)
  const MONGO_URI = process.env.MONGO_URI;
  if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
      .then(() => console.log('✅ Connected to MongoDB Atlas'))
      .catch((err) => console.error('❌ MongoDB connection error:', err.message));
  } else {
    console.warn('⚠️ No MONGO_URI set — MongoDB features disabled');
  }
});
