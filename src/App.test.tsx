import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import App from './App';

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('should have a title and subtitle', () => {
    const app = render(<App />);
    expect(app).toMatchSnapshot();

    const title = screen.getByRole('heading', {
      name: 'Payday Calendar Generator',
      level: 1,
    });
    expect(title).toBeInTheDocument();

    const subtitle = screen.getByText(/Required fields are followed by/);
    expect(subtitle).toBeInTheDocument();
  });
});
