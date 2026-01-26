import React from 'react';
import PostItem from './PostItem';
import { useNavigate } from 'react-router-dom';

const PostItemPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen py-12 px-4 overflow-hidden">
            {/* Ambient Background */}
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/20 rounded-full blur-[150px] -z-20 translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px] -z-20 -translate-x-1/2 pointer-events-none animate-pulse-slow delay-700"></div>

            {/* Glass Diffusion Layer */}
            <div className="absolute inset-0 backdrop-blur-[100px] -z-10 pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="mb-12 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-100 dark:bg-surface-800 rounded-full mb-6 border border-surface-200 dark:border-surface-700 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-widest shadow-sm">
                        <span className="w-2 h-2 bg-primary-500 rounded-full animate-ping"></span>
                        Active Recovery Protocol
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-surface-900 dark:text-white mb-6 tracking-tight leading-tight">
                        Post a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">Found Item</span>
                    </h1>
                    <p className="text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto md:mx-0">
                        Help reunite a student with their belongings. Your report is verified and securely broadcasted to the campus.
                    </p>
                </div>

                <PostItem onSuccess={() => navigate('/app')} />

                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-100 dark:border-emerald-800 backdrop-blur-sm">
                        <div className="text-3xl mb-3">🛡️</div>
                        <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-1">Secure Process</h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-300">Verified claims via QR</p>
                    </div>
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800 backdrop-blur-sm">
                        <div className="text-3xl mb-3">💬</div>
                        <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-1">Private Chat</h4>
                        <p className="text-xs text-indigo-600 dark:text-indigo-300">Coordinate safely in-app</p>
                    </div>
                    <div className="p-6 bg-rose-50 dark:bg-rose-900/30 rounded-2xl border border-rose-100 dark:border-rose-800 backdrop-blur-sm">
                        <div className="text-3xl mb-3">📍</div>
                        <h4 className="font-bold text-rose-900 dark:text-rose-100 mb-1">Campus Points</h4>
                        <p className="text-xs text-rose-600 dark:text-rose-300">Suggested safe meetings</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostItemPage;
