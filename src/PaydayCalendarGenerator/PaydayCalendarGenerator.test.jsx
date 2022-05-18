import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { PaydayCalendarGenerator } from './PaydayCalendarGenerator';

afterEach(() => {
  cleanup();
});

describe('PaydayCalendarGenerator', () => {
  it('should render form', () => {
    render(<PaydayCalendarGenerator />);

    const form = screen.getByRole('form', {
      name: 'payday calendar generator',
    });
    expect(form).toBeInTheDocument();
  });

  it("should render 'Payroll Period' select field", () => {
    render(<PaydayCalendarGenerator />);

    const payrollPeriodSelect = screen.getByRole('combobox', {
      name: 'payroll period',
    });
    expect(payrollPeriodSelect).toBeInTheDocument();

    const noValueSelectOption = screen.getByRole('option', {
      name: 'Please select a period',
    });
    expect(noValueSelectOption).toBeInTheDocument();

    const selectOptions = [
      { name: 'Weekly', value: 'weekly' },
      { name: 'Bi-weekly', value: 'bi-weekly' },
      { name: 'Semi-monthly', value: 'semi-monthly' },
      { name: 'Monthly', value: 'monthly' },
    ];
    selectOptions.forEach((option) => {
      const { name, value } = option;
      fireEvent.change(payrollPeriodSelect, {
        target: {
          value,
        },
      });
      const selectOption = screen.getByRole('option', { name });
      expect(selectOption).toBeInTheDocument();
    });
  });

  it('should render semi-monthly disclaimer', () => {
    render(<PaydayCalendarGenerator />);

    const payrollPeriodSelect = screen.getByRole('combobox', {
      name: 'payroll period',
    });
    fireEvent.change(payrollPeriodSelect, {
      target: {
        value: 'semi-monthly',
      },
    });
    const semiMonthlyDisclaimer = screen.getByText(
      "Semi-monthly doesn't require a payday option"
    );
    expect(semiMonthlyDisclaimer).toBeInTheDocument();

    const payday = screen.getByRole('group', { name: 'Payday:' });
    expect(payday).toBeInTheDocument();
  });

  it("should render 'Payday' radio field", () => {
    render(<PaydayCalendarGenerator />);

    const payday = screen.getByRole('group', { name: 'Payday: required' });
    expect(payday).toBeInTheDocument();

    const radioOptionNames = [
      'monday payday',
      'tuesday payday',
      'wednesday payday',
      'thursday payday',
      'friday payday',
    ];
    radioOptionNames.forEach((name) => {
      const radioOption = screen.getByRole('radio', { name });
      expect(radioOption).toBeInTheDocument();
    });
  });

  it("should render 'Event Title' input field", () => {
    render(<PaydayCalendarGenerator />);

    const eventTitle = screen.getByRole('textbox', { name: 'event title' });
    expect(eventTitle).toBeInTheDocument();
  });

  it('should render submit button', () => {
    render(<PaydayCalendarGenerator />);

    const submit = screen.getByRole('button', {
      name: 'Download calendar',
    });
    expect(submit).toBeInTheDocument();
  });
});
