import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Check if Supabase is configured
const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co';

// Middleware for handling auth session refresh
export async function updateSession(request: NextRequest) {
    // Skip Supabase in mock mode
    if (isMockMode) {
        return NextResponse.next({
            request: {
                headers: request.headers,
            },
        });
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Refresh the session
    try {
        await supabase.auth.getUser();
    } catch (error) {
        console.error('Middleware auth error:', error);
    }

    return response;
}

// Protected routes that require authentication
const protectedRoutes = [
    '/new',
    '/profile/edit',
    '/mentor/apply',
    '/admin',
];

// Admin-only routes
const adminRoutes = [
    '/admin',
];

export async function middleware(request: NextRequest) {
    // Skip middleware processing in mock mode
    if (isMockMode) {
        return NextResponse.next();
    }

    const response = await updateSession(request);

    const pathname = request.nextUrl.pathname;

    // Check if route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
        pathname.startsWith(route)
    );

    if (isProtectedRoute) {
        try {
            const supabase = createServerClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    cookies: {
                        get(name: string) {
                            return request.cookies.get(name)?.value;
                        },
                        set() { },
                        remove() { },
                    },
                }
            );

            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                const loginUrl = new URL('/auth/login', request.url);
                loginUrl.searchParams.set('redirect', pathname);
                return NextResponse.redirect(loginUrl);
            }

            // Check admin routes
            const isAdminRoute = adminRoutes.some(route =>
                pathname.startsWith(route)
            );

            if (isAdminRoute) {
                const { data: userData } = await supabase
                    .from('users')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (userData?.role !== 'admin') {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
        } catch (error) {
            console.error('Middleware protection error:', error);
            // Allow request to continue on error
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};

