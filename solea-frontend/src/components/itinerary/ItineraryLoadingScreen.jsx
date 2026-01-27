import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import GlassPanel from './ui/GlassPanel';
import { generateDemoItinerary } from '../../data/demoItinerary';
import { loadTripRequest } from '../../utils/storageKeys';

/**
 * ItineraryLoadingScreen - Shows while generating itinerary
 */
const ItineraryLoadingScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    // Try to get profile from location state, fallback to localStorage
    const stateProfile = location.state?.profile || {};
    const storedRequest = loadTripRequest();
    const profile = Object.keys(stateProfile).length > 0 ? stateProfile : storedRequest || {};

    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');

    // Get translated status messages
    const getStatusMessages = () => [
        t('itinerary.loading.status1'),
        t('itinerary.loading.status2'),
        t('itinerary.loading.status3'),
        t('itinerary.loading.status4'),
        t('itinerary.loading.status5')
    ];

    useEffect(() => {
        const statusMessages = getStatusMessages();
        // Set initial status
        setStatusText(statusMessages[0]);

        // Simulate loading progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 2;
            });
        }, 40);

        // Update status messages
        let statusIndex = 0;
        const statusInterval = setInterval(() => {
            statusIndex = (statusIndex + 1) % statusMessages.length;
            setStatusText(statusMessages[statusIndex]);
        }, 500);

        // Navigate to result after delay
        const timeout = setTimeout(() => {
            const itinerary = generateDemoItinerary(profile);
            navigate('/itinerary/result', {
                state: { itinerary, profile },
                replace: true
            });
        }, 2500);

        return () => {
            clearInterval(progressInterval);
            clearInterval(statusInterval);
            clearTimeout(timeout);
        };
    }, [navigate, profile, t]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-4xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Main Loading Card */}
                        <GlassPanel className="text-center p-8 lg:p-12">
                            {/* Spinner */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-white/10 border-t-amber-500"
                            />

                            {/* Title */}
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 oswald">
                                {t('itinerary.loading.title')}
                            </h2>

                            {/* Status text with animation */}
                            <motion.p
                                key={statusText}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-white/60 mb-6"
                            >
                                {statusText}
                            </motion.p>

                            {/* Progress bar */}
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                />
                            </div>
                            <p className="text-white/40 text-sm mt-2">{progress}%</p>
                        </GlassPanel>

                        {/* Placeholder Card */}
                        <GlassPanel className="hidden lg:flex flex-col items-center justify-center p-8 opacity-60">
                            <div className="w-16 h-16 mb-4 rounded-xl bg-white/10 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <p className="text-white/40 text-center oswald">
                                {t('itinerary.loading.placeholder')}
                            </p>
                        </GlassPanel>
                    </div>

                    {/* Destination preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-white/40 text-sm">
                            {t('itinerary.loading.destination')} : <span className="text-amber-400 font-medium">{profile?.destination || 'Paris'}</span>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryLoadingScreen;
