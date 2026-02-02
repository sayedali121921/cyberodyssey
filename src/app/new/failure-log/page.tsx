'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NewFailureLogPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        // Construct payload matching CreateFailureLogSchema
        // Note: Optional fields are only included if they have content to avoid empty string accumulation
        const getOptionalString = (key: string) => {
            const val = formData.get(key) as string;
            return val?.trim() || undefined;
        };

        const data = {
            goal: (formData.get('goal') as string).trim(),
            what_went_wrong: (formData.get('what_went_wrong') as string).trim(),
            lessons_learned: (formData.get('lessons_learned') as string).trim(),
            // Ensure visibility is a valid enum value
            visibility: 'public' as const,
            // Optional fields mapping
            // project_id is handled if we add a select dropdown later
        };

        try {
            console.log('Submitting failure log:', data);

            const response = await fetch('/api/failure-logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Submission failed:', result);
                throw new Error(result.error || result.details ? JSON.stringify(result.details) : 'Failed to create log');
            }

            console.log('Success:', result);
            // Force hard navigation to avoid client router issues
            window.location.href = '/failure-logs';
        } catch (err: any) {
            console.error('Client Error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen py-12 px-4 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Log a Failure</h1>
                    <p className="text-warm-gray">
                        "Failure is only the opportunity to begin again, this time more intelligently."
                    </p>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                What were you trying to achieve?
                            </label>
                            <input
                                name="goal"
                                required
                                placeholder="e.g. Deploying my Next.js app to Vercel"
                                className="input w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                What went wrong?
                            </label>
                            <textarea
                                name="what_went_wrong"
                                required
                                rows={4}
                                placeholder="e.g. Build failed with 'Module not found' error because I forgot to verify case sensitivity..."
                                className="input w-full resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                What did you learn?
                            </label>
                            <textarea
                                name="lessons_learned"
                                required
                                rows={4}
                                placeholder="e.g. Linux file systems are case-sensitive. Always run 'git mv' when renaming files..."
                                className="input w-full resize-none"
                            />
                        </div>

                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn-ghost flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary flex-1"
                            >
                                {isLoading ? 'Logging...' : 'Log Failure'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
