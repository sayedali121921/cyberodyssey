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

// POST /api/admin/reports/:id/hide
export async function POST(request: NextRequest, { params }: RouteParams) {
    const isAdmin = await checkAdminRole();

    if (!isAdmin) {
        redirect('/');
    }

    const supabase = createClient();
    const reportId = params.id;

    // 1. Get the report details to know what to hide
    const { data: report } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

    if (!report) {
        redirect('/admin?error=not_found');
    }

    // 2. Mark report as resolved
    await supabase
        .from('reports')
        .update({ status: 'resolved' })
        .eq('id', reportId);

    // 3. Hide the content (This logic depends on target_type)
    // For MVP, we are just marking the report as resolved.
    // In a full implementation, we would switch on report.target_type and update the corresponding table (e.g. projects, comments).

    // Example logic (commented out until schema supports hidden flags):
    /*
    if (report.target_type === 'project') {
        await supabase.from('projects').update({ status: 'hidden' }).eq('id', report.target_id);
    }
    */

    redirect('/admin?success=content_hidden');
}
