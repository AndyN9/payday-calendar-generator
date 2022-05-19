import { describe, expect, it } from 'vitest';

import { generateCalendar, DEFAULT_PAYDAY } from './generateCalendar';

describe('generateCalendar', () => {
  it('should return an error string when no payroll period is provided', () => {
    const result = generateCalendar({
      payrollPeriod: '',
      payday: DEFAULT_PAYDAY,
    });
    expect(result).toEqual(
      'Invalid payroll period:  (valid values: weekly,bi-weekly,semi-monthly,monthly)'
    );
  });

  it('should return an error string when an invalid payroll period is provided', () => {
    const result = generateCalendar({
      payrollPeriod: 'invalid',
      payday: DEFAULT_PAYDAY,
    });
    expect(result).toEqual(
      'Invalid payroll period: invalid (valid values: weekly,bi-weekly,semi-monthly,monthly)'
    );
  });

  it('should return a blob when a valid payroll period is provided', () => {
    const result = generateCalendar({
      payrollPeriod: 'bi-weekly',
      payday: DEFAULT_PAYDAY,
    });
    expect(result).toBeInstanceOf(Blob);
  });
});

describe('generateCalendar with debug on', () => {
  it('should return a valid calendar string for a weekly payroll period', () => {
    const paydays = {
      monday: 'MO',
      tuesday: 'TU',
      wednesday: 'WE',
      thursday: 'TH',
      friday: 'FR',
    };

    const rrulePrefix = 'RRULE:FREQ=WEEKLY;BYDAY=';

    for (const [key, value] of Object.entries(paydays)) {
      const result = generateCalendar(
        { payrollPeriod: 'weekly', payday: key },
        { debug: true }
      );
      expect(result).toBeTypeOf('string');

      // calendar title
      expect(result).toMatch('NAME:Paydays!');
      expect(result).toMatch('X-WR-CALNAME:Paydays!');

      // calendar description
      expect(result).toMatch(
        'X-WR-CALDESC:Payday calendar for a weekly period'
      );

      // event title
      expect(result).toMatch('SUMMARY:Payday!');

      // event rrule
      expect(result).toMatch(`${rrulePrefix}${value}`);
    }
  });

  it('should return a valid calendar string for a bi-weekly payroll period', () => {
    const paydays = {
      monday: 'MO',
      tuesday: 'TU',
      wednesday: 'WE',
      thursday: 'TH',
      friday: 'FR',
    };

    const rrulePrefix = 'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=';

    for (const [key, value] of Object.entries(paydays)) {
      const result = generateCalendar(
        { payrollPeriod: 'bi-weekly', payday: key },
        { debug: true }
      );
      expect(result).toBeTypeOf('string');

      // calendar title
      expect(result).toMatch('NAME:Paydays!');
      expect(result).toMatch('X-WR-CALNAME:Paydays!');

      // calendar description
      expect(result).toMatch(
        'X-WR-CALDESC:Payday calendar for a bi-weekly period'
      );

      // event title
      expect(result).toMatch('SUMMARY:Payday!');

      // event rrule
      expect(result).toMatch(`${rrulePrefix}${value}`);
    }
  });

  it('should return a valid calendar string for a semi-monthly payroll period', () => {
    const result = generateCalendar(
      { payrollPeriod: 'semi-monthly', payday: DEFAULT_PAYDAY },
      { debug: true }
    );
    expect(result).toBeTypeOf('string');

    // calendar title
    expect(result).toMatch('NAME:Paydays!');
    expect(result).toMatch('X-WR-CALNAME:Paydays!');

    // calendar description
    expect(result).toMatch(
      'X-WR-CALDESC:Payday calendar for a semi-monthly period'
    );

    // event title
    expect(result).toMatch('SUMMARY:Payday!');

    // event rrule
    expect(result).toMatch(
      'RRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1;BYMONTHDAY=13,14,15'
    );
    expect(result).toMatch(
      'RRULE:FREQ=MONTHLY;BYDAY=MO,TU,WE,TH,FR;BYSETPOS=-1'
    );
  });

  it('should return a valid calendar string for a monthly payroll period', () => {
    const paydays = {
      monday: 'MO',
      tuesday: 'TU',
      wednesday: 'WE',
      thursday: 'TH',
      friday: 'FR',
    };

    const rrulePrefix = 'RRULE:FREQ=MONTHLY;BYDAY=+2';

    for (const [key, value] of Object.entries(paydays)) {
      const result = generateCalendar(
        { payrollPeriod: 'monthly', payday: key },
        { debug: true }
      );
      expect(result).toBeTypeOf('string');

      // calendar title
      expect(result).toMatch('NAME:Paydays!');
      expect(result).toMatch('X-WR-CALNAME:Paydays!');

      // calendar description
      expect(result).toMatch(
        'X-WR-CALDESC:Payday calendar for a monthly period'
      );

      // event title
      expect(result).toMatch('SUMMARY:Payday!');

      // event rrule
      expect(result).toMatch(`${rrulePrefix}${value}`);
    }
  });
});

describe('DEFAULT_PAYDAY', () => {
  it('should return the default payday', () => {
    expect(DEFAULT_PAYDAY).toEqual('friday');
  });
});
