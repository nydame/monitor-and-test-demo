import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home-page.js';

test.describe('Uptime & Page Loads', () => {
  test('homepage loads successfully', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    await expect(page).toHaveTitle(/.+/, { timeout: 15_000 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('homepage has visible content (not blank)', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // At least one heading or paragraph should be visible
    await expect(page.locator('h1, h2, p').first(), 'Page should have visible text content').toBeVisible({ timeout: 10_000 });
  });

  test('page does not show an error status', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status(), 'Homepage should not return an error status').toBeLessThan(400);
  });

  test('/about page loads', async ({ page }) => {
    const response = await page.goto('/about');
    // Allow redirect (3xx) or success (2xx); just not server/client errors
    const status = response?.status() ?? 200;
    expect(status, '/about should load without error').toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });

  test('/contact page loads', async ({ page }) => {
    const response = await page.goto('/contact');
    const status = response?.status() ?? 200;
    expect(status, '/contact should load without error').toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });
});
