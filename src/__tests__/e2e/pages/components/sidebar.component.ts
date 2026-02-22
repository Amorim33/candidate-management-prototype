import { Locator, Page } from '@playwright/test';

export class SidebarComponent {
  readonly root: Locator;
  readonly navNew: Locator;
  readonly navShortlisted: Locator;
  readonly navRejected: Locator;
  readonly badgeNew: Locator;
  readonly badgeShortlisted: Locator;
  readonly badgeRejected: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('sidebar');
    this.navNew = page.getByTestId('sidebar-nav-new');
    this.navShortlisted = page.getByTestId('sidebar-nav-shortlisted');
    this.navRejected = page.getByTestId('sidebar-nav-rejected');
    this.badgeNew = page.getByTestId('sidebar-badge-new');
    this.badgeShortlisted = page.getByTestId('sidebar-badge-shortlisted');
    this.badgeRejected = page.getByTestId('sidebar-badge-rejected');
  }

  async goToNew() {
    await this.navNew.click();
  }

  async goToShortlisted() {
    await this.navShortlisted.click();
  }

  async goToRejected() {
    await this.navRejected.click();
  }
}
