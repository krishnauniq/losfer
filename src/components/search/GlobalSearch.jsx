import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    const categories = [
        { label: "Phone", icon: "📱", id: "Electronics" },
        { label: "Bag", icon: "🎒", id: "Accessories" },
        { label: "Keys", icon: "🔑", id: "Keys" },
        { label: "Docs", icon: "📄", id: "Documents" },
        { label: "Wallet", icon: "👛", id: "Wallet" },
    ];

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        setRecentSearches(saved);

        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (searchTerm) => {
        if (!searchTerm.trim()) return;

        // Save to recent
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));

        setIsOpen(false);
        navigate(`/app/feed?q=${encodeURIComponent(searchTerm)}`);
    };

    const clearHistory = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(query);
            inputRef.current.blur();
        }
    };

    return (
        <div className="relative w-full max-w-xl mx-auto hidden md:block" ref={wrapperRef}>
            <div className="relative group">
                <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${isOpen || query ? 'text-primary-500' : 'text-surface-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    ref={inputRef}
                    type="text"
                    className={`
            w-full pl-11 pr-4 py-3 bg-surface-50 dark:bg-surface-800/50 border rounded-2xl 
            text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500
            focus:outline-none focus:ring-4 focus:ring-primary-500/10 transition-all duration-300
            ${isOpen ? 'border-primary-500 shadow-lg shadow-primary-500/10' : 'border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'}
          `}
                    placeholder="Search lost & found items… (e.g. blue bag, iPhone)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                    <kbd className="hidden group-hover:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-surface-400 bg-surface-100 dark:bg-surface-700/50 rounded border border-surface-200 dark:border-surface-700">
                        ⌘ K
                    </kbd>
                </div>
            </div>

            {/* Smart Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-700 shadow-2xl backdrop-blur-xl animate-fade-in-down overflow-hidden z-50">

                    {/* Quick Categories */}
                    <div className="p-4 border-b border-surface-100 dark:border-surface-800">
                        <h3 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-3">Quick Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleSearch(cat.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300 rounded-full text-xs font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 border border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-all"
                                >
                                    <span>{cat.icon}</span> {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recent Searches / Suggestions */}
                    <div className="p-2">
                        {recentSearches.length > 0 ? (
                            <>
                                <h3 className="px-3 pt-2 text-xs font-bold text-surface-400 uppercase tracking-wider">Recent</h3>
                                <ul className="mt-1">
                                    {recentSearches.map((term, idx) => (
                                        <li key={idx}>
                                            <button
                                                onClick={() => handleSearch(term)}
                                                className="w-full text-left px-3 py-2.5 flex items-center gap-3 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 group transition-colors"
                                            >
                                                <span className="text-surface-300 group-hover:text-primary-500 transition-colors">🕒</span>
                                                <span className="text-surface-700 dark:text-surface-200 font-medium">{term}</span>
                                                <span className="ml-auto text-xs text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity">Jump to</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <div className="p-4 text-center text-surface-400 text-sm">
                                No recent searches
                            </div>
                        )}
                    </div>

                    {recentSearches.length > 0 && (
                        <div className="bg-surface-50 dark:bg-surface-950 p-2 text-center border-t border-surface-100 dark:border-surface-800 transition-all">
                            <button
                                onClick={clearHistory}
                                className="text-[10px] font-bold text-error-500 hover:text-error-600 tracking-wider uppercase flex items-center justify-center gap-2 w-full py-1"
                            >
                                <span>🗑️</span> Clear History
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
