'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function EditProjectPage({ params }: { params: { slug: string } }) {
    const router = useRouter();
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [project, setProject] = useState<any>(null);

    // Fetch project data
    useEffect(() => {
        async function fetchProject() {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('slug', params.slug)
                .single();

            if (error || !data) {
                console.error('Error fetching project:', error);
                router.push('/projects');
                return;
            }

            // Check if current user is owner
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || user.id !== data.user_id) {
                router.push(`/projects/${params.slug}`); // Redirect non-owners
                return;
            }

            setProject(data);
            setIsLoading(false);
        }
        fetchProject();
    }, [params.slug, router, supabase]);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const updates = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            status: formData.get('status') as string,
            repo_url: (formData.get('repo_url') as string) || null,
            demo_url: (formData.get('demo_url') as string) || null,
            tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
        };

        try {
            const response = await fetch(`/api/projects/${project.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                throw new Error('Failed to update project');
            }

            // Redirect back to project page
            // We use window.location to force a fresh fetch of date
            window.location.href = `/projects/${params.slug}`;
        } catch (err: any) {
            setError(err.message);
            setIsSaving(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Are you sure you want to DELETE this project? This cannot be undone.')) return;

        setIsSaving(true);
        try {
            const response = await fetch(`/api/projects/${project.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete project');
            }

            window.location.href = '/projects';
        } catch (err: any) {
            alert(err.message);
            setIsSaving(false);
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Edit Project</h1>
                    <p className="text-warm-gray">Update your project details or status.</p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Project Title</label>
                            <input
                                name="title"
                                defaultValue={project.title}
                                required
                                className="input w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                name="description"
                                defaultValue={project.description || ''}
                                rows={4}
                                className="input w-full resize-none"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    name="status"
                                    defaultValue={project.status}
                                    className="input w-full"
                                >
                                    <option value="IN_PROGRESS">In Progress 🚧</option>
                                    <option value="COMPLETED">Completed ✅</option>
                                    <option value="ABANDONED">Abandoned 💀</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                                <input
                                    name="tags"
                                    defaultValue={project.tags?.join(', ') || ''}
                                    placeholder="React, TypeScript, AI..."
                                    className="input w-full"
                                    // Prevent hitting enter to submit when adding tags
                                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Repository URL</label>
                                <input
                                    name="repo_url"
                                    type="url"
                                    defaultValue={project.repo_url || ''}
                                    placeholder="https://github.com/..."
                                    className="input w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Demo URL</label>
                                <input
                                    name="demo_url"
                                    type="url"
                                    defaultValue={project.demo_url || ''}
                                    placeholder="https://..."
                                    className="input w-full"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate flex items-center justify-between gap-4">
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="text-error hover:text-red-400 text-sm font-medium"
                            >
                                Delete Project
                            </button>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="btn-primary"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
