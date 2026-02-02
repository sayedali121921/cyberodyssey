import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: 'Leaderboard | Cyberodyssey',
    description: 'Top contributors and community champions.',
};

export const dynamic = 'force-dynamic';

interface LeaderboardUser {
    rank: number;
    name: string;
    username: string;
    score: number;
    avatar: string;
    initial: string;
    badges: string[];
}

async function getLeaderboard(): Promise<LeaderboardUser[]> {
    const supabase = createClient();

    // Fetch top users by total_earned tokens
    const { data: leaders } = await supabase
        .from('tokens')
        .select(`
            total_earned,
            users (
                id,
                full_name,
                username,
                avatar_url,
                role
            )
        `)
        .order('total_earned', { ascending: false })
        .limit(20);

    if (!leaders) return [];

    return leaders.map((item: any, index: number) => ({
        rank: index + 1,
        name: item.users?.full_name || 'Anonymous',
        username: item.users?.username || 'user',
        score: item.total_earned,
        avatar: item.users?.avatar_url,
        initial: (item.users?.full_name || '?')[0].toUpperCase(),
        badges: index < 3 ? ['🏆'] : [] // Placeholder for real badges join
    }));
}

export default async function LeaderboardPage() {
    const topContributors = await getLeaderboard();

    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Hero */}
                <div className="text-center space-y-4">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium">
                        Hall of Fame
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Community <span className="gradient-text">Leaderboard</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                        Recognizing the learners who fail, share, and grow the most.
                    </p>
                </div>

                {/* Top 3 Podium */}
                {topContributors.length >= 3 && (
                    <div className="flex justify-center items-end gap-4 mb-12 min-h-[200px]">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-xl font-bold mb-2 border-2 border-slate-500 overflow-hidden relative">
                                {topContributors[1].avatar ? (
                                    <img src={topContributors[1].avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{topContributors[1].initial}</span>
                                )}
                            </div>
                            <div className="h-32 w-24 bg-slate-800/50 rounded-t-lg flex items-end justify-center pb-4">
                                <span className="font-bold text-slate-400">#2</span>
                            </div>
                            <p className="mt-2 font-medium text-sm max-w-[100px] truncate">{topContributors[1].name}</p>
                        </div>
                        {/* 1st Place */}
                        <div className="flex flex-col items-center z-10">
                            <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center text-2xl font-bold mb-2 border-2 border-warning text-warning overflow-hidden relative">
                                {topContributors[0].avatar ? (
                                    <img src={topContributors[0].avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{topContributors[0].initial}</span>
                                )}
                            </div>
                            <div className="h-40 w-28 bg-warning/10 rounded-t-lg flex items-end justify-center pb-4 border-t border-x border-warning/20">
                                <span className="font-bold text-warning">#1</span>
                            </div>
                            <p className="mt-2 font-bold text-warning max-w-[120px] truncate">{topContributors[0].name}</p>
                        </div>
                        {/* 3rd Place */}
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-orange-900/50 flex items-center justify-center text-xl font-bold mb-2 border-2 border-orange-700 text-orange-400 overflow-hidden relative">
                                {topContributors[2].avatar ? (
                                    <img src={topContributors[2].avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{topContributors[2].initial}</span>
                                )}
                            </div>
                            <div className="h-24 w-24 bg-orange-900/20 rounded-t-lg flex items-end justify-center pb-4">
                                <span className="font-bold text-orange-600">#3</span>
                            </div>
                            <p className="mt-2 font-medium text-sm max-w-[100px] truncate">{topContributors[2].name}</p>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="card border-slate/20">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-muted-text text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-4 rounded-tl-lg">Rank</th>
                                    <th className="p-4">User</th>
                                    <th className="p-4 text-right">Score</th>
                                    <th className="p-4 rounded-tr-lg text-right">Badges</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate/10">
                                {topContributors.map((user) => (
                                    <tr key={user.rank} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-muted-text text-lg">
                                            {user.rank <= 3 ? ['🥇', '🥈', '🥉'][user.rank - 1] : `#${user.rank}`}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan/20 to-blue-500/20 flex items-center justify-center font-bold text-cyan overflow-hidden relative">
                                                    {user.avatar ? (
                                                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span>{user.initial}</span>
                                                    )}
                                                </div>
                                                <span className="font-semibold">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-cyan">
                                            {user.score}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                {user.badges.map((b, i) => (
                                                    <span key={i} title="Badge">{b}</span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {topContributors.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-muted-text">
                                            No contributors found yet. Start logging failures to climb the ranks!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center text-muted-text text-sm">
                    Leaderboards update real-time based on token earnings.
                </div>

            </div>
        </div>
    );
}
