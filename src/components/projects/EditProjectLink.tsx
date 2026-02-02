'use client';

import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function EditProjectLink({ slug, projectUserId }: { slug: string, projectUserId: string }) {
    const [isOwner, setIsOwner] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function checkUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                if (user.id === projectUserId) {
                    setIsOwner(true);
                } else {
                    // Check if admin
                    const { data: userData } = await supabase
                        .from('users')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    if (userData?.role === 'admin') {
                        setIsOwner(true); // Treat admin as owner for UI purposes
                    }
                }
            }
        }
        checkUser();
    }, [projectUserId]);

    if (!isOwner) return null;

    return (
        <Link
            href={`/projects/${slug}/edit`}
            className="text-sm font-medium text-muted-text hover:text-cyan flex items-center gap-1 transition-colors"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
        </Link>
    );
}
