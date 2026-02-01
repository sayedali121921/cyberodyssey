# Cyberodessy - Cost Projection (12 Months)

## Summary

| Scenario | Monthly Cost | Annual Cost |
|----------|--------------|-------------|
| Free Tier (0-500 users) | **$1** | **~$12** |
| Growth Tier (500-2000 users) | **$45-65** | **$540-780** |
| Scale Tier (2000+ users) | **$100+** | **$1200+** |

---

## Free Tier Breakdown (Months 1-6)

### Hosting: Vercel Hobby (Free)
- **Bandwidth:** 100 GB/month ✓
- **Serverless Execution:** 100 GB-hrs/month ✓
- **Builds:** 6000 minutes/month ✓
- **Deployments:** Unlimited ✓

### Database & Auth: Supabase Free
- **Database:** 500 MB ✓
- **Storage:** 1 GB ✓
- **Auth Users:** Unlimited ✓
- **API Requests:** 50,000/month ✓
- **Realtime Messages:** 2 million/month ✓

### Domain
- **cyberodessy.org:** ~$12/year (~$1/month)

### Total Free Tier: ~$1/month

---

## Usage Projections

### Assumptions
- 1 project = ~1 KB (text only)
- 1 failure log = ~2 KB
- 1 image upload = ~200 KB (compressed)
- 1 user profile = ~0.5 KB
- Average active user: 3 projects, 5 logs, 2 images

### Month 1-3: Seed Phase
| Metric | Value | Storage/Requests |
|--------|-------|------------------|
| Users | 50 | 25 KB |
| Projects | 100 | 100 KB |
| Failure Logs | 200 | 400 KB |
| Images | 100 | 20 MB |
| API Requests | ~5,000/month | ✓ |
| **Total Storage** | **~21 MB** | 4% of 500 MB |

### Month 4-6: Early Growth
| Metric | Value | Storage/Requests |
|--------|-------|------------------|
| Users | 200 | 100 KB |
| Projects | 400 | 400 KB |
| Failure Logs | 1,000 | 2 MB |
| Images | 500 | 100 MB |
| API Requests | ~20,000/month | ✓ |
| **Total Storage** | **~103 MB** | 21% of 500 MB |

### Month 7-12: Growth Phase
| Metric | Value | Storage/Requests |
|--------|-------|------------------|
| Users | 500 | 250 KB |
| Projects | 1,000 | 1 MB |
| Failure Logs | 3,000 | 6 MB |
| Images | 2,000 | 400 MB |
| API Requests | ~40,000/month | ⚠️ 80% |
| **Total Storage** | **~407 MB** | ⚠️ 81% of 500 MB |

---

## Upgrade Triggers

### Supabase Pro ($25/month) - Trigger When:
- [ ] Database storage > 400 MB (80% of free tier)
- [ ] API requests > 40,000/month (80% of free tier)
- [ ] Need point-in-time recovery backups
- [ ] Need more than 2 concurrent connections

### Vercel Pro ($20/month) - Trigger When:
- [ ] Bandwidth > 80 GB/month
- [ ] Need custom domains per branch
- [ ] Need password protection for previews
- [ ] Need more team collaboration features

---

## Growth Tier Costs (Months 6-12)

If growth exceeds free tier limits:

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Vercel | Pro | $20 |
| Supabase | Pro | $25 |
| Domain | - | $1 |
| Error Monitoring (Sentry) | Free/Developer | $0-$26 |
| **Total** | | **$46-72** |

---

## Optional Services

### Error Monitoring
| Service | Free Tier | Paid |
|---------|-----------|------|
| Sentry | 5k errors/month | $26/month (50k) |
| LogRocket | 1k sessions/month | $99/month (10k) |
| **Recommendation:** Start with Sentry free tier |

### Analytics
| Service | Free Tier | Paid |
|---------|-----------|------|
| Plausible | - | $9/month |
| Google Analytics | Unlimited | Free |
| Vercel Analytics | 2.5k events | Included in Pro |
| **Recommendation:** Start with Vercel Analytics (free) |

### Email (Future)
| Service | Free Tier | Paid |
|---------|-----------|------|
| Resend | 3k emails/month | $20/month |
| SendGrid | 100/day | $15/month |
| **Recommendation:** Defer until needed |

---

## 12-Month Cost Scenarios

### Scenario A: Modest Growth (Target)
**500 users by month 12**

| Month | Service | Cost |
|-------|---------|------|
| 1-6 | Free tiers + domain | $6 |
| 7-12 | Free tiers + domain | $6 |
| **Annual Total** | | **~$12** |

### Scenario B: Strong Growth
**1,000+ users by month 12**

| Month | Service | Cost |
|-------|---------|------|
| 1-6 | Free tiers + domain | $6 |
| 7-9 | Supabase Pro + domain | $78 |
| 10-12 | Supabase + Vercel Pro | $138 |
| **Annual Total** | | **~$222** |

### Scenario C: Rapid Growth
**2,000+ users by month 12**

| Month | Service | Cost |
|-------|---------|------|
| 1-4 | Free tiers + domain | $4 |
| 5-8 | Supabase Pro + domain | $104 |
| 9-12 | Full stack Pro | $184 |
| Sentry | Developer tier | $104 |
| **Annual Total** | | **~$396** |

---

## Cost Optimization Strategies

### Image Optimization
- Compress on upload (browser-side with sharp/canvas)
- Limit dimensions to 1200px max width
- Use WebP format
- **Potential savings:** 50-70% storage reduction

### Database Optimization
- Paginate all list queries
- Index frequently queried columns (already done)
- Archive old data if needed
- **Potential savings:** Reduce API calls by 30%

### Caching
- Use SWR/React Query for client-side caching
- Implement ISR for public pages
- Cache API responses where appropriate
- **Potential savings:** Reduce API calls by 40%

---

## Monitoring Checklist

### Weekly Check
- [ ] Supabase Dashboard → Usage tab
- [ ] Vercel Dashboard → Usage tab
- [ ] Note current storage/request levels

### Monthly Review
- [ ] Compare usage vs. projections
- [ ] Identify growth trends
- [ ] Plan for upgrades if approaching limits

### Alert Thresholds
| Metric | Alert At |
|--------|----------|
| Supabase DB | 400 MB (80%) |
| Supabase API | 40k requests (80%) |
| Vercel Bandwidth | 80 GB (80%) |
| Storage | 800 MB (80%) |
