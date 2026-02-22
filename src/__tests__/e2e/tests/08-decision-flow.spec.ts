import { test, expect } from '../fixtures/test-base';

test.describe('Decision flow (mutating)', () => {
  test('shortlist a candidate and verify it moves to shortlisted page', async ({ liveSessionPage, page }) => {
    await liveSessionPage.goto();

    // Get initial counts
    const initialNewBadge = await liveSessionPage.sidebar.badgeNew.textContent();
    const initialShortlistedBadge = await liveSessionPage.sidebar.badgeShortlisted.textContent();
    const initialNewCount = parseInt(initialNewBadge!, 10);
    const initialShortlistedCount = parseInt(initialShortlistedBadge!, 10);

    // Select c_1 (Maria Santos) and shortlist
    await liveSessionPage.selectCandidate('c_1');
    await expect(liveSessionPage.decisionPanel.candidateName).toHaveText('Maria Santos');

    await liveSessionPage.decisionPanel.selectShortlist();
    await liveSessionPage.decisionPanel.fillReason('Excellent frontend skills and great culture fit for our team');
    await expect(liveSessionPage.decisionPanel.submitButton).toBeEnabled();
    await liveSessionPage.decisionPanel.submit();

    // After submission, candidate should disappear from the list
    await expect(liveSessionPage.candidateRow('c_1')).not.toBeVisible();

    // Sidebar counts should update
    await expect(liveSessionPage.sidebar.badgeNew).toHaveText(String(initialNewCount - 1));
    await expect(liveSessionPage.sidebar.badgeShortlisted).toHaveText(String(initialShortlistedCount + 1));

    // Navigate to shortlisted page and verify candidate is there
    await liveSessionPage.sidebar.goToShortlisted();
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('candidate-row-c_1')).toBeVisible();
    await expect(page.getByTestId('candidate-row-c_1').getByTestId('candidate-name')).toHaveText('Maria Santos');
  });

  test('reject a candidate and verify it moves to rejected page', async ({ liveSessionPage, page }) => {
    await liveSessionPage.goto();

    // Get initial counts
    const initialNewBadge = await liveSessionPage.sidebar.badgeNew.textContent();
    const initialRejectedBadge = await liveSessionPage.sidebar.badgeRejected.textContent();
    const initialNewCount = parseInt(initialNewBadge!, 10);
    const initialRejectedCount = parseInt(initialRejectedBadge!, 10);

    // Select c_2 (João Pereira) and reject
    await liveSessionPage.selectCandidate('c_2');
    await expect(liveSessionPage.decisionPanel.candidateName).toHaveText('João Pereira');

    await liveSessionPage.decisionPanel.selectReject();
    await liveSessionPage.decisionPanel.fillReason('Insufficient backend experience for the senior role requirements');
    await expect(liveSessionPage.decisionPanel.submitButton).toBeEnabled();
    await liveSessionPage.decisionPanel.submit();

    // After submission, candidate should disappear from the list
    await expect(liveSessionPage.candidateRow('c_2')).not.toBeVisible();

    // Sidebar counts should update
    await expect(liveSessionPage.sidebar.badgeNew).toHaveText(String(initialNewCount - 1));
    await expect(liveSessionPage.sidebar.badgeRejected).toHaveText(String(initialRejectedCount + 1));

    // Navigate to rejected page and verify candidate is there
    await liveSessionPage.sidebar.goToRejected();
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('candidate-row-c_2')).toBeVisible();
    await expect(page.getByTestId('candidate-row-c_2').getByTestId('candidate-name')).toHaveText('João Pereira');
  });

  test('stats row reflects all mutations', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();

    // After previous tests: c_1 shortlisted, c_2 rejected, and some candidates added
    // Just verify the stats are internally consistent
    const totalText = await liveSessionPage.statsRow.total.textContent();
    const newText = await liveSessionPage.statsRow.new.textContent();
    const shortlistedText = await liveSessionPage.statsRow.shortlisted.textContent();
    const rejectedText = await liveSessionPage.statsRow.rejected.textContent();

    const total = parseInt(totalText!, 10);
    const newCount = parseInt(newText!, 10);
    const shortlisted = parseInt(shortlistedText!, 10);
    const rejected = parseInt(rejectedText!, 10);

    expect(newCount + shortlisted + rejected).toBe(total);
  });
});
