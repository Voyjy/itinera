/**
 * Places Controller — handles /api/places/* endpoints
 *
 * Phase 1: swipe deck with scoring + pagination
 */

const { getDeck, loadAllPlaces } = require('../services/localProvider');
const { scorePlaces } = require('../utils/scoring');
const { normalizePreferences } = require('../types/preferences');

/**
 * GET /api/places/deck
 * Returns paginated, scored places for the swipe discovery deck.
 *
 * Query params:
 * - page (number, default 1)
 * - limit (number, default 10)
 * - budget, pace, interests, tripType (for scoring)
 */
async function getDeckHandler(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Normalize preferences from query params
        const preferences = normalizePreferences(req.query);

        // Get all places and score them
        const allPlaces = loadAllPlaces();
        const scored = scorePlaces(allPlaces, preferences);

        // Paginate scored results
        const start = (page - 1) * limit;
        const end = start + limit;
        const pageData = scored.slice(start, end).map(({ place, score }) => ({
            ...place,
            _score: score,
        }));

        const hasMore = end < scored.length;

        res.json({
            data: pageData,
            nextCursor: hasMore ? String(page + 1) : null,
            total: scored.length,
            page,
        });
    } catch (err) {
        console.error('❌ Error in getDeck:', err);
        res.status(500).json({ error: 'Failed to load deck', details: err.message });
    }
}

module.exports = { getDeckHandler };
