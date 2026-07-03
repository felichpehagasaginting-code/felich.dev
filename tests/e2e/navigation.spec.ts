import { test, expect } from '@playwright/test';

test.describe('Navigation & Core Pages', () => {
  test('homepage has correct title and hero', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Felich/);
    await expect(page.locator('h1')).toContainText('Felich');
  });

  test('navigation links work correctly', async ({ page }) => {
    await page.goto('/');
    const aboutLink = page.getByRole('link', { name: /About/i }).first();
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about/);

    await page.goto('/');
    const blogLink = page.getByRole('link', { name: /Blog/i }).first();
    await blogLink.click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('loading state renders on navigation', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('skip navigation link is present and functional', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('.skip-nav');
    await expect(skipLink).toBeVisible();
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('page has structured data (JSON-LD)', async ({ page }) => {
    await page.goto('/');
    const jsonld = page.locator('script[type="application/ld+json"]');
    await expect(jsonld).toBeVisible();
    const content = await jsonld.textContent();
    expect(content).toContain('Person');
    expect(content).toContain('Felich');
  });

  test('viewport meta tag is set correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute('content', 'width=device-width, initial-scale=1');
  });
});
