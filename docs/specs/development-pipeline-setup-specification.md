# Development Pipeline Setup Specification

> **Purpose**: Reproducible specification for setting up a complete CI/CD pipeline for Next.js projects using GitHub Actions and Vercel.
>
> **Target Audience**: Claude Code, development teams setting up new projects
>
> **Last Updated**: 2025-10-31
>
> **Version**: 1.0.0

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Tech Stack Decisions](#tech-stack-decisions)
4. [Setup Phases](#setup-phases)
5. [Configuration Files](#configuration-files)
6. [Environment Variables](#environment-variables)
7. [Documentation Structure](#documentation-structure)
8. [Validation & Testing](#validation--testing)
9. [Troubleshooting](#troubleshooting)
10. [Best Practices](#best-practices)

## Overview

This specification defines a production-ready development pipeline that includes:

- **Continuous Integration** (GitHub Actions)
- **Continuous Deployment** (Vercel)
- **Automated Testing** (Vitest + Playwright)
- **Database Management** (Drizzle ORM + Vercel Postgres)
- **Code Quality** (ESLint + Prettier)
- **Error Tracking** (Sentry)
- **Monitoring** (Health checks + Vercel Analytics)
- **Comprehensive Documentation**

### Philosophy

- **Leverage Managed Services**: Use GitHub Actions and Vercel to their fullest extent
- **Zero Manual Steps**: Automate everything from commit to production
- **Developer Experience First**: Fast feedback loops, clear error messages
- **Production Ready**: Include monitoring, rollback procedures, incident response
- **Minimal Configuration**: Use platform defaults, avoid custom infrastructure

### Success Criteria

- ✅ PR checks complete in <5 minutes
- ✅ Staging deployment in <10 minutes after merge
- ✅ One-click production promotion
- ✅ Instant rollback capability (<2 minutes)
- ✅ Zero secrets in repository
- ✅ Comprehensive documentation

## Prerequisites

### Required Accounts

1. **GitHub Account**
   - Repository with admin access
   - Actions enabled (free for public repos)

2. **Vercel Account**
   - Team or personal account
   - Connected to GitHub

3. **Sentry Account** (optional but recommended)
   - Organization created
   - Project for error tracking

4. **Database Provider**
   - Vercel Postgres (recommended)
   - Or any PostgreSQL-compatible database

### Required Tools (Local Development)

```bash
# Node.js 20+ LTS
node --version  # Should be v20.x.x or higher

# npm (comes with Node.js)
npm --version

# Git
git --version

# GitHub CLI (recommended)
gh --version
```

### Repository Setup

```bash
# Initialize Next.js project (if starting fresh)
npx create-next-app@latest project-name --typescript --tailwind --app --no-src-dir

# Navigate to project
cd project-name

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
gh repo create project-name --public --source=. --push
```

## Tech Stack Decisions

### Core Framework

- **Next.js 16+** with App Router
- **React 19+**
- **TypeScript 5+**
- **Tailwind CSS 4+**

### Testing

| Tool                | Purpose                  | Why?                                           |
| ------------------- | ------------------------ | ---------------------------------------------- |
| **Vitest**          | Unit & integration tests | Faster than Jest, better DX, native TypeScript |
| **Playwright**      | E2E tests                | Cross-browser, reliable, excellent debugging   |
| **Testing Library** | React component testing  | Industry standard, promotes best practices     |

### Database

| Tool                | Purpose             | Why?                                            |
| ------------------- | ------------------- | ----------------------------------------------- |
| **PostgreSQL**      | Relational database | Robust, widely supported, excellent ecosystem   |
| **Drizzle ORM**     | Database ORM        | Lightweight, TypeScript-first, great DX         |
| **Vercel Postgres** | Hosting             | Seamless Vercel integration, connection pooling |

### Code Quality

| Tool           | Purpose         | Why?                                  |
| -------------- | --------------- | ------------------------------------- |
| **ESLint 9**   | Code linting    | Industry standard, extensive rules    |
| **Prettier**   | Code formatting | Opinionated, eliminates style debates |
| **TypeScript** | Type checking   | Catch errors at compile time          |

### CI/CD

| Tool               | Purpose             | Why?                                          |
| ------------------ | ------------------- | --------------------------------------------- |
| **GitHub Actions** | CI pipeline         | Free for public repos, integrated with GitHub |
| **Vercel**         | Deployment platform | Zero-config Next.js, preview environments     |

### Monitoring

| Tool                 | Purpose                | Why?                              |
| -------------------- | ---------------------- | --------------------------------- |
| **Sentry**           | Error tracking         | Generous free tier, excellent DX  |
| **Vercel Analytics** | Performance monitoring | Included with Vercel, zero config |

## Setup Phases

Follow these phases in order. Each phase builds on the previous one.

### Phase 1: Core Pipeline (Week 1)

**Goal**: Get basic CI/CD working

#### Tasks

1. **GitHub Actions CI Workflow**
2. **Vercel Deployment Setup**

**Deliverables**:

- CI runs on every push/PR
- Automatic deployments to Vercel
- Preview environments for PRs

### Phase 2: Testing Infrastructure (Week 2)

**Goal**: Automated testing in CI

#### Tasks

3. **Vitest Test Infrastructure**
4. **Playwright E2E Testing**

**Deliverables**:

- Unit tests running in CI
- E2E tests on PR to main
- Test coverage reporting

### Phase 3: Database & Quality (Week 3)

**Goal**: Database migrations and code quality

#### Tasks

5. **Database & Migration Setup**
6. **Code Quality Tooling**

**Deliverables**:

- Database migrations automated
- Prettier and enhanced ESLint rules
- Automatic code formatting checks

### Phase 4: Production Readiness (Week 4)

**Goal**: Monitoring, documentation, production deployment

#### Tasks

7. **Sentry Error Tracking**
8. **Health Check & Monitoring**
9. **Documentation & Runbooks**
10. **Production Deployment & Validation**

**Deliverables**:

- Error tracking configured
- Health check endpoints
- Complete documentation
- Production deployment validated

## Configuration Files

### 1. GitHub Actions CI Workflow

**File**: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  format:
    name: Format Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Check formatting
        run: npm run format:check

  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

  typecheck:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run TypeScript compiler
        run: npx tsc --noEmit

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-output
          path: .next
          retention-days: 7

  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [format, lint, typecheck, test, build]
    if: github.event_name == 'pull_request'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run Playwright tests
        run: npx playwright test --project=chromium

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

**Key Features**:

- Parallel job execution (format, lint, typecheck, test, build)
- E2E tests only on PRs (saves time)
- Artifact uploads for debugging
- Uses npm ci for reproducible builds
- Caches npm dependencies

### 2. Package.json Scripts

**File**: `package.json`

Add these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:report": "playwright show-report",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx src/db/seed.ts",
    "db:migrate:run": "tsx src/db/migrate.ts"
  }
}
```

### 3. Dependencies

**Required Dependencies**:

```json
{
  "dependencies": {
    "@sentry/nextjs": "^10.22.0",
    "drizzle-orm": "^0.44.7",
    "next": "16.0.1",
    "postgres": "^3.4.7",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  },
  "devDependencies": {
    "@playwright/test": "^1.56.1",
    "@tailwindcss/postcss": "^4",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@trivago/prettier-plugin-sort-imports": "^5.2.2",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^5.1.0",
    "drizzle-kit": "^0.31.6",
    "eslint": "^9",
    "eslint-config-next": "16.0.1",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.4",
    "jsdom": "^27.0.1",
    "prettier": "^3.6.2",
    "tailwindcss": "^4",
    "tsx": "^4.20.6",
    "typescript": "^5",
    "vitest": "^3.2.4"
  }
}
```

**Installation**:

```bash
npm install <dependencies>
npm install --save-dev <devDependencies>
```

### 4. Vitest Configuration

**File**: `vitest.config.ts`

```typescript
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/tests/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '.next/',
        '**/*.config.{ts,js}',
        '**/types.ts',
        'tests/e2e/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**File**: `vitest.setup.ts`

```typescript
import '@testing-library/jest-dom'
```

### 5. Playwright Configuration

**File**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### 6. Drizzle ORM Configuration

**File**: `drizzle.config.ts`

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/db/schema/*',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
```

### 7. Vercel Configuration

**File**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "ignoreCommand": "git diff --quiet HEAD^ HEAD ./",
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

**File**: `.vercelignore`

```
# Testing
tests/
playwright-report/
coverage/

# Documentation
docs/

# Local environment
.env.local
.env*.local

# Development
*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx
vitest.config.ts
playwright.config.ts
```

### 8. ESLint Configuration

**File**: `eslint.config.mjs`

```javascript
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  js.configs.recommended,
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    ignores: [
      '.next/',
      'node_modules/',
      'out/',
      'dist/',
      'build/',
      'coverage/',
      'playwright-report/',
      '*.config.js',
      '*.config.mjs',
    ],
  },
]

export default eslintConfig
```

### 9. Prettier Configuration

**File**: `.prettierrc`

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "always",
  "endOfLine": "lf",
  "plugins": ["@trivago/prettier-plugin-sort-imports"],
  "importOrder": ["^react", "^next", "<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true
}
```

**File**: `.prettierignore`

```
# Build outputs
.next
out
dist
build

# Dependencies
node_modules

# Logs
*.log

# Coverage
coverage

# Playwright
playwright-report

# Environment
.env*

# Lock files
package-lock.json
yarn.lock
pnpm-lock.yaml
```

### 10. TypeScript Configuration

**File**: `tsconfig.json`

Ensure it includes:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 11. Sentry Configuration

**File**: `sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || 'development',
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

**File**: `sentry.server.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',
  tracesSampleRate: 1.0,
  debug: false,
})
```

**File**: `sentry.edge.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV || 'development',
  tracesSampleRate: 1.0,
  debug: false,
})
```

### 12. Health Check Endpoint

**File**: `src/app/api/health/route.ts`

```typescript
import { NextResponse } from 'next/server'

import { sql } from 'drizzle-orm'

import { db } from '@/db/client'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const startTime = Date.now()

  try {
    await db.execute(sql`SELECT 1`)

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      responseTime: `${Date.now() - startTime}ms`,
      environment: process.env.VERCEL_ENV || 'development',
      version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    )
  }
}
```

### 13. Database Client

**File**: `src/db/client.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString)

export const db = drizzle(client, { schema })
```

**File**: `src/db/migrate.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const migrationClient = postgres(process.env.DATABASE_URL_MIGRATION!, { max: 1 })
const db = drizzle(migrationClient)

async function runMigrations() {
  console.log('Running migrations...')

  await migrate(db, { migrationsFolder: './src/db/migrations' })

  console.log('Migrations completed successfully')

  await migrationClient.end()
}

runMigrations().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
```

## Environment Variables

### Local Development

**File**: `.env.local` (create this file, DO NOT commit)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DATABASE_URL_MIGRATION="postgresql://user:password@localhost:5432/dbname"

# Sentry
SENTRY_DSN="https://your-dsn@sentry.io/project-id"
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"

# Development
NODE_ENV="development"
```

### Vercel Environment Variables

Configure in Vercel Dashboard → Project → Settings → Environment Variables

#### Required for All Environments

| Variable                 | Value                        | Scope               |
| ------------------------ | ---------------------------- | ------------------- |
| `DATABASE_URL`           | Postgres connection string   | Production, Preview |
| `DATABASE_URL_MIGRATION` | Non-pooled connection string | Production, Preview |
| `SENTRY_DSN`             | Sentry DSN from project      | Production, Preview |
| `NEXT_PUBLIC_SENTRY_DSN` | Same as SENTRY_DSN           | Production, Preview |

#### Auto-Generated by Vercel

| Variable                | Description                               |
| ----------------------- | ----------------------------------------- |
| `VERCEL_ENV`            | `production`, `preview`, or `development` |
| `VERCEL_URL`            | Deployment URL                            |
| `VERCEL_GIT_COMMIT_SHA` | Git commit hash                           |

### Environment Variable Security

**DO**:

- ✅ Use Vercel's environment variable system
- ✅ Use different values for production vs preview
- ✅ Rotate credentials regularly
- ✅ Use least-privilege access
- ✅ Keep `.env.local` in `.gitignore`

**DON'T**:

- ❌ Commit `.env.local` to git
- ❌ Share credentials in chat/email
- ❌ Use production credentials in development
- ❌ Log sensitive values
- ❌ Hardcode secrets in code

## Documentation Structure

Create these documentation files in `docs/deployment/`:

### 1. CI/CD Overview

**File**: `docs/deployment/ci-cd-overview.md`

**Contents**:

- Architecture diagrams
- GitHub Actions workflow explanation
- Vercel deployment flow
- Environment descriptions
- Quality gates

### 2. Deployment Runbook

**File**: `docs/deployment/deployment-runbook.md`

**Contents**:

- Pre-deployment checklist
- Step-by-step deployment procedures
- Staging deployment
- Production promotion
- Post-deployment validation
- Smoke testing procedures

### 3. Rollback Procedures

**File**: `docs/deployment/rollback-procedures.md`

**Contents**:

- When to rollback (decision matrix)
- Vercel instant rollback procedure
- Database rollback procedure
- Validation steps
- Communication templates

### 4. Troubleshooting Guide

**File**: `docs/deployment/troubleshooting-guide.md`

**Contents**:

- Common CI failures and solutions
- Vercel build failures
- Database connection issues
- Environment variable problems
- Runtime errors
- Performance issues

### 5. Environment Variables Reference

**File**: `docs/deployment/environment-variables.md`

**Contents**:

- Required variables
- Optional variables
- Vercel auto-generated variables
- Security best practices
- Rotation procedures

### 6. Incident Response

**File**: `docs/deployment/incident-response.md`

**Contents**:

- Severity classification (SEV-1 to SEV-4)
- Incident response team
- 6-phase response process
- Communication templates
- Post-incident review template

### 7. Production Deployment Guide

**File**: `docs/deployment/production-deployment-guide.md`

**Contents**:

- First-time production deployment
- Environment setup
- Validation procedures
- Subsequent deployments
- Maintenance windows

### 8. Production Deployment Checklist

**File**: `docs/deployment/production-deployment-checklist.md`

**Contents**:

- Pre-deployment phase checklist
- Deployment execution checklist
- Validation phase checklist
- Post-deployment checklist

### 9. Team Training Guide

**File**: `docs/deployment/team-training-guide.md`

**Contents**:

- Training modules (6 modules)
- Hands-on exercises
- Deployment scenarios
- Command reference
- Certification requirements

### 10. Deployment Log

**File**: `docs/deployment/deployment-log.md`

**Contents**:

- Deployment entry template
- Production deployment history
- Statistics tracking

## Validation & Testing

### Phase 1 Validation: CI/CD Setup

```bash
# 1. Verify GitHub Actions workflow exists
ls .github/workflows/ci.yml

# 2. Push to GitHub and verify CI runs
git push origin main

# 3. Check CI status
gh run list --limit 1

# 4. Verify Vercel connection
vercel --version
vercel login
vercel link

# 5. Verify deployment
gh run view <run-id>
```

**Expected Results**:

- ✅ CI workflow runs automatically
- ✅ All jobs pass (format, lint, typecheck, test, build)
- ✅ Vercel deploys automatically
- ✅ Preview URL generated

### Phase 2 Validation: Testing

```bash
# 1. Run unit tests locally
npm test

# 2. Check coverage
npm run test:coverage

# 3. Run E2E tests
npm run test:e2e

# 4. Verify tests run in CI
# Create a PR and check CI runs E2E tests
```

**Expected Results**:

- ✅ Unit tests pass
- ✅ E2E tests pass locally
- ✅ E2E tests run in CI on PRs
- ✅ Coverage report generated

### Phase 3 Validation: Database

```bash
# 1. Verify database connection
echo $DATABASE_URL

# 2. Generate migration
npm run db:generate

# 3. Run migration
npm run db:migrate:run

# 4. Open Drizzle Studio
npm run db:studio

# 5. Verify migration in production
# Check Vercel logs after deployment
```

**Expected Results**:

- ✅ Database connection successful
- ✅ Migrations generate correctly
- ✅ Migrations run without errors
- ✅ Schema matches expectations

### Phase 4 Validation: Production Readiness

```bash
# 1. Verify health check endpoint
curl https://your-app.vercel.app/api/health

# 2. Trigger test error in Sentry
# Visit /test-sentry page

# 3. Check Sentry for error
# Open Sentry dashboard

# 4. Verify all documentation exists
ls docs/deployment/

# 5. Run full CI pipeline
git push origin main
```

**Expected Results**:

- ✅ Health check returns 200 OK
- ✅ Sentry captures errors
- ✅ All documentation files present
- ✅ Full CI pipeline passes

## Troubleshooting

### Common Issues

#### Issue: CI Format Check Fails

**Error**: "Code style issues found"

**Solution**:

```bash
# Format all files
npm run format

# Commit and push
git add .
git commit -m "chore: format code with Prettier"
git push
```

#### Issue: TypeScript Errors in CI

**Error**: "TS2345: Argument of type X is not assignable to parameter of type Y"

**Solution**:

```bash
# Run typecheck locally
npx tsc --noEmit

# Fix errors, then commit
git add .
git commit -m "fix: resolve TypeScript errors"
git push
```

#### Issue: Vercel Build Fails

**Error**: "Build failed with exit code 1"

**Solution**:

```bash
# Check Vercel logs
vercel logs <deployment-url>

# Common fixes:
# 1. Missing environment variables
# 2. Build errors (run `npm run build` locally)
# 3. Dependency issues (delete node_modules, run `npm install`)
```

#### Issue: Database Connection Fails

**Error**: "Connection refused" or "Invalid connection string"

**Solution**:

```bash
# Verify environment variable
echo $DATABASE_URL

# Test connection
npm run db:studio

# In Vercel, check:
# 1. Environment variables configured
# 2. Correct scope (Production, Preview, Development)
# 3. Non-pooled connection for migrations
```

#### Issue: E2E Tests Fail in CI

**Error**: "Timeout waiting for <element>"

**Solution**:

```bash
# Run E2E tests locally
npm run test:e2e:debug

# Common fixes:
# 1. Increase timeout in playwright.config.ts
# 2. Add explicit waits
# 3. Check selectors are correct
# 4. Verify dev server starts correctly
```

### Getting Help

1. **Check Documentation**: Review relevant docs in `docs/deployment/`
2. **Check Logs**:
   - GitHub Actions: Click on failed job for logs
   - Vercel: Check deployment logs in dashboard
   - Sentry: Check error details
3. **Verify Configuration**: Compare with specification
4. **Ask Team**: Consult team chat or senior developer

## Best Practices

### Code Quality

1. **Format on Save**: Configure editor to format with Prettier
2. **Run Tests Before Push**: `npm test && npm run test:e2e`
3. **Type Check**: `npx tsc --noEmit`
4. **Lint**: `npm run lint:fix`

### Git Workflow

1. **Branch Naming**:
   - Features: `feature/feature-name`
   - Fixes: `fix/bug-description`
   - Tasks: `task/task-number-description`

2. **Commit Messages**:
   - Format: `type(scope): description`
   - Types: `feat`, `fix`, `docs`, `chore`, `test`, `refactor`
   - Examples:
     - `feat(auth): add login functionality`
     - `fix(api): resolve timeout issue`
     - `docs(deployment): update runbook`

3. **Pull Requests**:
   - Write descriptive titles
   - Include test plan
   - Link related issues
   - Wait for CI to pass
   - Request reviews

### Deployment

1. **Never Push Directly to Main**: Always use PRs
2. **Test in Preview First**: Verify preview deployment before merge
3. **Monitor After Deployment**: Watch logs and Sentry for 15 minutes
4. **Have Rollback Plan**: Know how to rollback before deploying
5. **Deploy During Low Traffic**: Prefer off-peak hours for production

### Security

1. **Rotate Credentials**: Every 90 days minimum
2. **Use Least Privilege**: Only grant necessary permissions
3. **Review Dependencies**: Run `npm audit` regularly
4. **Keep Updated**: Update dependencies monthly
5. **Never Log Secrets**: Use proper logging practices

### Documentation

1. **Update Docs with Code Changes**: Keep docs in sync
2. **Include Examples**: Show concrete examples
3. **Write for Beginners**: Assume minimal knowledge
4. **Keep It Current**: Review and update quarterly

### Monitoring

1. **Check Health Endpoint**: Daily automated checks
2. **Review Sentry**: Weekly error review
3. **Monitor Performance**: Use Vercel Analytics
4. **Set Up Alerts**: Configure alerts for critical errors
5. **Track Metrics**: Monitor deployment frequency, MTTR, error rates

## Checklist for New Projects

Use this checklist when setting up a new project:

### Week 1: Core Pipeline

- [ ] Create Next.js project
- [ ] Initialize git repository
- [ ] Create GitHub repository
- [ ] Set up Vercel account and link repository
- [ ] Create `.github/workflows/ci.yml`
- [ ] Add npm scripts to `package.json`
- [ ] Configure `.prettierrc` and `.prettierignore`
- [ ] Configure `eslint.config.mjs`
- [ ] Create `vercel.json` and `.vercelignore`
- [ ] Push to GitHub and verify CI runs
- [ ] Verify Vercel deployment works
- [ ] Test PR preview environments

### Week 2: Testing

- [ ] Install Vitest and dependencies
- [ ] Create `vitest.config.ts`
- [ ] Create `vitest.setup.ts`
- [ ] Write sample unit test
- [ ] Verify tests run in CI
- [ ] Install Playwright and dependencies
- [ ] Create `playwright.config.ts`
- [ ] Create `tests/e2e/` directory
- [ ] Write sample E2E test
- [ ] Verify E2E tests run in CI on PRs

### Week 3: Database & Quality

- [ ] Create Vercel Postgres database
- [ ] Install Drizzle ORM and dependencies
- [ ] Create `drizzle.config.ts`
- [ ] Create `src/db/` directory structure
- [ ] Create database client (`src/db/client.ts`)
- [ ] Create migration script (`src/db/migrate.ts`)
- [ ] Create sample schema
- [ ] Generate and run migrations
- [ ] Add database scripts to `package.json`
- [ ] Configure Prettier import sorting
- [ ] Add enhanced ESLint rules

### Week 4: Production Readiness

- [ ] Create Sentry account and project
- [ ] Install Sentry SDK
- [ ] Create Sentry config files (client, server, edge)
- [ ] Configure Sentry environment variables
- [ ] Test error tracking
- [ ] Create health check endpoint (`/api/health`)
- [ ] Test health endpoint locally
- [ ] Create `docs/deployment/` directory
- [ ] Write all documentation files (10 files)
- [ ] Update README with documentation links
- [ ] Perform first production deployment
- [ ] Validate production deployment
- [ ] Test rollback procedure
- [ ] Train team on deployment process

### Post-Setup

- [ ] Schedule weekly error review
- [ ] Set up automated health checks
- [ ] Configure alerts for critical errors
- [ ] Plan first post-incident review
- [ ] Schedule quarterly documentation review
- [ ] Set up dependency update schedule

## Success Metrics

Track these metrics to measure pipeline effectiveness:

### Performance Metrics

- **CI Duration**: Target <5 minutes (90th percentile)
- **Deployment Duration**: Target <10 minutes (staging), <8 minutes (production)
- **Rollback Time**: Target <2 minutes
- **Test Coverage**: Target >70% for critical paths

### Quality Metrics

- **Failed Deployments**: Target <5% failure rate
- **Rollback Frequency**: Target <1% of deployments
- **Error Rate**: Target <1% of requests
- **Mean Time to Recovery (MTTR)**: Target <15 minutes for critical issues

### Developer Experience Metrics

- **Time to First Deployment**: Target <1 day for new developers
- **Developer Satisfaction**: Target >4.5/5
- **Documentation Coverage**: Target 80% of common scenarios
- **Onboarding Time**: Target <4 hours

## Conclusion

This specification provides a complete, production-ready development pipeline setup. Follow the phases in order, validate each step, and maintain the documentation as the project evolves.

### Key Takeaways

1. **Leverage Managed Services**: GitHub Actions and Vercel do most of the heavy lifting
2. **Automate Everything**: Zero manual steps from commit to production
3. **Document Comprehensively**: Docs are as important as code
4. **Monitor Proactively**: Set up monitoring before you need it
5. **Practice Rollbacks**: Test rollback procedures before production incidents

### Next Steps After Setup

1. **Feature Development**: Start building features using the pipeline
2. **Team Training**: Run training sessions on deployment process
3. **Continuous Improvement**: Regularly review and optimize pipeline
4. **Scale Gradually**: Add complexity only when needed
5. **Share Knowledge**: Document learnings and share with team

---

**Specification Version**: 1.0.0
**Last Updated**: 2025-10-31
**Maintained By**: Development Team
**Questions?**: Check `docs/deployment/troubleshooting-guide.md` or ask the team
