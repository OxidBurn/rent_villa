---
name: complete-development-pipeline-setup
status: completed
created: 2025-10-30T17:08:51Z
progress: 100%
prd: .claude/prds/complete-development-pipeline-setup.md
github: https://github.com/OxidBurn/rent_villa/issues/1
---

# Epic: Complete Development Pipeline Setup

## Overview

Establish a production-ready CI/CD pipeline for Rent Villa by leveraging GitHub Actions for CI and Vercel for CD. This epic focuses on **maximum leverage of existing platform features** rather than building custom infrastructure, enabling rapid deployment with minimal configuration overhead.

**Core Philosophy:** Use managed services (Vercel, GitHub) to their fullest extent, minimizing custom build scripts and complex configurations. The pipeline should be simple enough for a small team (1-3 developers) to maintain without dedicated DevOps resources.

**Key Outcome:** Developers can commit code and see it deployed to staging within 15 minutes with automated quality checks, zero manual steps, and one-click production promotion.

## Architecture Decisions

### 1. **CI/CD Platform: GitHub Actions + Vercel**

**Decision:** Use GitHub Actions for CI checks, Vercel CLI for CD orchestration
**Rationale:**

- GitHub Actions is free for public repos, integrated with GitHub
- Vercel provides zero-config Next.js deployment with built-in preview environments
- No need for complex container orchestration or custom build servers
- Both platforms handle secrets management natively

**Alternative Considered:** CircleCI, GitLab CI
**Why Not:** Additional cost, complexity, and integration overhead

### 2. **Testing Stack: Vitest + Playwright**

**Decision:** Vitest for unit/integration tests, Playwright for E2E
**Rationale:**

- Vitest is faster than Jest, better Next.js integration, modern API
- Playwright is reliable, supports all browsers, excellent developer experience
- Both have excellent TypeScript support

**Alternative Considered:** Jest + Cypress
**Why Not:** Slower test execution, less modern APIs

### 3. **Database: Vercel Postgres with Drizzle ORM**

**Decision:** Vercel Postgres (PostgreSQL) with Drizzle ORM for migrations
**Rationale:**

- Vercel Postgres integrates seamlessly with Vercel deployments
- Drizzle is lightweight, TypeScript-first, excellent DX
- No need for separate database hosting provider
- Built-in connection pooling and edge caching

**Alternative Considered:** Supabase + Prisma
**Why Not:** Additional provider complexity, Prisma is heavier weight

### 4. **Monitoring: Vercel Analytics + Sentry**

**Decision:** Vercel Analytics for performance, Sentry for error tracking
**Rationale:**

- Vercel Analytics is included with Vercel, zero-config
- Sentry free tier is generous, excellent error tracking
- Both integrate seamlessly with Next.js

**Alternative Considered:** Datadog, New Relic
**Why Not:** Expensive, over-engineered for current scale

### 5. **Secret Management: GitHub Secrets + Vercel Environment Variables**

**Decision:** Native platform secret management
**Rationale:**

- No need for external secret vault (HashiCorp Vault, AWS Secrets Manager)
- Platform-native secrets are secure and simple to use
- Reduces attack surface and operational complexity

### 6. **Deployment Strategy: Vercel's Built-in Blue-Green**

**Decision:** Leverage Vercel's automatic blue-green deployments
**Rationale:**

- Vercel handles zero-downtime deployments automatically
- Instant rollback to previous deployment with one click
- No need to implement custom deployment strategies

## Technical Approach

### Frontend Components

**Not Applicable:** This epic is infrastructure-focused, no UI components needed. Future feature work will use the pipeline established here.

### Backend Services

#### 1. **CI Pipeline (GitHub Actions)**

- Single workflow file: `.github/workflows/ci.yml`
- Jobs: `lint`, `typecheck`, `test`, `build`
- Runs on: Push to any branch, PR to `main`
- Duration target: <5 minutes

#### 2. **CD Pipeline (Vercel)**

- Automatic staging deployment on merge to `main`
- PR preview environments automatically created
- Production promotion via Vercel dashboard or CLI
- Automatic rollback capability

#### 3. **Database Migration System**

- Drizzle migrations in `src/db/migrations/`
- Run migrations automatically on deployment via Vercel build script
- Migration state tracked in database schema version table
- Rollback capability via Drizzle CLI

#### 4. **Health Check Endpoint**

- API route: `/api/health`
- Returns: Database connectivity, app version, deployment ID
- Used by: Vercel health checks, monitoring systems

#### 5. **Error Tracking Integration**

- Sentry SDK integrated in `src/app/layout.tsx` (client)
- Sentry SDK integrated in `next.config.ts` (server)
- Environment-specific DSN configuration
- Source map upload on production builds

### Infrastructure

#### Environment Configuration

```
Development:  Local machine, .env.local
Staging:      Vercel (preview/staging), .env.staging
Production:   Vercel (production), .env.production
```

#### Environment Variables Structure

```
# Database
DATABASE_URL=postgres://...
DATABASE_POOL_MAX=10

# Monitoring
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...

# Vercel (auto-populated)
VERCEL_ENV=production|preview|development
VERCEL_URL=auto-generated
```

#### Secret Management

- **GitHub Secrets:** Used for CI (none needed initially, tests run locally)
- **Vercel Environment Variables:** Database credentials, Sentry DSN, API keys
- **Local Development:** `.env.local` (gitignored)

## Implementation Strategy

### Simplification Decisions

1. **Leverage Vercel's Built-ins:**
   - Preview environments: Free with Vercel (no custom setup)
   - Zero-downtime deployments: Automatic
   - CDN distribution: Automatic
   - Build caching: Automatic

2. **Defer Non-Essential Features:**
   - Visual regression testing → Phase 2 (when UI is stable)
   - Performance budgets → Phase 2 (after baseline established)
   - Advanced monitoring → Phase 2 (after production traffic)

3. **Use Platform Defaults:**
   - Vercel build settings: Use defaults, no custom webpack config
   - GitHub Actions: Use official actions (no custom Docker containers)
   - Database connection: Use Vercel's connection pooling

### Development Phases

**Phase 1: Core Pipeline (Week 1)**
Focus: Get CI/CD working end-to-end

- GitHub Actions CI workflow
- Vercel deployment integration
- Environment variable setup

**Phase 2: Testing Infrastructure (Week 2)**
Focus: Automated test execution

- Vitest configuration and sample tests
- Playwright E2E setup
- Test execution in CI

**Phase 3: Database Pipeline (Week 3)**
Focus: Migration automation

- Drizzle ORM setup
- Migration generation and execution
- Database seeding for development

**Phase 4: Production Readiness (Week 4)**
Focus: Monitoring and reliability

- Sentry error tracking
- Health check endpoints
- Production deployment workflow
- Rollback procedures

### Risk Mitigation

**Risk:** CI pipeline too slow
**Mitigation:** Parallel job execution, caching dependencies, limit test scope

**Risk:** Database migrations fail in production
**Mitigation:** Backup before migration, test on staging first, atomic transactions

**Risk:** Secrets exposed in logs
**Mitigation:** GitHub secret scanning enabled, Vercel masks secrets in logs

**Risk:** Team unfamiliar with tools
**Mitigation:** Document common workflows, create runbooks, pair on first deployment

### Testing Approach

**CI Testing:**

- Unit tests run on every commit
- E2E tests run on PR to `main` only (to save time)
- Build verification on every commit

**Manual Testing:**

- Preview environment used for manual QA
- Production smoke test after deployment

**Test Coverage:**

- Initial target: 50% (establish baseline)
- Long-term target: 70% for critical paths
- Coverage report posted to PRs

## Task Breakdown Preview

High-level task categories that will be created:

- [ ] **Task 1: GitHub Actions CI Workflow** - Create `.github/workflows/ci.yml` with lint, typecheck, test, build jobs
- [ ] **Task 2: Vercel Deployment Setup** - Connect GitHub repo to Vercel, configure environment variables, enable automatic deployments
- [ ] **Task 3: Vitest Test Infrastructure** - Install Vitest, configure for Next.js App Router, create sample unit tests, add to CI
- [ ] **Task 4: Playwright E2E Testing** - Install Playwright, configure browsers, create sample E2E tests, add to CI
- [ ] **Task 5: Database & Migration Setup** - Install Drizzle ORM, setup Vercel Postgres, create migration system, configure build-time migrations
- [ ] **Task 6: Code Quality Tooling** - Configure Prettier, enhance ESLint rules, add import sorting, integrate with CI
- [ ] **Task 7: Sentry Error Tracking** - Create Sentry project, integrate SDK (client + server), configure source maps, test error reporting
- [ ] **Task 8: Health Check & Monitoring** - Create `/api/health` endpoint, add basic metrics, configure Vercel uptime monitoring
- [ ] **Task 9: Documentation & Runbooks** - Document CI/CD workflows, deployment procedures, rollback process, troubleshooting guide
- [ ] **Task 10: Production Deployment & Validation** - Deploy to production, validate all systems, create incident response runbook

**Total Tasks:** 10 (optimized for efficiency)

**Estimated Effort:** 4 weeks (1 week per phase, 2-3 tasks per week)

## Dependencies

### External Dependencies

1. **GitHub Repository** (Status: ✅ Available)
   - Used for: Source code hosting, GitHub Actions CI
2. **Vercel Account** (Status: ⚠️ Needs setup)
   - Used for: Deployment, preview environments, hosting
   - Action: Create team account, connect GitHub repo
3. **Vercel Postgres** (Status: ⚠️ Needs setup)
   - Used for: Database hosting
   - Action: Create database in Vercel dashboard
4. **Sentry Account** (Status: ⚠️ Needs setup)
   - Used for: Error tracking and monitoring
   - Action: Create organization, get DSN keys

### Internal Dependencies

1. **Database Schema Design** (Status: 🔄 In progress)
   - Required for: Migration system setup
   - Blocker: Need basic schema for properties, tenants, leases
   - Workaround: Can start with simple example migration
2. **Code Quality Standards** (Status: ✅ Defined)
   - Defined in: `.claude/context/project-style-guide.md`
   - Used for: ESLint/Prettier configuration
3. **Environment Variables Policy** (Status: 📝 To be defined)
   - Required for: Task 2 (Vercel setup)
   - Owner: Tech Lead
   - Timeline: Before Task 2 starts

### Team Dependencies

1. **Vercel Access:** Team members need Vercel account invites
2. **GitHub Permissions:** Team needs write access to repository
3. **Training:** Brief walkthrough of CI/CD workflow (30 min session)

## Success Criteria (Technical)

### Functional Success

- ✅ Every PR shows pass/fail status within 5 minutes
- ✅ Merging to `main` triggers automatic staging deployment within 10 minutes
- ✅ Production deployment available via one-click promotion
- ✅ Test suite runs in <10 minutes (unit + E2E)
- ✅ Database migrations apply automatically on deployment
- ✅ Errors in production visible in Sentry within 1 minute
- ✅ Rollback completes within 2 minutes (Vercel instant rollback)
- ✅ Zero secrets in repository code
- ✅ PR preview environments auto-generated with unique URLs

### Performance Benchmarks

- **CI Pipeline:** <5 minutes (90th percentile)
- **Staging Deployment:** <10 minutes (end-to-end)
- **Production Deployment:** <8 minutes (optimized builds)
- **Test Execution:** <10 minutes (parallel execution)
- **Rollback Time:** <2 minutes (instant via Vercel)

### Quality Gates

- ✅ TypeScript errors block PR merge
- ✅ ESLint errors block PR merge
- ✅ Test failures block PR merge
- ✅ Build failures block deployment
- ✅ Failed health checks trigger automatic rollback

### Developer Experience

- ✅ Clear error messages in CI logs
- ✅ Documentation covers 80% of common scenarios
- ✅ Local development requires <5 environment variables
- ✅ New developer can deploy to staging within 1 day of onboarding
- ✅ Developer satisfaction: >4.5/5

## Estimated Effort

### Overall Timeline

**Total Duration:** 4 weeks (1 sprint)
**Breakdown:**

- Week 1: Core Pipeline (Tasks 1-2) - 8-12 hours
- Week 2: Testing (Tasks 3-4) - 10-14 hours
- Week 3: Database & Quality (Tasks 5-6) - 8-12 hours
- Week 4: Production Ready (Tasks 7-10) - 10-14 hours

**Total Effort:** 36-52 hours (1 developer full-time for 1 month)

### Resource Requirements

- **Developer Time:** 1 senior developer (or 2 mid-level developers pairing)
- **Tech Lead Review:** 4-6 hours (architecture decisions, PR reviews)
- **External Accounts:** Vercel, Sentry (free tiers)
- **Cost:** $0/month initially (free tiers), scales with usage

### Critical Path Items

1. **Vercel Account Setup** (blocks Task 2, 3, 4, 5, 7, 8)
2. **Database Selection** (blocks Task 5)
3. **CI Workflow** (blocks Task 3, 4, 6)
4. **Testing Infrastructure** (blocks Task 7, 8 validation)

**Critical Path Duration:** 3 weeks (Week 1-3)
**Buffer Week:** Week 4 (documentation, polish, production validation)

### Effort by Task Category

| Task | Description           | Effort | Priority |
| ---- | --------------------- | ------ | -------- |
| 1    | GitHub Actions CI     | 4-6h   | P0       |
| 2    | Vercel Deployment     | 3-4h   | P0       |
| 3    | Vitest Setup          | 4-6h   | P0       |
| 4    | Playwright E2E        | 6-8h   | P1       |
| 5    | Database & Migrations | 6-8h   | P1       |
| 6    | Code Quality Tools    | 3-4h   | P0       |
| 7    | Sentry Integration    | 4-5h   | P1       |
| 8    | Health Checks         | 2-3h   | P1       |
| 9    | Documentation         | 6-8h   | P0       |
| 10   | Production Deploy     | 4-6h   | P0       |

**Total:** 42-58 hours

## Open Questions

1. **Database Provider:** Confirm Vercel Postgres vs alternatives
   - **Impact:** Affects Task 5 implementation
   - **Owner:** Tech Lead
   - **Timeline:** Decide before Week 3

2. **Test Coverage Threshold:** 50%, 70%, or 80%?
   - **Impact:** Affects Task 3/4 scope
   - **Owner:** Team consensus
   - **Timeline:** Decide before Week 2

3. **Production Approval:** Automatic promotion or manual gate?
   - **Impact:** Affects Task 2 workflow configuration
   - **Owner:** Product Manager + Tech Lead
   - **Timeline:** Decide before Week 4

4. **Monitoring Scope:** Sentry only or add Vercel Analytics?
   - **Impact:** Task 7 scope and cost
   - **Owner:** Tech Lead
   - **Timeline:** Decide before Week 4
   - **Recommendation:** Start with Sentry only, Vercel Analytics is automatic

## Notes

### Why This Approach?

This epic is intentionally **conservative and pragmatic**:

1. **Leverage Existing Tools:** Vercel and GitHub do 80% of the work for us. We're not building custom infrastructure.

2. **Start Simple:** 10 focused tasks vs. 30+ micro-tasks. Each task delivers meaningful value.

3. **Defer Optimization:** We can add complexity later (visual regression, performance budgets) once we have production traffic and data.

4. **Focus on Team Velocity:** The goal is to unblock feature development, not create DevOps complexity.

5. **Cost-Conscious:** Free tiers initially, scales with success.

### What We're NOT Doing (And Why)

- ❌ **Custom Docker containers:** Vercel handles builds
- ❌ **Kubernetes:** Over-engineered for current scale
- ❌ **Custom build caching:** Vercel handles this
- ❌ **Complex deployment strategies:** Vercel's blue-green is sufficient
- ❌ **Load testing:** Premature for MVP
- ❌ **Custom monitoring dashboards:** Use Vercel + Sentry defaults
- ❌ **Infrastructure as Code:** Using managed services eliminates need

### Success Looks Like

In 4 weeks:

- Developer commits code → CI checks pass → Merges → Staging deployed → Production promoted
- Total time: <30 minutes from commit to production
- Zero manual steps
- Full confidence in deployment process
- Team can focus on building features, not fighting infrastructure

## Tasks Created

- [x] #11 - Production Deployment & Validation (parallel: false)
- [x] #10 - Documentation & Runbooks (parallel: true)
- [x] #2 - GitHub Actions CI Workflow (parallel: true)
- [x] #3 - Vercel Deployment Setup (parallel: true)
- [x] #4 - Vitest Test Infrastructure (parallel: false)
- [x] #5 - Playwright E2E Testing (parallel: false)
- [x] #6 - Database & Migration Setup (parallel: true)
- [x] #7 - Code Quality Tooling (parallel: false)
- [x] #8 - Sentry Error Tracking (parallel: true)
- [x] #9 - Health Check & Monitoring (parallel: true)

**Total tasks:** 10
**Parallel tasks:** 6
**Sequential tasks:** 4
**Estimated total effort:** 42-58 hours

---

**Epic Status:** Tasks created and ready for implementation
**Next Step:** Run `/pm:epic-sync complete-development-pipeline-setup` to sync tasks to GitHub Issues
