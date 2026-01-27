import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import SplineBackground from "./hero/SplineBackground";
import PersonalizationModal from "./personalization/PersonalizationModal";
import PersonalizationButton from "./personalization/PersonalizationButton";
import SwipeDiscoveryDeck from "./swipe/SwipeDiscoveryDeck";

import { usePersonalization } from "./personalization/usePersonalization";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const { profile, hasProfile, isLoading } = usePersonalization();

  // Refs for GSAP animation
  const heroRef = useRef(null);
  const headlineRef = useRef(null);

  // Auto-show modal for first-time users after delay
  useEffect(() => {
    if (!isLoading && !hasProfile) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [isLoading, hasProfile]);

  // GSAP Pinned Hero Scroll Animation
  // Hero stays pinned while headline moves down + fades out
  // After animation completes, page continues scrolling normally
  useLayoutEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Animation values - responsive
      // Pin for ~100% viewport height so animation feels like 1 screen of scroll
      const pinDistance = isMobile ? window.innerHeight * 0.9 : window.innerHeight;
      const moveDownY = isMobile ? 140 : 200;

      // Create timeline with ScrollTrigger + PIN
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: `+=${pinDistance}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
        },
      });

      // Phase 1 (0% → 55%): Move headline DOWN, opacity stays at 1
      tl.to(headlineRef.current, {
        y: moveDownY,
        opacity: 1,
        ease: "none",
        duration: 0.55,
      });

      // Phase 2 (55% → 100%): Fade out + slight blur
      tl.to(headlineRef.current, {
        y: moveDownY + 40,
        opacity: 0,
        filter: "blur(6px)",
        ease: "none",
        duration: 0.45,
      }, ">");
    }, heroRef);

    // Refresh ScrollTrigger after a delay to account for Spline loading
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500);

    return () => {
      clearTimeout(refreshTimeout);
      ctx.revert();
    };
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalComplete = () => {
    console.log('Profile completed!');
  };

  const handlePersonalizeClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div ref={heroRef} className="relative min-h-screen w-full overflow-hidden">
        {/* Layer 1: Spline 3D Background (z-0) */}
        <SplineBackground enableSpline={true} />

        {/* Layer 2: Headline Content (z-10) - centered, animated */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5 bg-black/40 pointer-events-none">
          {/* Headline wrapper - ONLY this gets animated */}
          <div
            ref={headlineRef}
            className="text-center max-w-4xl -translate-y-12 md:-translate-y-24 will-change-transform"
          >
            <h5 className="oswald text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-white tracking-normal reduce-word-spacing">
              Step Into a <span className="italic">W</span>orld of Discovery
            </h5>
          </div>
        </div>

        {/* Layer 3: CTA Button - covers "Built with Spline" watermark */}
        <div
          className="absolute right-3 bottom-3 z-[999] pointer-events-auto"
        >
          <PersonalizationButton onClick={handlePersonalizeClick} />
        </div>
      </div>

      {/* Personalization Modal */}
      <PersonalizationModal
        isOpen={showModal}
        onClose={handleModalClose}
        onComplete={handleModalComplete}
      />

      {/* Swipe Discovery Section */}
      {hasProfile && <SwipeDiscoveryDeck />}
    </>
  );
};

export default Home;
