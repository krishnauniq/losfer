import React, { useEffect } from 'react';
import Card from './Card';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-surface-900/50 dark:bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <Card
                className={`relative w-full ${maxWidth} z-10 animate-slide-up shadow-2xl border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800`}
                noPadding
            >
                <div className="flex items-center justify-between p-4 border-b border-surface-100 dark:border-surface-700">
                    <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 text-surface-600 dark:text-surface-300">
                    {children}
                </div>
            </Card>
        </div>
    );
}
