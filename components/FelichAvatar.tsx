'use client';

import React from 'react';

interface FelichAvatarProps {
  size?: number;
  className?: string;
  showBadge?: boolean;
}

export default function FelichAvatar({
  size = 96,
  className = '',
  showBadge = false,
}: FelichAvatarProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label="Felich Avatar"
    >
      {/* Outer subtle glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--brand)] via-purple-500 to-cyan-400 opacity-25 blur-md" />

      {/* Main Avatar Container */}
      <div className="relative w-full h-full rounded-full p-[2px] bg-gradient-to-tr from-[var(--brand)] via-purple-500 to-cyan-400 overflow-hidden shadow-lg">
        <div className="w-full h-full rounded-full bg-[var(--bg-base)] flex items-center justify-center relative overflow-hidden">
          {/* Subtle geometric background grid lines inside */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--brand)_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* Glowing Monogram */}
          <span
            className="font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-tr from-[var(--brand)] via-purple-400 to-cyan-400 relative z-10"
            style={{ fontSize: `${Math.round(size * 0.42)}px` }}
          >
            F
          </span>
        </div>
      </div>

      {/* Verified Status Badge */}
      {showBadge && (
        <div
          className="absolute -bottom-1 -right-1 rounded-full bg-[var(--bg-base)] p-0.5 shadow-md flex items-center justify-center"
          style={{ width: Math.max(16, Math.round(size * 0.28)), height: Math.max(16, Math.round(size * 0.28)) }}
          title="Verified Developer"
        >
          <svg
            className="w-full h-full text-[var(--brand)]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      )}
    </div>
  );
}
