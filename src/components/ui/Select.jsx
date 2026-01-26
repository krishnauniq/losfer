
import React, { forwardRef } from "react";

const Select = forwardRef(({ label, error, children, className = "", ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                className={`
          block w-full rounded-lg border-surface-300 bg-white text-surface-900 shadow-sm
          focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-2 px-3
          disabled:cursor-not-allowed disabled:bg-surface-50 disabled:text-surface-500
          ${error ? "border-error-300 text-error-900 placeholder-error-300 focus:border-error-500 focus:ring-error-500" : ""}
          ${className}
        `}
                {...props}
            >
                {children}
            </select>
            {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
        </div>
    );
});

Select.displayName = "Select";
export default Select;
