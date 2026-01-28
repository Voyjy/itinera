import React from 'react';
import { motion } from 'framer-motion';
import OptionTile from '../ui/OptionTile';

/**
 * Step1TripType - Travel type selection step
 * Title: "Quel type de voyage planifiez-vous ?"
 */

const TRIP_TYPES = [
    {
        id: 'famille',
        icon: '👨‍👩‍👧‍👦',
        title: 'Famille',
        description: 'Voyage adapté aux familles avec enfants'
    },
    {
        id: 'romantique',
        icon: '💑',
        title: 'Romantique',
        description: 'Escapade en amoureux'
    },
    {
        id: 'solo',
        icon: '🧳',
        title: 'Solo',
        description: 'Aventure en solitaire'
    },
    {
        id: 'amis',
        icon: '👥',
        title: 'Entre amis',
        description: 'Voyage de groupe entre amis'
    },
    {
        id: 'senior',
        icon: '🧓',
        title: 'Senior / Elder-friendly',
        description: 'Confort et accessibilité prioritaires'
    },
    {
        id: 'business',
        icon: '💼',
        title: 'Business',
        description: 'Voyage professionnel ou bleisure'
    }
];

const Step1TripType = ({ value, onChange }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            {/* Title */}
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white oswald mb-2">
                    Quel type de voyage planifiez-vous ?
                </h2>
                <p className="text-white/60 text-sm md:text-base">
                    Nous adaptons les idées et le rythme selon votre style.
                </p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                {TRIP_TYPES.map((type, index) => (
                    <motion.div
                        key={type.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <OptionTile
                            icon={type.icon}
                            title={type.title}
                            description={type.description}
                            selected={value === type.id}
                            onClick={() => onChange(type.id)}
                            accentColor="gold"
                        />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

// Export trip type mapping for use in storage/tags
export const TRIP_TYPE_MAP = {
    'famille': 'En famille',
    'romantique': 'En couple',
    'solo': 'Solo',
    'amis': 'Avec enfants', // Maps to existing tag, could also be group-specific
    'senior': 'Senior / facile',
    'business': 'Business'
};

export default Step1TripType;
