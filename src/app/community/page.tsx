import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: 'Community',
    description: 'Join the Cyberodyssey community of learners, share your journey, and grow together.',
};

export const dynamic = 'force-dynamic';

async function getCommunityData() {
    const supabase = createClient();

    // Parallel data fetching
    const [
        { count: memberCount },
        { count: failureLogCount },
        { count: mentorCount },
        { data: recentLogs }
    ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('failure_logs').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }).in('role', ['mentor', 'senior_mentor']),
        supabase
            .from('failure_logs')
            .select(`
                id,
                goal,
                what_went_wrong,
                created_at,
                users (
                    full_name,
                    username,
                    avatar_url
                )
            `)
            .order('created_at', { ascending: false })
            .limit(10)
    ]);

    return {
        stats: {
            members: memberCount || 0,
            discussions: failureLogCount || 0,
            mentors: mentorCount || 0,
            countries: 12 // Placeholder as we don't track countries yet
        },
        discussions: recentLogs || []
    };
}

export default async function CommunityPage() {
    const { stats, discussions } = await getCommunityData();

    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-4">
                        Community
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Learn <span className="gradient-text">Together</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                        Join thousands of learners sharing their journeys, celebrating failures,
                        and growing as developers together.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-cyan">{stats.members.toLocaleString()}</div>
                        <div className="text-sm text-muted-text">Members</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-success">{stats.discussions}</div>
                        <div className="text-sm text-muted-text">Failure Logs (Discussions)</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-warning">{stats.mentors}</div>
                        <div className="text-sm text-muted-text">Active Mentors</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-off-white">{stats.countries}+</div>
                        <div className="text-sm text-muted-text">Countries</div>
                    </div>
                </div>

                {/* Featured Discussions (Recent Failure Logs) */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Recent Learning Logs</h2>
                        <Link href="/new/failure-log" className="btn-secondary text-sm">Post a Log</Link>
                    </div>
                    <div className="space-y-4">
                        {discussions.map((log: any) => (
                            <Link key={log.id} href={`/failure-log/${log.id}`} className="card card-hover block">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal font-bold text-sm flex-shrink-0 overflow-hidden relative">
                                        {log.users?.avatar_url ? (
                                            <img src={log.users.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{(log.users?.full_name || 'U')[0]}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold truncate text-lg group-hover:text-cyan transition-colors">{log.goal}</h3>
                                        </div>
                                        <p className="text-sm text-warm-gray line-clamp-1 mb-2">
                                            Failed at: "{log.what_went_wrong}"
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-text">
                                            <span>{log.users?.full_name || 'Anonymous'}</span>
                                            <span className="px-2 py-0.5 rounded bg-slate/30">Failure Log</span>
                                            <span>{new Date(log.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {discussions.length === 0 && (
                            <div className="text-center py-12 text-muted-text bg-white/5 rounded-xl">
                                No discussions yet. Be the first to share your failure!
                            </div>
                        )}
                    </div>
                </div>

                {/* Community Channels */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <a href="https://discord.gg/cyberodyssey" target="_blank" rel="noopener noreferrer" className="card card-hover text-center p-8 group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💬</div>
                        <h3 className="text-lg font-semibold mb-2">Discord Server</h3>
                        <p className="text-sm text-muted-text mb-4">Real-time chat, study groups, and voice channels</p>
                        <span className="text-cyan text-sm">Join Server →</span>
                    </a>
                    <a href="https://github.com/cyberodyssey" target="_blank" rel="noopener noreferrer" className="card card-hover text-center p-8 group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🐙</div>
                        <h3 className="text-lg font-semibold mb-2">GitHub Organization</h3>
                        <p className="text-sm text-muted-text mb-4">Open source projects and contributions</p>
                        <span className="text-cyan text-sm">View Repos →</span>
                    </a>
                    <a href="https://twitter.com/cyberodyssey" target="_blank" rel="noopener noreferrer" className="card card-hover text-center p-8 group">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🐦</div>
                        <h3 className="text-lg font-semibold mb-2">Twitter/X</h3>
                        <p className="text-sm text-muted-text mb-4">Daily tips, updates, and community highlights</p>
                        <span className="text-cyan text-sm">Follow Us →</span>
                    </a>
                </div>

                {/* Community Guidelines CTA */}
                <div className="card text-center p-8 bg-gradient-to-r from-cyan/10 to-transparent">
                    <h2 className="text-xl font-bold mb-3">Be Part of Something Special</h2>
                    <p className="text-warm-gray mb-6 max-w-lg mx-auto">
                        Our community thrives on mutual respect, constructive feedback, and celebrating each other's growth.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/login" className="btn-primary">Join the Community</Link>
                        <Link href="/guidelines" className="btn-secondary">Read Guidelines</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
