/**
 * Saved Trips Routes — /api/saved-trips/*
 *
 * JSON file–based storage (no MongoDB required).
 */
const express = require('express');
const router = express.Router();
const { saveTrip, getTripById, listTrips } = require('../utils/fileStore');

/**
 * POST /api/saved-trips/save
 * Body: { city, preferences, itinerary }
 * Returns: { tripId }
 */
router.post('/save', (req, res) => {
    try {
        const { city, preferences, itinerary } = req.body;

        if (!itinerary) {
            return res.status(400).json({ error: 'Missing itinerary data' });
        }

        const tripId = saveTrip({ city, preferences, itinerary });

        console.log(`💾 Trip saved: ${tripId} (${city || 'unknown city'})`);
        res.json({ success: true, tripId });
    } catch (err) {
        console.error('❌ Save trip error:', err.message);
        res.status(500).json({ error: 'Failed to save trip' });
    }
});

/**
 * GET /api/saved-trips/list
 * Query: ?page=1&limit=20
 */
router.get('/list', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const result = listTrips({ page, limit });
        res.json({ success: true, ...result });
    } catch (err) {
        console.error('❌ List trips error:', err.message);
        res.status(500).json({ error: 'Failed to list trips' });
    }
});

/**
 * GET /api/saved-trips/:tripId
 * Returns full trip data (for sharing).
 */
router.get('/:tripId', (req, res) => {
    try {
        const trip = getTripById(req.params.tripId);

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.json({ success: true, trip });
    } catch (err) {
        console.error('❌ Get trip error:', err.message);
        res.status(500).json({ error: 'Failed to retrieve trip' });
    }
});

module.exports = router;
