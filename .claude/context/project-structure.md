---
created: 2025-10-30T16:58:19Z
last_updated: 2025-10-30T16:58:19Z
version: 1.0
author: Claude Code PM System
---

# Project Structure

## Directory Organization

```
rent_villa/
├── .claude/                    # Claude Code configuration
│   ├── context/               # Project context documentation
│   ├── rules/                 # Workflow rules and guidelines
│   └── commands/              # Custom slash commands
├── public/                     # Static assets (images, fonts)
├── src/                        # Source code
│   └── app/                   # Next.js App Router directory
│       ├── layout.tsx         # Root layout component
│       ├── page.tsx           # Home page component
│       ├── globals.css        # Global styles
│       └── favicon.ico        # Application icon
├── .git                        # Git repository metadata
├── .gitignore                 # Git ignore patterns
├── CLAUDE.md                  # Claude Code project instructions
├── README.md                  # Project documentation
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Node.js dependencies and scripts
├── package-lock.json          # Locked dependency versions
├── postcss.config.mjs         # PostCSS configuration (Tailwind)
└── tsconfig.json              # TypeScript configuration
```

## Key Directories

### `/src/app/`

- **Purpose:** Next.js App Router pages and layouts
- **Convention:** File-based routing system
- **Key Files:**
  - `layout.tsx` - Root layout with HTML structure, fonts, metadata
  - `page.tsx` - Home page (landing page)
  - `globals.css` - Global Tailwind directives and custom styles

### `/public/`

- **Purpose:** Static files served directly by Next.js
- **Usage:** Images, fonts, manifests, robots.txt
- **Access:** Files accessible at root URL (e.g., `/favicon.ico`)

### `/.claude/`

- **Purpose:** Claude Code agent configuration
- **Subdirectories:**
  - `context/` - Project state and documentation
  - `rules/` - Workflow automation rules
  - `commands/` - Custom command definitions

## File Naming Patterns

### React Components

- **Layout Components:** `layout.tsx` (reserved Next.js filename)
- **Page Components:** `page.tsx` (reserved Next.js filename)
- **Server Components:** `.tsx` without `"use client"` directive
- **Client Components:** `.tsx` with `"use client"` directive at top

### Configuration Files

- **TypeScript:** `.ts` extension for config files
- **JavaScript:** `.mjs` extension for ESM config files
- **Styles:** `.css` for stylesheets

## Path Aliases

Configured in `tsconfig.json:22`:

- `@/*` → `src/*`

Example usage:

```typescript
import { Component } from '@/components/Component'
```

## Module Organization

Currently flat structure. As project grows, recommend:

```
src/
├── app/                        # App Router pages
├── components/                 # Reusable UI components
├── lib/                        # Utility functions and shared logic
├── types/                      # TypeScript type definitions
├── hooks/                      # Custom React hooks
└── services/                   # API clients and business logic
```

## Build Output

- `.next/` - Next.js build cache (gitignored)
- `out/` - Static export output (if used)
- `node_modules/` - Dependencies (gitignored)
