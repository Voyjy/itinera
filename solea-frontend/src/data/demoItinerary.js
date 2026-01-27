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
 * Destination-specific activity templates
 * These are used to generate dynamic itineraries for any destination
 */
const DESTINATION_TEMPLATES = {
    // Major cities with custom activities
    'Paris': {
        activities: DEMO_ACTIVITIES.paris,
        stays: DEMO_STAYS.paris,
        transport: DEMO_TRANSPORT.paris,
        country: 'France'
    },
    'Prague': {
        country: 'Czechia',
        landmarks: ['Charles Bridge', 'Prague Castle', 'Old Town Square', 'Astronomical Clock', 'Vltava River'],
        museums: ['National Gallery', 'Jewish Museum', 'Mucha Museum'],
        foods: ['Trdelník', 'Svíčková', 'Czech Beer', 'Goulash'],
        cafes: ['Café Louvre', 'Café Savoy', 'Grand Café Orient'],
        neighborhoods: ['Malá Strana', 'Josefov', 'Vinohrady', 'Žižkov']
    },
    'Vienna': {
        country: 'Austria',
        landmarks: ['Schönbrunn Palace', 'St. Stephen\'s Cathedral', 'Belvedere Palace', 'Hofburg', 'Prater'],
        museums: ['Kunsthistorisches Museum', 'Albertina', 'Leopold Museum'],
        foods: ['Wiener Schnitzel', 'Sachertorte', 'Apfelstrudel', 'Tafelspitz'],
        cafes: ['Café Central', 'Café Sacher', 'Demel'],
        neighborhoods: ['Innere Stadt', 'Leopoldstadt', 'Neubau', 'Mariahilf']
    },
    'Rome': {
        country: 'Italy',
        landmarks: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Pantheon', 'Roman Forum'],
        museums: ['Vatican Museums', 'Galleria Borghese', 'Capitoline Museums'],
        foods: ['Carbonara', 'Cacio e Pepe', 'Supplì', 'Gelato'],
        cafes: ['Caffè Sant\'Eustachio', 'Antico Caffè Greco', 'Tazza d\'Oro'],
        neighborhoods: ['Trastevere', 'Testaccio', 'Monti', 'Prati']
    },
    'Barcelona': {
        country: 'Spain',
        landmarks: ['Sagrada Família', 'Park Güell', 'La Rambla', 'Casa Batlló', 'Gothic Quarter'],
        museums: ['Picasso Museum', 'MACBA', 'Fundació Joan Miró'],
        foods: ['Tapas', 'Paella', 'Jamón Ibérico', 'Churros con Chocolate'],
        cafes: ['Els Quatre Gats', 'Café de l\'Òpera', 'Satan\'s Coffee Corner'],
        neighborhoods: ['El Born', 'Gràcia', 'Barceloneta', 'Eixample']
    },
    'Amsterdam': {
        country: 'Netherlands',
        landmarks: ['Anne Frank House', 'Rijksmuseum', 'Canal Ring', 'Dam Square', 'Vondelpark'],
        museums: ['Van Gogh Museum', 'Stedelijk Museum', 'NEMO Science Museum'],
        foods: ['Stroopwafels', 'Bitterballen', 'Dutch Cheese', 'Poffertjes'],
        cafes: ['Café de Klos', 'Winkel 43', 'The Pancake Bakery'],
        neighborhoods: ['Jordaan', 'De Pijp', 'Oud-West', 'Plantage']
    }
};

/**
 * Generate activities for a specific destination
 * Creates dynamic, destination-specific content with UNIQUE activities per day
 */
const generateDestinationActivities = (destination, numDays = 3) => {
    const template = DESTINATION_TEMPLATES[destination];

    // If we have pre-built activities (like Paris), use them directly
    if (template?.activities) {
        return template.activities.slice(0, numDays);
    }

    // Otherwise, generate dynamic activities with proper distribution
    const destInfo = template || {
        landmarks: [`${destination} Main Square`, `${destination} Castle`, `${destination} Cathedral`, `${destination} River Walk`, `${destination} Old Town`, `${destination} Palace`, `${destination} Gardens`, `${destination} Tower`],
        museums: [`${destination} National Museum`, `${destination} Art Gallery`, `${destination} History Museum`, `${destination} Modern Art Center`, `${destination} Science Museum`],
        foods: ['Local Specialty', 'Traditional Breakfast', 'Street Food', 'Fine Dining', 'Wine Tasting', 'Local Bakery', 'Rooftop Brunch', 'Gourmet Market'],
        cafes: ['Historic Café', 'Local Coffee Shop', 'Rooftop Bar', 'Artisan Bakery', 'Garden Terrace', 'Riverside Café'],
        neighborhoods: ['Old Town', 'Art District', 'Waterfront', 'Market Area', 'Historic Quarter', 'Cultural Center', 'Bohemian District']
    };

    // Build a UNIQUE pool of all possible activities
    const allActivities = [];
    let activityId = 1;

    // Add all landmarks as unique activities
    destInfo.landmarks?.forEach((landmark, idx) => {
        allActivities.push({
            id: `act-landmark-${activityId++}`,
            type: 'landmark',
            icon: ['🏛️', '🏰', '⛪', '🌉', '🏛️', '👑', '🌳', '🗼'][idx % 8],
            title: `Visite de ${landmark}`,
            description: `Découvrez ce site incontournable de ${destination}.`,
            address: `${landmark}, ${destination}`,
            duration: '2h30',
            category: 'sightseeing'
        });
    });

    // Add all museums as unique activities
    destInfo.museums?.forEach((museum, idx) => {
        allActivities.push({
            id: `act-museum-${activityId++}`,
            type: 'museum',
            icon: ['🎨', '🖼️', '📜', '🔬', '🏛️'][idx % 5],
            title: `Découverte - ${museum}`,
            description: `Explorez les collections exceptionnelles de ce musée renommé.`,
            address: `${museum}, ${destination}`,
            duration: '2h30',
            category: 'culture'
        });
    });

    // Add all neighborhoods as walking activities
    destInfo.neighborhoods?.forEach((neighborhood, idx) => {
        allActivities.push({
            id: `act-walking-${activityId++}`,
            type: 'walking',
            icon: ['🚶', '🛍️', '🏘️', '🌆', '🏛️', '🎭', '🎪'][idx % 7],
            title: `Exploration de ${neighborhood}`,
            description: `Balade dans ce quartier authentique de ${destination}.`,
            address: `${neighborhood}, ${destination}`,
            duration: '2h',
            category: 'walk'
        });
    });

    // Add all cafes/restaurants as food activities
    destInfo.cafes?.forEach((cafe, idx) => {
        const mealTypes = ['Petit-déjeuner', 'Brunch', 'Pause café', 'Goûter', 'Apéritif', 'Pause thé'];
        allActivities.push({
            id: `act-food-${activityId++}`,
            type: 'food',
            icon: ['🥐', '☕', '🍰', '🥯', '🍷', '🫖'][idx % 6],
            title: `${mealTypes[idx % mealTypes.length]} - ${cafe}`,
            description: `Savourez ${destInfo.foods?.[idx % destInfo.foods.length] || 'une spécialité locale'} dans ce lieu emblématique.`,
            address: `${cafe}, ${destination}`,
            duration: '1h30',
            category: 'food'
        });
    });

    // Add dinner options
    destInfo.foods?.forEach((food, idx) => {
        if (idx < 4) { // Limit dinner options
            allActivities.push({
                id: `act-dinner-${activityId++}`,
                type: 'food',
                icon: ['🍽️', '🍷', '🥘', '🍝'][idx % 4],
                title: `Dîner - ${food}`,
                description: `Dégustez ${food} dans un restaurant traditionnel de ${destination}.`,
                address: `${destination} City Center`,
                duration: '2h',
                category: 'dinner'
            });
        }
    });

    // Shuffle the pool deterministically based on destination name
    const shuffleWithSeed = (array, seed) => {
        const result = [...array];
        let seedNum = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        for (let i = result.length - 1; i > 0; i--) {
            seedNum = (seedNum * 9301 + 49297) % 233280;
            const j = Math.floor((seedNum / 233280) * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    };

    const shuffledPool = shuffleWithSeed(allActivities, destination);

    // Calculate activities per day (aim for 6-7 per day)
    const activitiesPerDay = 6;
    const totalNeeded = numDays * activitiesPerDay;

    // Ensure we have enough activities (repeat pool if necessary, but mark as different)
    let activityPool = [...shuffledPool];
    while (activityPool.length < totalNeeded) {
        activityPool = activityPool.concat(shuffledPool.map((a, idx) => ({
            ...a,
            id: `${a.id}-repeat-${idx}`,
            title: a.title.replace('Visite de', 'Retour à').replace('Découverte', 'Suite de').replace('Exploration de', 'Fin de journée à')
        })));
    }

    // Define time slots for a typical day
    const timeSlots = [
        { time: '08:30', label: 'Matin tôt' },
        { time: '10:30', label: 'Matinée' },
        { time: '13:00', label: 'Déjeuner' },
        { time: '15:30', label: 'Après-midi' },
        { time: '18:00', label: 'Fin d\'après-midi' },
        { time: '20:30', label: 'Soirée' }
    ];

    const dayNames = ['Jour 1', 'Jour 2', 'Jour 3', 'Jour 4', 'Jour 5', 'Jour 6', 'Jour 7'];
    const dateNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
    const weatherConditions = ['Ensoleillé', 'Partiellement nuageux', 'Nuageux', 'Dégagé'];

    const days = [];
    const usedActivities = new Set();

    console.log(`📋 Building ${numDays}-day itinerary for ${destination}`);
    console.log(`📦 Activity pool size: ${activityPool.length}`);

    for (let dayNum = 1; dayNum <= numDays; dayNum++) {
        const dayActivities = [];

        for (let slotIdx = 0; slotIdx < activitiesPerDay; slotIdx++) {
            // Find next unused activity
            let activity = null;
            for (const a of activityPool) {
                if (!usedActivities.has(a.id)) {
                    activity = a;
                    usedActivities.add(a.id);
                    break;
                }
            }

            // Fallback: create free time if pool exhausted
            if (!activity) {
                activity = {
                    id: `act-free-${dayNum}-${slotIdx}`,
                    type: 'free',
                    icon: '✨',
                    title: 'Temps libre',
                    description: `Profitez de ce moment pour explorer ${destination} à votre rythme.`,
                    address: `${destination} City Center`,
                    duration: '2h',
                    category: 'free'
                };
            }

            dayActivities.push({
                ...activity,
                id: `act-${dayNum}-${slotIdx + 1}`,
                time: timeSlots[slotIdx].time
            });
        }

        // Log first 2 activities per day for debugging
        console.log(`📅 Day ${dayNum}:`, dayActivities.slice(0, 2).map(a => a.title));

        days.push({
            dayNumber: dayNum,
            dayName: dayNames[dayNum - 1] || `Jour ${dayNum}`,
            date: `${dateNames[(dayNum - 1) % 7]} ${dayNum + 2} Février`,
            weather: {
                temp: 8 + (dayNum * 2) % 10,
                condition: weatherConditions[(dayNum - 1) % weatherConditions.length]
            },
            activities: dayActivities
        });
    }

    console.log(`✅ Generated ${days.length} days with ${usedActivities.size} unique activities`);

    return days;
};


/**
 * Generate stays for a specific destination
 */
const generateDestinationStays = (destination) => {
    const template = DESTINATION_TEMPLATES[destination];
    if (template?.stays) return template.stays;

    const neighborhoods = template?.neighborhoods || ['City Center', 'Old Town', 'Waterfront'];

    return [
        {
            id: 'stay-1',
            name: `Boutique Hotel ${destination}`,
            type: 'Boutique Hotel',
            rating: 4.7,
            priceRange: '€€€',
            priceText: '180-250€ / nuit',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
            location: neighborhoods[0],
            amenities: ['WiFi', 'Petit-déjeuner', 'Climatisation'],
            bookingUrl: '#'
        },
        {
            id: 'stay-2',
            name: `${destination} Central Hotel`,
            type: 'Hotel 3 étoiles',
            rating: 4.5,
            priceRange: '€€',
            priceText: '120-180€ / nuit',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
            location: neighborhoods[1] || 'City Center',
            amenities: ['WiFi', 'Vue panoramique', 'Bar'],
            bookingUrl: '#'
        },
        {
            id: 'stay-3',
            name: `Le ${destination} Residence`,
            type: 'Boutique Hotel',
            rating: 4.6,
            priceRange: '€€',
            priceText: '140-200€ / nuit',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop',
            location: neighborhoods[2] || 'Old Town',
            amenities: ['WiFi', 'Rooftop', 'Restaurant'],
            bookingUrl: '#'
        }
    ];
};

/**
 * Generate transport options for a specific destination
 */
const generateDestinationTransport = (destination) => {
    const template = DESTINATION_TEMPLATES[destination];
    if (template?.transport) return template.transport;

    return [
        {
            id: 'transport-1',
            name: 'Metro / Tram',
            type: 'Transport public',
            icon: '🚇',
            description: `Pass transport ${destination} - Zones centrales`,
            priceText: '15-25€ / semaine',
            bookingUrl: '#'
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
            name: 'Vélos en libre-service',
            type: 'Vélo',
            icon: '🚲',
            description: 'Idéal pour explorer les quartiers',
            priceText: '5€ / jour',
            bookingUrl: '#'
        }
    ];
};

/**
 * Generate a demo itinerary based on user profile
 * NOW GENERATES DESTINATION-SPECIFIC CONTENT!
 * @param {Object} profile - User profile from personalization wizard
 * @returns {Object} Complete itinerary object
 */
export const generateDemoItinerary = (profile) => {
    const destination = profile?.destination || 'Paris';
    const tripType = profile?.travelType || profile?.tripType || 'Romantic';
    const travelers = profile?.travelers || 2;
    const startDate = profile?.startDate || new Date().toISOString().split('T')[0];
    const endDate = profile?.endDate || '';

    // Calculate number of days from dates, default to 3
    let numDays = 3;
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        numDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 3;
        numDays = Math.min(Math.max(numDays, 1), 7); // Clamp between 1-7 days
    }

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

    // Get country from template or derive from destination
    const template = DESTINATION_TEMPLATES[destination];
    const country = template?.country || '';

    // Generate destination-specific content
    const days = generateDestinationActivities(destination, numDays);
    const stays = generateDestinationStays(destination);
    const transport = generateDestinationTransport(destination);

    console.log('🌍 GENERATING ITINERARY FOR:', destination, '| Profile:', profile);

    return {
        id: `itinerary-${Date.now()}`,
        destination: destination,
        country: country,
        tripType: tripLabel,
        travelers: travelers,
        startDate: startDate,
        endDate: endDate,
        budget: profile?.budget || profile?.budgetLevel || 'moderate',
        pace: profile?.pace || profile?.paceLevel || 'moderate',
        days: days,
        stays: stays,
        transport: transport,
        generatedAt: new Date().toISOString()
    };
};

export default generateDemoItinerary;

