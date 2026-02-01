import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: { slug: string };
}

async function getProject(slug: string) {
    const supabase = createClient();

    const { data: project, error } = await supabase
        .from('projects')
        .select(`
      *,
      user:users(id, full_name, username, avatar_url, role, bio)
    `)
        .eq('slug', slug)
        .single();

    if (error || !project) {
        return null;
    }

    // Get failure logs
    const { data: failureLogs } = await supabase
        .from('failure_logs')
        .select('*')
        .eq('project_id', project.id)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

    // Get iterations
    const { data: iterations } = await supabase
        .from('iterations')
        .select('*')
        .eq('project_id', project.id)
        .order('created_at', { ascending: false });

    // Get mentor reviews
    const { data: mentorReviews } = await supabase
        .from('mentor_reviews')
        .select(`
      *,
      mentor:users(id, full_name, username, avatar_url)
    `)
        .eq('target_type', 'project')
        .eq('target_id', project.id);

    // Get comment count
    const { count: commentCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('target_type', 'project')
        .eq('target_id', project.id);

    return {
        ...project,
        failure_logs: failureLogs || [],
        iterations: iterations || [],
        mentor_reviews: mentorReviews || [],
        comment_count: commentCount || 0,
    };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const project = await getProject(params.slug);

    if (!project) {
        return { title: 'Project Not Found' };
    }

    return {
        title: project.title,
        description: project.description || `View ${project.title} on Cyberodyssey`,
        openGraph: {
            title: project.title,
            description: project.description || undefined,
            images: project.image_urls?.[0] ? [project.image_urls[0]] : undefined,
        },
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const project = await getProject(params.slug);

    if (!project) {
        notFound();
    }

    const statusStyles = {
        IN_PROGRESS: 'status-in-progress',
        COMPLETED: 'status-completed',
        ABANDONED: 'status-abandoned',
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="mx-auto max-w-4xl">
                {/* Back Link */}
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-warm-gray hover:text-cyan transition-colors mb-6"
                >
                    ← Back to Projects
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-start justify-between gap-4 mb-4">
                        <h1 className="text-3xl font-bold">{project.title}</h1>
                        <span className={statusStyles[project.status as keyof typeof statusStyles]}>
                            {project.status.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {project.tags.map((tag: string) => (
                                <span key={tag} className="tag">{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-4">
                        {project.repo_url && (
                            <a
                                href={project.repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link text-sm"
                            >
                                📁 GitHub Repository
                            </a>
                        )}
                        {project.demo_url && (
                            <a
                                href={project.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="link text-sm"
                            >
                                🔗 Live Demo
                            </a>
                        )}
                    </div>
                </div>

                {/* Image */}
                {project.image_urls && project.image_urls.length > 0 && (
                    <div className="mb-8 rounded-lg overflow-hidden">
                        <img
                            src={project.image_urls[0]}
                            alt={project.title}
                            className="w-full max-h-96 object-cover"
                        />
                    </div>
                )}

                {/* Description */}
                {project.description && (
                    <div className="card mb-8">
                        <p className="text-warm-gray whitespace-pre-wrap">{project.description}</p>
                    </div>
                )}

                {/* Author */}
                <div className="card mb-8">
                    <h2 className="text-lg font-semibold mb-4">Author</h2>
                    <div className="flex items-center gap-4">
                        {project.user?.avatar_url ? (
                            <img
                                src={project.user.avatar_url}
                                alt={project.user.full_name || ''}
                                className="avatar-lg"
                            />
                        ) : (
                            <div className="avatar-lg bg-slate" />
                        )}
                        <div>
                            <Link
                                href={`/profile/${project.user?.username || project.user?.id}`}
                                className="font-semibold hover:text-cyan transition-colors"
                            >
                                {project.user?.full_name || 'Anonymous'}
                            </Link>
                            {project.user?.username && (
                                <p className="text-sm text-muted-text">@{project.user.username}</p>
                            )}
                            {project.user?.role === 'mentor' && (
                                <span className="badge-cyan text-xs mt-1">Mentor</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Failure Logs */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                            Failure Logs ({project.failure_logs.length})
                        </h2>
                        <Link href="/new/failure-log" className="btn-secondary text-sm">
                            + Add Failure Log
                        </Link>
                    </div>

                    {project.failure_logs.length > 0 ? (
                        <div className="space-y-4">
                            {project.failure_logs.map((log: any) => (
                                <FailureLogCard key={log.id} log={log} />
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-8 text-warm-gray">
                            <p>No failure logs yet.</p>
                            <p className="text-sm mt-2">
                                Every project has struggles — documenting them helps you and others learn.
                            </p>
                        </div>
                    )}
                </div>

                {/* Iterations */}
                {project.iterations.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Iteration History</h2>
                        <div className="relative pl-6">
                            <div className="timeline-line" />
                            {project.iterations.map((iteration: any) => (
                                <div key={iteration.id} className="relative pb-6 last:pb-0">
                                    <div className="timeline-node-project" style={{ top: '4px' }} />
                                    <div className="ml-6">
                                        <p className="font-medium">{iteration.title}</p>
                                        {iteration.summary && (
                                            <p className="text-sm text-warm-gray mt-1">{iteration.summary}</p>
                                        )}
                                        <p className="text-xs text-muted-text mt-1">
                                            {new Date(iteration.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mentor Reviews */}
                {project.mentor_reviews.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">Mentor Reviews</h2>
                        <div className="space-y-4">
                            {project.mentor_reviews.map((review: any) => (
                                <div key={review.id} className="card">
                                    <div className="flex items-center gap-3 mb-3">
                                        {review.mentor?.avatar_url ? (
                                            <img
                                                src={review.mentor.avatar_url}
                                                alt={review.mentor.full_name || ''}
                                                className="avatar-sm"
                                            />
                                        ) : (
                                            <div className="avatar-sm bg-cyan" />
                                        )}
                                        <div>
                                            <span className="font-medium">{review.mentor?.full_name}</span>
                                            <span className="badge-cyan text-xs ml-2">Mentor</span>
                                        </div>
                                    </div>
                                    <p className="text-warm-gray whitespace-pre-wrap">{review.review_text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments Section Placeholder */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">
                        Comments ({project.comment_count})
                    </h2>
                    <p className="text-warm-gray text-center py-8">
                        Comments section coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
}

function FailureLogCard({ log }: { log: any }) {
    return (
        <div className="card">
            <details className="group">
                <summary className="cursor-pointer list-none flex items-center justify-between">
                    <div>
                        <h3 className="font-medium">{log.goal}</h3>
                        <p className="text-sm text-warm-gray mt-1 line-clamp-1">
                            {log.what_went_wrong}
                        </p>
                    </div>
                    <span className="text-warm-gray group-open:rotate-180 transition-transform">
                        ▼
                    </span>
                </summary>

                <div className="mt-4 pt-4 border-t border-slate space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-cyan mb-1">What went wrong</h4>
                        <p className="text-warm-gray text-sm">{log.what_went_wrong}</p>
                    </div>

                    {log.what_tried && (
                        <div>
                            <h4 className="text-sm font-medium text-cyan mb-1">What I tried</h4>
                            <p className="text-warm-gray text-sm">{log.what_tried}</p>
                        </div>
                    )}

                    {log.outcome && (
                        <div>
                            <h4 className="text-sm font-medium text-cyan mb-1">Outcome</h4>
                            <p className="text-warm-gray text-sm">{log.outcome}</p>
                        </div>
                    )}

                    {log.lessons_learned && (
                        <div>
                            <h4 className="text-sm font-medium text-cyan mb-1">What I learned</h4>
                            <p className="text-warm-gray text-sm">{log.lessons_learned}</p>
                        </div>
                    )}

                    <p className="text-xs text-muted-text">
                        {new Date(log.created_at).toLocaleDateString()}
                    </p>
                </div>
            </details>
        </div>
    );
}
