import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
    { name: 'Phones', icon: '📱', gradient: 'from-blue-400 to-cyan-300' },
    { name: 'Laptops', icon: '💻', gradient: 'from-purple-400 to-pink-300' },
    { name: 'Keys', icon: '🔑', gradient: 'from-amber-400 to-orange-300' },
    { name: 'Wallets', icon: '👛', gradient: 'from-emerald-400 to-teal-300' },
    { name: 'Bags', icon: '🎒', gradient: 'from-rose-400 to-red-300' },
    { name: 'IDs', icon: '🪪', gradient: 'from-indigo-400 to-violet-300' },
    { name: 'Accessories', icon: '🕶️', gradient: 'from-fuchsia-400 to-purple-300' },
    { name: 'Other', icon: '📦', gradient: 'from-slate-400 to-gray-300' }
];

const CategoryGrid = () => {
    const navigate = useNavigate();
    return (
        <section id="browse-section" className="relative py-24 overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute inset-0 bg-surface-50 dark:bg-surface-950 -z-20"></div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16 relative">
                    <span className="inline-block py-1 px-3 rounded-full bg-surface-100 dark:bg-surface-800 text-primary-600 font-bold text-xs tracking-widest uppercase mb-4 border border-surface-200 dark:border-surface-700">Exploration</span>
                    <h2 className="text-5xl md:text-6xl font-black text-surface-900 tracking-tight mb-4">
                        What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">looking for?</span>
                    </h2>
                    <p className="text-xl text-surface-500 max-w-2xl mx-auto">
                        Dive into our categorized listings to find exactly what you lost.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <button
                            key={category.name}
                            onClick={() => navigate('/login')}
                            className="group relative h-48 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:-translate-y-2"
                        >
                            {/* Card Background with Blur */}
                            <div className="absolute inset-0 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 transition-colors group-hover:bg-white/60 dark:group-hover:bg-white/10"></div>

                            {/* Gradient Orb */}
                            <div className={`absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${category.gradient} blur-2xl opacity-40 group-hover:opacity-70 group-hover:scale-150 transition-all duration-700`}></div>

                            <div className="relative h-full flex flex-col items-center justify-center z-10 p-6">
                                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                                    {category.icon}
                                </div>
                                <span className="font-bold text-lg text-surface-800 dark:text-white group-hover:tracking-wider transition-all">
                                    {category.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
