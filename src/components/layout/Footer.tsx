import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-slate/30 bg-charcoal/80 backdrop-blur-sm py-12 px-4 mt-auto">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 md:grid-cols-5">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal font-bold text-sm">
                                CO
                            </div>
                            <span className="font-bold">
                                <span className="text-cyan">Cyber</span>
                                <span className="text-off-white">odyssey</span>
                            </span>
                        </Link>
                        <p className="text-xs text-muted-text mb-4">
                            Making learning visible. Celebrating the journey.
                        </p>
                        <div className="flex gap-2">
                            <a href="https://github.com/cyberodyssey" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate/30 flex items-center justify-center hover:bg-cyan/20 transition-colors text-sm">🐙</a>
                            <a href="https://discord.gg/cyberodyssey" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate/30 flex items-center justify-center hover:bg-cyan/20 transition-colors text-sm">💬</a>
                            <a href="https://twitter.com/cyberodyssey" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-slate/30 flex items-center justify-center hover:bg-cyan/20 transition-colors text-sm">🐦</a>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-semibold text-off-white mb-3 text-sm">Explore</h3>
                        <ul className="space-y-2 text-sm text-warm-gray">
                            <li><Link href="/projects" className="hover:text-cyan transition-colors">Projects</Link></li>
                            <li><Link href="/failure-logs" className="hover:text-cyan transition-colors">Failure Logs</Link></li>
                            <li><Link href="/resources" className="hover:text-cyan transition-colors">Resources</Link></li>
                            <li><Link href="/research" className="hover:text-cyan transition-colors">Research Papers</Link></li>
                        </ul>
                    </div>

                    {/* Community */}
                    <div>
                        <h3 className="font-semibold text-off-white mb-3 text-sm">Community</h3>
                        <ul className="space-y-2 text-sm text-warm-gray">
                            <li><Link href="/community" className="hover:text-cyan transition-colors">Community Hub</Link></li>
                            <li><Link href="/mentors" className="hover:text-cyan transition-colors">Mentors</Link></li>
                            <li><Link href="/leaderboard" className="hover:text-cyan transition-colors">Leaderboard</Link></li>
                            <li><Link href="/blog" className="hover:text-cyan transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold text-off-white mb-3 text-sm">Company</h3>
                        <ul className="space-y-2 text-sm text-warm-gray">
                            <li><Link href="/about" className="hover:text-cyan transition-colors">About Us</Link></li>
                            <li><Link href="/vision" className="hover:text-cyan transition-colors">Our Vision</Link></li>
                            <li><Link href="/careers" className="hover:text-cyan transition-colors">Careers</Link></li>
                            <li><Link href="/donate" className="hover:text-cyan transition-colors">Support Us</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-off-white mb-3 text-sm">Legal</h3>
                        <ul className="space-y-2 text-sm text-warm-gray">
                            <li><Link href="/privacy" className="hover:text-cyan transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-cyan transition-colors">Terms of Service</Link></li>
                            <li><Link href="/guidelines" className="hover:text-cyan transition-colors">Guidelines</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate/30 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-text">
                        © {new Date().getFullYear()} Cyberodyssey. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-text">
                        Built with 💙 for learners everywhere
                    </p>
                </div>
            </div>
        </footer>
    );
}

