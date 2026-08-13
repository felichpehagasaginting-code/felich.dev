import { test, expect } from '@playwright/test';

test.describe('404 Not Found Page', () => {
  test('shows 404 page for unknown routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.locator('#main-content').getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.locator('text=Lost in Space')).toBeVisible();
  });

  test('404 page has back to home link', async ({ page }) => {
    await page.goto('/nonexistent-route');
    const homeLink = page.getByRole('link', { name: /Back to Home/i });
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL('/');
  });

  test('404 page has contact link', async ({ page }) => {
    await page.goto('/nonexistent-route');
    const contactLink = page.getByRole('link', { name: /Contact Me/i });
    await expect(contactLink).toBeVisible();
  });
});
