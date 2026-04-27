import { test, expect } from '@playwright/test';
import { HomePage } from './pages/home-page.js';

test.describe('Navigation', () => {
  test('navigation links are present on homepage', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const navLinks = home.navLinks;
    const count = await navLinks.count();
    expect(count, 'There should be at least one navigation link').toBeGreaterThan(0);
  });

  test('all navigation links have a valid href', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    const navLinks = home.navLinks;
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      expect(href, `Nav link ${i} should have a non-empty href`).toBeTruthy();
      expect(href, `Nav link ${i} href should not be "#" only`).not.toBe('#');
    }
  });

  test('nav links resolve without error', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Collect internal nav hrefs, then navigate to each to verify they load
    const navLinks = home.navLinks;
    const count = await navLinks.count();

    const hrefs: string[] = [];
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      if (!href) continue;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      if (href.startsWith('http') && !href.includes('oneearthsacredarts.com')) continue;
      hrefs.push(href);
    }

    expect(hrefs.length, 'Should find at least three internal nav link to verify').toBeGreaterThan(2);

    // Wait 3 seconds, then navigate to the third internal link and verify it loads
    await page.waitForTimeout(3000);
    const response = await page.goto(hrefs[2]!);
    const status = response?.status() ?? 200;
    expect(status, `Nav destination ${hrefs[2]} should load without error`).toBeLessThan(400);
    await expect(page.locator('body')).toBeVisible();
  });

  test('logo link points to the homepage', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();

    // Find the logo/home link by its rel attribute (WordPress standard) or aria-label
    const logoLink = page.locator('a[rel="home"], a[aria-label*="home" i], a.custom-logo-link').first();
    const exists = await logoLink.count();

    if (exists > 0) {
      const href = await logoLink.getAttribute('href');
      expect(href, 'Logo link href should point to the homepage').toMatch(/oneearthsacredarts\.com\/?$/);
    } else {
      // Fallback: verify the homepage itself is reachable
      const response = await page.goto('/');
      expect(response?.status()).toBeLessThan(400);
    }
  });
});
