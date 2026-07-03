import { render, screen } from '@/tests/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockUseBlogViews = vi.fn();

vi.mock('@/lib/useBlogViews', () => ({
  useBlogViews: (...args: any[]) => mockUseBlogViews(...args),
}));

describe('BlogViewCounter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders view count', async () => {
    mockUseBlogViews.mockReturnValue(1234);
    const BlogViewCounter = (await import('@/components/BlogViewCounter')).default;
    render(<BlogViewCounter slug="test-post" />);
    const formatted = (1234).toLocaleString();
    expect(screen.getByText(new RegExp(formatted))).toBeInTheDocument();
  });

  it('returns null when views is null', async () => {
    mockUseBlogViews.mockReturnValue(null);
    const BlogViewCounter = (await import('@/components/BlogViewCounter')).default;
    const { container } = render(<BlogViewCounter slug="test-post" />);
    expect(container.innerHTML).toBe('');
  });
});
