import { render, screen } from '@/tests/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/useBlogLikes', () => ({
  useBlogLikes: vi.fn(() => ({
    likes: 42,
    hasLiked: false,
    loading: false,
    toggleLike: vi.fn(),
  })),
}));

vi.mock('@/lib/useFirestoreCounter', () => ({
  useFirestoreCounter: vi.fn(() => ({
    count: 42,
    hasActed: false,
    loading: false,
    increment: vi.fn(),
  })),
}));

describe('BlogLikeButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders like count', async () => {
    const BlogLikeButton = (await import('@/components/BlogLikeButton')).default;
    render(<BlogLikeButton slug="test-post" />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });
});
