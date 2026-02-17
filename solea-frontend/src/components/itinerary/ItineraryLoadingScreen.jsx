import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import GlassPanel from './ui/GlassPanel';
import { generateDemoItinerary } from '../../data/demoItinerary';
import { loadTripRequest } from '../../utils/storageKeys';
import { BASE_URL } from '../../config';

/**
 * Convert Phase 2 API itinerary (dayPlans[].morning/afternoon/evening)
 * into the existing frontend format (days[].activities[]).
 */
function convertApiItinerary(apiItinerary, profile) {
    const days = (apiItinerary.dayPlans || []).map(dayPlan => {
        // Merge morning + afternoon + evening into a flat activities array
        const activities = [
            ...(dayPlan.morning || []).map(a => ({
                id: a.id,
                time: a.time,
                duration: a.duration || '1h30',
                type: a.type || 'activity',
                title: a.name,
                description: a.description || '',
                address: a.address || '',
                icon: a.icon || '📍',
                slot: 'morning',
            })),
            ...(dayPlan.afternoon || []).map(a => ({
                id: a.id,
                time: a.time,
                duration: a.duration || '1h30',
                type: a.type || 'activity',
                title: a.name,
                description: a.description || '',
                address: a.address || '',
                icon: a.icon || '📍',
                slot: 'afternoon',
            })),
            ...(dayPlan.evening || []).map(a => ({
                id: a.id,
                time: a.time,
                duration: a.duration || '2h',
                type: a.type || 'activity',
                title: a.name,
                description: a.description || '',
                address: a.address || '',
                icon: a.icon || '🌙',
                slot: 'evening',
            })),
        ];

        return {
            dayNumber: dayPlan.dayIndex,
            dayName: dayPlan.dayName || `Jour ${dayPlan.dayIndex}`,
            date: dayPlan.date || '',
            weather: dayPlan.weather || { temp: 15, condition: 'Ensoleillé' },
            activities,
        };
    });

    return {
        id: apiItinerary.id,
        destination: apiItinerary.city,
        country: apiItinerary.country || '',
        tripType: apiItinerary.tripType || profile?.tripType || 'Solo',
        travelers: profile?.travelers || 2,
        startDate: profile?.startDate || '',
        endDate: profile?.endDate || '',
        budget: apiItinerary.budget || profile?.budget || 'moderate',
        pace: apiItinerary.pace || profile?.pace || 'moderate',
        days,
        stays: generateFallbackStays(apiItinerary.city),
        transport: generateFallbackTransport(apiItinerary.city),
        generatedAt: apiItinerary.generatedAt,
    };
}

/** Generate simple stays for the result page */
function generateFallbackStays(city) {
    return [
        {
            id: 'stay-1', name: `Boutique Hotel ${city}`, type: 'Boutique Hotel',
            rating: 4.7, priceRange: '€€€', priceText: '180-250€ / nuit',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
            location: 'Centre-ville', amenities: ['WiFi', 'Petit-déjeuner', 'Climatisation'],
            bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`
        },
        {
            id: 'stay-2', name: `${city} Central Hotel`, type: 'Hotel 3 étoiles',
            rating: 4.5, priceRange: '€€', priceText: '120-180€ / nuit',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop',
            location: 'Vieille ville', amenities: ['WiFi', 'Vue panoramique', 'Bar'],
            bookingUrl: `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(city)}`
        },
    ];
}

/** Generate simple transport options */
function generateFallbackTransport(city) {
    return [
        { id: 'transport-1', name: 'Metro / Tram', type: 'Transport public', icon: '🚇',
          description: `Pass transport ${city}`, priceText: '15-25€ / semaine', bookingUrl: '#' },
        { id: 'transport-2', name: 'Uber / Taxi', type: 'Taxi privé', icon: '🚕',
          description: 'Pour les trajets de nuit ou avec bagages', priceText: 'Variable', bookingUrl: '#' },
    ];
}

/**
 * ItineraryLoadingScreen - Shows while generating itinerary.
 * Tries the real API first, falls back to demo data.
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
        setStatusText(statusMessages[0]);

        // Simulate loading progress
        const progressInterval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) { clearInterval(progressInterval); return 100; }
                return prev + 2;
            });
        }, 40);

        // Update status messages
        let statusIndex = 0;
        const statusInterval = setInterval(() => {
            statusIndex = (statusIndex + 1) % statusMessages.length;
            setStatusText(statusMessages[statusIndex]);
        }, 500);

        // Try API first, fallback to demo data
        const generateItinerary = async () => {
            try {
                const params = new URLSearchParams({
                    city: profile?.destination || 'Paris',
                    tripType: profile?.travelType || profile?.tripType || 'Solo',
                    budget: profile?.budget || profile?.budgetLevel || 'Modéré',
                    pace: profile?.pace || profile?.paceLevel || 'Modéré',
                });
                if (profile?.interests?.length) {
                    params.set('interests', profile.interests.join(','));
                }
                if (profile?.startDate) params.set('startDate', profile.startDate);
                if (profile?.endDate) params.set('endDate', profile.endDate);

                const response = await axios.get(
                    `${BASE_URL}/api/itinerary/generate?${params}`,
                    { timeout: 8000 }
                );

                if (response.data?.success && response.data?.itinerary) {
                    const apiItinerary = response.data.itinerary;
                    // Convert Phase 2 format to existing frontend format
                    const converted = convertApiItinerary(apiItinerary, profile);
                    return converted;
                }
            } catch (err) {
                console.warn('⚠️ API itinerary failed, using demo data:', err.message);
            }
            // Fallback to demo data
            return generateDemoItinerary(profile);
        };

        // Wait at least 2s for the loading animation, then navigate
        const startTime = Date.now();
        generateItinerary().then(itinerary => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 2500 - elapsed);
            setTimeout(() => {
                navigate('/itinerary/result', {
                    state: { itinerary, profile },
                    replace: true
                });
            }, remaining);
        });

        return () => {
            clearInterval(progressInterval);
            clearInterval(statusInterval);
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
