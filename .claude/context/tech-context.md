---
created: 2025-10-30T16:58:19Z
last_updated: 2025-10-30T16:58:19Z
version: 1.0
author: Claude Code PM System
---

# Technology Context

## Core Stack

### Framework

- **Next.js:** 16.0.1
  - App Router architecture
  - React Server Components
  - File-based routing
  - Built-in optimization (images, fonts, scripts)

### UI Library

- **React:** 19.2.0
  - Latest stable release
  - Server Components support
  - React Compiler ready
  - Enhanced hooks and concurrent features

- **React DOM:** 19.2.0
  - Hydration improvements
  - Streaming SSR support

### Language

- **TypeScript:** ^5 (latest major version)
  - Strict type checking
  - Path aliases configured (`@/*`)
  - Modern ES2022+ features

### Styling

- **Tailwind CSS:** ^4 (latest major version)
  - Utility-first CSS framework
  - JIT compiler
  - CSS-in-JS alternative

- **PostCSS:** ^4
  - Tailwind CSS processing
  - Configured via `postcss.config.mjs`

### Code Quality

- **ESLint:** ^9
  - Next.js recommended configuration
  - TypeScript integration
  - Custom rules via `eslint.config.mjs`

## Development Tools

### Package Manager

- **npm:** Default (lockfile present)
- Alternative options: yarn, pnpm, bun

### Runtime

- **Node.js:** Requires version compatible with Next.js 16
  - Minimum: Node.js 18.18+
  - Recommended: Node.js 20+

## Configuration Files

### TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Next.js (`next.config.ts`)

- TypeScript configuration file
- Minimal default setup
- Ready for custom webpack, redirects, headers

### ESLint (`eslint.config.mjs`)

- ESM format configuration
- Next.js extended rules
- TypeScript parser integration

## Dependencies Overview

### Production Dependencies (3)

1. **next:** Core framework
2. **react:** UI library
3. **react-dom:** React rendering

### Development Dependencies (7)

1. **typescript:** Language compiler
2. **@types/node:** Node.js type definitions
3. **@types/react:** React type definitions
4. **@types/react-dom:** React DOM type definitions
5. **@tailwindcss/postcss:** Tailwind PostCSS plugin
6. **tailwindcss:** CSS framework
7. **eslint:** Linting tool
8. **eslint-config-next:** Next.js ESLint rules

## Build & Development

### Available Scripts

- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Production build with optimization
- `npm run start` - Serve production build
- `npm run lint` - Run ESLint on codebase

### Development Server

- **Port:** 3000 (default)
- **Hot Reload:** Enabled via Fast Refresh
- **Auto-compilation:** On file save

## Font Optimization

Using `next/font` with Geist font family:

- Automatic font optimization
- Self-hosted fonts
- Zero layout shift
- Configured in `app/layout.tsx`

## Future Technology Considerations

Potential additions as project grows:

- **Database:** PostgreSQL, MySQL, or Prisma ORM
- **Authentication:** NextAuth.js, Clerk, or Auth0
- **State Management:** Zustand, Jotai, or React Context
- **API Client:** TanStack Query (React Query) or SWR
- **Form Handling:** React Hook Form + Zod
- **Testing:** Vitest, Jest, Playwright
- **Deployment:** Vercel, AWS, Docker
