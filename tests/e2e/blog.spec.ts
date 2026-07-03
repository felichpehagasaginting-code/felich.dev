import { test, expect } from '@playwright/test';

test.describe('Blog Pages', () => {
  test('blog list page renders with posts', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toContainText('Archive');
    const posts = page.locator('h2');
    const count = await posts.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('blog posts link to detail pages', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await expect(firstPostLink).toBeVisible();
  });

  test('blog post detail page loads', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstPostLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('article')).toBeVisible();
    }
  });

  test('blog post has JSON-LD structured data', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstPostLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      const jsonld = page.locator('script[type="application/ld+json"]');
      await expect(jsonld).toBeVisible();
      const content = await jsonld.textContent();
      expect(content).toContain('BlogPosting');
    }
  });

  test('blog post has back to archive link', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    const href = await firstPostLink.getAttribute('href');
    if (href) {
      await page.goto(href);
      await expect(page.getByText('Back to Archive')).toBeVisible();
    }
  });
});
