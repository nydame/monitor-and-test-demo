import type { Page, Locator } from '@playwright/test';

export class StorePage {
  readonly page: Page;
  readonly productItems: Locator;
  readonly productLinks: Locator;
  readonly prices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productItems = page.locator(
      'ul.products li.product, .wc-block-grid__product, .product-grid-item, [class*="product-item"]'
    );
    this.productLinks = page.locator(
      'ul.products li.product a, .wc-block-grid__product a, .product-grid-item a'
    );
    this.prices = page.locator('.price, .woocommerce-Price-amount, [class*="price"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/store');
    await this.page.waitForLoadState('domcontentloaded');
  }
}
