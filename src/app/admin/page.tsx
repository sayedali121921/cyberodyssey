import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function checkAdminAccess() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    return userData?.role === 'admin' ? user : null;
}

async function getAdminStats() {
    const supabase = createClient();

    const [
        { count: userCount },
        { count: projectCount },
        { count: failureLogCount },
        { count: pendingMentorApps },
        { count: reportCount },
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('failure_logs').select('*', { count: 'exact', head: true }),
        supabase.from('mentor_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    return {
        users: userCount || 0,
        projects: projectCount || 0,
        failureLogs: failureLogCount || 0,
        pendingMentorApps: pendingMentorApps || 0,
        pendingReports: reportCount || 0,
    };
}

async function getPendingMentorApplications() {
    const supabase = createClient();

    const { data } = await supabase
        .from('mentor_applications')
        .select(`
      *,
      user:users(id, full_name, email, avatar_url, created_at)
    `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true });

    return data || [];
}

async function getRecentReports() {
    const supabase = createClient();

    const { data } = await supabase
        .from('reports')
        .select(`
      *,
      reporter:users!reports_reporter_id_fkey(id, full_name, email)
    `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

    return data || [];
}

export default async function AdminPage() {
    const admin = await checkAdminAccess();

    if (!admin) {
        redirect('/');
    }

    const [stats, mentorApps, reports] = await Promise.all([
        getAdminStats(),
        getPendingMentorApplications(),
        getRecentReports(),
    ]);

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="card text-center">
                        <div className="text-2xl font-bold">{stats.users}</div>
                        <div className="text-sm text-muted-text">Users</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold">{stats.projects}</div>
                        <div className="text-sm text-muted-text">Projects</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold">{stats.failureLogs}</div>
                        <div className="text-sm text-muted-text">Failure Logs</div>
                    </div>
                    <div className="card text-center bg-warning/10">
                        <div className="text-2xl font-bold text-warning">{stats.pendingMentorApps}</div>
                        <div className="text-sm text-muted-text">Pending Mentors</div>
                    </div>
                    <div className="card text-center bg-error/10">
                        <div className="text-2xl font-bold text-error">{stats.pendingReports}</div>
                        <div className="text-sm text-muted-text">Pending Reports</div>
                    </div>
                </div>

                {/* Mentor Applications */}
                <div className="card mb-8">
                    <h2 className="text-lg font-semibold mb-4">Pending Mentor Applications</h2>

                    {mentorApps.length > 0 ? (
                        <div className="space-y-4">
                            {mentorApps.map((app: any) => (
                                <div key={app.id} className="p-4 bg-graphite/50 rounded-lg">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            {app.user?.avatar_url ? (
                                                <img src={app.user.avatar_url} alt="" className="avatar-sm" />
                                            ) : (
                                                <div className="avatar-sm bg-slate" />
                                            )}
                                            <div>
                                                <p className="font-medium">{app.user?.full_name || 'Unknown'}</p>
                                                <p className="text-sm text-muted-text">{app.user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={`/api/admin/mentor-applications/${app.id}/approve`} method="POST">
                                                <button type="submit" className="btn-primary text-sm">
                                                    Approve
                                                </button>
                                            </form>
                                            <form action={`/api/admin/mentor-applications/${app.id}/reject`} method="POST">
                                                <button type="submit" className="btn-ghost text-sm text-error">
                                                    Reject
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Application Answers */}
                                    {app.answers && (
                                        <details className="mt-4">
                                            <summary className="cursor-pointer text-sm text-cyan">
                                                View Application Answers
                                            </summary>
                                            <div className="mt-2 space-y-2 text-sm text-warm-gray">
                                                {Object.entries(app.answers).map(([key, value]) => (
                                                    <div key={key}>
                                                        <p className="font-medium">{key.replace(/_/g, ' ')}:</p>
                                                        <p>{value as string}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    )}

                                    <div className="mt-2 flex gap-4 text-xs text-muted-text">
                                        {app.github_url && (
                                            <a href={app.github_url} target="_blank" className="link">GitHub</a>
                                        )}
                                        {app.linkedin_url && (
                                            <a href={app.linkedin_url} target="_blank" className="link">LinkedIn</a>
                                        )}
                                        <span>Applied: {new Date(app.submitted_at).toLocaleDateString()}</span>
                                        {app.github_account_age_days && (
                                            <span>GitHub age: {app.github_account_age_days} days</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-warm-gray text-center py-4">No pending applications</p>
                    )}
                </div>

                {/* Reports */}
                <div className="card">
                    <h2 className="text-lg font-semibold mb-4">Pending Reports</h2>

                    {reports.length > 0 ? (
                        <div className="space-y-4">
                            {reports.map((report: any) => (
                                <div key={report.id} className="p-4 bg-graphite/50 rounded-lg">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium">
                                                {report.target_type}: {report.target_id}
                                            </p>
                                            <p className="text-sm text-warm-gray mt-1">{report.reason}</p>
                                            <p className="text-xs text-muted-text mt-2">
                                                Reported by: {report.reporter?.full_name} • {new Date(report.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <form action={`/api/admin/reports/${report.id}/dismiss`} method="POST">
                                                <button type="submit" className="btn-ghost text-sm">
                                                    Dismiss
                                                </button>
                                            </form>
                                            <form action={`/api/admin/reports/${report.id}/hide`} method="POST">
                                                <button type="submit" className="btn-ghost text-sm text-error">
                                                    Hide Content
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-warm-gray text-center py-4">No pending reports</p>
                    )}
                </div>
            </div>
        </div>
    );
}
