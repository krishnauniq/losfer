import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActions({ onFocusSearch }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showContact, setShowContact] = useState(false);
    const navigate = useNavigate();

    const [isCopied, setIsCopied] = useState(false);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handlePost = () => {
        navigate('/app/post-item');
        setIsOpen(false);
    };

    const handleContact = () => {
        console.log("Contact popup triggered");
        setShowContact(true);
        setIsOpen(false);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText('campuslosfer@gmail.com');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <>
            {/* Overlay to close on click outside */}
            {(isOpen || showContact) && (
                <div
                    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px] transition-opacity"
                    onClick={() => { setShowContact(false); setIsOpen(false); }}
                ></div>
            )}

            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 actions-container pointer-events-none">
                {/* Contact Popup - Pointer events auto to allow interaction */}
                {showContact && (
                    <div className="mb-4 w-80 bg-white dark:bg-surface-900 rounded-3xl shadow-2xl border border-white/20 dark:border-surface-700 animate-in fade-in slide-in-from-bottom-8 zoom-in-95 duration-300 overflow-hidden relative pointer-events-auto">
                        {/* Decorative Gradient Background */}
                        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-violet-600 to-fuchsia-600"></div>
                        <div className="absolute top-0 right-0 p-4 z-20">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowContact(false); }}
                                className="bg-black/20 hover:bg-black/40 text-white rounded-full p-2 backdrop-blur-md transition-all hover:scale-110 active:scale-95 shadow-lg"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="relative pt-8 px-6 pb-6 text-center">
                            <div className="w-16 h-16 bg-white dark:bg-surface-800 rounded-2xl shadow-xl mx-auto flex items-center justify-center text-3xl mb-4 relative z-10 border-4 border-white dark:border-surface-700 transform rotate-3">
                                💬
                            </div>

                            <h4 className="font-black text-xl text-surface-900 dark:text-surface-100 mb-1">Need Help?</h4>
                            <p className="text-surface-500 text-sm mb-6">Drop us a mail directly.</p>

                            <div
                                onClick={copyToClipboard}
                                className="group cursor-pointer bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-3 flex items-center justify-between hover:border-primary-500 dark:hover:border-primary-500 transition-all hover:shadow-md active:scale-95"
                            >
                                <div className="text-left overflow-hidden">
                                    <p className="text-[10px] uppercase font-bold text-surface-400 tracking-wider mb-0.5">Support Email</p>
                                    <p className="font-bold text-surface-800 dark:text-surface-100 text-sm truncate">campuslosfer@gmail.com</p>
                                </div>
                                <div className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300
                                    ${isCopied ? 'bg-success-500 text-white rotate-0' : 'bg-surface-200 dark:bg-surface-700 text-surface-500 group-hover:bg-primary-100 group-hover:text-primary-600'}
                                `}>
                                    {isCopied ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                    )}
                                </div>
                            </div>
                            <p className={`text-xs font-bold text-success-600 mt-2 transition-opacity duration-300 ${isCopied ? 'opacity-100' : 'opacity-0'}`}>
                                Copied to clipboard!
                            </p>
                        </div>
                    </div>
                )}

                {/* Actions - Pointer events auto */}
                <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom pointer-events-auto ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0'}`}>
                    <button
                        onClick={handlePost}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-full shadow-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors border border-surface-200 dark:border-surface-700 whitespace-nowrap"
                    >
                        <span className="text-lg">➕</span> Post Item
                    </button>
                    <button
                        onClick={handleContact}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 rounded-full shadow-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors border border-surface-200 dark:border-surface-700 whitespace-nowrap"
                    >
                        <span className="text-lg">📞</span> Contact Us
                    </button>
                </div>

                {/* Main Toggle Button - Pointer events auto */}
                <button
                    onClick={toggleOpen}
                    className={`
                        w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white text-2xl transition-all duration-300 pointer-events-auto
                        bg-gradient-to-r from-primary-500 to-secondary-500 hover:scale-110 active:scale-95
                        ${isOpen ? 'rotate-45' : 'rotate-0'}
                    `}
                >
                    ➕
                </button>
            </div>
        </>
    );
}
