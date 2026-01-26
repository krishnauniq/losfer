import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/90 dark:bg-surface-50/90 backdrop-blur-md shadow-sm border-b border-surface-200 dark:border-surface-800 py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img src={logo} alt="Losfer" className="h-10 w-auto group-hover:scale-105 transition-transform drop-shadow-lg" />
                    <span className={`text-2xl font-display font-bold tracking-tight ${isScrolled ? 'text-surface-900' : 'text-white'}`}>
                        LOSFER
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className={`font-medium hover:text-primary-500 transition-colors ${isScrolled ? 'text-surface-600' : 'text-white/90'}`}>
                        Home
                    </Link>
                    <button
                        onClick={() => document.getElementById('browse-section').scrollIntoView({ behavior: 'smooth' })}
                        className={`font-medium hover:text-primary-500 transition-colors ${isScrolled ? 'text-surface-600' : 'text-white/90'}`}
                    >
                        Browse
                    </button>
                    <Link to="/app" className={`font-medium hover:text-primary-500 transition-colors ${isScrolled ? 'text-surface-600' : 'text-white/90'}`}>
                        My Dashboard
                    </Link>

                    <button
                        onClick={() => navigate('/login')}
                        className={`px-6 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg ${isScrolled
                            ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-primary-600/30'
                            : 'bg-white text-primary-600 hover:bg-surface-50'
                            }`}
                    >
                        LIST ITEM
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <div className={`space-y-1.5 ${isScrolled ? 'text-surface-900' : 'text-white'}`}>
                        <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-current transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-surface-50 border-b border-surface-200 dark:border-surface-800 shadow-xl transition-all duration-300 origin-top ${isMobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
                <div className="p-6 flex flex-col gap-4">
                    <Link to="/" className="text-surface-600 font-medium py-2">Home</Link>
                    <Link to="/browse" className="text-surface-600 font-medium py-2">Browse</Link>
                    <Link to="/app" className="text-surface-600 font-medium py-2">My Dashboard</Link>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg font-bold"
                    >
                        LIST ITEM
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
