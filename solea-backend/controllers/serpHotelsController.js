/**
 * SerpAPI Hotels Controller
 * Handles HTTP requests for hotel search
 */

const { searchHotels } = require('../services/serpHotelsService');

/**
 * GET /api/serp/hotels
 * Query params:
 *   - city (required): City to search
 *   - check_in: Check-in date (YYYY-MM-DD)
 *   - check_out: Check-out date (YYYY-MM-DD)
 *   - adults: Number of adults (default 2)
 *   - lang: Language code (en/fr, default en)
 *   - currency: Currency code (default EUR)
 */
const getHotels = async (req, res) => {
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

        // Call service
        const result = await searchHotels({
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
        console.error('❌ SerpAPI Hotels Controller error:', err.message);

        return res.status(500).json({
            success: false,
            error: 'Failed to fetch hotel data',
            message: err.message
        });
    }
};

module.exports = {
    getHotels
};
