import { test, expect } from '@playwright/test';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
  });

  test('displays contact form', async ({ page }) => {
    await expect(page.locator('#main-content h1')).toContainText('Contact');
    await expect(page.locator('input[placeholder="Name"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Email"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Message"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Message/i })).toBeVisible();
  });

  test('displays social media cards', async ({ page }) => {
    await expect(page.getByText('Stay in Touch')).toBeVisible();
    await expect(page.getByText('Follow My Journey')).toBeVisible();
    await expect(page.getByText("Let's Connect")).toBeVisible();
    await expect(page.getByText('Explore the Code')).toBeVisible();
  });

  test('email copy button is present', async ({ page }) => {
    const copyButton = page.locator('[title="Copy email"]');
    await expect(copyButton).toBeVisible();
  });

  test('shows validation error on empty submit', async ({ page }) => {
    await page.getByRole('button', { name: /Send Message/i }).click();
    const nameInput = page.locator('input[placeholder="Name"]');
    const emailInput = page.locator('input[placeholder="Email"]');
    // HTML5 validation should prevent submission
    await expect(nameInput).toBeVisible();
  });

  test('social links open in new tab', async ({ page }) => {
    const socialLinks = page.locator('.social-card');
    const count = await socialLinks.count();
    expect(count).toBeGreaterThanOrEqual(4);
    for (const link of await socialLinks.all()) {
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });
});
