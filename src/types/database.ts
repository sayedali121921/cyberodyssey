// Database Types - Generated from schema.sql
// These types match the Supabase database schema

export type UserRole = 'student' | 'mentor' | 'senior_mentor' | 'admin';
export type ProjectStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
export type Visibility = 'public' | 'private';
export type CommentCategory = 'question' | 'suggestion' | 'bug' | 'appreciation';
export type TargetType = 'project' | 'failure_log';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';
export type FlagType = 'hidden' | 'removed' | 'warning';

// ===========================================
// Core Tables
// ===========================================

export interface User {
    id: string;
    email: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    role: UserRole;
    bio: string | null;
    github_url: string | null;
    linkedin_url: string | null;
    is_platform_verified: boolean;
    is_community_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: string;
    user_id: string;
    title: string;
    slug: string;
    description: string | null;
    repo_url: string | null;
    demo_url: string | null;
    status: ProjectStatus;
    tags: string[];
    image_urls: string[];
    created_at: string;
    updated_at: string;
}

export interface Iteration {
    id: string;
    project_id: string;
    title: string | null;
    summary: string | null;
    failure_log_id: string | null;
    created_at: string;
}

export interface FailureLog {
    id: string;
    user_id: string;
    project_id: string | null;
    goal: string;
    what_went_wrong: string;
    attempts: string | null;
    what_tried: string | null;
    outcome: string | null;
    lessons_learned: string | null;
    next_steps: string | null;
    attachment_urls: string[];
    visibility: Visibility;
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: string;
    user_id: string;
    parent_id: string | null;
    target_type: TargetType;
    target_id: string;
    category: CommentCategory | null;
    body: string;
    is_pinned: boolean;
    is_mentor_insight: boolean;
    helpful_count: number;
    created_at: string;
    updated_at: string;
}

export interface HelpfulMark {
    id: string;
    user_id: string;
    comment_id: string;
    created_at: string;
}

// ===========================================
// Mentor Tables
// ===========================================

export interface MentorApplication {
    id: string;
    user_id: string;
    answers: MentorApplicationAnswers;
    github_url: string | null;
    linkedin_url: string | null;
    github_account_age_days: number | null;
    github_public_repos: number | null;
    status: ApplicationStatus;
    reviewer_id: string | null;
    review_notes: string | null;
    submitted_at: string;
    reviewed_at: string | null;
}

export interface MentorApplicationAnswers {
    experience: string;
    motivation: string;
    mentoring_style: string;
    availability: string;
}

export interface MentorVerification {
    id: string;
    user_id: string;
    oauth_verified: boolean;
    application_approved: boolean;
    community_verified: boolean;
    reviews_count: number;
    student_confirmations: number;
    verified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface MentorReview {
    id: string;
    mentor_id: string;
    target_type: TargetType;
    target_id: string;
    review_text: string;
    growth_endorsement: GrowthEndorsement | null;
    is_confirmed: boolean;
    created_at: string;
}

export interface GrowthEndorsement {
    skills_demonstrated: string[];
    growth_areas: string | null;
    recommendation: string | null;
}

// ===========================================
// Gamification Tables
// ===========================================

export interface TokenBalance {
    id: string;
    user_id: string;
    balance: number;
    total_earned: number;
    total_spent: number;
    last_updated: string;
}

export interface TokenTransaction {
    id: string;
    user_id: string;
    amount: number;
    action: string;
    reference_type: string | null;
    reference_id: string | null;
    created_at: string;
}

export interface Badge {
    id: string;
    code: string;
    name: string;
    description: string | null;
    icon_url: string | null;
    category: string | null;
    created_at: string;
}

export interface UserBadge {
    id: string;
    user_id: string;
    badge_id: string;
    awarded_at: string;
}

// ===========================================
// Resource & Moderation Tables
// ===========================================

export interface Resource {
    id: string;
    title: string;
    url: string;
    authors: string[];
    description: string | null;
    summary: string | null;
    summary_author_id: string | null;
    tags: string[];
    is_open_access: boolean;
    upvotes: number;
    created_by: string | null;
    created_at: string;
}

export interface Report {
    id: string;
    reporter_id: string | null;
    target_type: string;
    target_id: string;
    reason: string;
    details: string | null;
    status: ReportStatus;
    reviewer_id: string | null;
    resolution: string | null;
    created_at: string;
    reviewed_at: string | null;
}

export interface ContentFlag {
    id: string;
    target_type: string;
    target_id: string;
    flag_type: FlagType;
    reason: string | null;
    flagged_by: string | null;
    created_at: string;
}

// ===========================================
// Joined/Enriched Types (for API responses)
// ===========================================

export interface ProjectWithUser extends Project {
    user: Pick<User, 'id' | 'full_name' | 'username' | 'avatar_url' | 'role'>;
}

export interface ProjectDetail extends Project {
    user: Pick<User, 'id' | 'full_name' | 'username' | 'avatar_url' | 'role'>;
    failure_logs: FailureLog[];
    iterations: Iteration[];
    mentor_reviews: MentorReviewWithMentor[];
    comment_count: number;
}

export interface CommentWithUser extends Comment {
    user: Pick<User, 'id' | 'full_name' | 'username' | 'avatar_url' | 'role'>;
    replies?: CommentWithUser[];
}

export interface MentorReviewWithMentor extends MentorReview {
    mentor: Pick<User, 'id' | 'full_name' | 'username' | 'avatar_url'>;
}

export interface UserProfile extends User {
    token_balance: number;
    badges: (UserBadge & { badge: Badge })[];
    project_count: number;
    failure_log_count: number;
}

// ===========================================
// Timeline Event Types
// ===========================================

export type TimelineEventType =
    | 'project_created'
    | 'project_completed'
    | 'failure_log_created'
    | 'iteration_added'
    | 'mentor_review_received'
    | 'badge_earned';

export interface TimelineEvent {
    id: string;
    type: TimelineEventType;
    title: string;
    description: string | null;
    date: string;
    reference_type: string | null;
    reference_id: string | null;
}
