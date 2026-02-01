'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import slugify from 'slugify';

export default function NewProjectPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState<string[]>([]);

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim().toLowerCase();
            if (tag && !tags.includes(tag) && tags.length < 10) {
                setTags([...tags, tag]);
                setTagInput('');
            }
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const repoUrl = formData.get('repo_url') as string;
        const demoUrl = formData.get('demo_url') as string;

        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description: description || undefined,
                    tags: tags.length > 0 ? tags : undefined,
                    repo_url: repoUrl || undefined,
                    demo_url: demoUrl || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create project');
            }

            router.push(`/projects/${data.data.slug}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-2xl">
                {/* Back Link */}
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-warm-gray hover:text-cyan transition-colors mb-6"
                >
                    ← Back to Projects
                </Link>

                <div className="card">
                    <h1 className="text-2xl font-bold mb-2">Create New Project</h1>
                    <p className="text-warm-gray mb-6">
                        Document what you&apos;re building and learning
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border border-error rounded-md text-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="label">
                                Project Title <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                maxLength={200}
                                placeholder="e.g., Building a Task Manager with React"
                                className="input"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="label">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                maxLength={5000}
                                placeholder="What are you building? What are you hoping to learn?"
                                className="textarea"
                            />
                            <p className="text-xs text-muted-text mt-1">
                                Tip: Share your goals and current challenges
                            </p>
                        </div>

                        {/* Tags */}
                        <div>
                            <label htmlFor="tags" className="label">
                                Tech Stack / Tags
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-2 py-1 bg-slate rounded text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="text-warm-gray hover:text-error"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                id="tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Type a tag and press Enter (e.g., react, typescript)"
                                className="input"
                            />
                            <p className="text-xs text-muted-text mt-1">
                                Add up to 10 tags. Press Enter or comma to add.
                            </p>
                        </div>

                        {/* Repository URL */}
                        <div>
                            <label htmlFor="repo_url" className="label">
                                Repository URL
                            </label>
                            <input
                                type="url"
                                id="repo_url"
                                name="repo_url"
                                placeholder="https://github.com/username/repo"
                                className="input"
                            />
                        </div>

                        {/* Demo URL */}
                        <div>
                            <label htmlFor="demo_url" className="label">
                                Demo URL
                            </label>
                            <input
                                type="url"
                                id="demo_url"
                                name="demo_url"
                                placeholder="https://my-project.vercel.app"
                                className="input"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate">
                            <p className="text-sm text-muted-text">
                                You can add failure logs and images after creating
                            </p>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary"
                            >
                                {isLoading ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tips Card */}
                <div className="card mt-6 bg-cyan-subtle border-cyan/20">
                    <h2 className="font-semibold text-cyan mb-2">💡 Getting Started Tips</h2>
                    <ul className="text-sm text-warm-gray space-y-1">
                        <li>• Be honest about where you are — it&apos;s okay to be learning</li>
                        <li>• Add a failure log to document your first challenge</li>
                        <li>• Ask for feedback by sharing your project</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
