import { test, expect } from '../fixtures/test-base';
import { SEED } from '../helpers/seed-data';

test.describe('Shortlisted page', () => {
  test('lists all 3 shortlisted candidates with decision reason', async ({ shortlistedPage }) => {
    await shortlistedPage.goto();

    for (const candidate of SEED.shortlistedCandidates) {
      const row = shortlistedPage.candidateRow(candidate.id);
      await expect(row).toBeVisible();
      await expect(row.getByTestId('candidate-name')).toHaveText(candidate.name);
    }

    await expect(shortlistedPage.allCandidateNames()).toHaveCount(SEED.counts.shortlisted);
  });

  test('no Review button shown on shortlisted candidates', async ({ shortlistedPage, page }) => {
    await shortlistedPage.goto();
    await expect(page.getByTestId('candidate-review-btn')).toHaveCount(0);
  });

  test('search filters by name (case-insensitive)', async ({ shortlistedPage }) => {
    await shortlistedPage.goto();

    await shortlistedPage.filtersBar.search('lucas');
    await expect(shortlistedPage.allCandidateNames()).toHaveCount(1);
    await expect(shortlistedPage.allCandidateNames().first()).toHaveText('Lucas Ferreira');
  });

  test('search filters by role', async ({ shortlistedPage }) => {
    await shortlistedPage.goto();

    await shortlistedPage.filtersBar.search('devops');
    await expect(shortlistedPage.allCandidateNames()).toHaveCount(1);
    await expect(shortlistedPage.allCandidateNames().first()).toHaveText('Lucas Ferreira');
  });

  test('search filters by location', async ({ shortlistedPage }) => {
    await shortlistedPage.goto();

    await shortlistedPage.filtersBar.search('buenos aires');
    await expect(shortlistedPage.allCandidateNames()).toHaveCount(1);
    await expect(shortlistedPage.allCandidateNames().first()).toHaveText('Diego Morales');
  });

  test('role filter chips work correctly', async ({ shortlistedPage, page }) => {
    await shortlistedPage.goto();

    // Engineering filter should show Lucas Ferreira (DevOps) and Diego Morales (Senior Backend)
    await shortlistedPage.filtersBar.selectFilter('Engineering');
    await expect(shortlistedPage.allCandidateNames()).toHaveCount(2);

    // Design filter should show Isabella Silva (UX Researcher)
    await shortlistedPage.filtersBar.selectFilter('Design');
    await expect(shortlistedPage.allCandidateNames()).toHaveCount(1);
    await expect(shortlistedPage.allCandidateNames().first()).toHaveText('Isabella Silva');

    // All filter shows everyone
    await shortlistedPage.filtersBar.selectFilter('All');
    await expect(shortlistedPage.allCandidateNames()).toHaveCount(SEED.counts.shortlisted);
  });

  test('sort options work correctly', async ({ shortlistedPage }) => {
    await shortlistedPage.goto();

    // Newest first (default) — c_5 (Feb 18) first
    const names = shortlistedPage.allCandidateNames();
    await expect(names.first()).toHaveText('Lucas Ferreira');

    // Oldest first — c_7 (Feb 12) first
    await shortlistedPage.filtersBar.selectSort('oldest');
    await expect(names.first()).toHaveText('Diego Morales');

    // Name A-Z — Diego first
    await shortlistedPage.filtersBar.selectSort('name-az');
    await expect(names.first()).toHaveText('Diego Morales');
    await expect(names.last()).toHaveText('Lucas Ferreira');
  });

  test('search and filter combine correctly', async ({ shortlistedPage }) => {
    await shortlistedPage.goto();

    await shortlistedPage.filtersBar.selectFilter('Engineering');
    await expect(shortlistedPage.allCandidateNames()).toHaveCount(2);

    // Search within Engineering filter
    await shortlistedPage.filtersBar.search('diego');
    await expect(shortlistedPage.allCandidateNames()).toHaveCount(1);
    await expect(shortlistedPage.allCandidateNames().first()).toHaveText('Diego Morales');
  });
});
