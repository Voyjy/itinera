/**
 * Weather Awareness — optional OpenWeatherMap integration
 *
 * If OPENWEATHER_API_KEY is set, fetches a 5-day forecast.
 * If heavy rain is predicted, adjusts category weights to
 * favour indoor activities over outdoor ones.
 *
 * NEVER throws — always returns safely.
 */

const axios = require('axios');

const API_KEY = process.env.OPENWEATHER_API_KEY || '';

/**
 * Fetch weather forecast for a city.
 * Returns null if no API key or if the request fails.
 *
 * @param {string} city
 * @returns {Promise<Object|null>} forecast summary or null
 */
async function getWeatherForecast(city) {
    if (!API_KEY) {
        return null; // silently skip
    }

    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=40`;
        const { data } = await axios.get(url, { timeout: 5000 });

        if (!data || !data.list) return null;

        // Analyse rainfall across the forecast period
        let rainySlots = 0;
        let totalSlots = data.list.length;

        for (const slot of data.list) {
            const weatherMain = slot.weather?.[0]?.main?.toLowerCase() || '';
            if (['rain', 'thunderstorm', 'drizzle'].includes(weatherMain)) {
                rainySlots++;
            }
        }

        const rainRatio = totalSlots > 0 ? rainySlots / totalSlots : 0;

        return {
            city: data.city?.name || city,
            rainRatio,              // 0..1 — fraction of rainy slots
            isRainy: rainRatio > 0.3,
            summary: rainRatio > 0.3
                ? 'Significant rain expected — indoor activities recommended'
                : 'Weather looks good for outdoor activities',
        };
    } catch (err) {
        console.warn(`⚠️ Weather fetch failed for "${city}":`, err.message);
        return null;
    }
}

/**
 * Apply weather-based weight adjustments.
 * Reduces outdoor weight and boosts indoor weight when rain is likely.
 *
 * @param {Object} weights - Existing category weights
 * @param {Object|null} forecast - Weather forecast from getWeatherForecast
 * @returns {Object} adjusted weights (mutated copy)
 */
function applyWeatherAdjustments(weights, forecast) {
    if (!forecast || !forecast.isRainy) return weights;

    try {
        const adjusted = { ...weights };

        // Reduce outdoor-heavy categories
        if (adjusted.nature) adjusted.nature *= 0.6;
        if (adjusted.aventure) adjusted.aventure *= 0.7;

        // Boost indoor categories
        if (adjusted.culture) adjusted.culture *= 1.3;
        if (adjusted.gastronomie) adjusted.gastronomie *= 1.2;
        if (adjusted.shopping) adjusted.shopping *= 1.2;

        console.log(`🌧️ Weather adjustment applied — rain ratio: ${(forecast.rainRatio * 100).toFixed(0)}%`);
        return adjusted;
    } catch (err) {
        console.warn('⚠️ Weather adjustment failed:', err.message);
        return weights;
    }
}

module.exports = { getWeatherForecast, applyWeatherAdjustments };
