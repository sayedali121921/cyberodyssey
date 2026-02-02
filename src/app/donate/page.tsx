import Link from 'next/link';
import type { Metadata } from 'next';
import DonationButton from '@/components/donate/DonationButton';

export const metadata: Metadata = {
    title: 'Support Cyberodyssey | Empower Open Learning',
    description: 'Help us build the future of failure-driven learning. Your support keeps Cyberodyssey free and accessible for everyone.',
};

export default function DonatePage() {
    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan/5 rounded-full blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto space-y-16">

                {/* Hero Section */}
                <section className="text-center space-y-6 relative">
                    <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-magenta/20 to-purple-500/20 mb-4 animate-bounce-slow">
                        <span className="text-4xl">💝</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan via-white to-magenta">
                        Support the Odyssey
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto leading-relaxed">
                        Cyberodyssey is built on the belief that <span className="text-white font-medium">failure is data</span>, not defeat.
                        Your contribution helps us keep this platform free, ad-free, and accessible to every learner worldwide.
                    </p>
                </section>

                {/* Impact Grid */}
                <section className="grid md:grid-cols-3 gap-6">
                    <div className="card p-6 text-center space-y-2 border-cyan/20 bg-gradient-to-b from-charcoal to-cyan/5">
                        <div className="text-3xl font-bold text-cyan">100%</div>
                        <div className="text-sm text-muted-text font-medium uppercase tracking-wider">Free for Students</div>
                    </div>
                    <div className="card p-6 text-center space-y-2 border-magenta/20 bg-gradient-to-b from-charcoal to-magenta/5">
                        <div className="text-3xl font-bold text-magenta">Zero</div>
                        <div className="text-sm text-muted-text font-medium uppercase tracking-wider">Data Selling</div>
                    </div>
                    <div className="card p-6 text-center space-y-2 border-warning/20 bg-gradient-to-b from-charcoal to-warning/5">
                        <div className="text-3xl font-bold text-warning">Open</div>
                        <div className="text-sm text-muted-text font-medium uppercase tracking-wider">Source Code</div>
                    </div>
                </section>

                {/* Donation Options */}
                <section className="max-w-2xl mx-auto w-full">
                    <div className="card bg-slate/10 p-1 border-white/5">
                        <div className="space-y-4 p-6">
                            <h2 className="text-2xl font-bold text-center mb-8">Choose Your Method</h2>

                            {/* PayPal */}
                            <div className="group relative overflow-hidden rounded-xl border border-slate/30 bg-charcoal hover:border-cyan/50 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        💳
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">PayPal</h3>
                                        <p className="text-sm text-muted-text">Secure one-time or monthly support</p>
                                    </div>
                                    <a
                                        href="https://paypal.me/cyberodyssey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-secondary text-sm px-6 py-2.5"
                                    >
                                        Donate
                                    </a>
                                </div>
                            </div>

                            {/* Bank Transfer */}
                            <div className="group relative overflow-hidden rounded-xl border border-slate/30 bg-charcoal hover:border-success/50 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        🏦
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">Bank Transfer</h3>
                                        <p className="text-sm text-muted-text">Direct 100% transfer with no fees</p>
                                    </div>
                                    <DonationButton message="Contact us at donate@cyberodyssey.org for bank details">
                                        Get Info
                                    </DonationButton>
                                </div>
                            </div>

                            {/* Crypto */}
                            <div className="group relative overflow-hidden rounded-xl border border-slate/30 bg-charcoal hover:border-warning/50 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-warning/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        ₿
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg">Cryptocurrency</h3>
                                        <p className="text-sm text-muted-text">BTC, ETH, USDT accepted</p>
                                    </div>
                                    <DonationButton message="Contact us at donate@cyberodyssey.org for wallet addresses">
                                        Wallets
                                    </DonationButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Support */}
                <section className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Where does the money go?</h2>
                        <ul className="space-y-3">
                            {[
                                { icon: '🖥️', text: 'Server & Database Costs' },
                                { icon: '🔧', text: 'Development Tools & APIs' },
                                { icon: '📚', text: 'Acquiring Educational Content' },
                                { icon: '🌍', text: 'Community Outreach Programs' },
                            ].map((item) => (
                                <li key={item.text} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <span>{item.icon}</span>
                                    <span className="text-warm-gray">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-charcoal to-slate/20 border border-slate/30 text-center">
                        <p className="text-xl italic font-serif text-warm-gray mb-4">
                            "We are two students with a laptop and a dream. Every coffee you buy us converts directly into lines of code."
                        </p>
                        <div className="text-cyan font-bold">— Sayed & Mujtaba</div>
                    </div>
                </section>

                <div className="text-center pt-8 border-t border-slate/10">
                    <Link href="/" className="text-muted-text hover:text-cyan transition-colors text-sm">
                        ← Returns to Home
                    </Link>
                </div>

            </div>
        </div>
    );
}
