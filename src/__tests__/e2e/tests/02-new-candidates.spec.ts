import { test, expect } from '../fixtures/test-base';
import { SEED } from '../helpers/seed-data';

test.describe('New Candidates page', () => {
  test('header shows correct title and count', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();
    await expect(liveSessionPage.headerTitle).toHaveText('New Candidates');
    await expect(liveSessionPage.headerCount).toContainText(`${SEED.counts.new} awaiting review`);
  });

  test('stats row shows correct totals', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();
    await expect(liveSessionPage.statsRow.total).toHaveText(String(SEED.counts.total));
    await expect(liveSessionPage.statsRow.new).toHaveText(String(SEED.counts.new));
    await expect(liveSessionPage.statsRow.shortlisted).toHaveText(String(SEED.counts.shortlisted));
    await expect(liveSessionPage.statsRow.rejected).toHaveText(String(SEED.counts.rejected));
  });

  test('all 4 seed NEW candidates are listed with correct data', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();

    for (const candidate of SEED.newCandidates) {
      const row = liveSessionPage.candidateRow(candidate.id);
      await expect(row).toBeVisible();
      await expect(row.getByTestId('candidate-name')).toHaveText(candidate.name);
      await expect(row.getByTestId('candidate-role')).toHaveText(candidate.role);
      await expect(row.getByTestId('candidate-location')).toHaveText(candidate.location);
    }
  });

  test('decision panel shows empty state when no candidate selected', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();
    await expect(liveSessionPage.decisionPanel.emptyState).toBeVisible();
    await expect(liveSessionPage.decisionPanel.form).not.toBeVisible();
  });

  test('clicking a candidate updates URL and opens decision panel', async ({ liveSessionPage, page }) => {
    await liveSessionPage.goto();
    await liveSessionPage.selectCandidate('c_1');

    await expect(page).toHaveURL(/candidateId=c_1/);
    await expect(liveSessionPage.decisionPanel.form).toBeVisible();
    await expect(liveSessionPage.decisionPanel.candidateName).toHaveText('Maria Santos');
    await expect(liveSessionPage.decisionPanel.emptyState).not.toBeVisible();
  });

  test('switching candidates updates panel content', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();

    await liveSessionPage.selectCandidate('c_1');
    await expect(liveSessionPage.decisionPanel.candidateName).toHaveText('Maria Santos');

    await liveSessionPage.selectCandidate('c_2');
    await expect(liveSessionPage.decisionPanel.candidateName).toHaveText('João Pereira');
  });
});
