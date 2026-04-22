'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function SpotifyWidget() {
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Simulated animation for sound bars
  const bars = Array.from({ length: 4 });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-4 p-3 rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-sm cursor-pointer hover:shadow-md transition-all w-fit"
    >
      <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-green-500/30">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-emerald-400 opacity-20"></div>
        {/* Mock album art */}
        <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.54.659.301 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zM20.16 9.6C15.84 7.08 9.12 6.9 5.28 8.04c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.32-1.32 11.76-1.08 16.68 1.86.54.3.72 1.02.42 1.56-.3.54-1.02.72-1.56.42z"/>
          </svg>
        </div>
      </div>
      
      <div className="flex flex-col min-w-0 pr-4">
        <p className="text-[10px] uppercase font-bold tracking-widest text-green-500 mb-0.5 flex items-center gap-1.5">
          Currently Playing
          <span className="flex items-end gap-0.5 h-2.5">
            {bars.map((_, i) => (
              <motion.span 
                key={i}
                animate={isPlaying ? { height: ["20%", "100%", "40%", "80%", "20%"] } : { height: "20%" }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                className="w-0.5 bg-green-500 rounded-full"
              />
            ))}
          </span>
        </p>
        <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 truncate">Lofi Coding Beats</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">Felich Playlist</p>
      </div>
    </motion.div>
  );
}
