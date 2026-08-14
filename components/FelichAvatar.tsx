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
      <div className="absolute inset-0 rounded-full bg-[var(--brand)] opacity-20 blur-md transition-all duration-300" />

      {/* Main Avatar Container */}
      <div className="relative w-full h-full rounded-full p-[2px] bg-[var(--border-default)] hover:border-[var(--brand)] transition-colors duration-300 overflow-hidden shadow-md">
        <div className="w-full h-full rounded-full bg-[var(--bg-surface)] flex items-center justify-center relative overflow-hidden">
          {/* Subtle geometric background grid lines inside */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(var(--brand)_1px,transparent_1px)] [background-size:8px_8px]" />

          {/* Theme-Adaptive Vector SVG Monogram "F" */}
          <svg
            width={Math.round(size * 0.48)}
            height={Math.round(size * 0.48)}
            viewBox="0 0 48 48"
            fill="none"
            className="relative z-10 transition-transform duration-300 group-hover:scale-105 drop-shadow-sm"
          >
            <defs>
              <linearGradient id="felichAvatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--brand-strong, var(--brand))" />
                <stop offset="100%" stopColor="var(--brand)" />
              </linearGradient>
            </defs>
            <path
              d="M 12 8 L 36 8 C 37.1 8 38 8.9 38 10 L 38 13 C 38 14.1 37.1 15 36 15 L 20 15 L 20 22 L 32 22 C 33.1 22 34 22.9 34 24 L 34 27 C 34 28.1 33.1 29 32 29 L 20 29 L 20 38 C 20 39.1 19.1 40 18 40 L 14 40 C 12.9 40 12 39.1 12 38 Z"
              fill="url(#felichAvatarGrad)"
              stroke="var(--border-default)"
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
            <circle cx="34" cy="36" r="2.8" fill="var(--brand)" opacity="0.9" />
          </svg>
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
