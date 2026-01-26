import React from 'react';

export default function StatusTimeline({ status }) {
    const steps = [
        { id: 'found', label: 'Found' },
        { id: 'claimed', label: 'Claimed' },
        { id: 'verified', label: 'Verified' },
        { id: 'returned', label: 'Returned' },
    ];

    // Map status string to index
    const getCurrentStepIndex = (currentStatus) => {
        // Default to found if unknown
        const index = steps.findIndex(s => s.id === currentStatus?.toLowerCase());
        return index === -1 ? 0 : index;
    };

    const currentStep = getCurrentStepIndex(status);

    return (
        <div className="w-full py-6 px-10">
            <div className="flex items-center justify-between relative">
                {/* Connection Line */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-surface-200 dark:bg-surface-800 -z-10 rounded-full"></div>
                <div
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary-500 transition-all duration-500 rounded-full"
                    style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                ></div>

                {/* Steps */}
                {steps.map((step, index) => {
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center group">
                            <div
                                className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                    ${isCompleted
                                        ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30'
                                        : 'bg-surface-50 dark:bg-surface-900 border-surface-300 dark:border-surface-600 text-surface-400'}
                    ${isCurrent ? 'scale-125 ring-4 ring-primary-100 dark:ring-primary-900/30' : ''}
                `}
                            >
                                {isCompleted ? '✓' : index + 1}
                            </div>
                            <span
                                className={`
                    absolute top-10 text-[10px] font-bold uppercase tracking-wider transition-colors duration-300
                    ${isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400 dark:text-surface-600'}
                    ${Math.abs(index - currentStep) > 1 ? 'hidden sm:block' : 'block'} 
                `}
                                style={{ transform: 'translateX(-50%)', left: 'auto' }}
                            >
                                <div className="w-20 text-center">{step.label}</div>
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Spacer for labels */}
            <div className="h-6"></div>
        </div>
    );
}
