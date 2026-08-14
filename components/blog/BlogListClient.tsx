'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Clock, Calendar, Tag, ArrowRight, BookOpen } from 'lucide-react';
import BlogHeader from './BlogHeader';

export interface BlogPostItem {
  slug: string;
  frontMatter: {
    title: string;
    date: string;
    description: string;
    topics?: string[];
    image?: string;
  };
  readingTimeMinutes: number;
  source: 'local' | 'sanity';
}

interface BlogListClientProps {
  posts: BlogPostItem[];
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('All');

  // Extract all unique topics
  const allTopics = useMemo(() => {
    const topicSet = new Set<string>();
    posts.forEach((p) => {
      p.frontMatter.topics?.forEach((t) => topicSet.add(t));
    });
    return ['All', ...Array.from(topicSet).sort()];
  }, [posts]);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const titleMatch = post.frontMatter.title.toLowerCase().includes(searchQuery.toLowerCase());
      const descMatch = post.frontMatter.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSearch = titleMatch || descMatch;

      if (!matchesSearch) return false;
      if (selectedTopic === 'All') return true;
      return post.frontMatter.topics?.includes(selectedTopic);
    });
  }, [posts, searchQuery, selectedTopic]);

  return (
    <div className="space-y-10">
      <BlogHeader count={posts.length} />

      {/* ── Search & Topic Filter Bar ───────────────────────────────── */}
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search technical articles, insights, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input pl-10 py-3 text-xs md:text-sm rounded-xl"
            aria-label="Search articles"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Topic Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {allTopics.map((topic) => {
            const isSelected = selectedTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold shadow-xs'
                    : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="dotted-divider" />

      {/* ── Posts Timeline List ─────────────────────────────────────── */}
      {filteredPosts.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-[var(--border-default)] text-center space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-[var(--text-muted)] opacity-50" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">No articles found</p>
          <p className="text-xs text-[var(--text-muted)]">
            Try searching for a different keyword or resetting the topic filter.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 md:pl-10 space-y-8">
          {/* Vertical Timeline Guide */}
          <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-gradient-to-b from-[var(--brand)] via-[var(--brand)]/30 to-transparent" />

          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.slug}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ delay: index * 0.04 }}
                className="relative group"
              >
                {/* Timeline Marker Dot */}
                <div className="absolute -left-6 md:-left-10 top-6 w-3.5 h-3.5 rounded-full bg-[var(--brand)] border-2 border-[var(--bg-base)] group-hover:scale-125 transition-transform duration-300 shadow-sm" />

                <Link
                  href={`/blog/${post.slug}`}
                  className="block p-5 md:p-6 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand)] rounded-2xl transition-all duration-200 shadow-xs hover:shadow-md group-hover:-translate-y-0.5"
                >
                  <div className="space-y-3">
                    {/* Meta header: Date, Reading Time, Topics */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--brand-bg)] border border-[var(--brand)]/20 text-[var(--brand)] text-[11px] font-semibold">
                        <Calendar size={11} />
                        {new Date(post.frontMatter.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--bg-muted)] text-[var(--text-muted)] text-[11px]">
                        <Clock size={11} />
                        {post.readingTimeMinutes} min read
                      </span>

                      {post.frontMatter.topics?.slice(0, 2).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded-md bg-[var(--bg-muted)] border border-[var(--border-default)] text-[var(--text-muted)] text-[10px]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg md:text-xl font-display font-bold text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors leading-snug">
                      {post.frontMatter.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs md:text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                      {post.frontMatter.description}
                    </p>

                    {/* Read More Link */}
                    <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-[var(--brand)] group-hover:translate-x-1 transition-transform">
                      <span>Read Full Article</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
