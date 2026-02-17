/**
 * Places Routes — /api/places/*
 */
const express = require('express');
const router = express.Router();
const { getDeckHandler } = require('../controllers/placesController');

// GET /api/places/deck — swipe discovery deck (scored, paginated)
router.get('/deck', getDeckHandler);

module.exports = router;
