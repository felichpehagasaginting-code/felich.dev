import { test, expect, type Page } from '@playwright/test';

test('homepage has title and hero text', async ({ page }: { page: Page }) => {
  await page.goto('/');

  // Check title
  await expect(page).toHaveTitle(/Felich/);

  // Check hero section
  const hero = page.locator('h1');
  await expect(hero).toContainText('Felich');
});

test('navigation works', async ({ page }: { page: Page }) => {
  await page.goto('/');
  
  // Click about link in sidebar/mobile nav
  // Depending on screen size, one might be visible
  const aboutLink = page.getByRole('link', { name: 'About' }).first();
  await aboutLink.click();

  await expect(page).toHaveURL(/\/about/);
  await expect(page.locator('h1')).toContainText('About');
});
