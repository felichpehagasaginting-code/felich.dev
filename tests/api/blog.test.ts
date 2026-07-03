import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockContent = `---
title: Test Post
description: A test post
date: 2025-01-01
topics: [testing, vitest]
---
# Test Content
`;

const mockExistsSync = vi.fn((filePath: string) => {
  const result = filePath.includes('test-post');
  return result;
});
const mockReadFileSync = vi.fn(() => mockContent);

vi.mock('fs', () => ({
  default: {
    existsSync: mockExistsSync,
    readFileSync: mockReadFileSync,
    readdirSync: vi.fn(() => ['test-post.mdx']),
  },
  existsSync: mockExistsSync,
  readFileSync: mockReadFileSync,
  readdirSync: vi.fn(() => ['test-post.mdx']),
}));

describe('Blog API Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 404 for non-existent post', async () => {
    const { GET } = await import('@/app/api/blog/[slug]/route');
    const req = new Request('http://localhost:3000/api/blog/nonexistent');
    const res = await GET(req, { params: Promise.resolve({ slug: 'nonexistent' }) });
    expect(res.status).toBe(404);
    const data = await res.json();
    expect(data.error).toBe('Post not found');
  });

  it('returns post data for existing slug', async () => {
    const { GET } = await import('@/app/api/blog/[slug]/route');
    const req = new Request('http://localhost:3000/api/blog/test-post');
    const res = await GET(req, { params: Promise.resolve({ slug: 'test-post' }) });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty('frontMatter');
    expect(data).toHaveProperty('content');
    expect(data.frontMatter.title).toBe('Test Post');
    expect(data.frontMatter.topics).toEqual(['testing', 'vitest']);
  });
});
