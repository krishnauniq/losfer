import React, { useState } from 'react';

const SmartSearch = () => {
    const [what, setWhat] = useState('');
    const [where, setWhere] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', { what, where });
        // In a real app, this would trigger a filter or redirect to browse page with params
    };

    return (
        <div className="relative z-20 -mt-24 px-6 mb-16">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-slide-up">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full space-y-2">
                            <label htmlFor="what" className="block text-sm font-semibold text-surface-700 ml-1">
                                What are you looking for?
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="what"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                                    placeholder="e.g. iPhone 13, Blue Backpack, Keys..."
                                    value={what}
                                    onChange={(e) => setWhat(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-2">
                            <label htmlFor="where" className="block text-sm font-semibold text-surface-700 ml-1">
                                Where did you lose/find it?
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-surface-400 group-focus-within:text-primary-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="where"
                                    className="block w-full pl-11 pr-4 py-3.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                                    placeholder="e.g. Library, Cafeteria, C Block..."
                                    value={where}
                                    onChange={(e) => setWhere(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <span>Find</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </form>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm text-surface-500">
                        <span className="font-semibold text-primary-600">Popular:</span>
                        <button onClick={() => setWhat('AirPods')} className="hover:text-primary-600 hover:underline">AirPods</button>
                        <span>•</span>
                        <button onClick={() => setWhat('ID Card')} className="hover:text-primary-600 hover:underline">ID Card</button>
                        <span>•</span>
                        <button onClick={() => setWhere('Library')} className="hover:text-primary-600 hover:underline">Library</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmartSearch;
