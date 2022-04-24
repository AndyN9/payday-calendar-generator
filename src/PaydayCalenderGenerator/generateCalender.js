import ical from 'ical-generator';
import { RRule } from 'rrule';

function getFirstRruleDate(rrule) {
  // for performance reasons, callback limits the result to the first date
  const dates = rrule.all((date, index) => index === 0);
  return dates[0];
}

export function generateCalendar({ payrollPeriod, eventTitle }) {
  // default event title
  const summary = eventTitle || 'Payday!';
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
    start: getFirstRruleDate(firstRrule),
    allDay: true,
    summary,
    repeating: firstRrule,
  });
  calendar.createEvent({
    start: getFirstRruleDate(secondRrule),
    allDay: true,
    summary,
    repeating: secondRrule,
  });

  return calendar.toString();
  // return calendar.toBlob();
}
