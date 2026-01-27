import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassPanel from './ui/GlassPanel';
import PillButton from './ui/PillButton';

/**
 * HotelsSection - Display hotel options in itinerary sidebar
 * Shows real hotels from SerpAPI or empty state
 */
const HotelsSection = ({
    hotels = [],
    hotelLinks = {},
    destination = '',
    isLoading = false,
    maxItems = 6
}) => {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(true);

    // Skeleton loader
    const SkeletonCard = () => (
        <div className="animate-pulse p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-white/10" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 bg-white/10 rounded" />
                    <div className="h-3 w-20 bg-white/10 rounded" />
                </div>
                <div className="h-5 w-16 bg-white/10 rounded" />
            </div>
        </div>
    );

    // Format price display
    const formatPrice = (hotel) => {
        if (hotel.price?.amount) {
            return hotel.price.amount;
        }
        if (hotel.total_price) {
            return hotel.total_price;
        }
        return null;
    };

    return (
        <GlassPanel className="mb-6">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between mb-4"
            >
                <div className="flex items-center gap-2">
                    <span className="text-xl">🏨</span>
                    <h3 className="text-lg font-bold text-white oswald">
                        {t('itinerary.result.hotels', 'Hôtels')}
                    </h3>
                    {hotels.length > 0 && (
                        <span className="text-white/50 text-sm">
                            ({hotels.length})
                        </span>
                    )}
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
                        {/* Hotel Cards */}
                        <div className="space-y-2">
                            {isLoading ? (
                                <>
                                    <SkeletonCard />
                                    <SkeletonCard />
                                    <SkeletonCard />
                                </>
                            ) : hotels.length === 0 ? (
                                <div className="text-center py-6 text-white/50">
                                    <span className="text-2xl block mb-2">🔍</span>
                                    <p className="text-sm">
                                        {destination
                                            ? t('itinerary.result.noHotels', 'Aucun hôtel trouvé')
                                            : t('itinerary.result.selectDestination', 'Sélectionnez une destination')
                                        }
                                    </p>
                                </div>
                            ) : (
                                hotels.slice(0, maxItems).map((hotel, index) => (
                                    <motion.a
                                        key={hotel.name + index}
                                        href={hotel.link || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="block p-3 rounded-xl bg-white/5 border border-white/10 
                                            hover:bg-white/10 hover:border-white/20 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Thumbnail */}
                                            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
                                                {hotel.thumbnail ? (
                                                    <img
                                                        src={hotel.thumbnail}
                                                        alt={hotel.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/30">
                                                        🏨
                                                    </div>
                                                )}
                                            </div>

                                            {/* Hotel Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white font-medium oswald truncate text-sm group-hover:text-amber-400 transition-colors">
                                                    {hotel.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-white/50 text-xs">
                                                    {hotel.rating && (
                                                        <span className="flex items-center gap-1">
                                                            <span className="text-amber-400">★</span>
                                                            {hotel.rating}
                                                        </span>
                                                    )}
                                                    {hotel.reviews && (
                                                        <span>({hotel.reviews} avis)</span>
                                                    )}
                                                    {hotel.property_type && (
                                                        <span className="text-white/40">• {hotel.property_type}</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Price */}
                                            {formatPrice(hotel) && (
                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-emerald-400 font-bold oswald text-sm">
                                                        {formatPrice(hotel)}
                                                    </div>
                                                    <div className="text-white/40 text-xs">
                                                        /nuit
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.a>
                                ))
                            )}
                        </div>

                        {/* Booking Links */}
                        {hotels.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-2">
                                <a
                                    href={hotelLinks.booking}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1"
                                >
                                    <PillButton variant="primary" className="w-full" icon="🏨">
                                        Booking.com
                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                    </PillButton>
                                </a>
                                <a
                                    href={hotelLinks.googleHotels}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <PillButton variant="default" icon="🔍">
                                        Google Hotels
                                    </PillButton>
                                </a>
                            </div>
                        )}

                        {/* Disclaimer */}
                        {hotels.length > 0 && (
                            <p className="mt-3 text-white/40 text-xs text-center">
                                Prix indicatifs • Cliquez pour voir les tarifs en direct
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassPanel>
    );
};

export default HotelsSection;
