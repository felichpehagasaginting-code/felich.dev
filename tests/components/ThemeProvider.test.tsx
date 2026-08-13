import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockSetTheme = vi.fn();

vi.mock('@/lib/store', () => ({
  useLayoutStore: vi.fn(() => ({
    theme: 'noir',
    setTheme: mockSetTheme,
  })),
}));

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.documentElement.className = '';
  });

  it('applies theme class to html element', async () => {
    const ThemeProvider = (await import('@/components/ThemeProvider')).default;
    render(<ThemeProvider><div>test</div></ThemeProvider>);
    expect(document.documentElement.classList.contains('theme-noir')).toBe(true);
  });

  it('renders children', async () => {
    const ThemeProvider = (await import('@/components/ThemeProvider')).default;
    const { getByText } = render(<ThemeProvider><div>child</div></ThemeProvider>);
    expect(getByText('child')).toBeInTheDocument();
  });
});
