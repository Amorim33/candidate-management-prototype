import { test, expect } from '../fixtures/test-base';
import { SEED } from '../helpers/seed-data';

test.describe('Rejected page', () => {
  test('lists all 2 rejected candidates with reason', async ({ rejectedPage }) => {
    await rejectedPage.goto();

    for (const candidate of SEED.rejectedCandidates) {
      const row = rejectedPage.candidateRow(candidate.id);
      await expect(row).toBeVisible();
      await expect(row.getByTestId('candidate-name')).toHaveText(candidate.name);
    }

    await expect(rejectedPage.allCandidateNames()).toHaveCount(SEED.counts.rejected);
  });

  test('no Add Candidate button visible', async ({ rejectedPage, page }) => {
    await rejectedPage.goto();
    await expect(page.getByTestId('btn-add-candidate')).toHaveCount(0);
  });

  test('search filters correctly', async ({ rejectedPage }) => {
    await rejectedPage.goto();

    await rejectedPage.filtersBar.search('ricardo');
    await expect(rejectedPage.allCandidateNames()).toHaveCount(1);
    await expect(rejectedPage.allCandidateNames().first()).toHaveText('Ricardo Torres');
  });

  test('sort works correctly', async ({ rejectedPage }) => {
    await rejectedPage.goto();

    // Newest first (default) — c_8 (Feb 16) first
    const names = rejectedPage.allCandidateNames();
    await expect(names.first()).toHaveText('Ricardo Torres');

    // Oldest first — c_9 (Feb 10) first
    await rejectedPage.filtersBar.selectSort('oldest');
    await expect(names.first()).toHaveText('Patricia Mendes');

    // Name A-Z
    await rejectedPage.filtersBar.selectSort('name-az');
    await expect(names.first()).toHaveText('Patricia Mendes');
    await expect(names.last()).toHaveText('Ricardo Torres');
  });
});
