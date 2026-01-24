import React from 'react';

/**
 * InfoChip - Small chip with icon and text for displaying info
 */
const InfoChip = ({
    icon,
    text,
    variant = 'default',
    size = 'md',
    className = ''
}) => {
    const variants = {
        default: 'bg-white/10 text-white/80 border-white/10',
        accent: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        warning: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs gap-1',
        md: 'px-3 py-1 text-sm gap-1.5',
        lg: 'px-4 py-1.5 text-base gap-2'
    };

    return (
        <span
            className={`
                inline-flex items-center rounded-full border
                font-medium oswald
                ${variants[variant] || variants.default}
                ${sizes[size] || sizes.md}
                ${className}
            `}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{text}</span>
        </span>
    );
};

export default InfoChip;
