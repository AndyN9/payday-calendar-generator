const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('App', () => {
  test('should have page title', async ({ page }) => {
    const title = await page.title();
    await expect(title).toBe('Payroll Periods iCal Generator');
  });
});
