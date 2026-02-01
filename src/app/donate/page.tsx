import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Support Cyberodyssey',
    description: 'Help us build the future of learning documentation. Your support keeps Cyberodyssey free and accessible.',
};

export default function DonatePage() {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="text-6xl mb-4">💝</div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Support <span className="gradient-text">Cyberodyssey</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-xl mx-auto">
                        Help us keep learning accessible. Your contribution directly
                        supports platform development and student resources.
                    </p>
                </div>

                {/* Why Support */}
                <div className="card mb-8">
                    <h2 className="text-xl font-bold mb-4">Why Your Support Matters</h2>
                    <div className="space-y-4 text-warm-gray">
                        <p>
                            Cyberodyssey is built by students, for students. We believe everyone
                            deserves access to quality learning resources and mentorship,
                            regardless of their financial situation.
                        </p>
                        <p>
                            Your donation helps us:
                        </p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[
                                '🖥️ Keep servers running 24/7',
                                '📚 Add more learning resources',
                                '👨‍🏫 Support mentor programs',
                                '🔧 Develop new features',
                                '📱 Build mobile apps',
                                '🌍 Reach more students globally',
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Donation Options */}
                <div className="card mb-8">
                    <h2 className="text-xl font-bold mb-6">Choose How to Support</h2>

                    <div className="space-y-4">
                        {/* PayPal */}
                        <div className="p-4 rounded-xl border border-slate/30 hover:border-cyan/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-2xl">
                                    💳
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">PayPal</h3>
                                    <p className="text-sm text-muted-text">One-time or recurring donation</p>
                                </div>
                                <a
                                    href="https://paypal.me/cyberodyssey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary text-sm px-4 py-2"
                                >
                                    Donate
                                </a>
                            </div>
                        </div>

                        {/* Bank Transfer */}
                        <div className="p-4 rounded-xl border border-slate/30 hover:border-cyan/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center text-2xl">
                                    🏦
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">Bank Transfer</h3>
                                    <p className="text-sm text-muted-text">Direct bank transfer</p>
                                </div>
                                <button
                                    className="btn-secondary text-sm px-4 py-2"
                                    onClick={() => alert('Contact us at donate@cyberodyssey.org for bank details')}
                                >
                                    Get Details
                                </button>
                            </div>
                        </div>

                        {/* Crypto */}
                        <div className="p-4 rounded-xl border border-slate/30 hover:border-cyan/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center text-2xl">
                                    ₿
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold">Cryptocurrency</h3>
                                    <p className="text-sm text-muted-text">Bitcoin, Ethereum, USDT</p>
                                </div>
                                <button
                                    className="btn-secondary text-sm px-4 py-2"
                                    onClick={() => alert('Contact us at donate@cyberodyssey.org for wallet addresses')}
                                >
                                    View Wallets
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transparency */}
                <div className="card mb-8">
                    <h2 className="text-xl font-bold mb-4">100% Transparent</h2>
                    <p className="text-warm-gray mb-4">
                        We believe in full transparency. Here's how donations are typically allocated:
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 rounded-lg bg-cyan/10">
                            <div className="text-2xl font-bold text-cyan">60%</div>
                            <div className="text-xs text-muted-text">Platform Development</div>
                        </div>
                        <div className="p-4 rounded-lg bg-success/10">
                            <div className="text-2xl font-bold text-success">25%</div>
                            <div className="text-xs text-muted-text">Content & Resources</div>
                        </div>
                        <div className="p-4 rounded-lg bg-warning/10">
                            <div className="text-2xl font-bold text-warning">15%</div>
                            <div className="text-xs text-muted-text">Operations</div>
                        </div>
                    </div>
                </div>

                {/* Other Ways */}
                <div className="card">
                    <h2 className="text-xl font-bold mb-4">Other Ways to Help</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 rounded-lg bg-charcoal/50">
                            <div className="text-2xl mb-2">⭐</div>
                            <h3 className="font-semibold text-sm mb-1">Star us on GitHub</h3>
                            <p className="text-xs text-muted-text">Every star helps us grow</p>
                        </div>
                        <div className="p-4 rounded-lg bg-charcoal/50">
                            <div className="text-2xl mb-2">📢</div>
                            <h3 className="font-semibold text-sm mb-1">Spread the Word</h3>
                            <p className="text-xs text-muted-text">Tell your friends about us</p>
                        </div>
                        <div className="p-4 rounded-lg bg-charcoal/50">
                            <div className="text-2xl mb-2">👨‍🏫</div>
                            <h3 className="font-semibold text-sm mb-1">Become a Mentor</h3>
                            <p className="text-xs text-muted-text">Share your expertise</p>
                        </div>
                        <div className="p-4 rounded-lg bg-charcoal/50">
                            <div className="text-2xl mb-2">🐛</div>
                            <h3 className="font-semibold text-sm mb-1">Report Bugs</h3>
                            <p className="text-xs text-muted-text">Help improve the platform</p>
                        </div>
                    </div>
                </div>

                {/* Thank You */}
                <div className="text-center mt-12">
                    <p className="text-warm-gray">
                        Thank you for believing in accessible education. 💙
                    </p>
                    <Link href="/" className="text-cyan hover:text-cyan-hover mt-4 inline-block">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
