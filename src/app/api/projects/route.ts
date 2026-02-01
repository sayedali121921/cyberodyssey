import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { createProjectSchema } from '@/types/api';
import slugify from 'slugify';

// GET /api/projects - List projects
export async function GET(request: NextRequest) {
    const supabase = createClient();
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    let query = supabase
        .from('projects')
        .select(`
      *,
      user:users(id, full_name, username, avatar_url, role)
    `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

    // Filters
    const tag = searchParams.get('tag');
    const status = searchParams.get('status');
    const userId = searchParams.get('user');
    const search = searchParams.get('search');

    if (tag) {
        query = query.contains('tags', [tag]);
    }
    if (status) {
        query = query.eq('status', status);
    }
    if (userId) {
        query = query.eq('user_id', userId);
    }
    if (search) {
        query = query.ilike('title', `%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
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

// POST /api/projects - Create project
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

    const validation = createProjectSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            {
                error: 'Validation failed',
                details: validation.error.flatten().fieldErrors
            },
            { status: 400 }
        );
    }

    const { title, description, tags, repo_url, demo_url, image_urls } = validation.data;

    // Generate unique slug
    let baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    // Check for existing slugs and make unique
    while (true) {
        const { data: existing } = await supabase
            .from('projects')
            .select('id')
            .eq('slug', slug)
            .single();

        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
    }

    // Create project
    const { data: project, error: insertError } = await supabase
        .from('projects')
        .insert({
            user_id: user.id,
            title,
            slug,
            description,
            tags: tags || [],
            repo_url,
            demo_url,
            image_urls: image_urls || [],
            status: 'IN_PROGRESS',
        })
        .select()
        .single();

    if (insertError) {
        console.error('Error creating project:', insertError);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }

    // Award tokens for creating a project
    await supabase.rpc('award_tokens', {
        p_user_id: user.id,
        p_amount: 10,
        p_action: 'create_project',
        p_reference_type: 'project',
        p_reference_id: project.id,
    });

    return NextResponse.json({ data: project }, { status: 201 });
}
