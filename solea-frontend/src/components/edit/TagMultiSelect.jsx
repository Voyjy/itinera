import React from 'react';
import { motion } from 'framer-motion';

// Available tags for selection
const AVAILABLE_TAGS = [
    { id: 'culture', label: 'Culture' },
    { id: 'food', label: 'Gastronomie' },
    { id: 'nature', label: 'Nature' },
    { id: 'relaxation', label: 'Détente' },
    { id: 'couple', label: 'Couple' },
    { id: 'family', label: 'Famille' },
    { id: 'solo', label: 'Solo' },
    { id: 'friends', label: 'Entre amis' },
    { id: 'photography', label: 'Photo' },
    { id: 'history', label: 'Histoire' },
    { id: 'art', label: 'Art' },
    { id: 'shopping', label: 'Shopping' },
    { id: 'wellness', label: 'Bien-être' },
    { id: 'nightlife', label: 'Vie nocturne' },
    { id: 'active', label: 'Actif' },
    { id: 'elder_friendly', label: 'Senior' }
];

/**
 * TagMultiSelect - Multi-select chips for interests/tags
 */
const TagMultiSelect = ({ selectedTags = [], onChange }) => {
    const toggleTag = (tagId) => {
        if (selectedTags.includes(tagId)) {
            onChange(selectedTags.filter(t => t !== tagId));
        } else {
            onChange([...selectedTags, tagId]);
        }
    };

    return (
        <div className="space-y-3">
            <label className="block text-white/80 text-sm font-medium oswald">
                Centres d'intérêt
            </label>
            <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                        <motion.button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition-all
                ${isSelected
                                    ? 'bg-amber-500 text-black border-amber-500'
                                    : 'bg-white/5 text-white/70 border-white/20 hover:bg-white/10'
                                }
                border
              `}
                        >
                            {tag.label}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

export default TagMultiSelect;
