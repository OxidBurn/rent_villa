# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rent Villa is a rental property management system built with Next.js 16 and React 19.

## Tech Stack

- **Framework**: Next.js 16.0.1 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Linting**: ESLint 9 with Next.js config

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm test         # Run tests (Vitest - to be configured in #4)
```

## Project Structure

```
src/
├── app/                    # App Router directory
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
```

### Path Aliases

- `@/*` → `src/*` (configured in tsconfig.json:22)

## Architecture

### App Router

This project uses Next.js App Router (not Pages Router). Key concepts:

- **File-based Routing**: Routes are defined by folder structure in `src/app/`
- **Layouts**: `layout.tsx` files define shared UI for a route segment
- **Pages**: `page.tsx` files define route UI
- **Server Components**: Components are Server Components by default (use `"use client"` for Client Components)

### Component Types

- **Server Components** (default): Fetch data directly, access backend resources, no useState/useEffect
- **Client Components** (`"use client"`): Use React hooks, handle interactivity, access browser APIs

## CI/CD Pipeline

**Status:** Operational (as of 2025-10-30)

### GitHub Actions CI
- **Workflow:** `.github/workflows/ci.yml`
- **Triggers:** Push to main, all pull requests
- **Jobs:** Lint, Type Check, Test, Build (run in parallel)
- **Runtime:** <5 minutes
- **Badge:** [![CI](https://github.com/OxidBurn/rent_villa/actions/workflows/ci.yml/badge.svg)](https://github.com/OxidBurn/rent_villa/actions/workflows/ci.yml)

### Vercel Deployment
- **Configuration:** `vercel.json`, `.vercelignore`
- **Production:** Auto-deploy on push to `main`
- **Preview:** Unique URL per PR
- **Documentation:** See `docs/deployment.md`

### Pipeline Epic
- **Epic:** [#1 - Complete Development Pipeline Setup](https://github.com/OxidBurn/rent_villa/issues/1)
- **Progress:** 2/10 tasks completed (20%)
- **Completed:**
  - #2: GitHub Actions CI Workflow ✅
  - #3: Vercel Deployment Setup ✅
- **Next:** Testing infrastructure (#4, #5), Database (#6), Code quality (#7)

## Development Guidelines

### SOLID Principles

Before writing code, perform SOLID analysis (as per global CLAUDE.md).

### Code Style

- **No inline comments**: Code should be self-documenting
- Use descriptive variable and function names
- Extract complex logic into well-named functions

### File Organization

- Store specifications and documentation in `./docs/specs/`
