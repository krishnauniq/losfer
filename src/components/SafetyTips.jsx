import React from 'react';

export default function SafetyTips() {
    const tips = [
        {
            title: "Meet in Public",
            description: "Always choose a busy, public location like a mall or coffee shop for exchanges.",
            icon: "🏢",
            theme: "cyan",
            styles: {
                iconBg: "from-cyan-500/20 to-blue-600/20 text-cyan-400",
                borderHover: "hover:border-cyan-400/50",
                shadowHover: "hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]"
            }
        },
        {
            title: "Verify First",
            description: "Check items thoroughly before handing over any reward or accepting a return.",
            icon: "🔍",
            theme: "emerald",
            styles: {
                iconBg: "from-emerald-500/20 to-teal-600/20 text-emerald-400",
                borderHover: "hover:border-emerald-400/50",
                shadowHover: "hover:shadow-[0_0_20px_rgba(52,211,153,0.2)]"
            }
        },
        {
            title: "Chat Securely",
            description: "Keep all communication within the LOSFER app to protect your personal details.",
            icon: "💬",
            theme: "purple",
            styles: {
                iconBg: "from-purple-500/20 to-fuchsia-600/20 text-purple-400",
                borderHover: "hover:border-purple-400/50",
                shadowHover: "hover:shadow-[0_0_20px_rgba(192,132,252,0.2)]"
            }
        },
        {
            title: "Trust Your Gut",
            description: "If something feels off about a meeting or user, cancel it immediately.",
            icon: "🛡️",
            theme: "rose",
            styles: {
                iconBg: "from-rose-500/20 to-orange-600/20 text-rose-400",
                borderHover: "hover:border-rose-400/50",
                shadowHover: "hover:shadow-[0_0_20px_rgba(251,113,133,0.2)]"
            }
        }
    ];

    return (
        <div className="relative py-8">
            <div className="p-6 md:p-8 rounded-[2rem] bg-gradient-to-br from-slate-900 to-blue-950 border border-blue-500/30 shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] overflow-hidden relative group/card">
                {/* Decorative Background */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-2xl md:text-3xl animate-bounce">🛡️</span>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                            Safety Zone
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {tips.map((tip, index) => (
                            <div
                                key={index}
                                className={`
                                    p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 
                                    hover:bg-white/10 ${tip.styles.borderHover} ${tip.styles.shadowHover}
                                    transform hover:-translate-y-2 hover:scale-105
                                    transition-all duration-300 ease-out cursor-default
                                `}
                            >
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl mb-4 bg-gradient-to-br ${tip.styles.iconBg} border border-white/5 shadow-inner`}>
                                    {tip.icon}
                                </div>
                                <h3 className="font-bold text-white mb-2 text-base md:text-lg">{tip.title}</h3>
                                <p className="text-[13px] md:text-sm text-blue-100/70 font-medium leading-relaxed">{tip.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
