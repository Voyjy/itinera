/**
 * Budget Estimator — estimates daily and total trip cost
 *
 * Uses place price_level, number of places/day, transport, and meals.
 * Safe defaults when data is missing.
 */

// Average cost per visit by price level (EUR)
const PRICE_LEVEL_COST = {
    1: 10,   // budget / free attractions
    2: 20,   // moderate
    3: 40,   // upscale
    4: 70,   // luxury
};

// Daily transport estimate by budget tier
const TRANSPORT_PER_DAY = {
    'Budget': 8,
    'Économique': 8,
    'Modéré': 15,
    'Confort': 22,
    'Luxe': 35,
};

// Daily meal estimate by budget tier
const MEALS_PER_DAY = {
    'Budget': 20,
    'Économique': 20,
    'Modéré': 40,
    'Confort': 65,
    'Luxe': 100,
};

const DEFAULT_PRICE_LEVEL = 2; // moderate assumption

/**
 * Estimate budget for a generated itinerary.
 *
 * @param {Object} itinerary - The generated itinerary object
 * @param {Object[]} scoredPlaces - Array of { place, score } objects used
 * @param {Object} preferences - Normalized preferences
 * @returns {{ perDay: number, total: number, breakdown: Object }}
 */
function estimateBudget(itinerary, scoredPlaces, preferences) {
    try {
        const numDays = itinerary.numDays || 3;
        const budget = preferences.budget || 'Modéré';

        // Calculate average attraction cost from scored places
        let totalAttractionCost = 0;
        let placeCount = 0;

        for (const sp of scoredPlaces) {
            const p = sp.place || sp;
            const level = p.priceLevel || DEFAULT_PRICE_LEVEL;
            const cost = PRICE_LEVEL_COST[level] || PRICE_LEVEL_COST[DEFAULT_PRICE_LEVEL];
            totalAttractionCost += cost;
            placeCount++;
        }

        const avgAttractionCost = placeCount > 0
            ? totalAttractionCost / placeCount
            : PRICE_LEVEL_COST[DEFAULT_PRICE_LEVEL];

        // Places per day from itinerary
        const placesPerDay = placeCount > 0
            ? Math.ceil(placeCount / numDays)
            : 3;

        const attractionsPerDay = avgAttractionCost * placesPerDay;
        const transport = TRANSPORT_PER_DAY[budget] || 15;
        const meals = MEALS_PER_DAY[budget] || 40;

        const perDay = Math.round(attractionsPerDay + transport + meals);
        const total = perDay * numDays;

        return {
            perDay,
            total,
            currency: 'EUR',
            breakdown: {
                attractions: Math.round(attractionsPerDay),
                transport,
                meals,
            },
        };
    } catch (err) {
        console.warn('⚠️ Budget estimation failed, using defaults:', err.message);
        return {
            perDay: 75,
            total: 225,
            currency: 'EUR',
            breakdown: { attractions: 20, transport: 15, meals: 40 },
        };
    }
}

module.exports = { estimateBudget };
