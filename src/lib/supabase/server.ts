import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Check if running in mock mode
export const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

// Mock Supabase client for development without database
class MockSupabaseClient {
    from(table: string) {
        return {
            select: () => this.chainable(),
            insert: () => this.chainable(),
            update: () => this.chainable(),
            delete: () => this.chainable(),
            eq: () => this.chainable(),
            neq: () => this.chainable(),
            in: () => this.chainable(),
            contains: () => this.chainable(),
            ilike: () => this.chainable(),
            order: () => this.chainable(),
            limit: () => this.chainable(),
            range: () => this.chainable(),
            single: () => Promise.resolve({ data: null, error: null }),
        };
    }

    chainable() {
        return {
            select: () => this.chainable(),
            eq: () => this.chainable(),
            neq: () => this.chainable(),
            in: () => this.chainable(),
            contains: () => this.chainable(),
            ilike: () => this.chainable(),
            order: () => this.chainable(),
            limit: () => this.chainable(),
            range: () => this.chainable(),
            single: () => Promise.resolve({ data: null, error: null, count: 0 }),
            then: (resolve: any) => resolve({ data: [], error: null, count: 0 }),
        };
    }

    rpc(name: string, params?: any) {
        return Promise.resolve({ data: null, error: null });
    }

    auth = {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        signOut: () => Promise.resolve({ error: null }),
        signInWithOAuth: () => Promise.resolve({ data: { url: '/auth/login' }, error: null }),
    };
}

// Server-side Supabase client
// Used in server components, API routes, and server actions
export function createClient() {
    // Return mock client in mock mode
    if (isMockMode) {
        return new MockSupabaseClient() as any;
    }

    const cookieStore = cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options });
                    } catch (error) {
                        // Handle cookies in read-only mode (server components)
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options });
                    } catch (error) {
                        // Handle cookies in read-only mode
                    }
                },
            },
        }
    );
}

// Admin client with service role (for server-side operations that bypass RLS)
// NEVER expose this to the client
export function createAdminClient() {
    if (isMockMode) {
        return new MockSupabaseClient() as any;
    }

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                get() { return undefined; },
                set() { },
                remove() { },
            },
        }
    );
}
