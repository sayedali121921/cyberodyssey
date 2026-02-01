import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

interface RouteParams {
    params: { id: string };
}

async function checkAdminRole() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    return data?.role === 'admin';
}

// POST /api/admin/mentor-applications/:id/approve
export async function POST(request: NextRequest, { params }: RouteParams) {
    const isAdmin = await checkAdminRole();

    if (!isAdmin) {
        redirect('/');
    }

    const supabase = createClient();
    const applicationId = params.id;

    // Get the application
    const { data: app, error: appError } = await supabase
        .from('mentor_applications')
        .select('user_id')
        .eq('id', applicationId)
        .single();

    if (appError || !app) {
        redirect('/admin?error=not_found');
    }

    // Update application status
    await supabase
        .from('mentor_applications')
        .update({ status: 'approved' })
        .eq('id', applicationId);

    // Update user role to mentor
    await supabase
        .from('users')
        .update({
            role: 'mentor',
            is_platform_verified: true,
        })
        .eq('id', app.user_id);

    // Create mentor verification record
    await supabase
        .from('mentor_verifications')
        .insert({
            user_id: app.user_id,
            verification_type: 'admin_approved',
            verified_at: new Date().toISOString(),
        });

    // Award "Mentor" badge
    const { data: mentorBadge } = await supabase
        .from('badges')
        .select('id')
        .eq('code', 'mentor')
        .single();

    if (mentorBadge) {
        await supabase.from('user_badges').insert({
            user_id: app.user_id,
            badge_id: mentorBadge.id,
        });
    }

    // Award tokens for becoming a mentor
    await supabase.rpc('award_tokens', {
        p_user_id: app.user_id,
        p_amount: 50,
        p_action: 'mentor_approved',
        p_reference_type: 'mentor_application',
        p_reference_id: applicationId,
    });

    redirect('/admin?success=mentor_approved');
}
