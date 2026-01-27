import React from 'react';

const PersonalizationButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="px-6 py-3 bg-white/[0.08] backdrop-blur-md border border-white/[0.18] text-white rounded-lg hover:bg-white/[0.12] hover:border-white/30 transition-all duration-300 oswald font-medium text-base shadow-lg"
        >
            ✨ Personnaliser mon voyage
        </button>
    );
};

export default PersonalizationButton;
