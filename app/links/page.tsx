'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import Image from 'next/image';

const links = [
  {
    title: 'Portfolio Website',
    description: 'You are here! My personal portfolio.',
    url: '/',
    icon: '🌐',
    gradient: 'from-blue-500 to-purple-600',
    internal: true,
  },
  {
    title: 'GitHub',
    description: 'Open-source projects & contributions.',
    url: 'https://github.com/felichpehagasaginting-code',
    icon: '🐙',
    gradient: 'from-neutral-700 to-neutral-900',
  },
  {
    title: 'LinkedIn',
    description: 'Professional profile & connections.',
    url: 'https://www.linkedin.com/in/felich-pehagasa-ginting',
    icon: '💼',
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    title: 'Instagram',
    description: 'Creative journey & daily life.',
    url: 'https://www.instagram.com/fel.comp',
    icon: '📸',
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
  },
  {
    title: 'Email',
    description: 'Reach me for collaborations.',
    url: 'mailto:felichpehagasaginting@gmail.com',
    icon: '✉️',
    gradient: 'from-red-500 to-rose-600',
  },
  {
    title: 'Google Sites Portfolio',
    description: 'My portfolio on Google Sites.',
    url: 'https://sites.google.com/view/felichs-portfolio',
    icon: '📄',
    gradient: 'from-emerald-500 to-teal-600',
  },
];

export default function Links() {
  return (
    <PageTransition>
      <div className="max-w-md mx-auto">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden ring-4 ring-neutral-200/50 dark:ring-neutral-700/50 shadow-lg mb-4">
            <Image
              src="/images/profile.jpg"
              alt="Felich"
              fill
              className="object-cover"
              sizes="96px"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">Felich</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Software Engineer • AI Enthusiast
          </p>
        </motion.div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link, i) => (
            <motion.a
              key={link.title}
              href={link.url}
              target={link.internal ? '_self' : '_blank'}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`block p-4 rounded-2xl bg-gradient-to-r ${link.gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{link.icon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">{link.title}</h3>
                  <p className="text-xs text-white/70">{link.description}</p>
                </div>
                <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-neutral-400 mt-8"
        >
          &copy; {new Date().getFullYear()} Felich. All rights reserved.
        </motion.p>
      </div>
    </PageTransition>
  );
}
