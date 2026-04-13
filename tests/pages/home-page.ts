import type { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly navLinks: Locator;
  readonly mainHeading: Locator;
  readonly contactForm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLinks = page.locator('nav a, header a');
    this.mainHeading = page.locator('h1').first();
    this.contactForm = page.locator('form').first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async gotoPath(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
  }

  getNavLinkByText(text: string): Locator {
    return this.navLinks.filter({ hasText: text });
  }
}
