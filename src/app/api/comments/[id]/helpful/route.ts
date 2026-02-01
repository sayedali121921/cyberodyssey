import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: { id: string };
}

// POST /api/comments/:id/helpful - Mark a comment as helpful
export async function POST(request: NextRequest, { params }: RouteParams) {
    const supabase = createClient();
    const commentId = params.id;

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Get the comment
    const { data: comment, error: commentError } = await supabase
        .from('comments')
        .select('id, target_type, target_id, user_id, helpful_count')
        .eq('id', commentId)
        .single();

    if (commentError || !comment) {
        return NextResponse.json(
            { error: 'Comment not found' },
            { status: 404 }
        );
    }

    // Verify the user owns the target (project or failure log)
    const targetTable = comment.target_type === 'project' ? 'projects' : 'failure_logs';
    const { data: target } = await supabase
        .from(targetTable)
        .select('user_id')
        .eq('id', comment.target_id)
        .single();

    if (!target || target.user_id !== user.id) {
        return NextResponse.json(
            { error: 'Only the owner can mark comments as helpful' },
            { status: 403 }
        );
    }

    // Check if already marked helpful by this user
    const { data: existingMark } = await supabase
        .from('helpful_marks')
        .select('id')
        .eq('user_id', user.id)
        .eq('comment_id', commentId)
        .single();

    if (existingMark) {
        return NextResponse.json(
            { error: 'Already marked as helpful' },
            { status: 400 }
        );
    }

    // Add helpful mark
    await supabase.from('helpful_marks').insert({
        user_id: user.id,
        comment_id: commentId,
    });

    // Increment helpful count
    const { data: updatedComment, error: updateError } = await supabase
        .from('comments')
        .update({ helpful_count: (comment.helpful_count || 0) + 1 })
        .eq('id', commentId)
        .select()
        .single();

    if (updateError) {
        return NextResponse.json(
            { error: 'Failed to update helpful count' },
            { status: 500 }
        );
    }

    // Award tokens to the comment author for being helpful
    await supabase.rpc('award_tokens', {
        p_user_id: comment.user_id,
        p_amount: 5,
        p_action: 'comment_marked_helpful',
        p_reference_type: 'comment',
        p_reference_id: commentId,
    });

    return NextResponse.json({ data: updatedComment });
}
