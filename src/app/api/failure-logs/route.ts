import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createFailureLogSchema } from '@/types/api';

// GET /api/failure-logs - List failure logs
export async function GET(request: NextRequest) {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;
    const projectId = searchParams.get('project_id');

    // Get current user for visibility filtering
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
        .from('failure_logs')
        .select(`
      *,
      user:users(id, full_name, username, avatar_url),
      project:projects(id, title, slug)
    `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    // Filter by project if specified
    if (projectId) {
        query = query.eq('project_id', projectId);
    }

    // Only show public logs, or private logs owned by current user
    if (user) {
        query = query.or(`visibility.eq.public,user_id.eq.${user.id}`);
    } else {
        query = query.eq('visibility', 'public');
    }

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching failure logs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch failure logs' },
            { status: 500 }
        );
    }

    return NextResponse.json({
        data,
        meta: {
            total: count || 0,
            page,
            limit,
            pages: Math.ceil((count || 0) / limit),
        },
    });
}

// POST /api/failure-logs - Create failure log
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

    const validation = createFailureLogSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                details: validation.error.flatten().fieldErrors
            },
            { status: 400 }
        );
    }

    const {
        project_id,
        goal,
        what_went_wrong,
        attempts,
        what_tried,
        outcome,
        lessons_learned,
        next_steps,
        visibility,
        attachment_urls,
    } = validation.data;

    // If project_id is provided, verify the user owns the project
    if (project_id) {
        const { data: project } = await supabase
            .from('projects')
            .select('user_id')
            .eq('id', project_id)
            .single();

        if (!project || project.user_id !== user.id) {
            return NextResponse.json(
                { error: 'You can only link failure logs to your own projects' },
                { status: 403 }
            );
        }
    }

    // Create failure log
    const { data: failureLog, error: insertError } = await supabase
        .from('failure_logs')
        .insert({
            user_id: user.id,
            project_id: project_id || null,
            goal,
            what_went_wrong,
            attempts,
            what_tried,
            outcome,
            lessons_learned,
            next_steps,
            visibility: visibility || 'public',
            attachment_urls: attachment_urls || [],
        })
        .select()
        .single();

    if (insertError) {
        console.error('Error creating failure log:', insertError);
        return NextResponse.json(
            { error: 'Failed to create failure log' },
            { status: 500 }
        );
    }

    // Award tokens for creating a failure log
    await supabase.rpc('award_tokens', {
        p_user_id: user.id,
        p_amount: 15,
        p_action: 'create_failure_log',
        p_reference_type: 'failure_log',
        p_reference_id: failureLog.id,
    });

    // Check if user qualifies for "First Failure Logged" badge
    const { count: logCount } = await supabase
        .from('failure_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

    if (logCount === 1) {
        // Award first failure log badge
        const { data: badge } = await supabase
            .from('badges')
            .select('id')
            .eq('code', 'first_failure')
            .single();

        if (badge) {
            await supabase.from('user_badges').insert({
                user_id: user.id,
                badge_id: badge.id,
            });
        }
    }

    return NextResponse.json({ data: failureLog }, { status: 201 });
}
