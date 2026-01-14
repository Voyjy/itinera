import React, { useState, useEffect } from 'react';
import QuestionStep from './QuestionStep';
import { usePersonalization } from './usePersonalization';

const QUESTIONS = [
    {
        id: 'travelType',
        question: 'Quel type de voyage prépares-tu ?',
        options: ['En famille', 'En couple', 'Solo', 'Avec enfants', 'Senior / facile']
    },
    {
        id: 'priority',
        question: "Qu'est-ce qui compte le plus ?",
        options: ['Confort', 'Détente', 'Culture', 'Nourriture', 'Nature']
    },
    {
        id: 'pace',
        question: 'Quel rythme veux-tu ?',
        options: ['Calme (peu de marche)', 'Équilibré', 'Marche légère']
    }
];

const PersonalizationModal = ({ isOpen, onClose, onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({
        travelType: '',
        priority: '',
        pace: ''
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const { saveProfile } = usePersonalization();

    const currentQuestion = QUESTIONS[currentStep];
    const totalSteps = QUESTIONS.length;

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentStep(0);
            setShowSuccess(false);
            // Keep existing answers if reopening
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSelect = (value) => {
        setAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: value
        }));
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Final step - save profile
            const success = saveProfile(answers);
            if (success) {
                setShowSuccess(true);
                // Auto-close and trigger callback after short delay
                setTimeout(() => {
                    onComplete?.();
                    onClose();
                }, 1500);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleClose = () => {
        onClose();
    };

    const canGoNext = !!answers[currentQuestion.id];

    // Success screen
    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-gradient-to-br from-zinc-900 to-black border-2 border-white/20 rounded-2xl p-8 max-w-md w-full mx-4 text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-3xl font-bold text-white mb-2 oswald">Terminé !</h2>
                    <p className="text-white/80 oswald">Vos préférences ont été enregistrées</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            onClick={(e) => {
                // Close on backdrop click (but not on modal content)
                if (e.target === e.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div
                className="bg-gradient-to-br from-zinc-900 to-black border-2 border-white/20 rounded-2xl p-8 max-w-2xl w-full relative shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                    aria-label="Fermer"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Skip Button */}
                <div className="text-center mb-4">
                    <button
                        onClick={handleClose}
                        className="text-white/50 hover:text-white/80 text-sm underline transition-colors oswald"
                    >
                        Passer cette étape
                    </button>
                </div>

                {/* Question Step */}
                <QuestionStep
                    question={currentQuestion.question}
                    options={currentQuestion.options}
                    selectedValue={answers[currentQuestion.id]}
                    onSelect={handleSelect}
                    currentStep={currentStep + 1}
                    totalSteps={totalSteps}
                    onBack={handleBack}
                    onNext={handleNext}
                    canGoNext={canGoNext}
                />
            </div>
        </div>
    );
};

export default PersonalizationModal;
