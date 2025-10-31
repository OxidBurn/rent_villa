# Incident Response Procedures

**Last Updated:** 2025-10-31
**Owner:** Tech Lead
**Status:** Production Ready

## Table of Contents

- [Incident Severity Classification](#incident-severity-classification)
- [Incident Response Team](#incident-response-team)
- [Incident Response Process](#incident-response-process)
- [Communication Templates](#communication-templates)
- [Post-Incident Review](#post-incident-review)
- [Incident Log](#incident-log)

## Incident Severity Classification

All incidents are classified by severity to determine response priority and escalation.

### Severity 1 (Critical) - Immediate Response

**Definition**: Complete service outage or critical functionality unavailable

**Examples**:

- Application completely down (500 errors on all pages)
- Database connection lost (all queries failing)
- Data corruption or data loss
- Security breach or unauthorized access
- Payment processing completely broken

**Response Time**: Immediate (< 5 minutes)
**Response Team**: All hands on deck
**Communication**: Public status page + user notification

**Action**:

1. Page on-call engineer immediately
2. Engage incident commander
3. Initiate emergency response
4. Consider immediate rollback

---

### Severity 2 (High) - Urgent Response

**Definition**: Major functionality degraded or unavailable for subset of users

**Examples**:

- Elevated error rate (>5% of requests failing)
- Critical feature not working (authentication, search, checkout)
- Significant performance degradation (>50% slower)
- Database queries timing out frequently
- API endpoints returning 500 errors

**Response Time**: Within 15 minutes
**Response Team**: Engineering team + tech lead
**Communication**: Internal notification + status page update

**Action**:

1. Notify engineering team
2. Assess impact and root cause
3. Determine if rollback needed
4. Implement fix or rollback

---

### Severity 3 (Medium) - Standard Response

**Definition**: Non-critical functionality impaired, workarounds available

**Examples**:

- Minor feature not working (image upload, export)
- Intermittent errors affecting <5% of requests
- Performance degradation <50%
- Non-critical API endpoints failing
- UI bugs affecting some users

**Response Time**: Within 1 hour (business hours)
**Response Team**: Engineering team
**Communication**: Internal notification only

**Action**:

1. Create incident ticket
2. Investigate and fix during business hours
3. Deploy fix in next scheduled deployment

---

### Severity 4 (Low) - Deferred Response

**Definition**: Cosmetic issues, documentation errors, minor bugs

**Examples**:

- Typos in UI
- Layout issues on specific browsers
- Non-critical documentation errors
- Minor logging issues

**Response Time**: Next sprint
**Response Team**: Assigned engineer
**Communication**: None (track in backlog)

**Action**:

1. Create bug ticket
2. Add to backlog
3. Fix in next sprint

## Incident Response Team

### Roles and Responsibilities

#### Incident Commander

- **Responsibility**: Overall incident coordination
- **Actions**:
  - Declare incident severity
  - Coordinate response team
  - Make rollback decisions
  - Communicate with stakeholders
  - Lead post-mortem

- **Primary**: Tech Lead
- **Backup**: Senior Engineer

---

#### On-Call Engineer

- **Responsibility**: First responder, technical investigation
- **Actions**:
  - Acknowledge alert within 5 minutes
  - Assess severity
  - Begin troubleshooting
  - Escalate if needed
  - Implement fix or rollback

- **Rotation**: Weekly rotation
- **Escalation**: If no response in 15 minutes, page backup

---

#### Communications Lead

- **Responsibility**: User and stakeholder communication
- **Actions**:
  - Update status page
  - Draft user notifications
  - Communicate with support team
  - Post updates to social media (if applicable)

- **Primary**: Product Manager
- **Backup**: Customer Support Lead

---

#### Database Expert

- **Responsibility**: Database-related incidents
- **Actions**:
  - Investigate database performance
  - Execute database rollbacks
  - Restore from backups if needed

- **Primary**: Backend Engineer
- **Backup**: Tech Lead

## Incident Response Process

### Phase 1: Detection (0-5 minutes)

Incidents are typically detected through:

- **Automated Alerts**:
  - Vercel deployment failure notification
  - Sentry error rate spike alert
  - Health check endpoint failing
  - Database connection alerts

- **Manual Reports**:
  - User reports via support
  - Team member notices issue
  - Monitoring dashboard review

**Action**: Acknowledge alert, assess severity

---

### Phase 2: Assessment (5-15 minutes)

#### Quick Assessment Checklist

1. **Verify the Issue**

   ```bash
   # Check production health
   curl https://rent-villa.com/api/health

   # Check error rate in Sentry
   # Check Vercel deployment status
   ```

2. **Determine Scope**
   - What percentage of users affected?
   - Which features/pages broken?
   - Error rate increasing or stable?

3. **Identify Trigger**
   - Recent deployment?
   - Database migration?
   - Third-party service outage?
   - Traffic spike?

4. **Classify Severity**
   - Use severity matrix above
   - Declare severity level

**Output**: Incident severity and initial assessment

---

### Phase 3: Response (15-60 minutes)

#### For Severity 1 & 2 Incidents

**Immediate Actions**:

1. **Assemble Incident Team**

   ```
   Post in #incidents Slack channel:

   🚨 SEV-1 INCIDENT DECLARED

   Issue: {brief description}
   Impact: {user impact}
   Commander: {name}
   War Room: {Zoom/Slack link}

   @engineering-team please join
   ```

2. **Create Incident War Room**
   - Start Zoom call or dedicated Slack thread
   - All communication in war room
   - Assign roles

3. **Stabilize Service**

   **Option A: Rollback** (if recent deployment)

   ```bash
   # Via Vercel dashboard - instant
   # See: docs/deployment/rollback-procedures.md
   ```

   **Option B: Quick Fix**

   ```bash
   # If fix is simple and known
   git checkout -b hotfix/incident-{id}
   # Make fix
   git commit -m "hotfix: {description}"
   git push
   # Emergency merge and deploy
   ```

   **Option C: Disable Feature**

   ```bash
   # If specific feature causing issue
   # Set feature flag to disable
   vercel env add NEXT_PUBLIC_FEATURE_X_ENABLED false production
   vercel redeploy --prod
   ```

4. **Monitor Stability**
   - Watch error rate in Sentry
   - Monitor health endpoint
   - Check Vercel metrics
   - Confirm user impact reduced

#### For Severity 3 & 4 Incidents

- Create ticket in Linear
- Assign to engineer
- Fix in normal workflow
- Deploy in next scheduled deployment

---

### Phase 4: Communication (Ongoing)

#### Internal Communication

Update #incidents Slack channel every 15-30 minutes:

```
🔄 INCIDENT UPDATE

Status: {Investigating/Fixing/Monitoring/Resolved}
Time: {timestamp}
Impact: {current user impact}
ETA: {estimated resolution time}
Next Update: {time}
```

#### External Communication

**Status Page** (if applicable):

```
🔴 Service Degradation

We are currently experiencing issues with {feature}.
Our team is actively working on a resolution.

Last Updated: {timestamp}
Next Update: {time}
```

**User Notification** (if warranted):

- Email to affected users
- In-app notification
- Social media post

---

### Phase 5: Resolution (Variable)

**Incident Resolved When**:

- ✅ Error rate back to baseline
- ✅ Health checks passing
- ✅ User-reported issues resolved
- ✅ Monitoring shows stability for 30+ minutes
- ✅ Fix deployed and validated

**Actions**:

1. **Confirm Resolution**

   ```bash
   # Verify health
   curl https://rent-villa.com/api/health

   # Check Sentry error rate
   # Check Vercel metrics
   ```

2. **Communicate Resolution**

   ```
   ✅ INCIDENT RESOLVED

   Duration: {start time} - {end time}
   Root Cause: {brief summary}
   Resolution: {what fixed it}
   Impact: {final user impact}

   Post-mortem will be scheduled.
   ```

3. **Monitor Post-Resolution**
   - Watch for 1-2 hours after resolution
   - Ensure no regression
   - Keep team on standby

---

### Phase 6: Post-Incident Review (24-48 hours)

Schedule and conduct post-mortem meeting. See [Post-Incident Review](#post-incident-review) section below.

## Communication Templates

### Incident Declaration

```
🚨 {SEVERITY} INCIDENT DECLARED

ID: INC-{YYYY-MM-DD}-{number}
Severity: {1|2|3|4}
Declared By: {name}
Time: {timestamp}

SUMMARY:
{Brief description of issue}

IMPACT:
{What users are experiencing}

COMMANDER:
{Name of incident commander}

WAR ROOM:
{Zoom/Slack link}

RESPONSE TEAM:
{List of responders}

All updates will be posted in this thread.
```

---

### Status Update

```
🔄 INCIDENT UPDATE #{update-number}

ID: INC-{YYYY-MM-DD}-{number}
Status: {Investigating|Identified|Fixing|Monitoring|Resolved}
Time: {timestamp}
Duration: {time since incident start}

CURRENT STATUS:
{What we know now}

ACTIONS TAKEN:
{What we've done so far}

NEXT STEPS:
{What we're doing next}

ETA TO RESOLUTION:
{Best estimate or "unknown"}

NEXT UPDATE:
{Time of next update}
```

---

### Incident Resolution

```
✅ INCIDENT RESOLVED

ID: INC-{YYYY-MM-DD}-{number}
Resolved By: {name}
Resolution Time: {timestamp}
Total Duration: {time}

ROOT CAUSE:
{What caused the incident}

RESOLUTION:
{How it was fixed}

IMPACT:
- Affected Users: {number or percentage}
- Features Affected: {list}
- Downtime: {duration}
- Data Loss: {none|description}

PREVENTIVE MEASURES:
{What we'll do to prevent recurrence}

POST-MORTEM:
Will be scheduled within 48 hours.

Thanks to the response team for quick resolution! 🎉
```

---

### User Communication Template

**Subject**: Service Issue Resolved - Rent Villa

**Body**:

```
Dear Rent Villa Users,

We experienced a temporary service issue today between {start time}
and {end time} ({duration}).

WHAT HAPPENED:
{Brief, non-technical explanation}

IMPACT:
{What users may have experienced}

RESOLUTION:
The issue has been fully resolved and all systems are operating normally.

NEXT STEPS:
No action is required on your part. If you continue to experience
any issues, please contact our support team.

We apologize for any inconvenience this may have caused.

Sincerely,
The Rent Villa Team
```

## Post-Incident Review

### Post-Mortem Meeting (Within 48 Hours)

Schedule a blameless post-mortem meeting with:

- Incident commander
- Response team members
- Affected stakeholders
- Anyone who wants to learn

**Duration**: 60 minutes

---

### Post-Mortem Document

Create a document using this template:

```markdown
# Post-Mortem: {Incident Title}

**Date**: {YYYY-MM-DD}
**Incident ID**: INC-{YYYY-MM-DD}-{number}
**Severity**: {1|2|3|4}
**Duration**: {start} - {end} ({total time})
**Commander**: {name}
**Responders**: {list names}

## Summary

{2-3 sentence summary of what happened}

## Impact

- **Users Affected**: {number or percentage}
- **Revenue Impact**: {if applicable}
- **Features Impacted**: {list}
- **Downtime**: {total duration}
- **Data Loss**: {none or description}

## Timeline

| Time  | Event                         |
| ----- | ----------------------------- |
| 10:00 | Deployment to production      |
| 10:15 | Error rate spike detected     |
| 10:20 | Incident declared (SEV-1)     |
| 10:25 | Rollback initiated            |
| 10:30 | Rollback complete, monitoring |
| 10:45 | Error rate normalized         |
| 11:00 | Incident resolved             |

## Root Cause

{Detailed explanation of what caused the incident}

### Contributing Factors

1. {Factor 1}
2. {Factor 2}
3. {Factor 3}

## Resolution

{How the incident was resolved}

## What Went Well

- {Positive 1}
- {Positive 2}
- {Positive 3}

## What Could Be Improved

- {Improvement 1}
- {Improvement 2}
- {Improvement 3}

## Action Items

| Action     | Owner  | Due Date | Status |
| ---------- | ------ | -------- | ------ |
| {Action 1} | {Name} | {Date}   | Open   |
| {Action 2} | {Name} | {Date}   | Open   |
| {Action 3} | {Name} | {Date}   | Open   |

## Lessons Learned

{Key takeaways for the team}

## Preventive Measures

{Changes we'll make to prevent recurrence}
```

---

### Action Item Follow-Through

- All action items tracked in Linear
- Reviewed in next sprint planning
- Owners accountable for completion
- Follow-up on preventive measures

## Incident Log

Maintain a log of all incidents for tracking and learning.

### Incident Log Format

| ID                 | Date       | Severity | Duration | Root Cause                | Resolution            |
| ------------------ | ---------- | -------- | -------- | ------------------------- | --------------------- |
| INC-2025-10-31-001 | 2025-10-31 | SEV-2    | 45min    | Database migration failed | Rolled back migration |
| INC-2025-10-28-001 | 2025-10-28 | SEV-3    | 2hr      | API rate limit exceeded   | Increased rate limit  |

**Location**: `docs/incidents/incident-log.md`

---

### Incident Metrics

Track these metrics quarterly:

- **Incident Count**: Total incidents by severity
- **Mean Time to Detect (MTTD)**: How fast we detect issues
- **Mean Time to Resolve (MTTR)**: How fast we resolve issues
- **Repeat Incidents**: Same issue occurring multiple times
- **Incident-Free Days**: Days without incidents

**Goal**:

- MTTD: < 5 minutes
- MTTR (SEV-1): < 30 minutes
- MTTR (SEV-2): < 2 hours
- Repeat Incidents: 0

## Best Practices

### 1. Blameless Culture

- Focus on systems and processes, not individuals
- Encourage reporting near-misses
- Learn from mistakes
- No punishment for production incidents

---

### 2. Practice Incident Response

- Run incident drills quarterly
- Practice rollback procedures
- Test communication channels
- Rotate incident commander role

---

### 3. Document Everything

- Log all actions during incident
- Capture screenshots/logs
- Record timeline
- Write thorough post-mortems

---

### 4. Learn and Improve

- Review all SEV-1 and SEV-2 incidents
- Implement action items
- Track repeat incidents
- Share learnings across team

---

### 5. Proactive Monitoring

- Set up alerts before issues become incidents
- Monitor error rates continuously
- Watch for early warning signs
- Use health checks

---

### 6. Clear Escalation Path

Everyone should know:

- How to declare an incident
- Who to contact for help
- When to escalate
- Where to find documentation

## Related Documentation

- [Deployment Runbook](./deployment-runbook.md) - Deployment procedures
- [Rollback Procedures](./rollback-procedures.md) - How to rollback
- [Troubleshooting Guide](./troubleshooting-guide.md) - Common issues
- [CI/CD Overview](./ci-cd-overview.md) - Pipeline architecture
- [Health Monitoring](../health-monitoring.md) - System health checks
- [Error Monitoring](../error-monitoring.md) - Sentry setup
