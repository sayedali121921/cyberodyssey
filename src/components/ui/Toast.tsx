'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    if (toasts.length === 0) return null;

    const typeStyles: Record<ToastType, string> = {
        success: 'bg-success/90 border-success text-charcoal',
        error: 'bg-error/90 border-error text-off-white',
        warning: 'bg-warning/90 border-warning text-charcoal',
        info: 'bg-cyan/90 border-cyan text-charcoal',
    };

    const icons: Record<ToastType, string> = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`${typeStyles[toast.type]} px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm flex items-center gap-3 animate-slide-up`}
                >
                    <span className="text-lg font-bold">{icons[toast.type]}</span>
                    <span className="flex-1 text-sm font-medium">{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
