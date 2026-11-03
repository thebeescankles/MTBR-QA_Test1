import { Locator, Page, expect } from '@playwright/test';

export class BookStorePage {
  private readonly searchBox: Locator;
  private readonly resultRows: Locator;

  constructor(private readonly page: Page) {
    this.searchBox = page.locator('#searchBox');
    this.resultRows = page
      .getByRole('table')
      .getByRole('rowgroup')
      .nth(1)
      .getByRole('row');
  }

  async goto(): Promise<void> {
    await this.page.goto('/books');
    await expect(this.resultRows.first()).toBeVisible();
  }

  async search(keyword: string): Promise<void> {
    await this.searchBox.fill(keyword);
  }

  /** Asserts at least one row is listed and every visible row matches the keyword */
  async expectAllRowsMatch(keyword: string): Promise<number> {
    await expect(this.resultRows.first()).toBeVisible();
    const count = await this.resultRows.count();
    expect(count, `expected results for "${keyword}"`).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(this.resultRows.nth(i)).toContainText(keyword);
    }
    return count;
  }

  async expectTitleIncluded(partialTitle: string): Promise<void> {
    await expect(this.resultRows.filter({ hasText: partialTitle })).toHaveCount(1);
  }

  async expectEmptyState(): Promise<void> {
    await expect(this.resultRows).toHaveCount(0);
  }
}