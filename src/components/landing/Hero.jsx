import React from 'react';
import { useNavigate } from 'react-router-dom';
// We will import the image after moving it to the assets folder or referencing it.
// For now assuming it is in assets.
// import heroBg from '../../assets/campus-hero.png'; 

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/assets/campus-hero.png"
                    alt="Campus Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/70 to-transparent"></div>
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-start justify-center h-full w-full pt-20">
                <div className="max-w-2xl animate-fade-in space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                        Built Exclusively for GCET Students
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight tracking-tight drop-shadow-lg">
                        Find What’s Lost. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-white">
                            Return What’s Found.
                        </span>
                    </h1>

                    <p className="text-xl text-primary-100 max-w-lg leading-relaxed font-light">
                        The official Lost & Found platform for our campus. Secure, fast, and community-driven.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="group relative overflow-hidden rounded-full py-4 px-8 bg-white text-primary-900 font-bold shadow-xl transition-all hover:shadow-2xl hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Create Listing
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </span>
                        </button>

                        <button
                            onClick={() => document.getElementById('browse-section')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 rounded-full border border-white/30 bg-white/5 backdrop-blur-sm text-white font-semibold hover:bg-white/10 transition-all"
                        >
                            Browse Items
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
};

export default Hero;
