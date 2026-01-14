import React from 'react';
import { usePersonalization } from './usePersonalization';

// Placeholder city data with tags
const PLACEHOLDER_CITIES = [
    {
        id: 'paris',
        name: 'Paris',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800',
        tags: ['culture', 'food', 'couple', 'family'],
        why: 'Musées mondialement connus et gastronomie exceptionnelle'
    },
    {
        id: 'rome',
        name: 'Rome',
        country: 'Italie',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
        tags: ['culture', 'food', 'relaxed', 'elder_friendly'],
        why: 'Histoire fascinante et rythme de vie tranquille'
    },
    {
        id: 'barcelona',
        name: 'Barcelone',
        country: 'Espagne',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
        tags: ['culture', 'nature', 'balanced', 'family'],
        why: 'Architecture unique et plages magnifiques'
    },
    {
        id: 'lisbon',
        name: 'Lisbonne',
        country: 'Portugal',
        image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800',
        tags: ['relaxation', 'food', 'low_walking', 'elder_friendly'],
        why: 'Charme authentique et quartiers pittoresques'
    },
    {
        id: 'amsterdam',
        name: 'Amsterdam',
        country: 'Pays-Bas',
        image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800',
        tags: ['culture', 'nature', 'light_walking', 'family', 'kids'],
        why: 'Canaux paisibles et activités familiales'
    },
    {
        id: 'prague',
        name: 'Prague',
        country: 'République tchèque',
        image: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800',
        tags: ['culture', 'comfort', 'balanced', 'couple'],
        why: 'Architecture de conte de fées et ambiance romantique'
    },
    {
        id: 'vienna',
        name: 'Vienne',
        country: 'Autriche',
        image: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800',
        tags: ['culture', 'comfort', 'relaxed', 'elder_friendly'],
        why: 'Élégance impériale et cafés historiques'
    },
    {
        id: 'interlaken',
        name: 'Interlaken',
        country: 'Suisse',
        image: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800',
        tags: ['nature', 'relaxation', 'light_walking', 'family'],
        why: 'Montagnes spectaculaires et air pur'
    }
];

const RecommendationPlaceholder = () => {
    const { profile } = usePersonalization();

    if (!profile) {
        return null;
    }

    const userTags = profile.tags || [];

    // Score cities based on tag matches
    const scoredCities = PLACEHOLDER_CITIES.map(city => {
        const matchCount = city.tags.filter(tag => userTags.includes(tag)).length;
        return { ...city, matchCount };
    });

    // Get top matches (at least 1 matching tag)
    const recommendations = scoredCities
        .filter(city => city.matchCount > 0)
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, 6);

    // Fallback to first 3 cities if no matches
    const displayCities = recommendations.length > 0
        ? recommendations
        : PLACEHOLDER_CITIES.slice(0, 3);

    return (
        <div className="py-12 px-6 md:px-20 bg-gradient-to-b from-black to-zinc-900">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 oswald">
                    Vos recommandations
                </h2>
                <p className="text-white/70 mb-8 oswald text-lg">
                    Basé sur vos préférences
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayCities.map(city => (
                        <div
                            key={city.id}
                            className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:scale-[1.02] hover:border-white/30 transition-all duration-300 shadow-lg"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={city.image}
                                    alt={city.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/800x600?text=' + city.name;
                                    }}
                                />
                            </div>

                            <div className="p-5">
                                <h3 className="text-xl font-bold text-white mb-2 oswald">
                                    {city.name}
                                    <span className="text-white/60 font-normal text-base ml-2">
                                        {city.country}
                                    </span>
                                </h3>

                                {/* Matching tags */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {city.tags
                                        .filter(tag => userTags.includes(tag))
                                        .slice(0, 3)
                                        .map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-white/60 oswald">
                                        <span className="font-semibold text-white">Pourquoi ? </span>
                                        {city.why}
                                    </p>
                                </div>

                                <button className="w-full px-4 py-2 text-sm text-white border-2 border-white/30 bg-transparent hover:bg-white hover:text-black transition-all duration-300 rounded-lg oswald font-medium">
                                    Explorer
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 text-center">
                    <p className="text-white/50 text-sm oswald">
                        💡 Ces recommandations sont des exemples. La personnalisation complète sera disponible bientôt.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RecommendationPlaceholder;
