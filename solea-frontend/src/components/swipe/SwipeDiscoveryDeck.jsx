import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SwipeCard from './SwipeCard';
import BlurredCardBackground from './BlurredCardBackground';
import { DEMO_SWIPE_CARDS } from '../../data/demo/demoSwipeCards';
import {
    loadSwipeSignals,
    recordSwipe,
    prepareDeck
} from './swipeUtils';
import { saveSelectedTripIdea } from '../../utils/storageKeys';

/**
 * SwipeDiscoveryDeck - Tinder-style swipe deck for travel discovery
 * Replaces the Vos recommandations section
 */
const SwipeDiscoveryDeck = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [deck, setDeck] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showLikedOverlay, setShowLikedOverlay] = useState(false);
    const [showPassedOverlay, setShowPassedOverlay] = useState(false);
    const [_exitX, setExitX] = useState(0);

    // Motion values for drag
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-15, 15]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

    // Initialize deck on mount
    useEffect(() => {
        const signals = loadSwipeSignals();
        const sortedDeck = prepareDeck(DEMO_SWIPE_CARDS, signals);
        setDeck(sortedDeck);
    }, []);

    // Get current and next cards
    const currentCard = deck[currentIndex];
    const nextCard = deck[currentIndex + 1];

    // Handle swipe completion
    const handleSwipe = useCallback((direction, card) => {
        // Record the swipe
        recordSwipe(card, direction);

        if (direction === 'right') {
            // Show liked overlay
            setShowLikedOverlay(true);

            // Save selected trip idea to localStorage
            saveSelectedTripIdea(card);

            // Navigate to customize/edit screen after delay
            setTimeout(() => {
                navigate('/customize');
            }, 400);
        } else {
            // Show passed overlay briefly
            setShowPassedOverlay(true);
            setTimeout(() => {
                setShowPassedOverlay(false);
                // Move to next card
                setCurrentIndex(prev => {
                    const next = prev + 1;
                    // If we've gone through all cards, reload deck
                    if (next >= deck.length) {
                        const signals = loadSwipeSignals();
                        const newDeck = prepareDeck(DEMO_SWIPE_CARDS, signals);
                        setDeck(newDeck);
                        return 0;
                    }
                    return next;
                });
                x.set(0);
            }, 300);
        }
    }, [navigate, deck.length, x]);

    // Handle drag end
    const handleDragEnd = useCallback((event, info) => {
        const threshold = 100;
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        if (offset > threshold || velocity > 500) {
            // Swipe right - LIKE
            setExitX(300);
            animate(x, 300, { duration: 0.2 });
            setTimeout(() => handleSwipe('right', currentCard), 200);
        } else if (offset < -threshold || velocity < -500) {
            // Swipe left - PASS
            setExitX(-300);
            animate(x, -300, { duration: 0.2 });
            setTimeout(() => handleSwipe('left', currentCard), 200);
        } else {
            // Spring back
            animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
        }
    }, [currentCard, handleSwipe, x]);

    // Button handlers
    const handlePassClick = () => {
        if (!currentCard) return;
        setExitX(-300);
        animate(x, -300, { duration: 0.3 });
        setTimeout(() => handleSwipe('left', currentCard), 300);
    };

    const handleLikeClick = () => {
        if (!currentCard) return;
        setExitX(300);
        animate(x, 300, { duration: 0.3 });
        setTimeout(() => handleSwipe('right', currentCard), 300);
    };

    // Empty state
    if (deck.length === 0) {
        return (
            <div className="py-12 px-6 md:px-20 bg-gradient-to-b from-black to-zinc-900">
                <div className="max-w-md mx-auto text-center">
                    <p className="text-white/60 oswald">{t('swipe.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden">
            {/* Dynamic Blurred Background - scoped to this section only */}
            <BlurredCardBackground imageUrl={currentCard?.image} />

            {/* Main Content - positioned above background */}
            <div className="relative z-10 py-12 px-6 md:px-20">
                <div className="max-w-lg mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 oswald">
                            {t('swipe.title')}
                        </h2>
                        <p className="text-white/60 oswald text-lg">
                            {t('swipe.subtitle')}
                        </p>
                    </div>

                    {/* Card Stack - Centered with buttons positioned relative to card */}
                    <div className="w-full flex justify-center">
                        <div className="relative h-[520px] w-[min(380px,90vw)]">
                            {/* Next card (underneath) */}
                            {nextCard && (
                                <div className="absolute inset-0 flex justify-center">
                                    <div className="w-full max-w-sm transform scale-95 opacity-60">
                                        <SwipeCard card={nextCard} />
                                    </div>
                                </div>
                            )}

                            {/* Current card (on top, draggable) */}
                            {currentCard && (
                                <motion.div
                                    className="absolute inset-0 flex justify-center cursor-grab active:cursor-grabbing"
                                    style={{ x, rotate, opacity }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={handleDragEnd}
                                >
                                    <div className="w-full max-w-sm">
                                        <SwipeCard
                                            card={currentCard}
                                            isTop={true}
                                            dragX={x.get()}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* Liked Overlay */}
                            {showLikedOverlay && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 backdrop-blur-sm rounded-2xl z-50"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="text-center">
                                        <span className="text-6xl">❤️</span>
                                        <p className="text-white text-2xl font-bold mt-2 oswald">{t('swipe.liked')}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Passed Overlay */}
                            {showPassedOverlay && (
                                <motion.div
                                    className="absolute inset-0 flex items-center justify-center bg-rose-500/20 backdrop-blur-sm rounded-2xl z-50"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    <div className="text-center">
                                        <span className="text-6xl">✕</span>
                                        <p className="text-white text-2xl font-bold mt-2 oswald">{t('swipe.passed')}</p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Pass Button - LEFT of card */}
                            <motion.button
                                onClick={handlePassClick}
                                className="absolute -left-20 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-zinc-800 border-2 border-rose-400/50 flex items-center justify-center shadow-lg hover:bg-rose-500/20 transition-colors z-20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="Passer"
                            >
                                <span className="text-rose-400 text-3xl">✕</span>
                            </motion.button>

                            {/* Like Button - RIGHT of card */}
                            <motion.button
                                onClick={handleLikeClick}
                                className="absolute -right-20 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-zinc-800 border-2 border-emerald-400/50 flex items-center justify-center shadow-lg hover:bg-emerald-500/20 transition-colors z-20"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label="J'aime"
                            >
                                <span className="text-emerald-400 text-3xl">❤️</span>
                            </motion.button>
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-8 text-center">
                        <p className="text-white/40 text-xs oswald">
                            {currentIndex + 1} / {deck.length} destinations
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwipeDiscoveryDeck;

