# Deployment Runbook

**Last Updated:** 2025-10-31
**Owner:** Tech Lead
**Status:** Production Ready

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Deployment to Staging](#deployment-to-staging)
- [Production Promotion](#production-promotion)
- [Post-Deployment Validation](#post-deployment-validation)
- [Smoke Testing](#smoke-testing)
- [Emergency Procedures](#emergency-procedures)

## Pre-Deployment Checklist

Complete this checklist before every production deployment.

### Code Quality

- [ ] All CI checks passing (GitHub Actions shows green)
- [ ] Code review approved by at least one team member
- [ ] No known critical bugs in the release
- [ ] All merge conflicts resolved
- [ ] Branch up to date with `main`

### Testing

- [ ] Unit tests passing locally (`npm test`)
- [ ] E2E tests passing in CI (Playwright report reviewed)
- [ ] Manual testing completed in preview environment
- [ ] QA sign-off received (if applicable)

### Database

- [ ] Database migrations tested in preview environment
- [ ] Migration rollback plan documented
- [ ] No breaking schema changes without backward compatibility
- [ ] Database backup verified (automatic via Vercel Postgres)

### Configuration

- [ ] Environment variables reviewed and updated in Vercel
- [ ] No secrets in code repository
- [ ] Sentry error tracking configured
- [ ] Health check endpoint tested (`/api/health`)

### Communication

- [ ] Team notified of upcoming deployment
- [ ] Deployment window scheduled (if needed)
- [ ] Stakeholders informed of new features/changes
- [ ] Support team briefed on user-facing changes

### Documentation

- [ ] CHANGELOG updated with user-facing changes
- [ ] API documentation updated (if applicable)
- [ ] Environment variable changes documented
- [ ] Migration notes added (if applicable)

## Deployment to Staging

Staging deployments happen automatically when code is merged to the `main` branch.

### Step 1: Merge Pull Request

```bash
# Ensure you're on the latest main branch
git checkout main
git pull origin main

# Review the PR one final time
# Merge via GitHub UI or CLI
gh pr merge <pr-number> --squash
```

**Expected Result**: GitHub Actions CI runs on `main` branch

### Step 2: Monitor CI Pipeline

1. Navigate to: `https://github.com/OxidBurn/rent_villa/actions`
2. Click on the workflow run for your merge commit
3. Monitor all jobs (format, lint, typecheck, test, build)
4. Wait for all jobs to complete successfully

**Duration**: 2-3 minutes
**Expected Result**: All jobs show green checkmarks

### Step 3: Monitor Vercel Deployment

1. Navigate to: `https://vercel.com/{team}/rent-villa/deployments`
2. Find the deployment for your merge commit
3. Click to view build logs
4. Monitor build progress

**Duration**: 3-5 minutes
**Expected Result**: "Deployment completed" status

#### Vercel Build Steps

```
1. Building                      [~1 min]
2. Running migrations            [~30s]
3. Creating production build     [~2 min]
4. Uploading source maps         [~30s]
5. Deploying to edge network     [~30s]
6. Running health checks         [~10s]
```

### Step 4: Verify Staging Deployment

Once Vercel shows "Ready", verify the staging environment:

```bash
# Check health endpoint
curl https://rent-villa-staging.vercel.app/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-10-31T00:00:00.000Z",
  "version": "1.0.0",
  "deploymentId": "dpl_xxx",
  "environment": "preview",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 45
    }
  }
}
```

### Step 5: Staging Smoke Tests

Run quick smoke tests to verify core functionality:

1. **Homepage loads**: Visit staging URL, verify page renders
2. **API responds**: Test `/api/health` endpoint
3. **Database connected**: Verify health check shows database healthy
4. **Authentication works** (if applicable)
5. **Core user flows functional**

**Duration**: 5-10 minutes

## Production Promotion

Production deployments are **manual** and require explicit promotion from the Vercel dashboard.

### When to Promote to Production

Promote to production when:

- Staging deployment has been validated
- All smoke tests passed
- Business approves the release
- Team is available to monitor the deployment

### Production Deployment Process

#### Option 1: Via Vercel Dashboard (Recommended)

1. Navigate to: `https://vercel.com/{team}/rent-villa/deployments`
2. Find the staging deployment you want to promote
3. Click the three dots menu (⋮) on the deployment
4. Select **"Promote to Production"**
5. Confirm the promotion in the dialog
6. Monitor deployment progress

**Duration**: 2-3 minutes

#### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# List recent deployments
vercel ls

# Promote specific deployment to production
vercel promote <deployment-url> --scope={team}

# Example:
# vercel promote rent-villa-abc123.vercel.app --scope=rent-villa-team
```

**Duration**: 2-3 minutes

### Production Deployment Checklist

Complete this checklist during production promotion:

- [ ] Staging deployment verified and tested
- [ ] Team notified that production deployment is starting
- [ ] Monitoring dashboard open (Vercel + Sentry)
- [ ] Incident response team on standby
- [ ] Rollback procedure reviewed and ready

## Post-Deployment Validation

After promoting to production, immediately validate the deployment.

### Step 1: Health Check Verification

```bash
# Check production health endpoint
curl https://rent-villa.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-10-31T00:00:00.000Z",
  "version": "1.0.0",
  "deploymentId": "dpl_production_xxx",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 45
    }
  }
}
```

**Expected Result**: Status is "healthy", deployment ID matches promotion

### Step 2: Monitor Error Rates

1. Open Sentry dashboard: `https://sentry.io/organizations/{org}/issues/`
2. Filter by production environment
3. Monitor for spike in error rates
4. Check for any new error types

**Expected Result**: Error rate stable, no new critical errors

### Step 3: Monitor Performance

1. Open Vercel Analytics: `https://vercel.com/{team}/rent-villa/analytics`
2. Monitor response times and request volume
3. Check for any performance degradation

**Expected Result**: Performance metrics stable or improved

### Step 4: Database Migration Verification

If the deployment included database migrations:

```bash
# Connect to production database (via Vercel CLI)
vercel env pull .env.production

# Check migration status
npm run db:studio

# Or use Drizzle CLI to verify
npx drizzle-kit studio
```

**Expected Result**: All migrations applied successfully

### Step 5: Feature Validation

Test the specific features deployed:

- [ ] New features work as expected
- [ ] Existing features not broken
- [ ] UI renders correctly
- [ ] API endpoints respond correctly
- [ ] Data flows through system correctly

## Smoke Testing

Perform these quick tests after every production deployment.

### Critical User Flows

1. **Homepage**
   - Visit: `https://rent-villa.com`
   - Verify: Page loads without errors
   - Check: No console errors in browser

2. **API Health**
   - Visit: `https://rent-villa.com/api/health`
   - Verify: Returns 200 status code
   - Check: All health checks passing

3. **Database Connectivity**
   - Check health endpoint shows database healthy
   - Verify response time is reasonable (<100ms)

4. **Error Tracking**
   - Trigger test error (if test endpoint exists)
   - Verify error appears in Sentry
   - Confirm source maps working (stack trace readable)

### Automated Smoke Tests

Run automated smoke tests after deployment:

```bash
# If smoke tests are configured
npm run test:smoke -- --env=production

# Or use Playwright for quick E2E validation
npx playwright test smoke.spec.ts --project=production
```

### Manual Verification Checklist

- [ ] Homepage loads in <2 seconds
- [ ] No JavaScript errors in browser console
- [ ] Health endpoint returns 200 status
- [ ] Database connected and responsive
- [ ] Sentry receiving events
- [ ] Vercel Analytics showing traffic
- [ ] Custom domain resolves correctly
- [ ] SSL certificate valid

## Emergency Procedures

### If Deployment Fails

1. **Stop and Assess**
   - Identify what failed (build, migration, runtime error)
   - Check Vercel build logs and Sentry errors
   - Determine severity (critical vs non-critical)

2. **Rollback Immediately** (if critical)
   - Follow [Rollback Procedures](./rollback-procedures.md)
   - Verify rollback successful
   - Notify team and stakeholders

3. **Fix and Redeploy** (if non-critical)
   - Create hotfix branch
   - Fix the issue
   - Test in preview environment
   - Redeploy to staging, then production

### If Production is Degraded

1. **Check Health Endpoint**

   ```bash
   curl https://rent-villa.com/api/health
   ```

2. **Review Metrics**
   - Sentry: Check error rate spike
   - Vercel: Check response times
   - Database: Check connection status

3. **Rollback if Necessary**
   - If degradation is severe, rollback immediately
   - If minor, assess whether fix or rollback is faster

### Communication Template

Send to team Slack channel:

```
🚀 Production Deployment Starting

Deployment: {deployment-id}
Changes: {brief summary}
Deployer: {your-name}
Time: {timestamp}
Status: In Progress

Will update when complete.
```

After completion:

```
✅ Production Deployment Complete

Deployment: {deployment-id}
Status: Successful
Health Check: Passing
Errors: No new issues detected
Monitoring: Sentry + Vercel Analytics active

Post-deployment validation complete. 🎉
```

If issues occur:

```
⚠️ Production Deployment Issue

Deployment: {deployment-id}
Status: Issue Detected
Problem: {brief description}
Action: {Rolling back / Fixing / Monitoring}

Incident response team engaged.
```

## Deployment Schedule

### Recommended Deployment Windows

**Production Deployments:**

- **Best Time**: Tuesday-Thursday, 10 AM - 2 PM (local time)
- **Avoid**: Fridays (weekend incident risk), Mondays (start of week)
- **Never**: Weekends, holidays, during high-traffic events

**Staging Deployments:**

- Anytime during business hours
- Automatic on merge to `main`

**Emergency Hotfixes:**

- Deploy immediately regardless of day/time
- Follow expedited rollback procedures if needed

### Deployment Freeze Periods

Do not deploy to production during:

- Major holidays
- Known high-traffic periods
- Team unavailable for monitoring
- During active incidents

## Deployment Metrics

Track these metrics for each production deployment:

- **Deployment Duration**: Time from promotion to validated
- **Downtime**: Any service interruption (target: 0 seconds)
- **Error Rate Change**: Sentry error rate before/after
- **Performance Impact**: Response time change
- **Rollback Needed**: Yes/No
- **Issues Found**: Count and severity

**Target KPIs:**

- Zero-downtime deployments: 100%
- Successful deployments: >95%
- Rollback rate: <5%
- Deployment time: <10 minutes

## Related Documentation

- [CI/CD Overview](./ci-cd-overview.md) - Pipeline architecture
- [Rollback Procedures](./rollback-procedures.md) - How to rollback
- [Troubleshooting Guide](./troubleshooting-guide.md) - Common issues
- [Environment Variables](./environment-variables.md) - Variable reference
- [Incident Response](./incident-response.md) - Production incidents
