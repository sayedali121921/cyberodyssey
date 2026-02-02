
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
    params: {
        id: string;
    };
}

// DELETE /api/failure-logs/:id
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const supabase = createClient();
    const logId = params.id;

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check Role
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    const isAdmin = userData?.role === 'admin';

    // 3. Delete
    let query = supabase.from('failure_logs').delete().eq('id', logId);

    // Only restrict by user_id if NOT admin
    if (!isAdmin) {
        query = query.eq('user_id', user.id);
    }

    const { error } = await query;

    if (error) {
        console.error('Error deleting failure log:', error);
        return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Log deleted successfully' }, { status: 200 });
}
