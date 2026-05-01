import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Metadata } from 'next';
import PageTransition from '@/components/PageTransition';
import Link from 'next/link';
import BlogViewCounterWrapper from '@/components/BlogViewCounterWrapper';
import ScrollProgressBar from '@/components/ScrollProgressBar';
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost({ slug });
  return {
    title: post.frontMatter.title,
    description: post.frontMatter.description,
  };
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'content', 'blog'));
  return files.map((filename) => ({
    slug: filename.replace('.mdx', ''),
  }));
}

function getPost({ slug }: { slug: string }) {
  const filePath = path.join(process.cwd(), 'content', 'blog', `${slug}.mdx`);
  const markdownFile = fs.readFileSync(filePath, 'utf-8');
  const { data: frontMatter, content } = matter(markdownFile);
  return { frontMatter, content };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { frontMatter, content } = getPost({ slug });

  return (
    <PageTransition>
      <ScrollProgressBar />

      <article className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-12">
          <Link 
            href="/blog" 
            className="group inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-neutral-500 hover:text-primary transition-colors"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Archive
          </Link>
        </div>
        
        <header className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tighter">
            {frontMatter.title}
          </h1>
          
          <div className="flex items-center flex-wrap gap-6 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-12">
            <div className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary" />
              {new Date(frontMatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <BlogViewCounterWrapper slug={slug} />
            <div className="flex gap-2">
              {frontMatter.topics?.map((topic: string) => (
                <span key={topic} className="px-3 py-1 bg-neutral-100 dark:bg-white/5 rounded-full border border-neutral-200 dark:border-white/5">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {frontMatter.image && (
            <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 mb-16">
              <img src={frontMatter.image} className="object-cover w-full h-full" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          )}
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:text-lg prose-p:leading-relaxed prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:rounded-r-2xl">
          <MDXRemote source={content} components={componentsMap} />
        </div>

        <footer className="mt-24 pt-12 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col items-center text-center p-12 rounded-[3rem] bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
             <div className="w-20 h-20 rounded-full overflow-hidden mb-6 ring-4 ring-primary/20">
                <img src="/images/profile.jpg" alt="Felich" className="object-cover w-full h-full" />
             </div>
             <h3 className="text-2xl font-black mb-2">Thanks for reading.</h3>
             <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mb-8 font-medium">
               I write about building premium digital experiences and exploring the frontiers of AI.
             </p>
             <Link href="/contact" className="px-8 py-3 rounded-full bg-primary text-white font-black uppercase tracking-widest shadow-lg shadow-primary/25 hover:scale-105 transition-transform active:scale-95">
                Let&apos;s Connect
             </Link>
          </div>
        </footer>
      </article>
    </PageTransition>
  );
}
