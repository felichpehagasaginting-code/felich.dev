'use client';

import { useLayoutStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function LayoutToggle() {
  const { isSidebar, toggleLayout } = useLayoutStore();
  const { t } = useTranslation();

  return (
    <motion.button
      onClick={toggleLayout}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed top-4 right-4 z-50 p-3 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl shadow-xl border border-neutral-200/50 dark:border-neutral-800/50 hover:shadow-2xl transition-all lg:hidden"
    >
      {isSidebar ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13v2H3V4zm0 4h13v2H3V8zm0 4h13v2H3v-2zm0 4h13v2H3v-2z" />
        </svg>
      )}
    </motion.button>
  );
}

