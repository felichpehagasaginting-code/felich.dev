import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Metadata } from 'next';
import PageTransition from '@/components/PageTransition';
import Link from 'next/link';
import BlogViewCounterWrapper from '@/components/BlogViewCounterWrapper';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost({ slug });
  return {
    title: post.frontMatter.title,
    description: post.frontMatter.description,
    openGraph: {
      title: post.frontMatter.title,
      description: post.frontMatter.description,
      type: 'article',
      publishedTime: post.frontMatter.date,
      authors: ['Felich'],
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.frontMatter.title)}&description=${encodeURIComponent(post.frontMatter.description || '')}&type=blog`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.frontMatter.title,
      description: post.frontMatter.description,
    },
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'content', 'blog'));
  return files.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }));
}

function getPost({ slug }: { slug: string }) {
  const markdownFile = fs.readFileSync(
    path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`),
    'utf-8'
  );

  const { data: frontMatter, content } = matter(markdownFile);

  return {
    frontMatter,
    slug,
    content,
  };
}

import { 
  MdxH1, MdxH2, MdxH3, MdxP, MdxUl, MdxLi, 
  MdxA, MdxStrong, MdxBlockquote, MdxCode, 
  FadeIn, TimelineItem, HighlightBox, Reveal 
} from '@/components/MDXComponents';

const componentsMap = {
  h1: MdxH1,
  h2: MdxH2,
  h3: MdxH3,
  p: MdxP,
  ul: MdxUl,
  li: MdxLi,
  a: MdxA,
  strong: MdxStrong,
  blockquote: MdxBlockquote,
  code: MdxCode,
  FadeIn,
  TimelineItem,
  HighlightBox,
  Reveal
};

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const props = getPost({ slug });

  return (
    <PageTransition>
      <article className="max-w-3xl mx-auto py-8">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{props.frontMatter.title}</h1>
        
        <div className="flex items-center flex-wrap gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-8">
          <span>{new Date(props.frontMatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <BlogViewCounterWrapper slug={slug} />
          <div className="flex gap-2">
            {props.frontMatter.topics?.map((topic: string) => (
              <span key={topic} className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-[10px] font-semibold">
                {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXRemote source={props.content} components={componentsMap} />
        </div>
      </article>
    </PageTransition>
  );
}
