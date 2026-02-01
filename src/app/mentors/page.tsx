import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient, isMockMode } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Mentors',
    description: 'Connect with verified mentors who can guide your learning journey.',
};

const mockMentors = [
    { id: '1', full_name: 'Dr. Sarah Chen', username: 'sarahchen', role: 'senior_mentor', bio: 'Senior Software Engineer at Google. 10+ years in distributed systems and ML.', avatar_url: null, specialties: ['System Design', 'Machine Learning', 'Python'], reviews_given: 156 },
    { id: '2', full_name: 'James Wilson', username: 'jameswilson', role: 'mentor', bio: 'Full-stack developer and tech lead. Passionate about mentoring new developers.', avatar_url: null, specialties: ['React', 'Node.js', 'TypeScript'], reviews_given: 89 },
    { id: '3', full_name: 'Maria Garcia', username: 'mariag', role: 'mentor', bio: 'Mobile developer specializing in React Native and iOS. Google Developer Expert.', avatar_url: null, specialties: ['React Native', 'iOS', 'Mobile'], reviews_given: 67 },
    { id: '4', full_name: 'Alex Kumar', username: 'alexk', role: 'senior_mentor', bio: 'Security researcher and CTF enthusiast. Currently at Microsoft Security.', avatar_url: null, specialties: ['Cybersecurity', 'Penetration Testing', 'Python'], reviews_given: 124 },
    { id: '5', full_name: 'Emily Zhang', username: 'emilyz', role: 'mentor', bio: 'Data scientist focused on NLP and computer vision. PhD from Stanford.', avatar_url: null, specialties: ['Data Science', 'NLP', 'Deep Learning'], reviews_given: 45 },
    { id: '6', full_name: 'Michael Brown', username: 'mikeb', role: 'mentor', bio: 'DevOps engineer with expertise in cloud architecture and automation.', avatar_url: null, specialties: ['AWS', 'Kubernetes', 'CI/CD'], reviews_given: 78 },
];

async function getMentors() {
    if (isMockMode) {
        return mockMentors;
    }

    const supabase = createClient();
    const { data } = await supabase
        .from('users')
        .select('*')
        .in('role', ['mentor', 'senior_mentor'])
        .order('created_at', { ascending: false });

    return data || mockMentors;
}

export default async function MentorsPage() {
    const mentors = await getMentors();

    return (
        <div className="min-h-screen py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Hero */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium mb-4">
                        Expert Guidance
                    </span>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Learn from <span className="gradient-text">Industry Experts</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                        Our verified mentors are experienced professionals who volunteer
                        their time to help you grow as a developer.
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16">
                    <div className="card text-center py-4">
                        <div className="text-2xl font-bold text-success">47</div>
                        <div className="text-xs text-muted-text">Active Mentors</div>
                    </div>
                    <div className="card text-center py-4">
                        <div className="text-2xl font-bold text-cyan">1.2k+</div>
                        <div className="text-xs text-muted-text">Reviews Given</div>
                    </div>
                    <div className="card text-center py-4">
                        <div className="text-2xl font-bold text-warning">4.8★</div>
                        <div className="text-xs text-muted-text">Avg Rating</div>
                    </div>
                </div>

                {/* Mentor Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
                    {mentors.map((mentor: any) => (
                        <Link
                            key={mentor.id}
                            href={`/profile/${mentor.username}`}
                            className="card card-hover"
                        >
                            <div className="flex items-start gap-4 mb-4">
                                {mentor.avatar_url ? (
                                    <img src={mentor.avatar_url} alt={mentor.full_name} className="w-14 h-14 rounded-full object-cover" />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-success to-teal-400 flex items-center justify-center text-charcoal font-bold text-lg">
                                        {mentor.full_name?.[0] || 'M'}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold">{mentor.full_name}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded ${mentor.role === 'senior_mentor' ? 'bg-success/20 text-success' : 'bg-cyan/20 text-cyan'}`}>
                                            {mentor.role === 'senior_mentor' ? 'Senior Mentor' : 'Mentor'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-warm-gray mb-4 line-clamp-2">{mentor.bio}</p>
                            {mentor.specialties && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {mentor.specialties.slice(0, 3).map((specialty: string) => (
                                        <span key={specialty} className="text-xs px-2 py-1 rounded bg-slate/30 text-muted-text">
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="text-xs text-muted-text">
                                📝 {mentor.reviews_given || 0} reviews given
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Become a Mentor CTA */}
                <div className="card text-center p-8 bg-gradient-to-r from-success/10 to-transparent">
                    <div className="text-4xl mb-4">🌟</div>
                    <h2 className="text-xl font-bold mb-3">Become a Mentor</h2>
                    <p className="text-warm-gray mb-6 max-w-lg mx-auto">
                        Share your expertise, give back to the community, and help shape
                        the next generation of developers.
                    </p>
                    <Link href="/mentor/apply" className="btn-primary">
                        Apply to Mentor
                    </Link>
                </div>
            </div>
        </div>
    );
}
