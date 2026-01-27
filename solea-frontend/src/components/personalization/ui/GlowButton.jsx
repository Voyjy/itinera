import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlowButton - Primary CTA button with gold/orange gradient and shimmer effect
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether button is disabled
 * @param {'primary'|'secondary'|'ghost'} props.variant - Button style variant
 * @param {string} props.className - Additional CSS classes
 */
const GlowButton = ({
    children,
    onClick,
    disabled = false,
    variant = 'primary',
    className = '',
    type = 'button'
}) => {
    const variants = {
        primary: {
            base: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white',
            hover: 'hover:from-amber-400 hover:via-orange-400 hover:to-amber-500',
            shadow: 'shadow-lg shadow-orange-500/30',
            disabled: 'from-gray-600 via-gray-500 to-gray-600 text-gray-300'
        },
        secondary: {
            base: 'bg-white/10 text-white border-2 border-white/30',
            hover: 'hover:bg-white/20 hover:border-white/50',
            shadow: '',
            disabled: 'bg-white/5 text-white/30 border-white/10'
        },
        ghost: {
            base: 'bg-transparent text-white/70 border-2 border-transparent',
            hover: 'hover:text-white hover:bg-white/10',
            shadow: '',
            disabled: 'text-white/30'
        }
    };

    const style = variants[variant] || variants.primary;

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className={`
                relative overflow-hidden
                px-8 py-3 rounded-xl
                font-semibold text-base
                transition-all duration-300
                oswald
                ${disabled
                    ? `${style.disabled} cursor-not-allowed`
                    : `${style.base} ${style.hover} ${style.shadow} cursor-pointer`
                }
                ${className}
            `}
        >
            {/* Shimmer effect overlay for primary variant */}
            {variant === 'primary' && !disabled && (
                <div
                    className="absolute inset-0 -translate-x-full animate-shimmer"
                    style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shimmer 2s infinite'
                    }}
                />
            )}

            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>

            {/* CSS for shimmer animation */}
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </motion.button>
    );
};

export default GlowButton;
