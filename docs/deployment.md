# Deployment Guide

## Vercel Deployment

Rent Villa is deployed on Vercel, which provides zero-configuration deployment for Next.js applications.

### Setup

1. **Connect Repository to Vercel**
   - Visit [Vercel Dashboard](https://vercel.com/new)
   - Import the `OxidBurn/rent_villa` GitHub repository
   - Vercel will auto-detect Next.js and configure optimal settings

2. **Build Configuration**
   - **Framework:** Next.js (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`
   - **Node.js Version:** 20.x

3. **Environment Variables**

   Configure in Vercel Dashboard → Settings → Environment Variables:

   **Production:**
   ```
   NODE_ENV=production
   ```

   **Preview & Development:**
   ```
   NODE_ENV=development
   ```

   Future variables (to be added as features are implemented):
   - `DATABASE_URL` - PostgreSQL connection string (from Vercel Postgres)
   - `SENTRY_DSN` - Sentry error tracking DSN
   - `NEXT_PUBLIC_SENTRY_DSN` - Public Sentry DSN for client-side

### Deployment Workflows

#### Production Deployment
- **Trigger:** Push to `main` branch
- **URL:** `https://rent-villa.vercel.app` (or custom domain)
- **Process:**
  1. Vercel detects push to main
  2. Runs CI checks (GitHub Actions)
  3. Builds application
  4. Deploys to production
  5. Automatic rollback if deployment fails

#### Preview Deployment
- **Trigger:** Pull request created or updated
- **URL:** Unique URL per PR (e.g., `rent-villa-git-branch-oxidburn.vercel.app`)
- **Process:**
  1. Vercel detects PR
  2. Builds application from PR branch
  3. Deploys to preview environment
  4. Comments on PR with deployment URL
  5. Preview deleted when PR is closed

### Deployment Protection

**Recommended Settings:**
- ✅ Require CI checks to pass before production deployment
- ✅ Enable deployment notifications (Slack/Discord/Email)
- ✅ Set up custom domain with automatic HTTPS
- ✅ Configure deployment protection rules for production

### Monitoring

Vercel provides built-in monitoring:
- **Analytics:** Real-time traffic and performance metrics
- **Logs:** Function logs and build logs
- **Insights:** Core Web Vitals and performance scores

### Rollback

If a deployment causes issues:

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Find previous stable deployment
   - Click "Promote to Production"

2. **Via Git:**
   ```bash
   git revert HEAD
   git push origin main
   ```

### Custom Domain (Optional)

1. Add domain in Vercel Dashboard → Settings → Domains
2. Configure DNS records as instructed by Vercel
3. Automatic HTTPS with Let's Encrypt
4. Recommended: `rentvilla.com` → production, `staging.rentvilla.com` → preview

### Troubleshooting

**Build Fails:**
- Check build logs in Vercel Dashboard
- Verify all environment variables are set
- Test build locally: `npm run build`

**Deployment Slow:**
- Vercel caches dependencies (npm packages)
- First build is slower, subsequent builds are faster
- Check for large dependencies or files

**Environment Variables Not Working:**
- Ensure variables are set for correct environment (Production/Preview/Development)
- Redeploy after adding new variables
- Client-side variables must be prefixed with `NEXT_PUBLIC_`

## CI/CD Pipeline

### Current Setup

```
Developer → Push/PR → GitHub Actions CI → Vercel CD → Deployed
                           ↓
                    Lint, TypeCheck, Test, Build
```

### Future Enhancements

- Database migrations before deployment
- E2E tests in preview environments
- Performance budgets enforcement
- Automated smoke tests post-deployment

## Deployment Checklist

Before deploying to production:
- [ ] All CI checks pass
- [ ] Code reviewed and approved
- [ ] No known critical bugs
- [ ] Environment variables configured
- [ ] Database migrations ready (when applicable)
- [ ] Sentry configured for error tracking (when applicable)

## Deployment URLs

**Production:** TBD (will be assigned by Vercel)
**Preview:** Generated per PR

Once deployed, update this document with actual URLs.
