'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Check, Send } from 'lucide-react';
import { introAudio } from '@/lib/introAudio';

interface BlogShareBarProps {
  title: string;
  slug: string;
}

export default function BlogShareBar({ title, slug }: BlogShareBarProps) {
  const [copied, setCopied] = useState(false);

  const getArticleUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://felich.dev/blog/${slug}`;
  };

  const copyToClipboard = () => {
    introAudio.playTick(1.0);
    const url = getArticleUrl();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const shareToTwitter = () => {
    const url = encodeURIComponent(getArticleUrl());
    const text = encodeURIComponent(`Check out "${title}" by @fel_comp:`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = encodeURIComponent(getArticleUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(getArticleUrl());
    const text = encodeURIComponent(`"${title}" - Read here: ${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="my-8 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Share2 size={16} className="text-[var(--brand)]" />
        <span className="text-xs font-display font-bold text-[var(--text-primary)]">Share this article:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={shareToTwitter}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-muted)] hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] border border-[var(--border-default)] transition-all cursor-pointer"
        >
          𝕏 / Twitter
        </button>

        <button
          onClick={shareToLinkedIn}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-muted)] hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] border border-[var(--border-default)] transition-all cursor-pointer"
        >
          LinkedIn
        </button>

        <button
          onClick={shareToWhatsApp}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-muted)] hover:bg-[#25D366]/10 hover:text-[#25D366] border border-[var(--border-default)] transition-all cursor-pointer"
        >
          WhatsApp
        </button>

        <button
          onClick={copyToClipboard}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
            copied
              ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/30'
              : 'bg-[var(--brand)] text-[var(--brand-contrast)] border-transparent hover:brightness-110 shadow-xs'
          }`}
        >
          {copied ? (
            <>
              <Check size={13} />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon size={13} />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
