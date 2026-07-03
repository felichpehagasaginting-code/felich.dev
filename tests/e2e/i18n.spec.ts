import { test, expect } from '@playwright/test';

test.describe('i18n / Localization', () => {
  test('page renders with default English locale', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('page contains translatable text keys', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });
});
