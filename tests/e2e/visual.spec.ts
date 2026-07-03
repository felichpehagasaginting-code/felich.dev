import { test, expect } from '@playwright/test';

test.describe('Visual Regression (Screenshots)', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('blog page matches snapshot', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('blog-list.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('contact page matches snapshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('contact.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });

  test('404 page matches snapshot', async ({ page }) => {
    await page.goto('/nonexistent-route');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('404.png', {
      maxDiffPixels: 100,
      fullPage: true,
    });
  });
});
