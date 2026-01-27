import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlassPanel - Reusable glassmorphism container panel
 */
const GlassPanel = ({
    children,
    className = '',
    variant = 'default',
    animate = true,
    noPadding = false
}) => {
    const variants = {
        default: 'bg-white/5 border-white/10',
        elevated: 'bg-white/10 border-white/20',
        accent: 'bg-amber-500/5 border-amber-500/20'
    };

    const Component = animate ? motion.div : 'div';
    const animationProps = animate ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4 }
    } : {};

    return (
        <Component
            className={`
                backdrop-blur-md rounded-2xl border
                ${variants[variant] || variants.default}
                ${noPadding ? '' : 'p-4 md:p-6'}
                ${className}
            `}
            {...animationProps}
        >
            {children}
        </Component>
    );
};

export default GlassPanel;
