import React from 'react';
import { motion } from 'framer-motion';
import { getTagLabel } from './swipeUtils';

/**
 * SwipeCard - Individual card in the swipe deck
 * Premium glass UI with large background image
 */
const SwipeCard = ({
    card,
    isTop = false,
    dragX = 0,
    style = {}
}) => {
    // Calculate overlay opacity based on drag position
    const likeOpacity = Math.min(Math.max(dragX / 100, 0), 1);
    const nopeOpacity = Math.min(Math.max(-dragX / 100, 0), 1);

    return (
        <motion.div
            className="absolute w-full"
            style={{
                ...style,
                touchAction: 'none'
            }}
        >
            <div className="relative w-full aspect-[3/4] max-h-[520px] rounded-2xl overflow-hidden shadow-2xl">
                {/* Background Image */}
                <img
                    src={card.image}
                    alt={`${card.city}, ${card.country}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/800x1000?text=${card.city}`;
                    }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Glass Border Effect */}
                <div className="absolute inset-0 border border-white/20 rounded-2xl" />

                {/* LIKE Stamp */}
                {isTop && (
                    <motion.div
                        className="absolute top-8 right-4 px-4 py-2 border-4 border-emerald-400 rounded-lg transform rotate-12"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: likeOpacity, scale: 1 }}
                    >
                        <span className="text-emerald-400 font-bold text-2xl oswald tracking-wider">
                            LIKE ❤️
                        </span>
                    </motion.div>
                )}

                {/* NOPE Stamp */}
                {isTop && (
                    <motion.div
                        className="absolute top-8 left-4 px-4 py-2 border-4 border-rose-400 rounded-lg transform -rotate-12"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: nopeOpacity, scale: 1 }}
                    >
                        <span className="text-rose-400 font-bold text-2xl oswald tracking-wider">
                            NOPE ✕
                        </span>
                    </motion.div>
                )}

                {/* Card Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
                    {/* City & Country */}
                    <div>
                        <h3 className="text-3xl font-bold text-white oswald">
                            {card.city}
                        </h3>
                        <p className="text-lg text-white/70 oswald">
                            {card.country}
                        </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {card.tags.slice(0, 4).map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
                            >
                                {getTagLabel(tag)}
                            </span>
                        ))}
                    </div>

                    {/* Activities */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                        <p className="text-white/60 text-xs mb-2 oswald uppercase tracking-wider">
                            Idée d'activités
                        </p>
                        <ul className="space-y-1">
                            {card.activities.slice(0, 3).map((activity, idx) => (
                                <li key={idx} className="text-white text-sm flex items-center gap-2">
                                    <span className="text-amber-400">•</span>
                                    {activity}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Why */}
                    <div className="flex items-start gap-2">
                        <span className="text-amber-400 text-sm">💡</span>
                        <p className="text-white/80 text-sm italic">
                            {card.why}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SwipeCard;
