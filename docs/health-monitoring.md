# Health Check & Monitoring

## Overview

Rent Villa includes a comprehensive health check endpoint at `/api/health` that monitors system health and provides visibility into the application's operational status.

## Health Check Endpoint

### Endpoint Details

- **URL:** `/api/health`
- **Method:** GET
- **Authentication:** None (public endpoint)
- **Response Format:** JSON

### Response Structure

```json
{
  "status": "healthy",
  "timestamp": "2025-10-31T00:00:00.000Z",
  "version": "1.0.0",
  "deploymentId": "dpl_xxx",
  "environment": "production",
  "checks": {
    "database": {
      "status": "healthy",
      "responseTime": 45
    }
  }
}
```

### Status Values

- **`healthy`**: All systems operational
- **`degraded`**: System operational but some components have issues
- **`unhealthy`**: Critical system failure

### HTTP Status Codes

- **200 OK**: System is healthy or degraded
- **503 Service Unavailable**: System is unhealthy

## Health Checks

### Database Connectivity

Tests database connection with a simple query (`SELECT 1`).

**Healthy Response:**

```json
{
  "database": {
    "status": "healthy",
    "responseTime": 45
  }
}
```

**Unhealthy Response:**

```json
{
  "database": {
    "status": "unhealthy",
    "responseTime": 120,
    "error": "Connection timeout"
  }
}
```

**Degraded Response** (when DATABASE_URL not configured):

```json
{
  "database": {
    "status": "degraded",
    "responseTime": 1,
    "error": "DATABASE_URL not configured"
  }
}
```

## Monitoring Setup

### Vercel Integration

Vercel automatically monitors your deployment health. The health check endpoint integrates with Vercel's monitoring:

1. **Configure Health Check Path:**
   - Go to Vercel dashboard → Project Settings → Functions
   - Set health check path to `/api/health`

2. **Uptime Monitoring:**
   - Vercel automatically pings the health endpoint
   - Alerts are sent when health checks fail
   - View uptime metrics in Vercel dashboard

### External Monitoring

You can use external monitoring services:

**UptimeRobot:**

```
Monitor Type: HTTP(s)
URL: https://your-domain.com/api/health
Monitoring Interval: 5 minutes
```

**Pingdom:**

```
Check Type: HTTP
URL: https://your-domain.com/api/health
Check Interval: 1 minute
```

**Custom Monitoring:**

```bash
# Simple curl check
curl -f https://your-domain.com/api/health || echo "Health check failed"

# With response validation
response=$(curl -s https://your-domain.com/api/health)
status=$(echo $response | jq -r '.status')

if [ "$status" != "healthy" ]; then
  echo "System unhealthy: $response"
  # Send alert
fi
```

## Usage Examples

### Basic Health Check

```bash
curl https://your-domain.com/api/health
```

### Check Specific Component

```typescript
async function checkDatabaseHealth() {
  const response = await fetch('/api/health')
  const health = await response.json()

  return health.checks.database.status === 'healthy'
}
```

### Health Dashboard Integration

```typescript
'use client'

import { useState, useEffect } from 'react'

export function HealthStatus() {
  const [health, setHealth] = useState(null)

  useEffect(() => {
    const checkHealth = async () => {
      const response = await fetch('/api/health')
      const data = await response.json()
      setHealth(data)
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000) // Check every 30s

    return () => clearInterval(interval)
  }, [])

  if (!health) return <div>Loading...</div>

  return (
    <div>
      <h3>System Health: {health.status}</h3>
      <p>Database: {health.checks.database.status}</p>
      <p>Response Time: {health.checks.database.responseTime}ms</p>
    </div>
  )
}
```

## Deployment Metadata

The health check includes deployment information:

### Version

- **Source:** `package.json` version field
- **Example:** `"version": "1.0.0"`
- **Use Case:** Verify deployed version matches expected

### Deployment ID

- **Source:** `VERCEL_DEPLOYMENT_ID` environment variable
- **Example:** `"dpl_ABC123xyz"`
- **Use Case:** Identify specific deployment for debugging

### Environment

- **Source:** `VERCEL_ENV` or `NODE_ENV`
- **Values:** `production`, `preview`, `development`
- **Use Case:** Differentiate between environments

## Best Practices

### Do's

1. **Monitor Regularly:**
   - Set up automated health check monitoring
   - Alert on failures immediately
   - Track response times over time

2. **Use in Deployment Validation:**

   ```bash
   # After deployment, verify health
   deploy_health=$(curl -s https://your-domain.com/api/health | jq -r '.status')
   if [ "$deploy_health" != "healthy" ]; then
     echo "Deployment health check failed, rolling back"
     vercel rollback
   fi
   ```

3. **Include in CI/CD:**
   - Smoke test after deployment
   - Verify health before promoting to production

4. **Track Metrics:**
   - Log response times
   - Monitor database connectivity patterns
   - Set alerts for degraded performance

### Don'ts

1. **Don't Use for Security:**
   - Health endpoint is public
   - Don't expose sensitive information
   - Don't use for authentication

2. **Don't Overwhelm Database:**
   - Health checks run frequently
   - Use connection pooling
   - Keep queries lightweight

3. **Don't Ignore Degraded Status:**
   - Degraded means something needs attention
   - Investigate before it becomes unhealthy

## Troubleshooting

### Health Check Fails

**Symptom:** `/api/health` returns 503 or times out

**Possible Causes:**

1. **Database Connection Issues:**

   ```
   Check: health.checks.database.error
   Solution: Verify DATABASE_URL, check database status
   ```

2. **Application Crash:**

   ```
   Check: Health endpoint not responding
   Solution: Check application logs, verify deployment
   ```

3. **Network Issues:**
   ```
   Check: Timeout or connection refused
   Solution: Verify DNS, check firewall rules
   ```

### Slow Response Times

**Symptom:** `responseTime` > 1000ms

**Possible Causes:**

1. **Database Latency:**

   ```
   Check: health.checks.database.responseTime
   Solution: Check database performance, optimize queries
   ```

2. **Cold Start:**

   ```
   Check: First request after inactivity
   Solution: Normal for serverless, consider warm-up
   ```

3. **Resource Constraints:**
   ```
   Check: High CPU/memory usage
   Solution: Scale resources, optimize application
   ```

### Environment Not Detected

**Symptom:** `environment` shows unexpected value

**Possible Causes:**

1. **Missing Environment Variables:**

   ```
   Check: VERCEL_ENV not set
   Solution: Ensure deployment via Vercel
   ```

2. **Local Development:**
   ```
   Check: Shows "development"
   Solution: Expected for local development
   ```

## Integration with Other Services

### Sentry Integration

Combine health checks with Sentry for comprehensive monitoring:

```typescript
import * as Sentry from '@sentry/nextjs'

export async function GET() {
  try {
    const health = await getHealthStatus()

    if (health.status === 'unhealthy') {
      Sentry.captureMessage('System health check failed', {
        level: 'error',
        extra: { health },
      })
    }

    return NextResponse.json(health, { status: health.status === 'healthy' ? 200 : 503 })
  } catch (error) {
    Sentry.captureException(error)
    throw error
  }
}
```

### Slack Notifications

Set up automated Slack notifications for health failures:

```typescript
async function notifySlackOnFailure(health: HealthResponse) {
  if (health.status === 'unhealthy') {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚨 System Health Alert: ${health.status}`,
        attachments: [
          {
            color: 'danger',
            fields: [
              {
                title: 'Database',
                value: health.checks.database.status,
                short: true,
              },
              {
                title: 'Environment',
                value: health.environment,
                short: true,
              },
            ],
          },
        ],
      }),
    })
  }
}
```

## Performance Considerations

### Response Time Targets

- **Excellent:** < 100ms
- **Good:** 100-500ms
- **Acceptable:** 500-1000ms
- **Poor:** > 1000ms

### Optimization Tips

1. **Database Connection Pooling:**
   - Already configured in `src/db/client.ts`
   - Max pool size: 10 connections

2. **Lightweight Checks:**
   - Use simple `SELECT 1` query
   - Don't run complex database queries

3. **Caching (Optional):**

   ```typescript
   let cachedHealth: { data: HealthResponse; timestamp: number } | null = null
   const CACHE_TTL = 5000 // 5 seconds

   export async function GET() {
     const now = Date.now()

     if (cachedHealth && now - cachedHealth.timestamp < CACHE_TTL) {
       return NextResponse.json(cachedHealth.data)
     }

     const health = await getHealthStatus()
     cachedHealth = { data: health, timestamp: now }

     return NextResponse.json(health, { status: health.status === 'healthy' ? 200 : 503 })
   }
   ```

## Security Considerations

### Public Endpoint

The health check is intentionally public:

- ✅ Safe to expose (no sensitive data)
- ✅ Useful for monitoring services
- ✅ Required for load balancers/uptime checks

### What NOT to Include

- ❌ Database credentials
- ❌ API keys or secrets
- ❌ User data or PII
- ❌ Internal IP addresses
- ❌ Detailed error stack traces

### Rate Limiting

Consider adding rate limiting for public health checks:

```typescript
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
})

export async function GET(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  const { success } = await ratelimit.limit(ip)

  if (!success) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  const health = await getHealthStatus()
  return NextResponse.json(health, { status: health.status === 'healthy' ? 200 : 503 })
}
```

## Resources

- [Vercel Health Checks](https://vercel.com/docs/concepts/solutions/health-checks)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [Uptime Monitoring Best Practices](https://www.atlassian.com/incident-management/kpis/uptime)
