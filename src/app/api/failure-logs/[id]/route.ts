
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

    // specific check: make sure the log belongs to the user
    // We can do this in the delete query directly by adding .eq('user_id', user.id)
    // but a two-step check is often clearer for error messages.
    // For efficiency, we will trust RLS if enabled, but explict checking is safer for APIs.

    const { error } = await supabase
        .from('failure_logs')
        .delete()
        .eq('id', logId)
        .eq('user_id', user.id); // Validating ownership

    if (error) {
        console.error('Error deleting failure log:', error);
        return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Log deleted successfully' }, { status: 200 });
}
