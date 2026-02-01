import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const supabase = createClient();

    const origin = request.nextUrl.origin;
    const redirectTo = `${origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
            redirectTo,
        },
    });

    if (error) {
        console.error('GitHub OAuth error:', error);
        redirect('/auth/login?error=oauth_error');
    }

    if (data.url) {
        redirect(data.url);
    }

    redirect('/auth/login?error=no_url');
}
