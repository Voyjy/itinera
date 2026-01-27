import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * BlurredCardBackground - Spotify/Airbnb-style dynamic blurred background
 * Syncs with current swipe card image with smooth crossfade transitions
 * SCOPED to parent container only (position: absolute, not fixed)
 */
const BlurredCardBackground = ({ imageUrl, enabled = true }) => {
    const [images, setImages] = useState({
        current: imageUrl,
        previous: null,
        key: Date.now()
    });

    // Handle image URL change with crossfade
    useEffect(() => {
        if (imageUrl && imageUrl !== images.current) {
            setImages(prev => ({
                previous: prev.current,
                current: imageUrl,
                key: Date.now()
            }));
        }
    }, [imageUrl]);

    if (!enabled) return null;

    // Fallback gradient when no image
    const fallbackGradient = 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)';

    return (
        <div
            className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl"
            style={{ zIndex: 0 }}
            aria-hidden="true"
        >
            {/* Previous image layer (fading out) */}
            <AnimatePresence>
                {images.previous && (
                    <motion.div
                        key={`prev-${images.key}`}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute inset-0"
                        style={{ willChange: 'opacity' }}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat
                                scale-110 blur-[24px] md:blur-[32px]"
                            style={{
                                backgroundImage: `url(${images.previous})`,
                                transform: 'scale(1.15)',
                                willChange: 'transform',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Current image layer (fading in) */}
            <motion.div
                key={`curr-${images.key}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeIn' }}
                className="absolute inset-0"
                style={{ willChange: 'opacity' }}
            >
                {images.current ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat
                            scale-110 blur-[24px] md:blur-[32px]"
                        style={{
                            backgroundImage: `url(${images.current})`,
                            transform: 'scale(1.15)',
                            willChange: 'transform',
                        }}
                    />
                ) : (
                    <div
                        className="absolute inset-0"
                        style={{ background: fallbackGradient }}
                    />
                )}
            </motion.div>

            {/* Dark overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'rgba(0, 0, 0, 0.55)',
                    willChange: 'auto'
                }}
            />

            {/* Subtle vignette effect */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 100%)',
                }}
            />

            {/* Top gradient fade for navbar area */}
            <div
                className="absolute top-0 left-0 right-0 h-32"
                style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
                }}
            />
        </div>
    );
};

export default BlurredCardBackground;
