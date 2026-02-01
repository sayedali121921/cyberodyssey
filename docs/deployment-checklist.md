# Cyberodessy - Deployment Checklist

## Pre-Deployment Setup

### 1. Domain Configuration

**Domain:** cyberodessy.org

#### DNS Settings
```
Type    Name    Value                       TTL
A       @       76.76.21.21                 300
CNAME   www     cname.vercel-dns.com        300
```

#### Vercel Domain Setup
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add `cyberodessy.org`
3. Add `www.cyberodessy.org` (redirect to apex)
4. Verify DNS propagation

---

### 2. Supabase Project Setup

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project: `cyberodessy-prod`
3. Choose region closest to target users (e.g., `us-east-1`)
4. Save database password securely

#### Run Database Migrations
```bash
# Option 1: Using Supabase CLI
supabase db push

# Option 2: Manual via SQL Editor
# 1. Open Supabase Dashboard → SQL Editor
# 2. Paste and run contents of supabase/schema.sql
# 3. Paste and run contents of supabase/rls_policies.sql
```

#### Configure Authentication
1. Go to Authentication → Providers
2. Enable **Google**:
   - Create OAuth app in [Google Cloud Console](https://console.cloud.google.com)
   - Authorized redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase
3. Enable **GitHub**:
   - Create OAuth app in [GitHub Developer Settings](https://github.com/settings/developers)
   - Authorization callback URL: `https://<project-ref>.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

#### Configure Storage
1. Go to Storage → Create bucket: `uploads`
2. Set bucket to private (RLS will control access)
3. Add storage policies:
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public read for public files
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');
```

#### Get API Keys
From Settings → API:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

### 3. Vercel Project Setup

#### Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Import Git Repository
3. Select repository: `cyberodyssey`
4. Framework Preset: Next.js (auto-detected)

#### Environment Variables
Add the following in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project>.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | All |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Production only |
| `NEXT_PUBLIC_SITE_URL` | `https://cyberodessy.org` | Production |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Development |

#### Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs"
}
```

---

### 4. Local Development Setup

#### Clone and Install
```bash
git clone https://github.com/your-username/cyberodyssey.git
cd cyberodyssey
npm install
```

#### Environment File
Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Run Development Server
```bash
npm run dev
```

---

## Deployment Workflow

### Automatic Deployments
- **Production:** Push to `main` branch → Auto-deploy to cyberodessy.org
- **Preview:** Push to any branch → Preview URL generated

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Post-Deployment Verification

### 1. Core Functionality Tests
- [ ] Home page loads correctly
- [ ] OAuth login works (Google)
- [ ] OAuth login works (GitHub)
- [ ] Create project works
- [ ] Create failure log works
- [ ] Comments work
- [ ] File upload works
- [ ] Profile page displays correctly

### 2. Security Checks
- [ ] HTTPS enforced (HTTP redirects)
- [ ] Security headers present (check in DevTools)
- [ ] RLS policies working (test cross-user access)
- [ ] Rate limiting active

### 3. Performance Checks
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s
- [ ] Lighthouse score > 80

### 4. SEO Checks
- [ ] Meta tags present on all pages
- [ ] Open Graph tags working
- [ ] robots.txt accessible
- [ ] sitemap.xml generated (if implemented)

---

## Monitoring Setup

### Vercel Analytics (Free)
1. Go to Vercel Dashboard → Analytics
2. Enable Web Analytics
3. Add to `_app.tsx` or root layout

### Supabase Monitoring
1. Dashboard → Database → Performance
2. Monitor query performance
3. Check connection counts

### Error Monitoring (Optional)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Rollback Procedure

### Vercel Rollback
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Database Rollback
1. Supabase Dashboard → Database → Backups
2. Restore from point-in-time backup
3. Note: Only available on Pro tier

---

## Environment-Specific Configuration

### Development
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### Staging (Preview Deployments)
```
NEXT_PUBLIC_SITE_URL=https://<branch>-cyberodyssey.vercel.app
NODE_ENV=production
```

### Production
```
NEXT_PUBLIC_SITE_URL=https://cyberodessy.org
NODE_ENV=production
```

---

## Cost Monitoring

### Free Tier Limits

| Service | Limit | Alert Threshold |
|---------|-------|-----------------|
| Supabase DB | 500 MB | 400 MB (80%) |
| Supabase Storage | 1 GB | 800 MB (80%) |
| Supabase API | 50k/month | 40k/month (80%) |
| Vercel Bandwidth | 100 GB | 80 GB (80%) |
| Vercel Serverless | 100 GB-hrs | 80 GB-hrs (80%) |

### Monitoring Locations
- Supabase: Dashboard → Project Settings → Usage
- Vercel: Dashboard → Usage

### Upgrade Triggers
- Storage > 70% → Consider Supabase Pro ($25/mo)
- Bandwidth > 80% → Consider Vercel Pro ($20/mo)
- Active users > 500 → Evaluate infrastructure needs

---

## Maintenance Tasks

### Weekly
- [ ] Check Supabase usage dashboard
- [ ] Review error logs
- [ ] Check Vercel deployment health

### Monthly
- [ ] Review and update dependencies
- [ ] Check for security advisories
- [ ] Backup configuration review

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Cost optimization review
