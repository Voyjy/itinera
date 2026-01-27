import React from 'react';
import { motion } from 'framer-motion';

/**
 * TransportCard - Transport option card
 */
const TransportCard = ({ transport, index = 0 }) => {
    const { name, type, icon, description, priceText, bookingUrl } = transport;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-4 rounded-xl
                bg-white/5 border border-white/10
                hover:bg-white/10 transition-colors"
        >
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl
                bg-blue-500/20 border border-blue-500/30
                flex items-center justify-center text-2xl">
                {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold oswald">{name}</h4>
                <p className="text-white/50 text-xs truncate">{description}</p>
            </div>

            {/* Price & Action */}
            <div className="flex flex-col items-end gap-1">
                <span className="text-emerald-400 text-sm font-medium oswald">
                    {priceText}
                </span>
                <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 text-xs hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                    Réserver
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                </a>
            </div>
        </motion.div>
    );
};

export default TransportCard;
