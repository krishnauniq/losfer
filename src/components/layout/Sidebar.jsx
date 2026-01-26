import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GuidelinesModal from "../modals/GuidelinesModal";

export default function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [showGuidelines, setShowGuidelines] = useState(false);

    const navItems = [
        { name: "Dashboard", path: "/app", icon: "📊" },
        { name: "Item Feed", path: "/app/feed", icon: "🔍" },
        { name: "My Activity", path: "/app/activity", icon: "👤" },
        { name: "Settings", path: "/app/settings", icon: "⚙️" },
    ];

    return (
        <>
            {/* Backdrop for mobile/drawer mode */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sliding Sidebar */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-screen w-72 bg-surface-50 border-r border-surface-300 
                    transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <div className="p-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 tracking-tight">
                            LOSFER
                        </h1>
                        <p className="text-xs text-surface-500 mt-1 font-medium">Campus Lost & Found</p>
                    </div>
                    {/* Close button for cleaner UI on small screens */}
                    <button onClick={onClose} className="p-2 text-surface-400 hover:text-surface-600">
                        ✕
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose()} // Close on navigation
                            className={`
                                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                                ${isActive(item.path)
                                    ? "bg-primary-50 text-primary-700"
                                    : "text-surface-600 hover:bg-surface-100 hover:text-surface-900"}
                            `}
                        >
                            <span className="mr-3 text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-surface-300">
                    <div className="bg-surface-100 rounded-lg p-4">
                        <h4 className="text-xs font-bold text-surface-900 mb-1">Need Help?</h4>
                        <p className="text-xs text-surface-500 mb-3">Contact campus security for urgent matters.</p>
                        <button
                            onClick={() => setShowGuidelines(true)}
                            className="text-xs text-primary-600 font-bold hover:underline"
                        >
                            View Guidelines
                        </button>
                    </div>
                </div>
            </aside>
            <GuidelinesModal isOpen={showGuidelines} onClose={() => setShowGuidelines(false)} />
        </>
    );
}
