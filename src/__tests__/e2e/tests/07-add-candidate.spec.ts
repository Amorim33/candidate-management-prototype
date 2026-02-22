import { test, expect } from '../fixtures/test-base';
import { SEED } from '../helpers/seed-data';

test.describe('Add Candidate modal', () => {
  test('modal opens and closes via cancel button', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();

    await liveSessionPage.openAddCandidateModal();
    await expect(liveSessionPage.addCandidateModal.modal).toBeVisible();

    await liveSessionPage.addCandidateModal.clickCancel();
    await expect(liveSessionPage.addCandidateModal.modal).not.toBeVisible();
  });

  test('modal closes when clicking overlay', async ({ liveSessionPage, page }) => {
    await liveSessionPage.goto();

    await liveSessionPage.openAddCandidateModal();
    await expect(liveSessionPage.addCandidateModal.modal).toBeVisible();

    // Click on overlay (outside the modal) - use force since the modal itself stops propagation
    await page.getByTestId('add-candidate-overlay').click({ position: { x: 10, y: 10 } });
    await expect(liveSessionPage.addCandidateModal.modal).not.toBeVisible();
  });

  test('create button disabled with empty name', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();

    await liveSessionPage.openAddCandidateModal();
    await expect(liveSessionPage.addCandidateModal.createButton).toBeDisabled();
  });

  test('successfully creates candidate with name only', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();

    await liveSessionPage.openAddCandidateModal();
    await liveSessionPage.addCandidateModal.fillName('Test Candidate A');
    await expect(liveSessionPage.addCandidateModal.createButton).toBeEnabled();

    await liveSessionPage.addCandidateModal.clickCreate();
    await expect(liveSessionPage.addCandidateModal.modal).not.toBeVisible();

    // New candidate should be in the list
    const expectedNewCount = SEED.counts.new + 1;
    await expect(liveSessionPage.headerCount).toContainText(`${expectedNewCount} awaiting review`);
  });

  test('successfully creates candidate with name + LinkedIn', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();

    await liveSessionPage.openAddCandidateModal();
    await liveSessionPage.addCandidateModal.fillName('Test Candidate B');
    await liveSessionPage.addCandidateModal.fillLinkedin('linkedin.com/in/testb');
    await liveSessionPage.addCandidateModal.clickCreate();

    await expect(liveSessionPage.addCandidateModal.modal).not.toBeVisible();
  });

  test('shows error for invalid LinkedIn URL', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();

    await liveSessionPage.openAddCandidateModal();
    await liveSessionPage.addCandidateModal.fillName('Test Candidate C');
    await liveSessionPage.addCandidateModal.fillLinkedin('not-a-valid-url');
    await liveSessionPage.addCandidateModal.clickCreate();

    await expect(liveSessionPage.addCandidateModal.linkedinError).toBeVisible();
  });

  test('sidebar count and stats update after creation', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();

    // Capture current sidebar badge count before creation
    const beforeBadgeText = await liveSessionPage.sidebar.badgeNew.textContent();
    const beforeCount = parseInt(beforeBadgeText!, 10);

    await liveSessionPage.openAddCandidateModal();
    await liveSessionPage.addCandidateModal.fillName('Test Candidate D');
    await liveSessionPage.addCandidateModal.clickCreate();
    await expect(liveSessionPage.addCandidateModal.modal).not.toBeVisible();

    // Wait for refresh
    await expect(liveSessionPage.sidebar.badgeNew).toHaveText(String(beforeCount + 1));
  });
});
