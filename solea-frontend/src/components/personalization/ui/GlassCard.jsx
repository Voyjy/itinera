import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlassCard - A glassmorphism card with blur, gradient, and neon accent border
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {boolean} props.selected - Whether the card is selected
 * @param {Function} props.onClick - Click handler
 * @param {'blue'|'purple'|'green'|'orange'|'gold'} props.accentColor - Neon accent color
 * @param {string} props.className - Additional CSS classes
 */
const GlassCard = ({
    children,
    selected = false,
    onClick,
    accentColor = 'blue',
    className = '',
    disabled = false
}) => {
    const accentColors = {
        blue: {
            border: 'border-blue-500/50',
            glow: 'shadow-blue-500/30',
            selectedBorder: 'border-blue-400',
            selectedGlow: 'shadow-blue-400/50'
        },
        purple: {
            border: 'border-purple-500/50',
            glow: 'shadow-purple-500/30',
            selectedBorder: 'border-purple-400',
            selectedGlow: 'shadow-purple-400/50'
        },
        green: {
            border: 'border-emerald-500/50',
            glow: 'shadow-emerald-500/30',
            selectedBorder: 'border-emerald-400',
            selectedGlow: 'shadow-emerald-400/50'
        },
        orange: {
            border: 'border-orange-500/50',
            glow: 'shadow-orange-500/30',
            selectedBorder: 'border-orange-400',
            selectedGlow: 'shadow-orange-400/50'
        },
        gold: {
            border: 'border-amber-500/50',
            glow: 'shadow-amber-500/30',
            selectedBorder: 'border-amber-400',
            selectedGlow: 'shadow-amber-400/50'
        }
    };

    const colors = accentColors[accentColor] || accentColors.blue;

    return (
        <motion.div
            onClick={disabled ? undefined : onClick}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className={`
                relative overflow-hidden rounded-2xl p-4
                bg-white/5 backdrop-blur-md
                border-2 transition-all duration-300
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${selected
                    ? `${colors.selectedBorder} shadow-lg ${colors.selectedGlow} bg-white/10`
                    : `${colors.border} hover:bg-white/10 hover:shadow-md ${colors.glow}`
                }
                ${className}
            `}
            role="button"
            aria-pressed={selected}
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick?.();
                }
            }}
        >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>

            {/* Selection indicator glow effect */}
            {selected && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at center, ${accentColor === 'gold' ? 'rgba(251, 191, 36, 0.1)' :
                                accentColor === 'orange' ? 'rgba(249, 115, 22, 0.1)' :
                                    accentColor === 'green' ? 'rgba(16, 185, 129, 0.1)' :
                                        accentColor === 'purple' ? 'rgba(168, 85, 247, 0.1)' :
                                            'rgba(59, 130, 246, 0.1)'
                            } 0%, transparent 70%)`
                    }}
                />
            )}
        </motion.div>
    );
};

export default GlassCard;
