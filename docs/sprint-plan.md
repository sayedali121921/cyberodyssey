# Cyberodessy - 12-Week Sprint Plan

## Overview

| Phase | Weeks | Focus | Goal |
|-------|-------|-------|------|
| 1 | 0-3 | Foundation | Auth, DB, core CRUD |
| 2 | 4-8 | Features | Mentors, gamification, identity |
| 3 | 9-12 | Polish | Admin, export, deploy |

---

## Week 0: Project Setup

### Objectives
- Initialize project infrastructure
- Set up development environment

### Tasks
- [ ] Create GitHub repository
- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS with design tokens
- [ ] Set up Supabase project
- [ ] Configure environment variables
- [ ] Set up Vercel deployment
- [ ] Register/configure custom domain

### Acceptance Criteria
- [ ] `npm run dev` runs successfully
- [ ] Vercel preview deployment works
- [ ] Supabase connection established

---

## Week 1: Authentication & User Model

### Objectives
- Implement OAuth authentication
- Create user management

### Tasks
- [ ] Configure Supabase Auth (Google, GitHub)
- [ ] Create auth pages (login, callback)
- [ ] Implement auth context/provider
- [ ] Create user profile setup flow
- [ ] Build header with auth state
- [ ] Apply RLS policies for users table

### Acceptance Criteria
- [ ] Users can sign in with Google
- [ ] Users can sign in with GitHub
- [ ] User profile created on first login
- [ ] Session persists across page refreshes
- [ ] Logout works correctly

---

## Week 2: Database Schema & Core API

### Objectives
- Deploy database schema
- Create foundational API routes

### Tasks
- [ ] Run schema.sql in Supabase
- [ ] Run rls_policies.sql in Supabase
- [ ] Create API route: GET /api/auth/session
- [ ] Create API route: POST/GET /api/projects
- [ ] Create API route: POST/GET /api/failure-logs
- [ ] Set up Zod validation schemas
- [ ] Create TypeScript database types

### Acceptance Criteria
- [ ] All tables created with correct relationships
- [ ] RLS policies prevent unauthorized access
- [ ] API routes return correct data shapes

---

## Week 3: Project CRUD & Pages

### Objectives
- Implement project creation and display
- Build project listing and detail pages

### Tasks
- [ ] Create project form component
- [ ] Build /new/project page
- [ ] Implement slug generation
- [ ] Create ProjectCard component
- [ ] Build /projects listing page
- [ ] Build /projects/[slug] detail page
- [ ] Add project status badges
- [ ] Implement tag filtering

### Acceptance Criteria
- [ ] Users can create projects with all fields
- [ ] Projects display on listing page
- [ ] Project detail page shows all information
- [ ] Tags are clickable filters
- [ ] Status displays correctly

---

## Week 4: Failure Logs

### Objectives
- Implement failure log creation
- Link logs to projects

### Tasks
- [ ] Create failure log form (structured fields)
- [ ] Build /new/failure-log page
- [ ] Create FailureLogCard component
- [ ] Display failure logs on project page
- [ ] Implement collapsible log view
- [ ] Add visibility toggle (public/private)
- [ ] Create standalone /failure-logs/[id] page

### Acceptance Criteria
- [ ] Users can create failure logs with all fields
- [ ] Logs link to projects correctly
- [ ] Private logs only visible to owner
- [ ] Logs display on project pages
- [ ] Collapsible UI works

---

## Week 5: Comments System

### Objectives
- Implement threaded comments
- Add comment categories

### Tasks
- [ ] Create comments API endpoints
- [ ] Build CommentThread component
- [ ] Create CommentForm component
- [ ] Implement reply threading (one level)
- [ ] Add category selection
- [ ] Create helpful mark functionality
- [ ] Display comments on projects and logs

### Acceptance Criteria
- [ ] Users can post comments
- [ ] Comments display in threads
- [ ] Categories display correctly
- [ ] Helpful marks increment count
- [ ] Owner can mark comments helpful

---

## Week 6: Mentor Application Flow

### Objectives
- Build mentor application system
- Create initial admin approval

### Tasks
- [ ] Create mentor application form
- [ ] Build /mentor/apply page
- [ ] Create API: POST /api/mentor-apply
- [ ] Create API: GET /api/mentor-applications (admin)
- [ ] Create API: POST /api/mentor-approve/:id
- [ ] Build basic admin view for applications
- [ ] Update user role on approval

### Acceptance Criteria
- [ ] Students can submit mentor application
- [ ] Applications saved with all answers
- [ ] Admin can view pending applications
- [ ] Admin can approve/reject
- [ ] User role updates to 'mentor'

---

## Week 7: Mentor Reviews & Verification

### Objectives
- Implement mentor review system
- Add verification badges

### Tasks
- [ ] Create mentor review form
- [ ] Build API: POST /api/mentor-reviews
- [ ] Display reviews on projects/logs
- [ ] Create MentorBadge component
- [ ] Implement verification tiers
- [ ] Create student confirmation flow
- [ ] Update community verification status

### Acceptance Criteria
- [ ] Mentors can submit structured reviews
- [ ] Reviews display on target content
- [ ] Mentor badge shows on profiles
- [ ] Students can confirm reviews
- [ ] Community verification triggers at threshold

---

## Week 8: Token Economy & Badges

### Objectives
- Implement gamification system
- Create badge awards

### Tasks
- [ ] Create tokens table management
- [ ] Implement token award on actions
- [ ] Create token spending for perks
- [ ] Build badge award logic
- [ ] Create BadgeDisplay component
- [ ] Create TokenBadge component
- [ ] Display badges on profile

### Acceptance Criteria
- [ ] Tokens awarded for all defined actions
- [ ] Token balance displays correctly
- [ ] Badges awarded at thresholds
- [ ] Badges display on profile
- [ ] Token spending works for perks

---

## Week 9: Learning Identity & Timeline

### Objectives
- Build profile/timeline page
- Create learning arc visualization

### Tasks
- [ ] Build /profile/[username] page
- [ ] Create Timeline component
- [ ] Aggregate user activity
- [ ] Create LearningArc chart component
- [ ] Display statistics
- [ ] Show badges and tokens
- [ ] Add bio editing

### Acceptance Criteria
- [ ] Profile shows user info
- [ ] Timeline displays chronological events
- [ ] Learning arc visualizes growth
- [ ] Stats are accurate
- [ ] Badges display correctly

---

## Week 10: PDF Export

### Objectives
- Implement learning transcript export
- Create printable PDF

### Tasks
- [ ] Create export API endpoint
- [ ] Build PDF template
- [ ] Include projects, logs, reviews
- [ ] Add badges and timeline
- [ ] Create ExportPDFButton component
- [ ] Style for print

### Acceptance Criteria
- [ ] Export button generates PDF
- [ ] PDF includes all relevant data
- [ ] PDF is properly formatted
- [ ] Links work in PDF (where applicable)

---

## Week 11: Admin Dashboard & Moderation

### Objectives
- Build admin tools
- Implement moderation

### Tasks
- [ ] Create /admin page (role-protected)
- [ ] Build report viewing interface
- [ ] Implement content hiding
- [ ] Create moderation action API
- [ ] Add user management
- [ ] Build metrics dashboard

### Acceptance Criteria
- [ ] Admin can view reports
- [ ] Admin can hide content
- [ ] Admin can ban users
- [ ] Basic metrics display
- [ ] Non-admins cannot access

---

## Week 12: Polish & Deploy

### Objectives
- Final optimizations
- Production launch

### Tasks
- [ ] Add SEO meta tags to all pages
- [ ] Implement Open Graph tags
- [ ] Optimize images (next/image)
- [ ] Add loading states
- [ ] Implement error boundaries
- [ ] Run Lighthouse audit
- [ ] Fix accessibility issues
- [ ] Final security review
- [ ] Configure production environment
- [ ] Deploy to production
- [ ] Monitor for issues

### Acceptance Criteria
- [ ] Lighthouse score > 80
- [ ] All pages have meta tags
- [ ] Mobile responsive
- [ ] No critical errors
- [ ] Production stable

---

## Post-Launch (Week 13+)

### Priority 1: Stability
- Monitor error rates
- Fix critical bugs
- Gather user feedback

### Priority 2: Growth
- Seed initial content
- Invite mentors
- Community building

### Priority 3: Enhancements
- Resource library
- Enhanced search
- Notifications
- Mobile optimizations

---

## Sprint Methodology

### Daily
- Progress tracking in task.md
- Commit working code

### Weekly
- Sprint review
- Demo progress
- Plan next week

### Tools
- GitHub Issues for tracking
- GitHub Projects for kanban
- Vercel previews for review
