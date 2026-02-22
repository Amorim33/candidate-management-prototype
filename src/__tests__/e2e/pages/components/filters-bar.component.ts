import { Locator, Page } from '@playwright/test';

export class FiltersBarComponent {
  readonly root: Locator;
  readonly searchInput: Locator;
  readonly sortSelect: Locator;

  constructor(private page: Page) {
    this.root = page.getByTestId('filters-bar');
    this.searchInput = page.getByTestId('search-input');
    this.sortSelect = page.getByTestId('sort-select');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async clearSearch() {
    await this.searchInput.fill('');
  }

  filterChip(label: string): Locator {
    return this.page.getByTestId(`filter-chip-${label}`);
  }

  async selectFilter(label: string) {
    await this.filterChip(label).click();
  }

  async selectSort(value: 'newest' | 'oldest' | 'name-az') {
    await this.sortSelect.selectOption(value);
  }
}
