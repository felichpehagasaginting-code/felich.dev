import { test, expect, type Page } from '@playwright/test';

const SCREENSHOT_OPTS = {
  maxDiffPixels: 100,
  fullPage: true,
  animations: 'disabled' as const,
};

// The redesign includes infinite animations (hero typing, counters, pulsing
// dots, Hero3D render loop, Lenis smooth-scroll). Freeze time with Playwright's
// fake clock, disable CSS animations, pause WAAPI animations, and finally pause
// the fake clock itself once one-shot entrances settle — the fake rAF that
// modules captured only fires while the clock advances, so pausing halts every
// rAF-driven loop (three.js render loop, framer-motion, Lenis, etc.).
async function preparePage(page: Page, url: string, mountLazy = false) {
  await page.clock.install();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await page.clock.fastForward('30:00');
  await page.addStyleTag({
    content: [
      '*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}',
      // Floating chrome widgets are not page content; hide them so snapshots
      // stay deterministic (the orb pulses indefinitely and the progress ring
      // tracks scroll position).
      'button[aria-label*="Chat with Felich AI"],button[aria-label*="Back to top"]{visibility:hidden!important}',
      // PulseSync overlay only appears every 10s; hide it so a slow machine
      // can't make the snapshot non-deterministic.
      'div[class*="pointer-events-none"][class*="border-4"]{visibility:hidden!important}',
    ].join(' '),
  });
  // Let one-shot WAAPI entrance animations (AdaptiveBackground 3s fade, page
  // transition, staggered section reveals with up to ~2s of delays) finish in
  // real time before pausing them — pausing mid-flight would freeze each run
  // at a different phase (sub-1% opacity differences still shift every pixel).
  await page.waitForTimeout(5500);
  await page.evaluate(() => {
    document.getAnimations().forEach((a) => a.pause());
  });
  // Mount lazy sections below the fold so layout height settles before capture.
  // Poll until the page actually grows (dynamic chunks may be slow on a cold
  // dev-server compile) instead of relying on a fixed wait.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  if (mountLazy) {
    await page.waitForFunction(
      () => document.body.scrollHeight > window.innerHeight * 1.5,
      undefined,
      { timeout: 15000 }
    );
  }
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  // Let Lenis smooth-scroll (and the Hero3D scroll-lerp) finish easing back to
  // the top before freezing time, so they snap to a deterministic end state.
  await page.waitForTimeout(1600);
  // Freeze the fake clock: rAF callbacks and timers stop firing, so every
  // infinite animation halts in place and screenshots become stable.
  await page.clock.pauseAt(Date.now() + 3600_000);
}

test.describe('Visual Regression (Screenshots)', () => {
  test('homepage matches snapshot', async ({ page }) => {
    await preparePage(page, '/', true);
    await expect(page).toHaveScreenshot('homepage.png', SCREENSHOT_OPTS);
  });

  test('blog page matches snapshot', async ({ page }) => {
    await preparePage(page, '/blog');
    await expect(page).toHaveScreenshot('blog-list.png', SCREENSHOT_OPTS);
  });

  test('contact page matches snapshot', async ({ page }) => {
    await preparePage(page, '/contact');
    await expect(page).toHaveScreenshot('contact.png', SCREENSHOT_OPTS);
  });

  test('404 page matches snapshot', async ({ page }) => {
    await preparePage(page, '/nonexistent-route');
    await expect(page).toHaveScreenshot('404.png', SCREENSHOT_OPTS);
  });
});