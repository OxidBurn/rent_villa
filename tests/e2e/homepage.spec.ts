import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Create Next App/)
  })

  test('should display Next.js logo', async ({ page }) => {
    await page.goto('/')

    const logo = page.getByAltText('Next.js logo')
    await expect(logo).toBeVisible()
  })

  test('should display main heading', async ({ page }) => {
    await page.goto('/')

    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    await expect(heading).toHaveText('To get started, edit the page.tsx file.')
  })

  test('should have working external links', async ({ page }) => {
    await page.goto('/')

    const templatesLink = page.getByRole('link', { name: /templates/i })
    await expect(templatesLink).toBeVisible()
    await expect(templatesLink).toHaveAttribute('href', expect.stringContaining('vercel.com/templates'))

    const learningLink = page.getByRole('link', { name: /learning/i })
    await expect(learningLink).toBeVisible()
    await expect(learningLink).toHaveAttribute('href', expect.stringContaining('nextjs.org/learn'))
  })

  test('should display action buttons', async ({ page }) => {
    await page.goto('/')

    const deployButton = page.getByRole('link', { name: /deploy now/i })
    await expect(deployButton).toBeVisible()
    await expect(deployButton).toHaveAttribute('target', '_blank')

    const docsLink = page.getByRole('link', { name: /documentation/i })
    await expect(docsLink).toBeVisible()
    await expect(docsLink).toHaveAttribute('target', '_blank')
  })

  test('should have proper image alt attributes for accessibility', async ({ page }) => {
    await page.goto('/')

    const images = await page.locator('img').all()
    for (const image of images) {
      const altText = await image.getAttribute('alt')
      expect(altText).toBeTruthy()
    }
  })
})
