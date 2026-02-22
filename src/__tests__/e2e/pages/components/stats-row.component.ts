import { Locator, Page } from '@playwright/test';

export class StatsRowComponent {
  readonly total: Locator;
  readonly new: Locator;
  readonly shortlisted: Locator;
  readonly rejected: Locator;

  constructor(page: Page) {
    this.total = page.getByTestId('stats-total');
    this.new = page.getByTestId('stats-new');
    this.shortlisted = page.getByTestId('stats-shortlisted');
    this.rejected = page.getByTestId('stats-rejected');
  }
}
