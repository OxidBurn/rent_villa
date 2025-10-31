# Code Style Guide

This document defines the code style standards for the Rent Villa project.

## Overview

We use automated tooling to enforce consistent code style:

- **Prettier**: Opinionated code formatter
- **ESLint**: Code quality and style linting
- **TypeScript**: Static type checking

## Quick Start

```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

## Prettier Configuration

### Rules

- **Semi**: No semicolons
- **Quotes**: Single quotes for strings, double quotes for JSX
- **Tab Width**: 2 spaces
- **Trailing Comma**: ES5 style (objects, arrays)
- **Print Width**: 100 characters
- **Arrow Parens**: Always include parentheses
- **End of Line**: LF (Unix style)
- **Bracket Spacing**: Include spaces in object literals

### Import Sorting

Imports are automatically sorted by Prettier plugin:

1. React imports
2. Next.js imports
3. Third-party libraries
4. Local aliases (@/\*)
5. Relative imports

Example:

```typescript
import { useState } from 'react'

import type { Metadata } from 'next'
import Link from 'next/link'

import { SomeLibrary } from 'some-library'

import { db } from '@/db/client'
import { users } from '@/db/schema'

import { formatDate } from './utils'
```

## ESLint Rules

### Core JavaScript/TypeScript Rules

#### No Console (Warning)

```typescript
// ❌ Avoid
console.log('Debug message')

// ✅ Allowed
console.warn('Warning message')
console.error('Error message')
```

#### Prefer Const (Error)

```typescript
// ❌ Avoid
let count = 5
count = 10

// ✅ Prefer
const count = 5
```

#### No Var (Error)

```typescript
// ❌ Avoid
var name = 'John'

// ✅ Prefer
const name = 'John'
let age = 30
```

#### Object Shorthand (Error)

```typescript
// ❌ Avoid
const user = {
  name: name,
  age: age,
}

// ✅ Prefer
const user = {
  name,
  age,
}
```

#### Quote Props (Error)

```typescript
// ❌ Avoid
const obj = {
  'name': 'John',
  'age': 30,
}

// ✅ Prefer
const obj = {
  name: 'John',
  age: 30,
  'some-key': 'value', // Only quote when necessary
}
```

### TypeScript Rules

#### No Unused Vars (Error)

```typescript
// ❌ Avoid
const unusedVar = 5
function example(unusedParam: string) {}

// ✅ Prefer
const _unusedVar = 5 // Prefix with _ to indicate intentionally unused
function example(_unusedParam: string) {} // Prefix with _ for unused parameters
```

#### Consistent Type Imports (Error)

```typescript
// ❌ Avoid
import { User } from '@/db/schema'

// ✅ Prefer
import type { User } from '@/db/schema'
```

#### No Explicit Any (Warning)

```typescript
// ⚠️ Warning (use when necessary, but avoid when possible)
function processData(data: any) {
  return data
}

// ✅ Prefer
function processData<T>(data: T): T {
  return data
}
```

## Code Organization

### File Structure

```
src/
├── app/                  # Next.js App Router
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Pages
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── features/       # Feature-specific components
├── lib/                # Utility functions
├── db/                 # Database layer
│   ├── schema/         # Database schemas
│   ├── queries/        # Query functions
│   └── client.ts       # Database client
└── types/              # TypeScript type definitions
```

### Naming Conventions

#### Files

- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Utilities**: kebab-case (e.g., `format-date.ts`)
- **Types**: kebab-case (e.g., `user-types.ts`)
- **Tests**: Same as source with `.test.tsx` or `.spec.ts`

#### Variables and Functions

```typescript
// ✅ Variables: camelCase
const userName = 'John'
const isActive = true

// ✅ Functions: camelCase
function getUserName() {}
const formatDate = (date: Date) => {}

// ✅ Components: PascalCase
function UserProfile() {}
const Button = () => {}

// ✅ Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3
const API_BASE_URL = 'https://api.example.com'

// ✅ Types/Interfaces: PascalCase
type User = {}
interface UserProfile {}
```

## TypeScript Best Practices

### Type Safety

```typescript
// ✅ Prefer explicit return types for exported functions
export function getUser(id: string): Promise<User | null> {
  return db.query.users.findFirst({ where: eq(users.id, id) })
}

// ✅ Use type inference for simple cases
const count = 5 // Type inferred as number
const users = await getUsers() // Type inferred from function
```

### Type vs Interface

```typescript
// ✅ Use type for primitives, unions, intersections
type ID = string | number
type Status = 'pending' | 'active' | 'inactive'
type UserWithRole = User & { role: Role }

// ✅ Use interface for object shapes
interface User {
  id: string
  name: string
  email: string
}
```

## React Best Practices

### Component Structure

```typescript
// ✅ Server Component (default in Next.js App Router)
export default function PropertyList() {
  const properties = await getProperties()

  return (
    <div>
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}

// ✅ Client Component (when needed)
'use client'

import { useState } from 'react'

export function InteractiveButton() {
  const [count, setCount] = useState(0)

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
```

### Props

```typescript
// ✅ Define prop types inline for simple components
export function Button({ label, onClick }: { label: string; onClick: () => void }) {
  return <button onClick={onClick}>{label}</button>
}

// ✅ Extract prop types for complex components
interface PropertyCardProps {
  property: Property
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  variant?: 'default' | 'compact'
}

export function PropertyCard({ property, onEdit, onDelete, variant = 'default' }: PropertyCardProps) {
  return <div>{/* ... */}</div>
}
```

## CSS and Styling

### Tailwind CSS

```typescript
// ✅ Use Tailwind utility classes
<div className="flex items-center justify-between p-4 rounded-lg shadow-md">
  <h2 className="text-xl font-bold">Title</h2>
</div>

// ✅ Group related utilities
<button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
  Click Me
</button>
```

### Class Ordering

Follow Tailwind's recommended class ordering:

1. Layout (display, position, top, left, etc.)
2. Spacing (margin, padding)
3. Sizing (width, height)
4. Typography (font, text)
5. Visual (background, border)
6. Effects (shadow, opacity)
7. Interactivity (cursor, user-select)

## Git Commit Messages

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, tooling changes

### Examples

```bash
feat(auth): add user login functionality

fix(database): resolve connection pool timeout issue

docs(readme): update installation instructions

refactor(components): extract reusable Button component
```

## Editor Setup

### VS Code

The project includes recommended VS Code settings in `.vscode/settings.json`:

- Format on save enabled
- Prettier as default formatter
- ESLint auto-fix on save
- TypeScript workspace version

Recommended extensions (`.vscode/extensions.json`):

- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- Playwright Test for VS Code

### Other Editors

Configure your editor to:

1. Use Prettier for formatting
2. Enable ESLint
3. Use the workspace TypeScript version
4. Format on save

## CI/CD Integration

Code style is enforced in CI:

1. **Format Check**: Prettier validates formatting
2. **Lint**: ESLint checks code quality
3. **Type Check**: TypeScript compiler validates types
4. **Tests**: Unit and E2E tests must pass

All checks must pass before merging to main.

## Common Patterns

### Error Handling

```typescript
// ✅ Use try-catch for async operations
export async function createUser(data: NewUser) {
  try {
    const [user] = await db.insert(users).values(data).returning()
    return { success: true, user }
  } catch (error) {
    console.error('Failed to create user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}
```

### Async/Await

```typescript
// ✅ Use async/await over promises
async function getUserWithProperties(userId: string) {
  const user = await getUser(userId)
  if (!user) return null

  const properties = await getPropertiesByOwner(userId)
  return { user, properties }
}

// ❌ Avoid promise chains when async/await is clearer
function getUserWithProperties(userId: string) {
  return getUser(userId).then((user) => {
    if (!user) return null
    return getPropertiesByOwner(userId).then((properties) => ({ user, properties }))
  })
}
```

### Destructuring

```typescript
// ✅ Use destructuring for objects and arrays
const { name, email } = user
const [first, second, ...rest] = items

// ✅ Use destructuring in function parameters
function createProperty({ name, address, bedrooms }: PropertyInput) {
  // ...
}
```

## Resources

- [Prettier Options](https://prettier.io/docs/en/options.html)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Next.js Best Practices](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
