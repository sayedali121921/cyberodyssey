import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Insights, tutorials, and stories from the Cyberodyssey community.',
};

const blogPosts = [
    {
        id: 1,
        title: 'Why Failure Logs Are Your Secret Weapon for Learning',
        excerpt: 'Discover how documenting your failures can accelerate your growth as a developer and help others avoid the same pitfalls.',
        author: 'Cyberodyssey Team',
        date: '2024-01-28',
        category: 'Learning',
        readTime: '5 min',
        featured: true,
    },
    {
        id: 2,
        title: 'The Power of Learning in Public',
        excerpt: 'How sharing your learning journey can open doors, build connections, and make you a better developer.',
        author: 'Sarah Chen',
        date: '2024-01-25',
        category: 'Career',
        readTime: '7 min',
        featured: true,
    },
    {
        id: 3,
        title: '10 Project Ideas for Cybersecurity Beginners',
        excerpt: 'Practical project ideas to start building your cybersecurity portfolio, with failure log examples.',
        author: 'Alex Kumar',
        date: '2024-01-22',
        category: 'Projects',
        readTime: '8 min',
    },
    {
        id: 4,
        title: 'How to Write a Great Project Documentation',
        excerpt: 'Tips and templates for documenting your projects in a way that showcases your problem-solving skills.',
        author: 'James Wilson',
        date: '2024-01-20',
        category: 'Tutorial',
        readTime: '6 min',
    },
    {
        id: 5,
        title: 'From Student to Mentor: My Cyberodyssey Journey',
        excerpt: 'A personal story of growth, giving back, and the impact of community mentorship.',
        author: 'Maria Garcia',
        date: '2024-01-18',
        category: 'Stories',
        readTime: '4 min',
    },
    {
        id: 6,
        title: 'Building a Secure Authentication System: Lessons Learned',
        excerpt: 'A deep dive into common authentication pitfalls and how to avoid them in your projects.',
        author: 'Cyberodyssey Team',
        date: '2024-01-15',
        category: 'Security',
        readTime: '10 min',
    },
];

const categories = ['All', 'Learning', 'Career', 'Projects', 'Tutorial', 'Stories', 'Security'];

export default function BlogPage() {
    const featuredPosts = blogPosts.filter(p => p.featured);
    const regularPosts = blogPosts.filter(p => !p.featured);

    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium mb-4">
                        Blog
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Insights & <span className="gradient-text">Stories</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                        Tutorials, learning strategies, and inspiring stories from our community.
                    </p>
                </div>

                {/* Featured Posts */}
                <div className="grid gap-6 md:grid-cols-2 mb-16">
                    {featuredPosts.map((post) => (
                        <article key={post.id} className="card card-hover group">
                            <div className="aspect-video rounded-lg bg-gradient-to-br from-cyan/20 to-magenta/20 mb-4 flex items-center justify-center">
                                <span className="text-6xl opacity-50">📝</span>
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-2 py-1 rounded text-xs bg-warning/10 text-warning">{post.category}</span>
                                <span className="text-xs text-muted-text">{post.readTime} read</span>
                            </div>
                            <h2 className="text-xl font-bold mb-2 group-hover:text-cyan transition-colors">{post.title}</h2>
                            <p className="text-warm-gray text-sm mb-4">{post.excerpt}</p>
                            <div className="flex items-center justify-between text-xs text-muted-text">
                                <span>By {post.author}</span>
                                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${cat === 'All'
                                    ? 'bg-cyan text-charcoal'
                                    : 'bg-slate/30 text-warm-gray hover:bg-cyan/20 hover:text-cyan'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Regular Posts */}
                <div className="space-y-6 mb-16">
                    {regularPosts.map((post) => (
                        <article key={post.id} className="card card-hover">
                            <div className="flex gap-6">
                                <div className="hidden sm:block w-24 h-24 rounded-lg bg-gradient-to-br from-slate/50 to-charcoal flex-shrink-0 flex items-center justify-center">
                                    <span className="text-3xl opacity-50">📄</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-0.5 rounded text-xs bg-slate/30 text-warm-gray">{post.category}</span>
                                        <span className="text-xs text-muted-text">{post.readTime} read</span>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-1 hover:text-cyan transition-colors">{post.title}</h3>
                                    <p className="text-sm text-muted-text mb-2 line-clamp-2">{post.excerpt}</p>
                                    <div className="flex items-center gap-4 text-xs text-muted-text">
                                        <span>By {post.author}</span>
                                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Newsletter CTA */}
                <div className="card text-center p-8 bg-gradient-to-r from-warning/10 to-transparent">
                    <h2 className="text-xl font-bold mb-3">Stay Updated</h2>
                    <p className="text-warm-gray mb-6 max-w-lg mx-auto">
                        Get the latest articles, learning resources, and community updates in your inbox.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="input flex-1"
                        />
                        <button className="btn-primary">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
