'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const stats = [
  'System Status: [ONLINE]',
  'AI Inference: 24ms',
  'Market Stream: OK',
  'Token Capacity: 100%',
  'Latency: 2ms',
  'GPU Cluster: ACTIVE',
  'Felich Engine: V1.2',
  'FinTech Security: SECURE',
];

export default function LiveTicker() {
  const [data, setData] = useState<string[]>(stats);

  // Slightly change data every 5 seconds for realism
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev];
        const idxLat = newData.findIndex(s => s.includes('Latency'));
        const idxInf = newData.findIndex(s => s.includes('Inference'));
        
        if (idxLat !== -1) newData[idxLat] = `Latency: ${Math.floor(Math.random() * 5 + 1)}ms`;
        if (idxInf !== -1) newData[idxInf] = `AI Inference: ${Math.floor(Math.random() * 10 + 20)}ms`;
        
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-6 md:h-7 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-[90] overflow-hidden flex items-center shadow-inner">
      <div className="flex h-full items-center px-2 md:px-4 bg-primary text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest z-10 whitespace-nowrap">
        Live Monitor
      </div>
      
      <div className="relative flex-1 overflow-hidden h-full flex items-center">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: '-100%' }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-10 whitespace-nowrap px-4"
        >
          {data.map((stat, i) => (
            <span key={i} className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {stat}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {data.map((stat, i) => (
            <span key={`dup-${i}`} className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {stat}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
