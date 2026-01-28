import React from 'react';
import { motion } from 'framer-motion';
import OptionTile from '../ui/OptionTile';
import GlassCard from '../ui/GlassCard';

/**
 * Step4Preferences - Final preferences selection step
 * Title: "Parlez-nous de vos préférences"
 * Includes: Budget, Pace, Interests, Accessibility
 */

const BUDGET_OPTIONS = [
    { id: 'budget', icon: '💰', title: 'Budget', description: 'Économique' },
    { id: 'moderate', icon: '💳', title: 'Modéré', description: 'Bon rapport qualité-prix' },
    { id: 'luxury', icon: '✨', title: 'Luxe', description: 'Premium & exclusif' }
];

const PACE_OPTIONS = [
    { id: 'relaxed', icon: '🧘', title: 'Relax', description: 'Rythme tranquille' },
    { id: 'moderate', icon: '🚶', title: 'Modéré', description: 'Équilibré' },
    { id: 'active', icon: '🏃', title: 'Actif', description: 'Beaucoup d\'activités' }
];

const INTEREST_OPTIONS = [
    { id: 'food', icon: '🍽️', title: 'Gastronomie' },
    { id: 'history', icon: '🏛️', title: 'Histoire & Culture' },
    { id: 'nature', icon: '🌿', title: 'Nature & Plein air' },
    { id: 'shopping', icon: '🛍️', title: 'Shopping' },
    { id: 'photography', icon: '📸', title: 'Photographie' },
    { id: 'nightlife', icon: '🌙', title: 'Vie nocturne' },
    { id: 'wellness', icon: '💆', title: 'Bien-être & Fitness' },
    { id: 'art', icon: '🎨', title: 'Art & Musées' }
];

const ACCESSIBILITY_OPTIONS = [
    { id: 'wheelchair', icon: '♿', title: 'Accès fauteuil roulant' },
    { id: 'limited_walking', icon: '🦯', title: 'Marche limitée' },
    { id: 'child_friendly', icon: '👶', title: 'Adapté aux enfants' }
];

const Step4Preferences = ({
    budget,
    pace,
    interests,
    accessibility,
    onBudgetChange,
    onPaceChange,
    onInterestsChange,
    onAccessibilityChange
}) => {
    const toggleInterest = (interestId) => {
        const currentInterests = interests || [];
        if (currentInterests.includes(interestId)) {
            onInterestsChange(currentInterests.filter(i => i !== interestId));
        } else {
            onInterestsChange([...currentInterests, interestId]);
        }
    };

    const toggleAccessibility = (accessId) => {
        const currentAccess = accessibility || [];
        if (currentAccess.includes(accessId)) {
            onAccessibilityChange(currentAccess.filter(a => a !== accessId));
        } else {
            onAccessibilityChange([...currentAccess, accessId]);
        }
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
                    Parlez-nous de vos préférences
                </h2>
                <p className="text-white/60 text-sm md:text-base">
                    Personnalisez votre expérience de voyage.
                </p>
            </div>

            {/* Scrollable content area for preferences */}
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

                {/* Budget Section */}
                <div>
                    <h3 className="text-white/80 text-sm font-semibold mb-3 oswald flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-xs">💵</span>
                        Budget
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {BUDGET_OPTIONS.map((option) => (
                            <motion.button
                                key={option.id}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onBudgetChange(option.id)}
                                className={`
                                    p-3 rounded-xl text-center
                                    border-2 transition-all duration-300
                                    ${budget === option.id
                                        ? 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/20'
                                        : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                                    }
                                `}
                            >
                                <div className="text-2xl mb-1">{option.icon}</div>
                                <div className="text-white text-sm font-medium oswald">{option.title}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Pace Section */}
                <div>
                    <h3 className="text-white/80 text-sm font-semibold mb-3 oswald flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">⚡</span>
                        Rythme
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {PACE_OPTIONS.map((option) => (
                            <motion.button
                                key={option.id}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => onPaceChange(option.id)}
                                className={`
                                    p-3 rounded-xl text-center
                                    border-2 transition-all duration-300
                                    ${pace === option.id
                                        ? 'bg-blue-500/20 border-blue-400 shadow-lg shadow-blue-500/20'
                                        : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                                    }
                                `}
                            >
                                <div className="text-2xl mb-1">{option.icon}</div>
                                <div className="text-white text-sm font-medium oswald">{option.title}</div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Interests Section */}
                <div>
                    <h3 className="text-white/80 text-sm font-semibold mb-3 oswald flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-xs">❤️</span>
                        Centres d'intérêt
                        <span className="text-white/40 font-normal">(plusieurs choix possibles)</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {INTEREST_OPTIONS.map((option) => {
                            const isSelected = (interests || []).includes(option.id);
                            return (
                                <motion.button
                                    key={option.id}
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleInterest(option.id)}
                                    className={`
                                        px-4 py-2 rounded-full
                                        flex items-center gap-2
                                        border-2 transition-all duration-300
                                        text-sm font-medium oswald
                                        ${isSelected
                                            ? 'bg-purple-500/20 border-purple-400 text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                                        }
                                    `}
                                >
                                    <span>{option.icon}</span>
                                    <span>{option.title}</span>
                                    {isSelected && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            ✓
                                        </motion.span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Accessibility Section */}
                <div>
                    <h3 className="text-white/80 text-sm font-semibold mb-3 oswald flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs">♿</span>
                        Accessibilité
                        <span className="text-white/40 font-normal">(optionnel)</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {ACCESSIBILITY_OPTIONS.map((option) => {
                            const isSelected = (accessibility || []).includes(option.id);
                            return (
                                <motion.button
                                    key={option.id}
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleAccessibility(option.id)}
                                    className={`
                                        px-4 py-2 rounded-full
                                        flex items-center gap-2
                                        border-2 transition-all duration-300
                                        text-sm font-medium oswald
                                        ${isSelected
                                            ? 'bg-green-500/20 border-green-400 text-white shadow-lg shadow-green-500/20'
                                            : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/30'
                                        }
                                    `}
                                >
                                    <span>{option.icon}</span>
                                    <span>{option.title}</span>
                                    {isSelected && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            ✓
                                        </motion.span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

// Export options for tag mapping
export const PREFERENCES_MAP = {
    budget: {
        'budget': ['budget_conscious'],
        'moderate': ['mid_range'],
        'luxury': ['luxury', 'comfort']
    },
    pace: {
        'relaxed': ['relaxed', 'low_walking', 'short_distances'],
        'moderate': ['balanced'],
        'active': ['light_walking', 'active']
    },
    interests: {
        'food': ['food'],
        'history': ['culture'],
        'nature': ['nature'],
        'shopping': ['shopping'],
        'photography': ['photography'],
        'nightlife': ['nightlife'],
        'wellness': ['wellness', 'relaxation'],
        'art': ['culture', 'art']
    },
    accessibility: {
        'wheelchair': ['wheelchair_access', 'elder_friendly'],
        'limited_walking': ['low_walking', 'short_distances', 'elder_friendly'],
        'child_friendly': ['kids', 'family']
    }
};

export default Step4Preferences;
