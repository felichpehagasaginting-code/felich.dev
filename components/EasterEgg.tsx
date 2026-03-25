'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const CONFETTI_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

function Confetti() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.5 + Math.random() * 1.5,
    size: 6 + Math.random() * 8,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{ y: '110vh', opacity: 0, rotate: p.rotation + 720 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}

export default function EasterEgg() {
  const [activated, setActivated] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      const newSeq = [...inputSequence, e.key].slice(-KONAMI_CODE.length);
      setInputSequence(newSeq);

      if (newSeq.length === KONAMI_CODE.length && newSeq.every((k, i) => k === KONAMI_CODE[i])) {
        setActivated(true);
        setInputSequence([]);
        setTimeout(() => setActivated(false), 4000);
      }
    },
    [inputSequence]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      {activated && (
        <>
          <Confetti />
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 z-[201] flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-3xl px-8 py-6 shadow-2xl text-center">
              <p className="text-4xl mb-2">🎮</p>
              <p className="text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                You found the secret!
              </p>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                Konami Code Activated 🕹️
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
