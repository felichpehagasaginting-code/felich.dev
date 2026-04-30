'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

const stats = [
  'System: ONLINE',
  'AI Engine: 24ms',
  'Network: STABLE',
  'Security: ACTIVE',
  'Latency: 2ms',
];

export default function LiveTicker() {
  const [data, setData] = useState<string[]>(stats);

  // Slightly change data every 4 seconds for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const idxLat = newData.findIndex(s => s.includes('Latency'));
        const idxInf = newData.findIndex(s => s.includes('AI Engine'));
        
        if (idxLat !== -1) newData[idxLat] = `Latency: ${Math.floor(Math.random() * 5 + 1)}ms`;
        if (idxInf !== -1) newData[idxInf] = `AI Engine: ${Math.floor(Math.random() * 10 + 20)}ms`;
        
        return newData;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[80] pointer-events-none">
      <div className="bg-white/80 dark:bg-neutral-900/60 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-700/50 rounded-full shadow-2xl h-8 md:h-9 flex items-center overflow-hidden max-w-[85vw] w-[320px] md:w-[450px]">
        
        {/* Label Badge */}
        <div className="flex h-full items-center gap-1.5 px-3 md:px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white z-10 flex-shrink-0 shadow-lg">
          <Activity size={12} className="animate-pulse" />
          <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
            Live
          </span>
        </div>
        
        {/* Scrolling Content */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center">
          {/* Fading Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white/80 dark:from-neutral-900/60 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white/80 dark:from-neutral-900/60 to-transparent z-10" />
          
          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: '-50%' }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-8 whitespace-nowrap pl-4"
          >
            {[...data, ...data].map((stat, i) => (
              <span key={i} className="text-[10px] md:text-[11px] font-mono font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                {stat}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
