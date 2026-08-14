'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { introAudio } from '@/lib/introAudio';

export interface SegmentOption<T extends string> {
  key: T;
  label?: string;
  icon?: (active: boolean) => React.ReactNode;
  title?: string;
}

interface DraggableSegmentedControlProps<T extends string> {
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  layoutId?: string;
  className?: string;
}

export default function DraggableSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = '',
}: DraggableSegmentedControlProps<T>) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number>(() => {
    const idx = options.findIndex((opt) => opt.key === value);
    return idx >= 0 ? idx : 0;
  });

  const activeIndex = options.findIndex((opt) => opt.key === value);
  const currentIndex = isDragging ? previewIndex : (activeIndex >= 0 ? activeIndex : 0);

  // Sync preview index when external value changes
  useEffect(() => {
    if (!isDragging) {
      const idx = options.findIndex((opt) => opt.key === value);
      if (idx >= 0) setPreviewIndex(idx);
    }
  }, [value, isDragging, options]);

  const calculateIndexFromPointer = useCallback((clientX: number): number => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(relativeX, rect.width));
    const segmentWidth = rect.width / options.length;
    const rawIdx = Math.floor(clampedX / segmentWidth);
    return Math.min(options.length - 1, Math.max(0, rawIdx));
  }, [options.length]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    const idx = calculateIndexFromPointer(e.clientX);
    setIsDragging(true);
    setPreviewIndex(idx);
    introAudio.playTick(1.0);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const nextIdx = calculateIndexFromPointer(e.clientX);
    if (nextIdx !== previewIndex) {
      setPreviewIndex(nextIdx);
      introAudio.playTick(0.9 + nextIdx * 0.1);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    const finalIdx = calculateIndexFromPointer(e.clientX);
    setIsDragging(false);
    setPreviewIndex(finalIdx);
    
    const selectedOption = options[finalIdx];
    if (selectedOption && selectedOption.key !== value) {
      introAudio.playTick(1.2);
      onChange(selectedOption.key);
    }
  };

  const handlePointerCancel = () => {
    setIsDragging(false);
    const idx = options.findIndex((opt) => opt.key === value);
    setPreviewIndex(idx >= 0 ? idx : 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (currentIndex + 1) % options.length;
      introAudio.playTick(1.0);
      onChange(options[nextIdx].key);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (currentIndex - 1 + options.length) % options.length;
      introAudio.playTick(1.0);
      onChange(options[prevIdx].key);
    }
  };

  return (
    <div
      ref={trackRef}
      role="radiogroup"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`relative flex items-center justify-between gap-1 p-1 rounded-full bg-[var(--bg-muted)]/50 border border-[var(--border-default)] w-full h-10 select-none touch-none cursor-grab active:cursor-grabbing overflow-hidden ${className}`}
    >
      {/* Sliding Pill Indicator */}
      <motion.div
        className="absolute top-1 bottom-1 bg-[var(--brand)] rounded-full shadow-sm pointer-events-none"
        animate={{
          left: `calc(${currentIndex * (100 / options.length)}% + 4px)`,
          width: `calc(${100 / options.length}% - 8px)`,
        }}
        transition={{
          type: 'spring',
          stiffness: isDragging ? 600 : 450,
          damping: isDragging ? 35 : 30,
        }}
      />

      {/* Segment Buttons */}
      {options.map((opt, i) => {
        const isSelected = value === opt.key;
        const isPreviewing = currentIndex === i;

        return (
          <div
            key={opt.key}
            role="radio"
            aria-checked={isSelected}
            title={opt.title || opt.label}
            className={`relative z-10 h-8 flex-1 rounded-full transition-colors duration-150 flex items-center justify-center pointer-events-none ${
              isPreviewing
                ? 'text-[var(--brand-contrast)] font-bold'
                : 'text-[var(--text-muted)]'
            }`}
          >
            {opt.icon ? (
              <span className="flex items-center justify-center">
                {opt.icon(isPreviewing)}
              </span>
            ) : (
              <span className="text-[10px] font-semibold tracking-widest uppercase">
                {opt.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
