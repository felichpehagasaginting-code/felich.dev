'use client';

import React, { useState, useRef } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { introAudio } from '@/lib/introAudio';

export default function MdxPre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const extractLanguage = () => {
    if (React.isValidElement(children)) {
      const className = (children.props as any)?.className || '';
      const match = className.match(/language-(\w+)/);
      if (match) return match[1].toUpperCase();
    }
    return 'CODE';
  };

  const handleCopy = () => {
    introAudio.playTick(1.0);
    if (!preRef.current) return;
    const text = preRef.current.innerText || '';
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const language = extractLanguage();

  return (
    <div className="my-6 rounded-2xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-md">
      {/* Code Block Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[var(--bg-muted)] border-b border-[var(--border-default)]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--bg-base)] text-[var(--text-muted)]">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] transition-all cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={12} className="text-[var(--success)]" />
              <span className="text-[var(--success)]">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      <pre
        ref={preRef}
        {...props}
        className="p-4 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed bg-[var(--bg-base)] text-[var(--text-primary)]"
      >
        {children}
      </pre>
    </div>
  );
}
