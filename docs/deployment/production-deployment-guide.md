# Production Deployment Guide

**Last Updated:** 2025-10-31
**Owner:** Tech Lead
**Status:** Ready for First Production Deployment

## Overview

This guide provides specific instructions for deploying Rent Villa to production for the first time and for subsequent production deployments. Use this in conjunction with the [Deployment Runbook](./deployment-runbook.md) and [Production Deployment Checklist](./production-deployment-checklist.md).

## First Production Deployment

### Prerequisites

Before deploying to production for the first time, ensure:

1. **All Epic Tasks Complete** (#2-#11)
   - ✅ CI/CD pipeline operational
   - ✅ All tests passing
   - ✅ Documentation complete
   - ✅ Staging environment validated

2. **Vercel Configuration**
   - Production project exists in Vercel
   - Team has appropriate access levels
   - Billing configured (if applicable)

3. **External Services**
   - Sentry production project created
   - Production database provisioned
   - Domain/DNS configured (if using custom domain)

### Step-by-Step First Deployment

#### Phase 1: Environment Setup (30-45 minutes)

**1.1 Create Production Database**

```bash
# Via Vercel Dashboard
1. Go to Vercel Dashboard → Storage → Create Database
2. Select "Postgres"
3. Name: "rent-villa-production"
4. Region: Choose same region as Vercel functions (e.g., us-east-1)
5. Click "Create"
6. Copy connection strings:
   - POSTGRES_URL (pooled)
   - POSTGRES_URL_NON_POOLING (non-pooled for migrations)
```

**1.2 Configure Environment Variables**

Navigate to: `Vercel Dashboard → rent-villa → Settings → Environment Variables`

Add the following variables for **Production** scope only:

| Variable                 | Value                        | Source                     |
| ------------------------ | ---------------------------- | -------------------------- |
| `DATABASE_URL`           | `[Postgres URL]`             | From Step 1.1 (pooled)     |
| `DATABASE_URL_MIGRATION` | `[Postgres URL Non-pooling]` | From Step 1.1 (non-pooled) |
| `SENTRY_DSN`             | `https://...@sentry.io/...`  | Sentry project settings    |
| `NEXT_PUBLIC_SENTRY_DSN` | `https://...@sentry.io/...`  | Same as SENTRY_DSN         |
| `SENTRY_AUTH_TOKEN`      | `sntrys_...`                 | Sentry → Auth Tokens       |
| `SENTRY_ORG`             | `your-org-slug`              | Sentry organization        |
| `SENTRY_PROJECT`         | `rent-villa-web`             | Sentry project name        |
| `NODE_ENV`               | `production`                 | Static value               |

**1.3 Configure Custom Domain (Optional)**

```bash
# Via Vercel Dashboard
1. Go to Settings → Domains
2. Add custom domain: rent-villa.com
3. Configure DNS (follow Vercel instructions)
4. Wait for SSL certificate provisioning (2-5 minutes)
5. Verify HTTPS works
```

**1.4 Sentry Production Setup**

```bash
# 1. Create production project in Sentry
1. Go to Sentry.io → Projects → Create Project
2. Platform: Next.js
3. Name: rent-villa-web
4. Team: [Your team]
5. Alert: Enable default alerts

# 2. Get DSN
1. Go to Settings → Client Keys (DSN)
2. Copy DSN URL
3. Add to Vercel environment variables

# 3. Create Auth Token
1. Go to Settings → Auth Tokens
2. Create new token with scopes:
   - project:releases
   - project:write
3. Copy token (shown only once!)
4. Add to Vercel environment variables as SENTRY_AUTH_TOKEN
```

#### Phase 2: Pre-Deployment Validation (15-30 minutes)

**2.1 Staging Environment Check**

```bash
# Verify staging is stable
curl https://rent-villa-staging.vercel.app/api/health

# Expected: {"status": "healthy", ...}
```

**2.2 CI Pipeline Verification**

```bash
# Check latest CI run on main branch
# Visit: https://github.com/OxidBurn/rent_villa/actions

# Ensure all jobs passing:
# - format ✅
# - lint ✅
# - typecheck ✅
# - test ✅
# - build ✅
```

**2.3 Database Migration Dry Run**

```bash
# Connect to production database (read-only test)
# Pull production env vars
vercel env pull .env.production

# Check migration status (don't apply yet)
npx drizzle-kit studio
# Verify schema is ready for deployment
```

**2.4 Team Communication**

Post in team Slack channel:

```
🚀 **PRODUCTION DEPLOYMENT SCHEDULED**

Date: [Date]
Time: [Time] UTC
Expected Duration: 30-45 minutes
Deployer: [Your Name]
Monitor: [Name]

Pre-deployment checklist: ✅ Complete
Environment: ✅ Configured
Team: ✅ Ready

Deployment will begin at [Time]. Updates in #deployments.
```

#### Phase 3: Execute Production Deployment (10-15 minutes)

**3.1 Identify Staging Deployment to Promote**

```bash
# Via Vercel CLI
vercel ls

# Or via Vercel Dashboard
# Go to Deployments tab
# Find latest "Ready" deployment on main branch
# Note deployment URL
```

**3.2 Promote to Production**

**Method A: Vercel Dashboard (Recommended)**

```
1. Go to Vercel Dashboard → Deployments
2. Find the staging deployment to promote
3. Click three dots (⋮) → "Promote to Production"
4. Confirm promotion
5. Note deployment ID
```

**Method B: Vercel CLI**

```bash
# Promote specific deployment
vercel promote <deployment-url> --prod --scope={team}

# Example:
vercel promote rent-villa-abc123.vercel.app --prod --scope=rent-villa-team
```

**3.3 Monitor Deployment**

```bash
# Watch deployment progress
# Vercel Dashboard → Deployments → [Your deployment]

# Monitor build logs:
1. Installing dependencies ✅
2. Running migrations ✅
3. Building Next.js app ✅
4. Uploading source maps ✅
5. Deploying functions ✅
6. Deployment complete ✅

# Expected duration: 5-10 minutes
```

#### Phase 4: Production Validation (15-20 minutes)

**4.1 Health Check**

```bash
# Check production health endpoint
curl https://[production-domain]/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-10-31T...",
  "version": "1.0.0",
  "deploymentId": "dpl_...",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 45
    }
  }
}

# Verify:
# - status: "healthy" ✅
# - deploymentId: matches promoted deployment ✅
# - environment: "production" ✅
# - database.status: "healthy" ✅
```

**4.2 Application Verification**

```bash
# Test homepage
curl -I https://[production-domain]

# Expected:
# HTTP/2 200
# x-frame-options: DENY
# x-content-type-options: nosniff
# x-xss-protection: 1; mode=block

# Manual checks:
1. Visit homepage in browser
2. Verify page loads without errors
3. Check browser console (no errors)
4. Verify images/assets load
5. Test navigation
```

**4.3 Database Verification**

```bash
# Verify migrations applied
# Connect to database
npm run db:studio

# Check:
# - All tables exist ✅
# - Migration history table populated ✅
# - No errors in migration logs ✅
```

**4.4 Sentry Verification**

```bash
# Trigger test error (if test page exists)
# Visit: https://[production-domain]/test-sentry
# Click "Test Client Error" button

# Check Sentry dashboard:
1. Go to Sentry.io → Issues
2. Filter environment: production
3. Verify error appears within 1 minute ✅
4. Check stack trace is readable (source maps working) ✅
5. Resolve the test error in Sentry
```

**4.5 Performance Check**

```bash
# Use curl to measure response time
curl -w "@curl-format.txt" -o /dev/null -s https://[production-domain]

# Or use online tools:
# - Vercel Analytics dashboard
# - Google PageSpeed Insights
# - WebPageTest

# Target metrics:
# - Time to First Byte (TTFB): <600ms ✅
# - First Contentful Paint (FCP): <1.8s ✅
# - Largest Contentful Paint (LCP): <2.5s ✅
# - Total Blocking Time (TBT): <200ms ✅
```

#### Phase 5: Post-Deployment (Ongoing)

**5.1 Immediate Monitoring (First 30 minutes)**

```bash
# Monitor every 5 minutes:

# 1. Health check
curl https://[production-domain]/api/health

# 2. Sentry dashboard
# Check for error rate spikes

# 3. Vercel Analytics
# Monitor real-time traffic

# 4. Function logs
vercel logs --prod --follow
```

**5.2 Extended Monitoring (First 24 hours)**

- Monitor Sentry error rate (target: <1%)
- Watch Vercel Analytics Core Web Vitals
- Check uptime (target: 100%)
- Monitor database performance
- Review user feedback (if any)

**5.3 Success Communication**

Post to team Slack:

```
✅ **PRODUCTION DEPLOYMENT COMPLETE**

Deployment ID: dpl_xxxxx
Time: [Timestamp]
Duration: XX minutes
Status: Successful

✅ Health Check: Passing
✅ Error Rate: <1%
✅ Performance: Nominal
✅ Database: Connected

Production URL: https://[domain]

Monitoring for next 24 hours. 🎉
```

### Rollback Procedure

If issues are detected, follow [Rollback Procedures](./rollback-procedures.md).

**Quick Rollback:**

```bash
# Via Vercel Dashboard
1. Go to Deployments
2. Find previous stable deployment
3. Click ⋮ → "Promote to Production"
4. Confirm

# Via CLI
vercel promote <previous-deployment-url> --prod

# Expected: <2 minutes for complete rollback
```

## Subsequent Production Deployments

For deployments after the initial launch:

### Standard Deployment Process

1. **Merge to Main**
   - PR approved and merged
   - CI passes on main
   - Automatic staging deployment

2. **Validate Staging**
   - Test in staging environment
   - Run smoke tests
   - Verify no regressions

3. **Promote to Production**
   - Use Vercel dashboard or CLI
   - Promote staging deployment
   - Monitor deployment

4. **Validate Production**
   - Run health checks
   - Execute smoke tests
   - Monitor for 30 minutes

5. **Document Deployment**
   - Update deployment log
   - Note any issues
   - Record metrics

### Deployment Frequency

**Recommended:**

- Small changes: Daily or as needed
- Features: 2-3 times per week
- Hotfixes: Immediately when critical

**Avoid:**

- Fridays (weekend incident risk)
- Holidays
- End-of-month periods
- During high-traffic events

## Production Maintenance

### Database Migrations in Production

**Safe Migration Practices:**

1. **Backward-Compatible Changes**

   ```sql
   -- ✅ Safe: Add nullable column
   ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;

   -- ✅ Safe: Add new table
   CREATE TABLE user_settings (...);

   -- ❌ Unsafe: Rename column (breaks old code)
   ALTER TABLE users RENAME COLUMN name TO full_name;

   -- ❌ Unsafe: Drop column (breaks old code)
   ALTER TABLE users DROP COLUMN legacy_field;
   ```

2. **Migration Testing**
   - Always test migrations in staging first
   - Verify rollback procedure
   - Check data integrity
   - Monitor migration duration

3. **Large Migrations**
   - Run during low-traffic hours
   - Consider background jobs
   - Monitor database performance
   - Have rollback ready

### Environment Variable Updates

**Updating Production Variables:**

```bash
# 1. Add/Update in Vercel Dashboard
Vercel → Settings → Environment Variables

# 2. Redeploy to apply changes
vercel redeploy --prod

# OR trigger new deployment
git commit --allow-empty -m "chore: apply env var updates"
git push
```

### Scaling Considerations

**When to Scale:**

- Response times >500ms (P95)
- Database connection pool exhausted
- Function timeouts increasing
- Traffic growth >50%

**Scaling Options:**

1. **Vercel Functions**
   - Automatic scaling (serverless)
   - Monitor concurrent executions
   - Increase memory if needed

2. **Database**
   - Upgrade database tier
   - Add read replicas
   - Implement connection pooling

3. **CDN/Caching**
   - Leverage Vercel Edge Network
   - Implement API response caching
   - Use ISR for static content

## Troubleshooting Production Issues

See [Troubleshooting Guide](./troubleshooting-guide.md) for common issues.

**Quick Diagnostics:**

```bash
# Check health
curl https://[domain]/api/health

# View logs
vercel logs --prod --limit=100

# Check error rate
# Visit Sentry dashboard

# View analytics
# Visit Vercel Analytics dashboard
```

## Production Monitoring Setup

### Vercel Monitoring

**Enable:**

- Vercel Analytics (Real User Monitoring)
- Function logs
- Deployment notifications
- Uptime monitoring

**Alerts:**

- Function errors
- Build failures
- Performance degradation

### Sentry Monitoring

**Configure:**

- Error rate alerts (>5% threshold)
- Performance monitoring
- Release tracking
- User feedback

**Alerts:**

- New error types
- Error rate spikes
- Performance regressions

### Database Monitoring

**Monitor:**

- Connection pool utilization
- Query performance
- Database size
- Backup status

## Security Checklist

**Production Security:**

- [ ] All secrets in environment variables (not in code)
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] CORS policy reviewed
- [ ] Database credentials rotated
- [ ] Sentry rate limiting enabled
- [ ] API rate limiting implemented (if applicable)
- [ ] DDoS protection enabled (Vercel Pro)

## Compliance and Auditing

**Maintain:**

- Deployment log (this document)
- Incident reports
- Change records
- Access audit logs

**Review Quarterly:**

- Environment variable security
- Team access levels
- Third-party integrations
- Monitoring configuration

## Success Metrics

**Track:**

- Deployment frequency
- Deployment duration
- Rollback rate (target: <5%)
- Mean Time to Recovery (MTTR)
- Error rate
- Uptime (target: >99.9%)
- Core Web Vitals

## Related Documentation

- [Production Deployment Checklist](./production-deployment-checklist.md)
- [Deployment Runbook](./deployment-runbook.md)
- [Rollback Procedures](./rollback-procedures.md)
- [Troubleshooting Guide](./troubleshooting-guide.md)
- [Incident Response](./incident-response.md)
- [Environment Variables](./environment-variables.md)

---

**Remember:** Production deployment is a team activity. Never deploy alone. Always have someone monitoring, and always have a rollback plan ready.
