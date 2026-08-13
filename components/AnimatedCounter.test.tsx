import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnimatedCounter from './AnimatedCounter';

// Mock framer-motion since it depends on browser APIs not fully in jsdom
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    useInView: () => true, // Force to be in view for testing
    motion: {
      span: (() => {
        const Span = React.forwardRef(({ children, ...props }: any, ref: any) => (
          <span {...props} ref={ref}>{children}</span>
        ));
        Span.displayName = 'MotionSpan';
        return Span;
      })(),
    },
  };
});

describe('AnimatedCounter', () => {
  it('renders initial state with prefix and suffix', () => {
    render(<AnimatedCounter end={100} prefix="$" suffix="k" />);
    expect(screen.getByText(/\$/)).toBeInTheDocument();
    expect(screen.getByText(/k/)).toBeInTheDocument();
  });
});
