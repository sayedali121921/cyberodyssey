import { createBrowserClient } from '@supabase/ssr';

// Browser-side Supabase client
// Used in client components
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
    );
}

// Re-export for convenience
export const supabase = createClient();
