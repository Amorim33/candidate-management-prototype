import { Locator, Page } from '@playwright/test';
import { SidebarComponent } from './components/sidebar.component';
import { FiltersBarComponent } from './components/filters-bar.component';

export class RejectedPage {
  readonly sidebar: SidebarComponent;
  readonly filtersBar: FiltersBarComponent;
  readonly headerTitle: Locator;
  readonly headerCount: Locator;

  constructor(private page: Page) {
    this.sidebar = new SidebarComponent(page);
    this.filtersBar = new FiltersBarComponent(page);
    this.headerTitle = page.getByTestId('main-header-title');
    this.headerCount = page.getByTestId('main-header-count');
  }

  async goto() {
    await this.page.goto('/live-session/rejected');
    // Wait for candidates to load
    await this.page.waitForFunction(
      () => {
        const badge = document.querySelector('[data-testid="sidebar-badge-rejected"]');
        return badge && badge.textContent !== '0';
      },
      { timeout: 15_000 },
    );
  }

  candidateRow(id: string): Locator {
    return this.page.getByTestId(`candidate-row-${id}`);
  }

  allCandidateNames(): Locator {
    return this.page.getByTestId('candidate-name');
  }
}
