# Environment Variables Reference

**Last Updated:** 2025-10-31
**Owner:** Tech Lead
**Status:** Production Ready

## Table of Contents

- [Overview](#overview)
- [Environment Variable Scopes](#environment-variable-scopes)
- [Required Variables](#required-variables)
- [Optional Variables](#optional-variables)
- [Vercel Auto-Generated Variables](#vercel-auto-generated-variables)
- [Adding/Updating Variables](#addingupdating-variables)
- [Local Development Setup](#local-development-setup)
- [Security Best Practices](#security-best-practices)

## Overview

Environment variables configure the application differently across environments (development, staging, production). This document provides a complete reference of all variables used in Rent Villa.

### Variable Naming Conventions

- **Server-only**: Regular variable names (e.g., `DATABASE_URL`)
- **Client-exposed**: Must be prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_API_URL`)
- **Build-time**: All non-`NEXT_PUBLIC_` variables are only available during build
- **Runtime**: `NEXT_PUBLIC_` variables are available in the browser at runtime

### Environment Variable Sources

| Environment | Source                    | How to Update                             |
| ----------- | ------------------------- | ----------------------------------------- |
| Development | `.env.local` (gitignored) | Edit file locally                         |
| Preview     | Vercel Dashboard          | Vercel → Settings → Environment Variables |
| Production  | Vercel Dashboard          | Vercel → Settings → Environment Variables |

## Environment Variable Scopes

Vercel allows setting variables for specific environments:

- **Development**: Used when running `vercel dev` or `vercel env pull`
- **Preview**: Used for PR preview deployments
- **Production**: Used only for production deployments

**Best Practice**: Set sensitive production variables (like production database URL) only for Production scope.

## Required Variables

These variables **must** be set for the application to function.

### Database

#### `DATABASE_URL`

- **Type**: String (PostgreSQL connection string)
- **Required**: Yes
- **Scope**: Server-only
- **Environments**: All
- **Format**: `postgresql://user:password@host:port/database`
- **Example**: `postgresql://user:pass123@db.vercel.app:5432/rent_villa_prod`
- **Purpose**: Primary database connection for application queries
- **Notes**: Use pooled connection string from Vercel Postgres

#### `DATABASE_URL_MIGRATION`

- **Type**: String (PostgreSQL connection string)
- **Required**: No (falls back to `DATABASE_URL`)
- **Scope**: Server-only
- **Environments**: All
- **Format**: `postgresql://user:password@host:port/database`
- **Purpose**: Non-pooled connection for running migrations
- **Notes**: Required if using connection pooling for `DATABASE_URL`

**How to Get**:

1. Go to Vercel → Storage → Postgres
2. Select your database
3. Copy **"Postgres URL"** (pooled) for `DATABASE_URL`
4. Copy **"Postgres URL (Non-pooled)"** for `DATABASE_URL_MIGRATION`

---

### Error Tracking (Sentry)

#### `SENTRY_DSN`

- **Type**: String (Sentry DSN URL)
- **Required**: Yes (for error tracking)
- **Scope**: Server-only
- **Environments**: Staging, Production
- **Format**: `https://<key>@o<org-id>.ingest.sentry.io/<project-id>`
- **Example**: `https://abc123@o4504000000000.ingest.sentry.io/4504000000000`
- **Purpose**: Server-side error tracking
- **Notes**: Do not set in development (errors logged to console instead)

#### `NEXT_PUBLIC_SENTRY_DSN`

- **Type**: String (Sentry DSN URL)
- **Required**: Yes (for error tracking)
- **Scope**: Client-exposed (browser)
- **Environments**: Staging, Production
- **Format**: Same as `SENTRY_DSN`
- **Purpose**: Client-side error tracking
- **Notes**: Can be the same value as `SENTRY_DSN`

**How to Get**:

1. Create Sentry project at https://sentry.io
2. Go to Settings → Projects → [Your Project] → Client Keys (DSN)
3. Copy DSN value

#### `SENTRY_AUTH_TOKEN`

- **Type**: String (Sentry auth token)
- **Required**: Yes (for source map upload)
- **Scope**: Build-time
- **Environments**: All
- **Format**: 64-character hex string
- **Purpose**: Authenticate source map uploads during build
- **Notes**: Needs `project:releases` scope

**How to Get**:

1. Go to Sentry → Settings → Auth Tokens
2. Click **"Create New Token"**
3. Select scopes: `project:releases`, `project:write`
4. Copy token (shown only once!)

#### `SENTRY_ORG`

- **Type**: String
- **Required**: Yes
- **Scope**: Build-time
- **Environments**: All
- **Format**: Your Sentry organization slug
- **Example**: `rent-villa-team`
- **Purpose**: Identify Sentry organization for source maps

#### `SENTRY_PROJECT`

- **Type**: String
- **Required**: Yes
- **Scope**: Build-time
- **Environments**: All
- **Format**: Your Sentry project slug
- **Example**: `rent-villa-web`
- **Purpose**: Identify Sentry project for source maps

## Optional Variables

These variables enhance functionality but aren't required for basic operation.

### Node.js Configuration

#### `NODE_ENV`

- **Type**: String
- **Required**: No (defaults to `production` on Vercel)
- **Scope**: Server-only
- **Environments**: All
- **Values**: `development` | `production` | `test`
- **Purpose**: Determines Node.js environment mode
- **Notes**: Automatically set by Vercel, rarely needs manual override

#### `NODE_OPTIONS`

- **Type**: String
- **Required**: No
- **Scope**: Build-time
- **Environments**: All
- **Example**: `--max_old_space_size=4096`
- **Purpose**: Pass options to Node.js runtime (e.g., increase memory)
- **Notes**: Useful for large builds that run out of memory

---

### Application Configuration

#### `NEXT_PUBLIC_APP_URL`

- **Type**: String (URL)
- **Required**: No
- **Scope**: Client-exposed
- **Environments**: All
- **Example**: `https://rent-villa.com`
- **Purpose**: Base URL for the application (used for generating links)
- **Notes**: Useful for canonical URLs and social media meta tags

#### `LOG_LEVEL`

- **Type**: String
- **Required**: No (defaults to `info`)
- **Scope**: Server-only
- **Environments**: All
- **Values**: `debug` | `info` | `warn` | `error`
- **Purpose**: Control logging verbosity
- **Example**: `debug` for development, `error` for production

---

### Feature Flags

#### `NEXT_PUBLIC_FEATURE_X_ENABLED`

- **Type**: String
- **Required**: No (defaults to `false`)
- **Scope**: Client-exposed
- **Environments**: Development, Preview
- **Values**: `true` | `false`
- **Purpose**: Enable/disable features in specific environments
- **Example**: `NEXT_PUBLIC_FEATURE_NEW_DASHBOARD_ENABLED=true`
- **Notes**: Prefix feature flags with `NEXT_PUBLIC_FEATURE_` by convention

## Vercel Auto-Generated Variables

Vercel automatically provides these variables. **Do not set them manually**.

### `VERCEL`

- **Type**: String
- **Value**: `"1"`
- **Purpose**: Indicates code is running on Vercel
- **Usage**: `if (process.env.VERCEL) { /* on Vercel */ }`

### `VERCEL_ENV`

- **Type**: String
- **Values**: `"production"` | `"preview"` | `"development"`
- **Purpose**: Identifies deployment environment
- **Usage**: Conditional logic based on environment

### `VERCEL_URL`

- **Type**: String
- **Format**: `{project}-{hash}-{team}.vercel.app`
- **Purpose**: Deployment URL (unique per deployment)
- **Notes**: Automatically set, includes protocol: `https://`

### `VERCEL_DEPLOYMENT_ID`

- **Type**: String
- **Format**: `dpl_{random_id}`
- **Purpose**: Unique ID for each deployment
- **Usage**: Included in health check response for debugging

### `VERCEL_GIT_COMMIT_SHA`

- **Type**: String
- **Format**: Git commit hash (40 characters)
- **Purpose**: Identifies Git commit for deployment
- **Usage**: Useful for debugging which code is deployed

### `VERCEL_GIT_COMMIT_REF`

- **Type**: String
- **Format**: Branch name or tag
- **Purpose**: Git reference that triggered deployment
- **Example**: `main`, `feature/new-dashboard`

## Adding/Updating Variables

### Via Vercel Dashboard

1. Navigate to: `https://vercel.com/{team}/rent-villa/settings/environment-variables`
2. Click **"Add Variable"** or edit existing variable
3. Enter **Key** (variable name)
4. Enter **Value**
5. Select environments: Production, Preview, Development
6. Click **"Save"**
7. **Important**: Redeploy for changes to take effect

### Via Vercel CLI

```bash
# Add a new environment variable
vercel env add DATABASE_URL production

# You'll be prompted to enter the value

# List all environment variables
vercel env ls

# Remove an environment variable
vercel env rm DATABASE_URL production

# Pull variables to local .env file
vercel env pull .env.local
```

### Triggering Redeploy After Variable Change

Environment variables are set at **build time**. After changing a variable, you must redeploy:

**Option 1: Git Push** (recommended)

```bash
git commit --allow-empty -m "chore: trigger redeploy for env var update"
git push
```

**Option 2: Vercel CLI**

```bash
vercel redeploy --prod
```

**Option 3: Vercel Dashboard**

1. Go to Deployments
2. Find latest deployment
3. Click three dots (⋮)
4. Select **"Redeploy"**

## Local Development Setup

### Step 1: Copy Example File

```bash
cp .env.local.example .env.local
```

### Step 2: Get Vercel Environment Variables (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull development environment variables
vercel env pull .env.local
```

This automatically populates `.env.local` with development variables from Vercel.

### Step 3: Manual Configuration (Alternative)

If not using `vercel env pull`, edit `.env.local` manually:

```bash
# Database (local PostgreSQL)
DATABASE_URL="postgresql://user:password@localhost:5432/rent_villa_dev"

# Sentry (optional in development - errors logged to console)
# SENTRY_DSN="https://..."
# NEXT_PUBLIC_SENTRY_DSN="https://..."
```

### Step 4: Verify Configuration

```bash
# Start development server
npm run dev

# Check health endpoint
curl http://localhost:3000/api/health

# Should see database status
```

## Security Best Practices

### 1. Never Commit Secrets to Git

❌ **Bad**:

```bash
# .env (committed to Git)
DATABASE_URL="postgresql://user:pass123@..."
```

✅ **Good**:

```bash
# .env.local (gitignored)
DATABASE_URL="postgresql://user:pass123@..."
```

**Always** add `.env.local` to `.gitignore`.

---

### 2. Use Different Credentials Per Environment

- **Development**: Local or development database
- **Staging**: Staging database (safe to reset)
- **Production**: Production database (real data)

Never use production database in development!

---

### 3. Rotate Secrets Regularly

Rotate sensitive credentials:

- Database passwords: Every 90 days
- API keys: Every 90 days
- Auth tokens: When team members leave

---

### 4. Limit Variable Exposure

Only expose variables to browser if necessary:

❌ **Bad** (exposes secret to browser):

```javascript
NEXT_PUBLIC_DATABASE_URL = 'postgresql://...'
```

✅ **Good** (server-only):

```javascript
DATABASE_URL = 'postgresql://...'
```

---

### 5. Use Vercel Environment Scopes

Set production secrets only for Production scope:

- `DATABASE_URL` (Production): Production database
- `DATABASE_URL` (Preview): Staging database
- `DATABASE_URL` (Development): Local or dev database

This prevents accidental use of production data in preview deploys.

---

### 6. Audit Access

Regularly review who has access to:

- Vercel dashboard
- Sentry organization
- Database credentials

Remove access for former team members immediately.

---

### 7. Monitor for Leaks

- Enable GitHub secret scanning
- Check Sentry for exposed credentials
- Review public source code for accidental commits

## Environment Variable Checklist

Use this checklist when setting up a new environment:

### Development

- [ ] `.env.local` created from `.env.local.example`
- [ ] `DATABASE_URL` set (local PostgreSQL or Vercel dev)
- [ ] Sentry variables **not** set (errors log to console)
- [ ] `.env.local` added to `.gitignore`

### Staging/Preview

- [ ] `DATABASE_URL` set (staging database)
- [ ] `DATABASE_URL_MIGRATION` set (if using pooling)
- [ ] `SENTRY_DSN` set
- [ ] `NEXT_PUBLIC_SENTRY_DSN` set
- [ ] `SENTRY_AUTH_TOKEN` set
- [ ] `SENTRY_ORG` set
- [ ] `SENTRY_PROJECT` set

### Production

- [ ] All staging variables set
- [ ] `DATABASE_URL` points to production database
- [ ] Sentry configured for production environment
- [ ] Variables set with **Production** scope only
- [ ] Credentials rotated from staging

## Troubleshooting

### Variable Not Available

**Issue**: `process.env.MY_VAR` is `undefined`

**Solutions**:

1. Check variable name spelling
2. For browser code, ensure it starts with `NEXT_PUBLIC_`
3. Redeploy after adding variable
4. Check Vercel dashboard shows variable in correct environment

---

### Variable Has Wrong Value

**Issue**: Variable shows old value after update

**Solution**: Redeploy to pick up new value

```bash
git commit --allow-empty -m "chore: redeploy"
git push
```

---

### Variable Works Locally But Not in Vercel

**Issue**: Works in `.env.local` but not in deployed app

**Solution**: Add variable to Vercel dashboard, then redeploy

---

### Database Connection Error

**Issue**: `Error: connect ECONNREFUSED`

**Solutions**:

1. Verify `DATABASE_URL` is set correctly
2. Check database is running (local) or accessible (Vercel)
3. Verify connection string format
4. Check firewall/network settings

## Related Documentation

- [CI/CD Overview](./ci-cd-overview.md) - Pipeline architecture
- [Deployment Runbook](./deployment-runbook.md) - Deployment procedures
- [Troubleshooting Guide](./troubleshooting-guide.md) - Common issues
- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
