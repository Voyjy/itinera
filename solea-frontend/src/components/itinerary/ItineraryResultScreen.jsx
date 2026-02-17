import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import GlassPanel from './ui/GlassPanel';
import PillButton from './ui/PillButton';
import InfoChip from './ui/InfoChip';
import DayCard from './ui/DayCard';
import StayCard from './ui/StayCard';
import TransportCard from './ui/TransportCard';
import FlightsSection from './FlightsSection';
import HotelsSection from './HotelsSection';
import HotelsCompareLinks from './HotelsCompareLinks';
import ItineraMap from '../map/ItineraMap';
import { generateDemoItinerary } from '../../data/demoItinerary';
import { useBookingOptions } from '../../features/booking/useBookingOptions';
import { BASE_URL } from '../../config';
import '../../styles/print.css';

/**
 * ItineraryResultScreen - Main itinerary result display
 */
const ItineraryResultScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [itinerary, setItinerary] = useState(location.state?.itinerary || null);
    const profile = location.state?.profile || {};
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [selectedDay, setSelectedDay] = useState(0);
    const [savedTripId, setSavedTripId] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [copyFeedback, setCopyFeedback] = useState('');

    // Booking options hook
    const {
        flights,
        flightLinks,
        hotels,
        hotelLinks,
        origin,
        updateOrigin,
        isLoading: isBookingLoading,
        isHotelsLoading
    } = useBookingOptions(itinerary, profile);

    // If no itinerary, redirect to home
    if (!itinerary) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <GlassPanel className="text-center p-8 max-w-md">
                    <p className="text-white/60 mb-4">{t('itinerary.result.noItinerary')}</p>
                    <PillButton variant="primary" onClick={() => navigate('/')}>
                        {t('itinerary.result.backToHome')}
                    </PillButton>
                </GlassPanel>
            </div>
        );
    }

    const handleRegenerate = () => {
        setIsRegenerating(true);
        setTimeout(() => {
            const newItinerary = generateDemoItinerary(profile);
            setItinerary(newItinerary);
            setIsRegenerating(false);
        }, 1500);
    };

    // Phase 3: Save trip to backend
    const handleSaveTrip = async () => {
        if (savedTripId || isSaving) return;
        setIsSaving(true);
        try {
            const { data } = await axios.post(`${BASE_URL}/api/saved-trips/save`, {
                city: itinerary.destination,
                preferences: profile,
                itinerary,
            }, { timeout: 5000 });
            if (data.success && data.tripId) {
                setSavedTripId(data.tripId);
                setCopyFeedback('✅ Voyage sauvegardé !');
                setTimeout(() => setCopyFeedback(''), 2500);
            }
        } catch (err) {
            console.error('Save trip error:', err.message);
            setCopyFeedback('❌ Erreur de sauvegarde');
            setTimeout(() => setCopyFeedback(''), 2500);
        } finally {
            setIsSaving(false);
        }
    };

    // Phase 3: Copy share link
    const handleCopyShareLink = () => {
        if (!savedTripId) return;
        const shareUrl = `${window.location.origin}/trip/shared/${savedTripId}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => { setCopyFeedback('🔗 Lien copié !'); setTimeout(() => setCopyFeedback(''), 2000); })
            .catch(() => { });
    };

    // Phase 3: Share via native share API or copy link
    const handleShare = async () => {
        // If not saved yet, save first
        if (!savedTripId) await handleSaveTrip();
        if (savedTripId) {
            handleCopyShareLink();
        } else {
            // Fallback: share current text
            const shareText = `${t('itinerary.result.yourTrip')} ${itinerary.destination} - ${itinerary.days?.length || 0} ${t('itinerary.result.days')}!`;
            if (navigator.share) {
                try { await navigator.share({ title: `Voyage ${itinerary.destination}`, text: shareText, url: window.location.href }); } catch (_) { }
            } else {
                navigator.clipboard.writeText(shareText).catch(() => { });
                setCopyFeedback('📋 Copié !'); setTimeout(() => setCopyFeedback(''), 2000);
            }
        }
    };

    // Phase 3: JSON export download
    const handleExportJSON = () => {
        try {
            const json = JSON.stringify(itinerary, null, 2);
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `itinerary-${(itinerary.destination || 'voyage').toLowerCase().replace(/\s+/g, '-')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('JSON export error:', err.message);
        }
    };

    // Phase 3: PDF export via window.print
    const handleExportPDF = () => {
        window.print();
    };

    // Legacy export (text to clipboard)
    const handleExport = () => {
        let exportText = `=== ${(itinerary.destination || 'VOYAGE').toUpperCase()} ===\n\n`;
        exportText += `Type: ${itinerary.tripType || ''}\n`;
        exportText += `${t('itinerary.result.travelers')}: ${itinerary.travelers || ''}\n`;
        exportText += `Dates: ${itinerary.startDate || 'N/A'}\n\n`;
        (itinerary.days || []).forEach(day => {
            exportText += `--- ${day.dayName} (${day.date || ''}) ---\n`;
            (day.activities || []).forEach(act => {
                exportText += `${act.time || ''} - ${act.title || act.name || ''}\n`;
                exportText += `  ${act.address || ''}\n\n`;
            });
        });
        navigator.clipboard.writeText(exportText).catch(() => { });
        setCopyFeedback('📋 Copié !'); setTimeout(() => setCopyFeedback(''), 2000);
    };

    // Phase 3: Build map places from current day
    const mapPlaces = useMemo(() => {
        if (!itinerary?.days) return [];
        const day = itinerary.days[selectedDay];
        if (!day?.activities) return [];
        return day.activities.filter(a => a.lat && a.lng).map(a => ({
            id: a.id, name: a.title || a.name, lat: a.lat, lng: a.lng,
            slot: a.slot || 'default', address: a.address,
        }));
    }, [itinerary, selectedDay]);

    const handleBack = () => {
        navigate('/');
    };

    // Get budget label
    const getBudgetLabel = () => {
        if (itinerary.budget === 'luxury') return t('itinerary.result.luxury');
        if (itinerary.budget === 'budget') return t('itinerary.result.budget');
        return t('itinerary.result.moderate');
    };

    // Get pace label
    const getPaceLabel = () => {
        if (itinerary.pace === 'active') return t('itinerary.result.active');
        if (itinerary.pace === 'relaxed') return t('itinerary.result.relaxed');
        return t('itinerary.result.moderate');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
            {/* Background decorative elements */}
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl" />

            {/* Content */}
            <div className="relative z-10 px-4 py-8 md:py-12">
                <div className="max-w-7xl mx-auto">

                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6"
                    >
                        <PillButton variant="ghost" onClick={handleBack} icon="←">
                            {t('itinerary.result.back')}
                        </PillButton>
                    </motion.div>

                    {/* Hero Header Card */}
                    <GlassPanel className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Left side */}
                            <div>
                                {/* Trip Type Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium mb-3"
                                >
                                    {itinerary.tripType}
                                </motion.div>

                                {/* Title */}
                                <h1 className="text-2xl md:text-4xl font-bold text-white oswald mb-3">
                                    {t('itinerary.result.yourTrip')} {itinerary.destination}
                                    {itinerary.country && <span className="text-white/60">, {itinerary.country}</span>}
                                </h1>

                                {/* Info row */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <InfoChip icon="📍" text={itinerary.destination} variant="default" />
                                    <InfoChip icon="📅" text={`${itinerary.days.length} ${t('itinerary.result.days')}`} variant="default" />
                                    <InfoChip icon="👥" text={`${itinerary.travelers} ${itinerary.travelers > 1 ? t('itinerary.result.travelers') : t('itinerary.result.traveler')}`} variant="default" />
                                </div>
                            </div>

                            {/* Right side - Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                                <InfoChip
                                    icon="💰"
                                    text={getBudgetLabel()}
                                    variant="success"
                                />
                                <InfoChip
                                    icon="⚡"
                                    text={getPaceLabel()}
                                    variant="info"
                                />

                                <div className="hidden sm:flex items-center gap-2 ml-2 no-print">
                                    <PillButton variant="default" size="sm" onClick={handleRegenerate} disabled={isRegenerating} icon={isRegenerating ? "⏳" : "🔄"}>
                                        {isRegenerating ? t('itinerary.result.regenerating') : t('itinerary.result.regenerate')}
                                    </PillButton>
                                    <PillButton variant="default" size="sm" onClick={handleSaveTrip} disabled={isSaving || !!savedTripId} icon={savedTripId ? '✅' : '💾'}>
                                        {savedTripId ? 'Sauvegardé' : isSaving ? '...' : 'Sauvegarder'}
                                    </PillButton>
                                    <PillButton variant="default" size="sm" onClick={handleShare} icon="📤">
                                        {t('itinerary.result.share')}
                                    </PillButton>
                                    <PillButton variant="default" size="sm" onClick={handleExportJSON} icon="📥">
                                        JSON
                                    </PillButton>
                                    <PillButton variant="default" size="sm" onClick={handleExportPDF} icon="🖨️">
                                        PDF
                                    </PillButton>
                                    <PillButton variant="default" size="sm" onClick={() => setShowMap(!showMap)} icon="🗺️">
                                        {showMap ? 'Masquer carte' : 'Carte'}
                                    </PillButton>
                                </div>
                            </div>
                        </div>

                        {/* Copy feedback toast */}
                        <AnimatePresence>
                            {copyFeedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mt-3 text-center text-sm font-medium text-amber-400"
                                >
                                    {copyFeedback}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Share link button (visible after save) */}
                        {savedTripId && (
                            <div className="mt-3 flex items-center gap-2 no-print">
                                <button
                                    onClick={handleCopyShareLink}
                                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-medium transition-colors"
                                >
                                    🔗 Copier le lien de partage
                                </button>
                                <span className="text-slate-500 text-xs truncate max-w-xs">
                                    {window.location.origin}/trip/shared/{savedTripId}
                                </span>
                            </div>
                        )}

                        {/* Mobile action buttons */}
                        <div className="flex sm:hidden items-center gap-2 mt-4 overflow-x-auto pb-2 no-print">
                            <PillButton variant="default" size="sm" onClick={handleRegenerate} disabled={isRegenerating} icon={isRegenerating ? "⏳" : "🔄"}>
                                {t('itinerary.result.regenerate')}
                            </PillButton>
                            <PillButton variant="default" size="sm" onClick={handleSaveTrip} disabled={isSaving || !!savedTripId} icon={savedTripId ? '✅' : '💾'}>
                                {savedTripId ? '✅' : 'Save'}
                            </PillButton>
                            <PillButton variant="default" size="sm" onClick={handleShare} icon="📤">
                                {t('itinerary.result.share')}
                            </PillButton>
                            <PillButton variant="default" size="sm" onClick={handleExportJSON} icon="📥">
                                JSON
                            </PillButton>
                            <PillButton variant="default" size="sm" onClick={() => setShowMap(!showMap)} icon="🗺️">
                                Carte
                            </PillButton>
                        </div>
                    </GlassPanel>

                    {/* Regenerating overlay */}
                    {isRegenerating && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
                        >
                            <GlassPanel className="text-center p-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    className="w-12 h-12 mx-auto mb-4 rounded-full border-4 border-white/10 border-t-amber-500"
                                />
                                <p className="text-white oswald">{t('itinerary.result.regeneratingText')}</p>
                            </GlassPanel>
                        </motion.div>
                    )}

                    {/* Phase 3: Map View */}
                    <AnimatePresence>
                        {showMap && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 no-print"
                            >
                                {/* Day selector tabs for map */}
                                {itinerary.days && itinerary.days.length > 1 && (
                                    <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                                        {itinerary.days.map((day, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedDay(i)}
                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedDay === i
                                                        ? 'bg-amber-500 text-white'
                                                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                                                    }`}
                                            >
                                                Jour {day.dayNumber || i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="rounded-xl overflow-hidden shadow-xl border border-slate-700">
                                    <ItineraMap places={mapPlaces} height="380px" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Phase 3: Budget Estimate Banner */}
                    {itinerary.budgetEstimate && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-xl budget-estimate"
                        >
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">💰</span>
                                    <div>
                                        <h4 className="text-white font-semibold text-sm">Budget estimé</h4>
                                        <p className="text-emerald-400 font-bold text-lg">
                                            ~€{itinerary.budgetEstimate.perDay}/jour · €{itinerary.budgetEstimate.total} total
                                        </p>
                                    </div>
                                </div>
                                {itinerary.budgetEstimate.breakdown && (
                                    <div className="flex gap-4 text-xs text-slate-400">
                                        <span>🎭 Activités: €{itinerary.budgetEstimate.breakdown.attractions}</span>
                                        <span>🚌 Transport: €{itinerary.budgetEstimate.breakdown.transport}</span>
                                        <span>🍽️ Repas: €{itinerary.budgetEstimate.breakdown.meals}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Itinerary Days */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Section Header */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 mb-2"
                            >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                                    <span className="text-white text-lg">✨</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white oswald">
                                        {t('itinerary.result.title')}
                                    </h2>
                                    <p className="text-white/50 text-sm">
                                        {(itinerary.days || []).reduce((acc, day) => acc + (day.activities?.length || 0), 0)} {t('itinerary.result.activitiesOn')} {(itinerary.days || []).length} {t('itinerary.result.days')}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Day Cards */}
                            <div className="space-y-3">
                                {(itinerary.days || []).map((day, index) => (
                                    <DayCard
                                        key={day.dayNumber || index}
                                        dayNumber={day.dayNumber}
                                        dayName={day.dayName}
                                        date={day.date}
                                        weather={day.weather}
                                        activities={day.activities || []}
                                        defaultExpanded={index === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Flights, Stays & Transport */}
                        <div className="space-y-6">
                            {/* Flights Section */}
                            <FlightsSection
                                flights={flights}
                                flightLinks={flightLinks}
                                origin={origin}
                                destination={itinerary.destination}
                                onOriginChange={updateOrigin}
                                isLoading={isBookingLoading}
                            />

                            {/* Hotels Section - Real data from SerpAPI */}
                            <HotelsSection
                                hotels={hotels}
                                hotelLinks={hotelLinks}
                                destination={itinerary.destination}
                                isLoading={isHotelsLoading}
                                maxItems={6}
                            />

                            {/* Recommended Stays */}
                            <GlassPanel>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">🏨</span>
                                    <h3 className="text-lg font-bold text-white oswald">
                                        {t('itinerary.result.hotels')}
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {itinerary.stays.map((stay, index) => (
                                        <StayCard key={stay.id} stay={stay} index={index} />
                                    ))}
                                </div>

                                {/* Hotel Compare Links */}
                                <HotelsCompareLinks
                                    hotelLinks={hotelLinks}
                                    destination={itinerary.destination}
                                />
                            </GlassPanel>

                            {/* Transport Options */}
                            <GlassPanel>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">🚌</span>
                                    <h3 className="text-lg font-bold text-white oswald">
                                        {t('itinerary.result.transports')}
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {itinerary.transport.map((transport, index) => (
                                        <TransportCard key={transport.id} transport={transport} index={index} />
                                    ))}
                                </div>
                            </GlassPanel>

                            {/* Quick Tips */}
                            <GlassPanel variant="accent">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">💡</span>
                                    <div>
                                        <h4 className="text-white font-semibold oswald mb-1">{t('itinerary.result.tipTitle')}</h4>
                                        <p className="text-white/60 text-sm">
                                            {t('itinerary.result.tipContent')}
                                        </p>
                                    </div>
                                </div>
                            </GlassPanel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItineraryResultScreen;
