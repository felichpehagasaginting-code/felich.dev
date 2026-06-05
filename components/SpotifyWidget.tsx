'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SpotifyWidget() {
  const [isPlaying] = useState(true);
  
  // Simulated animation heights for sound bars
  const bars = [
    { duration: 1.2, heights: ["30%", "80%", "40%", "100%", "30%"] },
    { duration: 1.5, heights: ["20%", "100%", "50%", "70%", "20%"] },
    { duration: 1.0, heights: ["40%", "70%", "30%", "90%", "40%"] },
    { duration: 1.4, heights: ["30%", "90%", "40%", "100%", "30%"] },
    { duration: 1.2, heights: ["20%", "60%", "30%", "80%", "20%"] }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="flex items-center gap-3 px-3.5 py-2 rounded-full bg-neutral-900/5 dark:bg-white/5 backdrop-blur-md border border-neutral-200/50 dark:border-white/10 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 hover:shadow-[0_8px_30px_rgba(16,185,129,0.06)] transition-all duration-300 w-fit pointer-events-auto cursor-pointer"
    >
      {/* Spotify brand logo - spinning vinyl animation */}
      <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 shrink-0">
        <motion.div
          animate={isPlaying ? { rotate: 360 } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="flex items-center justify-center w-full h-full"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM20.16 9.6C15.84 7.08 9.12 6.9 5.28 8.04c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.32-1.32 11.76-1.08 16.68 1.86.54.3.72 1.02.42 1.56-.3.54-1.02.72-1.56.42z"/>
          </svg>
        </motion.div>
        
        {/* Subtle center pin representing vinyl record player pin */}
        <div className="absolute w-1.5 h-1.5 bg-neutral-900 dark:bg-black rounded-full border border-emerald-500/30" />
      </div>

      <div className="flex flex-col min-w-0 pr-1 select-none">
        <span className="text-[7.5px] uppercase font-bold tracking-[0.25em] text-neutral-400 dark:text-neutral-500 leading-none mb-0.5">
          Listening to
        </span>
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[120px] leading-tight">
            Lofi Coding Beats
          </p>
          <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700 shrink-0" />
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 truncate max-w-[80px] leading-tight">
            Felich Playlist
          </p>
        </div>
      </div>

      {/* Modern Waveform Visualizer */}
      <div className="flex items-end gap-[2px] h-3.5 px-1 shrink-0">
        {bars.map((bar, i) => (
          <motion.span 
            key={i}
            animate={isPlaying ? { height: bar.heights } : { height: "20%" }}
            transition={{ duration: bar.duration, repeat: Infinity, ease: "easeInOut" }}
            className="w-[2px] bg-gradient-to-t from-emerald-500 to-green-400 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
