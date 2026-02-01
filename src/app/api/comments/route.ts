import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createCommentSchema } from '@/types/api';

// GET /api/comments - List comments for a target
export async function GET(request: NextRequest) {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;

    const targetType = searchParams.get('target_type');
    const targetId = searchParams.get('target_id');

    if (!targetType || !targetId) {
        return NextResponse.json(
            { error: 'target_type and target_id are required' },
            { status: 400 }
        );
    }

    // Fetch comments with user info
    const { data: comments, error } = await supabase
        .from('comments')
        .select(`
      *,
      user:users(id, full_name, username, avatar_url, role)
    `)
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .is('parent_id', null) // Only top-level comments
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }

    // Fetch replies for each comment
    const commentIds = comments?.map((c: any) => c.id) || [];
    const { data: replies } = await supabase
        .from('comments')
        .select(`
      *,
      user:users(id, full_name, username, avatar_url, role)
    `)
        .in('parent_id', commentIds)
        .order('created_at', { ascending: true });

    // Attach replies to their parent comments
    const commentsWithReplies = (comments || []).map((comment: any) => ({
        ...comment,
        replies: (replies || []).filter((r: any) => r.parent_id === comment.id),
    }));

    return NextResponse.json({ data: commentsWithReplies });
}

// POST /api/comments - Create a comment
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

    const validation = createCommentSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                details: validation.error.flatten().fieldErrors
            },
            { status: 400 }
        );
    }

    const { target_type, target_id, category, body: commentBody, parent_id } = validation.data;

    // Verify target exists
    const targetTable = target_type === 'project' ? 'projects' : 'failure_logs';
    const { data: target } = await supabase
        .from(targetTable)
        .select('id, user_id')
        .eq('id', target_id)
        .single();

    if (!target) {
        return NextResponse.json(
            { error: 'Target not found' },
            { status: 404 }
        );
    }

    // If replying, verify parent comment exists
    if (parent_id) {
        const { data: parentComment } = await supabase
            .from('comments')
            .select('id, parent_id')
            .eq('id', parent_id)
            .single();

        if (!parentComment) {
            return NextResponse.json(
                { error: 'Parent comment not found' },
                { status: 404 }
            );
        }

        // Only allow one level of nesting
        if (parentComment.parent_id) {
            return NextResponse.json(
                { error: 'Cannot reply to a reply' },
                { status: 400 }
            );
        }
    }

    // Check if user is a mentor
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    const isMentor = ['mentor', 'senior_mentor', 'admin'].includes(userData?.role || '');

    // Create comment
    const { data: comment, error: insertError } = await supabase
        .from('comments')
        .insert({
            user_id: user.id,
            target_type,
            target_id,
            category,
            body: commentBody,
            parent_id: parent_id || null,
            is_mentor_insight: isMentor,
        })
        .select(`
      *,
      user:users(id, full_name, username, avatar_url, role)
    `)
        .single();

    if (insertError) {
        console.error('Error creating comment:', insertError);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }

    // Award tokens for commenting (only for helpful categories)
    if (category && ['suggestion', 'question'].includes(category)) {
        await supabase.rpc('award_tokens', {
            p_user_id: user.id,
            p_amount: 2,
            p_action: 'post_comment',
            p_reference_type: 'comment',
            p_reference_id: comment.id,
        });
    }

    return NextResponse.json({ data: comment }, { status: 201 });
}
