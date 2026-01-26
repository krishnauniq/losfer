import React from "react";

export default function Skeleton({ className = "", variant = "text" }) {
    const baseClasses = "bg-surface-200 dark:bg-surface-800 animate-pulse rounded";

    const variants = {
        text: "h-4 w-3/4",
        title: "h-6 w-1/2",
        circular: "rounded-full",
        rectangular: "h-full w-full",
    };

    const variantClasses = variants[variant] || variants.text;

    return (
        <div className={`${baseClasses} ${variantClasses} ${className}`}></div>
    );
}
