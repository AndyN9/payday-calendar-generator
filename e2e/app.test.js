const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('App', () => {
  test('should have page title', async ({ page }) => {
    await expect(page).toHaveTitle('Payroll Periods iCal Generator');
  });
});

test.describe('form', () => {
  test('should render form', async ({ page }) => {
    const form = await page.locator('[aria-label="payday calendar generator"]');
    await expect(form).toBeVisible();
  });

  test('should render title and subtitle', async ({ page }) => {
    const title = await page.locator('"Payday Calendar Generator"');
    await expect(title).toBeVisible();
    // there's a white space after the text for this textNode
    const subtitle = await page.locator('"Required fields are followed by "');
    await expect(subtitle).toBeVisible();
  });

  test("should render 'Payroll Period' select field", async ({ page }) => {
    const payrollPeriodSelectSelector = '[aria-label="payroll period"]';
    const payrollPeriodSelect = await page.locator(payrollPeriodSelectSelector);
    await expect(payrollPeriodSelect).toBeVisible();
    await expect(payrollPeriodSelect).toHaveAttribute('required', '');

    const selectOptionLabels = [
      'Please select a period',
      'Weekly',
      'Bi-weekly',
      'Semi-monthly',
      'Monthly',
    ];
    for (const label of selectOptionLabels) {
      const option = await page.locator(
        `${payrollPeriodSelectSelector} :text-is("${label}")`
      );
      // i guess <option> aren't visible?
      await expect(option).toBeTruthy();
    }
  });

  test('should render semi-monthly disclaimer', async ({ page }) => {
    page.selectOption('[aria-label="payroll period"]', 'semi-monthly');
    const semiMonthlyDisclaimer = await page.locator(
      '"Semi-monthly doesn\'t require a payday option"'
    );
    await expect(semiMonthlyDisclaimer).toBeVisible();

    const radioOptionNames = [
      'monday payday',
      'tuesday payday',
      'wednesday payday',
      'thursday payday',
      'friday payday',
    ];
    for (const name of radioOptionNames) {
      const radioOption = await page.locator(`[aria-label="${name}"]`);
      await expect(radioOption).toBeVisible();
      await expect(radioOption).toBeDisabled();

      if (name === 'friday payday') {
        await expect(radioOption).toBeChecked();
      }
    }
  });

  test("should render 'Payday' radio field", async ({ page }) => {
    const payday = await page.locator('legend :text-is("Payday: ")');
    await expect(payday).toBeVisible();

    const radioOptionNames = [
      'monday payday',
      'tuesday payday',
      'wednesday payday',
      'thursday payday',
      'friday payday',
    ];
    for (const name of radioOptionNames) {
      const radioOption = await page.locator(`[aria-label="${name}"]`);
      await expect(radioOption).toBeVisible();

      if (name === 'friday payday') {
        await expect(radioOption).toBeChecked();
      }
    }
  });

  test("should render 'Event Title' input field", async ({ page }) => {
    const eventTitle = await page.locator('[aria-label="event title"]');
    await expect(eventTitle).toBeVisible();
  });

  test("should render 'Download calendar' button", async ({ page }) => {
    const downloadCalendar = await page.locator(
      '[aria-label="download calendar"]'
    );
    await expect(downloadCalendar).toBeVisible();
  });
});
