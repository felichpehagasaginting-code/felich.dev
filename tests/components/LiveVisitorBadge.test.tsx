import { render, screen } from '@/tests/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/useVisitorTracking', () => ({
  useVisitorTracking: vi.fn(() => ({
    onlineCount: 5,
    totalViews: 1000,
  })),
}));

describe('LiveVisitorBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders online count', async () => {
    const LiveVisitorBadge = (await import('@/components/LiveVisitorBadge')).default;
    render(<LiveVisitorBadge />);
    expect(screen.getByText(/5L/)).toBeInTheDocument();
  });

  it('renders total views', async () => {
    const LiveVisitorBadge = (await import('@/components/LiveVisitorBadge')).default;
    render(<LiveVisitorBadge showViews={true} />);
    expect(screen.getByText(/1.000/)).toBeInTheDocument();
  });

  it('accepts custom className', async () => {
    const LiveVisitorBadge = (await import('@/components/LiveVisitorBadge')).default;
    const { container } = render(<LiveVisitorBadge className="custom-class" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain('custom-class');
  });
});
