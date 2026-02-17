/**
 * File Store — simple JSON file–based persistence for saved trips.
 *
 * Uses data/savedTrips.json — auto-creates if missing.
 * Thread-safe enough for single-server use.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const FILE_PATH = path.join(DATA_DIR, 'savedTrips.json');

/**
 * Ensure the data directory and file exist.
 */
function ensureFile() {
    try {
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(FILE_PATH)) {
            fs.writeFileSync(FILE_PATH, '[]', 'utf8');
        }
    } catch (err) {
        console.error('❌ FileStore: could not ensure file:', err.message);
    }
}

/**
 * Read all saved trips.
 * @returns {Object[]}
 */
function readAll() {
    ensureFile();
    try {
        const raw = fs.readFileSync(FILE_PATH, 'utf8');
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
        console.warn('⚠️ FileStore: read error, returning empty:', err.message);
        return [];
    }
}

/**
 * Write all trips back to disk.
 * @param {Object[]} trips
 */
function writeAll(trips) {
    ensureFile();
    try {
        fs.writeFileSync(FILE_PATH, JSON.stringify(trips, null, 2), 'utf8');
    } catch (err) {
        console.error('❌ FileStore: write error:', err.message);
    }
}

/**
 * Save a trip and return its generated ID.
 * @param {{ city: string, preferences: Object, itinerary: Object }} tripData
 * @returns {string} tripId
 */
function saveTrip(tripData) {
    const trips = readAll();
    const tripId = crypto.randomUUID();

    const record = {
        id: tripId,
        city: tripData.city || tripData.itinerary?.city || 'Unknown',
        preferences: tripData.preferences || {},
        itinerary: tripData.itinerary || {},
        createdAt: new Date().toISOString(),
    };

    trips.push(record);
    writeAll(trips);
    return tripId;
}

/**
 * Get a trip by ID.
 * @param {string} tripId
 * @returns {Object|null}
 */
function getTripById(tripId) {
    const trips = readAll();
    return trips.find(t => t.id === tripId) || null;
}

/**
 * List all saved trips (summary only — no full itinerary).
 * @param {{ page?: number, limit?: number }} options
 * @returns {{ data: Object[], total: number }}
 */
function listTrips(options = {}) {
    const { page = 1, limit = 20 } = options;
    const trips = readAll();

    // Return summaries only
    const summaries = trips.map(t => ({
        id: t.id,
        city: t.city,
        createdAt: t.createdAt,
        days: t.itinerary?.numDays || t.itinerary?.days?.length || 0,
    }));

    // Sort newest first
    summaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const start = (page - 1) * limit;
    const pageData = summaries.slice(start, start + limit);

    return {
        data: pageData,
        total: summaries.length,
        page,
    };
}

module.exports = { saveTrip, getTripById, listTrips };
