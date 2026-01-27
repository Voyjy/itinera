import React from 'react';
import { motion } from 'framer-motion';
import PillButton from './ui/PillButton';

/**
 * HotelsCompareLinks - Hotel comparison links section
 */
const HotelsCompareLinks = ({ hotelLinks = {}, destination = '' }) => {
    const sites = [
        {
            id: 'booking',
            name: 'Booking.com',
            icon: '🏨',
            url: hotelLinks.booking,
            color: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
        },
        {
            id: 'agoda',
            name: 'Agoda',
            icon: '🌏',
            url: hotelLinks.agoda,
            color: 'bg-purple-500/20 border-purple-500/30 text-purple-400'
        },
        {
            id: 'google',
            name: 'Google Hotels',
            icon: '🔍',
            url: hotelLinks.googleHotels,
            color: 'bg-amber-500/20 border-amber-500/30 text-amber-400'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
        >
            <p className="text-white/60 text-sm mb-3">
                Comparer plus d'hôtels à {destination}
            </p>
            <div className="flex flex-wrap gap-2">
                {sites.map((site, index) => (
                    <motion.a
                        key={site.id}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg
                            border transition-all hover:scale-105
                            ${site.color}`}
                    >
                        <span>{site.icon}</span>
                        <span className="text-sm font-medium oswald">{site.name}</span>
                        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
};

export default HotelsCompareLinks;
