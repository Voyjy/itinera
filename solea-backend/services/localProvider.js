/**
 * Local Provider — loads all continent JSON files and exposes a
 * unified Place model with optional lat/lng enrichment.
 *
 * Phase 1 foundation + Phase 2 geo enrichment.
 */

const fs = require('fs');
const path = require('path');
const { getCoordinates } = require('../Data/cityCoordinates');

// -------------------------------------------------------------------
// Tag → canonical category mapping
// -------------------------------------------------------------------
const TAG_TO_CATEGORY = {
    // Nature & Outdoor
    'beaches': 'nature', 'beach': 'nature', 'coastal': 'nature',
    'mountains': 'nature', 'nature': 'nature', 'volcano': 'nature',
    'islands': 'nature', 'wildlife': 'nature', 'hiking': 'nature',
    'diving': 'nature', 'snorkeling': 'nature', 'trekking': 'nature',
    'desert': 'nature', 'jungle': 'nature', 'safari': 'nature',
    'rice terraces': 'nature', 'waterfalls': 'nature', 'gardens': 'nature',
    'rainforest': 'nature', 'coral reefs': 'nature',

    // Culture & History
    'historic': 'culture', 'history': 'culture', 'cultural': 'culture',
    'temples': 'culture', 'traditional': 'culture', 'heritage': 'culture',
    'art': 'culture', 'architecture': 'culture', 'ancient': 'culture',
    'spiritual': 'culture', 'zen': 'culture', 'buddhist': 'culture',
    'colonial': 'culture', 'medieval': 'culture', 'ruins': 'culture',

    // Food & Gastronomy
    'gastronomy': 'gastronomie', 'culinary': 'gastronomie',
    'street food': 'gastronomie', 'seafood': 'gastronomie',
    'wine': 'gastronomie', 'food': 'gastronomie',

    // Romance & Luxury
    'romantic': 'romantique', 'luxury': 'luxe', 'wellness': 'luxe',
    'spa': 'luxe', 'resort': 'luxe',

    // Entertainment & Nightlife
    'nightlife': 'nightlife', 'party': 'nightlife',
    'entertainment': 'nightlife', 'festival': 'nightlife',
    'film festival': 'nightlife', 'carnival': 'nightlife',

    // Shopping & Modern
    'shopping': 'shopping', 'fashion': 'shopping', 'markets': 'shopping',
    'modern': 'moderne', 'technology': 'moderne', 'cosmopolitan': 'moderne',

    // Family & Adventure
    'family': 'famille', 'adventure': 'aventure', 'extreme': 'aventure',
    'elephants': 'famille',

    // Relaxation
    'riverside': 'détente', 'riviera': 'détente', 'relaxation': 'détente',
    'tranquil': 'détente', 'peaceful': 'détente',

    // Music / K-pop etc.
    'k-pop': 'culture', 'music': 'culture', 'jazz': 'culture',
};

/**
 * Map raw tags to canonical categories.
 * @param {string[]} tags
 * @returns {string[]}
 */
function tagsToCategories(tags) {
    if (!tags || !Array.isArray(tags)) return [];
    const cats = new Set();
    for (const tag of tags) {
        const cat = TAG_TO_CATEGORY[tag.toLowerCase()];
        if (cat) cats.add(cat);
    }
    return Array.from(cats);
}

// -------------------------------------------------------------------
// Load & normalize data
// -------------------------------------------------------------------
const DATA_DIR = path.join(__dirname, '..', 'Data');
const DATA_FILES = [
    'europe_cities.json',
    'Asia.json',
    'Africa.json',
    'NorthAmerica_cities.json',
    'SouthAmerica.json',
    'Oceania.json',
];

/** @type {import('./localProvider').Place[]} */
let _allPlaces = null;

/**
 * Load all JSON data files and normalize into Place objects.
 * Cached after first load.
 * @returns {Place[]}
 */
function loadAllPlaces() {
    if (_allPlaces) return _allPlaces;

    const places = [];
    let idCounter = 0;

    for (const file of DATA_FILES) {
        const filePath = path.join(DATA_DIR, file);
        if (!fs.existsSync(filePath)) {
            console.warn(`⚠️ Data file not found: ${file}`);
            continue;
        }

        try {
            const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            if (!Array.isArray(raw)) continue;

            for (const entry of raw) {
                const coords = getCoordinates(entry.city);
                const categories = tagsToCategories(entry.tags);

                // Derive a rough price_level from hotels
                const priceLevel = derivePriceLevel(entry.hotels);

                places.push({
                    id: `place-${++idCounter}`,
                    city: entry.city,
                    country: entry.country,
                    continent: entry.continent,
                    lat: coords?.lat || null,
                    lng: coords?.lng || null,
                    tags: entry.tags || [],
                    categories,
                    attractions: entry.attractions || [],
                    hotels: entry.hotels || {},
                    image: entry.image || null,
                    priceLevel,
                    // No opening_hours in source data — left as null
                    openingHours: null,
                });
            }
        } catch (err) {
            console.error(`❌ Error loading ${file}:`, err.message);
        }
    }

    console.log(`📦 Loaded ${places.length} places from ${DATA_FILES.length} data files`);
    _allPlaces = places;
    return _allPlaces;
}

/**
 * Derive a rough price level (1-4) from hotel price data.
 * 1 = budget, 2 = moderate, 3 = upscale, 4 = luxury
 * @param {Object} hotels
 * @returns {number}
 */
function derivePriceLevel(hotels) {
    if (!hotels) return 2; // default moderate
    // Use 3-star average as baseline
    const threeStarHotels = hotels['3_star'] || [];
    if (threeStarHotels.length === 0) return 2;
    const avgPrice = threeStarHotels.reduce((sum, h) => sum + (h.price_per_night || 0), 0) / threeStarHotels.length;
    if (avgPrice <= 100) return 1;
    if (avgPrice <= 200) return 2;
    if (avgPrice <= 350) return 3;
    return 4;
}

// -------------------------------------------------------------------
// City name aliases (French → English + common variants)
// -------------------------------------------------------------------
const CITY_ALIASES = {
    // French → English
    'vienne': 'Vienna',
    'rome': 'Rome',
    'londres': 'London',
    'édimbourg': 'Edinburgh',
    'barcelone': 'Barcelona',
    'séville': 'Seville',
    'lisbonne': 'Lisbon',
    'athènes': 'Athens',
    'copenhague': 'Copenhagen',
    'bruxelles': 'Brussels',
    'le caire': 'Cairo',
    'pékin': 'Beijing',
    'moscou': 'Moscow',
    'varsovie': 'Warsaw',
    'cracovie': 'Krakow',
    'venise': 'Venice',
    'florence': 'Florence',
    'naples': 'Naples',
    'munich': 'Munich',
    'genève': 'Geneva',
    'zurich': 'Zurich',
    'istanbul': 'Istanbul',
    'santorin': 'Santorini',
    'dubrovnik': 'Dubrovnik',
    'tokyo': 'Tokyo',
    'kyoto': 'Kyoto',
    'osaka': 'Osaka',
    'séoul': 'Seoul',
    'singapour': 'Singapore',
    'kuala lumpur': 'Kuala Lumpur',
    'nouvelle-delhi': 'Delhi',
    'new delhi': 'Delhi',
    'bombay': 'Mumbai',
    'calcutta': 'Kolkata',
    'hanoï': 'Hanoi',
    'hô chi minh-ville': 'Ho Chi Minh City',
    'hô-chi-minh-ville': 'Ho Chi Minh City',
    'saigon': 'Ho Chi Minh City',
    'bangkok': 'Bangkok',
    'new york': 'New York',
    'san francisco': 'San Francisco',
    'la havane': 'Havana',
    'mexico': 'Mexico City',
    'rio de janeiro': 'Rio de Janeiro',
    'são paulo': 'São Paulo',
    'buenos aires': 'Buenos Aires',
    'bogota': 'Bogotá',
    'le cap': 'Cape Town',
    'marrakech': 'Marrakech',
    'fès': 'Fez',
    'nairobi': 'Nairobi',
    'zanzibar': 'Zanzibar',
    'sydney': 'Sydney',
    'melbourne': 'Melbourne',
    'auckland': 'Auckland',
    // Additional common misspellings/variants
    'wien': 'Vienna',       // German
    'firenze': 'Florence',  // Italian
    'venezia': 'Venice',    // Italian
    'napoli': 'Naples',     // Italian
    'praha': 'Prague',      // Czech
    'münchen': 'Munich',    // German
    'köpenhamn': 'Copenhagen', // Swedish
    'amsterdam': 'Amsterdam',
    'paris': 'Paris',
    'phuket': 'Phuket',
    'bali': 'Bali',
    'dubai': 'Dubai',
    'doha': 'Doha',
};

/**
 * Normalize a string: lowercase, strip accents.
 */
function normalizeStr(str) {
    return String(str).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .trim();
}

/**
 * Resolve a city name to the canonical name used in our data.
 * Multi-strategy: exact → alias → contains → accent-stripped.
 *
 * @param {string} input - City name from user (could be French, English, etc.)
 * @param {string[]} knownCities - List of city names in the data
 * @returns {string|null} Resolved canonical city name or null
 */
function resolveCity(input, knownCities) {
    if (!input) return null;
    const inputLower = input.toLowerCase().trim();
    const inputNorm = normalizeStr(input);

    // 1. Exact match (case-insensitive)
    const exact = knownCities.find(c => c.toLowerCase() === inputLower);
    if (exact) return exact;

    // 2. Alias lookup
    const aliased = CITY_ALIASES[inputLower];
    if (aliased) {
        const found = knownCities.find(c => c.toLowerCase() === aliased.toLowerCase());
        if (found) return found;
    }

    // 3. Accent-stripped match
    const normMatch = knownCities.find(c => normalizeStr(c) === inputNorm);
    if (normMatch) return normMatch;

    // 4. Contains/substring match (input contained in city name or vice versa)
    const containsMatch = knownCities.find(c => {
        const cNorm = normalizeStr(c);
        return cNorm.includes(inputNorm) || inputNorm.includes(cNorm);
    });
    if (containsMatch) return containsMatch;

    // 5. Alias values accent-stripped
    const aliasNorm = Object.entries(CITY_ALIASES).find(
        ([key]) => normalizeStr(key) === inputNorm
    );
    if (aliasNorm) {
        const found = knownCities.find(c => c.toLowerCase() === aliasNorm[1].toLowerCase());
        if (found) return found;
    }

    return null;
}

/**
 * Get places filtered by city name with smart matching.
 * @param {string} [city] - City name (French, English, or any variant)
 * @returns {Place[]}
 */
function getPlaces(city) {
    const all = loadAllPlaces();
    if (!city) return all;

    // Build list of known city names
    const knownCities = [...new Set(all.map(p => p.city))];

    // Resolve the input city name
    const resolved = resolveCity(city, knownCities);

    if (resolved) {
        console.log(`🔍 City resolved: "${city}" → "${resolved}"`);
        return all.filter(p => p.city === resolved);
    }

    console.warn(`⚠️ Could not resolve city: "${city}"`);
    return [];
}

/**
 * Get a paginated deck of places.
 * @param {{ page?: number, limit?: number, exclude?: string[] }} options
 * @returns {{ data: Place[], nextCursor: string|null, total: number }}
 */
function getDeck(options = {}) {
    const { page = 1, limit = 10, exclude = [] } = options;
    let places = loadAllPlaces();

    // Exclude already-seen
    if (exclude.length > 0) {
        const excludeSet = new Set(exclude);
        places = places.filter(p => !excludeSet.has(p.id));
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const pageData = places.slice(start, end);
    const hasMore = end < places.length;

    return {
        data: pageData,
        nextCursor: hasMore ? String(page + 1) : null,
        total: places.length,
    };
}

module.exports = {
    loadAllPlaces,
    getPlaces,
    getDeck,
    tagsToCategories,
};
