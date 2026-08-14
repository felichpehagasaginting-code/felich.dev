'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward, Sparkles } from 'lucide-react';
import { introAudio } from '@/lib/introAudio';

interface BlogAudioReaderProps {
  title: string;
  contentSelector?: string;
}

export default function BlogAudioReader({ title, contentSelector = '.prose' }: BlogAudioReaderProps) {
  const [supported, setSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState<number>(1.0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanArticleText = useCallback(() => {
    if (typeof document === 'undefined') return title;
    const articleEl = document.querySelector(contentSelector);
    if (!articleEl) return title;

    // Clone element to remove code blocks and script tags before reading
    const clone = articleEl.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('pre, code, svg, script, style, .skip-speech').forEach(el => el.remove());
    const rawText = clone.innerText || clone.textContent || '';
    return `${title}. ${rawText.replace(/\s+/g, ' ').trim()}`;
  }, [title, contentSelector]);

  const handlePlayPause = () => {
    if (!supported || typeof window === 'undefined') return;
    introAudio.playTick(1.0);

    const synth = window.speechSynthesis;

    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
      return;
    }

    synth.cancel();
    const textToRead = cleanArticleText();
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = rate;

    // Select suitable English voice if available
    const voices = synth.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synth.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handleStop = () => {
    if (!supported || typeof window === 'undefined') return;
    introAudio.playTick(0.8);
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const cycleRate = () => {
    introAudio.playTick(1.2);
    const nextRate = rate === 1.0 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 2.0 : 1.0;
    setRate(nextRate);
    if (isPlaying && !isPaused && typeof window !== 'undefined') {
      // Re-apply rate seamlessly
      const synth = window.speechSynthesis;
      synth.cancel();
      const textToRead = cleanArticleText();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = nextRate;
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      utteranceRef.current = utterance;
      synth.speak(utterance);
    }
  };

  if (!supported) return null;

  return (
    <div className="my-6 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex flex-wrap items-center justify-between gap-4 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[var(--brand-bg)] text-[var(--brand)] flex items-center justify-center">
          <Volume2 size={20} className={isPlaying && !isPaused ? 'animate-pulse' : ''} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-display font-bold text-[var(--text-primary)]">Audio Narration</span>
            {isPlaying && !isPaused && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-[var(--brand)] bg-[var(--brand-bg)] px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)] animate-ping" />
                Playing
              </span>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-mono">
            Listen to this article with speech synthesis
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handlePlayPause}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--brand)] text-[var(--brand-contrast)] hover:brightness-110 transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause size={14} />
              <span>Pause</span>
            </>
          ) : isPaused ? (
            <>
              <Play size={14} />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Play size={14} />
              <span>Listen</span>
            </>
          )}
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="p-2 rounded-xl text-xs bg-[var(--bg-muted)] hover:bg-[var(--border-default)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all cursor-pointer"
            title="Stop audio"
          >
            <RotateCcw size={14} />
          </button>
        )}

        <button
          onClick={cycleRate}
          className="px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-[var(--bg-muted)] hover:bg-[var(--border-default)] text-[var(--text-primary)] border border-[var(--border-default)] transition-all cursor-pointer"
          title="Change playback speed"
        >
          {rate}x
        </button>
      </div>
    </div>
  );
}
