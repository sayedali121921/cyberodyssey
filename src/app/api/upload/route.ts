import { NextResponse } from 'next/server';
import { createClient, isMockMode, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    if (isMockMode) {
        return NextResponse.json({ url: 'https://via.placeholder.com/200' });
    }

    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'general';

    if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }

    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${type}/${Date.now()}.${fileExt}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use admin client for storage operations
    const adminClient = createAdminClient();

    const { error: uploadError } = await adminClient.storage
        .from('uploads')
        .upload(fileName, buffer, {
            contentType: file.type,
            upsert: true,
        });

    if (uploadError) {
        console.error('Upload error:', uploadError);
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = adminClient.storage
        .from('uploads')
        .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
}
