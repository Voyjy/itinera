import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TripIdeaPreviewCard from '../components/edit/TripIdeaPreviewCard';
import TagMultiSelect from '../components/edit/TagMultiSelect';
import { loadSelectedTripIdea, saveTripRequest } from '../utils/storageKeys';

/**
 * EditRecommendation - Customize trip details before generating itinerary
 */
const EditRecommendation = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [tripIdea, setTripIdea] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Form state
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [travelers, setTravelers] = useState(2);
    const [budget, setBudget] = useState('moderate');
    const [pace, setPace] = useState('moderate');
    const [selectedTags, setSelectedTags] = useState([]);

    // Load selected trip idea on mount
    useEffect(() => {
        const idea = loadSelectedTripIdea();
        if (idea) {
            setTripIdea(idea);
            // Pre-select tags from the card
            setSelectedTags(idea.tags || []);
        }
        setIsLoading(false);
    }, []);

    // Set default dates (today + 7 days)
    useEffect(() => {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        setStartDate(today.toISOString().split('T')[0]);
        setEndDate(nextWeek.toISOString().split('T')[0]);
    }, []);

    const handleBack = () => {
        navigate('/');
    };

    const handleGenerate = () => {
        // Merge data and save
        const tripRequest = {
            destination: tripIdea?.city || 'Paris',
            country: tripIdea?.country || 'France',
            image: tripIdea?.image,
            tags: [...new Set(selectedTags)], // dedupe
            activities: tripIdea?.activities || [],
            startDate,
            endDate,
            travelers,
            budget,
            pace
        };

        saveTripRequest(tripRequest);

        // Navigate to loading screen
        navigate('/itinerary/loading', {
            state: {
                profile: {
                    destination: tripRequest.destination,
                    country: tripRequest.country,
                    ...tripRequest
                }
            }
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <p className="text-white/60">{t('edit.loading')}</p>
            </div>
        );
    }

    // No trip idea selected
    if (!tripIdea) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
                <div className="text-center">
                    <p className="text-white/60 mb-4">{t('edit.noSelection')}</p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-2 bg-amber-500 text-black rounded-lg font-medium"
                    >
                        {t('edit.backToHome')}
                    </button>
                </div>
            </div>
        );
    }

    const budgetOptions = [
        { id: 'budget', label: t('edit.budgetOptions.budget'), icon: '💰' },
        { id: 'moderate', label: t('edit.budgetOptions.moderate'), icon: '💎' },
        { id: 'luxury', label: t('edit.budgetOptions.luxury'), icon: '👑' }
    ];

    const paceOptions = [
        { id: 'relaxed', label: t('edit.paceOptions.relaxed'), icon: '🧘' },
        { id: 'moderate', label: t('edit.paceOptions.moderate'), icon: '⚖️' },
        { id: 'active', label: t('edit.paceOptions.active'), icon: '🏃' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 min-h-screen px-4 py-8 md:py-12">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl font-bold text-white oswald"
                        >
                            {t('edit.title')}
                        </motion.h1>
                        <p className="text-white/60 mt-2">
                            {t('edit.subtitle')}
                        </p>
                    </div>

                    {/* Trip Preview Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-8"
                    >
                        <TripIdeaPreviewCard tripIdea={tripIdea} />
                    </motion.div>

                    {/* Form Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-6"
                    >
                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2 oswald">
                                    {t('edit.departureDate')}
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-white/80 text-sm font-medium mb-2 oswald">
                                    {t('edit.returnDate')}
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:border-amber-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Travelers */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-2 oswald">
                                {t('edit.travelers')}
                            </label>
                            <div className="flex items-center gap-4">
                                <motion.button
                                    type="button"
                                    onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white text-xl flex items-center justify-center hover:bg-white/20"
                                >
                                    −
                                </motion.button>
                                <span className="text-white text-2xl font-bold w-12 text-center">{travelers}</span>
                                <motion.button
                                    type="button"
                                    onClick={() => setTravelers(Math.min(10, travelers + 1))}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white text-xl flex items-center justify-center hover:bg-white/20"
                                >
                                    +
                                </motion.button>
                            </div>
                        </div>

                        {/* Budget */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-3 oswald">
                                {t('edit.budget')}
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {budgetOptions.map((option) => (
                                    <motion.button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setBudget(option.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                      p-4 rounded-xl border text-center transition-all
                      ${budget === option.id
                                                ? 'bg-amber-500/20 border-amber-500 text-white'
                                                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                                            }
                    `}
                                    >
                                        <span className="text-2xl block mb-1">{option.icon}</span>
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Pace */}
                        <div>
                            <label className="block text-white/80 text-sm font-medium mb-3 oswald">
                                {t('edit.pace')}
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {paceOptions.map((option) => (
                                    <motion.button
                                        key={option.id}
                                        type="button"
                                        onClick={() => setPace(option.id)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                      p-4 rounded-xl border text-center transition-all
                      ${pace === option.id
                                                ? 'bg-amber-500/20 border-amber-500 text-white'
                                                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                                            }
                    `}
                                    >
                                        <span className="text-2xl block mb-1">{option.icon}</span>
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <TagMultiSelect
                            selectedTags={selectedTags}
                            onChange={setSelectedTags}
                        />
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex gap-4 mt-8"
                    >
                        <button
                            onClick={handleBack}
                            className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white rounded-xl font-medium hover:bg-white/20 transition-colors oswald"
                        >
                            {t('edit.back')}
                        </button>
                        <motion.button
                            onClick={handleGenerate}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-[2] px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl font-bold oswald shadow-lg"
                        >
                            {t('edit.generate')}
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default EditRecommendation;
