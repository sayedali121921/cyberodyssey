'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface FailureLogListProps {
    initialLogs: any[];
    currentUserId?: string;
}

export default function FailureLogList({ initialLogs, currentUserId }: FailureLogListProps) {
    const [logs, setLogs] = useState(initialLogs);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    // Check for admin role on mount
    useEffect(() => {
        async function checkRole() {
            if (!currentUserId) return;
            const supabase = createClient();
            const { data } = await supabase.from('users').select('role').eq('id', currentUserId).single();
            if (data?.role === 'admin') setIsAdmin(true);
        }
        checkRole();
    }, [currentUserId]);

    async function handleDelete(logId: string) {
        if (!confirm('Are you sure you want to delete this failure log?')) return;

        try {
            const response = await fetch(`/api/failure-logs/${logId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete log');
            }

            // Remove from local state
            setLogs(logs.filter(log => log.id !== logId));
            router.refresh(); // Refresh server data
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete log');
        }
    }

    if (logs.length === 0) {
        return (
            <div className="card text-center py-12">
                <p className="text-warm-gray mb-4">No failure logs found yet.</p>
                <Link href="/new/failure-log" className="btn-secondary">
                    Be the first to share a lesson
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {logs.map((log: any) => (
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
                            <div className="flex items-center justify-between">
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

                                {/* Only show delete button for owner or admin */}
                                {(currentUserId === log.user_id || isAdmin) && (
                                    <button
                                        onClick={() => handleDelete(log.id)}
                                        className="text-xs text-error hover:text-red-400 opacity-50 hover:opacity-100 transition-opacity"
                                        title="Delete Log"
                                    >
                                        🗑️ Delete
                                    </button>
                                )}
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
            ))}
        </div>
    );
}
