'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface HeaderProps {
    user?: {
        id: string;
        full_name?: string;
        avatar_url?: string;
        username?: string;
        role?: string;
    } | null;
}

export default function Header({ user }: HeaderProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const navigation = [
        { name: 'Projects', href: '/projects', icon: '📁' },
        { name: 'Resources', href: '/resources', icon: '📚' },
        { name: 'Mentors', href: '/mentors', icon: '👨‍🏫' },
    ];

    const isActive = (href: string) => pathname?.startsWith(href);

    return (
        <header className="header">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal font-bold text-lg shadow-lg shadow-cyan/30 group-hover:shadow-cyan/50 transition-shadow">
                        CO
                    </div>
                    <span className="text-xl font-bold hidden sm:block">
                        <span className="text-cyan">Cyber</span>
                        <span className="text-off-white">odyssey</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${isActive(item.href)
                                ? 'text-cyan bg-cyan/10'
                                : 'text-warm-gray hover:text-off-white hover:bg-white/5'
                                }`}
                        >
                            <span>{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Right side actions */}
                <div className="flex items-center gap-3">
                    {/* Search button - triggers Command Palette */}
                    <button
                        onClick={() => {
                            const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
                            document.dispatchEvent(event);
                        }}
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate/30 text-muted-text hover:text-off-white hover:bg-slate/50 transition-all text-sm"
                        aria-label="Search"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Search</span>
                        <kbd className="hidden lg:inline px-1.5 py-0.5 text-xs bg-charcoal rounded ml-2">⌘K</kbd>
                    </button>
                    {/* Mobile search */}
                    <button
                        onClick={() => {
                            const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true });
                            document.dispatchEvent(event);
                        }}
                        className="sm:hidden p-2 rounded-lg text-warm-gray hover:text-off-white hover:bg-white/5 transition-all"
                        aria-label="Search"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>

                    {user ? (
                        <>
                            {/* Create button */}
                            <Link
                                href="/new/project"
                                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-all text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create
                            </Link>

                            {/* Notifications */}
                            <button
                                className="p-2 rounded-lg text-warm-gray hover:text-off-white hover:bg-white/5 transition-all relative"
                                aria-label="Notifications"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-magenta rounded-full" />
                            </button>

                            {/* Profile dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-all"
                                >
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.full_name || ''}
                                            className="w-8 h-8 rounded-full ring-2 ring-cyan/30"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal font-bold text-sm">
                                            {(user.full_name || 'U')[0].toUpperCase()}
                                        </div>
                                    )}
                                    <svg className="w-4 h-4 text-warm-gray hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {profileMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 py-2 glass rounded-xl shadow-xl border border-cyan/10">
                                        <div className="px-4 py-2 border-b border-slate/30">
                                            <p className="font-medium text-sm">{user.full_name || 'User'}</p>
                                            <p className="text-xs text-muted-text">@{user.username || 'user'}</p>
                                        </div>
                                        <Link
                                            href={`/profile/${user.username || user.id}`}
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-warm-gray hover:text-off-white hover:bg-white/5 transition-all"
                                        >
                                            <span>👤</span> Your Profile
                                        </Link>
                                        <Link
                                            href="/settings"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-warm-gray hover:text-off-white hover:bg-white/5 transition-all"
                                        >
                                            <span>⚙️</span> Settings
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-warning hover:bg-white/5 transition-all"
                                            >
                                                <span>🛡️</span> Admin Dashboard
                                            </Link>
                                        )}
                                        <hr className="my-2 border-slate/30" />
                                        <Link
                                            href="/auth/logout"
                                            className="flex items-center gap-3 px-4 py-2 text-sm text-error hover:bg-white/5 transition-all"
                                        >
                                            <span>🚪</span> Sign Out
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/login"
                                className="px-4 py-2 rounded-lg text-warm-gray hover:text-off-white hover:bg-white/5 transition-all text-sm font-medium"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/auth/login"
                                className="btn-primary text-sm px-4 py-2"
                            >
                                Get Started
                            </Link>
                        </>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-warm-gray hover:text-off-white hover:bg-white/5 transition-all"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-4 py-4 border-t border-slate/30 max-h-[70vh] overflow-y-auto">
                    <nav className="flex flex-col gap-1">
                        {/* Main Navigation */}
                        <p className="px-4 py-1 text-xs text-muted-text uppercase tracking-wider">Explore</p>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${isActive(item.href)
                                    ? 'text-cyan bg-cyan/10'
                                    : 'text-warm-gray hover:text-off-white hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                        <Link
                            href="/failure-logs"
                            onClick={() => setMobileMenuOpen(false)}
                            className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all ${isActive('/failure-logs')
                                ? 'text-cyan bg-cyan/10'
                                : 'text-warm-gray hover:text-off-white hover:bg-white/5'
                                }`}
                        >
                            <span className="text-lg">📝</span>
                            Failure Logs
                        </Link>

                        {/* Community */}
                        <p className="px-4 py-1 mt-3 text-xs text-muted-text uppercase tracking-wider">Community</p>
                        <Link
                            href="/community"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-warm-gray hover:text-off-white hover:bg-white/5 transition-all"
                        >
                            <span className="text-lg">👥</span>
                            Community
                        </Link>
                        <Link
                            href="/leaderboard"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-warm-gray hover:text-off-white hover:bg-white/5 transition-all"
                        >
                            <span className="text-lg">🏆</span>
                            Leaderboard
                        </Link>

                        {/* Research & Resources */}
                        <p className="px-4 py-1 mt-3 text-xs text-muted-text uppercase tracking-wider">Learn</p>
                        <Link
                            href="/research"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-warm-gray hover:text-off-white hover:bg-white/5 transition-all"
                        >
                            <span className="text-lg">📄</span>
                            Research Papers
                        </Link>

                        {/* Create */}
                        {user && (
                            <>
                                <p className="px-4 py-1 mt-3 text-xs text-muted-text uppercase tracking-wider">Create</p>
                                <Link
                                    href="/new/project"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-cyan bg-cyan/10"
                                >
                                    <span className="text-lg">➕</span>
                                    New Project
                                </Link>
                                <Link
                                    href="/new/failure-log"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-warning bg-warning/10"
                                >
                                    <span className="text-lg">✍️</span>
                                    Log Failure
                                </Link>
                            </>
                        )}

                        {/* About */}
                        <p className="px-4 py-1 mt-3 text-xs text-muted-text uppercase tracking-wider">About</p>
                        <Link
                            href="/vision"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-warm-gray hover:text-off-white hover:bg-white/5 transition-all"
                        >
                            <span className="text-lg">🎯</span>
                            Our Vision
                        </Link>
                        <Link
                            href="/donate"
                            onClick={() => setMobileMenuOpen(false)}
                            className="px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 text-warm-gray hover:text-off-white hover:bg-white/5 transition-all"
                        >
                            <span className="text-lg">💝</span>
                            Support Us
                        </Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
