import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function getResources(searchParams: { [key: string]: string | undefined }) {
    const supabase = createClient();

    let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

    if (searchParams.tag) {
        query = query.contains('tags', [searchParams.tag]);
    }
    if (searchParams.search) {
        query = query.ilike('title', `%${searchParams.search}%`);
    }
    if (searchParams.type === 'open') {
        query = query.eq('is_open_access', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching resources:', error);
        return [];
    }

    return data;
}

async function getPopularTags() {
    const supabase = createClient();

    // Get all resources and extract unique tags
    const { data } = await supabase
        .from('resources')
        .select('tags');

    if (!data) return [];

    const tagCounts: Record<string, number> = {};
    data.forEach((r) => {
        (r.tags || []).forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });

    return Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag);
}

export default async function ResourcesPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const [resources, popularTags] = await Promise.all([
        getResources(searchParams),
        getPopularTags(),
    ]);

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Resource Library</h1>
                    <p className="text-warm-gray">
                        Curated papers, books, and learning materials — always openly accessible
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-4">
                    <form className="flex-1 min-w-[200px]">
                        <input
                            type="search"
                            name="search"
                            placeholder="Search resources..."
                            defaultValue={searchParams.search || ''}
                            className="input"
                        />
                    </form>

                    <div className="flex gap-2">
                        <FilterButton
                            label="All"
                            active={!searchParams.type}
                            href="/resources"
                        />
                        <FilterButton
                            label="Open Access"
                            active={searchParams.type === 'open'}
                            href="/resources?type=open"
                        />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1">
                        {resources.length > 0 ? (
                            <div className="grid gap-4">
                                {resources.map((resource) => (
                                    <ResourceCard key={resource.id} resource={resource} />
                                ))}
                            </div>
                        ) : (
                            <div className="card text-center py-12">
                                <p className="text-warm-gray mb-2">No resources found</p>
                                <p className="text-sm text-muted-text">
                                    Try adjusting your search or filters
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:w-64">
                        <div className="card sticky top-24">
                            <h2 className="font-semibold mb-4">Popular Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map((tag) => (
                                    <Link
                                        key={tag}
                                        href={`/resources?tag=${tag}`}
                                        className={`tag ${searchParams.tag === tag ? 'bg-cyan text-charcoal' : ''}`}
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>

                            <hr className="my-4 border-slate" />

                            <h2 className="font-semibold mb-2">About This Library</h2>
                            <p className="text-sm text-warm-gray">
                                We curate links to openly accessible academic papers, books, and tutorials.
                                We don&apos;t host copyrighted content — only pointers to legitimate sources.
                            </p>
                        </div>
                    </div>
                </div>
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

function ResourceCard({ resource }: { resource: any }) {
    return (
        <div className="card card-hover">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg font-semibold hover:text-cyan transition-colors"
                    >
                        {resource.title}
                    </a>

                    {resource.authors && resource.authors.length > 0 && (
                        <p className="text-sm text-muted-text mt-1">
                            by {resource.authors.join(', ')}
                        </p>
                    )}

                    {resource.description && (
                        <p className="text-warm-gray text-sm mt-2 line-clamp-2">
                            {resource.description}
                        </p>
                    )}

                    {/* Tags */}
                    {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {resource.tags.slice(0, 5).map((tag: string) => (
                                <Link
                                    key={tag}
                                    href={`/resources?tag=${tag}`}
                                    className="tag text-xs"
                                >
                                    {tag}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end gap-2">
                    {resource.is_open_access && (
                        <span className="badge-success text-xs">Open Access</span>
                    )}
                    <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary text-xs"
                    >
                        View →
                    </a>
                </div>
            </div>
        </div>
    );
}
