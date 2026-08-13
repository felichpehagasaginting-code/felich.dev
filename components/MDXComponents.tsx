'use client';

import { motion } from 'framer-motion';
import React from 'react';
import Reveal from './Reveal';
export { Reveal };

export const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
    className="my-6"
  >
    {children}
  </motion.div>
);

export const TimelineItem = ({ date, title, children }: { date: string, title: string, children: React.ReactNode }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-8 py-4 border-l-2 border-[var(--brand)] mb-4 group"
  >
    <div className="absolute -left-[9px] top-5 w-4 h-4 rounded-full bg-[var(--brand)] group-hover:scale-150 transition-transform" />
    <span className="text-xs font-bold text-[var(--brand)] uppercase tracking-wider">{date}</span>
    <h4 className="text-lg font-bold text-[var(--text-primary)] mt-1 mb-2">{title}</h4>
    <div className="text-[var(--text-muted)] text-sm">{children}</div>
  </motion.div>
);

export const HighlightBox = ({ children, type = 'info' }: { children: React.ReactNode, type?: 'info' | 'warning' }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-2xl border my-8 ${
      type === 'warning' 
        ? 'bg-orange-500/10 border-orange-500/20 text-orange-900 dark:text-orange-200' 
        : 'bg-[var(--brand-bg)] border-[var(--brand)]/25 text-[var(--brand-strong,var(--brand))]'
    }`}
  >
    {children}
  </motion.div>
);

export const MdxH1 = (props: any) => <Reveal><h1 className="text-4xl font-extrabold mt-12 mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand)] to-[var(--brand-strong,var(--brand))]" {...props} /></Reveal>;
export const MdxH2 = (props: any) => <Reveal><h2 className="text-3xl font-bold mt-10 mb-4 text-[var(--text-primary)]" {...props} /></Reveal>;
export const MdxH3 = (props: any) => <FadeIn><h3 className="text-2xl font-bold mt-8 mb-3" {...props} /></FadeIn>;
export const MdxP = (props: any) => <p className="mb-6 text-[var(--text-muted)] leading-relaxed text-lg" {...props} />;
export const MdxUl = (props: any) => <ul className="list-disc pl-6 mb-6 space-y-3 text-[var(--text-muted)] text-lg" {...props} />;
export const MdxLi = (props: any) => <motion.li initial={{opacity:0, x:-10}} whileInView={{opacity:1, x:0}} viewport={{once:true}} {...props} />;
export const MdxA = (props: any) => <a className="text-[var(--brand)] underline decoration-[var(--brand)]/40 underline-offset-4 hover:decoration-[var(--brand)] transition-all font-medium" {...props} />;
export const MdxStrong = (props: any) => <strong className="font-bold text-[var(--text-primary)]" {...props} />;
export const MdxBlockquote = (props: any) => <blockquote className="border-l-4 border-primary pl-6 italic text-[var(--text-muted)] my-8" {...props} />;
export const MdxCode = (props: any) => <code className="bg-[var(--bg-muted)] px-1.5 py-0.5 rounded-md font-mono text-sm text-[var(--brand)]" {...props} />;
