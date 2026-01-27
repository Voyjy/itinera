/**
 * SerpAPI Hotels Routes
 * GET /api/serp/hotels - Search hotels via SerpAPI
 */

const express = require('express');
const router = express.Router();
const { getHotels } = require('../controllers/serpHotelsController');

// GET /api/serp/hotels?city=Paris&check_in=2026-02-03&check_out=2026-02-06&adults=2&lang=en&currency=EUR
router.get('/', getHotels);

module.exports = router;
