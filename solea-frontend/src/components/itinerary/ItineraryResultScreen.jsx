import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassPanel from './ui/GlassPanel';
import PillButton from './ui/PillButton';
import InfoChip from './ui/InfoChip';
import DayCard from './ui/DayCard';
import StayCard from './ui/StayCard';
import TransportCard from './ui/TransportCard';
import { generateDemoItinerary } from '../../data/demoItinerary';

/**
 * ItineraryResultScreen - Main itinerary result display
 */
const ItineraryResultScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [itinerary, setItinerary] = useState(location.state?.itinerary || null);
    const profile = location.state?.profile || {};
    const [isRegenerating, setIsRegenerating] = useState(false);

    // If no itinerary, redirect to home
    if (!itinerary) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <GlassPanel className="text-center p-8 max-w-md">
                    <p className="text-white/60 mb-4">Aucun itinéraire trouvé</p>
                    <PillButton variant="primary" onClick={() => navigate('/')}>
                        Retour à l'accueil
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

    const handleShare = async () => {
        const shareText = `Mon voyage à ${itinerary.destination} - ${itinerary.days.length} jours d'aventure!`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Voyage à ${itinerary.destination}`,
                    text: shareText,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(shareText);
            alert('Lien copié dans le presse-papier!');
        }
    };

    const handleExport = () => {
        // Generate text export
        let exportText = `=== ITINÉRAIRE ${itinerary.destination.toUpperCase()} ===\n\n`;
        exportText += `Type: ${itinerary.tripType}\n`;
        exportText += `Voyageurs: ${itinerary.travelers}\n`;
        exportText += `Dates: ${itinerary.startDate || 'Non défini'}\n\n`;

        itinerary.days.forEach(day => {
            exportText += `--- ${day.dayName} (${day.date}) ---\n`;
            day.activities.forEach(act => {
                exportText += `${act.time} - ${act.title}\n`;
                exportText += `  ${act.address}\n\n`;
            });
        });

        exportText += `\n=== HÉBERGEMENTS ===\n`;
        itinerary.stays.forEach(stay => {
            exportText += `• ${stay.name} - ${stay.priceText}\n`;
        });

        // Copy to clipboard
        navigator.clipboard.writeText(exportText);
        alert('Itinéraire exporté et copié dans le presse-papier!');
    };

    const handleBack = () => {
        navigate('/');
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
                            Retour
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
                                    Votre voyage à {itinerary.destination}
                                    {itinerary.country && <span className="text-white/60">, {itinerary.country}</span>}
                                </h1>

                                {/* Info row */}
                                <div className="flex flex-wrap items-center gap-3">
                                    <InfoChip icon="📍" text={itinerary.destination} variant="default" />
                                    <InfoChip icon="📅" text={`${itinerary.days.length} jours`} variant="default" />
                                    <InfoChip icon="👥" text={`${itinerary.travelers} voyageur${itinerary.travelers > 1 ? 's' : ''}`} variant="default" />
                                </div>
                            </div>

                            {/* Right side - Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                                <InfoChip
                                    icon="💰"
                                    text={itinerary.budget === 'luxury' ? 'Luxe' : itinerary.budget === 'budget' ? 'Budget' : 'Modéré'}
                                    variant="success"
                                />
                                <InfoChip
                                    icon="⚡"
                                    text={itinerary.pace === 'active' ? 'Actif' : itinerary.pace === 'relaxed' ? 'Relax' : 'Modéré'}
                                    variant="info"
                                />

                                <div className="hidden sm:flex items-center gap-2 ml-2">
                                    <PillButton
                                        variant="default"
                                        size="sm"
                                        onClick={handleRegenerate}
                                        disabled={isRegenerating}
                                        icon={isRegenerating ? "⏳" : "🔄"}
                                    >
                                        {isRegenerating ? 'Génération...' : 'Régénérer'}
                                    </PillButton>
                                    <PillButton variant="default" size="sm" onClick={handleShare} icon="📤">
                                        Partager
                                    </PillButton>
                                    <PillButton variant="default" size="sm" onClick={handleExport} icon="📋">
                                        Exporter
                                    </PillButton>
                                </div>
                            </div>
                        </div>

                        {/* Mobile action buttons */}
                        <div className="flex sm:hidden items-center gap-2 mt-4 overflow-x-auto pb-2">
                            <PillButton
                                variant="default"
                                size="sm"
                                onClick={handleRegenerate}
                                disabled={isRegenerating}
                                icon={isRegenerating ? "⏳" : "🔄"}
                            >
                                Régénérer
                            </PillButton>
                            <PillButton variant="default" size="sm" onClick={handleShare} icon="📤">
                                Partager
                            </PillButton>
                            <PillButton variant="default" size="sm" onClick={handleExport} icon="📋">
                                Exporter
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
                                <p className="text-white oswald">Régénération en cours...</p>
                            </GlassPanel>
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
                                        Votre itinéraire est prêt !
                                    </h2>
                                    <p className="text-white/50 text-sm">
                                        {itinerary.days.reduce((acc, day) => acc + day.activities.length, 0)} activités sur {itinerary.days.length} jours
                                    </p>
                                </div>
                            </motion.div>

                            {/* Day Cards */}
                            <div className="space-y-3">
                                {itinerary.days.map((day, index) => (
                                    <DayCard
                                        key={day.dayNumber}
                                        dayNumber={day.dayNumber}
                                        dayName={day.dayName}
                                        date={day.date}
                                        weather={day.weather}
                                        activities={day.activities}
                                        defaultExpanded={index === 0}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right Column - Stays & Transport */}
                        <div className="space-y-6">
                            {/* Recommended Stays */}
                            <GlassPanel>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">🏨</span>
                                    <h3 className="text-lg font-bold text-white oswald">
                                        Hébergements recommandés
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {itinerary.stays.map((stay, index) => (
                                        <StayCard key={stay.id} stay={stay} index={index} />
                                    ))}
                                </div>
                            </GlassPanel>

                            {/* Transport Options */}
                            <GlassPanel>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">🚌</span>
                                    <h3 className="text-lg font-bold text-white oswald">
                                        Options de transport
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
                                        <h4 className="text-white font-semibold oswald mb-1">Conseil du jour</h4>
                                        <p className="text-white/60 text-sm">
                                            Achetez le Paris Museum Pass pour un accès illimité aux musées et éviter les files d'attente!
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
