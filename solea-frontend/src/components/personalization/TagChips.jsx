import React from 'react';
import { usePersonalization } from './usePersonalization';

const TagChips = ({ tags }) => {
    const { getTagLabel } = usePersonalization();

    if (!tags || tags.length === 0) return null;

    return (
        <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium backdrop-blur-sm border border-white/30"
                >
                    {getTagLabel(tag)}
                </span>
            ))}
        </div>
    );
};

export default TagChips;
