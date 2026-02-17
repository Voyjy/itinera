/**
 * Itinerary Routes — /api/itinerary/*
 */
const express = require('express');
const router = express.Router();
const { generateHandler } = require('../controllers/itineraryController');

// GET /api/itinerary/generate — generate structured itinerary
router.get('/generate', generateHandler);

module.exports = router;
