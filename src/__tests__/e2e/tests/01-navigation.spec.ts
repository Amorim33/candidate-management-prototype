import { test, expect } from '../fixtures/test-base';
import { SEED } from '../helpers/seed-data';

test.describe('Navigation', () => {
  test('/ redirects to /live-session', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/live-session/);
  });

  test('sidebar highlights the active page', async ({ liveSessionPage, page }) => {
    await liveSessionPage.goto();
    await expect(liveSessionPage.sidebar.navNew).toHaveAttribute('aria-current', 'page');
    await expect(liveSessionPage.sidebar.navShortlisted).not.toHaveAttribute('aria-current', 'page');

    await liveSessionPage.sidebar.goToShortlisted();
    await expect(page).toHaveURL(/\/live-session\/shortlisted/);
    await expect(liveSessionPage.sidebar.navShortlisted).toHaveAttribute('aria-current', 'page');
    await expect(liveSessionPage.sidebar.navNew).not.toHaveAttribute('aria-current', 'page');
  });

  test('sidebar navigates between all 3 pages', async ({ liveSessionPage, page }) => {
    await liveSessionPage.goto();

    await liveSessionPage.sidebar.goToShortlisted();
    await expect(page).toHaveURL(/\/live-session\/shortlisted/);

    await liveSessionPage.sidebar.goToRejected();
    await expect(page).toHaveURL(/\/live-session\/rejected/);

    await liveSessionPage.sidebar.goToNew();
    await expect(page).toHaveURL('/live-session');
  });

  test('sidebar badge counts match seed data', async ({ liveSessionPage }) => {
    await liveSessionPage.goto();
    await expect(liveSessionPage.sidebar.badgeNew).toHaveText(String(SEED.counts.new));
    await expect(liveSessionPage.sidebar.badgeShortlisted).toHaveText(String(SEED.counts.shortlisted));
    await expect(liveSessionPage.sidebar.badgeRejected).toHaveText(String(SEED.counts.rejected));
  });
});
