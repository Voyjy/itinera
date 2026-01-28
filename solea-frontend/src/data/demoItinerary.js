/**
 * Demo Itinerary Data
 * 3-day Paris trip for testing the Itinerary Result Screen
 */

export const DEMO_ACTIVITIES = {
    paris: [
        // Day 1
        {
            dayNumber: 1,
            dayName: 'Jour 1',
            date: 'Lundi 3 Février',
            weather: { temp: 8, condition: 'Partiellement nuageux' },
            activities: [
                {
                    id: 'act-1-1',
                    time: '08:30',
                    duration: '1h30',
                    type: 'food',
                    title: 'Petit-déjeuner au Café de Flore',
                    description: 'Croissants, café crème et jus d\'orange frais dans ce café légendaire de Saint-Germain-des-Prés.',
                    address: '172 Boulevard Saint-Germain, 75006 Paris',
                    icon: '🥐'
                },
                {
                    id: 'act-1-2',
                    time: '10:30',
                    duration: '3h',
                    type: 'museum',
                    title: 'Visite du Musée du Louvre',
                    description: 'Explorez les collections exceptionnelles incluant la Joconde, la Vénus de Milo et les appartements Napoléon.',
                    address: 'Rue de Rivoli, 75001 Paris',
                    icon: '🖼️'
                },
                {
                    id: 'act-1-3',
                    time: '13:30',
                    duration: '1h30',
                    type: 'food',
                    title: 'Déjeuner au Le Fumoir',
                    description: 'Restaurant chic près du Louvre offrant une cuisine française moderne dans un cadre bibliothèque.',
                    address: '6 Rue de l\'Amiral de Coligny, 75001 Paris',
                    icon: '🍽️'
                },
                {
                    id: 'act-1-4',
                    time: '15:30',
                    duration: '2h',
                    type: 'walking',
                    title: 'Promenade aux Jardins des Tuileries',
                    description: 'Balade romantique dans les jardins historiques avec vue sur la Place de la Concorde et la Tour Eiffel.',
                    address: 'Place de la Concorde, 75001 Paris',
                    icon: '🚶'
                },
                {
                    id: 'act-1-5',
                    time: '18:00',
                    duration: '2h30',
                    type: 'museum',
                    title: 'Musée d\'Orsay',
                    description: 'Découvrez les chefs-d\'œuvre impressionnistes de Monet, Renoir, Van Gogh et Degas.',
                    address: '1 Rue de la Légion d\'Honneur, 75007 Paris',
                    icon: '🎨'
                },
                {
                    id: 'act-1-6',
                    time: '20:30',
                    duration: '2h',
                    type: 'food',
                    title: 'Dîner au Le Procope',
                    description: 'Le plus ancien café de Paris (1686). Cuisine traditionnelle française dans un décor historique.',
                    address: '13 Rue de l\'Ancienne Comédie, 75006 Paris',
                    icon: '🍷'
                },
                {
                    id: 'act-1-7',
                    time: '22:30',
                    duration: '1h30',
                    type: 'cruise',
                    title: 'Croisière sur la Seine',
                    description: 'Vue nocturne magique de Paris illuminé depuis les Bateaux Mouches.',
                    address: 'Port de la Conférence, 75008 Paris',
                    icon: '🚢'
                }
            ]
        },
        // Day 2
        {
            dayNumber: 2,
            dayName: 'Jour 2',
            date: 'Mardi 4 Février',
            weather: { temp: 10, condition: 'Ensoleillé' },
            activities: [
                {
                    id: 'act-2-1',
                    time: '09:00',
                    duration: '1h',
                    type: 'food',
                    title: 'Petit-déjeuner chez Angelina',
                    description: 'Célèbre chocolat chaud et pâtisseries raffinées sur la rue de Rivoli.',
                    address: '226 Rue de Rivoli, 75001 Paris',
                    icon: '🍫'
                },
                {
                    id: 'act-2-2',
                    time: '10:30',
                    duration: '2h',
                    type: 'landmark',
                    title: 'Tour Eiffel',
                    description: 'Montée au 2ème étage pour une vue panoramique inoubliable sur Paris.',
                    address: 'Champ de Mars, 5 Av. Anatole France, 75007 Paris',
                    icon: '🗼'
                },
                {
                    id: 'act-2-3',
                    time: '13:00',
                    duration: '1h30',
                    type: 'food',
                    title: 'Déjeuner au Café Constant',
                    description: 'Bistrot parisien authentique du chef Christian Constant.',
                    address: '139 Rue Saint-Dominique, 75007 Paris',
                    icon: '🥗'
                },
                {
                    id: 'act-2-4',
                    time: '15:00',
                    duration: '2h30',
                    type: 'walking',
                    title: 'Quartier du Marais',
                    description: 'Exploration des ruelles médiévales, boutiques vintage et galeries d\'art.',
                    address: 'Place des Vosges, 75004 Paris',
                    icon: '🛍️'
                },
                {
                    id: 'act-2-5',
                    time: '18:00',
                    duration: '1h30',
                    type: 'photo',
                    title: 'Coucher de soleil à Montmartre',
                    description: 'Vue spectaculaire depuis le Sacré-Cœur au moment doré.',
                    address: '35 Rue du Chevalier de la Barre, 75018 Paris',
                    icon: '📸'
                },
                {
                    id: 'act-2-6',
                    time: '20:00',
                    duration: '2h30',
                    type: 'food',
                    title: 'Dîner au Pink Mamma',
                    description: 'Restaurant italien branché avec décor spectaculaire et cuisine authentique.',
                    address: '20bis Rue de Douai, 75009 Paris',
                    icon: '🍝'
                }
            ]
        },
        // Day 3
        {
            dayNumber: 3,
            dayName: 'Jour 3',
            date: 'Mercredi 5 Février',
            weather: { temp: 9, condition: 'Nuageux' },
            activities: [
                {
                    id: 'act-3-1',
                    time: '09:30',
                    duration: '1h',
                    type: 'food',
                    title: 'Brunch au Holybelly',
                    description: 'Brunch new-yorkais dans le 10ème arrondissement avec pancakes légendaires.',
                    address: '19 Rue Lucien Sampaix, 75010 Paris',
                    icon: '🥞'
                },
                {
                    id: 'act-3-2',
                    time: '11:00',
                    duration: '2h',
                    type: 'museum',
                    title: 'Centre Pompidou',
                    description: 'Art moderne et contemporain dans un bâtiment architectural iconique.',
                    address: 'Place Georges-Pompidou, 75004 Paris',
                    icon: '🏛️'
                },
                {
                    id: 'act-3-3',
                    time: '13:30',
                    duration: '1h30',
                    type: 'food',
                    title: 'Déjeuner chez L\'As du Fallafel',
                    description: 'Le meilleur falafel de Paris dans le cœur du Marais.',
                    address: '34 Rue des Rosiers, 75004 Paris',
                    icon: '🥙'
                },
                {
                    id: 'act-3-4',
                    time: '15:30',
                    duration: '2h',
                    type: 'walking',
                    title: 'Canal Saint-Martin',
                    description: 'Balade le long du canal pittoresque avec ses écluses et passerelles.',
                    address: 'Quai de Valmy, 75010 Paris',
                    icon: '🌉'
                },
                {
                    id: 'act-3-5',
                    time: '18:00',
                    duration: '2h',
                    type: 'shopping',
                    title: 'Shopping aux Galeries Lafayette',
                    description: 'Grand magasin emblématique avec sa coupole Art Nouveau spectaculaire.',
                    address: '40 Boulevard Haussmann, 75009 Paris',
                    icon: '🛒'
                },
                {
                    id: 'act-3-6',
                    time: '20:30',
                    duration: '2h30',
                    type: 'food',
                    title: 'Dîner d\'adieu au Train Bleu',
                    description: 'Restaurant Belle Époque somptueux dans la Gare de Lyon.',
                    address: 'Gare de Lyon, Place Louis-Armand, 75012 Paris',
                    icon: '✨'
                }
            ]
        }
    ]
};

export const DEMO_STAYS = {
    paris: [
        {
            id: 'stay-1',
            name: 'Hôtel Caron de Beaumarchais',
            type: 'Boutique Hotel',
            rating: 4.7,
            priceRange: '€€€',
            priceText: '180-250€ / nuit',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
            location: 'Le Marais, 4ème',
            amenities: ['WiFi', 'Petit-déjeuner', 'Climatisation'],
            bookingUrl: '#'
        },
        {
            id: 'stay-2',
            name: 'Hotel Eiffel Rive Gauche',
            type: 'Hotel 3 étoiles',
            rating: 4.5,
            priceRange: '€€',
            priceText: '120-180€ / nuit',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
            location: 'Tour Eiffel, 7ème',
            amenities: ['WiFi', 'Vue Tour Eiffel', 'Bar'],
            bookingUrl: '#'
        },
        {
            id: 'stay-3',
            name: 'Le Bloy Montmartre',
            type: 'Boutique Hotel',
            rating: 4.6,
            priceRange: '€€',
            priceText: '140-200€ / nuit',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
            location: 'Montmartre, 18ème',
            amenities: ['WiFi', 'Rooftop', 'Restaurant'],
            bookingUrl: '#'
        }
    ]
};

export const DEMO_TRANSPORT = {
    paris: [
        {
            id: 'transport-1',
            name: 'RATP Metro',
            type: 'Transport public',
            icon: '🚇',
            description: 'Pass Navigo Découverte - Zones 1-5',
            priceText: '22,80€ / semaine',
            bookingUrl: 'https://www.ratp.fr'
        },
        {
            id: 'transport-2',
            name: 'Uber / Taxi',
            type: 'Taxi privé',
            icon: '🚕',
            description: 'Pour les trajets de nuit ou avec bagages',
            priceText: 'Variable',
            bookingUrl: '#'
        },
        {
            id: 'transport-3',
            name: 'Vélib\'',
            type: 'Vélo en libre-service',
            icon: '🚲',
            description: 'Idéal pour explorer les quartiers',
            priceText: '5€ / jour',
            bookingUrl: 'https://www.velib-metropole.fr'
        }
    ]
};

/**
 * Generate a demo itinerary based on user profile
 * @param {Object} profile - User profile from personalization wizard
 * @returns {Object} Complete itinerary object
 */
export const generateDemoItinerary = (profile) => {
    const destination = profile?.destination || 'Paris';
    const tripType = profile?.travelType || 'Romantic';
    const travelers = profile?.travelers || 2;
    const startDate = profile?.startDate || new Date().toISOString().split('T')[0];
    const endDate = profile?.endDate || '';

    // Get trip type label
    const tripTypeLabels = {
        'En famille': 'Escapade Familiale',
        'En couple': 'Voyage Romantique',
        'Solo': 'Aventure Solo',
        'Avec enfants': 'Vacances en Groupe',
        'Senior / facile': 'Voyage Confort',
        'Business': 'Voyage d\'Affaires'
    };

    const tripLabel = tripTypeLabels[tripType] || 'Voyage Personnalisé';

    // Use Paris data for any destination (demo mode)
    const days = DEMO_ACTIVITIES.paris.map((day, index) => ({
        ...day,
        // Randomize slightly for "regenerate" feature
        activities: [...day.activities].sort(() => Math.random() > 0.7 ? 1 : -1)
    }));

    return {
        id: `itinerary-${Date.now()}`,
        destination: destination,
        country: destination === 'Paris' ? 'France' : '',
        tripType: tripLabel,
        travelers: travelers,
        startDate: startDate,
        endDate: endDate,
        budget: profile?.budgetLevel || 'moderate',
        pace: profile?.paceLevel || 'moderate',
        days: days,
        stays: DEMO_STAYS.paris,
        transport: DEMO_TRANSPORT.paris,
        generatedAt: new Date().toISOString()
    };
};

export default generateDemoItinerary;
