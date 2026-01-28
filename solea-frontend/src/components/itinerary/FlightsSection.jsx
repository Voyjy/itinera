import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassPanel from './ui/GlassPanel';
import PillButton from './ui/PillButton';

/**
 * FlightsSection - Display flight options with booking links
 */
const FlightsSection = ({
    flights = [],
    flightLinks = {},
    origin = 'Paris',
    destination = '',
    onOriginChange,
    isLoading = false
}) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [localOrigin, setLocalOrigin] = useState(origin);

    const handleOriginChange = (e) => {
        const newOrigin = e.target.value;
        setLocalOrigin(newOrigin);
        onOriginChange?.(newOrigin);
    };

    // Skeleton loader
    const SkeletonCard = () => (
        <div className="animate-pulse p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/10 rounded" />
                </div>
                <div className="h-6 w-16 bg-white/10 rounded" />
            </div>
        </div>
    );

    return (
        <GlassPanel className="mb-6">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-4"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xl">✈️</span>
                    <h3 className="text-lg font-bold text-white oswald">
                        Vols (meilleurs prix)
                    </h3>
                </div>
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    className="text-white/50"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        {/* Origin Input */}
                        <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                            <label className="block text-white/50 text-xs mb-1">
                                Ville de départ
                            </label>
                            <input
                                type="text"
                                value={localOrigin}
                                onChange={handleOriginChange}
                                placeholder="Paris, Lyon, Marseille..."
                                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20
                                    text-white placeholder-white/40 focus:outline-none focus:border-amber-500
                                    text-base oswald"
                            />
                        </div>

                        {/* Flight Cards */}
                        <div className="space-y-3">
                            {isLoading ? (
                                <>
                                    <SkeletonCard />
                                    <SkeletonCard />
                                    <SkeletonCard />
                                </>
                            ) : (
                                flights.slice(0, 4).map((flight, index) => (
                                    <motion.div
                                        key={flight.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative p-4 rounded-xl border transition-all
                                            ${flight.isBestChoice
                                                ? 'bg-amber-500/10 border-amber-500/30'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {/* Best Choice Badge */}
                                        {flight.isBestChoice && (
                                            <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full
                                                bg-amber-500 text-white text-xs font-bold">
                                                ⭐ Meilleur choix
                                            </div>
                                        )}

                                        {/* Cheapest Badge */}
                                        {flight.isCheapest && !flight.isBestChoice && (
                                            <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full
                                                bg-emerald-500 text-white text-xs font-bold">
                                                💰 Moins cher
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3">
                                            {/* Airline Logo */}
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10
                                                flex items-center justify-center text-xl">
                                                {flight.logo}
                                            </div>

                                            {/* Flight Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-medium oswald truncate">
                                                        {flight.airline}
                                                    </span>
                                                </div>
                                                <div className="text-white/50 text-xs">
                                                    {flight.departureTime} → {flight.arrivalTime} • {flight.duration}
                                                    {flight.stops > 0 && (
                                                        <span className="ml-2 text-orange-400">
                                                            ({flight.stopsLabel})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="text-right">
                                                <div className="text-emerald-400 font-bold oswald text-lg">
                                                    {flight.priceLabel}
                                                </div>
                                                <div className="text-white/40 text-xs">
                                                    /personne
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Booking Links */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            <a
                                href={flightLinks.googleFlights}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <PillButton variant="primary" className="w-full" icon="✈️">
                                    Voir sur Google Flights
                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </PillButton>
                            </a>
                            <a
                                href={flightLinks.skyscanner}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <PillButton variant="default" icon="🔍">
                                    Skyscanner
                                </PillButton>
                            </a>
                        </div>

                        {/* Disclaimer */}
                        <p className="mt-3 text-white/40 text-xs text-center">
                            Prix indicatifs • Cliquez pour voir les tarifs en direct
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassPanel>
    );
};

export default FlightsSection;
