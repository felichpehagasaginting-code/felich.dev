import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PageTransition from '@/components/PageTransition';
import Link from 'next/link';

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

export default function Post({ params }: { params: { slug: string } }) {
  const props = getPost(params);

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
        
        <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-8">
          <span>{new Date(props.frontMatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
