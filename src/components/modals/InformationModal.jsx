import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function InformationModal({ isOpen, onClose, title, content }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-2xl">
            <div className="max-h-[60vh] overflow-y-auto pr-2 text-surface-600 dark:text-surface-300 space-y-4">
                {typeof content === 'string' ? (
                    <div className="whitespace-pre-line">{content}</div>
                ) : (
                    content
                )}
            </div>
            <div className="mt-6 flex justify-end">
                <Button onClick={onClose}>Close</Button>
            </div>
        </Modal>
    );
}
