import React, { useEffect } from 'react';
import confetti from "canvas-confetti";
import Button from '../ui/Button';

export default function CelebrationModal({ isOpen, onClose, itemName }) {
    useEffect(() => {
        if (isOpen) {
            // Trigger confetti
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

            const randomInRange = (min, max) => Math.random() * (max - min) + min;

            const interval = setInterval(function () {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = Math.floor(50 * (timeLeft / duration));

                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: ['#6366f1', '#a855f7', '#ec4899']
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: ['#6366f1', '#a855f7', '#ec4899']
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-700"></div>

            {/* Main Modal Container with massive shadow */}
            <div className="relative bg-surface-900 border border-white/20 rounded-[3rem] p-10 max-w-sm w-full text-center shadow-[0_0_100px_rgba(99,102,241,0.5)] animate-in zoom-in-75 duration-500 flex flex-col items-center overflow-hidden">

                {/* Background Rotating Glow */}
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(99,102,241,0.1),transparent)] animate-[spin_10s_linear_infinite]"></div>

                {/* Fixed Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/30 via-secondary-500/20 to-transparent pointer-events-none"></div>

                <div className="relative mb-8 group">
                    {/* Outer Pulse */}
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-2xl animate-pulse group-hover:scale-110 transition-transform duration-500"></div>

                    <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-3xl flex items-center justify-center text-6xl shadow-2xl animate-bounce-slow relative z-10 rotate-6 border border-white/20">
                        🏆
                    </div>
                </div>

                <div className="inline-block px-4 py-1.5 bg-success-500/10 border border-success-500/20 rounded-full mb-6 relative z-10">
                    <span className="text-success-500 text-[10px] font-black uppercase tracking-[0.3em]">Verified Return</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tighter relative z-10 uppercase italic leading-tight">
                    MISSION<br />COMPLETE
                </h2>

                <p className="text-surface-400 text-base mb-10 relative z-10 font-medium leading-relaxed">
                    The item <span className="text-white font-bold block mt-1 text-lg">"{itemName}"</span> has been handed back!
                </p>

                <div className="w-full relative z-10">
                    <Button
                        onClick={onClose}
                        className="w-full bg-white text-black hover:bg-surface-100 font-black tracking-[0.2em] py-5 rounded-2xl shadow-2xl transform active:scale-95 transition-all text-xs"
                    >
                        BACK TO DASHBOARD
                    </Button>
                </div>

                {/* Micro Footer */}
                <p className="mt-8 text-[10px] text-white/20 font-black uppercase tracking-widest relative z-10">Losfer Karma +100</p>
            </div>
        </div>
    );
}
