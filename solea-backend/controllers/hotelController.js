const Hotel = require('../models/hotelModel');
const { searchHotels: serpSearchHotels } = require('../services/serpHotelsService');

// Get all hotels
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get hotels by city
exports.getHotelsByCity = async (req, res) => {
  try {
    const hotels = await Hotel.find({ city: req.params.cityId });
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get hotel by ID
exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search hotels via SerpAPI (dynamic search)
exports.searchHotels = async (req, res) => {
  try {
    const {
      city,
      check_in,
      check_out,
      adults = 2,
      lang = 'en',
      currency = 'EUR'
    } = req.query;

    // Validate required params
    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: city'
      });
    }

    // Parse adults to number
    const adultsNum = parseInt(adults) || 2;

    // Call SerpAPI service
    const result = await serpSearchHotels({
      city,
      checkIn: check_in,
      checkOut: check_out,
      adults: adultsNum,
      lang,
      currency
    });

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (err) {
    console.error('❌ Hotels search error:', err.message);

    return res.status(500).json({
      success: false,
      error: 'Failed to fetch hotel data',
      message: err.message
    });
  }
};
