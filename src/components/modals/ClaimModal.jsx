import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';

export default function ClaimModal({ isOpen, onClose, itemName, securityQuestion, onSubmit }) {
    const [step, setStep] = useState(0); // Start at 0 for Confirmation
    const [formData, setFormData] = useState({
        description: '',
        identifyingMarks: '',
        locationLost: '',
        securityAnswer: '', // New field
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step === 0) {
            // If security question exists, go to Step 1 (Security), else Step 2 (Details)
            if (securityQuestion) setStep(1);
            else setStep(2);
        } else {
            setStep(step + 1);
        }
    };

    const handleSubmit = async () => {
        if (onSubmit) {
            await onSubmit(formData);
        }
        setStep(4); // Success step
    };

    const reset = () => {
        setStep(0);
        setFormData({ description: '', identifyingMarks: '', locationLost: '', securityAnswer: '' });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={reset} title={step === 0 ? "Identify Item" : `Claim Item: ${itemName}`} maxWidth="max-w-xl">
            {step === 0 && (
                <div className="space-y-6 text-center py-6 animate-fade-in">
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto text-3xl mb-2">
                        🤔
                    </div>
                    <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100">Does this belong to you?</h3>
                    <p className="text-surface-500 dark:text-surface-400">
                        To claim this item, you'll need to answer a few questions to verify ownership.
                        <br />
                        <span className="text-xs text-orange-500 font-bold mt-2 block">False claims may result in account suspension.</span>
                    </p>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button onClick={handleNext} className="w-full h-12 text-lg">
                            Yes, it's mine
                        </Button>
                        <Button variant="ghost" onClick={reset} className="w-full">
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Step 1: Security Question (Conditional) */}
            {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-200 dark:border-amber-800/50">
                        <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                            🔐 Finder's Challenge
                        </p>
                        <p className="text-lg font-medium text-surface-900 dark:text-surface-100">
                            "{securityQuestion}"
                        </p>
                    </div>

                    <Input
                        label="Your Answer"
                        name="securityAnswer"
                        placeholder="Type the answer known only to the owner..."
                        value={formData.securityAnswer}
                        onChange={handleChange}
                        autoFocus
                    />

                    <div className="flex justify-end pt-4">
                        {/* Back to Intro */}
                        <Button variant="ghost" onClick={() => setStep(0)} className="mr-auto">Back</Button>
                        <Button onClick={handleNext} disabled={!formData.securityAnswer}>Verify Answer</Button>
                    </div>
                </div>
            )}

            {/* Step 2: Details (Previously Step 1) */}
            {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        To prevent fraud, please answer a few questions to verify that this item belongs to you.
                    </p>

                    <Textarea
                        label="Detailed Description"
                        name="description"
                        placeholder="Describe unique features not visible in the photo..."
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <Input
                        label="Identifying Marks (Scratches, Stickers, etc.)"
                        name="identifyingMarks"
                        placeholder="e.g. 'Small scratch on bottom left corner'"
                        value={formData.identifyingMarks}
                        onChange={handleChange}
                    />

                    <div className="flex justify-end pt-4">
                        {/* Back logic: If security question existed, back to 1, else back to 0 */}
                        <Button variant="ghost" onClick={() => setStep(securityQuestion ? 1 : 0)} className="mr-auto">Back</Button>
                        <Button onClick={handleNext} disabled={!formData.description}>Next Step</Button>
                    </div>
                </div>
            )}

            {/* Step 3: Review (Previously Step 2) */}
            {step === 3 && (
                <div className="space-y-4 animate-slide-up">
                    <p className="text-sm text-surface-500 dark:text-surface-400">
                        Based on your answers, we will notify the finder. They will review your claim.
                    </p>

                    <div className="bg-surface-50 dark:bg-surface-900 p-4 rounded-lg border border-surface-200 dark:border-surface-800">
                        <h4 className="font-bold text-sm mb-2 text-surface-900 dark:text-surface-100">Review Claim</h4>
                        {securityQuestion && (
                            <div className="mb-2 pb-2 border-b border-surface-200 dark:border-surface-700">
                                <p className="text-xs text-surface-500"><span className="font-semibold">Security Q:</span> {securityQuestion}</p>
                                <p className="text-xs text-surface-900 dark:text-surface-200 font-mono mt-1">"{formData.securityAnswer}"</p>
                            </div>
                        )}
                        <p className="text-xs text-surface-500 mb-1"><span className="font-semibold">Description:</span> {formData.description}</p>
                        <p className="text-xs text-surface-500"><span className="font-semibold">Marks:</span> {formData.identifyingMarks || 'None specified'}</p>
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                        <Button onClick={handleSubmit}>Submit Claim</Button>
                    </div>
                </div>
            )}

            {/* Step 4: Success (Previously Step 3) */}
            {step === 4 && (
                <div className="text-center py-6 animate-scale-in">
                    <div className="w-16 h-16 bg-success-100 text-success-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                        ✓
                    </div>
                    <h3 className="text-xl font-bold text-surface-900 dark:text-surface-100 mb-2">Claim Submitted!</h3>
                    <p className="text-surface-500 dark:text-surface-400 mb-6">
                        The finder has been notified. You will receive an update in your notifications tab once they verify your claim.
                    </p>
                    <Button onClick={reset} className="w-full">Done</Button>
                </div>
            )}
        </Modal>
    );
}
