import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { mentorApplySchema } from '@/types/api';

// POST /api/mentor-apply - Submit mentor application
export async function POST(request: NextRequest) {
    const supabase = createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Check if user already has a pending or approved application
    const { data: existingApp } = await supabase
        .from('mentor_applications')
        .select('id, status')
        .eq('user_id', user.id)
        .single();

    if (existingApp) {
        if (existingApp.status === 'pending') {
            return NextResponse.json(
                { error: 'You already have a pending application' },
                { status: 400 }
            );
        }
        if (existingApp.status === 'approved') {
            return NextResponse.json(
                { error: 'Your mentor application has already been approved' },
                { status: 400 }
            );
        }
    }

    // Check if user is already a mentor
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (userData?.role === 'mentor' || userData?.role === 'senior_mentor' || userData?.role === 'admin') {
        return NextResponse.json(
            { error: 'You are already a mentor' },
            { status: 400 }
        );
    }

    // Parse and validate request body
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON' },
            { status: 400 }
        );
    }

    const validation = mentorApplySchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                details: validation.error.flatten().fieldErrors
            },
            { status: 400 }
        );
    }

    const { answers, github_url, linkedin_url } = validation.data;

    // Try to fetch GitHub account info (optional enhancement)
    let githubAccountAgeDays = null;
    let githubPublicRepos = null;

    try {
        const githubUsername = github_url.split('/').pop();
        if (githubUsername) {
            const ghResponse = await fetch(`https://api.github.com/users/${githubUsername}`, {
                headers: { 'Accept': 'application/vnd.github.v3+json' },
            });
            if (ghResponse.ok) {
                const ghData = await ghResponse.json();
                const createdAt = new Date(ghData.created_at);
                githubAccountAgeDays = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
                githubPublicRepos = ghData.public_repos;
            }
        }
    } catch (e) {
        // Non-critical, continue without GitHub data
        console.log('Could not fetch GitHub data:', e);
    }

    // Create or update application
    const { data: application, error: insertError } = await supabase
        .from('mentor_applications')
        .upsert({
            user_id: user.id,
            answers,
            github_url,
            linkedin_url,
            github_account_age_days: githubAccountAgeDays,
            github_public_repos: githubPublicRepos,
            status: 'pending',
            submitted_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select()
        .single();

    if (insertError) {
        console.error('Error creating mentor application:', insertError);
        return NextResponse.json(
            { error: 'Failed to submit application' },
            { status: 500 }
        );
    }

    // Update user's profile with GitHub/LinkedIn links
    await supabase
        .from('users')
        .update({ github_url, linkedin_url })
        .eq('id', user.id);

    return NextResponse.json({ data: application }, { status: 201 });
}
