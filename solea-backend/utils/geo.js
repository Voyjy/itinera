/**
 * Geo Utilities — Proximity Clustering (Phase 2.6)
 *
 * Groups places by geographic closeness to reduce zig-zag routes.
 * Degrades gracefully when lat/lng is missing.
 */

/**
 * Calculate the Haversine distance between two points in kilometers.
 *
 * @param {{ lat: number, lng: number }} a
 * @param {{ lat: number, lng: number }} b
 * @returns {number} Distance in km
 */
function haversineDistanceKm(a, b) {
    if (!a || !b || a.lat == null || a.lng == null || b.lat == null || b.lng == null) {
        return Infinity;
    }

    const R = 6371; // Earth's radius in km
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const sinDLat = Math.sin(dLat / 2);
    const sinDLng = Math.sin(dLng / 2);
    const aVal = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));

    return R * c;
}

function toRad(deg) {
    return (deg * Math.PI) / 180;
}

/**
 * Radius in km based on pace preference.
 */
const PACE_RADIUS = {
    'Relax': 1.0,
    'Modéré': 1.8,
    'Actif': 2.5,
};

/**
 * Cluster places by geographic proximity using greedy clustering.
 *
 * Algorithm:
 * 1. Separate places with geo data from those without
 * 2. Pick first unassigned place as cluster seed
 * 3. Add all unassigned places within radiusKm
 * 4. Repeat until all geo-aware places are assigned
 * 5. Places without geo → added to a catch-all "ungeolocated" cluster
 *
 * @param {Object[]} places - Array of Place objects with optional lat/lng
 * @param {Object} [options]
 * @param {string} [options.pace='Modéré'] - Pace for radius calculation
 * @param {number} [options.radiusKm] - Override radius in km
 * @returns {{ center: { lat: number, lng: number } | null, places: Object[] }[]}
 */
function clusterPlaces(places, options = {}) {
    if (!places || places.length === 0) {
        return [];
    }

    const pace = options.pace || 'Modéré';
    const radiusKm = options.radiusKm || PACE_RADIUS[pace] || 1.8;

    // Separate geo-aware from non-geo places
    const geoPlaces = places.filter(p => p.lat != null && p.lng != null);
    const noGeoPlaces = places.filter(p => p.lat == null || p.lng == null);

    // If most places lack geo data, return a single cluster with everything
    if (geoPlaces.length < 2) {
        return [{
            center: geoPlaces.length === 1 ? { lat: geoPlaces[0].lat, lng: geoPlaces[0].lng } : null,
            places: [...places],
        }];
    }

    // Greedy clustering
    const assigned = new Set();
    const clusters = [];

    for (let i = 0; i < geoPlaces.length; i++) {
        if (assigned.has(i)) continue;

        const seed = geoPlaces[i];
        const cluster = [seed];
        assigned.add(i);

        // Find all nearby unassigned places
        for (let j = i + 1; j < geoPlaces.length; j++) {
            if (assigned.has(j)) continue;

            const distance = haversineDistanceKm(
                { lat: seed.lat, lng: seed.lng },
                { lat: geoPlaces[j].lat, lng: geoPlaces[j].lng }
            );

            if (distance <= radiusKm) {
                cluster.push(geoPlaces[j]);
                assigned.add(j);
            }
        }

        // Compute cluster center (average lat/lng)
        const center = {
            lat: cluster.reduce((s, p) => s + p.lat, 0) / cluster.length,
            lng: cluster.reduce((s, p) => s + p.lng, 0) / cluster.length,
        };

        clusters.push({ center, places: cluster });
    }

    // Add non-geo places to a catch-all cluster
    if (noGeoPlaces.length > 0) {
        clusters.push({
            center: null,
            places: noGeoPlaces,
        });
    }

    // Sort clusters by size (largest first — most interesting neighborhoods)
    clusters.sort((a, b) => b.places.length - a.places.length);

    return clusters;
}

/**
 * Find the nearest cluster to a given point.
 * @param {{ lat: number, lng: number }} point
 * @param {{ center: { lat: number, lng: number } | null }[]} clusters
 * @returns {number} index of nearest cluster
 */
function findNearestCluster(point, clusters) {
    let minDist = Infinity;
    let nearest = 0;

    for (let i = 0; i < clusters.length; i++) {
        if (!clusters[i].center || !point) continue;
        const d = haversineDistanceKm(point, clusters[i].center);
        if (d < minDist) {
            minDist = d;
            nearest = i;
        }
    }
    return nearest;
}

module.exports = {
    haversineDistanceKm,
    clusterPlaces,
    findNearestCluster,
    PACE_RADIUS,
};
