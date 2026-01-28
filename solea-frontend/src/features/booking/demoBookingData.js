/**
 * Demo Booking Data
 * Sample flight and hotel data for when API is unavailable
 */

/**
 * Demo flight options for any destination
 */
export const generateDemoFlights = (destination, origin = 'Paris') => {
    const airlines = [
        { name: 'Air France', logo: '🇫🇷', color: 'blue' },
        { name: 'Lufthansa', logo: '🇩🇪', color: 'yellow' },
        { name: 'British Airways', logo: '🇬🇧', color: 'red' },
        { name: 'EasyJet', logo: '🟠', color: 'orange' },
        { name: 'Ryanair', logo: '🔵', color: 'blue' }
    ];

    // Generate randomized but realistic-looking prices
    const basePrice = Math.floor(Math.random() * 150) + 80;

    return [
        {
            id: 'flight-1',
            airline: airlines[0].name,
            logo: airlines[0].logo,
            price: basePrice,
            priceLabel: `${basePrice}€`,
            departureTime: '08:30',
            arrivalTime: '10:45',
            duration: '2h15',
            stops: 0,
            stopsLabel: 'Direct',
            isBestChoice: false,
            isCheapest: true,
            origin: origin,
            destination: destination
        },
        {
            id: 'flight-2',
            airline: airlines[1].name,
            logo: airlines[1].logo,
            price: basePrice + 35,
            priceLabel: `${basePrice + 35}€`,
            departureTime: '10:00',
            arrivalTime: '11:50',
            duration: '1h50',
            stops: 0,
            stopsLabel: 'Direct',
            isBestChoice: true, // Best balance of price/time
            isCheapest: false,
            origin: origin,
            destination: destination
        },
        {
            id: 'flight-3',
            airline: airlines[2].name,
            logo: airlines[2].logo,
            price: basePrice + 60,
            priceLabel: `${basePrice + 60}€`,
            departureTime: '14:20',
            arrivalTime: '16:30',
            duration: '2h10',
            stops: 0,
            stopsLabel: 'Direct',
            isBestChoice: false,
            isCheapest: false,
            origin: origin,
            destination: destination
        },
        {
            id: 'flight-4',
            airline: airlines[3].name,
            logo: airlines[3].logo,
            price: basePrice - 20,
            priceLabel: `${basePrice - 20}€`,
            departureTime: '06:00',
            arrivalTime: '09:30',
            duration: '3h30',
            stops: 1,
            stopsLabel: '1 escale',
            isBestChoice: false,
            isCheapest: false,
            origin: origin,
            destination: destination
        }
    ].sort((a, b) => a.price - b.price); // Sort by price
};

/**
 * Hotel comparison sites
 */
export const HOTEL_COMPARISON_SITES = [
    {
        id: 'booking',
        name: 'Booking.com',
        logo: '🏨',
        color: '#003580',
        description: 'Plus grand choix d\'hôtels'
    },
    {
        id: 'agoda',
        name: 'Agoda',
        logo: '🌏',
        color: '#5C2D91',
        description: 'Meilleurs prix Asie'
    },
    {
        id: 'google',
        name: 'Google Hotels',
        logo: '🔍',
        color: '#4285F4',
        description: 'Comparer tous les prix'
    }
];

/**
 * Flight comparison sites
 */
export const FLIGHT_COMPARISON_SITES = [
    {
        id: 'google',
        name: 'Google Flights',
        logo: '✈️',
        color: '#4285F4',
        description: 'Recherche complète'
    },
    {
        id: 'skyscanner',
        name: 'Skyscanner',
        logo: '🔍',
        color: '#0770e3',
        description: 'Comparer les compagnies'
    }
];

export default {
    generateDemoFlights,
    HOTEL_COMPARISON_SITES,
    FLIGHT_COMPARISON_SITES
};
