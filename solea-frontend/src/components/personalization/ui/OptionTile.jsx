import React from 'react';
import { motion } from 'framer-motion';

/**
 * OptionTile - Selection tile with icon, title, and optional description
 * Used for trip types, interests, accessibility options, etc.
 * 
 * @param {Object} props
 * @param {string} props.icon - Emoji or icon character
 * @param {string} props.title - Main title text
 * @param {string} props.description - Optional description text
 * @param {boolean} props.selected - Whether the tile is selected
 * @param {Function} props.onClick - Click handler
 * @param {'blue'|'purple'|'green'|'orange'|'gold'} props.accentColor - Neon accent color
 * @param {'normal'|'compact'} props.size - Tile size variant
 */
const OptionTile = ({
    icon,
    title,
    description,
    selected = false,
    onClick,
    accentColor = 'gold',
    size = 'normal',
    disabled = false
}) => {
    const accentColors = {
        blue: {
            selectedBg: 'from-blue-500/20 to-blue-600/10',
            selectedBorder: 'border-blue-400',
            selectedGlow: 'shadow-blue-400/30',
            iconBg: 'bg-blue-500/20'
        },
        purple: {
            selectedBg: 'from-purple-500/20 to-purple-600/10',
            selectedBorder: 'border-purple-400',
            selectedGlow: 'shadow-purple-400/30',
            iconBg: 'bg-purple-500/20'
        },
        green: {
            selectedBg: 'from-emerald-500/20 to-emerald-600/10',
            selectedBorder: 'border-emerald-400',
            selectedGlow: 'shadow-emerald-400/30',
            iconBg: 'bg-emerald-500/20'
        },
        orange: {
            selectedBg: 'from-orange-500/20 to-orange-600/10',
            selectedBorder: 'border-orange-400',
            selectedGlow: 'shadow-orange-400/30',
            iconBg: 'bg-orange-500/20'
        },
        gold: {
            selectedBg: 'from-amber-500/20 to-amber-600/10',
            selectedBorder: 'border-amber-400',
            selectedGlow: 'shadow-amber-400/30',
            iconBg: 'bg-amber-500/20'
        }
    };

    const colors = accentColors[accentColor] || accentColors.gold;
    const isCompact = size === 'compact';

    return (
        <motion.button
            type="button"
            onClick={disabled ? undefined : onClick}
            whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className={`
                relative overflow-hidden text-left w-full
                rounded-xl border-2 backdrop-blur-sm
                transition-all duration-300
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isCompact ? 'p-3' : 'p-4'}
                ${selected
                    ? `bg-gradient-to-br ${colors.selectedBg} ${colors.selectedBorder} shadow-lg ${colors.selectedGlow}`
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                }
            `}
            aria-pressed={selected}
        >
            <div className={`flex items-center gap-3 ${isCompact ? '' : 'gap-4'}`}>
                {/* Icon */}
                {icon && (
                    <div
                        className={`
                            flex-shrink-0 flex items-center justify-center rounded-lg
                            ${isCompact ? 'w-10 h-10 text-xl' : 'w-12 h-12 text-2xl'}
                            ${selected ? colors.iconBg : 'bg-white/10'}
                            transition-colors duration-300
                        `}
                    >
                        {icon}
                    </div>
                )}

                {/* Text content */}
                <div className="flex-1 min-w-0">
                    <h3
                        className={`
                            font-semibold text-white oswald
                            ${isCompact ? 'text-sm' : 'text-base'}
                        `}
                    >
                        {title}
                    </h3>
                    {description && !isCompact && (
                        <p className="text-white/60 text-sm mt-0.5 line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>

                {/* Selection checkmark */}
                {selected && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`
                            flex-shrink-0 flex items-center justify-center
                            rounded-full bg-gradient-to-br from-amber-500 to-orange-500
                            ${isCompact ? 'w-5 h-5' : 'w-6 h-6'}
                        `}
                    >
                        <svg
                            className={isCompact ? 'w-3 h-3' : 'w-4 h-4'}
                            fill="none"
                            stroke="white"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </motion.div>
                )}
            </div>
        </motion.button>
    );
};

export default OptionTile;
