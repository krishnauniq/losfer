
import React from "react";

export default function Card({ children, className = "", noPadding = false, ...props }) {
    return (
        <div
            className={`card-premium ${noPadding ? '!p-0' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
