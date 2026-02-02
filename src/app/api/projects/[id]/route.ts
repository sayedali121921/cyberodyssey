
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { updateProjectSchema } from '@/types/api';

interface RouteParams {
    params: {
        id: string;
    };
}

// PATCH /api/projects/:id - Update a project
export async function PATCH(request: NextRequest, { params }: RouteParams) {
    const supabase = createClient();
    const projectId = params.id;

    // 1. Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Validate Body
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const validation = updateProjectSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            { error: 'Validation failed', details: validation.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    // 3. Update Project (with RLS policies providing security, but we double check ownership for specific error msg)
    // We'll trust the RLS policies in 'supabase/rls_policies.sql' which usually say "can update if logic matches user_id"
    // But explicit ownership check ensures we don't return 404 vs 403 confusion if RLS silently fails.

    // Check ownership first
    const { data: existingProject } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();

    if (!existingProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (existingProject.user_id !== user.id) {
        return NextResponse.json({ error: 'Forbes forbidden: You do not own this project' }, { status: 403 });
    }

    // Perform Update
    const { data: updatedProject, error: updateError } = await supabase
        .from('projects')
        .update(validation.data)
        .eq('id', projectId)
        .select()
        .single();

    if (updateError) {
        console.error('Update error:', updateError);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }

    return NextResponse.json({ data: updatedProject }, { status: 200 });
}

// DELETE /api/projects/:id - Delete a project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const supabase = createClient();
    const projectId = params.id;

    // 1. Check Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Delete (checking ownership via query)
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id); // Explicit ownership check in delete query

    if (error) {
        console.error('Delete error:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 });
}
