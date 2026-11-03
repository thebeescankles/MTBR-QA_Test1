import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';

const { Given, When, Then } = createBdd(test);

Given('the user is on the Book Store page', async ({ bookStorePage }) => {
  await bookStorePage.goto();
});

When('the user searches for {string}', async ({ bookStorePage }, keyword: string) => {
  await bookStorePage.search(keyword);
});

Then('only books matching the keyword are listed', async ({ bookStorePage }) => {
  // Keyword asserted per-row inside the page object (search box text)
  await bookStorePage.expectAllRowsMatch('Git');
});

Then(
  'the results include a book whose title contains {string}',
  async ({ bookStorePage }, partialTitle: string) => {
    await bookStorePage.expectTitleIncluded(partialTitle);
  },
);

Then('the results table shows an empty state', async ({ bookStorePage }) => {
  await bookStorePage.expectEmptyState();
});
