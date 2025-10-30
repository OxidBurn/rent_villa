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

## Development Guidelines

### SOLID Principles

Before writing code, perform SOLID analysis (as per global CLAUDE.md).

### Code Style

- **No inline comments**: Code should be self-documenting
- Use descriptive variable and function names
- Extract complex logic into well-named functions

### File Organization

- Store specifications and documentation in `./docs/specs/`
