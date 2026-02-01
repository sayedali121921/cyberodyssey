import Link from 'next/link';
import { createClient, isMockMode } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function getFeaturedProjects() {
    if (isMockMode) {
        return [
            { id: '1', title: 'AI Content Analyzer', slug: 'ai-content-analyzer', description: 'Building a machine learning tool to analyze blog posts', tags: ['React', 'Python', 'ML'], user: { full_name: 'Sarah Chen', username: 'sarahc' } },
            { id: '2', title: 'E-Commerce Platform', slug: 'ecommerce-platform', description: 'Full-stack e-commerce with Next.js and Stripe', tags: ['Next.js', 'Stripe', 'PostgreSQL'], user: { full_name: 'James Wilson', username: 'jameswilson' } },
            { id: '3', title: 'Mobile Fitness App', slug: 'mobile-fitness-app', description: 'React Native fitness tracker with health integrations', tags: ['React Native', 'Firebase'], user: { full_name: 'Maria Garcia', username: 'mariag' } },
        ];
    }

    const supabase = createClient();

    const { data } = await supabase
        .from('projects')
        .select(`
            id,
            title,
            slug,
            description,
            tags,
            image_urls,
            user:users(full_name, username, avatar_url)
        `)
        .eq('status', 'IN_PROGRESS')
        .order('created_at', { ascending: false })
        .limit(6);

    return data || [];
}

async function getStats() {
    if (isMockMode) {
        return { projects: 247, users: 1893, logs: 892 };
    }

    const supabase = createClient();

    const [projectsRes, usersRes, logsRes] = await Promise.all([
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('failure_logs').select('*', { count: 'exact', head: true }),
    ]);

    return {
        projects: projectsRes.count || 0,
        users: usersRes.count || 0,
        logs: logsRes.count || 0,
    };
}

export default async function HomePage() {
    const [featuredProjects, stats] = await Promise.all([
        getFeaturedProjects(),
        getStats(),
    ]);

    const testimonials = [
        {
            quote: "Documenting my failures changed how I learn. Now I actually remember what went wrong and can help others avoid the same pitfalls.",
            author: "Alex Kumar",
            role: "Full Stack Developer",
            avatar: "AK"
        },
        {
            quote: "The mentor feedback I got here was more valuable than any online course. Real developers reviewing my actual code!",
            author: "Priya Sharma",
            role: "Computer Science Student",
            avatar: "PS"
        },
        {
            quote: "My Cyberodyssey profile helped me land my first dev job. Employers loved seeing my learning process, not just finished projects.",
            author: "Michael Chen",
            role: "Junior Developer @ Tech Corp",
            avatar: "MC"
        }
    ];

    const features = [
        {
            icon: '📁',
            title: 'Project Documentation',
            description: 'Track your projects from idea to completion. Document your thought process, decisions, and iterations.',
            color: 'cyan'
        },
        {
            icon: '📝',
            title: 'Failure Logs',
            description: 'Turn mistakes into lessons. Log what went wrong, what you tried, and what you learned.',
            color: 'warning'
        },
        {
            icon: '💬',
            title: 'Mentor Feedback',
            description: 'Get constructive feedback from verified mentors who have been where you are.',
            color: 'success'
        },
        {
            icon: '🎯',
            title: 'Learning Identity',
            description: 'Build a verifiable portfolio that showcases your growth journey, not just end results.',
            color: 'magenta'
        },
        {
            icon: '🏆',
            title: 'Token Economy',
            description: 'Earn tokens for contributions. Help others, get recognized, unlock platform features.',
            color: 'warning'
        },
        {
            icon: '👥',
            title: 'Community Learning',
            description: 'Learn from others failures and successes. Share your journey, inspire fellow learners.',
            color: 'cyan'
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center overflow-hidden">
                {/* Animated gradient mesh */}
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-graphite/50 to-charcoal" />

                {/* Glowing accent lines */}
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan/30 to-transparent" />
                <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-magenta/20 to-transparent" />

                {/* Content */}
                <div className="relative z-10 max-w-5xl">
                    {/* Badge */}
                    <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan/30 bg-cyan/5 px-5 py-2.5 backdrop-blur-sm">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan"></span>
                        </span>
                        <span className="text-sm font-medium text-cyan">Learning in public platform</span>
                        <span className="text-xs text-muted-text">— {stats.users.toLocaleString()}+ learners</span>
                    </div>

                    <h1 className="mb-8 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl tracking-tight">
                        Document your learning
                        <span className="block mt-2 bg-gradient-to-r from-cyan via-teal-300 to-cyan bg-clip-text text-transparent">
                            — failures included.
                        </span>
                    </h1>

                    <p className="mx-auto mb-12 max-w-2xl text-lg text-warm-gray md:text-xl leading-relaxed">
                        We make learning visible. Build your verifiable learning identity
                        through projects and growth documentation. <span className="text-off-white font-medium">Show growth, not just results.</span>
                    </p>

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <Link
                            href="/auth/login"
                            className="group relative overflow-hidden btn-primary text-lg px-10 py-4 rounded-xl"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Start Your Journey
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </Link>
                        <Link
                            href="/projects"
                            className="btn-secondary text-lg px-10 py-4 rounded-xl group"
                        >
                            <span className="flex items-center gap-2">
                                Explore Projects
                                <span className="text-xs bg-cyan/20 px-2 py-0.5 rounded-full">{stats.projects}</span>
                            </span>
                        </Link>
                    </div>

                    {/* Stats row */}
                    <div className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-cyan mb-1">{stats.projects.toLocaleString()}</div>
                            <div className="text-sm text-muted-text">Projects Documented</div>
                        </div>
                        <div className="text-center border-x border-slate/30">
                            <div className="text-3xl md:text-4xl font-bold text-off-white mb-1">{stats.users.toLocaleString()}</div>
                            <div className="text-sm text-muted-text">Learners Growing</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl md:text-4xl font-bold text-warning mb-1">{stats.logs.toLocaleString()}</div>
                            <div className="text-sm text-muted-text">Failures Logged</div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Features Grid Section */}
            <section className="py-24 px-4 relative">
                <div className="section-divider absolute top-0 left-0 right-0" />

                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-4">
                            Platform Features
                        </span>
                        <h2 className="text-3xl font-bold md:text-5xl mb-4">
                            Everything you need to <span className="gradient-text">grow as a developer</span>
                        </h2>
                        <p className="text-lg text-warm-gray max-w-2xl mx-auto">
                            A complete ecosystem designed around the learning journey, not just the destination.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="feature-card group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`text-4xl mb-4 group-hover:scale-110 transition-transform`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-warm-gray text-sm leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 px-4 bg-gradient-to-b from-graphite/30 to-transparent">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
                            How It Works
                        </span>
                        <h2 className="text-3xl font-bold md:text-5xl mb-4">
                            Your learning journey in <span className="gradient-text-warm">4 simple steps</span>
                        </h2>
                    </div>

                    <div className="grid gap-8 md:grid-cols-4 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-cyan via-warning to-success" />

                        {[
                            { step: '01', title: 'Create Project', description: 'Start documenting what you are building. Set goals and track progress publicly.', icon: '📁', color: 'cyan' },
                            { step: '02', title: 'Log Failures', description: 'When things break, document it. Your struggles become learning resources.', icon: '📝', color: 'warning' },
                            { step: '03', title: 'Get Feedback', description: 'Receive constructive feedback from verified mentors and engaged peers.', icon: '💬', color: 'success' },
                            { step: '04', title: 'Build Identity', description: 'Create a verifiable learning transcript that showcases your growth.', icon: '🎯', color: 'magenta' },
                        ].map((item, index) => (
                            <div key={item.step} className="relative text-center">
                                <div className={`relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-${item.color}/20 border border-${item.color}/30 flex items-center justify-center text-3xl shadow-lg`}>
                                    {item.icon}
                                </div>
                                <div className="text-xs font-bold text-cyan mb-2">{item.step}</div>
                                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-warm-gray">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="py-24 px-4">
                <div className="mx-auto max-w-6xl">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-4">
                                Featured Journeys
                            </span>
                            <h2 className="text-3xl font-bold md:text-4xl">
                                See how others document their growth
                            </h2>
                        </div>
                        <Link href="/projects" className="hidden md:flex items-center gap-2 text-cyan hover:text-cyan-hover transition-colors">
                            View all projects
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {featuredProjects.slice(0, 3).map((project: any) => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.slug}`}
                                className="card card-hover group"
                            >
                                <div className="mb-4 h-40 rounded-lg bg-gradient-to-br from-slate/50 to-charcoal flex items-center justify-center overflow-hidden">
                                    <div className="text-5xl opacity-50 group-hover:scale-110 transition-transform">🚀</div>
                                </div>
                                <h3 className="text-lg font-semibold mb-2 group-hover:text-cyan transition-colors">
                                    {project.title}
                                </h3>
                                {project.user && (
                                    <p className="text-sm text-muted-text mb-3 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal text-[10px] font-bold">
                                            {(project.user.full_name || 'U')[0]}
                                        </span>
                                        {project.user.full_name || project.user.username}
                                    </p>
                                )}
                                {project.tags && project.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.slice(0, 3).map((tag: string) => (
                                            <span key={tag} className="tag text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link href="/projects" className="btn-secondary">
                            View All Projects →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-4 bg-gradient-to-b from-graphite/30 to-transparent">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                            Community Voices
                        </span>
                        <h2 className="text-3xl font-bold md:text-4xl">
                            What learners are saying
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="card relative">
                                <div className="absolute top-6 left-6 text-4xl text-cyan/20">"</div>
                                <p className="relative z-10 text-warm-gray mb-6 italic leading-relaxed pl-6">
                                    {testimonial.quote}
                                </p>
                                <div className="flex items-center gap-3 pt-4 border-t border-slate/30">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal font-bold text-sm">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{testimonial.author}</p>
                                        <p className="text-xs text-muted-text">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-4 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-graphite/50 to-charcoal" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan/10 rounded-full blur-3xl" />

                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    <h2 className="mb-6 text-4xl font-bold md:text-5xl">
                        Ready to document your <span className="gradient-text">learning journey</span>?
                    </h2>
                    <p className="mb-10 text-lg text-warm-gray">
                        Join a community of {stats.users.toLocaleString()}+ learners who value growth over perfection.
                        Start building your verifiable learning identity today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/auth/login"
                            className="btn-primary text-lg px-10 py-4 rounded-xl"
                        >
                            Create Your First Project
                        </Link>
                        <Link
                            href="/resources"
                            className="btn-ghost text-lg px-10 py-4 rounded-xl border border-slate hover:border-cyan/30"
                        >
                            Browse Resources
                        </Link>
                    </div>
                </div>
            </section>

            {/* Simple Footer */}
            <footer className="border-t border-slate/30 py-12 px-4">
                <div className="mx-auto max-w-6xl">
                    <div className="grid gap-8 md:grid-cols-4 mb-12">
                        <div>
                            <Link href="/" className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal font-bold text-sm">
                                    CO
                                </div>
                                <span className="text-lg font-bold">Cyberodyssey</span>
                            </Link>
                            <p className="text-sm text-muted-text">
                                A student-focused learning-in-public platform. Document your journey, grow together.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Platform</h4>
                            <ul className="space-y-2 text-sm text-muted-text">
                                <li><Link href="/projects" className="hover:text-cyan transition-colors">Projects</Link></li>
                                <li><Link href="/resources" className="hover:text-cyan transition-colors">Resources</Link></li>
                                <li><Link href="/mentors" className="hover:text-cyan transition-colors">Mentors</Link></li>
                                <li><Link href="/community" className="hover:text-cyan transition-colors">Community</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Company</h4>
                            <ul className="space-y-2 text-sm text-muted-text">
                                <li><Link href="/about" className="hover:text-cyan transition-colors">About</Link></li>
                                <li><Link href="/vision" className="hover:text-cyan transition-colors">Vision</Link></li>
                                <li><Link href="/blog" className="hover:text-cyan transition-colors">Blog</Link></li>
                                <li><Link href="/careers" className="hover:text-cyan transition-colors">Careers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-text">
                                <li><Link href="/privacy" className="hover:text-cyan transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="hover:text-cyan transition-colors">Terms</Link></li>
                                <li><Link href="/guidelines" className="hover:text-cyan transition-colors">Guidelines</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate/30 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-text">
                        <p>© 2024 Cyberodyssey. Document your journey.</p>
                        <div className="flex gap-6">
                            <a href="https://twitter.com/cyberodyssey" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">Twitter</a>
                            <a href="https://github.com/cyberodyssey" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">GitHub</a>
                            <a href="https://discord.gg/cyberodyssey" target="_blank" rel="noopener noreferrer" className="hover:text-cyan transition-colors">Discord</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
