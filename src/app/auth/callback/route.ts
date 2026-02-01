import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = createClient();

        const { data: { session }, error: authError } = await supabase.auth.exchangeCodeForSession(code);

        if (authError) {
            console.error('Auth callback error:', authError);
            return NextResponse.redirect(`${origin}/auth/login?error=callback_error`);
        }

        if (session?.user) {
            // Check if user exists in our users table
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('id', session.user.id)
                .single();

            // If user doesn't exist, create their profile
            if (!existingUser) {
                const { error: insertError } = await supabase.from('users').insert({
                    id: session.user.id,
                    email: session.user.email!,
                    full_name: session.user.user_metadata.full_name || session.user.user_metadata.name || null,
                    avatar_url: session.user.user_metadata.avatar_url || session.user.user_metadata.picture || null,
                    github_url: session.user.user_metadata.user_name
                        ? `https://github.com/${session.user.user_metadata.user_name}`
                        : null,
                    role: 'student',
                });

                if (insertError) {
                    console.error('Error creating user profile:', insertError);
                }

                // Create initial token balance
                await supabase.from('tokens').insert({
                    user_id: session.user.id,
                    balance: 0,
                    total_earned: 0,
                    total_spent: 0,
                });

                // Redirect new users to onboarding
                return NextResponse.redirect(`${origin}/?onboarding=true`);
            }
        }
    }

    // Redirect to home page after successful login
    return NextResponse.redirect(`${origin}/`);
}
