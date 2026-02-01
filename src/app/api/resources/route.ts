import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const createResourceSchema = z.object({
    title: z.string().min(1).max(300),
    url: z.string().url(),
    authors: z.array(z.string()).optional(),
    description: z.string().max(2000).optional(),
    tags: z.array(z.string()).max(10).optional(),
    is_open_access: z.boolean().optional(),
});

// GET /api/resources - List resources
export async function GET(request: NextRequest) {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    let query = supabase
        .from('resources')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const openAccess = searchParams.get('open_access');

    if (tag) {
        query = query.contains('tags', [tag]);
    }
    if (search) {
        query = query.ilike('title', `%${search}%`);
    }
    if (openAccess === 'true') {
        query = query.eq('is_open_access', true);
    }

    const { data, error, count } = await query;

    if (error) {
        return NextResponse.json(
            { error: 'Failed to fetch resources' },
            { status: 500 }
        );
    }

    return NextResponse.json({
        data,
        meta: {
            total: count || 0,
            page,
            limit,
            pages: Math.ceil((count || 0) / limit),
        },
    });
}

// POST /api/resources - Create resource (admin/curator only)
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

    // Check if user is admin
    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (userData?.role !== 'admin') {
        return NextResponse.json(
            { error: 'Only admins can add resources' },
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

    const validation = createResourceSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                details: validation.error.flatten().fieldErrors
            },
            { status: 400 }
        );
    }

    const { title, url, authors, description, tags, is_open_access } = validation.data;

    // Create resource
    const { data: resource, error: insertError } = await supabase
        .from('resources')
        .insert({
            title,
            url,
            authors: authors || [],
            description,
            tags: tags || [],
            is_open_access: is_open_access || false,
        })
        .select()
        .single();

    if (insertError) {
        console.error('Error creating resource:', insertError);
        return NextResponse.json(
            { error: 'Failed to create resource' },
            { status: 500 }
        );
    }

    return NextResponse.json({ data: resource }, { status: 201 });
}
