import React from 'react';
import { motion } from 'framer-motion';

/**
 * Step3DatesTravelers - Date and traveler count selection step
 * Title: "Quand voyagez-vous ?"
 */

const Step3DatesTravelers = ({
    startDate,
    endDate,
    travelers,
    onStartDateChange,
    onEndDateChange,
    onTravelersChange
}) => {
    const handleTravelersIncrement = () => {
        onTravelersChange(Math.min((travelers || 1) + 1, 20));
    };

    const handleTravelersDecrement = () => {
        onTravelersChange(Math.max((travelers || 1) - 1, 1));
    };

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

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
                    Quand voyagez-vous ?
                </h2>
                <p className="text-white/60 text-sm md:text-base">
                    Sélectionnez vos dates et le nombre de voyageurs.
                </p>
            </div>

            {/* Date Inputs */}
            <div className="space-y-4 mb-8">
                {/* Start Date */}
                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2 oswald">
                        Date de départ
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={startDate || ''}
                            onChange={(e) => onStartDateChange(e.target.value)}
                            min={today}
                            className="w-full px-4 py-4 rounded-xl
                                bg-white/5 backdrop-blur-sm
                                border-2 border-white/20 
                                text-white
                                focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20
                                transition-all duration-300
                                text-base oswald
                                [color-scheme:dark]"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2 oswald">
                        Date de retour
                    </label>
                    <div className="relative">
                        <input
                            type="date"
                            value={endDate || ''}
                            onChange={(e) => onEndDateChange(e.target.value)}
                            min={startDate || today}
                            className="w-full px-4 py-4 rounded-xl
                                bg-white/5 backdrop-blur-sm
                                border-2 border-white/20 
                                text-white
                                focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20
                                transition-all duration-300
                                text-base oswald
                                [color-scheme:dark]"
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Travelers Count */}
            <div>
                <label className="block text-white/70 text-sm font-medium mb-3 oswald">
                    Nombre de voyageurs
                </label>
                <div className="flex items-center justify-center gap-6">
                    {/* Decrement Button */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleTravelersDecrement}
                        disabled={(travelers || 1) <= 1}
                        className={`
                            w-14 h-14 rounded-full
                            flex items-center justify-center
                            text-2xl font-bold
                            border-2 transition-all duration-300
                            ${(travelers || 1) <= 1
                                ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                                : 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-amber-500/50'
                            }
                        `}
                    >
                        −
                    </motion.button>

                    {/* Count Display */}
                    <div className="text-center min-w-[80px]">
                        <motion.div
                            key={travelers}
                            initial={{ scale: 1.2, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-bold text-white oswald"
                        >
                            {travelers || 1}
                        </motion.div>
                        <span className="text-white/50 text-sm">
                            {(travelers || 1) === 1 ? 'voyageur' : 'voyageurs'}
                        </span>
                    </div>

                    {/* Increment Button */}
                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleTravelersIncrement}
                        disabled={(travelers || 1) >= 20}
                        className={`
                            w-14 h-14 rounded-full
                            flex items-center justify-center
                            text-2xl font-bold
                            border-2 transition-all duration-300
                            ${(travelers || 1) >= 20
                                ? 'bg-white/5 border-white/10 text-white/30 cursor-not-allowed'
                                : 'bg-gradient-to-br from-amber-500 to-orange-500 border-transparent text-white hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-orange-500/30'
                            }
                        `}
                    >
                        +
                    </motion.button>
                </div>
            </div>

            {/* Optional helper text */}
            <p className="text-white/40 text-xs text-center mt-8">
                💡 Ces informations sont optionnelles et peuvent être modifiées plus tard
            </p>
        </motion.div>
    );
};

export default Step3DatesTravelers;
