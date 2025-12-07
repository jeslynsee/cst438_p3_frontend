// playwright-tests/top-posts.spec.ts
import { expect, test } from '@playwright/test';

// 1. Basic sanity check – app title on feed
test('home page loads and shows app title', async ({ page }) => {
  await page.goto('/feed');
  await expect(page.getByText('Claws and Paws')).toBeVisible();
});

// 2. App title is still visible after reload
test('app title visible after reload', async ({ page }) => {
  await page.goto('/feed');
  await page.reload();
  await expect(page.getByText('Claws and Paws')).toBeVisible();
});

// 3. App title visible when navigating from root "/" (redirect into feed)
test('root path shows app title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Claws and Paws')).toBeVisible();
});

// 4. App title visible after small scroll
test('app title visible after scrolling', async ({ page }) => {
  await page.goto('/feed');
  await page.mouse.wheel(0, 400);
  await expect(page.getByText('Claws and Paws')).toBeVisible();
});

// 5. App title visible on narrow viewport (mobile-ish)
test('app title visible on narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 400, height: 800 });
  await page.goto('/feed');
  await expect(page.getByText('Claws and Paws')).toBeVisible();
});

// 6. App title visible on wide viewport (desktop-ish)
test('app title visible on wide viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/feed');
  await expect(page.getByText('Claws and Paws')).toBeVisible();
});

// 7. Multiple visits to /feed keep showing app title
test('app title visible after visiting feed twice', async ({ page }) => {
  await page.goto('/feed');
  await page.goto('/feed');
  await expect(page.getByText('Claws and Paws')).toBeVisible();
});

// 8. Visiting feed with query params still shows app title
test('app title visible with query params', async ({ page }) => {
  await page.goto('/feed?from=test');
  await expect(page.getByText('Claws and Paws')).toBeVisible();
});

// 9. App title appears quickly (simple performance-ish check)
test('app title appears within a short time', async ({ page }) => {
  await page.goto('/feed', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Claws and Paws')).toBeVisible({ timeout: 3000 });
});

// 10. Page has some text content including the app title
test('feed page has app title element with correct text', async ({ page }) => {
  await page.goto('/feed');
  const title = page.getByText('Claws and Paws');
  await expect(title).toHaveText('Claws and Paws');
});

