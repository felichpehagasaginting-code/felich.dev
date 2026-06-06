'use client';

import { useBlogLikes } from '@/lib/useBlogLikes';
import { motion } from 'framer-motion';

export default function BlogLikeButton({ slug }: { slug: string }) {
  const { likes, hasLiked, loading, toggleLike } = useBlogLikes(slug);

  return (
    <div className="flex flex-col items-center justify-center gap-3 my-12">
      <motion.button
        onClick={toggleLike}
        disabled={hasLiked || loading}
        whileHover={!hasLiked ? { scale: 1.08 } : {}}
        whileTap={!hasLiked ? { scale: 0.92 } : {}}
        className={`relative flex items-center justify-center w-20 h-20 rounded-full shadow-2xl transition-all duration-300 ${
          hasLiked
            ? 'bg-pink-500 text-white shadow-pink-500/40 cursor-default'
            : 'bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 border-2 border-neutral-100 dark:border-neutral-800 hover:border-pink-200 dark:hover:border-pink-900/50 hover:text-pink-500 hover:shadow-pink-500/20'
        }`}
      >
        {hasLiked && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1.5, 2.5], opacity: [0.5, 0] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-pink-400"
          />
        )}
        <motion.svg
          animate={hasLiked ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 0.4, type: "spring" }}
          className="w-10 h-10"
          fill={hasLiked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </motion.svg>
      </motion.button>

      <div className="text-center">
        <span className="block text-2xl font-black text-neutral-800 dark:text-neutral-200">
          {loading ? '...' : likes}
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
          {hasLiked ? 'Thank you!' : 'Clap if you liked it'}
        </span>
      </div>
    </div>
  );
}
