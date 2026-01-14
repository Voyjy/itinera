import React from 'react';

const QuestionStep = ({
    question,
    options,
    selectedValue,
    onSelect,
    currentStep,
    totalSteps,
    onBack,
    onNext,
    canGoNext
}) => {
    return (
        <div className="w-full">
            {/* Progress Indicator */}
            <div className="text-center mb-6">
                <span className="text-white/70 text-sm font-medium">
                    Étape {currentStep} sur {totalSteps}
                </span>
            </div>

            {/* Question */}
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 oswald">
                {question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-8">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSelect(option)}
                        className={`w-full min-h-[60px] px-6 py-4 rounded-lg text-lg font-medium transition-all duration-300 oswald
              ${selectedValue === option
                                ? 'bg-white text-black border-2 border-white shadow-lg scale-[1.02]'
                                : 'bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 hover:border-white/50'
                            }`}
                        aria-pressed={selectedValue === option}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-between">
                {currentStep > 1 ? (
                    <button
                        onClick={onBack}
                        className="px-6 py-3 bg-transparent border-2 border-white/50 text-white rounded-lg hover:bg-white/10 transition-all duration-300 oswald text-base"
                    >
                        ← Retour
                    </button>
                ) : (
                    <div></div>
                )}

                <button
                    onClick={onNext}
                    disabled={!canGoNext}
                    className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 oswald text-base
            ${canGoNext
                            ? 'bg-white text-black hover:bg-white/90 shadow-lg'
                            : 'bg-white/20 text-white/50 cursor-not-allowed'
                        }`}
                >
                    {currentStep === totalSteps ? 'Terminer ✓' : 'Suivant →'}
                </button>
            </div>
        </div>
    );
};

export default QuestionStep;
