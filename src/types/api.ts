// API Request/Response Types
import { z } from 'zod';
import type {
    User,
    Project,
    FailureLog,
    Comment,
    MentorApplication,
    MentorReview,
    Resource,
    ProjectStatus,
    Visibility,
    CommentCategory,
    TargetType,
} from './database';

// ===========================================
// Validation Schemas (Zod)
// ===========================================

export const createProjectSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().max(5000).optional(),
    tags: z.array(z.string().max(50)).max(10).optional(),
    repo_url: z.string().url().optional().nullable(),
    demo_url: z.string().url().optional().nullable(),
    image_urls: z.array(z.string().url()).max(10).optional(),
});

export const updateProjectSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().max(5000).optional(),
    status: z.enum(['IN_PROGRESS', 'COMPLETED', 'ABANDONED'] as const).optional(),
    tags: z.array(z.string().max(50)).max(10).optional(),
    repo_url: z.string().url().optional().nullable(),
    demo_url: z.string().url().optional().nullable(),
    image_urls: z.array(z.string().url()).max(10).optional(),
});

export const createIterationSchema = z.object({
    title: z.string().min(1).max(200),
    summary: z.string().max(2000).optional(),
    failure_log_id: z.string().uuid().optional().nullable(),
});

export const createFailureLogSchema = z.object({
    project_id: z.string().uuid().optional().nullable(),
    goal: z.string().min(1).max(1000),
    what_went_wrong: z.string().min(1).max(3000),
    attempts: z.string().max(2000).optional(),
    what_tried: z.string().max(3000).optional(),
    outcome: z.string().max(2000).optional(),
    lessons_learned: z.string().max(3000).optional(),
    next_steps: z.string().max(1000).optional(),
    visibility: z.enum(['public', 'private'] as const).optional(),
    attachment_urls: z.array(z.string().url()).max(5).optional(),
});

export const createCommentSchema = z.object({
    target_type: z.enum(['project', 'failure_log'] as const),
    target_id: z.string().uuid(),
    category: z.enum(['question', 'suggestion', 'bug', 'appreciation'] as const).optional(),
    body: z.string().min(1).max(2000),
    parent_id: z.string().uuid().optional().nullable(),
});

export const mentorApplySchema = z.object({
    answers: z.object({
        experience: z.string().min(50).max(2000),
        motivation: z.string().min(50).max(2000),
        mentoring_style: z.string().min(50).max(2000),
        availability: z.string().min(1).max(200),
    }),
    github_url: z.string().url(),
    linkedin_url: z.string().url(),
});

export const mentorReviewSchema = z.object({
    target_type: z.enum(['project', 'failure_log'] as const),
    target_id: z.string().uuid(),
    review_text: z.string().min(50).max(3000),
    growth_endorsement: z.object({
        skills_demonstrated: z.array(z.string().max(50)).max(10),
        growth_areas: z.string().max(1000).optional(),
        recommendation: z.string().max(500).optional(),
    }).optional(),
});

export const createResourceSchema = z.object({
    title: z.string().min(1).max(200),
    url: z.string().url(),
    authors: z.array(z.string().max(100)).max(10).optional(),
    description: z.string().max(2000).optional(),
    tags: z.array(z.string().max(50)).max(10).optional(),
    is_open_access: z.boolean().optional(),
});

export const moderateContentSchema = z.object({
    target_type: z.enum(['project', 'failure_log', 'comment', 'user'] as const),
    target_id: z.string().uuid(),
    action: z.enum(['hide', 'remove', 'warn', 'ban'] as const),
    reason: z.string().min(1).max(500),
});

// ===========================================
// Request Types (inferred from schemas)
// ===========================================

export type CreateProjectRequest = z.infer<typeof createProjectSchema>;
export type UpdateProjectRequest = z.infer<typeof updateProjectSchema>;
export type CreateIterationRequest = z.infer<typeof createIterationSchema>;
export type CreateFailureLogRequest = z.infer<typeof createFailureLogSchema>;
export type CreateCommentRequest = z.infer<typeof createCommentSchema>;
export type MentorApplyRequest = z.infer<typeof mentorApplySchema>;
export type MentorReviewRequest = z.infer<typeof mentorReviewSchema>;
export type CreateResourceRequest = z.infer<typeof createResourceSchema>;
export type ModerateContentRequest = z.infer<typeof moderateContentSchema>;

// ===========================================
// Response Types
// ===========================================

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface SessionResponse {
    user: Pick<User, 'id' | 'email' | 'full_name' | 'username' | 'role' | 'avatar_url' | 'is_platform_verified'>;
    session: {
        access_token: string;
        expires_at: number;
    };
}

// ===========================================
// Query Parameters
// ===========================================

export interface ProjectsQueryParams {
    page?: number;
    limit?: number;
    tag?: string;
    status?: ProjectStatus;
    user?: string;
    search?: string;
}

export interface CommentsQueryParams {
    target_type: TargetType;
    target_id: string;
}

export interface MentorReviewsQueryParams {
    mentor_id?: string;
    target_type?: TargetType;
    target_id?: string;
}

export interface ResourcesQueryParams {
    page?: number;
    limit?: number;
    tag?: string;
    open_access?: boolean;
    search?: string;
}

// ===========================================
// Error Types
// ===========================================

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public details?: Record<string, string>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const ERROR_CODES = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 400,
    RATE_LIMITED: 429,
    INTERNAL_ERROR: 500,
} as const;
