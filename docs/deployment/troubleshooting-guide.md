# Troubleshooting Guide

**Last Updated:** 2025-10-31
**Owner:** Tech Lead
**Status:** Production Ready

## Table of Contents

- [CI Pipeline Failures](#ci-pipeline-failures)
- [Vercel Build Failures](#vercel-build-failures)
- [Database Issues](#database-issues)
- [Environment Variable Problems](#environment-variable-problems)
- [Runtime Errors](#runtime-errors)
- [Performance Issues](#performance-issues)
- [Authentication and Authorization](#authentication-and-authorization)

## CI Pipeline Failures

### Format Check Failed

**Error Message:**

```
Code style issues found in the above file(s). Run Prettier to fix.
```

**Cause**: Code not formatted with Prettier

**Solution**:

```bash
# Format all files
npm run format

# Commit the formatted code
git add .
git commit -m "chore: format code with Prettier"
git push
```

**Prevention**: Run `npm run format` before committing

---

### Lint Failed

**Error Message:**

```
/src/components/Example.tsx
  12:7  error  'data' is assigned a value but never used  @typescript-eslint/no-unused-vars
```

**Cause**: ESLint rule violation (unused variable, missing types, etc.)

**Solution**:

```bash
# Fix auto-fixable lint issues
npm run lint -- --fix

# For manual fixes, edit the file to resolve the error
# Then commit changes
git add .
git commit -m "fix: resolve lint errors"
git push
```

**Common Lint Errors**:

| Error                                | Solution                                           |
| ------------------------------------ | -------------------------------------------------- |
| `no-unused-vars`                     | Remove unused variable or prefix with `_`          |
| `no-console`                         | Remove `console.log` or use eslint-disable comment |
| `react-hooks/exhaustive-deps`        | Add missing dependency to useEffect array          |
| `@typescript-eslint/no-explicit-any` | Replace `any` with specific type                   |

**Prevention**: Run `npm run lint` before committing

---

### Type Check Failed

**Error Message:**

```
src/components/Example.tsx:15:7 - error TS2322: Type 'string' is not assignable to type 'number'.
```

**Cause**: TypeScript type mismatch

**Solution**:

```typescript
// Fix the type mismatch
// Before:
const age: number = "25"

// After:
const age: number = 25
// or
const age: string = "25"
```

**Common Type Errors**:

| Error                            | Solution                          |
| -------------------------------- | --------------------------------- |
| `TS2322` Type not assignable     | Fix type annotation or value      |
| `TS2304` Cannot find name        | Import missing type/variable      |
| `TS2345` Argument type mismatch  | Pass correct type to function     |
| `TS2339` Property does not exist | Check object type or add property |

**Prevention**: Run `npx tsc --noEmit` locally before pushing

---

### Test Failed

**Error Message:**

```
FAIL src/components/Example.test.tsx
  ✕ should render correctly (125 ms)

  Expected: "Hello"
  Received: "Goodbye"
```

**Cause**: Test expectations don't match implementation

**Solution**:

```bash
# Run tests locally
npm test

# Fix the failing test or implementation
# Re-run tests to verify
npm test

# Commit fix
git add .
git commit -m "fix: update test expectations"
git push
```

**Debugging Tests**:

```bash
# Run specific test file
npm test -- Example.test.tsx

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**Prevention**: Run `npm test` before pushing

---

### Build Failed

**Error Message:**

```
Error: Build failed
  Page: /api/example
  Error: Cannot find module '@/utils/missing-file'
```

**Cause**: Missing import, syntax error, or build configuration issue

**Solution**:

```bash
# Run build locally to reproduce
npm run build

# Fix the error (missing file, incorrect import, etc.)

# Re-run build
npm run build

# Commit fix
git add .
git commit -m "fix: resolve build error"
git push
```

**Common Build Errors**:

| Error              | Solution                                                          |
| ------------------ | ----------------------------------------------------------------- |
| `Module not found` | Check import path, create missing file                            |
| `Unexpected token` | Fix syntax error in code                                          |
| `Out of memory`    | Increase Node.js memory: `NODE_OPTIONS=--max_old_space_size=4096` |
| `Type error`       | Fix TypeScript errors (run `npx tsc`)                             |

**Prevention**: Run `npm run build` before pushing major changes

---

### E2E Tests Failed

**Error Message:**

```
Error: Timeout 30000ms exceeded.
  expect(locator).toBeVisible()
```

**Cause**: Element not found, page didn't load, or test flakiness

**Solution**:

```bash
# Run E2E tests locally
npm run test:e2e

# Debug specific test
npx playwright test example.spec.ts --debug

# Update test selectors if UI changed
# Increase timeout if page is slow to load
```

**Common E2E Issues**:

| Issue               | Solution                                    |
| ------------------- | ------------------------------------------- |
| Element not found   | Update selector, check if UI changed        |
| Timeout             | Increase timeout, check network speed       |
| Flaky test          | Add `waitForLoadState`, fix race conditions |
| Screenshot mismatch | Update baseline screenshot                  |

**Prevention**: Run E2E tests in preview environment before merging

## Vercel Build Failures

### Missing Environment Variables

**Error Message**:

```
Error: Environment variable DATABASE_URL is not defined
```

**Cause**: Required environment variable not set in Vercel

**Solution**:

1. Go to Vercel dashboard: `https://vercel.com/{team}/rent-villa/settings/environment-variables`
2. Click **"Add Variable"**
3. Enter variable name and value
4. Select environment scope (Production, Preview, Development)
5. Click **"Save"**
6. Redeploy: `vercel redeploy` or trigger via Git push

**Prevention**: Check `.env.local.example` for required variables before deploying

---

### Database Migration Failed

**Error Message**:

```
Error: Migration failed: relation "users" already exists
```

**Cause**: Migration already applied, or schema state mismatch

**Solution**:

```bash
# Connect to database
npm run db:studio

# Check migration status
SELECT * FROM __drizzle_migrations;

# If migration was partially applied, manually rollback or fix state

# Re-run migration
npm run db:migrate
```

**Prevention**: Test migrations in preview environment first

---

### Build Timeout

**Error Message**:

```
Error: Command "npm run build" timed out after 15 minutes
```

**Cause**: Build process taking too long (large dependencies, slow compilation)

**Solution**:

1. Optimize build performance:

   ```json
   // next.config.ts
   {
     "swcMinify": true,
     "experimental": {
       "turbo": true
     }
   }
   ```

2. Check for circular dependencies:

   ```bash
   npx madge --circular --extensions ts,tsx src/
   ```

3. Reduce bundle size:
   ```bash
   npm run build -- --analyze
   ```

**Prevention**: Monitor build times and optimize incrementally

---

### Vercel Function Size Exceeded

**Error Message**:

```
Error: Serverless Function size exceeded (50 MB limit)
```

**Cause**: API route or server component bundle too large

**Solution**:

1. Split large API routes into smaller functions
2. Use dynamic imports for heavy dependencies
3. Exclude unnecessary files from function bundle

```typescript
// Use dynamic imports
const heavyLibrary = await import('heavy-library')
```

**Prevention**: Keep API routes focused and lightweight

## Database Issues

### Connection Pool Exhausted

**Error Message**:

```
Error: remaining connection slots are reserved for non-replication superuser connections
```

**Cause**: Too many concurrent database connections

**Solution**:

```typescript
// Reduce max connections in database client
export const db = drizzle(client, {
  schema,
  logger: true,
  // Reduce pool size
  pool: { max: 5 },
})
```

**Prevention**: Use connection pooling, close connections properly

---

### Query Timeout

**Error Message**:

```
Error: Query timeout after 30000ms
```

**Cause**: Slow query, missing index, or database overload

**Solution**:

1. Check slow query log in database
2. Add indexes to frequently queried columns
3. Optimize query (use `.limit()`, avoid `SELECT *`)

```typescript
// Before (slow):
const users = await db.select().from(users).where(eq(users.email, email))

// After (faster):
const users = await db.select().from(users).where(eq(users.email, email)).limit(1)
```

**Prevention**: Add database indexes, monitor query performance

---

### Migration Conflict

**Error Message**:

```
Error: Migration conflict detected
```

**Cause**: Multiple developers created migrations in parallel

**Solution**:

1. Pull latest `main` branch
2. Regenerate migrations:
   ```bash
   rm -rf src/db/migrations/*
   npx drizzle-kit generate:pg
   ```
3. Review and test migrations
4. Commit and push

**Prevention**: Coordinate migration changes with team

## Environment Variable Problems

### Variable Not Available in Browser

**Error Message**:

```
Error: process.env.API_KEY is undefined (client-side)
```

**Cause**: Environment variable not prefixed with `NEXT_PUBLIC_`

**Solution**:

```bash
# Rename variable to include NEXT_PUBLIC_ prefix
# Before:
API_KEY=xxx

# After:
NEXT_PUBLIC_API_KEY=xxx
```

**Important**: Only expose non-sensitive values to the browser

---

### Variable Not Updating

**Error Message**:
Variables appear to be cached or not updating after change

**Cause**: Environment variables are cached at build time

**Solution**:

1. Update variable in Vercel dashboard
2. Trigger new deployment:
   ```bash
   vercel redeploy
   # or
   git commit --allow-empty -m "chore: trigger redeploy"
   git push
   ```

**Prevention**: Understand that env vars are build-time (not runtime)

---

### Wrong Environment Variable Value

**Error Message**:
Production app using staging database URL

**Cause**: Environment variable set with wrong scope

**Solution**:

1. Go to Vercel → Environment Variables
2. Find the variable
3. Check which environments it's applied to
4. Edit to correct scope (Production, Preview, or Development)
5. Redeploy

**Prevention**: Double-check environment scope when adding variables

## Runtime Errors

### 500 Internal Server Error

**Error Message**:

```
500 Internal Server Error
```

**Cause**: Unhandled exception in API route or server component

**Solution**:

1. Check Sentry for error details:
   `https://sentry.io/organizations/{org}/issues/`

2. View Vercel function logs:
   `https://vercel.com/{team}/rent-villa/logs`

3. Fix the error in code
4. Deploy fix

**Prevention**: Add error boundaries and try-catch blocks

---

### API Route Not Found

**Error Message**:

```
404 Not Found
GET /api/users
```

**Cause**: API route not created or incorrect file structure

**Solution**:
Check file structure:

```
src/app/api/users/
  route.ts  ✅ Correct

src/api/users.ts  ❌ Wrong location
```

API routes must be in `src/app/api/{route}/route.ts`

**Prevention**: Follow Next.js App Router conventions

---

### Hydration Mismatch

**Error Message**:

```
Error: Hydration failed because the initial UI does not match what was rendered on the server
```

**Cause**: Server-rendered HTML doesn't match client-rendered HTML

**Solution**:

1. Avoid rendering different content on server vs client
2. Use `useEffect` for client-only code
3. Use `<Suspense>` for dynamic content

```typescript
// Before (causes hydration error):
<div>{Math.random()}</div>

// After (fixed):
const [random, setRandom] = useState(0)
useEffect(() => setRandom(Math.random()), [])
<div>{random}</div>
```

**Prevention**: Ensure consistent rendering server/client

## Performance Issues

### Slow Page Load

**Symptom**: Pages taking >3 seconds to load

**Diagnosis**:

1. Open Chrome DevTools → Network tab
2. Identify slow requests
3. Check Vercel Analytics for slow API routes

**Solutions**:

- Enable caching for static assets
- Optimize images (use Next.js `<Image>` component)
- Implement code splitting
- Add database indexes
- Use CDN for assets

---

### High Memory Usage

**Symptom**: Vercel function running out of memory

**Diagnosis**:
Check function logs in Vercel dashboard

**Solutions**:

```typescript
// Stream large responses instead of buffering
export async function GET(request: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      // Stream data in chunks
    },
  })
  return new Response(stream)
}
```

**Prevention**: Process data in chunks, avoid loading everything into memory

---

### Database Connection Slow

**Symptom**: Database queries taking >1 second

**Diagnosis**:

1. Check database location (should be same region as Vercel functions)
2. Review query complexity
3. Check for missing indexes

**Solutions**:

- Add indexes to frequently queried columns
- Use connection pooling
- Cache frequently accessed data
- Optimize complex queries

## Authentication and Authorization

### Unauthorized Access

**Error Message**:

```
401 Unauthorized
```

**Cause**: Missing or invalid authentication token

**Solution**:

1. Check if user is logged in
2. Verify token is being sent in request headers
3. Check token expiration
4. Validate token format

**Prevention**: Implement proper authentication middleware

---

### Session Expired

**Error Message**:

```
Session expired, please login again
```

**Cause**: Session token expired

**Solution**:

1. Implement token refresh logic
2. Redirect user to login page
3. Clear expired session data

**Prevention**: Set appropriate session timeout, implement refresh tokens

## Getting Help

If you can't resolve an issue using this guide:

1. **Check existing documentation**
   - [CI/CD Overview](./ci-cd-overview.md)
   - [Deployment Runbook](./deployment-runbook.md)
   - [Rollback Procedures](./rollback-procedures.md)

2. **Search for similar issues**
   - Check GitHub Issues
   - Search Sentry for similar errors
   - Review Vercel deployment logs

3. **Ask for help**
   - Post in team Slack channel
   - Tag @tech-lead for urgent issues
   - Create incident ticket for production issues

4. **External resources**
   - [Next.js Documentation](https://nextjs.org/docs)
   - [Vercel Documentation](https://vercel.com/docs)
   - [Drizzle ORM Docs](https://orm.drizzle.team/docs)
   - [Playwright Docs](https://playwright.dev/docs/intro)

## Common Quick Fixes

| Problem                      | Quick Fix                                           |
| ---------------------------- | --------------------------------------------------- |
| CI failing                   | Run `npm run format && npm run lint -- --fix`       |
| Build failing locally        | Delete `.next` folder, run `npm run build`          |
| Tests failing                | Delete `node_modules`, run `npm install`            |
| Environment variable missing | Add to Vercel dashboard, redeploy                   |
| Deployment slow              | Check Vercel status page for incidents              |
| Database connection error    | Verify `DATABASE_URL` is set correctly              |
| 500 error in production      | Check Sentry for stack trace                        |
| Rollback needed              | Use Vercel dashboard to promote previous deployment |

## Debugging Tools

### Local Development

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for lint errors
npm run lint

# Run tests
npm test

# Build locally
npm run build

# Check bundle size
npm run build -- --analyze
```

### Production Debugging

```bash
# View production logs
vercel logs --prod

# Pull production environment
vercel env pull .env.production

# Check deployment status
vercel ls --prod

# Inspect deployment
vercel inspect <deployment-url>
```

### Database Debugging

```bash
# Open database studio
npm run db:studio

# Generate migration
npx drizzle-kit generate:pg

# Push schema to database
npm run db:push

# View migration status
npx drizzle-kit studio
```

## Related Documentation

- [CI/CD Overview](./ci-cd-overview.md) - Pipeline architecture
- [Deployment Runbook](./deployment-runbook.md) - Deployment procedures
- [Rollback Procedures](./rollback-procedures.md) - How to rollback
- [Environment Variables](./environment-variables.md) - Variable reference
- [Incident Response](./incident-response.md) - Production incidents
