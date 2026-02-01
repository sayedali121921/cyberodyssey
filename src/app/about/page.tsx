import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Cyberodyssey - a student-focused learning-in-public platform.',
};

const team = [
    { name: 'Founder', role: 'Vision & Strategy', bio: 'Passionate about making learning accessible and celebrating the learning journey, not just the destination.' },
];

const milestones = [
    { year: '2024', event: 'Cyberodyssey Founded', description: 'Started with a simple idea: make learning visible.' },
    { year: '2024', event: 'First 100 Users', description: 'Community started growing organically.' },
    { year: '2024', event: 'Mentor Program Launch', description: 'Industry experts joined to give back.' },
    { year: '2025', event: 'Platform v2.0', description: 'Major redesign with enhanced features.' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-4">
                        Our Story
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        About <span className="gradient-text">Cyberodyssey</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
                        We're building a world where learning in public is celebrated,
                        failures are stepping stones, and growth is the ultimate achievement.
                    </p>
                </div>

                {/* Story */}
                <div className="card mb-12">
                    <h2 className="text-2xl font-bold mb-4">The Problem We're Solving</h2>
                    <div className="space-y-4 text-warm-gray">
                        <p>
                            Traditional education focuses on grades and certifications.
                            Job applications focus on final projects and polished portfolios.
                            But the real learning happens in between — in the struggles,
                            the debugging sessions, the failed attempts.
                        </p>
                        <p>
                            <span className="text-off-white font-medium">Cyberodyssey</span> was born from a simple observation:
                            the most valuable lessons often come from failure, yet we hide our failures
                            and only show our successes.
                        </p>
                        <p>
                            We believe in <span className="text-cyan font-medium">learning in public</span> —
                            documenting not just what you built, but how you built it, what went wrong,
                            and what you learned along the way.
                        </p>
                    </div>
                </div>

                {/* What Makes Us Different */}
                <div className="grid gap-6 md:grid-cols-2 mb-12">
                    <div className="card">
                        <div className="text-3xl mb-3">📝</div>
                        <h3 className="text-lg font-semibold mb-2">Failure Logs</h3>
                        <p className="text-sm text-warm-gray">
                            We encourage documenting failures. Not to shame, but to learn.
                            Your struggles become valuable lessons for others.
                        </p>
                    </div>
                    <div className="card">
                        <div className="text-3xl mb-3">🎯</div>
                        <h3 className="text-lg font-semibold mb-2">Learning Identity</h3>
                        <p className="text-sm text-warm-gray">
                            Build a verifiable portfolio that shows your growth journey,
                            not just your finished work.
                        </p>
                    </div>
                    <div className="card">
                        <div className="text-3xl mb-3">👨‍🏫</div>
                        <h3 className="text-lg font-semibold mb-2">Expert Mentorship</h3>
                        <p className="text-sm text-warm-gray">
                            Get feedback from verified industry professionals who
                            volunteer their time to help learners grow.
                        </p>
                    </div>
                    <div className="card">
                        <div className="text-3xl mb-3">🤝</div>
                        <h3 className="text-lg font-semibold mb-2">Community First</h3>
                        <p className="text-sm text-warm-gray">
                            Learn together, help each other, and celebrate wins —
                            big and small — as a community.
                        </p>
                    </div>
                </div>

                {/* Timeline */}
                <div className="card mb-12">
                    <h2 className="text-2xl font-bold mb-6">Our Journey</h2>
                    <div className="space-y-6">
                        {milestones.map((milestone, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-shrink-0 w-16 text-sm font-bold text-cyan">{milestone.year}</div>
                                <div className="flex-1 pb-6 border-l-2 border-slate/30 pl-6 relative">
                                    <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-cyan"></div>
                                    <h3 className="font-semibold">{milestone.event}</h3>
                                    <p className="text-sm text-muted-text">{milestone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
                    <p className="text-warm-gray mb-6 max-w-lg mx-auto">
                        Whether you're just starting or you're an experienced developer
                        looking to give back, there's a place for you here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/login" className="btn-primary">Start Learning</Link>
                        <Link href="/mentor/apply" className="btn-secondary">Become a Mentor</Link>
                        <Link href="/donate" className="btn-ghost border border-slate">Support Us</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
