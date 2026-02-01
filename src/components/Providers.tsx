'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import { CommandPalette } from '@/components/ui/CommandPalette';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ToastProvider>
            {children}
            <CommandPalette />
        </ToastProvider>
    );
}
