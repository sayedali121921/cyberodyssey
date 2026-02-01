import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { ProjectWithUser } from '@/types/database';

export const dynamic = 'force-dynamic';

async function getProjects(searchParams: { [key: string]: string | undefined }) {
    const supabase = createClient();

    let query = supabase
        .from('projects')
        .select(`
      *,
      user:users(id, full_name, username, avatar_url, role)
    `)
        .order('created_at', { ascending: false })
        .limit(20);

    // Apply filters
    if (searchParams.tag) {
        query = query.contains('tags', [searchParams.tag]);
    }
    if (searchParams.status) {
        query = query.eq('status', searchParams.status);
    }
    if (searchParams.search) {
        query = query.ilike('title', `%${searchParams.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }

    return data as ProjectWithUser[];
}

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const projects = await getProjects(searchParams);

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Explore Projects</h1>
                    <p className="text-warm-gray">
                        See what others are building and learning
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <form className="flex-1 min-w-[200px]">
                        <input
                            type="search"
                            name="search"
                            placeholder="Search projects..."
                            defaultValue={searchParams.search || ''}
                            className="input"
                        />
                    </form>

                    <div className="flex gap-2">
                        <FilterButton
                            label="All"
                            active={!searchParams.status}
                            href="/projects"
                        />
                        <FilterButton
                            label="In Progress"
                            active={searchParams.status === 'IN_PROGRESS'}
                            href="/projects?status=IN_PROGRESS"
                        />
                        <FilterButton
                            label="Completed"
                            active={searchParams.status === 'COMPLETED'}
                            href="/projects?status=COMPLETED"
                        />
                    </div>
                </div>

                {/* Projects Grid */}
                {projects.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-warm-gray mb-4">No projects found</p>
                        <Link href="/new/project" className="btn-primary">
                            Create the first project
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function FilterButton({
    label,
    active,
    href
}: {
    label: string;
    active: boolean;
    href: string;
}) {
    return (
        <Link
            href={href}
            className={`px-4 py-2 rounded-md text-sm transition-colors ${active
                    ? 'bg-cyan text-charcoal'
                    : 'bg-slate/50 text-warm-gray hover:text-off-white'
                }`}
        >
            {label}
        </Link>
    );
}

function ProjectCard({ project }: { project: ProjectWithUser }) {
    const statusStyles = {
        IN_PROGRESS: 'status-in-progress',
        COMPLETED: 'status-completed',
        ABANDONED: 'status-abandoned',
    };

    return (
        <Link href={`/projects/${project.slug}`} className="card card-hover block">
            {/* Image */}
            {project.image_urls && project.image_urls.length > 0 ? (
                <div className="mb-4 -mx-6 -mt-6">
                    <img
                        src={project.image_urls[0]}
                        alt={project.title}
                        className="w-full h-40 object-cover rounded-t-lg"
                    />
                </div>
            ) : (
                <div className="mb-4 -mx-6 -mt-6 h-40 bg-slate rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl opacity-50">📁</span>
                </div>
            )}

            {/* Content */}
            <h2 className="text-lg font-semibold mb-2 line-clamp-2">{project.title}</h2>

            {project.description && (
                <p className="text-warm-gray text-sm mb-3 line-clamp-2">
                    {project.description}
                </p>
            )}

            {/* Tags */}
            {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag text-xs">
                            {tag}
                        </span>
                    ))}
                    {project.tags.length > 3 && (
                        <span className="text-xs text-muted-text">
                            +{project.tags.length - 3}
                        </span>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate">
                <div className="flex items-center gap-2">
                    {project.user?.avatar_url ? (
                        <img
                            src={project.user.avatar_url}
                            alt={project.user.full_name || ''}
                            className="avatar-sm"
                        />
                    ) : (
                        <div className="avatar-sm bg-slate" />
                    )}
                    <span className="text-sm text-warm-gray">
                        {project.user?.full_name || 'Anonymous'}
                    </span>
                </div>

                <span className={statusStyles[project.status as keyof typeof statusStyles]}>
                    {project.status.replace('_', ' ')}
                </span>
            </div>
        </Link>
    );
}
