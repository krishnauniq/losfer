import React from 'react';

export default function ConfidenceMeter({ score }) {
    // Score is 0-100
    // Determine color based on score
    let colorClass = 'bg-error-500';
    let textClass = 'text-error-600';

    if (score >= 80) {
        colorClass = 'bg-success-500';
        textClass = 'text-success-600';
    } else if (score >= 50) {
        colorClass = 'bg-warning-500';
        textClass = 'text-warning-600';
    }

    return (
        <div className="flex items-center gap-2" title={`Confidence Score: ${score}%`}>
            <div className="flex-1 h-1.5 w-16 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${score}%` }}
                ></div>
            </div>
            <span className={`text-[10px] font-bold ${textClass} dark:text-opacity-90`}>
                {score}% Match
            </span>
        </div>
    );
}
