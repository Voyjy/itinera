import React from 'react';

/**
 * TripIdeaPreviewCard - Compact preview of the selected trip idea
 */
const TripIdeaPreviewCard = ({ tripIdea }) => {
    if (!tripIdea) return null;

    return (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={tripIdea.image}
                    alt={`${tripIdea.city}, ${tripIdea.country}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = `https://via.placeholder.com/600x300?text=${tripIdea.city}`;
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* City & Country overlay */}
                <div className="absolute bottom-3 left-4">
                    <h3 className="text-2xl font-bold text-white oswald">{tripIdea.city}</h3>
                    <p className="text-white/70 text-sm">{tripIdea.country}</p>
                </div>
            </div>

            {/* Tags */}
            <div className="p-4">
                <div className="flex flex-wrap gap-2">
                    {tripIdea.tags?.slice(0, 5).map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {tripIdea.why && (
                    <p className="mt-3 text-white/60 text-sm italic">
                        💡 {tripIdea.why}
                    </p>
                )}
            </div>
        </div>
    );
};

export default TripIdeaPreviewCard;
