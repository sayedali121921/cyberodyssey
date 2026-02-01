'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const taglines = [
    "Document your failures.",
    "Celebrate your growth.",
    "Learn in public.",
    "Build your identity.",
];

const floatingIcons = [
    { icon: '💻', delay: 0, x: 15, y: 20 },
    { icon: '🔒', delay: 1, x: 80, y: 15 },
    { icon: '🐛', delay: 2, x: 10, y: 70 },
    { icon: '🚀', delay: 3, x: 85, y: 65 },
    { icon: '⚡', delay: 4, x: 25, y: 85 },
    { icon: '🎯', delay: 5, x: 75, y: 80 },
];

export function AnimatedHero() {
    const [taglineIndex, setTaglineIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(true);
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        const currentTagline = taglines[taglineIndex];

        if (isTyping) {
            if (displayText.length < currentTagline.length) {
                const timeout = setTimeout(() => {
                    setDisplayText(currentTagline.slice(0, displayText.length + 1));
                }, 80);
                return () => clearTimeout(timeout);
            } else {
                // Pause at full text
                const timeout = setTimeout(() => {
                    setIsTyping(false);
                }, 2000);
                return () => clearTimeout(timeout);
            }
        } else {
            if (displayText.length > 0) {
                const timeout = setTimeout(() => {
                    setDisplayText(displayText.slice(0, -1));
                }, 40);
                return () => clearTimeout(timeout);
            } else {
                // Move to next tagline
                setTaglineIndex((prev) => (prev + 1) % taglines.length);
                setIsTyping(true);
            }
        }
    }, [displayText, isTyping, taglineIndex]);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Floating icons */}
            {floatingIcons.map((item, index) => (
                <div
                    key={index}
                    className="absolute text-4xl opacity-20 animate-float pointer-events-none"
                    style={{
                        left: `${item.x}%`,
                        top: `${item.y}%`,
                        animationDelay: `${item.delay}s`,
                    }}
                >
                    {item.icon}
                </div>
            ))}

            {/* Gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-magenta/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan/10 border border-cyan/20 text-cyan text-sm mb-8 animate-fade-in">
                    <span className="animate-pulse">●</span>
                    <span>Learning in Public Platform</span>
                </div>

                {/* Main heading */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
                    <span className="text-off-white">Where Failures</span>
                    <br />
                    <span className="gradient-text">Become Features</span>
                </h1>

                {/* Typing animation */}
                <div className="h-12 mb-8">
                    <p className="text-2xl md:text-3xl text-warm-gray font-light">
                        <span className="text-cyan">{displayText}</span>
                        <span className="animate-blink text-cyan">|</span>
                    </p>
                </div>

                {/* Description */}
                <p className="text-lg text-warm-gray max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Build your learning identity. Document your journey — the wins,
                    the failures, and everything in between. Get feedback from mentors.
                    Grow with a community that celebrates progress, not perfection.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <Link
                        href="/auth/login"
                        className="btn-primary text-lg px-8 py-4 group relative overflow-hidden"
                    >
                        <span className="relative z-10">Start Your Journey</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan via-teal-400 to-cyan bg-[length:200%] animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <Link
                        href="/projects"
                        className="btn-ghost text-lg px-8 py-4 border border-slate hover:border-cyan"
                    >
                        Explore Projects
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <Stat value="2K+" label="Learners" />
                    <Stat value="500+" label="Projects" />
                    <Stat value="1K+" label="Failure Logs" />
                    <Stat value="50+" label="Mentors" />
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <svg className="w-6 h-6 text-muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan">{value}</div>
            <div className="text-sm text-muted-text">{label}</div>
        </div>
    );
}

// Terminal-style code animation
export function TerminalDemo() {
    const [lines, setLines] = useState<string[]>([]);
    const codeLines = [
        '$ git push origin main',
        '→ Build failed: TypeError at line 42',
        '',
        '# 3 hours of debugging later...',
        '',
        '$ git commit -m "Fix: null check for user object"',
        '$ git push origin main',
        '✓ Build succeeded!',
        '',
        '📝 Failure Log created: "undefined is not a function"',
        '→ Time spent: 3 hours',
        '→ Lesson: Always validate API responses',
        '→ +15 XP earned',
    ];

    useEffect(() => {
        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < codeLines.length) {
                setLines(prev => [...prev, codeLines[currentLine]]);
                currentLine++;
            } else {
                clearInterval(interval);
                // Reset after delay
                setTimeout(() => setLines([]), 3000);
            }
        }, 500);

        return () => clearInterval(interval);
    }, [lines.length === 0]);

    return (
        <div className="bg-charcoal rounded-xl border border-slate/30 overflow-hidden font-mono text-sm">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-slate/30 border-b border-slate/30">
                <div className="w-3 h-3 rounded-full bg-error/70" />
                <div className="w-3 h-3 rounded-full bg-warning/70" />
                <div className="w-3 h-3 rounded-full bg-success/70" />
                <span className="ml-2 text-muted-text text-xs">terminal — learning</span>
            </div>

            {/* Terminal content */}
            <div className="p-4 h-64 overflow-hidden">
                {lines.map((line, index) => (
                    <div
                        key={index}
                        className={`${line.startsWith('$') ? 'text-cyan' :
                                line.startsWith('✓') ? 'text-success' :
                                    line.startsWith('→') ? 'text-warning' :
                                        line.startsWith('📝') ? 'text-magenta' :
                                            line.startsWith('#') ? 'text-muted-text' :
                                                'text-warm-gray'
                            } animate-fade-in`}
                    >
                        {line || '\u00A0'}
                    </div>
                ))}
                <span className="text-cyan animate-blink">▋</span>
            </div>
        </div>
    );
}
