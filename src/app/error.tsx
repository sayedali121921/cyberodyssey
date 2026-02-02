'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service if needed
        console.error('Global Error Boundary caught:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-charcoal relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('/grid.svg')] pointer-events-none" />

            <div className="relative z-10 max-w-lg w-full text-center space-y-6">
                <div className="inline-block p-4 rounded-full bg-error/10 text-error mb-4 border border-error/20 animate-pulse">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-off-white">
                    System Malfunction
                </h2>

                <p className="text-warm-gray text-lg">
                    Something went wrong in the neural link.
                    <br />
                    <span className="text-sm font-mono text-error mt-2 block bg-black/30 p-2 rounded">
                        Error: {error.message || 'Unknown System Failure'}
                    </span>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button
                        onClick={reset}
                        className="btn-primary flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Reboot System
                    </button>
                    <a
                        href="/"
                        className="btn-secondary flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Return Home
                    </a>
                </div>
            </div>
        </div>
    );
}
