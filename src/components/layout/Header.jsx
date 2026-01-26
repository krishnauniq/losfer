import React, { useState, useEffect } from "react";
import GlobalSearch from "../search/GlobalSearch";
import { useAuth } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase"; // Import db
import { collection, query, where, onSnapshot } from "firebase/firestore"; // Import Firestore functions
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import NotificationsDropdown from "../notifications/NotificationsDropdown";
import UserProfileModal from "../modals/UserProfileModal";
import logo from "../../assets/logo.png";

export default function Header({ onMenuClick }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // Listen for unread notifications for badge
    useEffect(() => {
        if (!user) return;

        let unsubscribe = () => { };

        try {
            const q = query(
                collection(db, "notifications"),
                where("recipientId", "==", user.uid),
                where("read", "==", false)
            );

            unsubscribe = onSnapshot(q, (snapshot) => {
                setUnreadCount(snapshot.size);
            }, (error) => {
                console.error("Badge fetch error:", error);
            });
        } catch (e) {
            console.error("Error setting up badge listener", e);
        }

        return () => unsubscribe();
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <header className="bg-white dark:bg-surface-50 border-b border-surface-300 dark:border-surface-300 h-16 flex items-center justify-between px-6 sticky top-0 z-30 transition-colors duration-200">
            {/* ... (rest of header) */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-surface-500 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800 rounded-lg transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Logo" className="h-8 w-auto" />
                    <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-500">
                        LOSFER
                    </span>
                </div>
            </div>

            {/* Smart Search Bar */}
            <GlobalSearch />

            <div className="flex items-center gap-4">
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`relative p - 2 rounded - full transition - colors ${showNotifications ? 'bg-surface-100 text-primary-600' : 'text-surface-500 hover:bg-surface-50'} `}
                    >
                        🔔
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-error-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border border-white">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>
                    {showNotifications && (
                        <NotificationsDropdown onClose={() => setShowNotifications(false)} />
                    )}
                </div>

                <div className="h-6 w-px bg-surface-200"></div>

                <div className="flex items-center gap-3">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setShowProfile(true)}
                    >
                        <div className="hidden md:block text-right group-hover:opacity-80 transition-opacity">
                            <p className="text-sm font-bold text-surface-900 dark:text-surface-100 leading-tight">
                                {user?.displayName || user?.email?.split('@')[0] || "Student User"}
                            </p>
                            <p className="text-xs text-surface-500 font-medium">
                                {user?.email || "Verify Account"}
                            </p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 p-0.5 shadow-md">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="User" className="h-full w-full rounded-full object-cover border-2 border-white dark:border-surface-900" />
                            ) : (
                                <div className="h-full w-full rounded-full bg-surface-50 dark:bg-surface-800 flex items-center justify-center border-2 border-white dark:border-surface-900">
                                    <span className="font-bold text-primary-700 dark:text-primary-400 text-sm">
                                        {(user?.displayName || user?.email || "U").charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Button variant="ghost" size="sm" onClick={handleLogout} className="!text-surface-500 hover:!text-error-600 ml-2 hidden md:flex">
                    Logout
                </Button>
            </div>

            <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
        </header>
    );
}
