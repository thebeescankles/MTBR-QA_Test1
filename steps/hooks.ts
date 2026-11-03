import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/fixtures';

const { After } = createBdd(test);

After(async ({ page, $testInfo }) => {
  if ($testInfo.status === 'passed') {
    const buffer = await page.screenshot({ fullPage: true });
    await $testInfo.attach('evidence-final-state.png', {
      body: buffer,
      contentType: 'image/png',
    });
  }
});