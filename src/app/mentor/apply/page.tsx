'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function MentorApplyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/mentor-apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    answers: {
                        experience: formData.get('experience'),
                        motivation: formData.get('motivation'),
                        mentoring_style: formData.get('mentoring_style'),
                        availability: formData.get('availability'),
                    },
                    github_url: formData.get('github_url'),
                    linkedin_url: formData.get('linkedin_url'),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to submit application');
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen py-12 px-4">
                <div className="mx-auto max-w-2xl">
                    <div className="card text-center py-12">
                        <div className="text-5xl mb-4">🎉</div>
                        <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
                        <p className="text-warm-gray mb-6">
                            We&apos;ll review your application and get back to you soon.
                            Thank you for wanting to help others learn.
                        </p>
                        <Link href="/projects" className="btn-primary">
                            Explore Projects
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="mx-auto max-w-2xl">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-warm-gray hover:text-cyan transition-colors mb-6"
                >
                    ← Back to Home
                </Link>

                <div className="card">
                    <h1 className="text-2xl font-bold mb-2">Become a Mentor</h1>
                    <p className="text-warm-gray mb-6">
                        Help students grow by sharing your experience and insights.
                        Mentors provide structured feedback on projects and failure logs.
                    </p>

                    {/* What Mentors Do */}
                    <div className="mb-8 p-4 bg-cyan-subtle rounded-lg">
                        <h2 className="font-semibold text-cyan mb-2">What do mentors do?</h2>
                        <ul className="text-sm text-warm-gray space-y-1">
                            <li>✓ Review student projects and provide constructive feedback</li>
                            <li>✓ Comment on failure logs with insights and encouragement</li>
                            <li>✓ Write growth endorsements highlighting student progress</li>
                            <li>✓ Help normalize the learning process</li>
                        </ul>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-error/10 border border-error rounded-md text-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Experience */}
                        <div>
                            <label htmlFor="experience" className="label">
                                Tell us about your experience <span className="text-error">*</span>
                            </label>
                            <textarea
                                id="experience"
                                name="experience"
                                required
                                rows={4}
                                minLength={50}
                                maxLength={2000}
                                placeholder="What's your technical background? What technologies do you work with? How long have you been in the field?"
                                className="textarea"
                            />
                            <p className="text-xs text-muted-text mt-1">Minimum 50 characters</p>
                        </div>

                        {/* Motivation */}
                        <div>
                            <label htmlFor="motivation" className="label">
                                Why do you want to be a mentor? <span className="text-error">*</span>
                            </label>
                            <textarea
                                id="motivation"
                                name="motivation"
                                required
                                rows={4}
                                minLength={50}
                                maxLength={2000}
                                placeholder="What motivates you to help students? What do you hope to contribute to their learning journey?"
                                className="textarea"
                            />
                            <p className="text-xs text-muted-text mt-1">Minimum 50 characters</p>
                        </div>

                        {/* Mentoring Style */}
                        <div>
                            <label htmlFor="mentoring_style" className="label">
                                Describe your mentoring approach <span className="text-error">*</span>
                            </label>
                            <textarea
                                id="mentoring_style"
                                name="mentoring_style"
                                required
                                rows={4}
                                minLength={50}
                                maxLength={2000}
                                placeholder="How do you help someone who's stuck? How do you balance guidance with letting them figure things out?"
                                className="textarea"
                            />
                            <p className="text-xs text-muted-text mt-1">Minimum 50 characters</p>
                        </div>

                        {/* Availability */}
                        <div>
                            <label htmlFor="availability" className="label">
                                Your availability <span className="text-error">*</span>
                            </label>
                            <input
                                type="text"
                                id="availability"
                                name="availability"
                                required
                                maxLength={200}
                                placeholder="e.g., 2-3 hours per week, evenings and weekends"
                                className="input"
                            />
                        </div>

                        <hr className="border-slate" />

                        {/* GitHub URL */}
                        <div>
                            <label htmlFor="github_url" className="label">
                                GitHub Profile URL <span className="text-error">*</span>
                            </label>
                            <input
                                type="url"
                                id="github_url"
                                name="github_url"
                                required
                                placeholder="https://github.com/username"
                                className="input"
                            />
                            <p className="text-xs text-muted-text mt-1">
                                We review your public contributions as part of verification
                            </p>
                        </div>

                        {/* LinkedIn URL */}
                        <div>
                            <label htmlFor="linkedin_url" className="label">
                                LinkedIn Profile URL <span className="text-error">*</span>
                            </label>
                            <input
                                type="url"
                                id="linkedin_url"
                                name="linkedin_url"
                                required
                                placeholder="https://linkedin.com/in/username"
                                className="input"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate">
                            <p className="text-sm text-muted-text">
                                Applications are reviewed within 3-5 days
                            </p>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-primary"
                            >
                                {isLoading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
