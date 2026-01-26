import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc, writeBatch } from "firebase/firestore";
import { db, auth } from "../../firebase";
import Card from '../ui/Card';

export default function NotificationsDropdown({ onClose }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "notifications"),
            where("recipientId", "==", user.uid)
            // orderBy("createdAt", "desc") // Removed to avoid index issues for now
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Client-side sort to be safe
            notifs.sort((a, b) => {
                const tA = a.createdAt?.seconds || 0;
                const tB = b.createdAt?.seconds || 0;
                return tB - tA;
            });

            setNotifications(notifs);
            setLoading(false);
        }, (error) => {
            console.error("Notifications fetch error:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const markAsRead = async (notifId) => {
        try {
            await updateDoc(doc(db, "notifications", notifId), { read: true });
        } catch (e) {
            console.error("Error marking read:", e);
        }
    };

    const markAllRead = async () => {
        try {
            const batch = writeBatch(db);
            notifications.filter(n => !n.read).forEach(n => {
                const ref = doc(db, "notifications", n.id);
                batch.update(ref, { read: true });
            });
            await batch.commit();
        } catch (e) {
            console.error("Error marking all read:", e);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diff = Date.now() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    return (
        <Card noPadding className="absolute top-full right-0 mt-2 w-80 md:w-96 z-50 shadow-xl border-surface-200 dark:border-surface-700 overflow-hidden animate-fade-in">
            <div className="p-4 border-b border-surface-100 dark:border-surface-800 flex justify-between items-center bg-white dark:bg-surface-900">
                <h3 className="font-semibold text-surface-900 dark:text-surface-100">Notifications</h3>
                <span
                    onClick={markAllRead}
                    className="text-xs text-primary-600 font-medium cursor-pointer hover:underline"
                >
                    Mark all as read
                </span>
            </div>
            <div className="max-h-96 overflow-y-auto bg-white dark:bg-surface-900">
                {loading ? (
                    <div className="p-8 text-center text-surface-400 text-sm">Loading...</div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-surface-500 text-sm">No new notifications</div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`p-4 border-b border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer ${!notif.read ? 'bg-primary-50/30 dark:bg-primary-900/20' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-xs font-bold ${!notif.read ? 'text-primary-700 dark:text-primary-400' : 'text-surface-600 dark:text-surface-400'}`}>
                                    {notif.title}
                                </span>
                                <span className="text-[10px] text-surface-400">{formatTime(notif.createdAt)}</span>
                            </div>
                            <p className="text-sm text-surface-600 dark:text-surface-300 line-clamp-2">{notif.message}</p>
                        </div>
                    ))
                )}
            </div>
            <div className="p-3 bg-surface-50 dark:bg-surface-950 border-t border-surface-200 dark:border-surface-800 text-center">
                <button className="text-sm text-surface-600 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors">
                    View All Notifications
                </button>
            </div>
        </Card>
    );
}
