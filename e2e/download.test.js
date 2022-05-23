const { test, expect } = require('@playwright/test');
const fs = require('fs/promises');

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test.afterEach(async ({ page }) => {
  await page.close();
});

test.describe('download', () => {
  test('should generate a valid calendar file for a weekly payroll period', async ({
    page,
  }) => {
    const paydays = {
      monday: 'MO',
      tuesday: 'TU',
      wednesday: 'WE',
      thursday: 'TH',
      friday: 'FR',
    };

    const rrulePrefix = 'RRULE:FREQ=WEEKLY;BYDAY=';

    for (const [key, value] of Object.entries(paydays)) {
      await page.selectOption('[aria-label="payroll period"]', 'weekly');
      await page.check(`[aria-label="${key} payday"]`);

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('[aria-label="download calendar"]').click(),
      ]);

      const filename = await download.suggestedFilename();
      expect(filename).toMatch(/weekly-payday-calendar\.ics$/);

      const path = await download.path();
      const data = await fs.readFile(path, { encoding: 'utf8' });

      // calendar title
      expect(data).toMatch('NAME:Paydays!');
      expect(data).toMatch('X-WR-CALNAME:Paydays!');

      // calendar description
      expect(data).toMatch('X-WR-CALDESC:Payday calendar for a weekly period');

      // event title
      expect(data).toMatch('SUMMARY:Payday!');

      // event rrule
      expect(data).toMatch(`${rrulePrefix}${value}`);
    }
  });

  test('should generate a valid calendar file for a bi-weekly payroll period', async ({
    page,
  }) => {
    const paydays = {
      monday: 'MO',
      tuesday: 'TU',
      wednesday: 'WE',
      thursday: 'TH',
      friday: 'FR',
    };

    const rrulePrefix = 'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=';

    for (const [key, value] of Object.entries(paydays)) {
      await page.selectOption('[aria-label="payroll period"]', 'bi-weekly');
      await page.check(`[aria-label="${key} payday"]`);

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('[aria-label="download calendar"]').click(),
      ]);

      const filename = await download.suggestedFilename();
      expect(filename).toMatch(/bi-weekly-payday-calendar\.ics$/);

      const path = await download.path();
      const data = await fs.readFile(path, { encoding: 'utf8' });

      // calendar title
      expect(data).toMatch('NAME:Paydays!');
      expect(data).toMatch('X-WR-CALNAME:Paydays!');

      // calendar description
      expect(data).toMatch(
        'X-WR-CALDESC:Payday calendar for a bi-weekly period'
      );

      // event title
      expect(data).toMatch('SUMMARY:Payday!');

      // event rrule
      expect(data).toMatch(`${rrulePrefix}${value}`);
    }
  });

  test('should generate a valid calendar file for a semi-monthly payroll period', async ({
    page,
  }) => {
    await page.selectOption('[aria-label="payroll period"]', 'semi-monthly');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.locator('[aria-label="download calendar"]').click(),
    ]);

    const filename = await download.suggestedFilename();
    expect(filename).toMatch(/semi-monthly-payday-calendar\.ics$/);

    const path = await download.path();
    const data = await fs.readFile(path, { encoding: 'utf8' });

    // calendar title
    expect(data).toMatch('NAME:Paydays!');
    expect(data).toMatch('X-WR-CALNAME:Paydays!');

    // calendar description
    expect(data).toMatch(
      'X-WR-CALDESC:Payday calendar for a semi-monthly period'
    );

    // event title
    expect(data).toMatch('SUMMARY:Payday!');

    // event rrule
    expect(data).toMatch(
      'RRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1;BYMONTHDAY=13,14,15'
    );
    expect(data).toMatch('RRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1');
  });

  test('should generate a valid calendar file for a monthly payroll period', async ({
    page,
  }) => {
    const paydays = {
      monday: 'MO',
      tuesday: 'TU',
      wednesday: 'WE',
      thursday: 'TH',
      friday: 'FR',
    };

    const rrulePrefix = 'RRULE:FREQ=MONTHLY;BYDAY=+2';

    for (const [key, value] of Object.entries(paydays)) {
      await page.selectOption('[aria-label="payroll period"]', 'monthly');
      await page.check(`[aria-label="${key} payday"]`);

      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('[aria-label="download calendar"]').click(),
      ]);

      const filename = await download.suggestedFilename();
      expect(filename).toMatch(/monthly-payday-calendar\.ics$/);

      const path = await download.path();
      const data = await fs.readFile(path, { encoding: 'utf8' });

      // calendar title
      expect(data).toMatch('NAME:Paydays!');
      expect(data).toMatch('X-WR-CALNAME:Paydays!');

      // calendar description
      expect(data).toMatch('X-WR-CALDESC:Payday calendar for a monthly period');

      // event title
      expect(data).toMatch('SUMMARY:Payday!');

      // event rrule
      expect(data).toMatch(`${rrulePrefix}${value}`);
    }
  });
});
