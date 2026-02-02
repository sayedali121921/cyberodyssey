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

// POST /api/admin/reports/:id/dismiss
export async function POST(request: NextRequest, { params }: RouteParams) {
    const isAdmin = await checkAdminRole();

    if (!isAdmin) {
        redirect('/');
    }

    const supabase = createClient();
    const reportId = params.id;

    const { error } = await supabase
        .from('reports')
        .update({ status: 'dismissed' })
        .eq('id', reportId);

    if (error) {
        console.error('Error dismissing report:', error);
        redirect('/admin?error=dismiss_failed');
    }

    redirect('/admin?success=report_dismissed');
}
