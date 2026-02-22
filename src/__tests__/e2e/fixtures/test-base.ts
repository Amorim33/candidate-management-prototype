import { test as base } from '@playwright/test';
import { LiveSessionPage } from '../pages/live-session.page';
import { ShortlistedPage } from '../pages/shortlisted.page';
import { RejectedPage } from '../pages/rejected.page';
import { resetData } from '../helpers/api-helpers';

type Fixtures = {
  liveSessionPage: LiveSessionPage;
  shortlistedPage: ShortlistedPage;
  rejectedPage: RejectedPage;
};

export const test = base.extend<Fixtures>({
  liveSessionPage: async ({ page, request }, use) => {
    await resetData(request);
    await use(new LiveSessionPage(page));
  },
  shortlistedPage: async ({ page, request }, use) => {
    await resetData(request);
    await use(new ShortlistedPage(page));
  },
  rejectedPage: async ({ page, request }, use) => {
    await resetData(request);
    await use(new RejectedPage(page));
  },
});

export { expect } from '@playwright/test';
