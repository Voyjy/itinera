import React from 'react';

const PersonalizationButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 oswald font-medium text-base"
        >
            ✨ Personnaliser mon voyage
        </button>
    );
};

export default PersonalizationButton;
