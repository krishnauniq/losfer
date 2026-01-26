import React, { useEffect, useState } from 'react';
import QRCode from "react-qr-code";
import Button from '../ui/Button';

export default function ReturnQRModal({ isOpen, onClose, item }) {
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [qrValue, setQrValue] = useState("");

    useEffect(() => {
        if (isOpen && item) {
            // Generate a secured string
            const payload = {
                itemId: item.id,
                timestamp: Date.now(),
                action: 'verify_return'
            };
            setQrValue(JSON.stringify(payload));
            setTimeLeft(600); // Reset timer
        }
    }, [isOpen, item]);

    useEffect(() => {
        if (!isOpen) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-surface-900 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl animate-in zoom-in duration-300">

                <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">Pickup Verification</h2>
                <p className="text-surface-500 mb-6">Present this code to the finder for pickup verification.</p>

                <div className="bg-white p-4 rounded-xl inline-block shadow-inner mb-6 border-4 border-surface-100">
                    {timeLeft > 0 ? (
                        <QRCode value={qrValue} size={200} />
                    ) : (
                        <div className="w-[200px] h-[200px] flex items-center justify-center bg-surface-100 text-surface-400 font-bold">
                            EXPIRED
                        </div>
                    )}
                </div>

                <div className="flex justify-center mb-6">
                    <div className={`px-4 py-1 rounded-full text-sm font-bold font-mono ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-surface-100 text-surface-600'}`}>
                        Expires in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </div>
                </div>

                <Button onClick={onClose} variant="outline" className="w-full">
                    Close
                </Button>
            </div>
        </div>
    );
}
