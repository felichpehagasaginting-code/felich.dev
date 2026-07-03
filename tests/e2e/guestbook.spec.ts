import { test, expect } from '@playwright/test';

test.describe('Guestbook Page', () => {
  test('guestbook page renders with title', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Guestbook');
  });

  test('shows sign-in prompt for unauthenticated users', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Sign in to leave a message')).toBeVisible();
    await expect(page.getByText('Continue with Google')).toBeVisible();
  });

  test('shows real-time live indicator', async ({ page }) => {
    await page.goto('/guestbook');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Live')).toBeVisible();
  });
});
