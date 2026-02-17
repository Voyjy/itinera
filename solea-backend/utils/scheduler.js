/**
 * Time-of-Day Scheduler (Phase 2.7)
 *
 * Assigns attractions to morning / afternoon / evening slots
 * and generates multi-day itineraries from scored + clustered places.
 */

const { clusterPlaces } = require('./geo');
const { getWeights } = require('./weights');

// -------------------------------------------------------------------
// Time-slot heuristics based on attraction name / tag keywords
// -------------------------------------------------------------------
const SLOT_KEYWORDS = {
    morning: [
        'cafe', 'café', 'coffee', 'breakfast', 'brunch', 'bakery', 'boulangerie',
        'park', 'garden', 'jardin', 'parc', 'market', 'marché',
        'viewpoint', 'sunrise', 'temple', 'shrine', 'mosque', 'cathedral',
        'basilica', 'church', 'pagoda', 'monastery',
        'jogging', 'yoga', 'beach walk',
    ],
    afternoon: [
        'museum', 'musée', 'gallery', 'galerie', 'palace', 'palais',
        'castle', 'château', 'fort', 'fortress', 'citadel',
        'monument', 'memorial', 'tower', 'tour',
        'shopping', 'mall', 'boutique', 'souk', 'bazaar',
        'city walk', 'district', 'quarter', 'quartier', 'neighborhood',
        'bridge', 'square', 'plaza', 'place', 'avenue',
        'zoo', 'aquarium', 'theme park', 'waterpark',
        'ruins', 'archaeological', 'historic',
    ],
    evening: [
        'restaurant', 'dining', 'dîner', 'dinner', 'bistro', 'brasserie',
        'bar', 'pub', 'lounge', 'rooftop', 'cocktail',
        'nightlife', 'club', 'disco', 'cabaret', 'show', 'spectacle',
        'cruise', 'croisière', 'river', 'boat',
        'sunset', 'coucher de soleil', 'night', 'nuit',
        'opera', 'opéra', 'theater', 'théâtre', 'concert',
        'wine', 'tasting', 'dégustation',
    ],
};

/**
 * Infer the best time slots for a place based on name/tag heuristics.
 *
 * @param {Object} place - Place object with attractions[] and tags[]
 * @returns {string[]} Array of preferred slots: ['morning', 'afternoon', 'evening']
 */
function inferBestTimeSlots(place) {
    const slots = { morning: 0, afternoon: 0, evening: 0 };
    const searchText = [
        ...(place.attractions || []),
        ...(place.tags || []),
        place.city || '',
    ].join(' ').toLowerCase();

    for (const [slot, keywords] of Object.entries(SLOT_KEYWORDS)) {
        for (const kw of keywords) {
            if (searchText.includes(kw)) {
                slots[slot]++;
            }
        }
    }

    // If no keywords matched, default to afternoon (most versatile)
    const total = slots.morning + slots.afternoon + slots.evening;
    if (total === 0) return ['afternoon'];

    // Return slots sorted by score, highest first
    return Object.entries(slots)
        .filter(([, count]) => count > 0)
        .sort((a, b) => b[1] - a[1])
        .map(([slot]) => slot);
}

/**
 * Number of places per day based on pace.
 */
const PLACES_PER_DAY = {
    'Relax': { min: 3, max: 4 },
    'Modéré': { min: 4, max: 5 },
    'Actif': { min: 5, max: 7 },
};

/**
 * Build a single day's schedule from a pool of scored attractions.
 * Distributes attractions across morning / afternoon / evening slots.
 *
 * @param {Object[]} attractions - Array of attraction-like objects
 * @param {import('../types/preferences').TripPreferences} preferences
 * @param {Object} [weightConfig] - Pre-computed weights
 * @returns {{ morning: Object[], afternoon: Object[], evening: Object[] }}
 */
function buildDailySchedule(attractions, preferences, weightConfig) {
    const pace = preferences.pace || 'Modéré';
    const paceConfig = PLACES_PER_DAY[pace] || PLACES_PER_DAY['Modéré'];
    const tripType = preferences.tripType || 'Solo';

    // Target number of places
    const targetCount = Math.min(
        paceConfig.min + Math.floor(Math.random() * (paceConfig.max - paceConfig.min + 1)),
        attractions.length
    );

    // Slot distribution based on trip type
    const slotDistribution = getSlotDistribution(tripType, pace, targetCount);

    const schedule = { morning: [], afternoon: [], evening: [] };
    const used = new Set();

    // Assign attractions to their best slots
    for (const slot of ['morning', 'afternoon', 'evening']) {
        const needed = slotDistribution[slot];
        let filled = 0;

        // First pass: assign attractions that strongly prefer this slot
        for (const attraction of attractions) {
            if (filled >= needed || used.has(attraction.id || attraction.name)) continue;

            const bestSlots = inferAttractionSlot(attraction);
            if (bestSlots[0] === slot) {
                schedule[slot].push(formatScheduleItem(attraction, slot));
                used.add(attraction.id || attraction.name);
                filled++;
            }
        }

        // Second pass: fill remaining with any unassigned attraction
        for (const attraction of attractions) {
            if (filled >= needed || used.has(attraction.id || attraction.name)) continue;
            schedule[slot].push(formatScheduleItem(attraction, slot));
            used.add(attraction.id || attraction.name);
            filled++;
        }
    }

    return schedule;
}

/**
 * Get slot distribution (how many places per slot) based on trip type.
 * @returns {{ morning: number, afternoon: number, evening: number }}
 */
function getSlotDistribution(tripType, pace, totalPlaces) {
    // Base distribution ratios
    const distributions = {
        'Romantique': { morning: 0.2, afternoon: 0.35, evening: 0.45 },
        'Famille': { morning: 0.3, afternoon: 0.45, evening: 0.25 },
        'Entre amis': { morning: 0.15, afternoon: 0.35, evening: 0.50 },
        'Solo': { morning: 0.25, afternoon: 0.45, evening: 0.30 },
        'Senior': { morning: 0.35, afternoon: 0.40, evening: 0.25 },
        'Business': { morning: 0.35, afternoon: 0.45, evening: 0.20 },
    };

    const dist = distributions[tripType] || { morning: 0.25, afternoon: 0.40, evening: 0.35 };

    const morning = Math.max(1, Math.round(totalPlaces * dist.morning));
    const evening = Math.max(1, Math.round(totalPlaces * dist.evening));
    const afternoon = Math.max(1, totalPlaces - morning - evening);

    return { morning, afternoon, evening };
}

/**
 * Infer best time slot for a single attraction name.
 */
function inferAttractionSlot(attraction) {
    const name = (attraction.name || attraction.title || '').toLowerCase();

    for (const [slot, keywords] of Object.entries(SLOT_KEYWORDS)) {
        for (const kw of keywords) {
            if (name.includes(kw)) return [slot];
        }
    }
    return ['afternoon']; // default
}

/**
 * Format an attraction into a schedule item with time info.
 */
function formatScheduleItem(attraction, slot) {
    const timeRanges = {
        morning: ['08:30', '09:00', '09:30', '10:00', '10:30'],
        afternoon: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
        evening: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
    };

    const times = timeRanges[slot] || timeRanges['afternoon'];
    const timeIndex = Math.floor(Math.random() * times.length);

    return {
        id: attraction.id || `attr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: attraction.name || attraction.title || attraction,
        time: times[timeIndex],
        slot,
        duration: slot === 'evening' ? '2h' : '1h30',
        type: inferActivityType(attraction),
        icon: inferActivityIcon(attraction, slot),
        description: attraction.description || `Découvrez ${attraction.name || attraction}`,
        address: attraction.address || `${attraction.name || attraction}`,
    };
}

/**
 * Infer activity type from attraction name.
 */
function inferActivityType(attraction) {
    const name = (attraction.name || attraction.title || '').toLowerCase();
    if (/museum|musée|gallery|galerie/.test(name)) return 'museum';
    if (/temple|shrine|mosque|cathedral|church|basilica/.test(name)) return 'landmark';
    if (/restaurant|café|cafe|bakery|market|food|dining/.test(name)) return 'food';
    if (/park|garden|beach|lake|river|waterfall/.test(name)) return 'nature';
    if (/shop|mall|boutique|bazaar|souk|market/.test(name)) return 'shopping';
    if (/bar|club|night|show|cruise|cabaret/.test(name)) return 'nightlife';
    if (/palace|castle|fortress|tower|monument/.test(name)) return 'landmark';
    return 'activity';
}

/**
 * Infer an emoji icon for an activity.
 */
function inferActivityIcon(attraction, slot) {
    const type = inferActivityType(attraction);
    const icons = {
        museum: '🎨', landmark: '🏛️', food: '🍽️', nature: '🌿',
        shopping: '🛍️', nightlife: '🌙', activity: '✨',
    };
    return icons[type] || '📍';
}

/**
 * Generate a full multi-day itinerary.
 *
 * Pipeline: scored places → cluster → schedule per day
 *
 * @param {{ place: Object, score: number }[]} scoredPlaces - From scoring.js
 * @param {import('../types/preferences').TripPreferences} preferences
 * @returns {Object} Itinerary with dayPlans[]
 */
function generateItinerary(scoredPlaces, preferences) {
    const pace = preferences.pace || 'Modéré';
    const paceConfig = PLACES_PER_DAY[pace] || PLACES_PER_DAY['Modéré'];
    const city = preferences.city || 'Unknown';

    // Calculate number of days
    let numDays = 3; // default
    if (preferences.dates?.start && preferences.dates?.end) {
        const start = new Date(preferences.dates.start);
        const end = new Date(preferences.dates.end);
        const diff = Math.abs(end - start);
        numDays = Math.max(1, Math.min(7, Math.ceil(diff / (1000 * 60 * 60 * 24))));
    }

    // Get place objects from scored results
    const places = scoredPlaces.map(s => s.place);

    // Cluster places by proximity
    const clusters = clusterPlaces(places, { pace });

    // Flatten attractions from all places, scored
    const allAttractions = [];
    for (const { place, score } of scoredPlaces) {
        for (const attr of (place.attractions || [])) {
            allAttractions.push({
                id: `${place.id}-${slugify(attr)}`,
                name: attr,
                city: place.city,
                country: place.country,
                parentPlaceId: place.id,
                parentScore: score,
                lat: place.lat,
                lng: place.lng,
                tags: place.tags,
                categories: place.categories,
            });
        }
    }

    // Sort attractions by parent score (best places first)
    allAttractions.sort((a, b) => b.parentScore - a.parentScore);

    // Distribute across days
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const weatherConditions = ['Ensoleillé', 'Partiellement nuageux', 'Nuageux', 'Dégagé'];
    const dayPlans = [];
    let attractionPool = [...allAttractions];

    for (let dayIdx = 0; dayIdx < numDays; dayIdx++) {
        // Select attractions for this day
        const dayCount = paceConfig.min + Math.floor(Math.random() * (paceConfig.max - paceConfig.min + 1));
        const dayAttractions = attractionPool.splice(0, Math.min(dayCount, attractionPool.length));

        // If pool exhausted, recycle from beginning
        if (dayAttractions.length < dayCount) {
            const needed = dayCount - dayAttractions.length;
            const recycled = allAttractions.slice(0, needed).map((a, i) => ({
                ...a,
                id: `${a.id}-day${dayIdx + 1}`,
                name: `${a.name} (bis)`,
            }));
            dayAttractions.push(...recycled);
        }

        // Build schedule
        const schedule = buildDailySchedule(dayAttractions, preferences);

        // Determine which clusters were used
        const usedClusterIndices = new Set();
        for (const attr of dayAttractions) {
            if (attr.lat != null && attr.lng != null) {
                for (let ci = 0; ci < clusters.length; ci++) {
                    if (clusters[ci].places.some(p => p.id === attr.parentPlaceId)) {
                        usedClusterIndices.add(ci);
                    }
                }
            }
        }

        dayPlans.push({
            dayIndex: dayIdx + 1,
            dayName: `Jour ${dayIdx + 1}`,
            date: `${dayNames[dayIdx % 7]}`,
            weather: {
                temp: 12 + ((dayIdx * 3) % 15),
                condition: weatherConditions[dayIdx % weatherConditions.length],
            },
            clustersUsed: usedClusterIndices.size,
            morning: schedule.morning,
            afternoon: schedule.afternoon,
            evening: schedule.evening,
            totalPlaces: schedule.morning.length + schedule.afternoon.length + schedule.evening.length,
            notes: generateDayNotes(dayIdx, preferences, schedule),
        });
    }

    return {
        id: `itinerary-${Date.now()}`,
        city,
        country: scoredPlaces[0]?.place?.country || '',
        tripType: preferences.tripType,
        pace: preferences.pace,
        budget: preferences.budget,
        numDays,
        totalAttractions: dayPlans.reduce((s, d) => s + d.totalPlaces, 0),
        totalClusters: clusters.length,
        dayPlans,
        generatedAt: new Date().toISOString(),
    };
}

/**
 * Generate helpful notes for a day.
 */
function generateDayNotes(dayIdx, preferences, schedule) {
    const notes = [];
    if (dayIdx === 0) notes.push('Premier jour — prenez le temps de vous installer !');
    if (preferences.pace === 'Relax') notes.push('Journée tranquille — profitez sans vous presser.');
    if (preferences.pace === 'Actif') notes.push('Journée bien remplie — prévoyez des chaussures confortables !');
    if (schedule.evening.length > 2) notes.push('Soirée animée ce soir !');
    return notes;
}

/**
 * Create a URL-safe slug from a string.
 */
function slugify(str) {
    return String(str).toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        .slice(0, 30);
}

module.exports = {
    inferBestTimeSlots,
    buildDailySchedule,
    generateItinerary,
    PLACES_PER_DAY,
    SLOT_KEYWORDS,
};
