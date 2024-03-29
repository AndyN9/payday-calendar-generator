import { FormEvent, useReducer } from 'react';
import {
  PayrollPeriods,
  Paydays,
  generateCalendar,
  validatePayrollPeriod,
  validatePayday,
  validPaydays,
  DEFAULT_PAYDAY,
} from './generateCalendar';

type FormState = {
  payrollPeriod: PayrollPeriods;
  payday: Paydays;
  eventTitle: string;
}

export type ValidatedFormState = FormState & {
  isValidPayrollPeriod: boolean;
  isValidPayday: boolean;
  isValid: boolean;
}

function getValidatedFormState(state: FormState): ValidatedFormState {
  const isValidPayrollPeriod = validatePayrollPeriod(state.payrollPeriod);
  const isValidPayday = validatePayday(state.payday);
  return {
    ...state,
    isValidPayrollPeriod,
    isValidPayday,
    isValid: isValidPayrollPeriod && isValidPayday,
  };
}

function isBlob(obj: object | string) {
  return obj instanceof Blob;
}

function download(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
}

const capitalize = (string: string) =>
  (string && string[0].toUpperCase() + string.slice(1)) || '';


type FormAction = {
  name: 'setPayrollPeriod' | 'setPayday' | 'setEventTitle';
  payload: FormState;
}

export function PaydayCalendarGenerator() {
  const [form, dispatch] = useReducer(
    (state: ValidatedFormState, action: FormAction) => {
      const { name, payload } = action;

      switch (name) {
        case 'setPayrollPeriod':
          return getValidatedFormState({
            ...state,
            ...payload,
          });
        case 'setPayday':
          return getValidatedFormState({
            ...state,
            ...payload,
          });
        case 'setEventTitle':
          return getValidatedFormState({
            ...state,
            ...payload,
          });
        default:
          return getValidatedFormState(state);
      }
    },
    getValidatedFormState({
      payrollPeriod: '' as PayrollPeriods,
      payday: DEFAULT_PAYDAY,
      eventTitle: '',
    })
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!form.isValid) {
      console.warn('Invalid form:', form);
      return;
    }

    const calendar = generateCalendar(form as ValidatedFormState);
    if (isBlob(calendar)) {
      download(calendar as Blob, `${form.payrollPeriod}-payday-calendar.ics`);
    } else {
      console.log(form);
      console.log(calendar);
    }
  };

  const { payrollPeriod, payday, eventTitle } = form;

  return (
    <div className="grid place-content-center h-screen">
      <form
        className="m-5"
        id="payday-calendar-generator"
        name="payday-calendar-generator"
        aria-label="payday calendar generator"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold">Payday Calendar Generator</h1>
        <p>
          Required fields are followed by{' '}
          <strong>
            <abbr title="required">*</abbr>
          </strong>
          .
        </p>
        <section className="mt-5 space-y-2">
          <label className="block" htmlFor="payroll-period">
            <span className="text-xl font-bold">Payroll Period: </span>
            <strong>
              <abbr title="required">*</abbr>
            </strong>
            <select
              className="form-select block w-full mt-1 rounded focus:invalid:border-red-500 focus:invalid:ring-red-500"
              id="payroll-period"
              name="payroll-period"
              aria-label="payroll period"
              required
              value={payrollPeriod}
              onChange={(event) => {
                dispatch({
                  name: 'setPayrollPeriod',
                  payload: {
                    payrollPeriod: event.target.value as PayrollPeriods,
                  } as FormState,
                });
              }}
            >
              {[
                {
                  value: '',
                  label: 'Please select a period',
                },
                {
                  value: 'weekly',
                  label: 'Weekly',
                },
                {
                  value: 'bi-weekly',
                  label: 'Bi-weekly',
                },
                {
                  value: 'semi-monthly',
                  label: 'Semi-monthly',
                },
                {
                  value: 'monthly',
                  label: 'Monthly',
                },
              ].map((period, index) => {
                const { value, label } = period;

                return (
                  <option key={`${value}-${index}`} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </label>
          <fieldset className="block">
            <legend>
              <span className="text-xl font-bold">Payday: </span>
              {form.payrollPeriod !== 'semi-monthly' && (
                <strong>
                  <abbr title="required">*</abbr>
                </strong>
              )}
            </legend>
            {form.payrollPeriod === 'semi-monthly' && (
              <p className="text-sm">
                Semi-monthly doesn't require a payday option
              </p>
            )}
            <div className="mt-2">
              {Object.keys(validPaydays).map((day, index) => (
                <div key={`${day}-${index}`}>
                  <label htmlFor={day} className="inline-flex items-center">
                    <input
                      className="form-radio disabled:border-gray-400 disabled:ring-gray-400 disabled:text-gray-400"
                      type="radio"
                      id={day}
                      name={day}
                      aria-label={`${day} payday`}
                      value={day}
                      disabled={form.payrollPeriod === 'semi-monthly'}
                      checked={day === payday}
                      onChange={(event) => {
                        dispatch({
                          name: 'setPayday',
                          payload: {
                            payday: event.target.value as Paydays,
                          } as FormState,
                        });
                      }}
                    />
                    <span className="ml-2">{capitalize(day)}</span>
                  </label>
                </div>
              ))}
            </div>
          </fieldset>
          <label className="block" htmlFor="event-title">
            <span className="text-xl font-bold">Event Title: </span>
            <input
              className="form-input w-full mt-1 rounded"
              type="text"
              id="event-title"
              name="event-title"
              aria-label="event title"
              placeholder="Payday!"
              value={eventTitle}
              onChange={(event) => {
                dispatch({
                  name: 'setEventTitle',
                  payload: {
                    eventTitle: event.target.value,
                  } as FormState,
                });
              }}
            />
          </label>
        </section>
        <div className="mt-5 text-center">
          <input
            className="p-4 border rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
            type="submit"
            value="Download calendar"
            aria-label="download calendar"
          />
        </div>
      </form>
    </div>
  );
}
