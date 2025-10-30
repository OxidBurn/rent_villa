# E2E Testing Guide

End-to-end (E2E) tests validate complete user journeys in real browser environments, catching integration issues that unit tests cannot detect.

## Running Tests Locally

### Run all E2E tests
```bash
npm run test:e2e
```

### Run in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Debug specific test
```bash
npm run test:e2e:debug
```

### View last test report
```bash
npm run test:e2e:report
```

## Writing Tests

### Test Structure

Tests are organized by page or feature:
- One spec file per page/feature
- Use descriptive test names
- Group related tests with `test.describe()`

Example test structure:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should perform specific action', async ({ page }) => {
    await page.goto('/path')

    await expect(page.getByRole('heading')).toBeVisible()
  })
})
```

### Best Practices

1. **Use semantic selectors**
   - Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
   - Use `data-testid` attributes for complex elements

2. **Wait for elements explicitly**
   ```typescript
   await page.getByRole('button').click()
   await expect(page.getByText('Success')).toBeVisible()
   ```

3. **Test user flows, not implementation**
   - Focus on what users see and do
   - Avoid testing internal state or implementation details

4. **Keep tests independent**
   - No shared state between tests
   - Each test should clean up after itself

### Locator Strategies

Playwright recommends this priority for locators:

1. **Role-based** (most robust):
   ```typescript
   page.getByRole('button', { name: 'Submit' })
   page.getByRole('heading', { level: 1 })
   ```

2. **Label-based** (for forms):
   ```typescript
   page.getByLabel('Email address')
   ```

3. **Text-based**:
   ```typescript
   page.getByText('Welcome')
   ```

4. **Test ID** (last resort):
   ```typescript
   page.getByTestId('custom-element')
   ```

### Example Tests

#### Testing a form submission
```typescript
test('should submit booking form', async ({ page }) => {
  await page.goto('/booking')

  await page.getByLabel('Name').fill('John Doe')
  await page.getByLabel('Email').fill('john@example.com')
  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page.getByText('Booking confirmed')).toBeVisible()
})
```

#### Testing navigation
```typescript
test('should navigate to properties page', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Properties' }).click()

  await expect(page).toHaveURL('/properties')
  await expect(page.getByRole('heading', { name: 'Available Properties' })).toBeVisible()
})
```

#### Testing responsive design
```typescript
test('should display mobile menu on small screens', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')

  const menuButton = page.getByRole('button', { name: 'Menu' })
  await expect(menuButton).toBeVisible()
})
```

## Configuration

### Browser Configuration

The `playwright.config.ts` file defines:
- **Test directory**: `./tests/e2e`
- **Base URL**: `http://localhost:3000` (or `BASE_URL` env variable)
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 in CI, 0 locally
- **Web server**: Automatically starts Next.js dev server

### CI Configuration

E2E tests run in CI:
- Only on pull requests (not on direct pushes)
- After all other checks pass (lint, typecheck, test, build)
- Using Chromium only (optimized for speed)
- Test reports uploaded as artifacts

## CI Execution

### When tests run
- Pull requests to `main` branch
- After lint, typecheck, test, and build jobs succeed

### What gets tested
- Chromium browser only (90% of issues)
- All test files in `tests/e2e/**/*.spec.ts`

### Test artifacts
- Test reports available as GitHub Actions artifacts
- Retained for 7 days
- Downloadable from PR checks page

## Troubleshooting

### Test fails locally but passes in CI

**Possible causes:**
- Viewport size differences
- Environment variable differences
- Timing issues

**Solutions:**
```typescript
await page.waitForLoadState('networkidle')
await page.waitForSelector('[data-testid="element"]')
```

### Test is flaky

**Solutions:**
- Add explicit waits instead of relying on auto-waiting
- Use `toBeVisible()` instead of `toHaveCount()`
- Increase timeout for specific actions:
```typescript
await expect(element).toBeVisible({ timeout: 10000 })
```

### Browser not found

**Solution:**
```bash
npx playwright install chromium
```

### Port already in use

If dev server fails to start:
```bash
kill $(lsof -t -i:3000)
```

## Test Organization

```
tests/e2e/
├── README.md              # This file
├── homepage.spec.ts       # Homepage tests
├── navigation.spec.ts     # Navigation tests
└── [feature].spec.ts      # Feature-specific tests
```

## Performance Tips

1. **Reuse contexts** when possible
2. **Run tests in parallel** (configured by default)
3. **Use headed mode** only for debugging
4. **Limit browser projects** in CI (Chromium only)

## Accessibility Testing

Include basic accessibility checks in E2E tests:

```typescript
test('should have proper alt attributes', async ({ page }) => {
  await page.goto('/')

  const images = await page.locator('img').all()
  for (const image of images) {
    const altText = await image.getAttribute('alt')
    expect(altText).toBeTruthy()
  }
})
```

For comprehensive accessibility testing, consider integrating axe-core (future enhancement).

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [CI Integration](https://playwright.dev/docs/ci)
