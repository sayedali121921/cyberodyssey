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

// POST /api/admin/mentor-applications/:id/reject
export async function POST(request: NextRequest, { params }: RouteParams) {
    const isAdmin = await checkAdminRole();

    if (!isAdmin) {
        redirect('/');
    }

    const supabase = createClient();
    const applicationId = params.id;

    // Update application status to rejected
    const { error } = await supabase
        .from('mentor_applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

    if (error) {
        redirect('/admin?error=failed');
    }

    redirect('/admin?success=mentor_rejected');
}
