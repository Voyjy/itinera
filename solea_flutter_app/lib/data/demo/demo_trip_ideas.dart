import '../models/trip_idea.dart';

/// Curated demo dataset of 50+ TripIdea entries across multiple cities
/// Used when backend data is incomplete or offline
class DemoTripIdeas {
  static final List<TripIdea> ideas = [
    // === PARIS, FRANCE ===
    TripIdea(
      id: 'paris_louvre',
      cityId: 'paris',
      cityName: 'Paris',
      country: 'France',
      continent: 'Europe',
      activityTitle: 'Musée du Louvre',
      shortDescription: 'Le plus grand musée d\'art au monde avec la Joconde',
      whyThis:
          'Pour les amateurs d\'art et d\'histoire, une expérience inoubliable',
      tags: ['culture', 'history', 'art', 'family'],
      duration: '4h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
    ),
    TripIdea(
      id: 'paris_eiffel',
      cityId: 'paris',
      cityName: 'Paris',
      country: 'France',
      continent: 'Europe',
      activityTitle: 'Tour Eiffel au coucher du soleil',
      shortDescription:
          'Vue panoramique de Paris depuis le symbole de la ville',
      whyThis: 'Moment magique et romantique à ne pas manquer',
      tags: ['romantic', 'culture', 'city', 'photography'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=800',
    ),
    TripIdea(
      id: 'paris_montmartre',
      cityId: 'paris',
      cityName: 'Paris',
      country: 'France',
      continent: 'Europe',
      activityTitle: 'Balade dans Montmartre',
      shortDescription: 'Quartier bohème avec artistes et Sacré-Cœur',
      whyThis: 'Ambiance authentique et vue imprenable sur Paris',
      tags: ['culture', 'art', 'walking', 'food'],
      duration: '3h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800',
    ),
    TripIdea(
      id: 'paris_seine',
      cityId: 'paris',
      cityName: 'Paris',
      country: 'France',
      continent: 'Europe',
      activityTitle: 'Croisière sur la Seine',
      shortDescription: 'Découvrez Paris depuis l\'eau au fil des monuments',
      whyThis: 'Parfait pour se détendre tout en admirant la ville',
      tags: ['relaxation', 'romantic', 'elder_friendly', 'low_walking'],
      duration: '1h30',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
    ),

    // === TOKYO, JAPAN ===
    TripIdea(
      id: 'tokyo_shibuya',
      cityId: 'tokyo',
      cityName: 'Tokyo',
      country: 'Japon',
      continent: 'Asie',
      activityTitle: 'Shibuya Crossing',
      shortDescription: 'Le carrefour le plus animé du monde',
      whyThis: 'Énergie urbaine pure et culture pop japonaise',
      tags: ['city', 'culture', 'nightlife', 'photography'],
      duration: '2h',
      intensity: 'active',
      imageUrl:
          'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800',
    ),
    TripIdea(
      id: 'tokyo_senso',
      cityId: 'tokyo',
      cityName: 'Tokyo',
      country: 'Japon',
      continent: 'Asie',
      activityTitle: 'Temple Senso-ji',
      shortDescription: 'Le plus ancien temple de Tokyo à Asakusa',
      whyThis: 'Spiritualité et tradition au cœur de la modernité',
      tags: ['culture', 'history', 'spiritual', 'family'],
      duration: '2h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    ),
    TripIdea(
      id: 'tokyo_teamlab',
      cityId: 'tokyo',
      cityName: 'Tokyo',
      country: 'Japon',
      continent: 'Asie',
      activityTitle: 'teamLab Borderless',
      shortDescription: 'Musée d\'art numérique immersif unique au monde',
      whyThis: 'Expérience futuriste et créative époustouflante',
      tags: ['art', 'culture', 'family', 'photography'],
      duration: '3h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ),
    TripIdea(
      id: 'tokyo_tsukiji',
      cityId: 'tokyo',
      cityName: 'Tokyo',
      country: 'Japon',
      continent: 'Asie',
      activityTitle: 'Marché Tsukiji Outer',
      shortDescription: 'Sushis frais et street food japonaise',
      whyThis: 'Paradis gastronomique pour les foodies',
      tags: ['food', 'culture', 'shopping'],
      duration: '2h',
      intensity: 'active',
      imageUrl:
          'https://images.unsplash.com/photo-1580442151529-343f2f6e0e27?w=800',
    ),

    // === BARCELONA, SPAIN ===
    TripIdea(
      id: 'barcelona_sagrada',
      cityId: 'barcelona',
      cityName: 'Barcelone',
      country: 'Espagne',
      continent: 'Europe',
      activityTitle: 'La Sagrada Familia',
      shortDescription: 'Chef-d\'œuvre inachevé de Gaudí',
      whyThis: 'Architecture unique au monde, à couper le souffle',
      tags: ['culture', 'history', 'art', 'architecture'],
      duration: '2h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1583779457634-3f09f5c3f9cf?w=800',
    ),
    TripIdea(
      id: 'barcelona_beach',
      cityId: 'barcelona',
      cityName: 'Barcelone',
      country: 'Espagne',
      continent: 'Europe',
      activityTitle: 'Plage de Barceloneta',
      shortDescription: 'Soleil, mer et ambiance festive',
      whyThis: 'Idéal pour se détendre après la visite de la ville',
      tags: ['beach', 'relaxation', 'nightlife', 'family'],
      duration: '4h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    ),
    TripIdea(
      id: 'barcelona_guell',
      cityId: 'barcelona',
      cityName: 'Barcelone',
      country: 'Espagne',
      continent: 'Europe',
      activityTitle: 'Parc Güell',
      shortDescription: 'Jardin fantaisiste créé par Gaudí',
      whyThis: 'Vue panoramique et mosaïques colorées',
      tags: ['nature', 'art', 'architecture', 'family'],
      duration: '2h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1583779457634-3f09f5c3f9cf?w=800',
    ),
    TripIdea(
      id: 'barcelona_boqueria',
      cityId: 'barcelona',
      cityName: 'Barcelone',
      country: 'Espagne',
      continent: 'Europe',
      activityTitle: 'Marché de la Boqueria',
      shortDescription: 'Marché couvert aux mille saveurs',
      whyThis: 'Explosion de couleurs et tapas fraîches',
      tags: ['food', 'culture', 'shopping'],
      duration: '1h30',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800',
    ),

    // === BALI, INDONESIA ===
    TripIdea(
      id: 'bali_ubud',
      cityId: 'bali',
      cityName: 'Bali',
      country: 'Indonésie',
      continent: 'Asie',
      activityTitle: 'Rizières de Tegallalang',
      shortDescription: 'Paysages de rizières en terrasse à Ubud',
      whyThis: 'Sérénité absolue au cœur de la nature balinaise',
      tags: ['nature', 'relaxation', 'photography', 'spiritual'],
      duration: '3h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    ),
    TripIdea(
      id: 'bali_uluwatu',
      cityId: 'bali',
      cityName: 'Bali',
      country: 'Indonésie',
      continent: 'Asie',
      activityTitle: 'Temple d\'Uluwatu',
      shortDescription: 'Temple perché sur une falaise avec danse Kecak',
      whyThis: 'Coucher de soleil spectaculaire sur l\'océan',
      tags: ['culture', 'spiritual', 'romantic', 'nature'],
      duration: '3h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800',
    ),
    TripIdea(
      id: 'bali_spa',
      cityId: 'bali',
      cityName: 'Bali',
      country: 'Indonésie',
      continent: 'Asie',
      activityTitle: 'Spa traditionnel balinais',
      shortDescription: 'Massage et soins dans un cadre tropical',
      whyThis: 'Détente ultime et bien-être holistique',
      tags: ['relaxation', 'wellness', 'elder_friendly', 'low_walking'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    ),
    TripIdea(
      id: 'bali_monkey',
      cityId: 'bali',
      cityName: 'Bali',
      country: 'Indonésie',
      continent: 'Asie',
      activityTitle: 'Forêt des singes d\'Ubud',
      shortDescription: 'Sanctuaire naturel avec macaques en liberté',
      whyThis: 'Rencontre unique avec la faune locale',
      tags: ['nature', 'family', 'adventure'],
      duration: '2h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800',
    ),

    // === NEW YORK, USA ===
    TripIdea(
      id: 'nyc_central_park',
      cityId: 'newyork',
      cityName: 'New York',
      country: 'États-Unis',
      continent: 'Amérique',
      activityTitle: 'Central Park',
      shortDescription: 'Poumon vert au cœur de Manhattan',
      whyThis: 'Évasion nature en pleine métropole',
      tags: ['nature', 'family', 'relaxation', 'city'],
      duration: '3h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
    ),
    TripIdea(
      id: 'nyc_times_square',
      cityId: 'newyork',
      cityName: 'New York',
      country: 'États-Unis',
      continent: 'Amérique',
      activityTitle: 'Times Square by night',
      shortDescription: 'Spectacle de lumières et énergie électrique',
      whyThis: 'L\'essence même de la ville qui ne dort jamais',
      tags: ['city', 'nightlife', 'shopping', 'culture'],
      duration: '2h',
      intensity: 'active',
      imageUrl:
          'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
    ),
    TripIdea(
      id: 'nyc_liberty',
      cityId: 'newyork',
      cityName: 'New York',
      country: 'États-Unis',
      continent: 'Amérique',
      activityTitle: 'Statue de la Liberté',
      shortDescription: 'Symbole de liberté et vue sur Manhattan',
      whyThis: 'Icône mondiale et moment historique',
      tags: ['history', 'culture', 'family', 'photography'],
      duration: '4h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1503235930437-8c6293ba41f5?w=800',
    ),
    TripIdea(
      id: 'nyc_broadway',
      cityId: 'newyork',
      cityName: 'New York',
      country: 'États-Unis',
      continent: 'Amérique',
      activityTitle: 'Spectacle à Broadway',
      shortDescription: 'Comédies musicales de renommée mondiale',
      whyThis: 'Émotions garanties dans le temple du spectacle',
      tags: ['culture', 'nightlife', 'art', 'romantic'],
      duration: '3h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800',
    ),

    // === MARRAKECH, MOROCCO ===
    TripIdea(
      id: 'marrakech_medina',
      cityId: 'marrakech',
      cityName: 'Marrakech',
      country: 'Maroc',
      continent: 'Afrique',
      activityTitle: 'Souks de la Médina',
      shortDescription: 'Labyrinthe coloré d\'artisanat et d\'épices',
      whyThis: 'Immersion totale dans la culture marocaine',
      tags: ['culture', 'shopping', 'food', 'adventure'],
      duration: '3h',
      intensity: 'active',
      imageUrl:
          'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800',
    ),
    TripIdea(
      id: 'marrakech_jardin',
      cityId: 'marrakech',
      cityName: 'Marrakech',
      country: 'Maroc',
      continent: 'Afrique',
      activityTitle: 'Jardin Majorelle',
      shortDescription: 'Jardin bleu de Yves Saint Laurent',
      whyThis: 'Oasis de calme et beauté artistique',
      tags: ['nature', 'art', 'culture', 'relaxation'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ),
    TripIdea(
      id: 'marrakech_riad',
      cityId: 'marrakech',
      cityName: 'Marrakech',
      country: 'Maroc',
      continent: 'Afrique',
      activityTitle: 'Nuit dans un Riad traditionnel',
      shortDescription: 'Hébergement authentique avec patio intérieur',
      whyThis: 'Expérience unique de l\'hospitalité marocaine',
      tags: ['culture', 'relaxation', 'romantic', 'elder_friendly'],
      duration: '12h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1539437829697-1b4ed5aebd19?w=800',
    ),
    TripIdea(
      id: 'marrakech_hammam',
      cityId: 'marrakech',
      cityName: 'Marrakech',
      country: 'Maroc',
      continent: 'Afrique',
      activityTitle: 'Hammam traditionnel',
      shortDescription: 'Bain de vapeur et gommage au savon noir',
      whyThis: 'Rituel ancestral de purification',
      tags: ['wellness', 'relaxation', 'culture', 'low_walking'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1540555700478-4be289fbec6a?w=800',
    ),

    // === ROME, ITALY ===
    TripIdea(
      id: 'rome_colosseum',
      cityId: 'rome',
      cityName: 'Rome',
      country: 'Italie',
      continent: 'Europe',
      activityTitle: 'Le Colisée',
      shortDescription: 'Amphithéâtre antique emblématique',
      whyThis: 'Plongée dans la grandeur de l\'Empire romain',
      tags: ['history', 'culture', 'architecture', 'family'],
      duration: '2h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
    ),
    TripIdea(
      id: 'rome_vatican',
      cityId: 'rome',
      cityName: 'Rome',
      country: 'Italie',
      continent: 'Europe',
      activityTitle: 'Chapelle Sixtine',
      shortDescription: 'Chef-d\'œuvre de Michel-Ange au Vatican',
      whyThis: 'Art sacré et spiritualité au plus haut niveau',
      tags: ['art', 'culture', 'history', 'spiritual'],
      duration: '3h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=800',
    ),
    TripIdea(
      id: 'rome_trastevere',
      cityId: 'rome',
      cityName: 'Rome',
      country: 'Italie',
      continent: 'Europe',
      activityTitle: 'Dîner à Trastevere',
      shortDescription: 'Quartier bohème aux trattorias authentiques',
      whyThis: 'La dolce vita dans toute sa splendeur',
      tags: ['food', 'culture', 'nightlife', 'romantic'],
      duration: '3h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800',
    ),
    TripIdea(
      id: 'rome_fontana',
      cityId: 'rome',
      cityName: 'Rome',
      country: 'Italie',
      continent: 'Europe',
      activityTitle: 'Fontaine de Trevi',
      shortDescription: 'Fontaine baroque et tradition du vœu',
      whyThis: 'Moment magique dans la ville éternelle',
      tags: ['culture', 'romantic', 'photography', 'history'],
      duration: '1h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=800',
    ),

    // === RIO DE JANEIRO, BRAZIL ===
    TripIdea(
      id: 'rio_cristo',
      cityId: 'rio',
      cityName: 'Rio de Janeiro',
      country: 'Brésil',
      continent: 'Amérique',
      activityTitle: 'Christ Rédempteur',
      shortDescription: 'Statue emblématique au sommet du Corcovado',
      whyThis: 'Vue à 360° sur Rio, moment spirituel',
      tags: ['culture', 'spiritual', 'photography', 'family'],
      duration: '3h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800',
    ),
    TripIdea(
      id: 'rio_copacabana',
      cityId: 'rio',
      cityName: 'Rio de Janeiro',
      country: 'Brésil',
      continent: 'Amérique',
      activityTitle: 'Plage de Copacabana',
      shortDescription: 'Plage mythique avec ambiance brésilienne',
      whyThis: 'Soleil, caïpirinhas et samba sur le sable',
      tags: ['beach', 'relaxation', 'nightlife', 'family'],
      duration: '4h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1516306580123-e6e52b1b7b5f?w=800',
    ),
    TripIdea(
      id: 'rio_sugarloaf',
      cityId: 'rio',
      cityName: 'Rio de Janeiro',
      country: 'Brésil',
      continent: 'Amérique',
      activityTitle: 'Pain de Sucre en téléphérique',
      shortDescription: 'Vue panoramique depuis le rocher emblématique',
      whyThis: 'Coucher de soleil inoubliable sur Rio',
      tags: ['nature', 'adventure', 'photography', 'romantic'],
      duration: '2h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1518639192441-8fce0a366e2e?w=800',
    ),

    // === SANTORINI, GREECE ===
    TripIdea(
      id: 'santorini_sunset',
      cityId: 'santorini',
      cityName: 'Santorin',
      country: 'Grèce',
      continent: 'Europe',
      activityTitle: 'Coucher de soleil à Oia',
      shortDescription: 'Le plus beau coucher de soleil du monde',
      whyThis: 'Romantisme absolu avec vue sur la caldeira',
      tags: ['romantic', 'photography', 'relaxation', 'elder_friendly'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    ),
    TripIdea(
      id: 'santorini_wine',
      cityId: 'santorini',
      cityName: 'Santorin',
      country: 'Grèce',
      continent: 'Europe',
      activityTitle: 'Dégustation de vin volcanique',
      shortDescription: 'Vins uniques issus des sols volcaniques',
      whyThis: 'Découverte œnologique exceptionnelle',
      tags: ['food', 'culture', 'relaxation', 'romantic'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    ),
    TripIdea(
      id: 'santorini_boat',
      cityId: 'santorini',
      cityName: 'Santorin',
      country: 'Grèce',
      continent: 'Europe',
      activityTitle: 'Croisière dans la caldeira',
      shortDescription: 'Navigation vers les sources chaudes',
      whyThis: 'Baignade dans eaux volcaniques chaudes',
      tags: ['adventure', 'nature', 'relaxation', 'family'],
      duration: '5h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800',
    ),

    // === DUBAI, UAE ===
    TripIdea(
      id: 'dubai_burj',
      cityId: 'dubai',
      cityName: 'Dubaï',
      country: 'Émirats arabes unis',
      continent: 'Asie',
      activityTitle: 'Burj Khalifa At The Top',
      shortDescription: 'Vue depuis le plus haut bâtiment du monde',
      whyThis: 'Sensations fortes et panorama époustouflant',
      tags: ['city', 'architecture', 'photography', 'adventure'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    ),
    TripIdea(
      id: 'dubai_desert',
      cityId: 'dubai',
      cityName: 'Dubaï',
      country: 'Émirats arabes unis',
      continent: 'Asie',
      activityTitle: 'Safari dans le désert',
      shortDescription: 'Dunes en 4x4, dîner bédouin sous les étoiles',
      whyThis: 'Aventure authentique dans les sables dorés',
      tags: ['adventure', 'nature', 'culture', 'family'],
      duration: '6h',
      intensity: 'active',
      imageUrl:
          'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800',
    ),
    TripIdea(
      id: 'dubai_mall',
      cityId: 'dubai',
      cityName: 'Dubaï',
      country: 'Émirats arabes unis',
      continent: 'Asie',
      activityTitle: 'Dubai Mall & Aquarium',
      shortDescription: 'Shopping de luxe et aquarium géant',
      whyThis: 'Temple du shopping avec attractions uniques',
      tags: ['shopping', 'family', 'city', 'low_walking'],
      duration: '4h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800',
    ),

    // === SYDNEY, AUSTRALIA ===
    TripIdea(
      id: 'sydney_opera',
      cityId: 'sydney',
      cityName: 'Sydney',
      country: 'Australie',
      continent: 'Océanie',
      activityTitle: 'Opéra de Sydney',
      shortDescription: 'Chef-d\'œuvre architectural sur le port',
      whyThis: 'Icône australienne pour la culture et l\'art',
      tags: ['culture', 'architecture', 'art', 'photography'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800',
    ),
    TripIdea(
      id: 'sydney_bondi',
      cityId: 'sydney',
      cityName: 'Sydney',
      country: 'Australie',
      continent: 'Océanie',
      activityTitle: 'Bondi Beach',
      shortDescription: 'Plage mythique des surfeurs australiens',
      whyThis: 'Lifestyle australien et vagues parfaites',
      tags: ['beach', 'adventure', 'relaxation', 'family'],
      duration: '4h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1523428096881-5bd79d043006?w=800',
    ),
    TripIdea(
      id: 'sydney_harbour',
      cityId: 'sydney',
      cityName: 'Sydney',
      country: 'Australie',
      continent: 'Océanie',
      activityTitle: 'Harbour Bridge Climb',
      shortDescription: 'Grimpez au sommet du pont iconique',
      whyThis: 'Adrénaline et vue à 360° garanties',
      tags: ['adventure', 'city', 'photography'],
      duration: '3h',
      intensity: 'active',
      imageUrl:
          'https://images.unsplash.com/photo-1524293568345-75d62c3664f7?w=800',
    ),

    // === KYOTO, JAPAN ===
    TripIdea(
      id: 'kyoto_fushimi',
      cityId: 'kyoto',
      cityName: 'Kyoto',
      country: 'Japon',
      continent: 'Asie',
      activityTitle: 'Fushimi Inari Taisha',
      shortDescription: 'Milliers de torii rouges en montagne',
      whyThis: 'Chemin spirituel au cœur du Japon ancestral',
      tags: ['spiritual', 'nature', 'culture', 'photography'],
      duration: '3h',
      intensity: 'active',
      imageUrl:
          'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800',
    ),
    TripIdea(
      id: 'kyoto_bamboo',
      cityId: 'kyoto',
      cityName: 'Kyoto',
      country: 'Japon',
      continent: 'Asie',
      activityTitle: 'Forêt de bambou d\'Arashiyama',
      shortDescription: 'Promenade féérique dans les bambous géants',
      whyThis: 'Zen absolu et connexion à la nature',
      tags: ['nature', 'relaxation', 'photography', 'spiritual'],
      duration: '2h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    ),
    TripIdea(
      id: 'kyoto_geisha',
      cityId: 'kyoto',
      cityName: 'Kyoto',
      country: 'Japon',
      continent: 'Asie',
      activityTitle: 'Quartier de Gion',
      shortDescription: 'Rencontre avec les geishas au crépuscule',
      whyThis: 'Traditions séculaires dans un décor enchanteur',
      tags: ['culture', 'history', 'romantic', 'photography'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    ),
    TripIdea(
      id: 'kyoto_kinkaku',
      cityId: 'kyoto',
      cityName: 'Kyoto',
      country: 'Japon',
      continent: 'Asie',
      activityTitle: 'Kinkaku-ji (Pavillon d\'Or)',
      shortDescription: 'Temple doré reflété dans l\'étang',
      whyThis: 'Beauté et sérénité japonaises par excellence',
      tags: ['culture', 'spiritual', 'photography', 'history'],
      duration: '1h30',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
    ),

    // === AMSTERDAM, NETHERLANDS ===
    TripIdea(
      id: 'amsterdam_canals',
      cityId: 'amsterdam',
      cityName: 'Amsterdam',
      country: 'Pays-Bas',
      continent: 'Europe',
      activityTitle: 'Croisière sur les canaux',
      shortDescription: 'Navigation entre maisons typiques et ponts',
      whyThis: 'Perspective unique sur la Venise du Nord',
      tags: ['culture', 'romantic', 'relaxation', 'elder_friendly'],
      duration: '1h30',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
    ),
    TripIdea(
      id: 'amsterdam_vangogh',
      cityId: 'amsterdam',
      cityName: 'Amsterdam',
      country: 'Pays-Bas',
      continent: 'Europe',
      activityTitle: 'Musée Van Gogh',
      shortDescription: 'Plus grande collection d\'œuvres de Van Gogh',
      whyThis: 'Immersion dans le génie tourmenté',
      tags: ['art', 'culture', 'history', 'family'],
      duration: '2h30',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1583037189850-1921ae7c6c22?w=800',
    ),
    TripIdea(
      id: 'amsterdam_bikes',
      cityId: 'amsterdam',
      cityName: 'Amsterdam',
      country: 'Pays-Bas',
      continent: 'Europe',
      activityTitle: 'Balade à vélo dans Vondelpark',
      shortDescription: 'Le poumon vert d\'Amsterdam',
      whyThis: 'Vivre comme un local sur deux roues',
      tags: ['nature', 'family', 'adventure', 'city'],
      duration: '2h',
      intensity: 'active',
      imageUrl:
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ),

    // === CAPE TOWN, SOUTH AFRICA ===
    TripIdea(
      id: 'capetown_tablemountain',
      cityId: 'capetown',
      cityName: 'Le Cap',
      country: 'Afrique du Sud',
      continent: 'Afrique',
      activityTitle: 'Table Mountain',
      shortDescription: 'Téléphérique vers le sommet plat iconique',
      whyThis: 'Vue spectaculaire sur la ville et l\'océan',
      tags: ['nature', 'adventure', 'photography', 'family'],
      duration: '3h',
      intensity: 'balanced',
      imageUrl:
          'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800',
    ),
    TripIdea(
      id: 'capetown_penguins',
      cityId: 'capetown',
      cityName: 'Le Cap',
      country: 'Afrique du Sud',
      continent: 'Afrique',
      activityTitle: 'Boulders Beach Penguins',
      shortDescription: 'Colonie de manchots africains',
      whyThis: 'Rencontre attendrissante avec la faune locale',
      tags: ['nature', 'family', 'photography', 'beach'],
      duration: '2h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1497271679421-ce9c3d6a31da?w=800',
    ),
    TripIdea(
      id: 'capetown_wine',
      cityId: 'capetown',
      cityName: 'Le Cap',
      country: 'Afrique du Sud',
      continent: 'Afrique',
      activityTitle: 'Route des vins de Stellenbosch',
      shortDescription: 'Dégustation dans les vignobles historiques',
      whyThis: 'Vins primés dans un paysage de carte postale',
      tags: ['food', 'culture', 'relaxation', 'romantic'],
      duration: '5h',
      intensity: 'calm',
      imageUrl:
          'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800',
    ),
  ];

  /// Get ideas for a specific city
  static List<TripIdea> getIdeasForCity(String cityId) {
    return ideas
        .where((idea) =>
            idea.cityId.toLowerCase() == cityId.toLowerCase() ||
            idea.cityName.toLowerCase().contains(cityId.toLowerCase()))
        .toList();
  }

  /// Get ideas by tag
  static List<TripIdea> getIdeasByTag(String tag) {
    return ideas
        .where((idea) =>
            idea.tags.any((t) => t.toLowerCase() == tag.toLowerCase()))
        .toList();
  }

  /// Get random ideas
  static List<TripIdea> getRandomIdeas(int count) {
    final shuffled = List<TripIdea>.from(ideas)..shuffle();
    return shuffled.take(count).toList();
  }

  /// Get ideas filtered by multiple tags with scoring
  static List<TripIdea> getIdeasByTags(List<String> preferredTags,
      {int limit = 20}) {
    final scored = ideas.map((idea) {
      int score = 0;
      for (final tag in preferredTags) {
        if (idea.tags.any((t) => t.toLowerCase() == tag.toLowerCase())) {
          score += 2;
        }
      }
      return MapEntry(idea, score);
    }).toList();

    scored.sort((a, b) => b.value.compareTo(a.value));
    return scored.take(limit).map((e) => e.key).toList();
  }

  /// Get all unique cities
  static List<String> get allCities {
    return ideas.map((e) => e.cityName).toSet().toList();
  }

  /// Get all unique tags
  static List<String> get allTags {
    final tags = <String>{};
    for (final idea in ideas) {
      tags.addAll(idea.tags);
    }
    return tags.toList()..sort();
  }
}
