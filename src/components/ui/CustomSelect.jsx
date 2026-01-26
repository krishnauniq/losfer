import React, { useState, useRef, useEffect } from 'react';

export default function CustomSelect({ label, value, onChange, options, required, className }) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange({ target: { value: optionValue } });
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-sm font-bold text-surface-700 dark:text-surface-300 mb-2 uppercase tracking-wider">
                    {label} {required && <span className="text-error-500">*</span>}
                </label>
            )}

            {/* Trigger Button */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full px-4 py-3 bg-surface-50 dark:bg-surface-800 border-2 rounded-2xl cursor-pointer flex items-center justify-between transition-all duration-300
                    ${isOpen ? 'border-primary-500 shadow-[0_0_0_4px_rgba(99,102,241,0.1)]' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300'}
                `}
            >
                <div className="flex items-center gap-3">
                    {selectedOption?.icon && <span className="text-xl">{selectedOption.icon}</span>}
                    <span className={`font-medium ${selectedOption ? 'text-surface-900 dark:text-white' : 'text-surface-400'}`}>
                        {selectedOption ? selectedOption.label : 'Select Option'}
                    </span>
                </div>
                <svg
                    className={`w-5 h-5 text-surface-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-surface-200 dark:border-surface-700 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="max-h-60 overflow-y-auto hide-scrollbar">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                                    ${value === option.value
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-bold'
                                        : 'text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                                    }
                                `}
                            >
                                {option.icon && <span className="text-xl">{option.icon}</span>}
                                <span>{option.label}</span>
                                {value === option.value && (
                                    <svg className="w-5 h-5 ml-auto text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
