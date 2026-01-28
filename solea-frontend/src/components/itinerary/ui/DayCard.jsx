import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InfoChip from './InfoChip';
import ActivityTimelineTile from './ActivityTimelineTile';

/**
 * DayCard - Expandable day card with activities timeline
 */
const DayCard = ({
    dayNumber,
    dayName,
    date,
    weather,
    activities = [],
    defaultExpanded = false
}) => {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dayNumber * 0.1 }}
            className="w-full"
        >
            {/* Day Header - Clickable */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center gap-4 p-4 rounded-xl
                    bg-white/5 hover:bg-white/10 border border-white/10
                    transition-all duration-300 group"
            >
                {/* Day Number Badge */}
                <div className="flex-shrink-0 w-14 h-14 rounded-xl
                    bg-gradient-to-br from-amber-500 to-orange-500
                    flex items-center justify-center
                    shadow-lg shadow-orange-500/20">
                    <span className="text-white font-bold text-xl oswald">{dayNumber}</span>
                </div>

                {/* Day Info */}
                <div className="flex-1 text-left">
                    <h3 className="text-white font-semibold text-lg oswald">
                        {dayName}
                    </h3>
                    <p className="text-white/60 text-sm">{date}</p>
                </div>

                {/* Chips */}
                <div className="hidden sm:flex items-center gap-2">
                    {weather && (
                        <InfoChip
                            icon="🌡️"
                            text={`${weather.temp}°C`}
                            variant="info"
                            size="sm"
                        />
                    )}
                    <InfoChip
                        icon="📍"
                        text={`${activities.length} activités`}
                        size="sm"
                    />
                </div>

                {/* Expand Icon */}
                <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10
                        flex items-center justify-center
                        group-hover:bg-white/20 transition-colors"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.div>
            </button>

            {/* Expanded Content - Activities Timeline */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 pl-6 border-l-2 border-amber-500/30 ml-7 mt-2">
                            {activities.map((activity, index) => (
                                <ActivityTimelineTile
                                    key={activity.id}
                                    activity={activity}
                                    isLast={index === activities.length - 1}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default DayCard;
