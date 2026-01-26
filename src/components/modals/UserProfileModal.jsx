import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

export default function UserProfileModal({ isOpen, onClose }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ posted: 0, claimed: 0 });
    const [loadingStats, setLoadingStats] = useState(false);

    // Get display values
    const displayName = user?.displayName || user?.email?.split('@')[0] || "Student User";
    const displayEmail = user?.email || "student@university.edu";
    const initial = displayName.charAt(0).toUpperCase();

    useEffect(() => {
        if (isOpen && user) {
            const fetchStats = async () => {
                setLoadingStats(true);
                try {
                    // Count Posted Items
                    const postedQuery = query(collection(db, "items"), where("uid", "==", user.uid));
                    const postedSnapshot = await getDocs(postedQuery);

                    // Count Claimed Items
                    const claimedQuery = query(collection(db, "items"), where("claimantId", "==", user.uid));
                    const claimedSnapshot = await getDocs(claimedQuery);

                    setStats({
                        posted: postedSnapshot.size,
                        claimed: claimedSnapshot.size
                    });
                } catch (error) {
                    console.error("Error fetching user stats:", error);
                } finally {
                    setLoadingStats(false);
                }
            };
            fetchStats();
        }
    }, [isOpen, user]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="User Profile">
            <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary-400 to-secondary-400 p-1 flex items-center justify-center shadow-lg ring-4 ring-surface-50">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="User" className="h-full w-full rounded-full object-cover border-2 border-white" />
                    ) : (
                        <div className="h-full w-full rounded-full bg-surface-50 flex items-center justify-center border-2 border-white">
                            <span className="font-bold text-primary-600 text-3xl">{initial}</span>
                        </div>
                    )}
                </div>
                <h3 className="text-xl font-bold text-surface-900 mt-3">{displayName}</h3>
                <p className="text-surface-500 text-sm">{displayEmail}</p>
                <div className="mt-2">
                    <Badge variant="success">Verified Student</Badge>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-50 p-3 rounded-lg text-center border border-surface-200">
                    <span className="block text-2xl font-bold text-primary-600">
                        {loadingStats ? "..." : stats.posted}
                    </span>
                    <span className="text-xs text-surface-500 uppercase tracking-wide font-semibold">Items Posted</span>
                </div>
                <div className="bg-surface-50 p-3 rounded-lg text-center border border-surface-200">
                    <span className="block text-2xl font-bold text-secondary-600">
                        {loadingStats ? "..." : stats.claimed}
                    </span>
                    <span className="text-xs text-surface-500 uppercase tracking-wide font-semibold">Items Claimed</span>
                </div>
            </div>

            <div className="space-y-3">
                <Button
                    variant="outline"
                    className="w-full justify-center"
                    onClick={() => {
                        onClose();
                        navigate('/app/settings');
                    }}
                >
                    Edit Profile
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-center text-surface-500"
                    onClick={() => {
                        onClose();
                        navigate('/app/settings');
                    }}
                >
                    Account Settings
                </Button>
            </div>
        </Modal>
    );
}
