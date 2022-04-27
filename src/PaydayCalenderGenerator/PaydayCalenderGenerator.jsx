import React, { useReducer } from 'react';
import { generateCalendar, validatePayrollPeriod } from './generateCalender';

function getValidatedFormState(state) {
  const isValidPayrollPeriod = validatePayrollPeriod(state.payrollPeriod);
  return {
    ...state,
    isValidPayrollPeriod,
    isValid: isValidPayrollPeriod,
  };
}

function isBlob(obj) {
  return obj instanceof Blob;
}

function download(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
}

export function PaydayCalenderGenerator() {
  const [form, dispatch] = useReducer(
    (state, action) => {
      const { name, payload } = action;

      switch (name) {
        case 'setPayrollPeriod':
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
      payrollPeriod: '',
      eventTitle: '',
    })
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(form);
    if (!form.isValid) {
      console.warn('Invalid form:', form);
      return;
    }

    const calendar = generateCalendar(form);
    if (isBlob(calendar)) {
      download(calendar, `${form.payrollPeriod}-payday-calendar.ics`);
    } else {
      console.log(calendar);
    }
  };

  const { payrollPeriod, eventTitle } = form;

  return (
    <div className="grid place-content-center h-screen">
      <form
        id="payday-calender-generator"
        name="payday-calender-generator"
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold">Payday Calender Generator</h1>
        <p>
          Required fields are followed by{' '}
          <strong>
            <abbr title="required">*</abbr>
          </strong>
          .
        </p>
        <section className="mt-5 space-y-2">
          <p className="flex flex-col sm:flex-row place-content-between place-items-center">
            <label htmlFor="payroll-period">
              <span>Payroll Period: </span>
              <strong>
                <abbr title="required">*</abbr>
              </strong>
            </label>
            <select
              className="mt-1 w-2/3 rounded focus:invalid:border-red-500 focus:invalid:ring-red-500"
              id="payroll-period"
              name="payroll-period"
              aria-label="Payroll period"
              required
              value={payrollPeriod}
              onChange={(event) => {
                dispatch({
                  name: 'setPayrollPeriod',
                  payload: {
                    payrollPeriod: event.target.value,
                  },
                });
              }}
            >
              <option value="">Please select a period</option>
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="semi-monthly">Semi-monthly</option>
              <option value="monthly">Monthly</option>
            </select>
          </p>
          <p className="flex flex-col sm:flex-row place-content-between place-items-center">
            <label htmlFor="event-title">
              <span>Event Title: </span>
            </label>
            <input
              className="mt-1 w-2/3 rounded"
              type="text"
              id="event-title"
              name="event-title"
              aria-label="Event title"
              placeholder="Payday!"
              value={eventTitle}
              onChange={(event) => {
                dispatch({
                  name: 'setEventTitle',
                  payload: {
                    eventTitle: event.target.value,
                  },
                });
              }}
            />
          </p>
        </section>
        <div className="text-center">
          <input
            className="mt-5 p-4 border rounded text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none"
            type="submit"
            value="Download calender"
            aria-label="Download calender"
          />
        </div>
      </form>
    </div>
  );
}
