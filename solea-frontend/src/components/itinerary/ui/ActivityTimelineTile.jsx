import React from 'react';
import { motion } from 'framer-motion';

/**
 * ActivityTimelineTile - Single activity item in the timeline
 */
const ActivityTimelineTile = ({ activity, isLast = false }) => {
    const { time, duration, type, title, description, address, icon } = activity;

    // Activity type colors
    const typeColors = {
        food: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        museum: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        walking: 'bg-green-500/20 text-green-400 border-green-500/30',
        photo: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
        cruise: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        landmark: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        shopping: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
        default: 'bg-white/10 text-white/70 border-white/20'
    };

    const colorClass = typeColors[type] || typeColors.default;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`relative pb-6 ${isLast ? '' : ''}`}
        >
            {/* Timeline dot */}
            <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-slate-900" />

            {/* Content */}
            <div className="ml-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border ${colorClass}`}>
                            {icon}
                        </div>

                        {/* Title & Time */}
                        <div>
                            <h4 className="text-white font-semibold oswald">{title}</h4>
                            <div className="flex items-center gap-2 text-white/50 text-sm">
                                <span>🕐 {time}</span>
                                <span>•</span>
                                <span>{duration}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {description && (
                    <p className="text-white/70 text-sm mb-3 leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Address */}
                {address && (
                    <div className="flex items-center gap-2 text-white/50 text-xs">
                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{address}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ActivityTimelineTile;
