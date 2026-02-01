import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const supabase = createClient();

    await supabase.auth.signOut();

    redirect('/');
}
