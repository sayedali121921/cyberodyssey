import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = {
    title: 'Research Library | Cyberodyssey',
    description: 'A collection of cybersecurity research papers, user studies, and technical documentation.',
};

export const dynamic = 'force-dynamic';

interface ResearchPaper {
    name: string;
    title: string;
    url: string;
    size: string;
    metadata: Record<string, any>;
}

async function getResearchPapers(): Promise<ResearchPaper[]> {
    const supabase = createClient();

    try {
        const { data: files, error } = await supabase.storage
            .from('research-papers')
            .list();

        if (error) {
            console.error('Error fetching research papers:', error);
            return [];
        }

        if (!files) return [];

        return files
            .filter((file: any) => file.name.endsWith('.pdf'))
            .map((file: any) => {
                const { data: { publicUrl } } = supabase.storage
                    .from('research-papers')
                    .getPublicUrl(file.name);

                return {
                    name: file.name,
                    // Create a human-readable title from filename
                    title: file.name
                        .replace(/\.pdf$/i, '')
                        .replace(/[-_]/g, ' ')
                        .replace(/\w\S*/g, (w: string) => (w.replace(/^./, (c: string) => c.toUpperCase()))), // Title Case
                    url: publicUrl,
                    // Format size from bytes to MB
                    size: ((file.metadata?.size || 0) / 1024 / 1024).toFixed(2) + ' MB',
                    metadata: file.metadata || {}
                };
            });
    } catch (error) {
        console.error('Unexpected error fetching papers:', error);
        return [];
    }
}

export default async function ResearchPage() {
    const papers = await getResearchPapers();

    return (
        <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <section className="text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold">
                        Research <span className="gradient-text">Library</span>
                    </h1>
                    <p className="text-xl text-warm-gray max-w-2xl mx-auto">
                        Access our curated collection of foundational computer science papers, cybersecurity reports, and technical definitions.
                        <br />
                        <span className="text-sm text-muted-text mt-2 block">{papers.length} Papers Available</span>
                    </p>
                </section>

                {/* Papers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {papers.map((paper) => (
                        <div key={paper.name} className="card group hover:border-cyan/50 transition-all duration-300 flex flex-col">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <span className="text-4xl">📄</span>
                                    <span className="text-xs font-mono text-muted-text bg-charcoal-light px-2 py-1 rounded">
                                        PDF
                                    </span>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-cyan transition-colors" title={paper.title}>
                                        {paper.title}
                                    </h3>
                                    <p className="text-sm text-muted-text mt-1">{paper.size}</p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-secondary text-sm flex-1 text-center py-2"
                                >
                                    Read Online
                                </a>
                                <a
                                    href={paper.url}
                                    download
                                    className="btn-primary-outline text-sm w-12 flex items-center justify-center border border-slate/30 rounded-lg hover:border-cyan hover:text-cyan transition-colors"
                                    title="Download"
                                >
                                    ⬇
                                </a>
                            </div>
                        </div>
                    ))}

                    {papers.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted-text bg-white/5 rounded-xl border border-white/5">
                            <div className="text-4xl mb-4">📚</div>
                            <h3 className="text-lg font-semibold mb-2">No Papers Found</h3>
                            <p className="max-w-md mx-auto">
                                The library is currently being updated. Check back soon for new research materials.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
