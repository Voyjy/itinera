import React from 'react';
import { motion } from 'framer-motion';

/**
 * StayCard - Hotel/accommodation recommendation card
 */
const StayCard = ({ stay, index = 0 }) => {
    const { name, type, rating, priceRange, priceText, image, location, amenities, bookingUrl } = stay;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-xl bg-white/5 border border-white/10 overflow-hidden
                hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
        >
            {/* Image */}
            <div className="relative h-32 overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/400x200?text=${encodeURIComponent(name)}`;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-full
                    bg-amber-500/90 text-white text-xs font-bold flex items-center gap-1">
                    <span>⭐</span>
                    <span>{rating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="mb-2">
                    <h4 className="text-white font-semibold oswald line-clamp-1">{name}</h4>
                    <p className="text-white/50 text-xs">{type} • {location}</p>
                </div>

                {/* Amenities */}
                {amenities && amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">
                                {amenity}
                            </span>
                        ))}
                    </div>
                )}

                {/* Price & Book */}
                <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-semibold text-sm oswald">
                        {priceText}
                    </span>
                    <a
                        href={bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full
                            bg-amber-500/20 text-amber-400 text-xs font-medium
                            hover:bg-amber-500/30 transition-colors"
                    >
                        Réserver
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

export default StayCard;
