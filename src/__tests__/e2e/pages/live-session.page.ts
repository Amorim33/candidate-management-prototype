import { Locator, Page } from '@playwright/test';
import { SidebarComponent } from './components/sidebar.component';
import { DecisionPanelComponent } from './components/decision-panel.component';
import { AddCandidateModalComponent } from './components/add-candidate-modal.component';
import { StatsRowComponent } from './components/stats-row.component';

export class LiveSessionPage {
  readonly sidebar: SidebarComponent;
  readonly decisionPanel: DecisionPanelComponent;
  readonly addCandidateModal: AddCandidateModalComponent;
  readonly statsRow: StatsRowComponent;
  readonly headerTitle: Locator;
  readonly headerCount: Locator;
  readonly addCandidateButton: Locator;

  constructor(private page: Page) {
    this.sidebar = new SidebarComponent(page);
    this.decisionPanel = new DecisionPanelComponent(page);
    this.addCandidateModal = new AddCandidateModalComponent(page);
    this.statsRow = new StatsRowComponent(page);
    this.headerTitle = page.getByTestId('main-header-title');
    this.headerCount = page.getByTestId('main-header-count');
    this.addCandidateButton = page.getByTestId('btn-add-candidate');
  }

  async goto() {
    await this.page.goto('/live-session');
    // Wait for candidates to load (sidebar badge becomes non-zero)
    await this.page.waitForFunction(
      () => {
        const badge = document.querySelector('[data-testid="sidebar-badge-new"]');
        return badge && badge.textContent !== '0';
      },
      { timeout: 15_000 },
    );
  }

  candidateRow(id: string): Locator {
    return this.page.getByTestId(`candidate-row-${id}`);
  }

  async selectCandidate(id: string) {
    await this.candidateRow(id).click();
  }

  async clickReview(id: string) {
    await this.candidateRow(id).getByTestId('candidate-review-btn').click();
  }

  async openAddCandidateModal() {
    await this.addCandidateButton.click();
  }
}
