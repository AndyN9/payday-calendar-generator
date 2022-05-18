import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import App from './App';

afterEach(() => {
  cleanup();
});

describe('App', () => {
  it('should have a title', () => {
    render(<App />);
    const title = screen.getByRole('heading', {
      name: 'Payday Calendar Generator',
      level: 1,
    });
    expect(title).toBeInTheDocument();
  });
});
