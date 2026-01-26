import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ReviewClaimModal({ isOpen, onClose, item, onApprove, onReject }) {
    if (!item) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Review Claim Request" maxWidth="max-w-md">
            <div className="space-y-6 animate-fade-in relative z-10">
                {/* Header Section */}
                <div className="bg-surface-50 dark:bg-surface-900/50 p-4 rounded-2xl border border-surface-100 dark:border-surface-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {item.claimantName ? item.claimantName.charAt(0) : '?'}
                        </div>
                        <div>
                            <h4 className="font-bold text-surface-900 dark:text-white leading-tight">
                                {item.claimantName || "Anonymous User"}
                            </h4>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                Pending Approval
                            </span>
                        </div>
                    </div>
                </div>

                {/* Security Check Section */}
                <div className="space-y-4">
                    {item.securityQuestion && (
                        <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border border-amber-100 dark:border-amber-800/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all"></div>

                            <h5 className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-3 flex items-center gap-2">
                                🔒 Security Check
                            </h5>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-surface-500 font-bold mb-1">Question:</p>
                                    <p className="text-sm font-medium text-surface-900 dark:text-surface-200 bg-white/50 dark:bg-black/20 p-2 rounded-lg italic">
                                        "{item.securityQuestion}"
                                    </p>
                                </div>
                                <div className="animate-slide-up animation-delay-100">
                                    <p className="text-xs text-surface-500 font-bold mb-1">Claimant's Answer:</p>
                                    <p className="text-lg font-bold text-surface-900 dark:text-white bg-white dark:bg-surface-800 p-3 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
                                        {item.claimantAnswer || "No answer provided"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description Section */}
                    <div className="bg-surface-50 dark:bg-surface-800/50 p-5 rounded-2xl border border-surface-100 dark:border-surface-700">
                        <h5 className="text-xs font-black uppercase tracking-widest text-surface-400 mb-3">Claim Details</h5>
                        <div className="space-y-2 text-sm text-surface-600 dark:text-surface-300">
                            <p><span className="font-bold text-surface-900 dark:text-surface-100">Description:</span> {item.claimProof?.description}</p>
                            <p><span className="font-bold text-surface-900 dark:text-surface-100">Marks:</span> {item.claimProof?.identifyingMarks || 'None'}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                    <Button
                        variant="ghost"
                        onClick={onReject}
                        className="text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-900/20 h-12"
                    >
                        Reject Claim
                    </Button>
                    <Button
                        onClick={onApprove}
                        className="h-12 bg-gradient-to-r from-success-500 to-emerald-600 hover:from-success-600 hover:to-emerald-700 text-white shadow-xl shadow-success-500/20"
                    >
                        Approve & Chat
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
