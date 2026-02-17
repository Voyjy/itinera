/**
 * Scoring Module (Phase 2.8)
 *
 * Scores places based on dynamic weights and user preferences.
 * Used by both /api/places/deck (ranking) and /api/itinerary/generate (selection).
 */

const { getWeights } = require('./weights');

/**
 * Score a single place against user preferences.
 *
 * @param {Object} place - Normalized Place object
 * @param {import('../types/preferences').TripPreferences} preferences
 * @param {Object} [weights] - Pre-computed weights (optional, computed if missing)
 * @returns {number} Numeric score (higher = better match)
 */
function scorePlace(place, preferences, weights) {
    if (!weights) weights = getWeights(preferences);

    let score = 0;

    // 1. Category match — boost if place categories overlap with boosted categories
    const placeCategories = place.categories || [];
    const placeTags = (place.tags || []).map(t => t.toLowerCase());

    for (const cat of placeCategories) {
        if (weights.boostedCategories.includes(cat)) {
            score += weights.categoryMatch * 1.5;
        }
        if (weights.penalizedCategories.includes(cat)) {
            score -= weights.categoryMatch;
        }
    }

    // 2. Tag match — direct tag overlap with boosted/penalized tags
    for (const tag of placeTags) {
        if (weights.boostedTags.includes(tag)) {
            score += weights.categoryMatch * 0.8;
        }
        if (weights.penalizedTags.includes(tag)) {
            score -= weights.categoryMatch * 0.6;
        }
    }

    // 3. Budget match — compare place price level with preferred levels
    if (place.priceLevel && weights.preferredPriceLevels) {
        if (weights.preferredPriceLevels.includes(place.priceLevel)) {
            score += weights.budgetMatch;
        } else {
            // Penalty proportional to distance from preferred level
            const closest = weights.preferredPriceLevels.reduce(
                (min, lvl) => Math.min(min, Math.abs(lvl - place.priceLevel)), Infinity
            );
            score -= weights.budgetMatch * closest * 0.5;
        }
    }

    // 4. Attraction richness bonus — more attractions = more to do
    const attractionCount = (place.attractions || []).length;
    if (attractionCount >= 8) score += weights.ratingBonus;
    else if (attractionCount >= 5) score += weights.ratingBonus * 0.6;
    else if (attractionCount >= 3) score += weights.ratingBonus * 0.3;

    // 5. Trip type atmosphere match — special tag combos
    const atmosScore = computeAtmosphereMatch(placeTags, preferences.tripType);
    score += weights.tripTypeAtmosphereMatch * atmosScore;

    // 6. Interest-specific bonus
    for (const interest of (preferences.interests || [])) {
        const interestLower = interest.toLowerCase();
        for (const tag of placeTags) {
            if (tag.includes(interestLower) || interestLower.includes(tag)) {
                score += weights.categoryMatch * 0.5;
            }
        }
    }

    return Math.round(score * 100) / 100;
}

/**
 * Compute atmosphere match: how well a place's tags fit the trip type.
 * Returns a value between 0 and 1.
 */
function computeAtmosphereMatch(placeTags, tripType) {
    const atmosphereKeywords = {
        'Famille': ['family', 'gardens', 'beaches', 'wildlife', 'traditional'],
        'Romantique': ['romantic', 'luxury', 'riverside', 'wine', 'spa', 'zen'],
        'Solo': ['cultural', 'historic', 'street food', 'art', 'hiking'],
        'Entre amis': ['nightlife', 'party', 'street food', 'shopping', 'festival'],
        'Senior': ['historic', 'traditional', 'gardens', 'wellness', 'peaceful'],
        'Business': ['modern', 'cosmopolitan', 'shopping', 'luxury'],
    };

    const keywords = atmosphereKeywords[tripType] || [];
    if (keywords.length === 0) return 0;

    let matches = 0;
    for (const tag of placeTags) {
        if (keywords.includes(tag)) matches++;
    }
    return Math.min(matches / Math.max(keywords.length * 0.3, 1), 1);
}

/**
 * Score and sort a list of places.
 *
 * @param {Object[]} places
 * @param {import('../types/preferences').TripPreferences} preferences
 * @returns {{ place: Object, score: number }[]} Sorted by score descending
 */
function scorePlaces(places, preferences) {
    const weights = getWeights(preferences);

    return places
        .map(place => ({
            place,
            score: scorePlace(place, preferences, weights),
        }))
        .sort((a, b) => b.score - a.score);
}

module.exports = { scorePlace, scorePlaces, computeAtmosphereMatch };
