import { test as base } from 'playwright-bdd';
import { LoginPage } from '../pages/LoginPage';
import { BookStorePage } from '../pages/BookStorePage';
import { AccountApi, TestUser } from '../api/accountApi';

export const test = base.extend<{
  loginPage: LoginPage;
  bookStorePage: BookStorePage;
  testUser: TestUser;
}>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),

  bookStorePage: async ({ page }, use) => use(new BookStorePage(page)),

  testUser: async ({ request }, use) => {
    const api = new AccountApi(request);
    const user = await api.createUser();

    await use(user);

    // Best-effort cleanup; never fail a passing test over teardown
    await api.deleteUser(user).catch((error) =>
      console.warn(`[teardown] could not delete user ${user.userName}: ${error.message}`),
    );
  },
  page: async ({ page }, use) => {
    await page.route(
      /googlesyndication|doubleclick\.net|adservice|google_ads/,
      (route) => route.abort(),
    );
    await use(page);
  },
});

export { expect } from '@playwright/test';