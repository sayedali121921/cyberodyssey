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

export default async function FailureLogsPage() {
    const logs = await getFailureLogs();

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
                <div className="space-y-6">
                    {logs.length > 0 ? (
                        logs.map((log: any) => (
                            <div key={log.id} className="card hover:border-cyan/30 transition-colors">
                                <div className="flex items-start gap-4">
                                    <Link href={`/profile/${log.user?.username}`}>
                                        {log.user?.avatar_url ? (
                                            <img
                                                src={log.user.avatar_url}
                                                alt={log.user.username}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-slate flex items-center justify-center font-bold">
                                                {log.user?.username?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </Link>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Link
                                                href={`/profile/${log.user?.username}`}
                                                className="font-medium hover:text-cyan"
                                            >
                                                {log.user?.full_name || log.user?.username}
                                            </Link>
                                            <span className="text-muted-text text-sm">•</span>
                                            <span className="text-muted-text text-sm">
                                                {new Date(log.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <h2 className="text-xl font-semibold mb-3 text-off-white">
                                            {log.goal}
                                        </h2>

                                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                                            <div className="p-3 rounded bg-error/5 border border-error/10">
                                                <h3 className="text-xs font-bold text-error uppercase mb-1">What went wrong</h3>
                                                <p className="text-sm text-warm-gray">{log.what_went_wrong}</p>
                                            </div>
                                            <div className="p-3 rounded bg-success/5 border border-success/10">
                                                <h3 className="text-xs font-bold text-success uppercase mb-1">Lessons Learned</h3>
                                                <p className="text-sm text-warm-gray">{log.lessons_learned}</p>
                                            </div>
                                        </div>

                                        {log.project && (
                                            <div className="flex items-center gap-2 mt-4 text-sm text-muted-text">
                                                <span>Relating to project:</span>
                                                <Link
                                                    href={`/projects/${log.project.slug}`}
                                                    className="flex items-center gap-1 text-cyan hover:underline"
                                                >
                                                    📁 {log.project.title}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card text-center py-12">
                            <p className="text-warm-gray mb-4">No failure logs found yet.</p>
                            <Link href="/new/failure-log" className="btn-secondary">
                                Be the first to share a lesson
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
