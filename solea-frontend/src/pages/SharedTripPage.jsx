/**
 * SharedTripPage — read-only trip viewer for shared links
 *
 * Route: /trip/shared/:tripId
 * Fetches saved trip from backend and displays itinerary + map.
 * No editing allowed.
 */
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BASE_URL } from '../config';
import ItineraMap from '../components/map/ItineraMap';

const SharedTripPage = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchTrip = async () => {
            try {
                const { data } = await axios.get(`${BASE_URL}/api/saved-trips/${tripId}`, { timeout: 8000 });
                if (data.success && data.trip) {
                    setTrip(data.trip);
                } else {
                    setError('Voyage introuvable');
                }
            } catch (err) {
                console.error('Failed to fetch shared trip:', err.message);
                setError('Impossible de charger ce voyage');
            } finally {
                setLoading(false);
            }
        };

        if (tripId) fetchTrip();
    }, [tripId]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); })
            .catch(() => { });
    };

    // Extract map places from itinerary
    const getMapPlaces = () => {
        if (!trip?.itinerary) return [];
        const itinerary = trip.itinerary;

        // Try Phase 2 format (dayPlans)
        if (itinerary.dayPlans) {
            const places = [];
            for (const day of itinerary.dayPlans) {
                for (const slot of ['morning', 'afternoon', 'evening']) {
                    for (const a of (day[slot] || [])) {
                        if (a.lat && a.lng) {
                            places.push({ id: a.id, name: a.name, lat: a.lat, lng: a.lng, slot, address: a.address });
                        }
                    }
                }
            }
            return places;
        }

        // Try flat days format
        if (itinerary.days) {
            return itinerary.days.flatMap(d =>
                (d.activities || []).filter(a => a.lat && a.lng).map(a => ({
                    id: a.id, name: a.title || a.name, lat: a.lat, lng: a.lng, slot: a.slot || 'default',
                }))
            );
        }

        return [];
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error || !trip) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="text-6xl mb-4">😕</div>
                    <h2 className="text-2xl font-bold mb-2">{error || 'Voyage introuvable'}</h2>
                    <p className="text-slate-400 mb-6">Ce lien de partage n'est plus valide ou le voyage a été supprimé.</p>
                    <Link to="/" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 rounded-xl font-semibold transition-colors">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
        );
    }

    const itinerary = trip.itinerary;
    const dayPlans = itinerary.dayPlans || [];
    const mapPlaces = getMapPlaces();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Header */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <p className="text-amber-400 text-sm font-medium mb-1">🔗 Voyage partagé</p>
                        <h1 className="text-3xl font-bold">{trip.city || itinerary.city || 'Voyage'}</h1>
                        <p className="text-slate-400 mt-1">
                            {itinerary.numDays || dayPlans.length} jours · {itinerary.totalAttractions || '?'} activités
                            {itinerary.budgetEstimate && ` · ~€${itinerary.budgetEstimate.perDay}/jour`}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleCopyLink}
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors no-print"
                        >
                            {copied ? '✅ Copié !' : '🔗 Copier le lien'}
                        </button>
                        <Link to="/" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors no-print">
                            🏠 Accueil
                        </Link>
                    </div>
                </div>

                {/* Map */}
                {mapPlaces.length > 0 && (
                    <div className="mb-8 rounded-xl overflow-hidden shadow-lg no-print">
                        <ItineraMap places={mapPlaces} height="350px" />
                    </div>
                )}

                {/* Budget Estimate */}
                {itinerary.budgetEstimate && (
                    <div className="mb-6 p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                        <h3 className="text-lg font-semibold text-amber-400 mb-2">💰 Budget estimé</h3>
                        <div className="flex gap-6 text-sm">
                            <span>Par jour: <strong>~€{itinerary.budgetEstimate.perDay}</strong></span>
                            <span>Total: <strong>~€{itinerary.budgetEstimate.total}</strong></span>
                        </div>
                    </div>
                )}

                {/* Day Plans */}
                <div className="space-y-6">
                    {dayPlans.map((day, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
                        >
                            <h3 className="text-xl font-bold text-amber-400 mb-4">
                                📅 Jour {day.dayIndex} — {day.dayName || `Jour ${day.dayIndex}`}
                            </h3>

                            {['morning', 'afternoon', 'evening'].map(slot => {
                                const activities = day[slot] || [];
                                if (activities.length === 0) return null;

                                const emoji = slot === 'morning' ? '🌅' : slot === 'afternoon' ? '☀️' : '🌙';
                                const label = slot === 'morning' ? 'Matin' : slot === 'afternoon' ? 'Après-midi' : 'Soirée';

                                return (
                                    <div key={slot} className="mb-4">
                                        <h4 className="text-sm font-semibold text-slate-400 mb-2">{emoji} {label}</h4>
                                        <div className="space-y-2">
                                            {activities.map((a, j) => (
                                                <div key={j} className="flex items-start gap-3 p-3 bg-slate-700/40 rounded-lg">
                                                    <span className="text-lg">{a.icon || '📍'}</span>
                                                    <div>
                                                        <div className="font-medium">{a.name}</div>
                                                        {a.time && <div className="text-xs text-slate-400">{a.time} · {a.duration || '1h30'}</div>}
                                                        {a.description && <div className="text-xs text-slate-500 mt-1">{a.description}</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    ))}
                </div>

                {/* Footer */}
                <div className="text-center text-slate-500 text-sm mt-12 py-6 border-t border-slate-800">
                    Créé avec Itinera · {new Date(trip.createdAt).toLocaleDateString('fr-FR')}
                </div>
            </div>
        </div>
    );
};

export default SharedTripPage;
