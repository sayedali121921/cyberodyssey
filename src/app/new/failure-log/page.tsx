'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Project {
    id: string;
    title: string;
    slug: string;
}

function NewFailureLogForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const projectId = searchParams.get('project');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState(projectId || '');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');

    useEffect(() => {
        // Fetch user's projects
        fetch('/api/projects?user=me')
            .then((res) => res.json())
            .then((data) => {
                if (data.data) {
                    setProjects(data.data);
                }
            })
            .catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/failure-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project_id: selectedProject || undefined,
                    goal: formData.get('goal'),
                    what_went_wrong: formData.get('what_went_wrong'),
                    attempts: formData.get('attempts') || undefined,
                    what_tried: formData.get('what_tried') || undefined,
                    outcome: formData.get('outcome') || undefined,
                    lessons_learned: formData.get('lessons_learned') || undefined,
                    next_steps: formData.get('next_steps') || undefined,
                    visibility,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create failure log');
            }

            // Redirect based on whether linked to project
            if (selectedProject) {
                const project = projects.find((p) => p.id === selectedProject);
                router.push(`/projects/${project?.slug || ''}`);
            } else {
                router.push(`/failure-logs/${data.data.id}`);
            }
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
                    href={selectedProject ? `/projects/${projects.find(p => p.id === selectedProject)?.slug}` : '/projects'}
                    className="inline-flex items-center gap-2 text-warm-gray hover:text-cyan transition-colors mb-6"
                >
                    ← Back
                </Link>

                <div className="card">
                    <h1 className="text-2xl font-bold mb-2">Log a Failure</h1>
                    <p className="text-warm-gray mb-6">
                        Tell what you tried — every struggle is a step forward
                    </p>

                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border border-error rounded-md text-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Linked Project */}
                        <div>
                            <label htmlFor="project" className="label">Link to Project</label>
                            <select
                                id="project"
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="input"
                            >
                                <option value="">No project (standalone log)</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.title}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-muted-text mt-1">
                                Optional — link this log to one of your projects
                            </p>
                        </div>

                        {/* Goal */}
                        <div>
                            <label htmlFor="goal" className="label">
                                What were you trying to do? <span className="text-error">*</span>
                            </label>
                            <textarea
                                id="goal"
                                name="goal"
                                required
                                rows={3}
                                maxLength={1000}
                                placeholder="e.g., Implement user authentication with JWT tokens"
                                className="textarea"
                            />
                        </div>

                        {/* What went wrong */}
                        <div>
                            <label htmlFor="what_went_wrong" className="label">
                                What went wrong? <span className="text-error">*</span>
                            </label>
                            <textarea
                                id="what_went_wrong"
                                name="what_went_wrong"
                                required
                                rows={4}
                                maxLength={3000}
                                placeholder="Describe the error, bug, or unexpected behavior you encountered"
                                className="textarea"
                            />
                        </div>

                        {/* Attempts */}
                        <div>
                            <label htmlFor="attempts" className="label">
                                How many attempts did you make?
                            </label>
                            <input
                                type="text"
                                id="attempts"
                                name="attempts"
                                maxLength={200}
                                placeholder="e.g., 3 attempts over 2 days"
                                className="input"
                            />
                        </div>

                        {/* What tried */}
                        <div>
                            <label htmlFor="what_tried" className="label">
                                What did you try?
                            </label>
                            <textarea
                                id="what_tried"
                                name="what_tried"
                                rows={4}
                                maxLength={3000}
                                placeholder="List the solutions and approaches you attempted"
                                className="textarea"
                            />
                        </div>

                        {/* Outcome */}
                        <div>
                            <label htmlFor="outcome" className="label">
                                What was the outcome?
                            </label>
                            <textarea
                                id="outcome"
                                name="outcome"
                                rows={3}
                                maxLength={2000}
                                placeholder="Did you solve it? Are you still stuck? What's the current state?"
                                className="textarea"
                            />
                        </div>

                        {/* Lessons learned */}
                        <div>
                            <label htmlFor="lessons_learned" className="label">
                                What did you learn?
                            </label>
                            <textarea
                                id="lessons_learned"
                                name="lessons_learned"
                                rows={3}
                                maxLength={3000}
                                placeholder="What insights or knowledge did you gain from this experience?"
                                className="textarea"
                            />
                        </div>

                        {/* Next steps */}
                        <div>
                            <label htmlFor="next_steps" className="label">
                                What will you try next?
                            </label>
                            <textarea
                                id="next_steps"
                                name="next_steps"
                                rows={2}
                                maxLength={1000}
                                placeholder="Your plan for moving forward"
                                className="textarea"
                            />
                        </div>

                        {/* Visibility */}
                        <div>
                            <label className="label">Visibility</label>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setVisibility('public')}
                                    className={`flex-1 py-3 px-4 rounded-md border transition-colors ${visibility === 'public'
                                        ? 'border-cyan bg-cyan-subtle text-cyan'
                                        : 'border-slate text-warm-gray hover:border-cyan/50'
                                        }`}
                                >
                                    <span className="block font-medium">🌍 Public</span>
                                    <span className="block text-xs mt-1 opacity-75">
                                        Visible to everyone — helps others learn
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVisibility('private')}
                                    className={`flex-1 py-3 px-4 rounded-md border transition-colors ${visibility === 'private'
                                        ? 'border-cyan bg-cyan-subtle text-cyan'
                                        : 'border-slate text-warm-gray hover:border-cyan/50'
                                        }`}
                                >
                                    <span className="block font-medium">🔒 Private</span>
                                    <span className="block text-xs mt-1 opacity-75">
                                        Only you can see this log
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate">
                            <p className="text-sm text-muted-text">
                                Failure logs help normalize the learning process
                            </p>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary"
                            >
                                {isLoading ? 'Saving...' : 'Save Failure Log'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Encouragement */}
                <div className="card mt-6 bg-cyan-subtle border-cyan/20">
                    <h2 className="font-semibold text-cyan mb-2">🌱 Why document failures?</h2>
                    <ul className="text-sm text-warm-gray space-y-1">
                        <li>• It makes your struggle visible—and that helps others feel less alone</li>
                        <li>• Mentors can provide targeted feedback on your specific challenges</li>
                        <li>• Looking back at past failures shows how far you&apos;ve come</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-2xl">
                <div className="card animate-pulse">
                    <div className="h-8 bg-slate/30 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-slate/30 rounded w-2/3 mb-8"></div>
                    <div className="space-y-6">
                        <div className="h-20 bg-slate/30 rounded"></div>
                        <div className="h-32 bg-slate/30 rounded"></div>
                        <div className="h-20 bg-slate/30 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NewFailureLogPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <NewFailureLogForm />
        </Suspense>
    );
}
