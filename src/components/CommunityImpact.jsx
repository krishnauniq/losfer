import { useState, useEffect } from 'react';

export default function CommunityImpact() {
    // Mock Stats - In a real app, these would come from Firestore
    const stats = [
        { label: "Items Returned", value: 1240, suffix: "+", color: "from-emerald-400 to-emerald-600", icon: "🤝" },
        { label: "Recovery Rate", value: 94, suffix: "%", color: "from-blue-400 to-blue-600", icon: "📈" },
        { label: "Community Heroes", value: 850, suffix: "", color: "from-purple-400 to-purple-600", icon: "🦸" },
        { label: "Value Saved", value: 45, prefix: "₹", suffix: "k+", color: "from-amber-400 to-orange-600", icon: "💰" },
    ];

    return (
        <div className="relative py-12">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-surface-100/50 to-white/50 dark:from-surface-900/50 dark:to-surface-800/50 backdrop-blur-3xl rounded-[3rem] -z-10 border border-white/20 dark:border-white/5 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 animate-pulse-slow animation-delay-4000"></div>
            </div>

            <div className="px-6 md:px-12 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-surface-900 via-surface-700 to-surface-900 dark:from-white dark:via-surface-200 dark:to-white tracking-tight mb-4">
                        Our Impact
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 text-lg font-medium max-w-2xl mx-auto">
                        Together, we're building a world where nothing is truly lost. See the difference our community makes every day.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} delay={index * 100} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function StatCard({ stat, delay }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = stat.value;
        const duration = 2000;
        const increment = end / (duration / 16); // 60fps

        let timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [stat.value]);

    return (
        <div
            className="group relative p-6 rounded-3xl bg-white/40 dark:bg-surface-800/40 border border-white/50 dark:border-white/10 backdrop-blur-md shadow-lg hover:-translate-y-2 transition-transform duration-500 overflow-hidden"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            <div className="absolute -right-6 -bottom-6 text-8xl opacity-5 dark:opacity-[0.02] group-hover:scale-110 transition-transform duration-500 select-none">
                {stat.icon}
            </div>

            <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-2 filter drop-shadow-sm">{stat.icon}</div>
                <div className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br ${stat.color} mb-2 tracking-tight`}>
                    {stat.prefix}{count}{stat.suffix}
                </div>
                <div className="text-surface-600 dark:text-surface-300 font-bold uppercase tracking-widest text-xs">
                    {stat.label}
                </div>
            </div>
        </div>
    );
}
