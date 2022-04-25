import ical from 'ical-generator';
import { RRule } from 'rrule';

const payrollPeriodEvents = {
  weekly: [],
  'bi-weekly': [],
  'semi-monthly': [],
  monthly: [],
};

function validatePayrollPeriod(payrollPeriod) {
  return Object.keys(payrollPeriodEvents).includes(payrollPeriod);
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

export function generateCalendar({ payrollPeriod, eventTitle }) {
  if (!validatePayrollPeriod(payrollPeriod)) {
    return `Invalid payroll period: ${payrollPeriod} (valid values: ${Object.keys(
      payrollPeriodEvents
    )})`;
  }

  const calendar = ical({
    name: `Paydays!`,
    description: `Payday calendar for ${payrollPeriod} schedule`,
  });

  const firstRrule = new RRule({
    freq: RRule.MONTHLY,
    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
    bysetpos: [-1],
    bymonthday: [13, 14, 15],
  });
  const secondRrule = new RRule({
    freq: RRule.MONTHLY,
    byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
    bysetpos: [-1],
  });

  calendar.createEvent({
    ...getDefaultEventSettings(eventTitle),
    start: getFirstRruleDate(firstRrule),
    repeating: firstRrule,
  });
  calendar.createEvent({
    ...getDefaultEventSettings(eventTitle),
    start: getFirstRruleDate(secondRrule),
    repeating: secondRrule,
  });

  return calendar.toString();
  // return calendar.toBlob();
}
