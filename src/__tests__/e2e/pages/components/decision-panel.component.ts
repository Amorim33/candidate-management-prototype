import { Locator, Page } from '@playwright/test';

export class DecisionPanelComponent {
  readonly emptyState: Locator;
  readonly lockedState: Locator;
  readonly form: Locator;
  readonly candidateName: Locator;
  readonly actionShortlist: Locator;
  readonly actionReject: Locator;
  readonly reasonTextarea: Locator;
  readonly charCount: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.emptyState = page.getByTestId('decision-panel-empty');
    this.lockedState = page.getByTestId('decision-panel-locked');
    this.form = page.getByTestId('decision-panel-form');
    this.candidateName = page.getByTestId('decision-candidate-name');
    this.actionShortlist = page.getByTestId('action-shortlist');
    this.actionReject = page.getByTestId('action-reject');
    this.reasonTextarea = page.getByTestId('decision-reason');
    this.charCount = page.getByTestId('decision-char-count');
    this.submitButton = page.getByTestId('decision-submit');
    this.errorMessage = page.getByTestId('decision-error');
  }

  async selectShortlist() {
    await this.actionShortlist.click();
  }

  async selectReject() {
    await this.actionReject.click();
  }

  async fillReason(text: string) {
    await this.reasonTextarea.fill(text);
  }

  async submit() {
    await this.submitButton.click();
  }

  async shortlistWithReason(reason: string) {
    await this.selectShortlist();
    await this.fillReason(reason);
    await this.submit();
  }

  async rejectWithReason(reason: string) {
    await this.selectReject();
    await this.fillReason(reason);
    await this.submit();
  }
}
