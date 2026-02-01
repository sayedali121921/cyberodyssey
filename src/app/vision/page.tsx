import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Vision',
    description: 'The mission and vision behind Cyberodyssey - making learning visible and valuable.',
};

export default function VisionPage() {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-4">
                        Our Mission
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Making Learning <span className="gradient-text">Visible</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
                        We believe the journey matters as much as the destination.
                        Cyberodyssey is building a world where learning from failure
                        is celebrated, not hidden.
                    </p>
                </div>

                {/* Vision Cards */}
                <div className="grid gap-8 md:grid-cols-2 mb-16">
                    <div className="card">
                        <div className="text-4xl mb-4">🎯</div>
                        <h2 className="text-xl font-bold mb-3">Our Vision</h2>
                        <p className="text-warm-gray">
                            A world where every learner has a verifiable digital identity
                            that showcases their growth journey, not just certificates.
                            Where employers value the learning process, and where failure
                            is recognized as a step toward mastery.
                        </p>
                    </div>
                    <div className="card">
                        <div className="text-4xl mb-4">💡</div>
                        <h2 className="text-xl font-bold mb-3">Our Mission</h2>
                        <p className="text-warm-gray">
                            To create a platform where students can document their learning
                            journeys authentically, receive meaningful feedback from mentors,
                            and build portfolios that tell the real story of their growth.
                        </p>
                    </div>
                </div>

                {/* Values */}
                <div className="card mb-16">
                    <h2 className="text-2xl font-bold mb-8 text-center">Our Core Values</h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { icon: '🔓', title: 'Transparency', desc: 'Real learning is messy. We embrace the struggles.' },
                            { icon: '🤝', title: 'Community', desc: 'Learning is better together. Help others, grow together.' },
                            { icon: '📈', title: 'Growth Mindset', desc: 'Failure is not the opposite of success, it\'s part of it.' },
                            { icon: '🛡️', title: 'Trust', desc: 'Verified mentors, authentic feedback, real progress.' },
                            { icon: '🌍', title: 'Accessibility', desc: 'Quality learning support for everyone, everywhere.' },
                            { icon: '✨', title: 'Excellence', desc: 'Striving to be the best platform for learning documentation.' },
                        ].map((value) => (
                            <div key={value.title} className="text-center p-4">
                                <div className="text-3xl mb-2">{value.icon}</div>
                                <h3 className="font-semibold mb-1">{value.title}</h3>
                                <p className="text-sm text-muted-text">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Roadmap */}
                <div className="card mb-16">
                    <h2 className="text-2xl font-bold mb-8 text-center">Roadmap</h2>
                    <div className="space-y-6">
                        {[
                            { phase: 'Phase 1', title: 'Foundation', status: 'complete', items: ['Core platform launch', 'Project documentation', 'Failure logs', 'Mentor system'] },
                            { phase: 'Phase 2', title: 'Growth', status: 'current', items: ['Token economy', 'Badges & achievements', 'Research library', 'Mobile optimization'] },
                            { phase: 'Phase 3', title: 'Scale', status: 'upcoming', items: ['Institution partnerships', 'API access', 'Advanced analytics', 'Mobile app'] },
                        ].map((phase) => (
                            <div key={phase.phase} className={`p-4 rounded-xl border ${phase.status === 'complete' ? 'border-success/30 bg-success/5' : phase.status === 'current' ? 'border-cyan/30 bg-cyan/5' : 'border-slate/30'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${phase.status === 'complete' ? 'bg-success/20 text-success' : phase.status === 'current' ? 'bg-cyan/20 text-cyan' : 'bg-slate/20 text-muted-text'}`}>
                                        {phase.phase}
                                    </span>
                                    <h3 className="font-semibold">{phase.title}</h3>
                                    {phase.status === 'current' && <span className="text-xs text-cyan animate-pulse">In Progress</span>}
                                </div>
                                <ul className="grid grid-cols-2 gap-2">
                                    {phase.items.map((item) => (
                                        <li key={item} className="text-sm text-warm-gray flex items-center gap-2">
                                            <span className={phase.status === 'complete' ? 'text-success' : 'text-muted-text'}>
                                                {phase.status === 'complete' ? '✓' : '○'}
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Join Our Journey</h2>
                    <p className="text-warm-gray mb-6">Be part of the learning revolution.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/auth/login" className="btn-primary px-8 py-3">
                            Get Started
                        </Link>
                        <Link href="/donate" className="btn-secondary px-8 py-3">
                            Support Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
