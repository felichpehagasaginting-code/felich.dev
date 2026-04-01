'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const logLines = [
  'Optimizing neural weights...',
  'Scanning portfolio context...',
  'Context window: 128k [OK]',
  'Analyzing user session...',
  'GPU Cluster: 4-node ACTIVE',
  'Latent space exploration: 94%',
  'Training epoch: 12/20',
  'Model inference: 14ms',
  'Vector DB sync: COMPLETED',
  'Felich Engine: V1.2.4',
  'Security handshake: SECURE',
  'Processing metadata...',
  'Token capacity: 100%',
  'Latency: 2ms',
  'System temperature: 42°C',
];

export default function NeuralHUD() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMinimized(true);
    }

    const interval = setInterval(() => {
      setLogs((prev) => {
        const nextLog = logLines[Math.floor(Math.random() * logLines.length)];
        const newLogs = [...prev, `[${new Date().toLocaleTimeString([], { hour12: false })}] ${nextLog}`];
        return newLogs.slice(-10); // Keep last 10 lines
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed bottom-10 right-4 md:right-8 z-[100] pointer-events-auto">
      <AnimatePresence mode="popLayout">
        {!isMinimized ? (
          <motion.div
            key="hud-main"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-64 md:w-72 bg-neutral-900/90 dark:bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded-xl shadow-2xl p-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Neural HUD</span>
              </div>
              <button 
                onClick={() => setIsMinimized(true)}
                className="text-neutral-500 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4"/></svg>
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="h-32 overflow-y-auto scrollbar-hide space-y-1.5"
            >
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.p
                    key={log + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-[9px] font-mono text-blue-500/80 leading-tight"
                  >
                    {log}
                  </motion.p>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 pt-2 border-t border-neutral-800/50 flex items-center justify-between">
               <div className="flex gap-1.5">
                  <div className="w-1 h-3 bg-blue-500/30 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ height: ["20%", "80%", "40%"] }} 
                      transition={{ duration: 2, repeat: Infinity }} 
                      className="w-full bg-blue-500" 
                    />
                  </div>
                  <div className="w-1 h-3 bg-green-500/30 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ height: ["60%", "30%", "90%"] }} 
                      transition={{ duration: 1.5, repeat: Infinity }} 
                      className="w-full bg-green-500" 
                    />
                  </div>
               </div>
               <span className="text-[8px] font-mono text-neutral-600">INF_NODE_V1.2</span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="hud-min"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsMinimized(false)}
            className="p-3 bg-neutral-900/90 dark:bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded-full shadow-lg group hover:border-blue-500/50 transition-colors"
          >
            <div className="w-4 h-4 text-blue-500">
               <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
