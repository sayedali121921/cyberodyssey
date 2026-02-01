'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        bio: '',
        github_url: '',
        linkedin_url: '',
        avatar_url: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch('/api/profile');
            if (!res.ok) {
                if (res.status === 401) {
                    router.push('/auth/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }
            const data = await res.json();
            setFormData({
                full_name: data.full_name || '',
                username: data.username || '',
                bio: data.bio || '',
                github_url: data.github_url || '',
                linkedin_url: data.linkedin_url || '',
                avatar_url: data.avatar_url || '',
            });
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be less than 5MB');
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'avatar');

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setFormData(prev => ({ ...prev, avatar_url: data.url }));
            setSuccess('Avatar uploaded!');
        } catch (err) {
            setError('Failed to upload avatar');
        } finally {
            setUploading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to save');
            }

            setSuccess('Profile saved successfully!');
            setTimeout(() => {
                router.push(`/profile/${formData.username}`);
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted-text">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <Link href={`/profile/${formData.username}`} className="text-muted-text hover:text-cyan transition-colors text-sm">
                        ← Back to Profile
                    </Link>
                    <h1 className="text-3xl font-bold mt-4">Edit Profile</h1>
                    <p className="text-warm-gray mt-2">Update your profile information</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/30 text-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 rounded-lg bg-success/10 border border-success/30 text-success">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar */}
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                        <div className="flex items-center gap-6">
                            <div className="relative">
                                {formData.avatar_url ? (
                                    <img
                                        src={formData.avatar_url}
                                        alt="Avatar"
                                        className="w-24 h-24 rounded-full object-cover ring-2 ring-cyan/30"
                                    />
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan to-teal-400 flex items-center justify-center text-charcoal text-3xl font-bold">
                                        {formData.full_name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 rounded-full bg-charcoal/80 flex items-center justify-center">
                                        <div className="w-6 h-6 border-2 border-cyan border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="btn-secondary text-sm cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        disabled={uploading}
                                        className="hidden"
                                    />
                                    {uploading ? 'Uploading...' : 'Upload Photo'}
                                </label>
                                <p className="text-xs text-muted-text mt-2">JPG, PNG, GIF. Max 5MB.</p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="label">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.full_name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                                    className="input"
                                    placeholder="Your full name"
                                />
                            </div>
                            <div>
                                <label className="label">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
                                    className="input"
                                    placeholder="your_username"
                                />
                                <p className="text-xs text-muted-text mt-1">Lowercase letters, numbers, and underscores only</p>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4">About You</h2>
                        <div>
                            <label className="label">Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                className="textarea"
                                placeholder="Tell us about yourself, your interests, and what you're learning..."
                                rows={4}
                                maxLength={500}
                            />
                            <p className="text-xs text-muted-text mt-1">{formData.bio.length}/500 characters</p>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="card">
                        <h2 className="text-lg font-semibold mb-4">Social Links</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="label">GitHub URL</label>
                                <input
                                    type="url"
                                    value={formData.github_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
                                    className="input"
                                    placeholder="https://github.com/yourusername"
                                />
                            </div>
                            <div>
                                <label className="label">LinkedIn URL</label>
                                <input
                                    type="url"
                                    value={formData.linkedin_url}
                                    onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                                    className="input"
                                    placeholder="https://linkedin.com/in/yourusername"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary flex-1"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <Link
                            href={`/profile/${formData.username}`}
                            className="btn-secondary"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
