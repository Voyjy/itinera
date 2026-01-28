import React from 'react';
import { motion } from 'framer-motion';

/**
 * StepperHeader - Animated progress stepper with circles and connecting lines
 * 
 * @param {Object} props
 * @param {number} props.currentStep - Current active step (1-indexed)
 * @param {number} props.totalSteps - Total number of steps
 * @param {string[]} props.labels - Optional labels for each step
 */
const StepperHeader = ({
    currentStep = 1,
    totalSteps = 4,
    labels = []
}) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <div className="w-full mb-8">
            {/* Step indicator text */}
            <div className="text-center mb-4">
                <span className="text-white/50 text-sm font-medium oswald">
                    Étape {currentStep} sur {totalSteps}
                </span>
            </div>

            {/* Stepper circles */}
            <div className="flex items-center justify-center gap-0">
                {steps.map((step, index) => {
                    const isCompleted = step < currentStep;
                    const isActive = step === currentStep;
                    const isUpcoming = step > currentStep;

                    return (
                        <React.Fragment key={step}>
                            {/* Step circle */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                                    relative flex items-center justify-center
                                    w-10 h-10 rounded-full
                                    font-bold text-sm oswald
                                    transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30'
                                        : isActive
                                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/40 ring-4 ring-orange-500/20'
                                            : 'bg-white/10 text-white/40 border-2 border-white/20'
                                    }
                                `}
                            >
                                {isCompleted ? (
                                    <motion.svg
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={3}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </motion.svg>
                                ) : (
                                    step
                                )}

                                {/* Pulse effect for active step */}
                                {isActive && (
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.5, 1],
                                            opacity: [0.5, 0, 0.5]
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute inset-0 rounded-full bg-orange-500"
                                    />
                                )}
                            </motion.div>

                            {/* Connecting line (not after last step) */}
                            {index < steps.length - 1 && (
                                <div className="relative w-12 h-0.5 mx-1">
                                    {/* Background line */}
                                    <div className="absolute inset-0 bg-white/10 rounded-full" />

                                    {/* Progress fill */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: isCompleted ? '100%' : '0%'
                                        }}
                                        transition={{ duration: 0.3, delay: 0.1 }}
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Optional step labels */}
            {labels.length > 0 && (
                <div className="flex justify-between mt-3 px-2">
                    {labels.map((label, index) => (
                        <span
                            key={index}
                            className={`
                                text-xs font-medium oswald text-center flex-1
                                ${index + 1 === currentStep
                                    ? 'text-orange-400'
                                    : index + 1 < currentStep
                                        ? 'text-white/60'
                                        : 'text-white/30'
                                }
                            `}
                        >
                            {label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StepperHeader;
