# Rollback Procedures

**Last Updated:** 2025-10-31
**Owner:** Tech Lead
**Status:** Production Ready

## Table of Contents

- [When to Rollback](#when-to-rollback)
- [Rollback Decision Matrix](#rollback-decision-matrix)
- [Application Rollback (Vercel)](#application-rollback-vercel)
- [Database Migration Rollback](#database-migration-rollback)
- [Rollback Validation](#rollback-validation)
- [Post-Rollback Actions](#post-rollback-actions)
- [Rollback Best Practices](#rollback-best-practices)

## When to Rollback

Rollback to a previous deployment when:

### Critical Issues (Immediate Rollback)

- **Application crashes** on startup or under load
- **Data corruption** or data loss detected
- **Security vulnerability** introduced
- **Complete feature failure** affecting all users
- **Database connection failures** preventing app function
- **Error rate spike** >10x baseline within 5 minutes of deployment

### Significant Issues (Evaluate Rollback)

- **Performance degradation** >50% slower response times
- **Partial feature failure** affecting subset of users
- **Elevated error rates** 2-5x baseline
- **UI rendering issues** on major pages
- **API failures** on important endpoints

### Minor Issues (Fix Forward)

- **Cosmetic UI bugs** not affecting functionality
- **Low-impact features** not working as expected
- **Isolated errors** affecting <1% of requests
- **Non-critical performance** degradation <20%

## Rollback Decision Matrix

| Severity | Error Rate | Impact       | Rollback? | Timeline           |
| -------- | ---------- | ------------ | --------- | ------------------ |
| Critical | >10x       | All users    | YES       | Immediate (<5 min) |
| High     | 5-10x      | >50% users   | YES       | <15 min            |
| Medium   | 2-5x       | 20-50% users | EVALUATE  | <30 min            |
| Low      | <2x        | <20% users   | NO        | Fix forward        |

### Decision Criteria

**Rollback if:**

- Issue affects revenue-generating features
- Data integrity at risk
- Security vulnerability present
- Error rate continues to climb
- No quick fix available (<30 minutes)

**Fix Forward if:**

- Issue is isolated and understood
- Quick fix available and tested
- Rollback would cause more disruption
- Monitoring shows error rate stabilizing

## Application Rollback (Vercel)

Vercel provides instant rollback to any previous deployment with zero downtime.

### Method 1: Vercel Dashboard (Recommended)

#### Step 1: Access Deployments

1. Navigate to: `https://vercel.com/{team}/rent-villa`
2. Click **"Deployments"** tab
3. View list of recent production deployments

#### Step 2: Identify Previous Stable Deployment

Look for the last known stable deployment:

- Check deployment timestamp (before the issue started)
- Verify "Ready" status
- Review deployment commit message
- Confirm it was marked as "Production"

#### Step 3: Promote Previous Deployment

1. Find the stable deployment in the list
2. Click the three dots menu (⋮) on that deployment
3. Select **"Promote to Production"**
4. Confirm the promotion

**Duration**: Instant (<30 seconds)

#### Step 4: Verify Rollback

```bash
# Check production health
curl https://rent-villa.com/api/health

# Verify deployment ID matches rolled-back deployment
# Expected: deploymentId in response matches target deployment
```

### Method 2: Vercel CLI

```bash
# List recent production deployments
vercel ls --prod --scope={team}

# Promote specific previous deployment
vercel promote <previous-deployment-url> --scope={team}

# Example:
vercel promote rent-villa-xyz789.vercel.app --scope=rent-villa-team
```

**Duration**: 30-60 seconds

### Method 3: Git Revert (Not Recommended)

Only use this method if Vercel dashboard/CLI unavailable:

```bash
# Create revert commit
git revert <commit-hash>

# Push to main
git push origin main

# Wait for CI and Vercel deployment
```

**Duration**: 5-10 minutes (includes CI pipeline)
**Downside**: Creates revert commit in history, slower than instant rollback

## Database Migration Rollback

Database rollbacks are more complex than application rollbacks and require careful planning.

### Pre-Rollback Assessment

**Before rolling back database migrations, consider:**

1. **Data Loss**: Will rollback lose data created after migration?
2. **Schema Compatibility**: Is old app code compatible with new schema?
3. **Concurrent Changes**: Were other changes made after migration?
4. **Backup Availability**: Is there a recent backup before migration?

### Migration Rollback Strategies

#### Strategy 1: Backward-Compatible Migrations (Preferred)

Design migrations to be backward-compatible so rollback isn't needed:

**Good: Backward-Compatible**

```sql
-- ✅ Add nullable column (old code still works)
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT false;

-- ✅ Add new table (old code ignores it)
CREATE TABLE user_preferences (...);
```

**Bad: Breaking Changes**

```sql
-- ❌ Rename column (old code breaks)
ALTER TABLE users RENAME COLUMN name TO full_name;

-- ❌ Drop column (old code breaks)
ALTER TABLE users DROP COLUMN legacy_field;
```

#### Strategy 2: Drizzle Migration Rollback

Drizzle tracks applied migrations in `__drizzle_migrations` table.

**Step 1: Connect to Database**

```bash
# Pull production environment variables
vercel env pull .env.production

# Open Drizzle Studio
npm run db:studio
```

**Step 2: Identify Migration to Rollback**

```sql
-- View migration history
SELECT * FROM __drizzle_migrations ORDER BY created_at DESC;

-- Find the migration to rollback
-- Note the migration file name
```

**Step 3: Manual Rollback**

```bash
# Create rollback migration manually
npx drizzle-kit generate:pg

# Edit generated migration to undo changes
# For example, if migration added a column:
# Original: ALTER TABLE users ADD COLUMN email VARCHAR(255);
# Rollback: ALTER TABLE users DROP COLUMN email;
```

**Step 4: Apply Rollback Migration**

```bash
# Apply rollback migration
npm run db:migrate

# Verify in database
npm run db:studio
```

#### Strategy 3: Database Point-in-Time Recovery

For catastrophic failures, use Vercel Postgres backup:

1. Navigate to Vercel dashboard → Storage → Postgres
2. Select database instance
3. Click **"Restore from backup"**
4. Choose backup timestamp (before migration)
5. Confirm restoration

**Duration**: 10-30 minutes (depending on database size)
**Downside**: Loses all data changes after backup point

### Migration Rollback Checklist

- [ ] Identify exact migration causing issue
- [ ] Determine if rollback is safe (data loss assessment)
- [ ] Create rollback migration script
- [ ] Test rollback in staging environment
- [ ] Notify team of impending database rollback
- [ ] Create database backup before rollback
- [ ] Execute rollback migration
- [ ] Verify application works with rolled-back schema
- [ ] Document rollback in incident report

## Rollback Validation

After any rollback, verify the system is functioning correctly.

### Step 1: Health Check Verification

```bash
# Check health endpoint
curl https://rent-villa.com/api/health

# Expected: status = "healthy", deploymentId = previous stable deployment
```

### Step 2: Error Rate Monitoring

1. Open Sentry: `https://sentry.io/organizations/{org}/issues/`
2. Check error rate has returned to baseline
3. Verify no new errors introduced by rollback

**Expected**: Error rate at or below pre-deployment baseline

### Step 3: Performance Verification

1. Open Vercel Analytics: `https://vercel.com/{team}/rent-villa/analytics`
2. Check response times have normalized
3. Verify request success rate is stable

**Expected**: Performance metrics at baseline levels

### Step 4: Feature Validation

Test critical user flows:

- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] Core features functional
- [ ] Database queries successful
- [ ] API endpoints responding

### Step 5: Database Integrity Check

If database was rolled back:

```bash
# Connect to database
npm run db:studio

# Verify schema matches expected state
# Check critical tables exist
# Verify data integrity
```

### Rollback Success Criteria

Rollback is successful when:

- ✅ Health check returns "healthy"
- ✅ Error rate at baseline (<1 error/min)
- ✅ Response times normalized
- ✅ All critical features working
- ✅ No new errors in Sentry
- ✅ Database schema consistent
- ✅ User traffic stable

## Post-Rollback Actions

### Immediate Actions (Within 1 Hour)

1. **Notify Stakeholders**
   - Send notification to team Slack channel
   - Update status page (if applicable)
   - Inform customer support team

2. **Document Incident**
   - Create incident report in Linear
   - Document what went wrong
   - Note the rollback timestamp and deployment ID

3. **Monitor System**
   - Watch Sentry for 30-60 minutes
   - Monitor Vercel Analytics
   - Check database performance

### Follow-Up Actions (Within 24 Hours)

1. **Root Cause Analysis**
   - Identify what caused the issue
   - Determine why it wasn't caught in testing
   - Document lessons learned

2. **Create Fix**
   - Create hotfix branch
   - Fix the issue that caused rollback
   - Add tests to prevent regression

3. **Improve Process**
   - Update testing procedures
   - Add monitoring for similar issues
   - Enhance deployment checklist

4. **Schedule Post-Mortem**
   - Gather team for post-mortem meeting
   - Use [Incident Response](./incident-response.md) template
   - Identify process improvements

### Communication Templates

#### Rollback Notification (Internal)

```
🔄 PRODUCTION ROLLBACK IN PROGRESS

Deployment: {deployment-id}
Reason: {brief description}
Rollback to: {previous-deployment-id}
Initiated by: {your-name}
Time: {timestamp}

Status: In Progress
Estimated completion: 5 minutes

Will update when rollback is validated.
```

#### Rollback Complete (Internal)

```
✅ PRODUCTION ROLLBACK COMPLETE

Previous Deployment: {failed-deployment-id}
Rolled Back to: {stable-deployment-id}
Status: Validated and Stable
Error Rate: Back to baseline
Health Check: Passing

Root cause analysis and fix in progress.
Incident report: {Linear issue link}
```

#### User Communication (if needed)

```
We experienced a brief service issue that has been resolved.
All systems are now operating normally. We apologize for any
inconvenience. If you continue to experience problems, please
contact support.
```

## Rollback Best Practices

### Prevention is Better Than Rollback

1. **Thorough Testing**
   - Test in preview environments
   - Run full test suite before production
   - Perform manual QA on staging

2. **Gradual Rollouts**
   - Deploy to staging first, validate
   - Use feature flags for big changes
   - Monitor closely after deployment

3. **Backward-Compatible Changes**
   - Design migrations to be reversible
   - Add new features without breaking old code
   - Deprecate before removing

### Fast Rollback Capability

1. **Know Your Tools**
   - Practice rollback in staging
   - Keep Vercel dashboard accessible
   - Have CLI commands ready

2. **Monitor Proactively**
   - Watch deployments in real-time
   - Set up alerts for error spikes
   - Have incident response team ready

3. **Clear Decision Criteria**
   - Don't hesitate on critical issues
   - Use rollback decision matrix
   - Document rollback authority

### Rollback Testing

Periodically test rollback procedures:

```bash
# Monthly rollback drill
1. Deploy test change to staging
2. Practice rolling back via dashboard
3. Practice rolling back via CLI
4. Verify monitoring and alerts work
5. Document any issues or improvements needed
```

## Rollback Metrics

Track rollback metrics to improve deployment quality:

- **Rollback Frequency**: How often do we roll back?
- **Time to Rollback**: How fast can we roll back?
- **Rollback Success Rate**: Do rollbacks always succeed?
- **Deployment Failure Rate**: What % of deployments need rollback?

**Target Metrics:**

- Rollback rate: <5% of deployments
- Time to rollback: <5 minutes
- Rollback success rate: 100%
- Repeat issues: 0 (don't deploy same bug twice)

## Related Documentation

- [Deployment Runbook](./deployment-runbook.md) - Deployment procedures
- [Incident Response](./incident-response.md) - Incident handling
- [Troubleshooting Guide](./troubleshooting-guide.md) - Common issues
- [CI/CD Overview](./ci-cd-overview.md) - Pipeline architecture
