import ical from 'ical-generator';
import { RRule } from 'rrule';

const payrollPeriodsEvents = {
  weekly: [
    {
      rruleSettings: {
        freq: RRule.WEEKLY,
        byweekday: RRule.FR,
      },
    },
  ],
  'bi-weekly': [
    {
      rruleSettings: {
        freq: RRule.WEEKLY,
        interval: 2,
        byweekday: RRule.FR,
      },
    },
  ],
  'semi-monthly': [
    {
      rruleSettings: {
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        bysetpos: [-1],
        bymonthday: [13, 14, 15],
      },
    },
    {
      rruleSettings: {
        freq: RRule.MONTHLY,
        byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
        bysetpos: [-1],
      },
    },
  ],
  monthly: [
    {
      rruleSettings: {
        freq: RRule.MONTHLY,
        byweekday: [RRule.FR.nth(2)],
      },
    },
  ],
};

export function validatePayrollPeriod(payrollPeriod) {
  return Object.keys(payrollPeriodsEvents).includes(payrollPeriod);
}

function validateEventTitle(eventTitle) {
  return typeof eventTitle === 'string' && eventTitle.length > 0;
}

function getDefaultEventSettings(eventTitle) {
  const summary = validateEventTitle(eventTitle) ? eventTitle : 'Payday!';

  return {
    // default event title
    summary,
    allDay: true,
  };
}

function getFirstRruleDate(rrule) {
  // for performance reasons, callback limits the result to the first date
  const dates = rrule.all((date, index) => index === 0);
  return dates[0];
}

function getPayrollPeriodEventSettings(payrollPeriodEvent) {
  const { rruleSettings } = payrollPeriodEvent;
  const rrule = new RRule(rruleSettings);

  return {
    start: getFirstRruleDate(rrule),
    repeating: rrule,
  };
}

export function generateCalendar({ payrollPeriod, eventTitle }) {
  if (!validatePayrollPeriod(payrollPeriod)) {
    return `Invalid payroll period: ${payrollPeriod} (valid values: ${Object.keys(
      payrollPeriodsEvents
    )})`;
  }

  const calendar = ical({
    name: `Paydays!`,
    description: `Payday calendar for a ${payrollPeriod} period`,
  });

  payrollPeriodsEvents[payrollPeriod].forEach((payrollPeriodEvent) => {
    calendar.createEvent({
      ...getDefaultEventSettings(eventTitle),
      ...getPayrollPeriodEventSettings(payrollPeriodEvent),
    });
  });

  return calendar.toString();
  // return calendar.toBlob();
}
