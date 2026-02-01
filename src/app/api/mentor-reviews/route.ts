import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createReviewSchema = z.object({
    target_type: z.enum(['project', 'failure_log']),
    target_id: z.string().uuid(),
    review_text: z.string().min(50).max(5000),
    growth_endorsement: z.object({
        strengths: z.array(z.string()).optional(),
        areas_of_growth: z.array(z.string()).optional(),
        recommendation: z.string().optional(),
    }).optional(),
});

// GET /api/mentor-reviews - List mentor reviews
export async function GET(request: NextRequest) {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;

    const targetType = searchParams.get('target_type');
    const targetId = searchParams.get('target_id');
    const mentorId = searchParams.get('mentor_id');

    let query = supabase
        .from('mentor_reviews')
        .select(`
      *,
      mentor:users!mentor_reviews_mentor_id_fkey(id, full_name, username, avatar_url, role)
    `)
        .order('created_at', { ascending: false });

    if (targetType) {
        query = query.eq('target_type', targetType);
    }
    if (targetId) {
        query = query.eq('target_id', targetId);
    }
    if (mentorId) {
        query = query.eq('mentor_id', mentorId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching mentor reviews:', error);
        return NextResponse.json(
            { error: 'Failed to fetch mentor reviews' },
            { status: 500 }
        );
    }

    return NextResponse.json({ data });
}

// POST /api/mentor-reviews - Create a mentor review (mentor only)
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

    // Check if user is a mentor
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!['mentor', 'senior_mentor', 'admin'].includes(userData?.role || '')) {
        return NextResponse.json(
            { error: 'Only mentors can create reviews' },
            { status: 403 }
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

    const validation = createReviewSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                details: validation.error.flatten().fieldErrors
            },
            { status: 400 }
        );
    }

    const { target_type, target_id, review_text, growth_endorsement } = validation.data;

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

    // Mentors cannot review their own work
    if (target.user_id === user.id) {
        return NextResponse.json(
            { error: 'Cannot review your own work' },
            { status: 400 }
        );
    }

    // Check if already reviewed by this mentor
    const { data: existingReview } = await supabase
        .from('mentor_reviews')
        .select('id')
        .eq('mentor_id', user.id)
        .eq('target_type', target_type)
        .eq('target_id', target_id)
        .single();

    if (existingReview) {
        return NextResponse.json(
            { error: 'You have already reviewed this item' },
            { status: 400 }
        );
    }

    // Create review
    const { data: review, error: insertError } = await supabase
        .from('mentor_reviews')
        .insert({
            mentor_id: user.id,
            target_type,
            target_id,
            review_text,
            growth_endorsement,
        })
        .select(`
      *,
      mentor:users!mentor_reviews_mentor_id_fkey(id, full_name, username, avatar_url, role)
    `)
        .single();

    if (insertError) {
        console.error('Error creating mentor review:', insertError);
        return NextResponse.json(
            { error: 'Failed to create review' },
            { status: 500 }
        );
    }

    // Award tokens to mentor for providing review
    await supabase.rpc('award_tokens', {
        p_user_id: user.id,
        p_amount: 20,
        p_action: 'mentor_review',
        p_reference_type: 'mentor_review',
        p_reference_id: review.id,
    });

    // Award tokens to student for receiving feedback
    await supabase.rpc('award_tokens', {
        p_user_id: target.user_id,
        p_amount: 10,
        p_action: 'received_mentor_review',
        p_reference_type: 'mentor_review',
        p_reference_id: review.id,
    });

    return NextResponse.json({ data: review }, { status: 201 });
}
