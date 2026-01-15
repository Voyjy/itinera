const express = require('express');
const router = express.Router();
const {
    saveDraftTrip,
    getDraftTrip,
    deleteDraftTrip,
    saveRecentCity,
    getRecentCities,
    updatePopularCities,
    getPopularCities
} = require('../controllers/redisController');

// Trip Drafts
router.post('/draft/:userId', saveDraftTrip);
router.get('/draft/:userId', getDraftTrip);
router.delete('/draft/:userId', deleteDraftTrip);

// Recently Viewed Cities
router.post('/recent/:userId', saveRecentCity);
router.get('/recent/:userId', getRecentCities);

// Popular Cities
router.post('/popular', updatePopularCities);
router.get('/popular', getPopularCities);

module.exports = router;
