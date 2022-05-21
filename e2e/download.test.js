const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('download', () => {
  test('should generate calendar file', async ({ page }) => {});
});
