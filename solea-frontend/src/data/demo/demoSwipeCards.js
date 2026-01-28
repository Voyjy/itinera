/**
 * Demo swipe cards for the Discover section
 * Each card represents a travel recommendation idea
 */

export const DEMO_SWIPE_CARDS = [
    {
        id: 'paris-culture',
        city: 'Paris',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
        tags: ['culture', 'couple', 'food', 'art'],
        activities: ['Musée du Louvre', 'Tour Eiffel', 'Croisière sur la Seine', 'Dégustation de pâtisseries'],
        why: 'La ville lumière offre une expérience romantique et culturelle incomparable'
    },
    {
        id: 'tokyo-modern',
        city: 'Tokyo',
        country: 'Japon',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
        tags: ['culture', 'food', 'solo', 'photography'],
        activities: ['Temples de Senso-ji', 'Quartier de Shibuya', 'Marché de Tsukiji', 'Jardins impériaux'],
        why: 'Un mélange fascinant de tradition ancestrale et modernité futuriste'
    },
    {
        id: 'barcelona-family',
        city: 'Barcelone',
        country: 'Espagne',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80',
        tags: ['family', 'nature', 'culture', 'balanced'],
        activities: ['Parc Güell', 'Sagrada Familia', 'Plage de Barceloneta', 'Aquarium'],
        why: 'Architecture Gaudí et plages méditerranéennes pour toute la famille'
    },
    {
        id: 'rome-relaxed',
        city: 'Rome',
        country: 'Italie',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
        tags: ['culture', 'food', 'relaxed', 'elder_friendly'],
        activities: ['Colisée', 'Fontaine de Trevi', 'Vatican', 'Dégustation de gelato'],
        why: 'Histoire millénaire à un rythme tranquille avec une cuisine exceptionnelle'
    },
    {
        id: 'kyoto-nature',
        city: 'Kyoto',
        country: 'Japon',
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80',
        tags: ['nature', 'relaxation', 'culture', 'couple'],
        activities: ['Forêt de bambous', 'Temple Kinkaku-ji', 'Cérémonie du thé', 'Jardins zen'],
        why: 'Sérénité absolue au cœur des temples et jardins traditionnels'
    },
    {
        id: 'amsterdam-family',
        city: 'Amsterdam',
        country: 'Pays-Bas',
        image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
        tags: ['family', 'culture', 'light_walking', 'kids'],
        activities: ['Croisière sur les canaux', 'Musée Van Gogh', 'Vondelpark', 'NEMO Science Museum'],
        why: 'Canaux pittoresques et musées interactifs parfaits pour les enfants'
    },
    {
        id: 'lisbon-relaxed',
        city: 'Lisbonne',
        country: 'Portugal',
        image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&q=80',
        tags: ['relaxed', 'food', 'elder_friendly', 'low_walking'],
        activities: ['Tramway 28', 'Tour de Belém', 'Pastéis de nata', 'Quartier de l\'Alfama'],
        why: 'Charme authentique et collines pittoresques avec de délicieux pastéis'
    },
    {
        id: 'bali-wellness',
        city: 'Bali',
        country: 'Indonésie',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        tags: ['wellness', 'nature', 'couple', 'relaxation'],
        activities: ['Rizières de Tegallalang', 'Temple d\'Uluwatu', 'Spa balinais', 'Yoga au lever du soleil'],
        why: 'Retraite spirituelle entre rizières verdoyantes et temples sacrés'
    },
    {
        id: 'vienna-culture',
        city: 'Vienne',
        country: 'Autriche',
        image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800&q=80',
        tags: ['culture', 'comfort', 'elder_friendly', 'relaxed'],
        activities: ['Palais de Schönbrunn', 'Opéra de Vienne', 'Café Sacher', 'Musée Albertina'],
        why: 'Élégance impériale et cafés historiques dans une atmosphère raffinée'
    },
    {
        id: 'santorini-romantic',
        city: 'Santorin',
        country: 'Grèce',
        image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        tags: ['couple', 'relaxation', 'photography', 'food'],
        activities: ['Coucher de soleil à Oia', 'Plages volcaniques', 'Dégustation de vin', 'Villages blancs'],
        why: 'Couchers de soleil légendaires et architecture cycladique romantique'
    },
    {
        id: 'prague-budget',
        city: 'Prague',
        country: 'République tchèque',
        image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80',
        tags: ['culture', 'budget_conscious', 'couple', 'history'],
        activities: ['Pont Charles', 'Château de Prague', 'Vieille ville', 'Bière artisanale'],
        why: 'Architecture de conte de fées à prix abordable'
    },
    {
        id: 'singapore-family',
        city: 'Singapour',
        country: 'Singapour',
        image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80',
        tags: ['family', 'kids', 'food', 'comfort'],
        activities: ['Gardens by the Bay', 'Sentosa Island', 'Zoo de Singapour', 'Marina Bay Sands'],
        why: 'Ville ultra-moderne avec attractions familiales de classe mondiale'
    },
    {
        id: 'reykjavik-nature',
        city: 'Reykjavik',
        country: 'Islande',
        image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&q=80',
        tags: ['nature', 'photography', 'solo', 'active'],
        activities: ['Blue Lagoon', 'Aurores boréales', 'Cercle d\'Or', 'Observation de baleines'],
        why: 'Paysages lunaires et phénomènes naturels extraordinaires'
    },
    {
        id: 'marrakech-adventure',
        city: 'Marrakech',
        country: 'Maroc',
        image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80',
        tags: ['culture', 'food', 'shopping', 'friends'],
        activities: ['Médina et souks', 'Jardin Majorelle', 'Hammam traditionnel', 'Place Jemaa el-Fna'],
        why: 'Immersion sensorielle dans les couleurs et saveurs du Maroc'
    },
    {
        id: 'swiss-alps',
        city: 'Interlaken',
        country: 'Suisse',
        image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&q=80',
        tags: ['nature', 'family', 'active', 'photography'],
        activities: ['Jungfraujoch', 'Randonnée alpine', 'Lac de Thoune', 'Train panoramique'],
        why: 'Sommets alpins spectaculaires et air pur des montagnes'
    }
];

export default DEMO_SWIPE_CARDS;
