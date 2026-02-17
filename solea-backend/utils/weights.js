/**
 * Dynamic Weights System (Phase 2.8)
 *
 * Produces weight multipliers based on TripPreferences.
 * Used by scoring.js to rank places for deck + itinerary.
 */

// -------------------------------------------------------------------
// Base weights
// -------------------------------------------------------------------
const BASE_WEIGHTS = {
    categoryMatch: 3,
    budgetMatch: 2,
    ratingBonus: 2,
    reviewBonus: 1,
    accessibilityMatch: 2,
    tripTypeAtmosphereMatch: 3,
    distancePenalty: 2,
};

// -------------------------------------------------------------------
// Trip type multiplier profiles
// -------------------------------------------------------------------
const TRIP_TYPE_PROFILES = {
    'Famille': {
        categoryMatch: 1.2,
        budgetMatch: 1.3,
        accessibilityMatch: 2.0,  // strong boost
        tripTypeAtmosphereMatch: 1.5,
        distancePenalty: 1.5,     // penalize long distances for kids
        boostedCategories: ['famille', 'nature', 'détente', 'culture'],
        penalizedCategories: ['nightlife'],
        boostedTags: ['family', 'elephants', 'wildlife', 'gardens', 'beaches'],
        penalizedTags: ['nightlife', 'party'],
    },
    'Romantique': {
        categoryMatch: 1.0,
        budgetMatch: 0.8,         // less price-sensitive
        ratingBonus: 1.5,         // prefer highly-rated
        tripTypeAtmosphereMatch: 2.0,
        distancePenalty: 1.2,
        boostedCategories: ['romantique', 'gastronomie', 'luxe', 'détente'],
        penalizedCategories: [],
        boostedTags: ['romantic', 'luxury', 'wine', 'spa', 'riverside'],
        penalizedTags: [],
        preferEveningSlots: true,
    },
    'Solo': {
        categoryMatch: 1.3,
        budgetMatch: 1.5,         // more budget-conscious
        ratingBonus: 1.0,
        tripTypeAtmosphereMatch: 1.0,
        distancePenalty: 0.8,     // solo travelers walk more
        boostedCategories: ['culture', 'gastronomie', 'aventure', 'moderne'],
        penalizedCategories: [],
        boostedTags: ['cultural', 'historic', 'street food', 'hiking', 'art'],
        penalizedTags: [],
    },
    'Entre amis': {
        categoryMatch: 1.0,
        budgetMatch: 1.0,
        ratingBonus: 1.2,
        tripTypeAtmosphereMatch: 1.5,
        distancePenalty: 0.8,
        boostedCategories: ['nightlife', 'gastronomie', 'shopping', 'aventure'],
        penalizedCategories: [],
        boostedTags: ['nightlife', 'street food', 'shopping', 'festival', 'party'],
        penalizedTags: [],
        preferEveningSlots: true,
    },
    'Senior': {
        categoryMatch: 1.0,
        budgetMatch: 1.0,
        ratingBonus: 1.5,
        accessibilityMatch: 2.5,  // very strong boost
        tripTypeAtmosphereMatch: 1.5,
        distancePenalty: 2.0,     // strong penalty for distance
        boostedCategories: ['culture', 'détente', 'gastronomie', 'luxe'],
        penalizedCategories: ['nightlife', 'aventure'],
        boostedTags: ['historic', 'traditional', 'gardens', 'spa', 'wellness'],
        penalizedTags: ['extreme', 'party', 'trekking', 'diving'],
    },
    'Business': {
        categoryMatch: 0.8,
        budgetMatch: 0.5,         // budget less important
        ratingBonus: 2.0,         // quality matters
        tripTypeAtmosphereMatch: 1.0,
        distancePenalty: 2.5,     // efficiency = minimize travel time
        boostedCategories: ['moderne', 'gastronomie', 'luxe'],
        penalizedCategories: ['nightlife', 'aventure'],
        boostedTags: ['modern', 'cosmopolitan', 'shopping'],
        penalizedTags: ['beaches', 'hiking', 'trekking'],
    },
};

// -------------------------------------------------------------------
// Pace multipliers for distancePenalty
// -------------------------------------------------------------------
const PACE_MULTIPLIERS = {
    'Relax': { distancePenalty: 1.8, placesPerDayMin: 3, placesPerDayMax: 4 },
    'Modéré': { distancePenalty: 1.0, placesPerDayMin: 4, placesPerDayMax: 5 },
    'Actif': { distancePenalty: 0.5, placesPerDayMin: 5, placesPerDayMax: 7 },
};

// -------------------------------------------------------------------
// Budget mapping to preferred price levels
// -------------------------------------------------------------------
const BUDGET_PRICE_PREFERENCES = {
    'Budget': { preferredLevels: [1, 2], ratingMultiplier: 0.8 },
    'Modéré': { preferredLevels: [2, 3], ratingMultiplier: 1.0 },
    'Luxe': { preferredLevels: [3, 4], ratingMultiplier: 1.5 },
};

// -------------------------------------------------------------------
// Interest → category/tag mapping
// -------------------------------------------------------------------
const INTEREST_TO_TAGS = {
    'Gastronomie': ['gastronomy', 'culinary', 'street food', 'seafood', 'wine', 'food'],
    'Histoire & Culture': ['historic', 'history', 'cultural', 'temples', 'traditional', 'heritage', 'art', 'ancient'],
    'Nature': ['beaches', 'mountains', 'nature', 'wildlife', 'hiking', 'diving', 'islands', 'gardens'],
    'Shopping': ['shopping', 'fashion', 'markets', 'modern'],
    'Vie nocturne': ['nightlife', 'party', 'entertainment', 'festival'],
    'Aventure': ['adventure', 'extreme', 'trekking', 'diving', 'safari'],
    'Détente & Bien-être': ['wellness', 'spa', 'relaxation', 'tranquil', 'peaceful'],
    'Art & Architecture': ['art', 'architecture', 'modern', 'cultural'],
    'Romantique': ['romantic', 'luxury', 'wine', 'spa'],
    'Plage': ['beaches', 'coastal', 'islands', 'snorkeling'],
};

/**
 * Compute dynamic weights based on user preferences.
 *
 * @param {import('../types/preferences').TripPreferences} preferences
 * @returns {Object} weight config
 */
function getWeights(preferences) {
    const tripProfile = TRIP_TYPE_PROFILES[preferences.tripType] || {};
    const paceProfile = PACE_MULTIPLIERS[preferences.pace] || PACE_MULTIPLIERS['Modéré'];
    const budgetProfile = BUDGET_PRICE_PREFERENCES[preferences.budget] || BUDGET_PRICE_PREFERENCES['Modéré'];

    // Start with base weights
    const weights = { ...BASE_WEIGHTS };

    // Apply trip type multipliers
    for (const [key, multiplier] of Object.entries(tripProfile)) {
        if (typeof multiplier === 'number' && weights[key] !== undefined) {
            weights[key] = BASE_WEIGHTS[key] * multiplier;
        }
    }

    // Apply pace multiplier to distancePenalty
    weights.distancePenalty *= paceProfile.distancePenalty;

    // Apply budget multiplier to ratingBonus
    weights.ratingBonus *= budgetProfile.ratingMultiplier;

    // Collect boosted/penalized tags from trip type + interests
    const boostedTags = new Set(tripProfile.boostedTags || []);
    const penalizedTags = new Set(tripProfile.penalizedTags || []);
    const boostedCategories = new Set(tripProfile.boostedCategories || []);
    const penalizedCategories = new Set(tripProfile.penalizedCategories || []);

    // Add interest-derived tags
    for (const interest of (preferences.interests || [])) {
        const mappedTags = INTEREST_TO_TAGS[interest] || [];
        for (const tag of mappedTags) {
            boostedTags.add(tag);
        }
    }

    return {
        ...weights,
        boostedTags: Array.from(boostedTags),
        penalizedTags: Array.from(penalizedTags),
        boostedCategories: Array.from(boostedCategories),
        penalizedCategories: Array.from(penalizedCategories),
        preferredPriceLevels: budgetProfile.preferredLevels,
        placesPerDay: {
            min: paceProfile.placesPerDayMin,
            max: paceProfile.placesPerDayMax,
        },
        preferEveningSlots: tripProfile.preferEveningSlots || false,
    };
}

module.exports = { getWeights, TRIP_TYPE_PROFILES, PACE_MULTIPLIERS, BUDGET_PRICE_PREFERENCES };
