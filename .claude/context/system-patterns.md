---
created: 2025-10-30T16:58:19Z
last_updated: 2025-10-30T16:58:19Z
version: 1.0
author: Claude Code PM System
---

# System Patterns

## Architectural Style

### Next.js App Router Architecture

- **Pattern:** Server-first, streaming-capable React architecture
- **Default:** React Server Components (RSC)
- **Client-side:** Explicit `"use client"` directive when needed
- **Rendering:** Hybrid SSR, SSG, and ISR

### Component Architecture

- **Server Components (default):**
  - Direct database access
  - Backend resource fetching
  - Zero client-side JavaScript
  - Cannot use React hooks or browser APIs

- **Client Components (`"use client"`):**
  - Interactive elements
  - useState, useEffect, custom hooks
  - Browser API access
  - Event handlers

## Design Patterns Observed

### 1. File-Based Routing Pattern

```
app/
├── layout.tsx        → Layout wrapper for all routes
├── page.tsx          → Route handler for /
└── [slug]/
    └── page.tsx      → Dynamic route for /[slug]
```

### 2. Layout Pattern

- Root layout in `app/layout.tsx`
- Metadata API for SEO
- Shared UI across routes
- Font optimization with `next/font`

### 3. Styling Pattern

- **Approach:** Utility-first with Tailwind CSS
- **Global Styles:** `app/globals.css` with Tailwind directives
- **Component Styles:** Inline Tailwind classes
- **Custom Styles:** Extend Tailwind config when needed

### 4. Type Safety Pattern

- **Full TypeScript:** All `.tsx` and `.ts` files
- **Type Inference:** Leverage TypeScript compiler
- **Path Aliases:** `@/*` for clean imports
- **Strict Mode:** Enabled in tsconfig.json

## Data Flow Patterns

### Server Component Data Fetching

```typescript
async function ServerComponent() {
  const data = await fetch('https://api.example.com/data')
  return <div>{data}</div>
}
```

### Client Component State Management

```typescript
'use client'
function ClientComponent() {
  const [state, setState] = useState(initialValue)
  return <div onClick={() => setState(newValue)}>{state}</div>
}
```

## Code Organization Principles

### SOLID Principles (per CLAUDE.md)

- **Single Responsibility:** Each component serves one purpose
- **Open/Closed:** Extend via composition, not modification
- **Liskov Substitution:** Consistent component interfaces
- **Interface Segregation:** Small, focused component props
- **Dependency Inversion:** Depend on abstractions, not concretions

### Self-Documenting Code (per CLAUDE.md)

- **No inline comments:** Code should explain itself
- **Descriptive names:** Clear variable and function names
- **Extract complexity:** Move complex logic to named functions
- **Type annotations:** Let types document expectations

## Configuration Patterns

### TypeScript Configuration

- **Module Resolution:** `bundler` (Next.js optimized)
- **JSX:** `preserve` (handled by Next.js)
- **Strict Mode:** Enabled for type safety
- **Path Mapping:** `@/*` for clean imports

### ESLint Configuration

- **Format:** ESM (`.mjs` extension)
- **Extends:** `eslint-config-next`
- **Integration:** TypeScript parser

## Error Handling Patterns

### Next.js Error Boundaries

- `error.tsx` - Component-level error UI
- `global-error.tsx` - Root-level error UI
- `not-found.tsx` - 404 handling

### Loading States

- `loading.tsx` - Automatic loading UI during Suspense

## Deployment Patterns

### Vercel-Optimized

- Zero-config deployment
- Edge functions ready
- Automatic preview deployments
- CDN distribution

## Best Practices Established

1. **Server-first mindset:** Use Server Components by default
2. **Explicit client boundaries:** Only use `"use client"` when necessary
3. **Type everything:** Full TypeScript coverage
4. **Utility-first styling:** Tailwind CSS for rapid development
5. **File-based routing:** Leverage Next.js conventions
6. **Path aliases:** Use `@/*` for clean imports
7. **Self-documenting code:** No inline comments, clear names

## Emerging Patterns

As project grows, consider:

- **Repository Pattern:** Abstract data layer
- **Service Layer:** Business logic separation
- **Hook Pattern:** Custom React hooks for shared logic
- **Provider Pattern:** Context providers for global state
- **HOC Pattern:** Higher-order components for cross-cutting concerns
- **Render Props:** Share component logic flexibly
