import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should load homepage at root path', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should handle page reload without errors', async ({ page }) => {
    await page.goto('/')

    await page.reload()

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('should maintain responsive layout', async ({ page }) => {
    await page.goto('/')

    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
