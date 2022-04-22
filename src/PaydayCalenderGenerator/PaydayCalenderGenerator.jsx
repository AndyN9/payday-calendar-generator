import React from 'react';

export function PaydayCalenderGenerator() {
  return (
    <div className="grid place-content-center h-screen">
      <form
        id="payday-calender-generator"
        name="payday-calender-generator"
        autoComplete="off"
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
            />
          </p>
        </section>
        <div className="text-center">
          <input
            className="mt-5 p-4 border rounded border-inherit "
            type="submit"
            value="Generate calender"
            aria-label="Generate calender"
          />
        </div>
      </form>
    </div>
  );
}
