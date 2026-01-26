import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function GuidelinesModal({ isOpen, onClose }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Community Guidelines" maxWidth="max-w-xl">
            <div className="space-y-4">
                <p className="text-sm text-surface-500 dark:text-surface-400">
                    To ensure a safe and helpful community for everyone at LOSFER, please adhere to the following guidelines:
                </p>

                <ul className="space-y-3">
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success-500/10 text-success-600 flex items-center justify-center font-bold text-xs">1</span>
                        <div>
                            <h4 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">Be Honest & Accurate</h4>
                            <p className="text-sm">Provide accurate descriptions and images for items. Don't claim items that aren't yours.</p>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500/10 text-primary-600 flex items-center justify-center font-bold text-xs">2</span>
                        <div>
                            <h4 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">Meet in Safe Locations</h4>
                            <p className="text-sm">When meeting to return items, choose public, well-lit campus locations like the Library or Student Center.</p>
                        </div>
                    </li>
                    <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warning-500/10 text-warning-600 flex items-center justify-center font-bold text-xs">3</span>
                        <div>
                            <h4 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">Respect Privacy</h4>
                            <p className="text-sm">Do not post sensitive personal information (IDs, credit cards) publicly. Use blurring if necessary.</p>
                        </div>
                    </li>
                </ul>

                <div className="pt-4 flex justify-end">
                    <Button onClick={onClose}>I Understand</Button>
                </div>
            </div>
        </Modal>
    );
}
