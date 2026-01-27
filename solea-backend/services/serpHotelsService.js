/**
 * SerpAPI Hotels Service
 * Fetches real hotel data from SerpAPI Google Hotels engine
 * Includes Redis caching with configurable TTL
 */

const axios = require('axios');
const redisClient = require('../utils/redisClient');

// Configuration
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const SERPAPI_TTL_SECONDS = parseInt(process.env.SERPAPI_TTL_SECONDS) || 86400; // Default 24 hours
const SERPAPI_BASE_URL = 'https://serpapi.com/search';

/**
 * Generate cache key from search parameters
 */
const generateCacheKey = ({ city, checkIn, checkOut, adults, lang, currency }) => {
    return `serpapi:hotels:${city}:${checkIn || 'nodate'}:${checkOut || 'nodate'}:${adults}:${lang}:${currency}`;
};

/**
 * Check Redis cache for existing results
 */
const getFromCache = async (cacheKey) => {
    try {
        if (!redisClient.isReady) return null;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            console.log('✅ SerpAPI Hotels: Cache HIT for', cacheKey);
            return JSON.parse(cached);
        }
        console.log('📭 SerpAPI Hotels: Cache MISS for', cacheKey);
        return null;
    } catch (err) {
        console.error('⚠️ Redis cache read error:', err.message);
        return null;
    }
};

/**
 * Save results to Redis cache
 */
const saveToCache = async (cacheKey, data) => {
    try {
        if (!redisClient.isReady) return;
        await redisClient.setEx(cacheKey, SERPAPI_TTL_SECONDS, JSON.stringify(data));
        console.log('💾 SerpAPI Hotels: Cached results for', cacheKey, `(TTL: ${SERPAPI_TTL_SECONDS}s)`);
    } catch (err) {
        console.error('⚠️ Redis cache write error:', err.message);
    }
};

/**
 * Normalize SerpAPI hotel response into clean format
 */
const normalizeHotel = (hotel) => {
    return {
        name: hotel.name || 'Unknown Hotel',
        rating: hotel.overall_rating || hotel.rating || null,
        reviews: hotel.reviews || hotel.total_reviews || null,
        price: hotel.rate_per_night?.lowest
            ? { amount: hotel.rate_per_night.lowest, currency: hotel.rate_per_night.currency || 'EUR' }
            : hotel.price
                ? { amount: hotel.price, currency: 'EUR' }
                : null,
        total_price: hotel.total_rate?.lowest || hotel.total_price || null,
        address: hotel.address || hotel.location || null,
        link: hotel.link || hotel.serpapi_property_details_link || null,
        thumbnail: hotel.images?.[0]?.thumbnail || hotel.thumbnail || null,
        property_type: hotel.type || hotel.hotel_class || null,
        amenities: hotel.amenities || [],
        check_in_time: hotel.check_in_time || null,
        check_out_time: hotel.check_out_time || null
    };
};

/**
 * Search hotels using SerpAPI Google Hotels engine
 * @param {Object} params - Search parameters
 * @param {string} params.city - City to search (required)
 * @param {string} params.checkIn - Check-in date (YYYY-MM-DD)
 * @param {string} params.checkOut - Check-out date (YYYY-MM-DD)
 * @param {number} params.adults - Number of adults (default 2)
 * @param {string} params.lang - Language code (en/fr, default en)
 * @param {string} params.currency - Currency code (default EUR)
 * @returns {Object} Normalized hotel results
 */
const searchHotels = async ({ city, checkIn, checkOut, adults = 2, lang = 'en', currency = 'EUR' }) => {
    if (!city) {
        throw new Error('City parameter is required');
    }

    if (!SERPAPI_KEY) {
        throw new Error('SERPAPI_KEY environment variable is not set');
    }

    const cacheKey = generateCacheKey({ city, checkIn, checkOut, adults, lang, currency });

    // Check cache first
    const cachedData = await getFromCache(cacheKey);
    if (cachedData) {
        return cachedData;
    }

    // Build SerpAPI request params
    const params = {
        engine: 'google_hotels',
        q: city,
        api_key: SERPAPI_KEY,
        hl: lang,
        currency: currency,
        adults: adults
    };

    // Add dates if provided
    if (checkIn) {
        params.check_in_date = checkIn;
    }
    if (checkOut) {
        params.check_out_date = checkOut;
    }

    console.log('🔍 SerpAPI Hotels: Fetching hotels for', city, params);

    try {
        const response = await axios.get(SERPAPI_BASE_URL, { params });

        // Extract hotels from response
        const properties = response.data.properties || [];

        // Normalize and limit to top 15 results
        const normalizedHotels = properties.slice(0, 15).map(normalizeHotel);

        const result = {
            city,
            check_in: checkIn || null,
            check_out: checkOut || null,
            adults,
            currency,
            lang,
            results: normalizedHotels,
            total_found: properties.length,
            fetched_at: new Date().toISOString()
        };

        // Cache the results
        await saveToCache(cacheKey, result);

        return result;

    } catch (err) {
        console.error('❌ SerpAPI Hotels error:', err.response?.data || err.message);

        // Re-throw with clean error message
        if (err.response?.status === 401) {
            throw new Error('Invalid SerpAPI key');
        } else if (err.response?.status === 429) {
            throw new Error('SerpAPI rate limit exceeded');
        } else {
            throw new Error('Failed to fetch hotels from SerpAPI: ' + (err.response?.data?.error || err.message));
        }
    }
};

module.exports = {
    searchHotels
};
