import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../ui/GlassCard';

/**
 * Step2Destination - Destination selection step
 * Title: "Où voulez-vous explorer ?"
 */

const POPULAR_DESTINATIONS = [
    {
        id: 'paris',
        name: 'Paris',
        country: 'France',
        image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop'
    },
    {
        id: 'tokyo',
        name: 'Tokyo',
        country: 'Japon',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop'
    },
    {
        id: 'rome',
        name: 'Rome',
        country: 'Italie',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop'
    },
    {
        id: 'new-york',
        name: 'New York',
        country: 'États-Unis',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop'
    },
    {
        id: 'barcelona',
        name: 'Barcelone',
        country: 'Espagne',
        image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400&h=300&fit=crop'
    },
    {
        id: 'bali',
        name: 'Bali',
        country: 'Indonésie',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop'
    }
];

const Step2Destination = ({ value, onChange }) => {
    const [searchQuery, setSearchQuery] = useState(value || '');
    const [showCustom, setShowCustom] = useState(false);

    const handleDestinationSelect = (destination) => {
        setSearchQuery(destination.name);
        onChange(destination.name);
        setShowCustom(false);
    };

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        onChange(query);
        setShowCustom(query.length > 0 && !POPULAR_DESTINATIONS.find(d => d.name === query));
    };

    const isSelected = (destination) => {
        return value === destination.name;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            {/* Title */}
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white oswald mb-2">
                    Où voulez-vous explorer ?
                </h2>
                <p className="text-white/60 text-sm md:text-base">
                    Choisissez une destination populaire ou entrez la vôtre.
                </p>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Rechercher une destination..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl
                        bg-white/5 backdrop-blur-sm
                        border-2 border-amber-500/30 
                        text-white placeholder-white/40
                        focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20
                        transition-all duration-300
                        text-base oswald"
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            onChange('');
                        }}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/50 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Custom destination indicator */}
            {showCustom && searchQuery && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
                >
                    <p className="text-amber-400 text-sm flex items-center gap-2">
                        <span>✨</span>
                        Destination personnalisée : <strong>{searchQuery}</strong>
                    </p>
                </motion.div>
            )}

            {/* Popular Destinations */}
            <div className="mb-4">
                <h3 className="text-white/70 text-sm font-medium mb-3 oswald">
                    Destinations populaires
                </h3>
            </div>

            {/* Horizontal scrollable cards */}
            <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {POPULAR_DESTINATIONS.map((destination, index) => (
                    <motion.div
                        key={destination.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex-shrink-0 w-40"
                    >
                        <GlassCard
                            selected={isSelected(destination)}
                            onClick={() => handleDestinationSelect(destination)}
                            accentColor="gold"
                            className="p-0 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative h-24 overflow-hidden">
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://via.placeholder.com/400x300?text=${destination.name}`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>

                            {/* Info */}
                            <div className="p-3">
                                <h4 className="text-white font-semibold text-sm oswald">
                                    {destination.name}
                                </h4>
                                <p className="text-white/50 text-xs">
                                    {destination.country}
                                </p>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Helper text */}
            <p className="text-white/40 text-xs text-center mt-4">
                💡 Vous pouvez aussi saisir une ville ou pays qui n'apparaît pas dans la liste
            </p>
        </motion.div>
    );
};

export default Step2Destination;
