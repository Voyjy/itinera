/**
 * Booking Link Generation Utilities
 * Generates redirect URLs for external booking sites
 */

/**
 * Format date for booking URLs (YYYY-MM-DD)
 */
const formatDate = (dateStr) => {
    if (!dateStr) {
        // Default to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    return dateStr;
};

/**
 * Format return date (default: 7 days after departure)
 */
const formatReturnDate = (departDate, returnDate) => {
    if (returnDate) return returnDate;

    const depart = new Date(departDate || Date.now());
    depart.setDate(depart.getDate() + 7);
    return depart.toISOString().split('T')[0];
};

/**
 * Get airport code for common cities (fallback to city name)
 */
const CITY_TO_AIRPORT = {
    'Paris': 'CDG',
    'London': 'LHR',
    'Londres': 'LHR',
    'New York': 'JFK',
    'Tokyo': 'NRT',
    'Rome': 'FCO',
    'Barcelona': 'BCN',
    'Barcelone': 'BCN',
    'Madrid': 'MAD',
    'Amsterdam': 'AMS',
    'Berlin': 'BER',
    'Dubai': 'DXB',
    'Dubaï': 'DXB',
    'Sydney': 'SYD',
    'Los Angeles': 'LAX',
    'Singapore': 'SIN',
    'Singapour': 'SIN',
    'Hong Kong': 'HKG',
    'Bangkok': 'BKK',
    'Istanbul': 'IST',
    'Lisbon': 'LIS',
    'Lisbonne': 'LIS',
    'Prague': 'PRG',
    'Vienna': 'VIE',
    'Vienne': 'VIE',
    'Athens': 'ATH',
    'Athènes': 'ATH',
    'Milan': 'MXP',
    'Venice': 'VCE',
    'Venise': 'VCE',
    'Nice': 'NCE',
    'Lyon': 'LYS',
    'Marseille': 'MRS'
};

const getAirportCode = (city) => {
    if (!city) return 'PAR';
    // Check if it's already an airport code (3 letters)
    if (/^[A-Z]{3}$/.test(city)) return city;
    return CITY_TO_AIRPORT[city] || city;
};

/**
 * Generate Google Flights search URL
 */
export const generateGoogleFlightsUrl = ({
    origin = 'Paris',
    destination,
    departDate,
    returnDate,
    travelers = 1
}) => {
    const from = getAirportCode(origin);
    const to = getAirportCode(destination);
    const depart = formatDate(departDate);
    const ret = formatReturnDate(depart, returnDate);

    // Google Flights URL format
    // https://www.google.com/travel/flights?q=flights%20from%20CDG%20to%20FCO%20on%202024-02-01%20through%202024-02-08
    const query = encodeURIComponent(`flights from ${from} to ${to} on ${depart} through ${ret} ${travelers} adult${travelers > 1 ? 's' : ''}`);

    return `https://www.google.com/travel/flights?q=${query}`;
};

/**
 * Generate Skyscanner search URL
 */
export const generateSkyscannerUrl = ({
    origin = 'Paris',
    destination,
    departDate,
    returnDate,
    travelers = 1
}) => {
    const from = getAirportCode(origin).toLowerCase();
    const to = getAirportCode(destination).toLowerCase();
    const depart = formatDate(departDate).replace(/-/g, '');
    const ret = formatReturnDate(formatDate(departDate), returnDate).replace(/-/g, '');

    // Skyscanner URL format
    return `https://www.skyscanner.fr/transport/vols/${from}/${to}/${depart.slice(2)}/${ret.slice(2)}/?adults=${travelers}&adultsv2=${travelers}&cabinclass=economy&children=0&childrenv2=&inboundaltsenabled=false&infants=0&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1`;
};

/**
 * Generate Booking.com search URL
 */
export const generateBookingUrl = ({
    destination,
    checkinDate,
    checkoutDate,
    travelers = 1,
    rooms = 1
}) => {
    const checkin = formatDate(checkinDate);
    const checkout = formatReturnDate(checkin, checkoutDate);
    const city = encodeURIComponent(destination || 'Paris');

    return `https://www.booking.com/searchresults.html?ss=${city}&checkin=${checkin}&checkout=${checkout}&group_adults=${travelers}&no_rooms=${rooms}&group_children=0`;
};

/**
 * Generate Agoda search URL
 */
export const generateAgodaUrl = ({
    destination,
    checkinDate,
    checkoutDate,
    travelers = 1,
    rooms = 1
}) => {
    const checkin = formatDate(checkinDate);
    const checkout = formatReturnDate(checkin, checkoutDate);
    const city = encodeURIComponent(destination || 'Paris');

    return `https://www.agoda.com/search?city=${city}&checkIn=${checkin}&checkOut=${checkout}&rooms=${rooms}&adults=${travelers}&children=0`;
};

/**
 * Generate Google Hotels search URL
 */
export const generateGoogleHotelsUrl = ({
    destination,
    checkinDate,
    checkoutDate,
    travelers = 1
}) => {
    const checkin = formatDate(checkinDate);
    const checkout = formatReturnDate(checkin, checkoutDate);
    const city = encodeURIComponent(destination || 'Paris');

    return `https://www.google.com/travel/hotels?q=hotels%20in%20${city}&dates=${checkin}_${checkout}&guests=${travelers}`;
};

/**
 * Generate all flight booking links
 */
export const generateFlightLinks = (params) => ({
    googleFlights: generateGoogleFlightsUrl(params),
    skyscanner: generateSkyscannerUrl(params)
});

/**
 * Generate all hotel booking links
 */
export const generateHotelLinks = (params) => ({
    booking: generateBookingUrl(params),
    agoda: generateAgodaUrl(params),
    googleHotels: generateGoogleHotelsUrl(params)
});

export default {
    generateGoogleFlightsUrl,
    generateSkyscannerUrl,
    generateBookingUrl,
    generateAgodaUrl,
    generateGoogleHotelsUrl,
    generateFlightLinks,
    generateHotelLinks
};
