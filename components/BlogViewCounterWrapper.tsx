'use client';

import dynamic from 'next/dynamic';

const BlogViewCounter = dynamic(() => import('@/components/BlogViewCounter'), { ssr: false });

export default function BlogViewCounterWrapper({ slug }: { slug: string }) {
  return <BlogViewCounter slug={slug} />;
}
