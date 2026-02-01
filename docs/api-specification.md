# Cyberodessy API Specification

## Base URL
```
Production: https://cyberodessy.org/api
Development: http://localhost:3000/api
```

## Authentication
All authenticated endpoints require a valid Supabase JWT token in the `Authorization` header:
```
Authorization: Bearer <supabase_access_token>
```

---

## Authentication Endpoints

### GET /api/auth/session
Check current session status.

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "student@university.edu",
    "full_name": "Alex Chen",
    "username": "alexchen",
    "role": "student",
    "avatar_url": "https://...",
    "is_platform_verified": false
  },
  "session": {
    "access_token": "...",
    "expires_at": 1704067200
  }
}
```

**Response (401):**
```json
{ "error": "Not authenticated" }
```

---

## Projects

### POST /api/projects
Create a new project. **Auth required.**

**Request Body:**
```json
{
  "title": "Learning Rust by Building a CLI Tool",
  "description": "My journey building a command-line todo app to learn Rust fundamentals.",
  "tags": ["rust", "cli", "learning"],
  "repo_url": "https://github.com/alexchen/rust-todo",
  "demo_url": null,
  "image_urls": ["https://supabase.storage/.../screenshot.png"]
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "slug": "learning-rust-by-building-a-cli-tool-a1b2c3d4",
  "title": "Learning Rust by Building a CLI Tool",
  "description": "...",
  "user_id": "uuid",
  "status": "IN_PROGRESS",
  "tags": ["rust", "cli", "learning"],
  "repo_url": "https://github.com/alexchen/rust-todo",
  "demo_url": null,
  "image_urls": ["..."],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### GET /api/projects
List projects with pagination and filters.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 50)
- `tag` - Filter by tag
- `status` - Filter by status (IN_PROGRESS, COMPLETED, ABANDONED)
- `user` - Filter by user_id
- `search` - Full-text search on title/description

**Response (200):**
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

### GET /api/projects/:slug
Get project details with failure logs and stats.

**Response (200):**
```json
{
  "project": { ... },
  "user": { "id": "...", "full_name": "...", "username": "...", "avatar_url": "..." },
  "failure_logs": [...],
  "iterations": [...],
  "mentor_reviews": [...],
  "comment_count": 12
}
```

### PUT /api/projects/:id
Update a project. **Auth required (owner only).**

**Request Body:** (partial update)
```json
{
  "status": "COMPLETED",
  "description": "Updated description..."
}
```

### POST /api/projects/:id/iterations
Add iteration to project. **Auth required (owner only).**

**Request Body:**
```json
{
  "title": "Version 0.2 - Added persistence",
  "summary": "Implemented SQLite storage for todos.",
  "failure_log_id": "uuid-optional"
}
```

---

## Failure Logs

### POST /api/failure-logs
Create a failure log. **Auth required.**

**Request Body:**
```json
{
  "project_id": "uuid-optional",
  "goal": "Implement async file I/O in Rust",
  "what_went_wrong": "Couldn't understand lifetimes in async contexts",
  "attempts": "3 different approaches over 2 days",
  "what_tried": "1. Used tokio::fs directly\n2. Tried wrapping in Arc\n3. Asked on Discord",
  "outcome": "Finally understood I needed 'static lifetime bound",
  "lessons_learned": "Async Rust requires explicit lifetime management. Discord community is incredibly helpful.",
  "next_steps": "Apply this pattern to the database layer",
  "visibility": "public",
  "attachment_urls": []
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "project_id": "uuid",
  "goal": "...",
  "what_went_wrong": "...",
  "attempts": "...",
  "what_tried": "...",
  "outcome": "...",
  "lessons_learned": "...",
  "next_steps": "...",
  "visibility": "public",
  "attachment_urls": [],
  "created_at": "2024-01-15T14:00:00Z"
}
```

### GET /api/failure-logs/:id
Get a single failure log.

### GET /api/projects/:id/failure-logs
Get all failure logs for a project.

---

## Comments

### POST /api/comments
Create a comment. **Auth required.**

**Request Body:**
```json
{
  "target_type": "project",
  "target_id": "uuid",
  "category": "suggestion",
  "body": "Have you considered using the anyhow crate for error handling? It might simplify your code.",
  "parent_id": null
}
```

### GET /api/comments
Get comments for a target.

**Query Parameters:**
- `target_type` (required): "project" | "failure_log"
- `target_id` (required): uuid

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "user": { "id": "...", "full_name": "...", "username": "...", "avatar_url": "...", "role": "mentor" },
      "category": "suggestion",
      "body": "...",
      "is_pinned": false,
      "is_mentor_insight": true,
      "helpful_count": 5,
      "created_at": "...",
      "replies": [...]
    }
  ]
}
```

### POST /api/comments/:id/helpful
Mark a comment as helpful. **Auth required.**

---

## Mentors

### POST /api/mentor-apply
Submit mentor application. **Auth required.**

**Request Body:**
```json
{
  "answers": {
    "experience": "5 years as a software engineer...",
    "motivation": "I want to help students avoid the mistakes I made...",
    "mentoring_style": "I believe in asking guiding questions rather than giving answers...",
    "availability": "2-3 hours per week"
  },
  "github_url": "https://github.com/mentor",
  "linkedin_url": "https://linkedin.com/in/mentor"
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "status": "pending",
  "submitted_at": "2024-01-15T16:00:00Z"
}
```

### GET /api/mentor-applications
List pending applications. **Admin only.**

### POST /api/mentor-approve/:id
Approve/reject mentor application. **Admin only.**

**Request Body:**
```json
{
  "action": "approve",
  "notes": "Strong application with relevant experience."
}
```

---

## Mentor Reviews

### POST /api/mentor-reviews
Create a mentor review/endorsement. **Mentor only.**

**Request Body:**
```json
{
  "target_type": "failure_log",
  "target_id": "uuid",
  "review_text": "This is an excellent example of structured problem-solving. Your documentation of the debugging process will help others facing similar issues.",
  "growth_endorsement": {
    "skills_demonstrated": ["debugging", "research", "persistence"],
    "growth_areas": ["Consider breaking down problems into smaller steps"],
    "recommendation": "This student shows strong analytical thinking."
  }
}
```

### GET /api/mentor-reviews
Get reviews by mentor or for a target.

**Query Parameters:**
- `mentor_id` - Filter by mentor
- `target_type` + `target_id` - Filter by target

---

## Tokens & Gamification

### GET /api/tokens/:user_id
Get user's token balance.

**Response (200):**
```json
{
  "balance": 150,
  "total_earned": 200,
  "total_spent": 50
}
```

### POST /api/tokens/award
Award tokens (system/admin). **Service role only.**

**Request Body:**
```json
{
  "user_id": "uuid",
  "amount": 10,
  "action": "project_created",
  "reference_type": "project",
  "reference_id": "uuid"
}
```

### GET /api/badges
List all badge definitions.

### GET /api/users/:id/badges
Get user's earned badges.

---

## Resources

### GET /api/resources
List resources with filters.

**Query Parameters:**
- `tag` - Filter by tag
- `open_access` - Filter by open access (true/false)
- `search` - Search title/description

### POST /api/resources
Add a resource. **Auth required (curator/admin enforced in API).**

---

## Admin

### GET /api/admin/reports
Get moderation queue. **Admin only.**

**Query Parameters:**
- `status` - Filter by status (pending, reviewed, resolved, dismissed)

### POST /api/admin/moderate
Take moderation action. **Admin only.**

**Request Body:**
```json
{
  "target_type": "comment",
  "target_id": "uuid",
  "action": "hide",
  "reason": "Violates community guidelines"
}
```

---

## Rate Limiting

All endpoints are rate-limited:
- Authenticated: 100 requests/minute
- Unauthenticated: 20 requests/minute

**Response (429):**
```json
{
  "error": "Too many requests",
  "retry_after": 60
}
```

---

## Error Responses

**400 Bad Request:**
```json
{ "error": "Validation failed", "details": { "title": "Required" } }
```

**401 Unauthorized:**
```json
{ "error": "Authentication required" }
```

**403 Forbidden:**
```json
{ "error": "You do not have permission to perform this action" }
```

**404 Not Found:**
```json
{ "error": "Resource not found" }
```

**500 Internal Server Error:**
```json
{ "error": "An unexpected error occurred" }
```
