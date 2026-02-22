import { test, expect } from '../fixtures/test-base';

test.describe('Decision panel validation', () => {
  test.beforeEach(async ({ liveSessionPage }) => {
    await liveSessionPage.goto();
    await liveSessionPage.selectCandidate('c_1');
    await expect(liveSessionPage.decisionPanel.form).toBeVisible();
  });

  test('submit button disabled when no action selected', async ({ liveSessionPage }) => {
    await expect(liveSessionPage.decisionPanel.submitButton).toBeDisabled();
  });

  test('textarea disabled when no action selected', async ({ liveSessionPage }) => {
    await expect(liveSessionPage.decisionPanel.reasonTextarea).toBeDisabled();
  });

  test('selecting action enables textarea', async ({ liveSessionPage }) => {
    await liveSessionPage.decisionPanel.selectShortlist();
    await expect(liveSessionPage.decisionPanel.reasonTextarea).toBeEnabled();
  });

  test('submit disabled when reason < 10 chars', async ({ liveSessionPage }) => {
    await liveSessionPage.decisionPanel.selectShortlist();
    await liveSessionPage.decisionPanel.fillReason('short');
    await expect(liveSessionPage.decisionPanel.submitButton).toBeDisabled();
  });

  test('character count displays correctly', async ({ liveSessionPage }) => {
    await liveSessionPage.decisionPanel.selectShortlist();
    await expect(liveSessionPage.decisionPanel.charCount).toContainText('0 / 10 min');

    await liveSessionPage.decisionPanel.fillReason('Hello');
    await expect(liveSessionPage.decisionPanel.charCount).toContainText('5 / 10 min');
  });

  test('submit enables at exactly 10 chars', async ({ liveSessionPage }) => {
    await liveSessionPage.decisionPanel.selectShortlist();
    await liveSessionPage.decisionPanel.fillReason('1234567890');
    await expect(liveSessionPage.decisionPanel.charCount).toContainText('10 / 10 min');
    await expect(liveSessionPage.decisionPanel.submitButton).toBeEnabled();
  });

  test('button label changes per action', async ({ liveSessionPage }) => {
    // No action selected
    await expect(liveSessionPage.decisionPanel.submitButton).toContainText('Select an action first');

    // Shortlist
    await liveSessionPage.decisionPanel.selectShortlist();
    await expect(liveSessionPage.decisionPanel.submitButton).toContainText('Confirm Shortlist');

    // Deselect and select Reject
    await liveSessionPage.decisionPanel.selectShortlist(); // toggle off
    await liveSessionPage.decisionPanel.selectReject();
    await expect(liveSessionPage.decisionPanel.submitButton).toContainText('Confirm Rejection');
  });

  test('"This action is permanent" warning is visible', async ({ page }) => {
    await expect(page.getByText('This action is permanent.')).toBeVisible();
  });
});
