import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function getFailureLogs() {
    const supabase = createClient();

    const { data: logs, error } = await supabase
        .from('failure_logs')
        .select(`
            *,
            user:users!user_id (
                username,
                full_name,
                avatar_url
            ),
            project:projects!project_id (
                title,
                slug
            )
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching failure logs:', error);
        return [];
    }

    return logs;
}

// ... imports
import FailureLogList from '@/components/failure-logs/FailureLogList';

// ... getFailureLogs function (keep as is)

export default async function FailureLogsPage() {
    const logs = await getFailureLogs();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Failure Logs</h1>
                        <p className="text-warm-gray">
                            Real stories of bugs, mistakes, and the lessons learned.
                        </p>
                    </div>
                    <Link
                        href="/new/failure-log"
                        className="btn-primary"
                    >
                        + Log a Failure
                    </Link>
                </div>

                {/* Feed */}
                <FailureLogList initialLogs={logs} currentUserId={user?.id} />
            </div>
        </div>
    );
}
