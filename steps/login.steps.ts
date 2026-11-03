import { createBdd } from 'playwright-bdd';
import { test, expect } from '../fixtures/fixtures';

const { Given, When, Then } = createBdd(test);

Given('the user is on the login page', async ({ loginPage }) => {
  await loginPage.goto();
});

When(
  'the user logs in with valid credentials created for this run',
  async ({ loginPage, testUser }) => {
    await loginPage.login(testUser.userName, testUser.password);
  },
);

When(
  'the user tries to log in with {string} and {string}',
  async ({ loginPage }, userName: string, password: string) => {
    await loginPage.login(userName, password);
  },
);

Then(
  'the profile page shows the user\'s username',
  async ({ loginPage, testUser }) => {
    await loginPage.expectLoggedInAs(testUser.userName);
  },
);

Then('the user session is active', async ({ loginPage }) => {
  await loginPage.expectSessionActive();
});

Then(
  'an error message {string} is displayed',
  async ({ loginPage }, message: string) => {
    await expect(loginPage.errorMessage).toHaveText(message);
  },
);

Then('the user remains on the login page', async ({ loginPage }) => {
  await loginPage.expectStillOnLogin();
});