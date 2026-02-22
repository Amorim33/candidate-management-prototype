import { Locator, Page } from '@playwright/test';

export class AddCandidateModalComponent {
  readonly modal: Locator;
  readonly overlay: Locator;
  readonly nameInput: Locator;
  readonly linkedinInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly linkedinError: Locator;

  constructor(page: Page) {
    this.modal = page.getByTestId('add-candidate-modal');
    this.overlay = page.getByTestId('add-candidate-overlay');
    this.nameInput = page.getByTestId('input-candidate-name');
    this.linkedinInput = page.getByTestId('input-candidate-linkedin');
    this.createButton = page.getByTestId('btn-create-candidate');
    this.cancelButton = page.getByTestId('btn-cancel-modal');
    this.errorMessage = page.getByTestId('add-candidate-error');
    this.linkedinError = page.getByTestId('linkedin-field-error');
  }

  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  async fillLinkedin(url: string) {
    await this.linkedinInput.fill(url);
  }

  async clickCreate() {
    await this.createButton.click();
  }

  async clickCancel() {
    await this.cancelButton.click();
  }
}
