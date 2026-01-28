import React, { useState, useEffect } from "react";
import Button from "../layouts/Button";
import bgVideo from "../assets/videos/video_bg2.mp4";
import PersonalizationModal from "./personalization/PersonalizationModal";
import PersonalizationButton from "./personalization/PersonalizationButton";
import SwipeDiscoveryDeck from "./swipe/SwipeDiscoveryDeck";
import TagChips from "./personalization/TagChips";
import { usePersonalization } from "./personalization/usePersonalization";

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const { profile, hasProfile, isLoading } = usePersonalization();

  // Auto-show modal for first-time users after delay
  useEffect(() => {
    if (!isLoading && !hasProfile) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 800); // 0.8s delay

      return () => clearTimeout(timer);
    }
  }, [isLoading, hasProfile]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalComplete = () => {
    // Modal will close automatically, this is just for any additional logic
    console.log('Profile completed!');
  };

  const handlePersonalizeClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />

        {/* Overlay Content */}
        <div className="relative z-10 flex flex-row justify-between min-h-screen md:px-32 px-5 bg-black/60">
          <div className="flex flex-col justify-center md:w-2/3 w-full">
            <h5 className="oswald text-8xl font-extralight md:text-start text-center text-white mb-25 tracking-normal reduce-word-spacing">
              Step Into a <span className="italic">W</span>orld of Discovery
            </h5>

            <p className="text-white text-sm md:text-base mb-4 mt-10 md:text-left text-center max-w-xl oswald">
              Behind every door lies a world of endless possibilities. Soléa guides
              you to hidden gems, uncharted places, and unforgettable adventures that
              go beyond the ordinary. Explore captivating destinations, save your
              favorites, and start planning the journey of a lifetime.
            </p>

            {/* Show personalization button for returning users */}
            {hasProfile && (
              <div className="mb-4 md:text-left text-center">
                <TagChips tags={profile?.tags || []} />
              </div>
            )}

            <div className="flex flex-row justify-start gap-4">
              <Button
                title="Explore Now"
                scrollTo="Destinations"
                className="px-8 py-4 text-lg"
              />
              {hasProfile && (
                <div className="hidden md:block">
                  <PersonalizationButton onClick={handlePersonalizeClick} />
                </div>
              )}
            </div>
          </div>
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
