const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/');
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('App', () => {
  test('should have page title', async ({ page }) => {
    await expect(page).toHaveTitle('Payroll Periods iCal Generator');

    expect(await page.screenshot()).toMatchSnapshot();
  });
});
