/**
 * TripPreferences — shared shape for all Phase 2 modules.
 * Used by weights, scoring, clustering, and scheduling.
 *
 * @typedef {Object} TripPreferences
 * @property {string} tripType - Famille | Romantique | Solo | Entre amis | Senior | Business
 * @property {string} budget - Budget | Modéré | Luxe
 * @property {string} pace - Relax | Modéré | Actif
 * @property {string[]} interests - Gastronomie, Histoire & Culture, Nature, Shopping, etc.
 * @property {string[]} accessibility - Accès fauteuil roulant, Marche limitée, Adapté aux enfants
 * @property {{ start?: string, end?: string }} [dates] - Optional trip dates
 * @property {string} [city] - Target city / destination
 */

/**
 * Normalize raw query/body params into a clean TripPreferences object.
 *
 * @param {Object} raw - Raw parameters from query string or request body
 * @returns {TripPreferences}
 */
function normalizePreferences(raw = {}) {
    return {
        tripType: raw.tripType || raw.travelType || 'Solo',
        budget: raw.budget || raw.budgetLevel || 'Modéré',
        pace: raw.pace || raw.paceLevel || 'Modéré',
        interests: parseArray(raw.interests),
        accessibility: parseArray(raw.accessibility),
        dates: raw.dates || {
            start: raw.startDate || null,
            end: raw.endDate || null,
        },
        city: raw.city || raw.destination || null,
    };
}

/**
 * Parse a value that could be a string (comma-separated) or an array.
 * @param {string|string[]|undefined} val
 * @returns {string[]}
 */
function parseArray(val) {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    return String(val).split(',').map(s => s.trim()).filter(Boolean);
}

module.exports = { normalizePreferences };
