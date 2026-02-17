/**
 * Itinerary Controller — handles /api/itinerary/* endpoints
 *
 * Phase 2: proximity clustering + time-of-day scheduling
 *
 * Pipeline: provider → score → cluster → schedule → respond
 */

const { loadAllPlaces, getPlaces } = require('../services/localProvider');
const { scorePlaces } = require('../utils/scoring');
const { generateItinerary } = require('../utils/scheduler');
const { normalizePreferences } = require('../types/preferences');

/**
 * GET /api/itinerary/generate
 *
 * Query params:
 * - city (string, required) — destination city
 * - tripType, budget, pace, interests, accessibility (preferences)
 * - startDate, endDate (optional)
 *
 * Returns structured itinerary with dayPlans[].morning/afternoon/evening
 */
async function generateHandler(req, res) {
    try {
        const preferences = normalizePreferences(req.query);

        if (!preferences.city) {
            return res.status(400).json({
                error: 'Missing required parameter: city',
                example: '/api/itinerary/generate?city=Paris&tripType=Romantique&pace=Modéré',
            });
        }

        console.log(`🗺️ Generating itinerary for ${preferences.city}`, {
            tripType: preferences.tripType,
            pace: preferences.pace,
            budget: preferences.budget,
            interests: preferences.interests,
        });

        // 1. Fetch candidate places — smart matching with French aliases
        let candidates = getPlaces(preferences.city);

        if (candidates.length === 0) {
            // City not resolved — try matching country name
            const allPlaces = loadAllPlaces();
            const cityLower = preferences.city.toLowerCase();

            // Try country match
            candidates = allPlaces.filter(
                p => p.country.toLowerCase() === cityLower ||
                    p.country.toLowerCase().includes(cityLower)
            );

            // Try continent match as last resort before global
            if (candidates.length === 0) {
                candidates = allPlaces.filter(
                    p => p.continent.toLowerCase().includes(cityLower)
                );
            }
        }

        if (candidates.length === 0) {
            // Still nothing — return an error instead of random global places
            console.warn(`⚠️ No places found for "${preferences.city}"`);
            return res.status(404).json({
                error: `Destination "${preferences.city}" not found in our database`,
                suggestion: 'Try a major city like Paris, Tokyo, Rome, Barcelona, etc.',
            });
        }

        // 2. Score places
        const scoredPlaces = scorePlaces(candidates, preferences);

        // 3. Take top N candidates (enough for multi-day)
        const topN = Math.min(scoredPlaces.length, 8);
        const topScored = scoredPlaces.slice(0, topN);

        // 4. Generate itinerary (includes clustering + scheduling)
        const itinerary = generateItinerary(topScored, preferences);

        console.log(`✅ Generated ${itinerary.numDays}-day itinerary: ${itinerary.totalAttractions} attractions`);

        res.json({
            success: true,
            itinerary,
        });
    } catch (err) {
        console.error('❌ Error generating itinerary:', err);
        res.status(500).json({
            error: 'Failed to generate itinerary',
            details: err.message,
        });
    }
}

module.exports = { generateHandler };
