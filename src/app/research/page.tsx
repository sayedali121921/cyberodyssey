import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Research Papers',
    description: 'Access our collection of cybersecurity, technology, and learning research papers.',
};

// Sample research papers data - replace with your actual papers
const researchPapers = [
    {
        id: 1,
        title: 'Introduction to Network Security Fundamentals',
        authors: 'Cyberodyssey Research Team',
        category: 'Network Security',
        year: 2024,
        description: 'A comprehensive guide to understanding network security basics, protocols, and best practices.',
        downloadUrl: '#',
        tags: ['security', 'networking', 'beginner'],
    },
    {
        id: 2,
        title: 'Modern Authentication Methods and OAuth 2.0',
        authors: 'Cyberodyssey Research Team',
        category: 'Authentication',
        year: 2024,
        description: 'Deep dive into modern authentication protocols, JWT tokens, and secure login implementations.',
        downloadUrl: '#',
        tags: ['auth', 'oauth', 'jwt'],
    },
    {
        id: 3,
        title: 'Web Application Security: OWASP Top 10',
        authors: 'Cyberodyssey Research Team',
        category: 'Web Security',
        year: 2024,
        description: 'Analysis of the most critical web application security risks and how to prevent them.',
        downloadUrl: '#',
        tags: ['web', 'owasp', 'vulnerabilities'],
    },
    {
        id: 4,
        title: 'Cryptography for Developers',
        authors: 'Cyberodyssey Research Team',
        category: 'Cryptography',
        year: 2024,
        description: 'Practical guide to implementing encryption, hashing, and digital signatures in applications.',
        downloadUrl: '#',
        tags: ['crypto', 'encryption', 'hashing'],
    },
    {
        id: 5,
        title: 'Cloud Security Architecture',
        authors: 'Cyberodyssey Research Team',
        category: 'Cloud Security',
        year: 2024,
        description: 'Best practices for securing cloud infrastructure on AWS, GCP, and Azure.',
        downloadUrl: '#',
        tags: ['cloud', 'aws', 'infrastructure'],
    },
    {
        id: 6,
        title: 'Secure Coding Practices in JavaScript',
        authors: 'Cyberodyssey Research Team',
        category: 'Secure Coding',
        year: 2024,
        description: 'Common JavaScript security vulnerabilities and how to write secure code.',
        downloadUrl: '#',
        tags: ['javascript', 'secure-coding', 'best-practices'],
    },
];

const categories = ['All', 'Network Security', 'Authentication', 'Web Security', 'Cryptography', 'Cloud Security', 'Secure Coding'];

export default function ResearchPage() {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-cyan/10 text-cyan text-sm font-medium mb-4">
                        Knowledge Hub
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Research <span className="gradient-text">Papers</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                        Access our collection of research papers on cybersecurity,
                        technology, and learning methodologies.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12">
                    <div className="card text-center py-4">
                        <div className="text-2xl font-bold text-cyan">100+</div>
                        <div className="text-xs text-muted-text">Papers</div>
                    </div>
                    <div className="card text-center py-4">
                        <div className="text-2xl font-bold text-success">Free</div>
                        <div className="text-xs text-muted-text">Access</div>
                    </div>
                    <div className="card text-center py-4">
                        <div className="text-2xl font-bold text-warning">PDF</div>
                        <div className="text-xs text-muted-text">Format</div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
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

                {/* Papers Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                    {researchPapers.map((paper) => (
                        <div key={paper.id} className="card card-hover">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2 py-1 rounded text-xs bg-cyan/10 text-cyan">
                                    {paper.category}
                                </span>
                                <span className="text-xs text-muted-text">{paper.year}</span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                                {paper.title}
                            </h3>
                            <p className="text-sm text-muted-text mb-3">
                                {paper.authors}
                            </p>
                            <p className="text-sm text-warm-gray mb-4 line-clamp-3">
                                {paper.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {paper.tags.map((tag) => (
                                    <span key={tag} className="text-xs px-2 py-1 rounded bg-slate/30 text-muted-text">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <a
                                href={paper.downloadUrl}
                                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-cyan/10 text-cyan hover:bg-cyan/20 transition-colors text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download PDF
                            </a>
                        </div>
                    ))}
                </div>

                {/* Load More / Coming Soon */}
                <div className="text-center">
                    <div className="card inline-block px-8 py-6">
                        <div className="text-4xl mb-3">📚</div>
                        <h3 className="font-semibold mb-2">More Papers Coming Soon</h3>
                        <p className="text-sm text-muted-text mb-4">
                            We're adding new research papers regularly.
                            Check back for more content!
                        </p>
                        <Link href="/resources" className="text-cyan hover:text-cyan-hover text-sm">
                            Browse Other Resources →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
