import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { useTheme } from '../context/ThemeContext';
import { auth } from '../firebase';
import { updateProfile, updatePassword, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import { termsContent, privacyContent, licensesContent } from '../utils/legalContent';

// Simple internal modal for settings content
const InfoModal = ({ isOpen, onClose, title, content }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-surface-200 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-surface-900">{title}</h3>
                    <button onClick={onClose} className="text-surface-500 hover:text-surface-900">✕</button>
                </div>
                <div className="p-6 overflow-y-auto whitespace-pre-wrap text-surface-600 leading-relaxed">
                    {content}
                </div>
                <div className="p-4 border-t border-surface-200 bg-surface-50 rounded-b-2xl flex justify-end">
                    <Button onClick={onClose}>Close</Button>
                </div>
            </div>
        </div>
    );
};

export default function Settings() {
    // eslint-disable-next-line no-unused-vars
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Modal State
    const [infoModal, setInfoModal] = useState({ open: false, title: '', content: '' });

    // Dynamic Profile State
    const [profileData, setProfileData] = useState({
        displayName: auth.currentUser?.displayName || '',
        email: auth.currentUser?.email || '',
        photoURL: auth.currentUser?.photoURL || '',
    });

    // Password State
    const [passwords, setPasswords] = useState({ new: '', confirm: '' });

    // Notification State (Persistent)
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('losfer_notif_prefs');
        return saved ? JSON.parse(saved) : {
            email: true,
            push: true,
            newsletter: false,
            security: true
        };
    });

    // Bug Report State
    const [bugReport, setBugReport] = useState('');

    useEffect(() => {
        localStorage.setItem('losfer_notif_prefs', JSON.stringify(notifications));
    }, [notifications]);

    // Options Grid Data
    const options = [
        { id: 'profile', icon: '👤', title: 'Edit Profile', desc: 'Name, Avatar, Bio', color: 'bg-indigo-100 text-indigo-600' },
        { id: 'notifications', icon: '🔔', title: 'Notifications', desc: 'Email & Push Alerts', color: 'bg-amber-100 text-amber-600' },
        { id: 'security', icon: '🔒', title: 'Security', desc: 'Password & 2FA', color: 'bg-emerald-100 text-emerald-600' },
        { id: 'privacy', icon: '👁️', title: 'Privacy', desc: 'Data Visibility', color: 'bg-rose-100 text-rose-600' },
        { id: 'help', icon: '❓', title: 'Help & Support', desc: 'FAQ & Contact', color: 'bg-cyan-100 text-cyan-600' },
        { id: 'about', icon: 'ℹ️', title: 'About Losfer', desc: 'Version 2.0.0', color: 'bg-slate-100 text-slate-600' },
        { id: 'data', icon: '💾', title: 'Your Data', desc: 'Download / Delete', color: 'bg-orange-100 text-orange-600' },
        { id: 'logout', icon: '🚪', title: 'Log Out', desc: 'Sign out of device', color: 'bg-red-100 text-red-600' },
    ];

    // -- Handlers --

    const handleUpdateProfile = async () => {
        setIsLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: profileData.displayName,
                photoURL: profileData.photoURL
            });
            alert("Profile Updated Successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to update profile: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            alert("Passwords do not match!");
            return;
        }
        if (passwords.new.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            await updatePassword(auth.currentUser, passwords.new);
            alert("Password updated successfully!");
            setPasswords({ new: '', confirm: '' });
        } catch (error) {
            console.error(error);
            alert("Failed to update password: " + error.message + " (Re-login required for security)");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportDataPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("LOSFER User Data Report", 20, 20);

        doc.setFontSize(12);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
        doc.text(`User ID: ${auth.currentUser.uid}`, 20, 36);

        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);

        doc.setFontSize(16);
        doc.text("Profile Information", 20, 55);

        doc.setFontSize(12);
        doc.text(`Name: ${profileData.displayName}`, 20, 65);
        doc.text(`Email: ${profileData.email}`, 20, 72);
        doc.text(`Photo URL: ${profileData.photoURL || 'N/A'}`, 20, 79);

        doc.setFontSize(16);
        doc.text("Preferences", 20, 95);

        doc.setFontSize(12);
        let yPos = 105;
        Object.entries(notifications).forEach(([key, value]) => {
            doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value ? 'Enabled' : 'Disabled'}`, 20, yPos);
            yPos += 7;
        });

        doc.setFontSize(10);
        doc.text("This document contains confidental personal information.", 20, 280);

        doc.save(`losfer-data-${auth.currentUser.uid}.pdf`);
        alert("PDF Report downloaded!");
    };

    const handleDeleteAccount = async () => {
        const confirm1 = window.confirm("Are you SURE? This will permanently delete your account and cannot be undone.");
        if (!confirm1) return;

        const confirm2 = window.prompt("Type 'DELETE' to confirm account deletion:");
        if (confirm2 !== 'DELETE') return;

        setIsLoading(true);
        try {
            await deleteUser(auth.currentUser);
            navigate('/');
            alert("Account deleted.");
        } catch (error) {
            console.error(error);
            alert("Failed to delete account: " + error.message + " (Re-login required for security)");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBugSubmit = () => {
        if (!bugReport.trim()) return;
        // In a real app, send to database
        console.log("Bug Report:", bugReport);
        alert("Bug report submitted! Thank you for helping improve Losfer.");
        setBugReport('');
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleOptionClick = (id) => {
        if (id === 'logout') {
            if (window.confirm("Are you sure you want to log out?")) {
                auth.signOut();
                navigate('/');
            }
            return;
        }
        setActiveSection(activeSection === id ? null : id);
    };

    const openInfoModal = (title, content) => {
        setInfoModal({ open: true, title, content });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in relative">
            <InfoModal
                isOpen={infoModal.open}
                onClose={() => setInfoModal({ ...infoModal, open: false })}
                title={infoModal.title}
                content={infoModal.content}
            />

            {/* Header */}
            <div className="text-center md:text-left px-4">
                <h1 className="text-2xl md:text-4xl font-black text-surface-900 mb-2">Settings Center</h1>
                <p className="text-surface-500 max-w-xl text-sm md:text-base">
                    Manage your preferences, update your digital identity, and configure your Losfer experience.
                </p>
            </div>

            {/* Dynamic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
                {options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleOptionClick(opt.id)}
                        className={`text-left p-5 md:p-6 rounded-3xl border transition-all duration-300 hover:shadow-xl group relative overflow-hidden ${activeSection === opt.id
                            ? 'bg-white border-primary-500 ring-2 ring-primary-500/20 shadow-2xl scale-[1.02] z-10'
                            : 'bg-surface-50 border-surface-200 hover:-translate-y-1'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-xl md:text-2xl ${opt.color}`}>
                                {opt.icon}
                            </div>
                            {activeSection === opt.id && <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-1 rounded-full animate-fade-in">Active</span>}
                        </div>
                        <h3 className="font-bold text-base md:text-lg text-surface-900 mb-1 relative z-10">{opt.title}</h3>
                        <p className="text-xs md:text-sm text-surface-500 relative z-10">{opt.desc}</p>

                        {/* Hover Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    </button>
                ))}
            </div>

            {/* Dynamic Detail Sections */}
            {activeSection && (
                <div className="animate-slide-up px-4 md:px-0">
                    <Card className="rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-2xl border-t-4 border-primary-500 relative overflow-hidden bg-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

                        {/* PROFILE SETTINGS */}
                        {activeSection === 'profile' && (
                            <div className="max-w-2xl">
                                <h2 className="text-xl md:text-3xl font-black mb-6 flex items-center gap-3 text-surface-900">
                                    <span className="text-2xl md:text-4xl">👤</span> Edit Profile
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex flex-col md:flex-row gap-6 items-center">
                                        <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center text-4xl overflow-hidden border-4 border-white shadow-lg">
                                            {profileData.photoURL ? <img src={profileData.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : '😎'}
                                        </div>
                                        <div className="space-y-2 text-center md:text-left">
                                            <Input
                                                label="Avatar URL (Optional)"
                                                value={profileData.photoURL}
                                                onChange={(e) => setProfileData({ ...profileData, photoURL: e.target.value })}
                                                placeholder="https://..."
                                            />
                                            <p className="text-xs text-surface-500">Paste an image URL to update your look.</p>
                                        </div>
                                    </div>

                                    <Input
                                        label="Display Name"
                                        value={profileData.displayName}
                                        onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                        className="text-lg font-bold"
                                    />
                                    <Input
                                        label="Email Address (Locked)"
                                        value={profileData.email}
                                        disabled
                                        className="opacity-60 bg-surface-100"
                                    />

                                    <div className="pt-4 flex gap-4">
                                        <Button onClick={handleUpdateProfile} isLoading={isLoading}>Save Changes</Button>
                                        <Button variant="ghost" onClick={() => setActiveSection(null)}>Cancel</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS SETTINGS */}
                        {activeSection === 'notifications' && (
                            <div className="max-w-2xl">
                                <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-amber-700">
                                    <span className="text-4xl">🔔</span> Notifications
                                </h2>
                                <p className="mb-6 text-surface-600">Choose how you want to be notified about activity.</p>
                                <div className="space-y-4">
                                    {[
                                        { k: 'email', l: 'Email Alerts for Found Items' },
                                        { k: 'push', l: 'Push Notifications' },
                                        { k: 'newsletter', l: 'Weekly Newsletter' },
                                        { k: 'security', l: 'Security Alerts' }
                                    ].map(item => (
                                        <div key={item.k} className="flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-surface-200">
                                            <span className="font-bold text-surface-700">{item.l}</span>
                                            <div
                                                onClick={() => toggleNotification(item.k)}
                                                className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${notifications[item.k] ? 'bg-primary-600' : 'bg-surface-300'}`}
                                            >
                                                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${notifications[item.k] ? 'right-0.5' : 'left-0.5'}`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SECURITY SETTINGS */}
                        {activeSection === 'security' && (
                            <div className="max-w-2xl">
                                <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-emerald-700">
                                    <span className="text-4xl">🔒</span> Security
                                </h2>
                                <div className="space-y-6">
                                    <div className="p-6 bg-surface-50 rounded-2xl border border-surface-200">
                                        <h4 className="font-bold text-lg mb-4">Change Password</h4>
                                        <div className="space-y-4">
                                            <Input
                                                type="password"
                                                placeholder="New Password"
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                            />
                                            <Input
                                                type="password"
                                                placeholder="Confirm New Password"
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                            />
                                            <Button variant="outline" onClick={handleUpdatePassword} isLoading={isLoading}>Update Password</Button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                        <div>
                                            <h4 className="font-bold text-emerald-900">Two-Factor Authentication</h4>
                                            <p className="text-sm text-emerald-700">Add an extra layer of security.</p>
                                        </div>
                                        <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700" onClick={() => alert("2FA setup coming soon!")}>Enable</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* PRIVACY SETTINGS */}
                        {activeSection === 'privacy' && (
                            <div className="max-w-2xl">
                                <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-rose-700">
                                    <span className="text-4xl">👁️</span> Privacy
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-surface-200">
                                        <div>
                                            <h4 className="font-bold text-surface-800">Profile Visibility</h4>
                                            <p className="text-sm text-surface-500">Control who can see your profile.</p>
                                        </div>
                                        <select className="bg-white border border-surface-300 rounded-lg p-2 text-sm font-bold">
                                            <option>Public</option>
                                            <option>University Only</option>
                                            <option>Private</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl border border-surface-200">
                                        <div>
                                            <h4 className="font-bold text-surface-800">Show Online Status</h4>
                                        </div>
                                        <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                                            <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* HELP SETTINGS */}
                        {activeSection === 'help' && (
                            <div className="max-w-3xl">
                                <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-cyan-700">
                                    <span className="text-4xl">❓</span> Help & Support
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6 mb-8">
                                    {/* FAQs Accordion */}
                                    <div className="space-y-3">
                                        <h4 className="font-bold text-lg text-cyan-900 mb-2">Frequently Asked Questions</h4>
                                        <details className="bg-cyan-50 p-4 rounded-xl cursor-pointer">
                                            <summary className="font-bold text-cyan-800">How do I verify a claim?</summary>
                                            <p className="text-sm text-cyan-700 mt-2">Ask the claimant for a description of unique marks or use the built-in QR scanner if they have an ID.</p>
                                        </details>
                                        <details className="bg-cyan-50 p-4 rounded-xl cursor-pointer">
                                            <summary className="font-bold text-cyan-800">Is my data shared?</summary>
                                            <p className="text-sm text-cyan-700 mt-2">We only share necessary contact details when a claim is verified. See Privacy Policy for more.</p>
                                        </details>
                                        <details className="bg-cyan-50 p-4 rounded-xl cursor-pointer">
                                            <summary className="font-bold text-cyan-800">How to increase rank?</summary>
                                            <p className="text-sm text-cyan-700 mt-2">Post real items and help others recover theirs. Your 'Karma' score increases with every verified return.</p>
                                        </details>
                                    </div>

                                    {/* Contact Card */}
                                    <div className="group relative overflow-hidden rounded-2xl shadow-2xl transition-transform hover:scale-[1.02] duration-300">
                                        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-600 to-indigo-800 animate-gradient-xy"></div>
                                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
                                        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-black/20 rounded-full blur-xl"></div>

                                        <div className="relative z-10 p-8 text-white">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <h4 className="font-black text-2xl tracking-tight">Need Help?</h4>
                                                    <p className="text-violet-100 text-sm font-medium opacity-90">We're here for you 24/7.</p>
                                                </div>
                                                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shadow-inner">
                                                    <span className="text-2xl">💬</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <a href="mailto:campuslosfer@gmail.com" className="flex items-center gap-4 p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all group-item">
                                                    <div className="bg-white/20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                        <span className="text-lg">📧</span>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-violet-200 uppercase tracking-wider font-bold">Email Us</p>
                                                        <p className="font-bold text-lg tracking-wide">campuslosfer@gmail.com</p>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bug Report */}
                                <div className="bg-surface-50 p-6 rounded-2xl border border-surface-200">
                                    <h4 className="font-bold text-lg text-surface-900 mb-3">Report a Bug</h4>
                                    <textarea
                                        className="w-full p-4 rounded-xl border border-surface-300 focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-32 text-sm"
                                        placeholder="Describe the issue you faced..."
                                        value={bugReport}
                                        onChange={(e) => setBugReport(e.target.value)}
                                    ></textarea>
                                    <div className="flex justify-end mt-3">
                                        <Button onClick={handleBugSubmit}>Submit Report</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ABOUT SETTINGS */}
                        {activeSection === 'about' && (
                            <div className="max-w-2xl">
                                <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-slate-700">
                                    <span className="text-4xl">ℹ️</span> About Losfer
                                </h2>
                                <div className="p-8 bg-surface-50 rounded-3xl text-center border border-surface-200">
                                    <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">L</div>
                                    <h3 className="text-2xl font-black text-surface-900 mb-2">Losfer Campus</h3>
                                    <p className="text-surface-500 font-medium mb-6">Version 2.0.0 (Premium Release)</p>
                                    <p className="text-sm text-surface-500 max-w-md mx-auto leading-relaxed">
                                        Built with ❤️ for the student community. Losfer helps you recover lost belongings quickly and securely.
                                    </p>
                                    <div className="mt-8 pt-8 border-t border-surface-200 flex justify-center gap-6 text-sm text-primary-600 font-bold">
                                        <button onClick={() => openInfoModal("Terms of Service", termsContent)} className="hover:underline">Terms</button>
                                        <button onClick={() => openInfoModal("Privacy Policy", privacyContent)} className="hover:underline">Privacy</button>
                                        <button onClick={() => openInfoModal("Licenses", licensesContent)} className="hover:underline">Licenses</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DATA SETTINGS */}
                        {activeSection === 'data' && (
                            <div className="max-w-2xl">
                                <h2 className="text-3xl font-black mb-6 flex items-center gap-3 text-orange-700">
                                    <span className="text-4xl">💾</span> Your Data
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-orange-900">Export User Data (PDF)</h4>
                                            <p className="text-sm text-orange-700">Download a secure PDF report of all your activity and profile data.</p>
                                        </div>
                                        <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-100" onClick={handleExportDataPDF}>Download PDF</Button>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-bold text-red-900">Delete Account</h4>
                                            <p className="text-sm text-red-700">Permanently remove all data.</p>
                                        </div>
                                        <Button variant="ghost" className="text-red-600 hover:bg-red-100" onClick={handleDeleteAccount} isLoading={isLoading}>Delete</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </Card>
                </div>
            )}
        </div>
    );
}
