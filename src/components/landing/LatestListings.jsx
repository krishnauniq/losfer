import React from 'react';
import { useNavigate } from 'react-router-dom';

const dummyListings = [
    {
        id: 1,
        title: 'Blue Nike Backpack',
        type: 'lost',
        location: 'Library, 2F',
        time: '2h ago',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        color: 'bg-blue-500'
    },
    {
        id: 2,
        title: 'iPhone 13 Pro',
        type: 'found',
        location: 'Cafeteria',
        time: '4h ago',
        image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
        color: 'bg-indigo-500'
    },
    {
        id: 3,
        title: 'Silver Hydro Flask',
        type: 'lost',
        location: 'Gym',
        time: '1d ago',
        image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
        color: 'bg-orange-500'
    },
    {
        id: 4,
        title: 'Calculus Textbook',
        type: 'found',
        location: 'C Block',
        time: '2d ago',
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
        color: 'bg-teal-500'
    }
];

const LatestListings = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-surface-200 dark:via-surface-800 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-5xl font-black text-surface-900 tracking-tighter mb-4">
                            Freshly <span className="underline decoration-wavy decoration-emerald-400 underline-offset-4 decoration-4">Spotted</span>
                        </h2>
                        <p className="text-lg text-surface-500">Live updates from the campus lost & found network.</p>
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="group flex items-center gap-3 px-8 py-4 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-full font-bold shadow-2xl hover:scale-105 transition-transform"
                    >
                        View Full Feed
                        <span className="bg-white/20 dark:bg-black/10 rounded-full p-1 group-hover:rotate-45 transition-transform">
                            <svg h="16" w="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
                        </span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {dummyListings.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate('/login')}
                            className="group relative h-[400px] rounded-[2.5rem] cursor-pointer"
                        >
                            {/* Background Card (Rotation Effect) */}
                            <div className={`absolute inset-0 rounded-[2.5rem] ${item.color} opacity-0 group-hover:opacity-100 rotate-0 group-hover:rotate-6 transition-all duration-500 ease-out translate-y-4 group-hover:translate-y-0`}></div>

                            {/* Main Card */}
                            <div className="absolute inset-0 bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl transition-transform duration-500 group-hover:-translate-y-2 group-hover:-translate-x-1">
                                {/* Image Half */}
                                <div className="h-3/5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10"></div>
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className={`w-3 h-3 rounded-full ${item.type === 'found' ? 'bg-emerald-400 box-shadow-glow-emerald' : 'bg-rose-400 box-shadow-glow-rose'} animate-pulse`}></div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="text-white font-bold text-xs tracking-widest uppercase bg-black/30 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">
                                            {item.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Text Half */}
                                <div className="h-2/5 p-6 flex flex-col justify-between bg-white relative">
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-900 line-clamp-1 mb-1">{item.title}</h3>
                                        <p className="text-slate-400 text-sm flex items-center gap-1">
                                            <svg h="14" w="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                            {item.location}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <span className="text-xs font-bold text-slate-400">{item.time}</span>
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${item.color} shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300`}>
                                            ➜
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestListings;
