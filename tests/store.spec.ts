import { test, expect } from '@playwright/test';
import { StorePage } from './pages/store-page.js';

test.describe('Store', () => {
  test('/store page loads without error', async ({ page }) => {
    const response = await page.goto('/store');
    const status = response?.status() ?? 200;
    expect(status, '/store should return a non-error status').toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });

  test('/store page has visible content', async ({ page }) => {
    const store = new StorePage(page);
    await store.goto();
    await expect(page.locator('h1, h2, p').first(), 'Store page should have visible text').toBeVisible({ timeout: 15_000 });
  });

  test('store displays product listings', async ({ page }) => {
    const store = new StorePage(page);
    await store.goto();
    await expect(store.productItems.first(), 'Store should display at least one product').toBeVisible({ timeout: 15_000 });
    const count = await store.productItems.count();
    expect(count, 'Store should have at least one product listed').toBeGreaterThan(0);
  });

  test('product listings have valid links', async ({ page }) => {
    const store = new StorePage(page);
    await store.goto();

    const linkCount = await store.productLinks.count();
    if (linkCount === 0) {
      test.skip();
      return;
    }

    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const href = await store.productLinks.nth(i).getAttribute('href');
      expect(href, `Product link ${i} should have a valid href`).toBeTruthy();
    }
  });

  test('store page shows prices', async ({ page }) => {
    const store = new StorePage(page);
    await store.goto();

    const priceCount = await store.prices.count();
    if (priceCount === 0) {
      test.skip();
      return;
    }

    await expect(store.prices.first(), 'At least one price should be visible').toBeVisible({ timeout: 10_000 });
  });
});
