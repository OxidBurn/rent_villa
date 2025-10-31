# Team Training Guide: Production Deployment

**Last Updated:** 2025-10-31
**Owner:** Tech Lead
**Audience:** All team members involved in deployment

## Overview

This guide provides training materials for team members to understand and execute production deployments confidently. Use this as a reference for onboarding new team members and refreshing knowledge for existing team members.

## Training Objectives

By the end of this training, team members should be able to:

1. ✅ Understand the CI/CD pipeline architecture
2. ✅ Execute a production deployment following the runbook
3. ✅ Validate deployment success using health checks
4. ✅ Identify when to rollback and execute rollback procedure
5. ✅ Respond to common deployment issues
6. ✅ Communicate effectively during deployments

## Training Modules

### Module 1: CI/CD Pipeline Overview (30 minutes)

**Learning Objectives:**

- Understand the complete deployment pipeline
- Know what happens at each stage
- Identify failure points and how to diagnose them

**Topics:**

1. GitHub Actions CI workflow
2. Vercel deployment process
3. Environment types (dev/staging/production)
4. Automated vs manual steps

**Hands-On Exercise:**

```bash
# 1. Trigger a CI run
git commit --allow-empty -m "test: trigger CI"
git push

# 2. Watch the workflow
# Visit: https://github.com/OxidBurn/rent_villa/actions

# 3. Observe each job:
- format (30s)
- lint (30s)
- typecheck (45s)
- test (1-2min)
- build (2-3min)
- e2e (3-5min, PR only)

# 4. Review job logs and understand what each does
```

**Documentation:**

- [CI/CD Overview](./ci-cd-overview.md)

**Knowledge Check:**

- Q: What jobs run in parallel in the CI pipeline?
- Q: When do E2E tests run?
- Q: What happens if the build job fails?

---

### Module 2: Deployment Runbook Walkthrough (45 minutes)

**Learning Objectives:**

- Navigate and use the deployment runbook
- Complete pre-deployment checklist
- Execute step-by-step deployment procedure

**Topics:**

1. Pre-deployment checklist items
2. Staging deployment (automatic)
3. Production promotion (manual)
4. Post-deployment validation

**Hands-On Exercise:**

```bash
# Practice deployment to staging (simulated)

# 1. Create a test PR
git checkout -b test/deployment-training
echo "# Test" >> README.md
git commit -m "test: deployment training"
git push -u origin test/deployment-training

# 2. Create PR in GitHub
gh pr create --title "Test: Deployment Training" --body "Training exercise"

# 3. Watch automatic preview deployment
# Visit Vercel dashboard

# 4. Merge PR and watch staging deployment
gh pr merge --squash

# 5. Practice checking health endpoint
curl https://rent-villa-staging.vercel.app/api/health
```

**Documentation:**

- [Deployment Runbook](./deployment-runbook.md)
- [Production Deployment Guide](./production-deployment-guide.md)

**Knowledge Check:**

- Q: What items are in the pre-deployment checklist?
- Q: How do you promote staging to production?
- Q: What is the first validation step after deployment?

---

### Module 3: Health Checks and Validation (30 minutes)

**Learning Objectives:**

- Understand the health check endpoint
- Interpret health check responses
- Use health checks for validation

**Topics:**

1. Health check endpoint structure
2. Response interpretation
3. Troubleshooting failed health checks

**Hands-On Exercise:**

```bash
# 1. Check staging health
curl https://rent-villa-staging.vercel.app/api/health | jq

# Expected response:
{
  "status": "healthy",
  "timestamp": "2025-10-31T...",
  "version": "1.0.0",
  "deploymentId": "dpl_...",
  "environment": "preview",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 45
    }
  }
}

# 2. Understand each field:
# - status: Overall health ("healthy" | "degraded" | "unhealthy")
# - deploymentId: Matches promoted deployment
# - checks.database.status: Database connectivity
# - checks.database.responseTime: DB response time in ms

# 3. Practice validation
# - Verify status is "healthy"
# - Check deployment ID matches
# - Ensure database response time <100ms
```

**Documentation:**

- [Health Monitoring](../health-monitoring.md)

**Knowledge Check:**

- Q: What HTTP status code indicates healthy?
- Q: What does "degraded" status mean?
- Q: When should you rollback based on health check?

---

### Module 4: Rollback Procedures (45 minutes)

**Learning Objectives:**

- Identify when rollback is necessary
- Execute rollback procedure
- Validate rollback success

**Topics:**

1. Rollback decision matrix
2. Instant rollback via Vercel
3. Database migration rollback
4. Rollback validation

**Hands-On Exercise (Staging Only):**

```bash
# Practice rollback in staging (safe)

# 1. Note current staging deployment
vercel ls | grep "Production"

# 2. Find previous deployment
vercel ls --limit=5

# 3. Promote previous deployment (simulated)
# vercel promote <previous-url> --scope=team

# 4. Verify rollback
curl https://rent-villa-staging.vercel.app/api/health

# 5. Roll forward to current
# vercel promote <current-url> --scope=team

# Note: Don't actually execute in production during training!
```

**Documentation:**

- [Rollback Procedures](./rollback-procedures.md)

**Knowledge Check:**

- Q: When should you rollback immediately?
- Q: How long does Vercel rollback take?
- Q: How do you validate rollback success?

---

### Module 5: Troubleshooting Common Issues (30 minutes)

**Learning Objectives:**

- Diagnose common deployment issues
- Use troubleshooting guide effectively
- Escalate when needed

**Topics:**

1. CI failures (format, lint, test, build)
2. Vercel build failures
3. Environment variable issues
4. Database connection problems

**Hands-On Exercise:**

```bash
# Simulate and fix common issues

# 1. Format error (intentional)
# - Make formatting change without running prettier
# - Push and watch CI fail
# - Fix with: npm run format

# 2. Lint error (intentional)
# - Add unused variable
# - Push and watch CI fail
# - Fix by removing variable

# 3. Environment variable missing
# - Check Vercel dashboard for missing vars
# - Add variable
# - Redeploy

# Practice using the troubleshooting guide to diagnose issues
```

**Documentation:**

- [Troubleshooting Guide](./troubleshooting-guide.md)

**Knowledge Check:**

- Q: Where do you check CI failure details?
- Q: How do you fix format errors?
- Q: What's the first step for Vercel build failures?

---

### Module 6: Monitoring and Incident Response (45 minutes)

**Learning Objectives:**

- Use monitoring dashboards effectively
- Identify incident severity
- Execute incident response procedure

**Topics:**

1. Sentry error tracking
2. Vercel Analytics
3. Incident severity classification
4. Communication during incidents

**Hands-On Exercise:**

```bash
# 1. Explore Sentry dashboard
# - Visit https://sentry.io
# - Review error list
# - Understand error grouping
# - Check source maps

# 2. Explore Vercel Analytics
# - Visit Vercel dashboard → Analytics
# - Review Core Web Vitals
# - Check real-time traffic
# - Monitor function performance

# 3. Practice incident declaration (simulated)
# Post to #incidents channel:
```

```
🚨 SEV-2 INCIDENT (SIMULATED)

Issue: Elevated error rate in production
Impact: 10% of requests failing
Commander: [Your Name]
Time: [Timestamp]

This is a training exercise.
```

**Documentation:**

- [Incident Response](./incident-response.md)
- [Error Monitoring](../error-monitoring.md)

**Knowledge Check:**

- Q: What defines a SEV-1 incident?
- Q: Who do you notify for production incidents?
- Q: Where do you check error rates?

---

## Training Scenarios

### Scenario 1: Routine Deployment

**Context:** You've merged a PR that adds a new feature. The staging deployment is complete and validated.

**Steps:**

1. Complete pre-deployment checklist
2. Notify team in #deployments channel
3. Promote staging to production via Vercel dashboard
4. Monitor deployment progress
5. Validate with health check
6. Run smoke tests
7. Monitor for 30 minutes
8. Post success message

**Expected Duration:** 30 minutes

---

### Scenario 2: Failed Deployment

**Context:** After promoting to production, health check shows database status "unhealthy".

**Steps:**

1. Identify severity (SEV-1: database down)
2. Declare incident in #incidents channel
3. Execute immediate rollback
4. Verify rollback with health check
5. Investigate root cause (check logs)
6. Create hotfix if needed
7. Redeploy after fix validated in staging
8. Document incident

**Expected Duration:** 20-30 minutes (rollback), 1-2 hours (fix)

---

### Scenario 3: Emergency Hotfix

**Context:** A critical bug was discovered in production. Users cannot complete checkout.

**Steps:**

1. Declare SEV-1 incident
2. Create hotfix branch immediately
3. Fix bug, add test
4. Run tests locally
5. Push and create PR (mark as hotfix)
6. Fast-track PR review
7. Merge and deploy to production
8. Validate fix
9. Monitor for regression
10. Document in post-mortem

**Expected Duration:** 1-3 hours depending on complexity

---

## Command Reference

### Essential Commands

```bash
# Health check
curl https://[domain]/api/health

# View recent deployments
vercel ls --limit=10

# View production logs
vercel logs --prod --limit=100

# Promote to production
vercel promote <deployment-url> --prod --scope={team}

# Pull environment variables
vercel env pull .env.production

# Redeploy production
vercel redeploy --prod

# Check CI status
gh pr checks

# Create PR
gh pr create --title "..." --body "..."

# Merge PR
gh pr merge --squash
```

### Monitoring Commands

```bash
# Watch function logs in real-time
vercel logs --prod --follow

# Check deployment status
vercel inspect <deployment-url>

# List environment variables
vercel env ls

# Test health endpoint
while true; do curl -s https://[domain]/api/health | jq '.status'; sleep 5; done
```

## Communication Templates

### Deployment Start

```
🚀 Production Deployment Starting

Time: [HH:MM UTC]
Deployer: [Name]
Changes: [Brief summary]
Expected Duration: 15-20 minutes

Monitoring in #deployments
```

### Deployment Success

```
✅ Production Deployment Complete

Deployment ID: dpl_xxxxx
Duration: XX minutes
Status: Successful

Health Check: ✅ Passing
Monitoring for 30 minutes
```

### Deployment Failed

```
⚠️ Production Deployment Issue

Status: [Investigating / Rolling Back]
Issue: [Brief description]
Action: [Current action]

Updates will follow
```

### Incident Declaration

```
🚨 SEV-[1-4] INCIDENT

Issue: [Description]
Impact: [User impact]
Commander: [Name]
Time: [Timestamp]

War room: [Zoom/Slack link]
Updates in this thread
```

## Certification

To be certified for production deployments, team members must:

- [ ] Complete all 6 training modules
- [ ] Pass knowledge checks (80% correct)
- [ ] Complete all hands-on exercises
- [ ] Successfully execute practice deployment to staging
- [ ] Shadow a production deployment
- [ ] Lead a production deployment with supervision

**Certification Sign-off:**

Trainee: ******\_\_\_****** Date: ******\_\_\_******
Supervisor: ******\_\_\_****** Date: ******\_\_\_******

## Ongoing Training

### Quarterly Refresher

- Review updated documentation
- Practice rollback procedure
- Review recent incidents
- Update runbooks based on learnings

### Continuous Learning

- Attend post-mortems
- Review deployment logs
- Share learnings in team meetings
- Update documentation with new insights

## Resources

### Documentation

- [CI/CD Overview](./ci-cd-overview.md)
- [Deployment Runbook](./deployment-runbook.md)
- [Production Deployment Guide](./production-deployment-guide.md)
- [Production Deployment Checklist](./production-deployment-checklist.md)
- [Rollback Procedures](./rollback-procedures.md)
- [Troubleshooting Guide](./troubleshooting-guide.md)
- [Incident Response](./incident-response.md)
- [Environment Variables](./environment-variables.md)

### External Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Sentry Documentation](https://docs.sentry.io)
- [Drizzle ORM Migrations](https://orm.drizzle.team/docs/migrations)

### Support Channels

- **Slack**: #deployments (deployment updates)
- **Slack**: #incidents (production incidents)
- **Slack**: #engineering (general questions)
- **GitHub**: Issues for bugs/features
- **Documentation**: This docs/ directory

## Feedback

This training guide is a living document. If you:

- Find missing information
- Encounter unclear instructions
- Have suggestions for improvement
- Discover new best practices

Please update this document or create an issue in the repository.

---

**Remember:** Deployments are a team activity. When in doubt, ask for help. No deployment is more important than system stability.
