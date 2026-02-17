/**
 * City Coordinates Lookup Table
 * Static lat/lng for popular cities used in proximity clustering.
 * If a city is not here, clustering degrades gracefully (single cluster).
 *
 * Sources: approximate city-center coordinates.
 */

const CITY_COORDINATES = {
    // Europe
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Lyon': { lat: 45.7640, lng: 4.8357 },
    'Nice': { lat: 43.7102, lng: 7.2620 },
    'Marseille': { lat: 43.2965, lng: 5.3698 },
    'Bordeaux': { lat: 44.8378, lng: -0.5792 },
    'Strasbourg': { lat: 48.5734, lng: 7.7521 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Edinburgh': { lat: 55.9533, lng: -3.1883 },
    'Manchester': { lat: 53.4808, lng: -2.2426 },
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'Florence': { lat: 43.7696, lng: 11.2558 },
    'Venice': { lat: 45.4408, lng: 12.3155 },
    'Milan': { lat: 45.4642, lng: 9.1900 },
    'Naples': { lat: 40.8518, lng: 14.2681 },
    'Barcelona': { lat: 41.3851, lng: 2.1734 },
    'Madrid': { lat: 40.4168, lng: -3.7038 },
    'Seville': { lat: 37.3891, lng: -5.9845 },
    'Amsterdam': { lat: 52.3676, lng: 4.9041 },
    'Berlin': { lat: 52.5200, lng: 13.4050 },
    'Munich': { lat: 48.1351, lng: 11.5820 },
    'Prague': { lat: 50.0755, lng: 14.4378 },
    'Vienna': { lat: 48.2082, lng: 16.3738 },
    'Budapest': { lat: 47.4979, lng: 19.0402 },
    'Lisbon': { lat: 38.7223, lng: -9.1393 },
    'Porto': { lat: 41.1579, lng: -8.6291 },
    'Athens': { lat: 37.9838, lng: 23.7275 },
    'Dubrovnik': { lat: 42.6507, lng: 18.0944 },
    'Copenhagen': { lat: 55.6761, lng: 12.5683 },
    'Stockholm': { lat: 59.3293, lng: 18.0686 },
    'Oslo': { lat: 59.9139, lng: 10.7522 },
    'Helsinki': { lat: 60.1699, lng: 24.9384 },
    'Zurich': { lat: 47.3769, lng: 8.5417 },
    'Geneva': { lat: 46.2044, lng: 6.1432 },
    'Brussels': { lat: 50.8503, lng: 4.3517 },
    'Dublin': { lat: 53.3498, lng: -6.2603 },
    'Reykjavik': { lat: 64.1466, lng: -21.9426 },
    'Warsaw': { lat: 52.2297, lng: 21.0122 },
    'Krakow': { lat: 50.0647, lng: 19.9450 },
    'Istanbul': { lat: 41.0082, lng: 28.9784 },
    'Santorini': { lat: 36.3932, lng: 25.4615 },

    // Asia
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Kyoto': { lat: 35.0116, lng: 135.7681 },
    'Osaka': { lat: 34.6937, lng: 135.5023 },
    'Seoul': { lat: 37.5665, lng: 126.9780 },
    'Busan': { lat: 35.1796, lng: 129.0756 },
    'Bangkok': { lat: 13.7563, lng: 100.5018 },
    'Chiang Mai': { lat: 18.7883, lng: 98.9853 },
    'Phuket': { lat: 7.8804, lng: 98.3923 },
    'Bali': { lat: -8.3405, lng: 115.0920 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Kuala Lumpur': { lat: 3.1390, lng: 101.6869 },
    'Hong Kong': { lat: 22.3193, lng: 114.1694 },
    'Beijing': { lat: 39.9042, lng: 116.4074 },
    'Shanghai': { lat: 31.2304, lng: 121.4737 },
    'Hanoi': { lat: 21.0278, lng: 105.8342 },
    'Ho Chi Minh City': { lat: 10.8231, lng: 106.6297 },
    'Delhi': { lat: 28.7041, lng: 77.1025 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Jaipur': { lat: 26.9124, lng: 75.7873 },
    'Dubai': { lat: 25.2048, lng: 55.2708 },
    'Abu Dhabi': { lat: 24.4539, lng: 54.3773 },
    'Doha': { lat: 25.2854, lng: 51.5310 },
    'Taipei': { lat: 25.0330, lng: 121.5654 },
    'Colombo': { lat: 6.9271, lng: 79.8612 },
    'Kathmandu': { lat: 27.7172, lng: 85.3240 },
    'Yogyakarta': { lat: -7.7956, lng: 110.3695 },

    // North America
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'San Francisco': { lat: 37.7749, lng: -122.4194 },
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'Miami': { lat: 25.7617, lng: -80.1918 },
    'Las Vegas': { lat: 36.1699, lng: -115.1398 },
    'New Orleans': { lat: 29.9511, lng: -90.0715 },
    'Washington': { lat: 38.9072, lng: -77.0369 },
    'Toronto': { lat: 43.6532, lng: -79.3832 },
    'Vancouver': { lat: 49.2827, lng: -123.1207 },
    'Montreal': { lat: 45.5017, lng: -73.5673 },
    'Mexico City': { lat: 19.4326, lng: -99.1332 },
    'Cancun': { lat: 21.1619, lng: -86.8515 },
    'Havana': { lat: 23.1136, lng: -82.3666 },

    // South America
    'Rio de Janeiro': { lat: -22.9068, lng: -43.1729 },
    'São Paulo': { lat: -23.5505, lng: -46.6333 },
    'Buenos Aires': { lat: -34.6037, lng: -58.3816 },
    'Lima': { lat: -12.0464, lng: -77.0428 },
    'Bogotá': { lat: 4.7110, lng: -74.0721 },
    'Santiago': { lat: -33.4489, lng: -70.6693 },
    'Cusco': { lat: -13.5320, lng: -71.9675 },
    'Cartagena': { lat: 10.3910, lng: -75.5364 },
    'Medellín': { lat: 6.2442, lng: -75.5812 },

    // Africa
    'Marrakech': { lat: 31.6295, lng: -7.9811 },
    'Cape Town': { lat: -33.9249, lng: 18.4241 },
    'Cairo': { lat: 30.0444, lng: 31.2357 },
    'Nairobi': { lat: -1.2921, lng: 36.8219 },
    'Zanzibar': { lat: -6.1659, lng: 39.2026 },
    'Casablanca': { lat: 33.5731, lng: -7.5898 },
    'Fez': { lat: 34.0181, lng: -5.0078 },
    'Accra': { lat: 5.6037, lng: -0.1870 },
    'Lagos': { lat: 6.5244, lng: 3.3792 },
    'Johannesburg': { lat: -26.2041, lng: 28.0473 },

    // Oceania
    'Sydney': { lat: -33.8688, lng: 151.2093 },
    'Melbourne': { lat: -37.8136, lng: 144.9631 },
    'Auckland': { lat: -36.8485, lng: 174.7633 },
    'Queenstown': { lat: -45.0312, lng: 168.6626 },
    'Fiji': { lat: -17.7134, lng: 178.0650 },
};

/**
 * Look up coordinates for a city name.
 * @param {string} cityName
 * @returns {{ lat: number, lng: number } | null}
 */
function getCoordinates(cityName) {
    if (!cityName) return null;
    // Try exact match first
    if (CITY_COORDINATES[cityName]) return CITY_COORDINATES[cityName];
    // Try case-insensitive
    const key = Object.keys(CITY_COORDINATES).find(
        k => k.toLowerCase() === cityName.toLowerCase()
    );
    return key ? CITY_COORDINATES[key] : null;
}

module.exports = { CITY_COORDINATES, getCoordinates };
