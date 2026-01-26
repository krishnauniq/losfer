import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const REPORT_REASONS = [
    "Inappropriate content / NSFW",
    "Spam or Scam",
    "Fake Item / Misleading",
    "Harassment or Abusive",
    "Other"
];

export default function ReportModal({ isOpen, onClose, itemName, onSubmit }) {
    const [selectedReason, setSelectedReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedReason) return;
        setIsSubmitting(true);
        await onSubmit(selectedReason);
        setIsSubmitting(false);
        onClose();
        setSelectedReason(""); // Reset
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Report Item"
            maxWidth="max-w-md"
        >
            <div className="space-y-4">
                <p className="text-surface-600 dark:text-surface-300">
                    Why are you reporting <span className="font-bold text-surface-900 dark:text-surface-50">"{itemName}"</span>?
                    <br />
                    <span className="text-sm opacity-70">This will notify our team.</span>
                </p>

                <div className="space-y-2">
                    {REPORT_REASONS.map((reason) => (
                        <label
                            key={reason}
                            className={`
                                flex items-center p-3 rounded-xl border border-surface-200 dark:border-surface-700 cursor-pointer transition-all
                                ${selectedReason === reason
                                    ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500 dark:bg-primary-900/20'
                                    : 'hover:bg-surface-50 dark:hover:bg-surface-800'
                                }
                            `}
                        >
                            <input
                                type="radio"
                                name="reportReason"
                                value={reason}
                                checked={selectedReason === reason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                className="w-5 h-5 text-primary-600 border-surface-300 focus:ring-primary-500"
                            />
                            <span className="ml-3 font-medium text-surface-900 dark:text-surface-200">{reason}</span>
                        </label>
                    ))}
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        isLoading={isSubmitting}
                        disabled={!selectedReason}
                        className="bg-error-500 hover:bg-error-600 text-white"
                    >
                        Report Item
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
