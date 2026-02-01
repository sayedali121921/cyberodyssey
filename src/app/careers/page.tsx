import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Careers',
    description: 'Join the Cyberodyssey team and help build the future of learning.',
};

const openPositions = [
    {
        id: 1,
        title: 'Full Stack Developer',
        department: 'Engineering',
        location: 'Remote',
        type: 'Full-time',
        description: 'Build and maintain our core platform using Next.js, TypeScript, and Supabase.',
    },
    {
        id: 2,
        title: 'Developer Advocate',
        department: 'Community',
        location: 'Remote',
        type: 'Full-time',
        description: 'Create content, engage with our community, and represent Cyberodyssey at events.',
    },
    {
        id: 3,
        title: 'Content Writer',
        department: 'Marketing',
        location: 'Remote',
        type: 'Part-time',
        description: 'Write tutorials, blog posts, and educational content for our community.',
    },
    {
        id: 4,
        title: 'UI/UX Designer',
        department: 'Design',
        location: 'Remote',
        type: 'Contract',
        description: 'Design beautiful, accessible interfaces that make learning enjoyable.',
    },
];

const benefits = [
    { icon: '🌍', title: 'Remote First', desc: 'Work from anywhere in the world' },
    { icon: '📚', title: 'Learning Budget', desc: '₹50k/year for courses and books' },
    {
        icon: '⏰', title: 'Flexible Hours', desc: 'Work when you're most productive' },
    { icon: '💰', title: 'Competitive Pay', desc: 'Salary + equity options' },
    { icon: '🏥', title: 'Health Insurance', desc: 'Coverage for you and family' },
    { icon: '🎯', title: 'Mission-Driven', desc: 'Work that matters' },
];

export default function CareersPage() {
    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                        Join Our Team
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Build the Future of <span className="gradient-text">Learning</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                        We're looking for passionate people who believe in making learning
                        accessible, celebrating growth, and building something meaningful.
                    </p>
                </div>

                {/* Why Join Us */}
                <div className="card mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-center">Why Cyberodyssey?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="text-center p-4">
                                <div className="text-3xl mb-2">{benefit.icon}</div>
                                <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                                <p className="text-xs text-muted-text">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Open Positions */}
                <div className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
                    <div className="space-y-4">
                        {openPositions.map((position) => (
                            <div key={position.id} className="card card-hover">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-1">{position.title}</h3>
                                        <p className="text-sm text-muted-text mb-2">{position.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 rounded text-xs bg-slate/30 text-warm-gray">{position.department}</span>
                                            <span className="px-2 py-1 rounded text-xs bg-cyan/10 text-cyan">{position.location}</span>
                                            <span className="px-2 py-1 rounded text-xs bg-success/10 text-success">{position.type}</span>
                                        </div>
                                    </div>
                                    <a
                                        href={`mailto:careers@cyberodyssey.org?subject=Application for ${position.title}`}
                                        className="btn-primary text-sm whitespace-nowrap"
                                    >
                                        Apply Now
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* No Opening? */}
                <div className="card text-center p-8 bg-gradient-to-r from-cyan/10 to-transparent">
                    <h2 className="text-xl font-bold mb-3">Don't See Your Role?</h2>
                    <p className="text-warm-gray mb-6 max-w-lg mx-auto">
                        We're always looking for talented people. Send us your resume and
                        tell us how you'd like to contribute.
                    </p>
                    <a
                        href="mailto:careers@cyberodyssey.org?subject=General Application"
                        className="btn-secondary"
                    >
                        Send Open Application
                    </a>
                </div>

                {/* Volunteer */}
                <div className="mt-12 text-center">
                    <h2 className="text-lg font-semibold mb-2">Want to Volunteer?</h2>
                    <p className="text-warm-gray text-sm mb-4">
                        Become a mentor and help shape the next generation of developers.
                    </p>
                    <Link href="/mentor/apply" className="text-cyan hover:text-cyan-hover">
                        Learn about mentoring →
                    </Link>
                </div>
            </div>
        </div>
    );
}
