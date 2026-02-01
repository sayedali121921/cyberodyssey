'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchResult {
    type: 'page' | 'project' | 'action';
    title: string;
    description?: string;
    href: string;
    icon: string;
}

const defaultResults: SearchResult[] = [
    // Navigation
    { type: 'page', title: 'Dashboard', href: '/dashboard', icon: '🏠', description: 'Your personal dashboard' },
    { type: 'page', title: 'Projects', href: '/projects', icon: '📁', description: 'Browse all projects' },
    { type: 'page', title: 'Failure Logs', href: '/failure-logs', icon: '📝', description: 'Learn from failures' },
    { type: 'page', title: 'Community', href: '/community', icon: '👥', description: 'Join the community' },
    { type: 'page', title: 'Mentors', href: '/mentors', icon: '👨‍🏫', description: 'Connect with mentors' },
    { type: 'page', title: 'Leaderboard', href: '/leaderboard', icon: '🏆', description: 'Top contributors' },
    { type: 'page', title: 'Resources', href: '/resources', icon: '📚', description: 'Learning resources' },
    { type: 'page', title: 'Research Papers', href: '/research', icon: '📄', description: 'Academic papers' },
    { type: 'page', title: 'Blog', href: '/blog', icon: '✍️', description: 'Articles and tutorials' },
    { type: 'page', title: 'About', href: '/about', icon: 'ℹ️', description: 'About Cyberodyssey' },
    { type: 'page', title: 'Our Vision', href: '/vision', icon: '🎯', description: 'Our mission and values' },
    { type: 'page', title: 'Donate', href: '/donate', icon: '💝', description: 'Support the platform' },
    { type: 'page', title: 'Careers', href: '/careers', icon: '💼', description: 'Join our team' },
    // Actions
    { type: 'action', title: 'New Project', href: '/new/project', icon: '➕', description: 'Create a new project' },
    { type: 'action', title: 'New Failure Log', href: '/new/failure-log', icon: '📝', description: 'Document a failure' },
    { type: 'action', title: 'Edit Profile', href: '/profile/edit', icon: '⚙️', description: 'Update your profile' },
];

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const filteredResults = query === ''
        ? defaultResults.slice(0, 8)
        : defaultResults.filter((result) =>
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description?.toLowerCase().includes(query.toLowerCase())
        );

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Open with Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
        }

        // Close with Escape
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleSelect = (result: SearchResult) => {
        router.push(result.href);
        setIsOpen(false);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, filteredResults.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
            handleSelect(filteredResults[selectedIndex]);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm z-50"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50 animate-scale-in">
                <div className="bg-slate border border-slate/50 rounded-xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 p-4 border-b border-slate/50">
                        <svg className="w-5 h-5 text-muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search pages, projects, or actions..."
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setSelectedIndex(0);
                            }}
                            onKeyDown={handleInputKeyDown}
                            className="flex-1 bg-transparent outline-none text-off-white placeholder-muted-text"
                        />
                        <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-charcoal rounded text-muted-text">
                            ESC
                        </kbd>
                    </div>

                    {/* Results */}
                    <div className="max-h-80 overflow-y-auto p-2">
                        {filteredResults.length === 0 ? (
                            <div className="p-4 text-center text-muted-text">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {filteredResults.map((result, index) => (
                                    <button
                                        key={`${result.type}-${result.href}`}
                                        onClick={() => handleSelect(result)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${index === selectedIndex
                                                ? 'bg-cyan/20 text-cyan'
                                                : 'hover:bg-charcoal/50 text-warm-gray'
                                            }`}
                                    >
                                        <span className="text-lg">{result.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">{result.title}</div>
                                            {result.description && (
                                                <div className="text-xs text-muted-text truncate">{result.description}</div>
                                            )}
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded ${result.type === 'action' ? 'bg-success/20 text-success' : 'bg-slate/50 text-muted-text'
                                            }`}>
                                            {result.type === 'action' ? 'Action' : 'Page'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-3 border-t border-slate/50 text-xs text-muted-text">
                        <div className="flex items-center gap-4">
                            <span><kbd className="px-1.5 py-0.5 bg-charcoal rounded">↑↓</kbd> Navigate</span>
                            <span><kbd className="px-1.5 py-0.5 bg-charcoal rounded">↵</kbd> Select</span>
                        </div>
                        <span>Powered by Cyberodyssey</span>
                    </div>
                </div>
            </div>
        </>
    );
}

// Search trigger button component
export function SearchTrigger() {
    return (
        <button
            onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
                document.dispatchEvent(event);
            }}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate/30 text-muted-text hover:text-off-white hover:bg-slate/50 transition-colors text-sm"
        >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search</span>
            <kbd className="ml-2 px-1.5 py-0.5 text-xs bg-charcoal rounded">⌘K</kbd>
        </button>
    );
}
