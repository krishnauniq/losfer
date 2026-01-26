import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from "html5-qrcode";
import Button from '../ui/Button';

export default function ScanQRModal({ isOpen, onClose, onVerify }) {
    const [error, setError] = useState("");
    const scannerRef = useRef(null);

    useEffect(() => {
        let scanner;
        let initTimer;

        if (isOpen) {
            // Give DOM time to mount
            initTimer = setTimeout(() => {
                // Double check if component is still mounted/ref is null
                if (scannerRef.current) return;

                scanner = new Html5Qrcode("reader");
                scannerRef.current = scanner;

                const config = { fps: 10, qrbox: { width: 250, height: 250 } };

                scanner.start(
                    { facingMode: "environment" },
                    config,
                    async (decodedText) => {
                        try {
                            const data = JSON.parse(decodedText);
                            if (data.action === 'verify_return' && data.itemId && data.timestamp) {
                                const now = Date.now();
                                if (now - data.timestamp > 600000) {
                                    setError("QR Code Expired");
                                    return;
                                }

                                // NEW: Stop first, then notify parent to avoid unmounting while stopping
                                try {
                                    await scanner.stop();
                                    scanner.clear();
                                    scannerRef.current = null;
                                    onVerify(data.itemId);
                                } catch (stopError) {
                                    console.error("Scanner stop failed", stopError);
                                    onVerify(data.itemId); // Proceed anyway if stop fails
                                }
                            } else {
                                setError("Invalid Code");
                            }
                        } catch (e) {
                            setError("Unrecognized Format");
                        }
                    },
                    // ... rest of the start call ...
                ).catch(err => {
                    console.error("Camera start failed", err);
                    setError("Camera blocked or not available");
                });
            }, 300);
        }

        return () => {
            clearTimeout(initTimer);
            if (scannerRef.current) {
                const s = scannerRef.current;
                scannerRef.current = null;
                // Defensively try to stop/clear without crashing unmount
                try {
                    s.stop().finally(() => s.clear()).catch(() => { });
                } catch (e) { }
            }
        };
    }, [isOpen, onVerify]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-black rounded-3xl p-6 max-w-md w-full text-center shadow-2xl border border-white/10">

                <h2 className="text-xl font-bold text-white mb-4">Scan Claimant's Code</h2>

                <div className="rounded-2xl overflow-hidden bg-black border border-white/20 relative min-h-[300px] flex items-center justify-center">
                    <div id="reader" className="w-full h-full"></div>
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-red-500 font-bold backdrop-blur-sm z-10">
                            <span className="text-2xl mb-2">⚠️</span>
                            {error}
                            <button onClick={() => { setError(""); scannerRef.current?.resume(); }} className="mt-4 px-4 py-2 bg-white/10 rounded-lg text-sm text-white">Retry</button>
                        </div>
                    )}
                </div>

                <p className="text-white/50 text-sm mt-4 mb-6">Camera will start automatically.</p>

                <Button onClick={onClose} variant="secondary" className="w-full">
                    Cancel Scan
                </Button>
            </div>
        </div>
    );
}
