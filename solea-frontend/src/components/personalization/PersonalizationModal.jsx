import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePersonalization } from './usePersonalization';

// UI Components
import StepperHeader from './ui/StepperHeader';
import GlowButton from './ui/GlowButton';

// Step Components
import Step1TripType, { TRIP_TYPE_MAP } from './steps/Step1TripType';
import Step2Destination from './steps/Step2Destination';
import Step3DatesTravelers from './steps/Step3DatesTravelers';
import Step4Preferences from './steps/Step4Preferences';

const TOTAL_STEPS = 4;

const PersonalizationModal = ({ isOpen, onClose, onComplete }) => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showSuccess, setShowSuccess] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        // Step 1
        tripType: '',
        // Step 2
        destination: '',
        // Step 3
        startDate: '',
        endDate: '',
        travelers: 1,
        // Step 4
        budget: '',
        pace: '',
        interests: [],
        accessibility: []
    });

    const { saveProfile } = usePersonalization();

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(1);
            setShowSuccess(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Form update handlers
    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Navigation
    const handleNext = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        const success = saveProfile(formData);
        if (success) {
            setShowSuccess(true);
            setTimeout(() => {
                onComplete?.();
                onClose();
                // Navigate to itinerary loading screen with profile data
                navigate('/itinerary/loading', { state: { profile: formData } });
            }, 1500);
        }
    };

    const handleClose = () => {
        onClose();
    };

    // Validation per step
    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return !!formData.tripType;
            case 2:
                return true; // Destination is optional
            case 3:
                return true; // Dates are optional
            case 4:
                return true; // Preferences are optional but encouraged
            default:
                return false;
        }
    };

    // Success screen
    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-500/30 rounded-3xl p-10 max-w-md w-full mx-4 text-center shadow-2xl shadow-amber-500/10"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-7xl mb-6"
                    >
                        ✨
                    </motion.div>
                    <h2 className="text-3xl font-bold text-white mb-3 oswald">
                        C'est parti !
                    </h2>
                    <p className="text-white/70 oswald text-lg">
                        Vos préférences ont été enregistrées
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) handleClose();
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

                {/* Decorative gradient orbs */}
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl" />

                {/* Content container */}
                <div className="relative z-10 p-6 md:p-8 overflow-y-auto max-h-[90vh]">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 z-20"
                        aria-label="Fermer"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Skip Button */}
                    <div className="text-center mb-2">
                        <button
                            onClick={handleClose}
                            className="text-white/40 hover:text-white/70 text-sm transition-colors oswald"
                        >
                            Passer cette étape →
                        </button>
                    </div>

                    {/* Stepper Header */}
                    <StepperHeader
                        currentStep={currentStep}
                        totalSteps={TOTAL_STEPS}
                    />

                    {/* Step Content with Animation */}
                    <div className="min-h-[350px]">
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <Step1TripType
                                    key="step1"
                                    value={formData.tripType}
                                    onChange={(val) => updateFormData('tripType', val)}
                                />
                            )}
                            {currentStep === 2 && (
                                <Step2Destination
                                    key="step2"
                                    value={formData.destination}
                                    onChange={(val) => updateFormData('destination', val)}
                                />
                            )}
                            {currentStep === 3 && (
                                <Step3DatesTravelers
                                    key="step3"
                                    startDate={formData.startDate}
                                    endDate={formData.endDate}
                                    travelers={formData.travelers}
                                    onStartDateChange={(val) => updateFormData('startDate', val)}
                                    onEndDateChange={(val) => updateFormData('endDate', val)}
                                    onTravelersChange={(val) => updateFormData('travelers', val)}
                                />
                            )}
                            {currentStep === 4 && (
                                <Step4Preferences
                                    key="step4"
                                    budget={formData.budget}
                                    pace={formData.pace}
                                    interests={formData.interests}
                                    accessibility={formData.accessibility}
                                    onBudgetChange={(val) => updateFormData('budget', val)}
                                    onPaceChange={(val) => updateFormData('pace', val)}
                                    onInterestsChange={(val) => updateFormData('interests', val)}
                                    onAccessibilityChange={(val) => updateFormData('accessibility', val)}
                                />
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 justify-between mt-6 pt-4 border-t border-white/10">
                        {currentStep > 1 ? (
                            <GlowButton
                                variant="secondary"
                                onClick={handleBack}
                            >
                                ← Retour
                            </GlowButton>
                        ) : (
                            <div />
                        )}

                        <GlowButton
                            variant="primary"
                            onClick={handleNext}
                            disabled={!canProceed()}
                        >
                            {currentStep === TOTAL_STEPS ? (
                                <>
                                    Générer mon itinéraire
                                    <span className="ml-1">✨</span>
                                </>
                            ) : (
                                'Suivant →'
                            )}
                        </GlowButton>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PersonalizationModal;
