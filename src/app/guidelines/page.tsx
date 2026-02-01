import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Community Guidelines',
    description: 'Cyberodyssey Community Guidelines - How we build a respectful, supportive learning community.',
};

export default function GuidelinesPage() {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-4">
                        Community
                    </span>
                    <h1 className="text-4xl font-bold mb-4">Community Guidelines</h1>
                    <p className="text-warm-gray">
                        Our community is built on respect, growth, and mutual support.
                        These guidelines help us maintain a positive learning environment for everyone.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Core Values */}
                    <section className="card">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-2xl">🌟</span> Our Core Values
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="p-4 rounded-lg bg-charcoal/50">
                                <h3 className="font-semibold text-cyan mb-2">Growth Mindset</h3>
                                <p className="text-sm text-warm-gray">
                                    We believe intelligence and skills can be developed. Failure is learning.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-charcoal/50">
                                <h3 className="font-semibold text-success mb-2">Constructive Feedback</h3>
                                <p className="text-sm text-warm-gray">
                                    We give feedback that helps others improve, not criticism that tears down.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-charcoal/50">
                                <h3 className="font-semibold text-warning mb-2">Respect & Inclusion</h3>
                                <p className="text-sm text-warm-gray">
                                    We welcome everyone regardless of background, identity, or experience level.
                                </p>
                            </div>
                            <div className="p-4 rounded-lg bg-charcoal/50">
                                <h3 className="font-semibold text-off-white mb-2">Authenticity</h3>
                                <p className="text-sm text-warm-gray">
                                    We share our real journeys, including the struggles and failures.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Do's */}
                    <section className="card border-success/30">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-2xl">✅</span> Community Do's
                        </h2>
                        <ul className="space-y-4">
                            {[
                                { title: 'Be Supportive', desc: 'Encourage others, celebrate their wins, and offer help when you can.' },
                                { title: 'Share Your Journey', desc: 'Document your learning process, including the messy parts. Your struggles help others.' },
                                { title: 'Ask Questions', desc: 'No question is too basic. We all start somewhere.' },
                                { title: 'Give Thoughtful Feedback', desc: 'When reviewing others\' work, be specific, constructive, and kind.' },
                                { title: 'Credit Others', desc: 'Acknowledge help, inspiration, and resources you\'ve used.' },
                                { title: 'Keep Learning', desc: 'Stay curious, try new things, and embrace challenges.' },
                            ].map((item) => (
                                <li key={item.title} className="flex gap-3">
                                    <span className="text-success flex-shrink-0">✓</span>
                                    <div>
                                        <span className="font-medium text-off-white">{item.title}:</span>{' '}
                                        <span className="text-warm-gray">{item.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Don'ts */}
                    <section className="card border-error/30">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-2xl">🚫</span> Community Don'ts
                        </h2>
                        <ul className="space-y-4">
                            {[
                                { title: 'Harassment or Bullying', desc: 'No personal attacks, insults, or targeting of individuals.' },
                                { title: 'Discrimination', desc: 'No prejudice based on race, gender, religion, sexuality, or any other identity.' },
                                { title: 'Spam or Self-Promotion', desc: 'Don\'t post unrelated content or excessive self-promotion.' },
                                { title: 'Plagiarism', desc: 'Don\'t copy others\' work without attribution. Give credit where it\'s due.' },
                                { title: 'Destructive Criticism', desc: 'Don\'t tear down others\' work. Critique constructively or not at all.' },
                                { title: 'Sharing Private Info', desc: 'Don\'t share others\' personal information without consent.' },
                            ].map((item) => (
                                <li key={item.title} className="flex gap-3">
                                    <span className="text-error flex-shrink-0">✗</span>
                                    <div>
                                        <span className="font-medium text-off-white">{item.title}:</span>{' '}
                                        <span className="text-warm-gray">{item.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Feedback Guidelines */}
                    <section className="card">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <span className="text-2xl">💬</span> Giving Great Feedback
                        </h2>
                        <div className="space-y-4 text-warm-gray">
                            <p>Good feedback is the heart of our community. Here's how to do it well:</p>
                            <div className="grid gap-3 text-sm">
                                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                                    <span className="font-medium text-success">Do:</span> "The error handling here could be improved. Consider adding try-catch for the API call."
                                </div>
                                <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                                    <span className="font-medium text-error">Don't:</span> "This code is terrible. You have no idea what you're doing."
                                </div>
                            </div>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Be specific about what could be improved</li>
                                <li>Explain why, not just what</li>
                                <li>Acknowledge what's done well</li>
                                <li>Suggest resources when helpful</li>
                            </ul>
                        </div>
                    </section>

                    {/* Reporting */}
                    <section className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-2xl">🚨</span> Reporting Issues
                        </h2>
                        <p className="text-warm-gray mb-4">
                            If you see content or behavior that violates these guidelines, please report it:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-warm-gray text-sm mb-6">
                            <li>Use the "Report" button on any content</li>
                            <li>Email us at <span className="text-cyan">safety@cyberodyssey.org</span></li>
                            <li>DM a moderator on Discord</li>
                        </ul>
                        <p className="text-sm text-muted-text">
                            Reports are reviewed within 24 hours. We take all reports seriously.
                        </p>
                    </section>

                    {/* Consequences */}
                    <section className="card">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                            <span className="text-2xl">⚖️</span> Enforcement
                        </h2>
                        <p className="text-warm-gray mb-4">
                            Violations of these guidelines may result in:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-warm-gray text-sm">
                            <li><span className="font-medium text-off-white">Warning:</span> First-time or minor violations</li>
                            <li><span className="font-medium text-warning">Temporary Suspension:</span> Repeated or moderate violations</li>
                            <li><span className="font-medium text-error">Permanent Ban:</span> Severe or continued violations</li>
                        </ol>
                    </section>

                    {/* CTA */}
                    <div className="text-center py-8">
                        <p className="text-warm-gray mb-4">
                            By using Cyberodyssey, you agree to follow these guidelines.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/community" className="btn-primary">Join the Community</Link>
                            <Link href="/terms" className="btn-secondary">View Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
