'use client';

import { motion } from 'framer-motion';
import React from 'react';
import Reveal from './Reveal';

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
    className="relative pl-8 py-4 border-l-2 border-blue-500/30 dark:border-blue-500/20 mb-4 group"
  >
    <div className="absolute -left-[9px] top-5 w-4 h-4 rounded-full bg-blue-500 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{date}</span>
    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mt-1 mb-2">{title}</h4>
    <div className="text-neutral-600 dark:text-neutral-400 text-sm">{children}</div>
  </motion.div>
);

export const HighlightBox = ({ children, type = 'info' }: { children: React.ReactNode, type?: 'info' | 'warning' }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`p-6 rounded-2xl border my-8 ${
      type === 'warning' 
        ? 'bg-orange-500/10 border-orange-500/20 text-orange-900 dark:text-orange-200' 
        : 'bg-blue-500/10 border-blue-500/20 text-blue-900 dark:text-blue-200'
    }`}
  >
    {children}
  </motion.div>
);

export const mdxComponents = {
  h1: (props: any) => <Reveal><h1 className="text-4xl font-extrabold mt-12 mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600" {...props} /></Reveal>,
  h2: (props: any) => <Reveal><h2 className="text-3xl font-bold mt-10 mb-4 text-neutral-900 dark:text-white" {...props} /></Reveal>,
  h3: (props: any) => <FadeIn><h3 className="text-2xl font-bold mt-8 mb-3" {...props} /></FadeIn>,
  p: (props: any) => <p className="mb-6 text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 mb-6 space-y-3 text-neutral-600 dark:text-neutral-300 text-lg" {...props} />,
  li: (props: any) => <motion.li initial={{opacity:0, x:-10}} whileInView={{opacity:1, x:0}} viewport={{once:true}} {...props} />,
  a: (props: any) => <a className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 underline decoration-blue-500/30 underline-offset-4 hover:decoration-blue-500 transition-all font-medium" {...props} />,
  strong: (props: any) => <strong className="font-bold text-neutral-900 dark:text-white" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-primary pl-6 italic text-neutral-500 dark:text-neutral-400 my-8" {...props} />,
  code: (props: any) => <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-md font-mono text-sm text-pink-500" {...props} />,
  FadeIn,
  TimelineItem,
  HighlightBox,
  Reveal
};
