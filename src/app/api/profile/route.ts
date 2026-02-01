import { NextResponse } from 'next/server';
import { createClient, isMockMode } from '@/lib/supabase/server';

export async function GET() {
    if (isMockMode) {
        return NextResponse.json({
            id: 'mock-user-id',
            full_name: 'Mock User',
            username: 'mockuser',
            bio: 'This is a mock user for development.',
            avatar_url: null,
            github_url: '',
            linkedin_url: '',
        });
    }

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
}

export async function PUT(request: Request) {
    if (isMockMode) {
        return NextResponse.json({ success: true, message: 'Profile updated (mock)' });
    }

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { full_name, username, bio, github_url, linkedin_url, avatar_url } = body;

    // Validate username
    if (username) {
        const usernameRegex = /^[a-z0-9_]+$/;
        if (!usernameRegex.test(username)) {
            return NextResponse.json({ error: 'Username can only contain lowercase letters, numbers, and underscores' }, { status: 400 });
        }

        // Check if username is taken by another user
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('username', username)
            .neq('id', user.id)
            .single();

        if (existingUser) {
            return NextResponse.json({ error: 'Username is already taken' }, { status: 400 });
        }
    }

    // Validate bio length
    if (bio && bio.length > 500) {
        return NextResponse.json({ error: 'Bio must be 500 characters or less' }, { status: 400 });
    }

    const { error: updateError } = await supabase
        .from('users')
        .update({
            full_name,
            username,
            bio,
            github_url,
            linkedin_url,
            avatar_url,
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (updateError) {
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Profile updated' });
}
