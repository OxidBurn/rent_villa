# CI/CD Pipeline Overview

**Last Updated:** 2025-10-31
**Owner:** Tech Lead
**Status:** Production Ready

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [GitHub Actions CI](#github-actions-ci)
- [Vercel Deployment Flow](#vercel-deployment-flow)
- [Environments](#environments)
- [Pipeline Triggers](#pipeline-triggers)
- [Build and Deploy Process](#build-and-deploy-process)

## Architecture Overview

Rent Villa uses a modern CI/CD pipeline that combines GitHub Actions for continuous integration and Vercel for continuous deployment. This approach provides:

- **Zero-Config Deployments**: Vercel automatically builds and deploys Next.js applications
- **Preview Environments**: Every pull request gets a unique preview URL
- **Instant Rollbacks**: One-click rollback to any previous deployment
- **Automated Quality Gates**: Code must pass all CI checks before merging

### Architecture Diagram

```
┌─────────────────┐
│  Developer      │
│  Local Machine  │
└────────┬────────┘
         │
         │ git push
         ▼
┌─────────────────────────────────────────┐
│           GitHub Repository             │
│  ┌───────────────────────────────────┐ │
│  │      GitHub Actions CI            │ │
│  │  • Format Check (Prettier)        │ │
│  │  • Lint (ESLint)                  │ │
│  │  • Type Check (TypeScript)        │ │
│  │  • Unit Tests (Vitest)            │ │
│  │  • Build (Next.js)                │ │
│  │  • E2E Tests (Playwright) [PR]    │ │
│  └───────────────────────────────────┘ │
└─────────┬───────────────────────────────┘
          │
          │ webhook
          ▼
┌─────────────────────────────────────────┐
│              Vercel                     │
│  ┌───────────────────────────────────┐ │
│  │      Build & Deploy               │ │
│  │  • Install dependencies           │ │
│  │  • Run database migrations        │ │
│  │  • Build Next.js app              │ │
│  │  • Upload source maps to Sentry   │ │
│  │  • Deploy to CDN                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │       Environments                │ │
│  │  • Preview (per PR)               │ │
│  │  • Staging (main branch)          │ │
│  │  • Production (promoted)          │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

## GitHub Actions CI

The CI pipeline runs on every push and pull request to the `main` branch. It consists of 6 parallel jobs that validate code quality and functionality.

### CI Jobs

| Job       | Purpose                       | Duration | Runs On    |
| --------- | ----------------------------- | -------- | ---------- |
| format    | Prettier formatting check     | ~30s     | All events |
| lint      | ESLint code quality check     | ~30s     | All events |
| typecheck | TypeScript type validation    | ~45s     | All events |
| test      | Vitest unit/integration tests | ~1-2min  | All events |
| build     | Next.js production build      | ~2-3min  | All events |
| e2e       | Playwright end-to-end tests   | ~3-5min  | PR only    |

### Workflow File Location

`.github/workflows/ci.yml`

### Job Dependencies

```
format ─┐
lint   ─┤
typecheck─┤
test   ─┤─────> e2e (only on PR)
build  ─┘
```

The E2E tests only run on pull requests and depend on all other jobs passing first. This saves CI minutes on direct pushes to main.

### Success Criteria

All jobs must pass (green checkmark) before a pull request can be merged. If any job fails, the entire CI run is marked as failed.

## Vercel Deployment Flow

Vercel automatically deploys your application when commits are pushed to GitHub. The deployment process is fully automated and requires no manual intervention.

### Deployment Types

#### 1. Preview Deployments (Pull Requests)

- **Trigger**: New commit pushed to a PR branch
- **URL Format**: `https://rent-villa-git-{branch-name}-{team}.vercel.app`
- **Purpose**: Test changes in isolation before merging
- **Database**: Uses staging database (shared across preview environments)
- **Lifetime**: Automatically deleted after PR is merged/closed

#### 2. Staging Deployment (Main Branch)

- **Trigger**: Commit merged to `main` branch
- **URL**: `https://rent-villa-staging.vercel.app` (or similar)
- **Purpose**: Final validation before production
- **Database**: Staging database
- **Lifetime**: Permanent, always reflects latest `main` branch

#### 3. Production Deployment

- **Trigger**: Manual promotion from Vercel dashboard or CLI
- **URL**: `https://rent-villa.com` (custom domain)
- **Purpose**: Live application serving real users
- **Database**: Production database
- **Lifetime**: Permanent until next promotion

### Build Process

```
1. Install dependencies (npm ci)
   ↓
2. Run database migrations (Drizzle)
   ↓
3. Build Next.js app (npm run build)
   ↓
4. Upload source maps to Sentry
   ↓
5. Deploy to Vercel Edge Network
   ↓
6. Verify health check endpoint
```

### Build Configuration

Vercel reads configuration from `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

## Environments

Rent Villa has three environments, each with isolated configuration and databases.

### Development

- **Location**: Developer's local machine
- **Database**: Local PostgreSQL or Vercel Postgres (dev)
- **URL**: `http://localhost:3000`
- **Environment Variables**: `.env.local` (gitignored)
- **Purpose**: Feature development and debugging

### Staging

- **Location**: Vercel (preview/staging)
- **Database**: Vercel Postgres (staging)
- **URL**: `https://rent-villa-staging.vercel.app`
- **Environment Variables**: Vercel dashboard → Environment Variables (Preview/Staging)
- **Purpose**: Final validation before production

### Production

- **Location**: Vercel (production)
- **Database**: Vercel Postgres (production)
- **URL**: `https://rent-villa.com`
- **Environment Variables**: Vercel dashboard → Environment Variables (Production)
- **Purpose**: Live application serving real users

### Environment Variable Scopes

Vercel allows setting environment variables for specific environments:

- **Development**: Used locally (pulled via `vercel env pull`)
- **Preview**: Used for PR preview deployments
- **Production**: Used only for production deployments

## Pipeline Triggers

### Automatic Triggers

| Event                  | Trigger          | CI Runs | Vercel Deploys | Environment |
| ---------------------- | ---------------- | ------- | -------------- | ----------- |
| Push to feature branch | `git push`       | ✅ Yes  | ❌ No          | N/A         |
| Create/update PR       | GitHub PR action | ✅ Yes  | ✅ Yes         | Preview     |
| Merge PR to main       | GitHub merge     | ✅ Yes  | ✅ Yes         | Staging     |
| Direct push to main    | `git push main`  | ✅ Yes  | ✅ Yes         | Staging     |

### Manual Triggers

| Action                | How to Trigger                                   | Result     |
| --------------------- | ------------------------------------------------ | ---------- |
| Promote to production | Vercel dashboard → Promote to Production         | Production |
| Rollback              | Vercel dashboard → Previous deployment → Promote | Production |
| Re-run CI             | GitHub Actions → Re-run all jobs                 | N/A        |
| Redeploy              | Vercel dashboard → Redeploy                      | Same env   |

## Build and Deploy Process

### Step-by-Step Flow

#### 1. Developer Pushes Code

```bash
git push origin feature/new-feature
```

#### 2. GitHub Actions CI Runs

- Checkout code from repository
- Install Node.js 20 and npm dependencies
- Run format check, lint, typecheck, tests, build in parallel
- Report status to GitHub (green checkmark or red X)

**Duration**: 2-3 minutes (parallel execution)

#### 3. Vercel Receives Webhook (If PR)

- Vercel detects new commit on PR branch
- Clones repository
- Creates unique preview deployment

**Duration**: 3-5 minutes

#### 4. Vercel Builds Application

- Runs `npm ci` to install dependencies
- Executes `npm run db:migrate` to apply migrations
- Runs `npm run build` to create production build
- Uploads source maps to Sentry for error tracking
- Deploys static assets to CDN
- Deploys serverless functions to edge

**Duration**: 3-4 minutes

#### 5. Deployment Complete

- Vercel posts deployment URL as PR comment
- Health check endpoint is automatically tested
- Deployment is marked as "Ready"

#### 6. Developer Tests Preview

- Click preview URL in PR comment
- Manually test changes
- Verify functionality works as expected

#### 7. Merge to Main (After CI Passes)

- PR is merged to `main` branch
- GitHub Actions CI runs again on `main`
- Vercel automatically deploys to staging environment

**Duration**: 5-7 minutes total

#### 8. Production Promotion (Manual)

- Navigate to Vercel dashboard
- Click "Promote to Production" on staging deployment
- Confirm promotion

**Duration**: 2-3 minutes (instant rollout via CDN)

### Monitoring Build Progress

**GitHub Actions:**

- Visit: `https://github.com/OxidBurn/rent_villa/actions`
- Click on workflow run to see job details
- View logs for each job

**Vercel:**

- Visit: `https://vercel.com/{team}/rent-villa/deployments`
- Click on deployment to see build logs
- Monitor real-time build progress

## CI/CD Best Practices

### 1. Keep Main Branch Stable

- Never push directly to `main` (use PRs)
- Ensure all CI checks pass before merging
- Require at least one code review

### 2. Use Preview Deployments

- Test every PR in its preview environment
- Share preview URLs with QA/stakeholders
- Verify database migrations work in preview

### 3. Monitor CI Performance

- CI jobs should complete in <5 minutes
- Slow tests should be optimized or moved to E2E
- Use caching to speed up dependency installation

### 4. Keep Staging in Sync

- Staging should always reflect `main` branch
- Test production promotions in staging first
- Verify monitoring and error tracking work

### 5. Plan Production Deployments

- Deploy during low-traffic hours when possible
- Have rollback plan ready
- Monitor error rates after deployment

## Troubleshooting CI/CD Issues

See [Troubleshooting Guide](./troubleshooting-guide.md) for detailed solutions to common problems.

### Quick Diagnostics

**CI Failing?**

- Check which job failed in GitHub Actions
- Read error logs for specific failure reason
- Common issues: formatting, linting, type errors, test failures

**Vercel Build Failing?**

- Check Vercel deployment logs
- Common issues: missing environment variables, migration failures, build errors

**Deployment Slow?**

- Check Vercel build logs for bottlenecks
- Verify CI jobs are running in parallel
- Check if dependencies are being cached

## Related Documentation

- [Deployment Runbook](./deployment-runbook.md) - Step-by-step deployment procedures
- [Rollback Procedures](./rollback-procedures.md) - How to rollback deployments
- [Troubleshooting Guide](./troubleshooting-guide.md) - Common issues and solutions
- [Environment Variables](./environment-variables.md) - Complete variable reference
- [Incident Response](./incident-response.md) - Production incident procedures
