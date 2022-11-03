import ical from 'ical-generator';
import { RRule } from 'rrule';

const payrollPeriodsEvents = {
  weekly: [
    {
      rruleSettings: {
        freq: RRule.WEEKLY,
        byweekday: RRule.FR, // default is 'friday'
      },
    },
  ],
  'bi-weekly': [
    {
      rruleSettings: {
        freq: RRule.WEEKLY,
        interval: 2,
        byweekday: RRule.FR, // default is 'friday'
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
        byweekday: [RRule.FR.nth(2)], // default is 'friday'
      },
    },
  ],
};

export const validPaydays = {
  monday: RRule.MO,
  tuesday: RRule.TU,
  wednesday: RRule.WE,
  thursday: RRule.TH,
  friday: RRule.FR,
};

export type PayrollPeriods = keyof typeof payrollPeriodsEvents;
export type Paydays = keyof typeof validPaydays;

export const DEFAULT_PAYDAY = 'friday';

export function validatePayrollPeriod(payrollPeriod: string) {
  return Object.keys(payrollPeriodsEvents).includes(payrollPeriod);
}

export function validatePayday(payday: string) {
  return Object.keys(validPaydays).includes(payday);
}

function validateEventTitle(eventTitle: string) {
  return typeof eventTitle === 'string' && eventTitle.length > 0;
}

function getDefaultEventSettings(eventTitle: string) {
  const summary = validateEventTitle(eventTitle) ? eventTitle : 'Payday!';

  return {
    // default event title
    summary,
    allDay: true,
  };
}

function getFirstRruleDate(rrule: RRule) {
  // for performance reasons, callback limits the result to the first date
  const dates = rrule.all((date, index) => index === 0);
  return dates[0];
}

function getPayrollPeriodEventSettings(
  payrollPeriodEvent: typeof payrollPeriodsEvents[PayrollPeriods][0],
  { payrollPeriod, payday }
    : {
      payrollPeriod: PayrollPeriods;
      payday: Paydays;
    }
) {
  const { rruleSettings } = payrollPeriodEvent;

  if (payrollPeriod !== 'semi-monthly') {
    const selectedPayday = validPaydays[payday];

    rruleSettings.byweekday =
      payrollPeriod !== 'monthly' ? selectedPayday : [selectedPayday.nth(2)];
  }

  const rrule = new RRule(rruleSettings);

  return {
    start: getFirstRruleDate(rrule),
    repeating: rrule,
  };
}

export type Calendar = {
  payrollPeriod: PayrollPeriods;
  payday: Paydays;
  eventTitle: string;
}

export function generateCalendar(
  { payrollPeriod, payday, eventTitle }: Calendar,
  options = { debug: false }
) {
  const { debug } = options;

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
      ...getPayrollPeriodEventSettings(payrollPeriodEvent, {
        payrollPeriod,
        payday,
      }),
    });
  });

  return debug ? calendar.toString() : calendar.toBlob();
}
