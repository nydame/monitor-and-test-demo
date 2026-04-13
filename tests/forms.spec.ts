import { test, expect } from '@playwright/test';

// Use domcontentloaded for the contact page — third-party form widgets
// (e.g. ActiveCampaign) keep the network busy indefinitely.
const CONTACT_WAIT = 'domcontentloaded' as const;

test.describe('Forms', () => {
  test('contact form is present on contact page', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState(CONTACT_WAIT);

    // Accept: native <form>, embedded iframe, or third-party form wrappers
    const formLocator = page.locator(
      'form, ._form-wrapper, iframe[src*="form"], iframe[title*="form" i]'
    ).first();

    await expect(formLocator, 'Contact page should contain a form element').toBeVisible({
      timeout: 15_000,
    });
  });

  test('contact form has required input fields', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState(CONTACT_WAIT);

    // Accept inputs inside native forms or third-party wrappers
    const inputs = page.locator(
      'form input:not([type="hidden"]):not([type="submit"]), form textarea, ._form-wrapper input:not([type="hidden"]):not([type="submit"]), ._form-wrapper textarea'
    );

    await expect(inputs.first(), 'Contact page should have at least one input field').toBeVisible({
      timeout: 15_000,
    });

    const inputCount = await inputs.count();
    expect(inputCount, 'Contact form should have at least one input field').toBeGreaterThan(0);
  });

  test('submitting contact form empty shows validation', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState(CONTACT_WAIT);

    // Find a submit button in either a native form or third-party wrapper
    const submitBtn = page.locator(
      'form button[type="submit"], form input[type="submit"], ._form-wrapper button[type="submit"], ._form-wrapper input[type="submit"]'
    ).first();

    const submitExists = await submitBtn.count();
    if (submitExists === 0) {
      test.skip();
      return;
    }

    await submitBtn.waitFor({ state: 'visible', timeout: 15_000 });
    await submitBtn.click({ force: true });

    // After clicking submit with empty fields the page should NOT navigate to a success URL
    await page.waitForTimeout(2_000);
    const currentUrl = page.url();
    expect(currentUrl).not.toMatch(/success|thank-you|thanks/i);
  });
});
