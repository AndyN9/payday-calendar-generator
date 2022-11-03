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
    expect(form).toBeVisible();
  });

  it("should render 'Payroll Period' select field", () => {
    render(<PaydayCalendarGenerator />);

    const payrollPeriodSelect = screen.getByRole('combobox', {
      name: 'payroll period',
    });
    expect(payrollPeriodSelect).toBeVisible();
    expect(payrollPeriodSelect).toBeRequired();

    const selectOptionLabels = [
      'Please select a period',
      'Weekly',
      'Bi-weekly',
      'Semi-monthly',
      'Monthly',
    ];
    selectOptionLabels.forEach((label) => {
      const selectOption = screen.getByRole('option', { name: label });
      expect(selectOption).toBeVisible();
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
    expect(semiMonthlyDisclaimer).toBeVisible();

    const payday = screen.getByRole('group', { name: 'Payday:' });
    expect(payday).toBeVisible();

    const radioOptionNames = [
      'monday payday',
      'tuesday payday',
      'wednesday payday',
      'thursday payday',
      'friday payday',
    ];
    radioOptionNames.forEach((name) => {
      const radioOption = screen.getByRole('radio', { name });
      expect(radioOption).toBeVisible();
      expect(radioOption).toBeDisabled();

      if (name === 'friday payday') {
        expect(radioOption).toBeChecked();
      }
    });
  });

  it("should render 'Payday' radio field", () => {
    render(<PaydayCalendarGenerator />);

    const payday = screen.getByRole('group', { name: 'Payday: required' });
    expect(payday).toBeVisible();

    const radioOptionNames = [
      'monday payday',
      'tuesday payday',
      'wednesday payday',
      'thursday payday',
      'friday payday',
    ];
    radioOptionNames.forEach((name) => {
      const radioOption = screen.getByRole('radio', { name });
      expect(radioOption).toBeVisible();

      if (name === 'friday payday') {
        expect(radioOption).toBeChecked();
      }
    });
  });

  it("should render 'Event Title' input field", () => {
    render(<PaydayCalendarGenerator />);

    const eventTitle = screen.getByRole('textbox', { name: 'event title' });
    expect(eventTitle).toBeVisible();
  });

  it("should render 'Download calendar' button", () => {
    render(<PaydayCalendarGenerator />);

    const submit = screen.getByRole('button', {
      name: 'download calendar',
    });
    expect(submit).toBeVisible();
  });
});
