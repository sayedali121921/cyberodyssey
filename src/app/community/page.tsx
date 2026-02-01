import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Community',
    description: 'Join the Cyberodyssey community of learners, share your journey, and grow together.',
};

const discussions = [
    { id: 1, title: 'Best practices for documenting your first project', author: 'Sarah Chen', replies: 24, category: 'Tips', hot: true },
    { id: 2, title: 'How I turned my biggest failure into a learning opportunity', author: 'James Wilson', replies: 45, category: 'Stories', hot: true },
    { id: 3, title: 'Resources for learning system design', author: 'Maria Garcia', replies: 18, category: 'Resources' },
    { id: 4, title: 'Weekly Challenge: Build a CLI tool in any language', author: 'Community Team', replies: 67, category: 'Challenges', hot: true },
    { id: 5, title: 'Seeking feedback on my portfolio project', author: 'Alex Kumar', replies: 12, category: 'Feedback' },
];

const stats = { members: 1893, discussions: 324, mentors: 47, countries: 28 };

export default function CommunityPage() {
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
                        <div className="text-sm text-muted-text">Discussions</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-warning">{stats.mentors}</div>
                        <div className="text-sm text-muted-text">Active Mentors</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-3xl font-bold text-off-white">{stats.countries}</div>
                        <div className="text-sm text-muted-text">Countries</div>
                    </div>
                </div>

                {/* Featured Discussions */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Trending Discussions</h2>
                        <button className="btn-secondary text-sm">Start Discussion</button>
                    </div>
                    <div className="space-y-4">
                        {discussions.map((discussion) => (
                            <div key={discussion.id} className="card card-hover">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal font-bold text-sm flex-shrink-0">
                                        {discussion.author[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold truncate">{discussion.title}</h3>
                                            {discussion.hot && (
                                                <span className="px-2 py-0.5 rounded text-xs bg-error/20 text-error">🔥 Hot</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-muted-text">
                                            <span>{discussion.author}</span>
                                            <span className="px-2 py-0.5 rounded bg-slate/30">{discussion.category}</span>
                                            <span>💬 {discussion.replies} replies</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
