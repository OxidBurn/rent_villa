# Error Monitoring Guide

## Overview

Rent Villa uses Sentry for real-time error tracking and monitoring in production environments. This guide covers how to work with Sentry, investigate errors, and follow best practices for error handling.

## Sentry Dashboard

**Access:** Visit your Sentry organization dashboard at sentry.io

**Key Sections:**

- **Issues:** All errors grouped by type and frequency
- **Performance:** Transaction and performance monitoring
- **Releases:** Track errors by deployment version
- **Alerts:** Configure notification rules

## Error Tracking

### Automatic Error Capture

Errors are automatically captured from:

- **Client-side errors:** JavaScript exceptions in the browser
- **Server-side errors:** API route failures and server component errors
- **Unhandled promise rejections:** Async operation failures
- **React error boundaries:** Component rendering errors

### Manual Error Capture

You can manually capture errors or messages:

```typescript
import * as Sentry from '@sentry/nextjs'

try {
  await riskyOperation()
} catch (error) {
  Sentry.captureException(error)
  throw error
}

Sentry.captureMessage('Something noteworthy happened', 'info')
```

### Adding Context

**User Context:**

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: user.name,
})
```

**Custom Tags:**

```typescript
Sentry.setTag('page', 'properties')
Sentry.setTag('feature', 'booking')
Sentry.setTag('tenant_id', tenantId)
```

**Breadcrumbs:**

```typescript
Sentry.addBreadcrumb({
  category: 'booking',
  message: 'User initiated property booking',
  level: 'info',
  data: {
    propertyId: '123',
    checkIn: '2025-01-01',
  },
})
```

## Error Response Workflow

### When an Error Occurs

1. **Sentry captures error** automatically (in staging/production)
2. **User sees error boundary** with friendly message and retry button
3. **Team receives notification** (if alert rules configured)
4. **Developer investigates** in Sentry dashboard

### Investigating Errors

1. Open the error issue in Sentry dashboard
2. Review the stack trace (source maps show original TypeScript code)
3. Check user context, tags, and breadcrumbs
4. Review similar errors and frequency
5. Check if error is new or recurring
6. Determine severity and priority
7. Assign to team member for resolution

### Resolving Errors

1. Reproduce the error locally or in staging
2. Fix the bug in code
3. Create PR with fix
4. Deploy fix to production
5. Mark issue as resolved in Sentry
6. Monitor for recurrence

## Testing Error Tracking

### Local Testing

Visit the test page:

```bash
npm run dev
open http://localhost:3000/test-sentry
```

Click buttons to trigger test errors. In development mode:

- Errors are logged to browser console
- Errors are NOT sent to Sentry (to avoid noise)

### Staging/Production Testing

1. Deploy to staging environment
2. Visit: `https://your-staging-url.vercel.app/test-sentry`
3. Trigger test errors
4. Check Sentry dashboard to verify error capture
5. Verify source maps are working (stack traces show TypeScript code)

## Best Practices

### Do's

1. **Add context to errors:**

   - Use tags for categorization
   - Add breadcrumbs to track user flow
   - Include user IDs (non-PII)

2. **Handle errors gracefully:**

   - Show user-friendly error messages
   - Provide recovery actions (try again button)
   - Never expose technical details to users

3. **Monitor and triage:**

   - Review new errors within 24 hours
   - Prioritize by frequency and impact
   - Resolve stale issues promptly

4. **Use error boundaries:**
   - Wrap risky components with error boundaries
   - Provide fallback UI
   - Allow users to recover without refresh

### Don'ts

1. **Don't capture sensitive data:**

   - Never log passwords, tokens, or API keys
   - Sanitize user input before logging
   - Avoid logging PII (personal identifiable information)

2. **Don't ignore errors:**

   - Don't mark errors as resolved without fixing
   - Don't ignore recurring errors
   - Don't leave errors unassigned for too long

3. **Don't over-alert:**
   - Avoid alert fatigue by setting appropriate thresholds
   - Don't alert on known third-party errors
   - Use sampling for high-volume errors

## Environment Configuration

### Development

- Environment: `development`
- Behavior: Errors logged to console only
- Sentry: Disabled (errors not sent)

### Staging

- Environment: `staging` or `preview`
- Behavior: All errors sent to Sentry
- Source maps: Uploaded for debugging

### Production

- Environment: `production`
- Behavior: All errors sent to Sentry
- Source maps: Uploaded and hidden from users
- Sample rate: 10% of traces

## Environment Variables

Required environment variables for Sentry:

### Runtime Variables (Vercel)

```bash
# Sentry DSN for error reporting
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### Build-time Variables (Vercel)

```bash
# For source map upload during build
SENTRY_AUTH_TOKEN=<from Sentry settings>
SENTRY_ORG=your-organization-name
SENTRY_PROJECT=your-project-name
```

### Local Development

Add to `.env.local` (optional, for testing):

```bash
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

## Source Maps

Source maps allow Sentry to show original TypeScript code in stack traces instead of minified JavaScript.

### How It Works

1. During production build, Next.js generates source maps
2. Sentry webpack plugin uploads source maps to Sentry
3. Source maps are hidden from users (`hideSourceMaps: true`)
4. Sentry uses source maps to translate stack traces

### Verifying Source Maps

1. Trigger an error in staging/production
2. Open error in Sentry dashboard
3. Check stack trace shows TypeScript filenames and line numbers
4. If showing minified code, check build logs for upload errors

## Common Issues

### Errors not appearing in Sentry

**Possible causes:**

- Running in development mode (errors not sent)
- Missing or incorrect SENTRY_DSN
- beforeSend filter blocking errors
- Network issues preventing upload

**Solutions:**

- Check environment variables are set
- Verify environment is not `development`
- Check browser console for Sentry errors
- Test with manual capture: `Sentry.captureMessage('test')`

### Source maps not working

**Possible causes:**

- SENTRY_AUTH_TOKEN not set
- Build failed to upload source maps
- Wrong release version

**Solutions:**

- Verify SENTRY_AUTH_TOKEN in Vercel
- Check build logs for "Sentry" upload confirmation
- Ensure release version matches deployment

### Too many errors

**Possible causes:**

- High traffic causing many similar errors
- Third-party script errors
- Known browser issues (ResizeObserver)

**Solutions:**

- Adjust `tracesSampleRate` in sentry config
- Add patterns to `ignoreErrors` array
- Fix root cause to reduce error frequency

### User context not appearing

**Possible causes:**

- User context not set after authentication
- Missing setUser call
- Error occurred before user context set

**Solutions:**

- Call `Sentry.setUser()` after authentication
- Set user context in root layout or auth callback
- Verify user ID is being passed correctly

## Alerting Rules

Configure alert rules in Sentry dashboard:

### Recommended Alerts

1. **New Issue Alert:**

   - Trigger: When a new issue is created
   - Action: Notify team Slack channel
   - Frequency: Immediately

2. **High Frequency Alert:**

   - Trigger: Issue occurs >100 times in 1 hour
   - Action: Notify on-call engineer
   - Frequency: At most once per hour

3. **Regression Alert:**
   - Trigger: Resolved issue occurs again
   - Action: Notify original assignee
   - Frequency: Immediately

## Sentry Project Setup

For new team members or new environments:

1. **Create Sentry Account:**

   - Visit sentry.io and sign up
   - Create organization (or get invited)

2. **Create Project:**

   - Click "Create Project"
   - Platform: Next.js
   - Project name: `rent-villa-nextjs`
   - Copy DSN value

3. **Configure Environment Variables:**

   - Add SENTRY_DSN to Vercel
   - Add NEXT_PUBLIC_SENTRY_DSN to Vercel
   - Create auth token in Sentry settings
   - Add SENTRY_AUTH_TOKEN to Vercel

4. **Test Integration:**
   - Deploy to staging
   - Visit `/test-sentry`
   - Trigger test errors
   - Verify in Sentry dashboard

## Performance Monitoring

While this setup focuses on error tracking, Sentry also supports performance monitoring:

- **Trace Sample Rate:** Set to 10% to monitor performance
- **Transaction Tracking:** Automatically tracks API calls and page loads
- **Performance Issues:** Identifies slow queries and endpoints

To view performance data:

1. Go to Sentry dashboard
2. Click "Performance" tab
3. Review transaction list and metrics

## Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Error Boundaries in React](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Sentry Best Practices](https://docs.sentry.io/product/best-practices/)
- [Source Maps Guide](https://docs.sentry.io/platforms/javascript/sourcemaps/)

## Support

For issues with Sentry integration:

1. Check this documentation first
2. Review Sentry's troubleshooting guide
3. Contact team lead for configuration help
4. Reach out to Sentry support for platform issues
