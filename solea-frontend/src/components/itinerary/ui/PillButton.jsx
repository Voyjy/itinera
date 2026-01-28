import React from 'react';
import { motion } from 'framer-motion';

/**
 * PillButton - Small pill-shaped button for actions
 */
const PillButton = ({
    children,
    onClick,
    icon,
    variant = 'default',
    size = 'md',
    disabled = false,
    className = ''
}) => {
    const variants = {
        default: 'bg-white/10 text-white hover:bg-white/20 border-white/20',
        primary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-400 hover:to-orange-400 border-transparent shadow-lg shadow-orange-500/20',
        success: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30',
        ghost: 'bg-transparent text-white/70 hover:text-white hover:bg-white/10 border-transparent'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-1',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-2.5 text-base gap-2'
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className={`
                inline-flex items-center justify-center
                rounded-full border font-medium
                transition-all duration-300 oswald
                ${variants[variant] || variants.default}
                ${sizes[size] || sizes.md}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${className}
            `}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
        </motion.button>
    );
};

export default PillButton;
