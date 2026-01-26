import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Critical Error caught by Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-surface-950 p-6 text-center">
                    <div className="max-w-md p-8 bg-surface-900 border border-white/10 rounded-[2.5rem] shadow-2xl">
                        <div className="text-5xl mb-6">⚠️</div>
                        <h1 className="text-2xl font-black text-white mb-4 uppercase italic tracking-tighter">Something Went Wrong</h1>
                        <p className="text-surface-400 mb-8 font-medium">
                            We encountered a minor glitch. Don't worry, your data is safe.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-black py-4 rounded-2xl shadow-xl hover:scale-105 transition-transform"
                        >
                            RELOAD PAGE
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
