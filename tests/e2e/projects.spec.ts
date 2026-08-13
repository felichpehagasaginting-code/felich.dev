import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test('projects page renders', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#main-content h1')).toBeVisible();
  });

  test('displays project cards', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    const projectCards = page.locator('[class*="rounded-"]').first();
    await expect(projectCards).toBeVisible();
  });
});
