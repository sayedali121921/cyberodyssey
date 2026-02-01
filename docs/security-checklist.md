# Cyberodessy - Security Checklist

## Authentication & Authorization

### OAuth Security
- [ ] Use Supabase Auth for all OAuth flows (Google, GitHub)
- [ ] Enable PKCE flow for OAuth (Supabase default)
- [ ] Validate OAuth state parameter to prevent CSRF
- [ ] Store tokens securely (httpOnly cookies via Supabase)
- [ ] Implement proper session expiry and refresh

### Session Management
- [ ] Set secure cookie attributes (`httpOnly`, `secure`, `sameSite=lax`)
- [ ] Implement session timeout (default: 1 week, configurable)
- [ ] Provide logout functionality that clears all sessions
- [ ] Invalidate sessions on password/email change

### Role-Based Access Control
- [ ] Default new users to `student` role
- [ ] Mentor role only via admin approval
- [ ] Admin role only via direct database update
- [ ] Verify role on every protected API endpoint
- [ ] Use Supabase RLS for data-level access control

---

## Row-Level Security (RLS)

### Required Policies (see rls_policies.sql)
- [ ] Users: Read all, update own, no self-role-change
- [ ] Projects: Read all, CRUD own only
- [ ] Failure logs: Read public or own, CRUD own only
- [ ] Comments: Read all, CRUD own only
- [ ] Mentor applications: Read own + admin, create own
- [ ] Mentor reviews: Read all, create only if mentor role
- [ ] Tokens: Read own, modify via service role only
- [ ] Reports: Read own + admin, create own

### RLS Testing
- [ ] Test user A cannot read user B's private failure logs
- [ ] Test user A cannot update user B's projects
- [ ] Test non-mentors cannot create mentor reviews
- [ ] Test non-admins cannot view mentor applications
- [ ] Test token balance cannot be modified directly

---

## Input Validation & Sanitization

### API Input Validation
- [ ] Validate all request bodies with Zod schemas
- [ ] Sanitize HTML in user-generated content (DOMPurify)
- [ ] Limit string lengths (title: 200, description: 5000, etc.)
- [ ] Validate UUIDs for all ID parameters
- [ ] Validate URLs (repo_url, demo_url, etc.)
- [ ] Validate email format

### File Upload Validation
- [ ] Restrict file types: images (jpg, png, gif, webp), PDF
- [ ] Limit file sizes: images ≤ 2MB, PDF ≤ 5MB
- [ ] Validate MIME types server-side (not just extension)
- [ ] Scan for malicious content (optional, later)
- [ ] Generate unique filenames (prevent path traversal)
- [ ] Store in Supabase Storage with authenticated access

### SQL Injection Prevention
- [ ] Use parameterized queries (Supabase client handles this)
- [ ] Never interpolate user input into SQL
- [ ] Use prepared statements for raw SQL if needed

### XSS Prevention
- [ ] Escape HTML output in React (default behavior)
- [ ] Sanitize markdown rendering (use safe renderer)
- [ ] Set Content-Security-Policy headers
- [ ] Avoid dangerouslySetInnerHTML

---

## API Security

### Rate Limiting
```typescript
// Recommended limits
const rateLimits = {
  authenticated: { requests: 100, window: '1m' },
  unauthenticated: { requests: 20, window: '1m' },
  login: { requests: 5, window: '15m' },
  signup: { requests: 3, window: '1h' },
  fileUpload: { requests: 10, window: '1h' }
};
```

- [ ] Implement rate limiting on all endpoints
- [ ] Stricter limits on auth endpoints
- [ ] Return 429 with Retry-After header
- [ ] Log rate limit violations

### API Route Protection
- [ ] Verify JWT on all authenticated endpoints
- [ ] Check user role for role-protected endpoints
- [ ] Validate ownership for resource modifications
- [ ] Return consistent error responses (401, 403, 404)

### CORS Configuration
```typescript
// next.config.js
const corsOptions = {
  origin: ['https://cyberodessy.org'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
```

---

## Infrastructure Security

### HTTPS
- [ ] Vercel provides HTTPS by default
- [ ] Force HTTPS redirect (Vercel default)
- [ ] Set HSTS header
- [ ] Use secure WebSocket connections (wss://)

### Environment Variables
- [ ] Store all secrets in environment variables
- [ ] Never commit .env files
- [ ] Use Vercel environment variables for production
- [ ] Separate dev/staging/production secrets
- [ ] Rotate secrets periodically

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=  # Never expose to client

# OAuth (configured in Supabase)
# GOOGLE_CLIENT_ID=
# GOOGLE_CLIENT_SECRET=
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=

# App
NEXT_PUBLIC_SITE_URL=https://cyberodessy.org
```

### Headers Configuration
```typescript
// next.config.js headers
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: cspHeader }
];
```

---

## Data Protection

### Sensitive Data Handling
- [ ] Hash passwords (Supabase Auth handles this)
- [ ] Encrypt sensitive data at rest (Supabase default)
- [ ] Mask email in public responses if needed
- [ ] Don't log sensitive data (passwords, tokens)

### Backup & Recovery
- [ ] Enable Supabase automatic backups (Pro tier)
- [ ] Test restoration procedures
- [ ] Document recovery process

### Data Retention
- [ ] Define retention policy for user data
- [ ] Implement account deletion (GDPR compliance)
- [ ] Cascade delete related data on user deletion

---

## Monitoring & Logging

### Error Logging
- [ ] Set up Sentry or LogRocket (optional, later)
- [ ] Log authentication failures
- [ ] Log rate limit violations
- [ ] Log suspicious activity patterns

### Audit Logging
- [ ] Log admin actions
- [ ] Log role changes
- [ ] Log moderation actions

### Alerting
- [ ] Alert on repeated auth failures
- [ ] Alert on unusual traffic patterns
- [ ] Alert on error rate spikes

---

## Content Moderation

### Abuse Prevention
- [ ] Implement content reporting system
- [ ] Admin review queue for reports
- [ ] Soft-block (hide) capability
- [ ] User ban capability
- [ ] Rate limit content creation

### Spam Detection (Later)
- [ ] Detect rapid identical posts
- [ ] Detect low-effort content
- [ ] Flag for review, don't auto-block

---

## Compliance

### Privacy
- [ ] Create privacy policy page
- [ ] Create terms of service page
- [ ] Implement cookie consent (if using analytics)
- [ ] Honor data deletion requests
- [ ] Document data processing activities

### Accessibility (WCAG 2.1 AA)
- [ ] Semantic HTML structure
- [ ] Proper heading hierarchy
- [ ] Alt text for images
- [ ] Keyboard navigation support
- [ ] Focus visible states
- [ ] Color contrast ≥ 4.5:1
- [ ] Form labels and error messages
- [ ] Skip navigation links

---

## Pre-Launch Checklist

### Before Going Live
- [ ] All RLS policies tested and verified
- [ ] Rate limiting enabled
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured with HTTPS
- [ ] Security headers configured
- [ ] OAuth providers configured in Supabase
- [ ] Error monitoring set up
- [ ] Backup policy in place
- [ ] Privacy policy and ToS published
- [ ] Basic abuse detection enabled
