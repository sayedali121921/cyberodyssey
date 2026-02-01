'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
    user?: {
        id: string;
        role?: string;
        username?: string;
    } | null;
}

export default function Sidebar({ isOpen = true, onClose, user }: SidebarProps) {
    const pathname = usePathname();

    const mainNavigation = [
        { name: 'Dashboard', href: '/dashboard', icon: '🏠', description: 'Your overview' },
        { name: 'Projects', href: '/projects', icon: '📁', description: 'Browse all projects' },
        { name: 'Failure Logs', href: '/failure-logs', icon: '📝', description: 'Learning moments' },
        { name: 'Resources', href: '/resources', icon: '📚', description: 'Curated learning' },
    ];

    const communityNavigation = [
        { name: 'Mentors', href: '/mentors', icon: '👨‍🏫', description: 'Find guidance' },
        { name: 'Community', href: '/community', icon: '👥', description: 'Connect with learners' },
        { name: 'Leaderboard', href: '/leaderboard', icon: '🏆', description: 'Top contributors' },
    ];

    const creatorNavigation = [
        { name: 'New Project', href: '/new/project', icon: '➕', description: 'Start something new' },
        { name: 'Log Failure', href: '/new/failure-log', icon: '✍️', description: 'Document a struggle' },
    ];

    const adminNavigation = [
        { name: 'Admin Dashboard', href: '/admin', icon: '🛡️', description: 'Platform management' },
    ];

    const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

    const NavSection = ({ title, items }: { title: string; items: typeof mainNavigation }) => (
        <div className="mb-6">
            <h3 className="px-4 mb-2 text-xs font-semibold text-muted-text uppercase tracking-wider">
                {title}
            </h3>
            <nav className="flex flex-col gap-1">
                {items.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        onClick={onClose}
                        className={`sidebar-item group ${isActive(item.href) ? 'active' : ''}`}
                    >
                        <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                            <span className="block text-sm font-medium">{item.name}</span>
                            <span className="block text-xs text-muted-text truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.description}
                            </span>
                        </div>
                        {isActive(item.href) && (
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                        )}
                    </Link>
                ))}
            </nav>
        </div>
    );

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`sidebar scrollbar-thin transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="p-4">
                    {/* User quick stats */}
                    {user && (
                        <div className="card mb-6 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal font-bold">
                                    {user.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Welcome back!</p>
                                    <p className="text-xs text-muted-text">@{user.username || 'user'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2 rounded-lg bg-charcoal/50">
                                    <div className="text-lg font-bold text-cyan">0</div>
                                    <div className="text-[10px] text-muted-text">Projects</div>
                                </div>
                                <div className="p-2 rounded-lg bg-charcoal/50">
                                    <div className="text-lg font-bold text-warning">0</div>
                                    <div className="text-[10px] text-muted-text">Logs</div>
                                </div>
                                <div className="p-2 rounded-lg bg-charcoal/50">
                                    <div className="text-lg font-bold text-off-white">0</div>
                                    <div className="text-[10px] text-muted-text">Tokens</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation sections */}
                    <NavSection title="Explore" items={mainNavigation} />
                    <NavSection title="Community" items={communityNavigation} />

                    {user && (
                        <NavSection title="Create" items={creatorNavigation} />
                    )}

                    {user?.role === 'admin' && (
                        <NavSection title="Admin" items={adminNavigation} />
                    )}

                    {/* Become a mentor CTA */}
                    {user && user.role !== 'mentor' && user.role !== 'senior_mentor' && user.role !== 'admin' && (
                        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-cyan/10 to-transparent border border-cyan/20">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">🌟</span>
                                <h4 className="font-semibold text-sm">Become a Mentor</h4>
                            </div>
                            <p className="text-xs text-muted-text mb-3">
                                Share your expertise and help others grow on their learning journey.
                            </p>
                            <Link
                                href="/mentor/apply"
                                className="block w-full text-center text-xs font-medium py-2 rounded-lg bg-cyan/20 text-cyan hover:bg-cyan/30 transition-colors"
                            >
                                Apply Now
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate/30 bg-charcoal/80">
                    <div className="flex items-center justify-between text-xs text-muted-text">
                        <span>© 2024 Cyberodyssey</span>
                        <div className="flex gap-3">
                            <Link href="/privacy" className="hover:text-cyan transition-colors">Privacy</Link>
                            <Link href="/terms" className="hover:text-cyan transition-colors">Terms</Link>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
