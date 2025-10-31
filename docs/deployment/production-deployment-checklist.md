# Production Deployment Checklist

**Last Updated:** 2025-10-31
**Owner:** Tech Lead
**Status:** Ready for Use

## Overview

This checklist guides you through the first production deployment of Rent Villa. Complete each phase sequentially and validate success criteria before proceeding to the next phase.

## Pre-Deployment Phase

### Infrastructure Readiness

- [ ] **Vercel Production Environment Configured**
  - Production project created in Vercel dashboard
  - Custom domain configured (if applicable)
  - SSL certificate provisioned and valid

- [ ] **Database Ready**
  - Production database created in Vercel Postgres
  - Connection string obtained and secure
  - Database backup configured
  - Migration history clean

- [ ] **Environment Variables Set**
  - All required variables configured in Vercel (Production scope)
  - Database connection strings (pooled and non-pooled)
  - Sentry DSN and auth token
  - All secrets rotated from staging values
  - No development/staging credentials in production

- [ ] **Monitoring Configured**
  - Sentry project created for production
  - Vercel Analytics enabled
  - Health check endpoint ready
  - Alert notifications configured

### Code Readiness

- [ ] **All Previous Tasks Complete**
  - Task #2: GitHub Actions CI ✅
  - Task #3: Vercel Deployment ✅
  - Task #4: Vitest Tests ✅
  - Task #5: Playwright E2E ✅
  - Task #6: Database & Migrations ✅
  - Task #7: Code Quality ✅
  - Task #8: Sentry Error Tracking ✅
  - Task #9: Health Check & Monitoring ✅
  - Task #10: Documentation & Runbooks ✅

- [ ] **Staging Validated**
  - Staging deployment successful and stable
  - All tests passing in CI
  - Manual QA completed on staging
  - Performance acceptable on staging
  - No known critical bugs

- [ ] **Security Validated**
  - Security headers configured (vercel.json)
  - No secrets in code repository
  - Dependencies scanned for vulnerabilities
  - CORS policy reviewed and configured

### Team Readiness

- [ ] **Team Prepared**
  - Deployment window scheduled
  - Team notified of deployment time
  - Roles assigned (deployer, monitor, communicator)
  - Incident response team on standby

- [ ] **Documentation Ready**
  - Deployment runbook reviewed
  - Rollback procedures understood
  - Troubleshooting guide accessible
  - Incident response plan ready

- [ ] **Rollback Plan**
  - Rollback criteria defined
  - Rollback procedure tested in staging
  - Previous stable deployment identified
  - Team knows how to execute rollback

## Deployment Phase

### Execute Deployment

- [ ] **Create Deployment Communication**

  ```
  🚀 Production Deployment Starting

  Time: [timestamp]
  Deployer: [name]
  Changes: [brief summary]
  Expected Duration: 15-20 minutes

  Monitoring in #deployments channel
  ```

- [ ] **Promote to Production**
  - Method chosen: [ ] Vercel Dashboard [ ] CLI [ ] Git Push
  - Deployment initiated: Time **\_\_\_**
  - Build started successfully
  - Build logs monitored (no errors)

- [ ] **Monitor Build Progress**
  - Dependencies installed successfully
  - Database migrations executed without errors
  - Next.js build completed
  - Source maps uploaded to Sentry
  - Edge functions deployed
  - Deployment marked as "Ready"
  - Deployment ID recorded: **\*\***\_\_**\*\***

### Initial Validation

- [ ] **Health Check Verification**

  ```bash
  curl https://[production-domain]/api/health
  ```

  - Status: "healthy" ✅
  - Database check: passing ✅
  - Response time: <100ms ✅
  - Deployment ID matches: ✅

- [ ] **Application Loads**
  - Homepage loads without errors
  - No JavaScript errors in console
  - CSS/styles loading correctly
  - Images/assets serving from CDN

- [ ] **SSL/HTTPS Working**
  - Site loads over HTTPS
  - SSL certificate valid
  - No mixed content warnings
  - Security headers present

## Validation Phase

### System Validation

- [ ] **Database Connectivity**
  - Database queries executing successfully
  - Connection pool functioning
  - No connection errors in logs
  - Data integrity verified

- [ ] **Error Tracking Validation**
  - Trigger test error: `/test-sentry` page (if exists)
  - Error appears in Sentry within 1 minute
  - Source maps working (readable stack trace)
  - Alert notifications received
  - Error can be marked as resolved

- [ ] **Performance Check**

  ```bash
  # Check response times
  curl -w "@curl-format.txt" -o /dev/null -s https://[production-domain]
  ```

  - Homepage load: <2 seconds ✅
  - API response: <500ms ✅
  - Time to First Byte (TTFB): <600ms ✅
  - No performance degradation vs staging

- [ ] **Security Headers**

  ```bash
  curl -I https://[production-domain]
  ```

  - X-Frame-Options: DENY ✅
  - X-Content-Type-Options: nosniff ✅
  - X-XSS-Protection: 1; mode=block ✅
  - Referrer-Policy: strict-origin-when-cross-origin ✅

### Functional Validation

- [ ] **Critical User Flows**
  - [ ] Homepage displays correctly
  - [ ] Navigation works
  - [ ] API endpoints respond
  - [ ] Forms submit (if applicable)
  - [ ] Search works (if applicable)
  - [ ] Authentication works (if applicable)

- [ ] **Integration Validation**
  - External APIs responding
  - Third-party services connected
  - Email sending (if applicable)
  - Payment processing (if applicable)

- [ ] **Cross-Browser Testing**
  - Chrome: ✅
  - Firefox: ✅
  - Safari: ✅
  - Mobile browsers: ✅

### Monitoring Validation

- [ ] **Vercel Analytics**
  - Analytics receiving data
  - Real-time visitors showing
  - Page views tracking
  - Core Web Vitals reporting

- [ ] **Sentry Monitoring**
  - Sentry receiving events
  - Error grouping working
  - Alerts configured
  - Performance monitoring active

- [ ] **Logs and Debugging**
  - Vercel function logs accessible
  - Log levels appropriate (no debug logs)
  - Structured logging working
  - No sensitive data in logs

## Post-Deployment Phase

### Communication

- [ ] **Deployment Success Notification**

  ```
  ✅ Production Deployment Complete

  Deployment ID: [id]
  Time: [timestamp]
  Duration: [minutes]
  Status: Successful

  Health Check: Passing
  Error Rate: Normal
  Performance: Nominal

  Monitoring for next 60 minutes.
  ```

- [ ] **Stakeholder Notification**
  - Product manager informed
  - Customer support team briefed
  - Any user-facing changes communicated

### Monitoring Period

- [ ] **Immediate Monitoring (First 30 Minutes)**
  - Watch Sentry for error spikes
  - Monitor Vercel Analytics for traffic
  - Check health endpoint every 5 minutes
  - Review function logs for errors

- [ ] **Extended Monitoring (First 24 Hours)**
  - Error rate remains <1%
  - Response times stable
  - No degradation in Core Web Vitals
  - Database performance stable
  - No incident reports from users

### Rollback Testing

- [ ] **Test Rollback Procedure**
  - Document current deployment ID: **\*\***\_\_**\*\***
  - Initiate rollback to previous deployment
  - Verify rollback completes successfully
  - Test application still works after rollback
  - Roll forward to current deployment
  - Rollback execution time: **\_\_** minutes

- [ ] **Document Rollback Process**
  - Rollback decision criteria clear
  - Rollback steps documented
  - Communication template ready
  - Team trained on rollback

## Success Criteria

### Immediate Success (First Hour)

- ✅ Deployment completed without errors
- ✅ All health checks passing
- ✅ No critical errors in Sentry
- ✅ Application accessible and functional
- ✅ SSL working correctly
- ✅ Performance within acceptable range

### Short-Term Success (First 24 Hours)

- ✅ Uptime: 100%
- ✅ Error rate: <1%
- ✅ P95 response time: <500ms
- ✅ Core Web Vitals: All "Good"
- ✅ No rollback required
- ✅ No critical incidents

### Long-Term Success (First Week)

- ✅ Uptime: >99.9%
- ✅ User-reported issues: 0 critical
- ✅ Performance stable or improved
- ✅ Team confident in deployment process
- ✅ Monitoring providing useful insights

## Rollback Criteria

**Initiate rollback immediately if:**

- ❌ Complete application outage
- ❌ Database connection failure
- ❌ Data corruption detected
- ❌ Security vulnerability discovered
- ❌ Error rate >10% of requests
- ❌ Critical functionality completely broken

**Consider rollback if:**

- ⚠️ Error rate 5-10% of requests
- ⚠️ Performance degradation >50%
- ⚠️ Major feature not working
- ⚠️ Database migration issues
- ⚠️ External integration failures

**Fix forward if:**

- ✅ Error rate <5% of requests
- ✅ Quick fix available (<30 min)
- ✅ Issue is isolated and minor
- ✅ Workaround available for users
- ✅ Rollback would cause more disruption

## Post-Deployment Tasks

### Documentation

- [ ] **Update Deployment Log**
  - Record deployment date and time
  - Document deployment ID and version
  - Note any issues encountered
  - Record resolution time

- [ ] **Create Deployment Report**
  - Summarize what was deployed
  - Document validation results
  - Note any deviations from plan
  - Identify improvement opportunities

### Team Activities

- [ ] **Deployment Retrospective**
  - Schedule within 48 hours
  - Gather team feedback
  - Document lessons learned
  - Identify process improvements

- [ ] **Update Runbooks**
  - Incorporate learnings from deployment
  - Update troubleshooting guide
  - Refine deployment procedures
  - Document any new edge cases

### Epic Completion

- [ ] **Mark Epic as Complete**
  - Update epic status to "completed"
  - Update epic progress to 100%
  - Close all related GitHub issues
  - Archive epic documentation

- [ ] **Celebrate Success! 🎉**
  - Recognize team effort
  - Share success with stakeholders
  - Document the achievement
  - Plan next improvements

## Emergency Contacts

**Production Incident Response**

- **Incident Commander**: [Name] - [Contact]
- **On-Call Engineer**: [Name] - [Contact]
- **Database Expert**: [Name] - [Contact]
- **Vercel Support**: support@vercel.com
- **Sentry Support**: support@sentry.io

**Escalation Path**

1. On-Call Engineer (respond within 5 minutes)
2. Incident Commander (if no response in 15 minutes)
3. Tech Lead (for critical incidents)
4. VP Engineering (for P0 incidents)

## Tools and Dashboards

**Monitoring Dashboards**

- Vercel Dashboard: `https://vercel.com/{team}/rent-villa`
- Sentry Dashboard: `https://sentry.io/organizations/{org}/issues/`
- Vercel Analytics: `https://vercel.com/{team}/rent-villa/analytics`
- Database Dashboard: Vercel → Storage → Postgres

**Quick Commands**

```bash
# Check production health
curl https://[production-domain]/api/health

# View recent deployments
vercel ls --prod

# Pull production logs
vercel logs --prod

# Check deployment details
vercel inspect <deployment-url>

# Emergency rollback
vercel promote <previous-deployment-url> --prod
```

## Notes

- **Timing**: Deploy during low-traffic hours (recommended: Tuesday-Thursday, 10 AM - 2 PM)
- **Avoid**: Fridays, weekends, holidays, end-of-month
- **Duration**: Expect 15-30 minutes for full deployment and validation
- **Team**: Minimum 2 people required (deployer + monitor)
- **Communication**: Keep #deployments channel updated throughout

## Checklist Completion

**Deployment Date**: **\*\***\_\_\_**\*\***
**Deployment Time**: **\*\***\_\_\_**\*\***
**Deployed By**: **\*\***\_\_\_**\*\***
**Deployment ID**: **\*\***\_\_\_**\*\***
**Status**: [ ] Success [ ] Partial Success [ ] Failed [ ] Rolled Back

**Sign-off:**

- Deployer: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***
- Tech Lead: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***
- Product Manager: **\*\***\_\_\_**\*\*** Date: **\*\***\_\_\_**\*\***
