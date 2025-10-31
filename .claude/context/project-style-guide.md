---
created: 2025-10-30T16:58:19Z
last_updated: 2025-10-30T16:58:19Z
version: 1.0
author: Claude Code PM System
---

# Project Style Guide

## Coding Standards

### General Principles (from CLAUDE.md)

1. **SOLID Principles**
   - Perform SOLID analysis before writing code
   - Single Responsibility: One reason to change
   - Open/Closed: Open for extension, closed for modification
   - Liskov Substitution: Subtypes must be substitutable
   - Interface Segregation: Many specific interfaces over one general
   - Dependency Inversion: Depend on abstractions, not concretions

2. **Self-Documenting Code**
   - ❌ **NO inline comments** in code
   - ✅ Use descriptive variable and function names
   - ✅ Extract complex logic into well-named functions
   - ✅ Let code structure convey intent

## TypeScript Conventions

### Naming Conventions

#### Files

```typescript
MyComponent.tsx
myUtility.ts
useCustomHook.ts
types.ts
constants.ts
PropertyService.ts
```

#### Variables and Functions

```typescript
const propertyList = []
const isPropertyOccupied = true
const MAX_PROPERTIES = 100

function calculateMonthlyRent() {}
function getPropertyById() {}
async function fetchTenantData() {}
```

#### Types and Interfaces

```typescript
type PropertyId = string
type RentAmount = number

interface Property {
  id: PropertyId
  address: string
  rentAmount: RentAmount
}

interface TenantFormData {
  name: string
  email: string
}

interface ApiResponse<T> {
  data: T
  status: number
}
```

#### Classes

```typescript
class PropertyManager {}
class LeaseCalculator {}
class TenantRepository {}
```

### Type Annotations

Always prefer explicit return types for functions:

```typescript
function calculateRent(baseRent: number, utilities: number): number {
  return baseRent + utilities
}

async function fetchProperty(id: string): Promise<Property> {
  const response = await fetch(`/api/properties/${id}`)
  return response.json()
}
```

Use type inference for simple variables:

```typescript
const count = 5
const name = 'John Doe'

const property: Property = {}
```

### Prefer `type` Over `interface`

Use `type` for most cases:

```typescript
type Property = {
  id: string
  address: string
}

type ExtendedProperty = Property & {
  amenities: string[]
}
```

Use `interface` only for:

- React component props (convention)
- When you need declaration merging
- Public API contracts

### Avoid `any` Type

Never use `any` unless absolutely necessary:

```typescript
const data: any = {}

const data: unknown = {}
if (typeof data === 'object') {

}

type ParsedData = { id: string, name: string }
const data = responseData as ParsedData
```

## React Conventions

### Component Structure

#### Server Components (Default)

```typescript
type PropertyListProps = {
  filter?: string
}

async function PropertyList({ filter }: PropertyListProps) {
  const properties = await fetchProperties(filter)

  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
```

#### Client Components

```typescript
'use client'

import { useState } from 'react'

type PropertyFormProps = {
  onSubmit: (data: PropertyData) => void
}

export function PropertyForm({ onSubmit }: PropertyFormProps) {
  const [address, setAddress] = useState('')

  return (
    <form onSubmit={handleSubmit}>

    </form>
  )
}
```

### Component Organization

```typescript


'use client'


type ComponentProps = {

}


const CONSTANT_VALUE = 'value'


function HelperFunction() {}


export function Component({ prop }: ComponentProps) {

  const [state, setState] = useState()


  useEffect(() => {}, [])


  const derivedValue = useMemo(() => {}, [])


  const handleClick = () => {}


  if (loading) return <Loading />


  return <div>...</div>
}
```

### Hooks Conventions

Custom hooks must start with `use`:

```typescript
function usePropertyData(propertyId: string) {
  const [property, setProperty] = useState<Property | null>(null)

  useEffect(() => {
    fetchProperty(propertyId).then(setProperty)
  }, [propertyId])

  return property
}
```

## Next.js Conventions

### File Structure

```
app/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── error.tsx
├── not-found.tsx
├── properties/
│   ├── page.tsx
│   ├── [id]/
│   │   └── page.tsx
│   └── new/
│       └── page.tsx
└── api/
    └── properties/
        └── route.ts
```

### Server vs Client Components

Default to Server Components:

```typescript

async function PropertyPage({ params }: { params: { id: string } }) {
  const property = await fetchProperty(params.id)
  return <PropertyDetails property={property} />
}
```

Use Client Components only when necessary:

```typescript
'use client'


function PropertyForm() {
  const [value, setValue] = useState('')
  return <input value={value} onChange={e => setValue(e.target.value)} />
}
```

### API Routes

```typescript
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const properties = await fetchProperties()
  return NextResponse.json(properties)
}

export async function POST(request: Request) {
  const data = await request.json()
  const property = await createProperty(data)
  return NextResponse.json(property, { status: 201 })
}
```

## Styling Conventions

### Tailwind CSS

Use utility classes directly:

```typescript
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-800">Property Title</h2>
  <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
    View Details
  </button>
</div>
```

Group related utilities:

```typescript
<div className="
  flex items-center justify-between
  p-4
  bg-white rounded-lg shadow-md
">
```

Use `clsx` or `cn` helper for conditional classes:

```typescript
import { clsx } from 'clsx'

<div className={clsx(
  'p-4 rounded',
  isActive && 'bg-blue-500',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
```

## File Organization Patterns

### Feature-Based Structure (Recommended as project grows)

```
src/
├── app/
├── components/
│   ├── PropertyCard.tsx
│   ├── TenantList.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Input.tsx
├── features/
│   ├── properties/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   └── tenants/
│       └── ...
├── lib/
│   ├── api.ts
│   └── utils.ts
├── types/
│   ├── property.ts
│   └── tenant.ts
└── hooks/
    ├── usePropertyData.ts
    └── useAuth.ts
```

## Import Order

```typescript
import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { PropertyCard } from '@/components/PropertyCard'
import { Button } from '@/components/ui/Button'
import { fetchProperties } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Property } from '@/types/property'

import './styles.css'
```

## Error Handling

Always handle errors explicitly:

```typescript
async function fetchPropertyData(id: string): Promise<Property> {
  try {
    const response = await fetch(`/api/properties/${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch property: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      console.error('Property fetch error:', error.message)
    }
    throw error
  }
}
```

## Testing Conventions (Future)

When tests are added, follow these patterns:

```typescript
describe('PropertyCard', () => {
  it('displays property address', () => {})

  it('calls onSelect when clicked', () => {})
})

describe('calculateMonthlyRent', () => {
  it('adds base rent and utilities', () => {
    expect(calculateMonthlyRent(1000, 200)).toBe(1200)
  })
})
```

## Documentation Location

Per CLAUDE.md:

- Store specifications in `./docs/specs/`
- No inline code comments
- README for project overview
- CLAUDE.md for development guidelines
- This file for code style conventions

## Commit Message Style

```bash
feat: add property listing page
fix: resolve tenant search bug
refactor: extract form validation logic
docs: update API documentation
style: format property service
test: add property card tests
chore: update dependencies
```

## Code Review Checklist

Before committing:

- ✅ No `any` types
- ✅ Explicit function return types
- ✅ Self-documenting names
- ✅ No inline comments
- ✅ Proper error handling
- ✅ TypeScript strict mode passes
- ✅ ESLint passes
- ✅ Imports organized
- ✅ Consistent formatting
- ✅ SOLID principles applied
