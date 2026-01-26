import { useState } from "react";
import { auth } from "../firebase";
import StatusTimeline from "./ui/StatusTimeline";
import ChatInterface from "./chat/ChatInterface";

export default function ItemModal({ item, onClose, onClaim, onVerifyClaim, onShowQR, onScanQR, onReview }) {
    const [showChat, setShowChat] = useState(false);

    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-surface-50 dark:bg-surface-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">

                {/* Header & Timeline */}
                <div className="bg-surface-50 dark:bg-surface-950 p-4 border-b border-surface-400 dark:border-surface-700">
                    <StatusTimeline status={item.status || "found"} />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 transition"
                    >
                        ✕
                    </button>
                </div>

                {showChat ? (
                    <div className="p-4 flex-1 overflow-auto">
                        <ChatInterface itemId={item.id} itemName={item.itemName} onClose={() => setShowChat(false)} />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 flex-1 overflow-auto">
                        {/* Image Section */}
                        <div className="h-64 md:h-auto bg-gray-100 dark:bg-surface-800 relative">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.itemName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Details Section */}
                        <div className="p-8 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-surface-50 mb-2 flex items-center">
                                    {item.itemName}
                                    {item.isVerified && (
                                        <span className="ml-3 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full border border-emerald-200 flex items-center shadow-sm">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                            Verified
                                        </span>
                                    )}
                                </h2>
                                <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-6">{item.category}</p>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <span className="text-xl mr-3">📍</span>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-surface-400 uppercase font-semibold">Location</p>
                                            <p className="text-gray-800 dark:text-surface-200">{item.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <span className="text-xl mr-3">📅</span>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-surface-400 uppercase font-semibold">Date Found</p>
                                            <p className="text-gray-800 dark:text-surface-200">
                                                {item.createdAt?.seconds
                                                    ? new Date(item.createdAt.seconds * 1000).toLocaleDateString(undefined, {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })
                                                    : "Unknown"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-8 space-y-3">
                                {item.status === 'pending_approval' && (
                                    <>
                                        {auth.currentUser?.uid === item.uid ? (
                                            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl mb-3 border border-amber-200 dark:border-amber-800 animate-pulse">
                                                <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">Claim Pending Review</h4>
                                                <p className="text-sm dark:text-amber-100 mb-2">A user has answered your security question.</p>
                                                <button
                                                    onClick={onReview}
                                                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition shadow-sm"
                                                >
                                                    🔔 Review Answer
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-bold py-4 rounded-xl flex items-center justify-center border border-amber-200 dark:border-amber-800">
                                                <span className="mr-2">⏳</span> Verification Pending
                                            </div>
                                        )}
                                    </>
                                )}

                                {item.status === 'claimed' && (
                                    <>
                                        {/* Finder View: Review Claim */}
                                        {auth.currentUser?.uid === item.uid && (
                                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl mb-3 border border-orange-200 dark:border-orange-800">
                                                <h4 className="font-bold text-orange-800 dark:text-orange-200 mb-2">Verify Identity</h4>
                                                <p className="text-sm dark:text-orange-100"><span className="font-semibold">Claimant:</span> {item.claimantName}</p>
                                                <p className="text-sm dark:text-orange-100 mt-1"><span className="font-semibold">Description:</span> {item.claimProof?.description}</p>
                                                <p className="text-sm dark:text-orange-100"><span className="font-semibold">Marks:</span> {item.claimProof?.identifyingMarks}</p>

                                                <button
                                                    onClick={onVerifyClaim}
                                                    className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg transition shadow-sm"
                                                >
                                                    <span className="mr-2">🛡️</span> Approve & Verify
                                                </button>
                                            </div>
                                        )}

                                        {/* Common Chat Button */}
                                        {(auth.currentUser?.uid === item.uid || auth.currentUser?.uid === item.claimantId) && (
                                            <button
                                                onClick={() => setShowChat(true)}
                                                className="w-full bg-indigo-50 hover:bg-indigo-100 dark:bg-surface-800 dark:hover:bg-surface-700 text-indigo-600 dark:text-indigo-400 font-bold py-3 rounded-xl transition flex items-center justify-center border border-indigo-200 dark:border-surface-600"
                                            >
                                                <span className="mr-2">💬</span> Chat with {auth.currentUser?.uid === item.uid ? 'Claimant' : 'Finder'}
                                            </button>
                                        )}
                                    </>
                                )}

                                {item.status === 'verified' && (
                                    <div className="grid grid-cols-1 gap-3">
                                        {/* Finder Scans */}
                                        {auth.currentUser?.uid === item.uid && (
                                            <button
                                                onClick={onScanQR}
                                                className="bg-surface-900 text-white hover:bg-black font-bold py-3 rounded-xl transition flex flex-col items-center justify-center"
                                            >
                                                <span className="text-2xl mb-1">📷</span>
                                                <span className="text-xs uppercase tracking-wide">Scan Claimant's QR</span>
                                            </button>
                                        )}

                                        {/* Claimant Shows */}
                                        {auth.currentUser?.uid === item.claimantId && (
                                            <button
                                                onClick={onShowQR}
                                                className="bg-indigo-600 text-white hover:bg-indigo-700 font-bold py-3 rounded-xl transition flex flex-col items-center justify-center"
                                            >
                                                <span className="text-2xl mb-1">📱</span>
                                                <span className="text-xs uppercase tracking-wide">Show Pickup QR</span>
                                            </button>
                                        )}
                                    </div>
                                )}

                                {item.status !== 'claimed' && item.status !== 'verified' && item.status !== 'returned' && item.status !== 'pending_approval' && (
                                    <>
                                        <button
                                            onClick={() => {
                                                const text = `Found: ${item.itemName} at ${item.location}. Check Losfer app to claim!`;
                                                navigator.clipboard.writeText(text);
                                                alert("Link copied to clipboard! Share it to help find the owner.");
                                            }}
                                            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold py-3 rounded-xl transition flex items-center justify-center"
                                        >
                                            <span className="mr-2">📢</span> Share Item
                                        </button>

                                        {auth.currentUser?.uid !== item.uid && (
                                            <button
                                                onClick={() => onClaim(item.id)}
                                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center"
                                            >
                                                <span className="mr-2">✅</span> Claim Item
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
