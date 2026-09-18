import { test, expect } from '@playwright/test';

test.describe('Admin Page Guard', () => {
  test('shows login gate when logged out', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('#main-content').getByRole('heading', { name: 'Project Admin' })).toBeVisible();
    await expect(page.locator('#main-content').getByText(/Login dulu untuk mengelola projects/i)).toBeVisible();
    await expect(page.locator('#main-content').getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });

  test('does not expose admin link in public navigation', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /^admin$/i })).toHaveCount(0);
  });

  test('admin list API rejects unauthenticated requests', async ({ request }) => {
    const res = await request.get('/api/admin/projects?all=1');
    // 401 = missing/invalid token, 500 = ADMIN_EMAILS/Admin SDK unconfigured — either way, no data leaks
    expect([401, 500]).toContain(res.status());
    const body = await res.json();
    expect(body.projects).toBeUndefined();
  });

  test('admin create API rejects unauthenticated requests', async ({ request }) => {
    const res = await request.post('/api/admin/projects', {
      data: { title: 'Hacker', description: 'nope' },
    });
    expect([401, 500]).toContain(res.status());
    const body = await res.json();
    expect(body.success).toBeUndefined();
  });
});
