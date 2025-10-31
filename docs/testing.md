# Testing Guide

This document describes the testing infrastructure and best practices for the Rent Villa project.

## Testing Stack

- **Test Framework**: [Vitest](https://vitest.dev/) - Fast unit testing framework with native TypeScript support
- **Testing Library**: [@testing-library/react](https://testing-library.com/react) - React component testing utilities
- **DOM Environment**: jsdom - Browser-like environment for Node.js
- **Assertion Library**: Vitest's built-in assertions + jest-dom matchers

## Quick Start

### Running Tests

```bash
npm test              # Run all tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Writing Tests

Test files should be colocated with the code they test and follow the naming convention `*.test.tsx` or `*.spec.tsx`.

Example test structure:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders successfully', () => {
    render(<MyComponent />)
    const element = screen.getByText('Expected text')
    expect(element).toBeInTheDocument()
  })
})
```

## Testing Patterns

### Server Components

Next.js Server Components (default) can be tested like regular React components:

```typescript
import { render, screen } from '@testing-library/react'
import ServerComponent from './ServerComponent'

it('renders server component', () => {
  render(<ServerComponent />)
  expect(screen.getByText('Content')).toBeInTheDocument()
})
```

### Client Components

Client Components (marked with `"use client"`) can include interactivity and hooks:

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClientComponent from './ClientComponent'

it('handles user interaction', async () => {
  const user = userEvent.setup()
  render(<ClientComponent />)

  const button = screen.getByRole('button', { name: /click me/i })
  await user.click(button)

  expect(screen.getByText('Clicked!')).toBeInTheDocument()
})
```

### Testing Next.js Features

#### Next.js Image Component

The Image component can be tested by checking for the rendered img element:

```typescript
it('renders Next.js Image', () => {
  render(<MyComponent />)
  const image = screen.getByAltText('Description')
  expect(image).toBeInTheDocument()
  expect(image).toHaveAttribute('src', expect.stringContaining('image.jpg'))
})
```

#### Next.js Link Component

Test links by checking href attributes:

```typescript
it('renders navigation link', () => {
  render(<MyComponent />)
  const link = screen.getByRole('link', { name: /home/i })
  expect(link).toHaveAttribute('href', '/')
})
```

## Configuration

### vitest.config.ts

The Vitest configuration is located at the project root and includes:

- React plugin for JSX/TSX support
- jsdom environment for DOM APIs
- Path aliases matching tsconfig.json (@/\*)
- Global test utilities (describe, it, expect)
- Coverage configuration

### vitest.setup.ts

Setup file that runs before all tests:

- Imports jest-dom matchers for enhanced assertions
- Can be extended with global test setup/teardown

## Best Practices

### Test Structure

1. **Arrange**: Set up test data and render components
2. **Act**: Perform actions (user interactions, function calls)
3. **Assert**: Verify expected outcomes

### Queries

Prefer queries in this order (most to least preferred):

1. `getByRole` - Accessible queries (most robust)
2. `getByLabelText` - Form elements
3. `getByText` - Non-interactive text content
4. `getByTestId` - Last resort (requires adding test IDs)

### Async Testing

Use `findBy*` queries for elements that appear asynchronously:

```typescript
it('loads data', async () => {
  render(<DataComponent />)
  const data = await screen.findByText('Loaded data')
  expect(data).toBeInTheDocument()
})
```

### Mocking

Mock external dependencies using Vitest's vi utilities:

```typescript
import { vi } from 'vitest'

vi.mock('./api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: 'mock' })),
}))
```

## Coverage

Coverage reports are generated in the `coverage/` directory when running `npm run test:coverage`.

Current coverage thresholds are not enforced but should be monitored as the project grows.

### Coverage Goals

- **Statements**: Aim for 80%+
- **Branches**: Aim for 75%+
- **Functions**: Aim for 80%+
- **Lines**: Aim for 80%+

## CI Integration

Tests run automatically in CI on:

- All pull requests
- Pushes to main branch

The CI workflow will fail if any tests fail, preventing broken code from being merged.

## Troubleshooting

### Path Alias Issues

If path aliases (@/\*) don't resolve in tests, verify:

1. `vitest.config.ts` includes the resolve.alias configuration
2. Paths match those in `tsconfig.json`

### jsdom Limitations

jsdom doesn't support all browser APIs. For missing features:

1. Mock the API in your test
2. Consider using Playwright for E2E tests instead

### Image Loading Errors

Next.js Image components may produce warnings in tests. These can be safely ignored for unit tests as we're testing component logic, not image optimization.

## Next Steps

As the project grows, consider:

1. Adding integration tests for complex workflows
2. Setting up Playwright for E2E testing (see Task #5)
3. Implementing test coverage thresholds
4. Adding visual regression testing for UI components
