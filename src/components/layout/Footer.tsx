import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-slate py-8 px-4 mt-auto">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="text-xl font-serif font-bold text-cyan">
                            Cyberodyssey
                        </Link>
                        <p className="mt-2 text-sm text-muted-text">
                            Document your learning journey — failures included.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="font-semibold text-off-white mb-3">Platform</h3>
                        <ul className="space-y-2 text-sm text-warm-gray">
                            <li>
                                <Link href="/projects" className="hover:text-cyan transition-colors">
                                    Explore Projects
                                </Link>
                            </li>
                            <li>
                                <Link href="/resources" className="hover:text-cyan transition-colors">
                                    Resources
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="hover:text-cyan transition-colors">
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link href="/mentor/apply" className="hover:text-cyan transition-colors">
                                    Become a Mentor
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 className="font-semibold text-off-white mb-3">About</h3>
                        <ul className="space-y-2 text-sm text-warm-gray">
                            <li>
                                <Link href="/vision" className="hover:text-cyan transition-colors">
                                    Our Vision
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className="hover:text-cyan transition-colors">
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link href="/support" className="hover:text-cyan transition-colors">
                                    Support Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-off-white mb-3">Legal</h3>
                        <ul className="space-y-2 text-sm text-warm-gray">
                            <li>
                                <Link href="/privacy" className="hover:text-cyan transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-cyan transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-text">
                        © {new Date().getFullYear()} Cyberodyssey. We value the process more than the polish.
                    </p>
                    <div className="flex items-center gap-4 text-muted-text">
                        <a
                            href="https://github.com/cyberodessy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan transition-colors"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://twitter.com/cyberodessy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-cyan transition-colors"
                        >
                            Twitter
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
