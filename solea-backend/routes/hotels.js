const express = require('express');
const router = express.Router();
const {
  getAllHotels,
  getHotelsByCity,
  getHotelById,
  searchHotels,
} = require('../controllers/hotelController');

// Search hotels dynamically via SerpAPI
// GET /api/hotels/search?city=Paris&check_in=2026-02-03&check_out=2026-02-06&adults=2&lang=en&currency=EUR
router.get('/search', searchHotels);

// Get all hotels
router.get('/', getAllHotels);

// Get hotels in a specific city
router.get('/city/:cityId', getHotelsByCity);

// Get hotel details by ID
router.get('/:hotelId', getHotelById);

module.exports = router;
