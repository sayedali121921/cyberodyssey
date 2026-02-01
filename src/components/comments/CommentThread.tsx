'use client';

import { useState } from 'react';
import type { CommentWithUser } from '@/types/database';

interface CommentThreadProps {
    targetType: 'project' | 'failure_log';
    targetId: string;
    initialComments: CommentWithUser[];
    currentUserId?: string;
    isOwner: boolean;
}

export function CommentThread({
    targetType,
    targetId,
    initialComments,
    currentUserId,
    isOwner,
}: CommentThreadProps) {
    const [comments, setComments] = useState<CommentWithUser[]>(initialComments);
    const [isLoading, setIsLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const handleSubmit = async (body: string, category: string, parentId?: string) => {
        if (!currentUserId) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target_type: targetType,
                    target_id: targetId,
                    category: category || undefined,
                    body,
                    parent_id: parentId || undefined,
                }),
            });

            if (response.ok) {
                const { data: newComment } = await response.json();

                if (parentId) {
                    // Add reply to parent
                    setComments(comments.map((c) =>
                        c.id === parentId
                            ? { ...c, replies: [...(c.replies || []), newComment] }
                            : c
                    ));
                } else {
                    // Add new top-level comment
                    setComments([...comments, { ...newComment, replies: [] }]);
                }
                setReplyingTo(null);
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
        setIsLoading(false);
    };

    const handleMarkHelpful = async (commentId: string) => {
        if (!isOwner) return;

        try {
            const response = await fetch(`/api/comments/${commentId}/helpful`, {
                method: 'POST',
            });

            if (response.ok) {
                setComments(comments.map((c) => {
                    if (c.id === commentId) {
                        return { ...c, helpful_count: (c.helpful_count || 0) + 1 };
                    }
                    if (c.replies) {
                        return {
                            ...c,
                            replies: c.replies.map((r: CommentWithUser) =>
                                r.id === commentId
                                    ? { ...r, helpful_count: (r.helpful_count || 0) + 1 }
                                    : r
                            ),
                        };
                    }
                    return c;
                }));
            }
        } catch (error) {
            console.error('Failed to mark helpful:', error);
        }
    };

    const categoryColors = {
        question: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        suggestion: 'bg-green-500/10 text-green-400 border-green-500/20',
        bug: 'bg-red-500/10 text-red-400 border-red-500/20',
        appreciation: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    };

    return (
        <div className="space-y-6">
            {/* Comment Form */}
            {currentUserId && (
                <CommentForm
                    onSubmit={(body, category) => handleSubmit(body, category)}
                    isLoading={isLoading}
                />
            )}

            {/* Comments List */}
            {comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="space-y-3">
                            {/* Main Comment */}
                            <div className="card">
                                <div className="flex items-start gap-3">
                                    {comment.user?.avatar_url ? (
                                        <img
                                            src={comment.user.avatar_url}
                                            alt={comment.user.full_name || ''}
                                            className="avatar-sm flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="avatar-sm bg-slate flex-shrink-0" />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">
                                                {comment.user?.full_name || 'Anonymous'}
                                            </span>
                                            {comment.is_mentor_insight && (
                                                <span className="badge-cyan text-xs">Mentor</span>
                                            )}
                                            {comment.category && (
                                                <span className={`text-xs px-2 py-0.5 rounded border ${categoryColors[comment.category as keyof typeof categoryColors]}`}>
                                                    {comment.category}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-warm-gray text-sm whitespace-pre-wrap">
                                            {comment.body}
                                        </p>

                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-text">
                                            <span>
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>

                                            {currentUserId && (
                                                <button
                                                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                                    className="hover:text-cyan transition-colors"
                                                >
                                                    Reply
                                                </button>
                                            )}

                                            {isOwner && (
                                                <button
                                                    onClick={() => handleMarkHelpful(comment.id)}
                                                    className="hover:text-success transition-colors"
                                                >
                                                    {comment.helpful_count > 0 ? `Helpful (${comment.helpful_count})` : 'Mark helpful'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reply Form */}
                            {replyingTo === comment.id && (
                                <div className="ml-8">
                                    <CommentForm
                                        onSubmit={(body, category) => handleSubmit(body, category, comment.id)}
                                        isLoading={isLoading}
                                        isReply
                                        onCancel={() => setReplyingTo(null)}
                                    />
                                </div>
                            )}

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-8 space-y-3">
                                    {comment.replies.map((reply: CommentWithUser) => (
                                        <div key={reply.id} className="card bg-graphite/50">
                                            <div className="flex items-start gap-3">
                                                {reply.user?.avatar_url ? (
                                                    <img
                                                        src={reply.user.avatar_url}
                                                        alt={reply.user.full_name || ''}
                                                        className="avatar-sm flex-shrink-0"
                                                    />
                                                ) : (
                                                    <div className="avatar-sm bg-slate flex-shrink-0" />
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm">
                                                            {reply.user?.full_name || 'Anonymous'}
                                                        </span>
                                                        {reply.is_mentor_insight && (
                                                            <span className="badge-cyan text-xs">Mentor</span>
                                                        )}
                                                    </div>

                                                    <p className="text-warm-gray text-sm whitespace-pre-wrap">
                                                        {reply.body}
                                                    </p>

                                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-text">
                                                        <span>
                                                            {new Date(reply.created_at).toLocaleDateString()}
                                                        </span>
                                                        {isOwner && (
                                                            <button
                                                                onClick={() => handleMarkHelpful(reply.id)}
                                                                className="hover:text-success transition-colors"
                                                            >
                                                                {reply.helpful_count > 0 ? `Helpful (${reply.helpful_count})` : 'Mark helpful'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-warm-gray py-8">
                    No comments yet. Be the first to share your thoughts!
                </p>
            )}
        </div>
    );
}

interface CommentFormProps {
    onSubmit: (body: string, category: string) => void;
    isLoading: boolean;
    isReply?: boolean;
    onCancel?: () => void;
}

function CommentForm({ onSubmit, isLoading, isReply, onCancel }: CommentFormProps) {
    const [body, setBody] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;
        onSubmit(body, category);
        setBody('');
        setCategory('');
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder={isReply ? 'Write a reply...' : 'Share your thoughts, questions, or suggestions...'}
                rows={3}
                maxLength={2000}
                className="textarea mb-3"
                required
            />

            <div className="flex items-center justify-between">
                {!isReply && (
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input w-auto text-sm"
                    >
                        <option value="">Category (optional)</option>
                        <option value="question">❓ Question</option>
                        <option value="suggestion">💡 Suggestion</option>
                        <option value="bug">🐛 Bug</option>
                        <option value="appreciation">🙏 Appreciation</option>
                    </select>
                )}

                <div className="flex gap-2 ml-auto">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn-ghost text-sm"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading || !body.trim()}
                        className="btn-primary text-sm"
                    >
                        {isLoading ? 'Posting...' : isReply ? 'Reply' : 'Post Comment'}
                    </button>
                </div>
            </div>
        </form>
    );
}
