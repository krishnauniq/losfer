
import React from "react";

const variants = {
    success: "bg-success-500/10 text-success-600 border-success-200",
    warning: "bg-warning-500/10 text-warning-600 border-warning-200",
    error: "bg-error-500/10 text-error-600 border-error-200",
    info: "bg-primary-500/10 text-primary-600 border-primary-200",
    neutral: "bg-surface-100 text-surface-600 border-surface-200",
};

export default function Badge({ children, variant = "neutral", className = "" }) {
    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
        ${variants[variant]} 
        ${className}
      `}
        >
            {children}
        </span>
    );
}
