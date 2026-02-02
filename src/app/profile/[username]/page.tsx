import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: { username: string };
}

async function getProfile(username: string) {
    const supabase = createClient();

    // Try to find by username first, then by ID
    let query = supabase
        .from('users')
        .select('*');

    // Check if it's a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(username);

    if (isUUID) {
        query = query.eq('id', username);
    } else {
        query = query.eq('username', username);
    }

    const { data: user, error } = await query.single();

    if (error || !user) {
        return null;
    }

    // Get projects
    const { data: projects } = await supabase
        .from('projects')
        .select('id, title, slug, status, tags, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Get public failure logs
    const { data: failureLogs } = await supabase
        .from('failure_logs')
        .select('id, goal, created_at, project_id')
        .eq('user_id', user.id)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

    // Get badges
    const { data: userBadges } = await supabase
        .from('user_badges')
        .select(`
      *,
      badge:badges(*)
    `)
        .eq('user_id', user.id);

    // Get token balance
    const { data: tokenData } = await supabase
        .from('tokens')
        .select('balance, total_earned')
        .eq('user_id', user.id)
        .single();

    // Get mentor reviews received
    const { data: mentorReviews } = await supabase
        .from('mentor_reviews')
        .select('id, created_at, review_text')
        .eq('target_type', 'project')
        .in('target_id', (projects || []).map((p: { id: string }) => p.id));

    return {
        ...user,
        projects: projects || [],
        failure_logs: failureLogs || [],
        badges: userBadges || [],
        token_balance: tokenData?.balance || 0,
        total_earned: tokenData?.total_earned || 0,
        mentor_reviews_count: mentorReviews?.length || 0,
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const profile = await getProfile(params.username);

    if (!profile) {
        return { title: 'User Not Found' };
    }

    return {
        title: profile.full_name || profile.username || 'User Profile',
        description: profile.bio || `View ${profile.full_name || 'this user'}'s learning journey on Cyberodyssey`,
    };
}

export default async function ProfilePage({ params }: PageProps) {
    const profile = await getProfile(params.username);

    if (!profile) {
        notFound();
    }

    // Build timeline events
    const timelineEvents = [
        ...profile.projects.map((p: any) => ({
            type: 'project',
            title: p.title,
            date: p.created_at,
            slug: p.slug,
            status: p.status,
        })),
        ...profile.failure_logs.map((f: any) => ({
            type: 'failure_log',
            title: f.goal,
            date: f.created_at,
            id: f.id,
        })),
        ...profile.badges.map((b: any) => ({
            type: 'badge',
            title: `Earned: ${b.badge?.name}`,
            date: b.awarded_at,
            badge: b.badge,
        })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const roleStyles = {
        student: null,
        mentor: 'badge-cyan',
        senior_mentor: 'badge-success',
        admin: 'badge-warning',
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Profile Header */}
                <div className="card mb-8">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.full_name || ''}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-slate flex items-center justify-center text-3xl">
                                    {(profile.full_name || 'U')[0].toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold">
                                    {profile.full_name || profile.username || 'Anonymous'}
                                </h1>
                                {profile.role !== 'student' && (
                                    <span className={roleStyles[profile.role as keyof typeof roleStyles] || ''}>
                                        {profile.role.replace('_', ' ')}
                                    </span>
                                )}
                                {profile.is_platform_verified && (
                                    <span className="badge-success">Verified</span>
                                )}
                            </div>

                            {profile.username && (
                                <p className="text-muted-text mb-2">@{profile.username}</p>
                            )}

                            {profile.bio ? (
                                <p className="text-warm-gray mb-4">{profile.bio}</p>
                            ) : (
                                <p className="text-muted-text mb-4 italic">No bio yet</p>
                            )}

                            {/* Edit Profile Button */}
                            <Link
                                href="/profile/edit"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate/50 text-warm-gray hover:text-off-white hover:bg-cyan/10 transition-colors text-sm mb-4"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit Profile
                            </Link>

                            {/* Links */}
                            <div className="flex flex-wrap gap-4 text-sm">
                                {profile.github_url && (
                                    <a
                                        href={profile.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link"
                                    >
                                        GitHub
                                    </a>
                                )}
                                {profile.linkedin_url && (
                                    <a
                                        href={profile.linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="link"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-cyan">{profile.projects.length}</div>
                        <div className="text-sm text-muted-text">Projects</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-warning">{profile.failure_logs.length}</div>
                        <div className="text-sm text-muted-text">Failure Logs</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-success">{profile.badges.length}</div>
                        <div className="text-sm text-muted-text">Badges</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-off-white">{profile.token_balance}</div>
                        <div className="text-sm text-muted-text">Tokens</div>
                    </div>
                </div>

                {/* Badges */}
                {profile.badges.length > 0 && (
                    <div className="card mb-8">
                        <h2 className="text-lg font-semibold mb-4">Badges</h2>
                        <div className="flex flex-wrap gap-3">
                            {profile.badges.map((ub: any) => (
                                <div
                                    key={ub.id}
                                    className="flex items-center gap-2 px-3 py-2 bg-slate/50 rounded-lg"
                                    title={ub.badge?.description}
                                >
                                    <span className="text-xl">{ub.badge?.icon_url || '🏆'}</span>
                                    <span className="text-sm font-medium">{ub.badge?.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timeline */}
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Learning Timeline</h2>
                        {/* Export button placeholder */}
                        <button className="btn-secondary text-sm" disabled>
                            Export PDF (Coming soon)
                        </button>
                    </div>

                    {timelineEvents.length > 0 ? (
                        <div className="relative pl-6">
                            <div className="timeline-line" />
                            {timelineEvents.map((event, index) => (
                                <div key={index} className="relative pb-6 last:pb-0">
                                    <div
                                        className={`absolute left-[-15px] w-3 h-3 rounded-full border-2 border-charcoal ${event.type === 'project' ? 'bg-cyan' :
                                            event.type === 'failure_log' ? 'bg-warning' :
                                                'bg-success'
                                            }`}
                                        style={{ top: '4px' }}
                                    />
                                    <div className="ml-3">
                                        <div className="text-xs text-muted-text mb-1">
                                            {new Date(event.date).toLocaleDateString()}
                                        </div>
                                        {event.type === 'project' && (
                                            <Link
                                                href={`/projects/${event.slug}`}
                                                className="font-medium hover:text-cyan transition-colors"
                                            >
                                                📁 {event.title}
                                                <span className={`ml-2 text-xs ${event.status === 'COMPLETED' ? 'text-success' : 'text-warm-gray'
                                                    }`}>
                                                    {event.status.replace('_', ' ')}
                                                </span>
                                            </Link>
                                        )}
                                        {event.type === 'failure_log' && (
                                            <p className="font-medium text-warning">
                                                📝 Logged: {event.title}
                                            </p>
                                        )}
                                        {event.type === 'badge' && (
                                            <p className="font-medium text-success">
                                                🏆 {event.title}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-warm-gray py-8">
                            No activity yet. Start by creating a project!
                        </p>
                    )}
                </div>
                {/* Projects List Section */}
                <div id="projects" className="card mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Projects</h2>
                        <Link href="/new/project" className="text-sm text-cyan hover:underline">
                            + New Project
                        </Link>
                    </div>
                    {profile.projects.length > 0 ? (
                        <div className="grid gap-4">
                            {profile.projects.map((project: any) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.slug}`}
                                    className="block p-4 bg-slate/30 rounded-lg hover:bg-slate/50 transition-colors border border-transparent hover:border-cyan/30"
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-medium text-off-white">{project.title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'COMPLETED' ? 'bg-success/20 text-success' :
                                            project.status === 'ABANDONED' ? 'bg-error/20 text-error' :
                                                'bg-cyan/20 text-cyan'
                                            }`}>
                                            {project.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-text mt-2">
                                        Created {new Date(project.created_at).toLocaleDateString()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-text italic">No projects yet.</p>
                    )}
                </div>

                {/* Failure Logs List Section */}
                <div id="logs" className="card mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">Failure Logs</h2>
                        <Link href="/new/failure-log" className="text-sm text-warning hover:underline">
                            + Log Failure
                        </Link>
                    </div>
                    {profile.failure_logs.length > 0 ? (
                        <div className="grid gap-4">
                            {profile.failure_logs.map((log: any) => (
                                <div
                                    key={log.id}
                                    className="p-4 bg-slate/30 rounded-lg border-l-2 border-warning"
                                >
                                    <h3 className="font-medium text-off-white mb-1">{log.goal}</h3>
                                    <div className="text-xs text-muted-text">
                                        Logged {new Date(log.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-text italic">No failure logs yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
