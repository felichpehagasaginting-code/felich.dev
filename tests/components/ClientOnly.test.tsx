import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('ClientOnly', () => {
  it('renders children after mount', async () => {
    const ClientOnly = (await import('@/components/ClientOnly')).default;
    const { container } = render(<ClientOnly><span>visible</span></ClientOnly>);
    expect(container.textContent).toBe('visible');
  });
});
