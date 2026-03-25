'use client';

import { useLayoutStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { sounds } from '@/lib/sounds';

import { AnimatePresence, motion } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/about', label: 'About', icon: '👤' },
  { href: '/achievements', label: 'Achievements', icon: '🏆' },
  { href: '/projects', label: 'Projects', icon: '📦' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/contact', label: 'Contact', icon: '✉️' },
  { href: '/guestbook', label: 'Guestbook', icon: '📝' },
  { href: '/uses', label: 'Uses', icon: '🛠️' },
  { href: '/links', label: 'Links', icon: '🔗' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen, theme, setTheme, language, toggleLanguage } = useLayoutStore();

  return (
    <>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50">
          <Link href="/" className="text-lg font-bold">
            Felich
          </Link>
          <button
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); sounds.playPop(); }}
            className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white dark:bg-neutral-950 z-50 overflow-y-auto p-6 lg:hidden"
            >
              {/* Profile */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-neutral-200/50 dark:ring-neutral-700/50">
                    <Image
                      src="/images/profile.jpg"
                      alt="Felich"
                      fill
                      className="object-cover"
                      sizes="48px"
                      priority
                    />
                  </div>
                  <div>
                    <h2 className="font-bold flex items-center gap-1">
                      Felich
                      <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => { setMobileMenuOpen(false); sounds.playPop(); }}
                  className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => { toggleLanguage(); sounds.playSwitch(); }}
                  className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-700 overflow-hidden text-xs font-semibold"
                >
                  <span className={`px-2.5 py-1 transition-all ${language === 'en' ? 'bg-primary text-white' : 'text-neutral-500'}`}>US</span>
                  <span className={`px-2.5 py-1 transition-all ${language === 'id' ? 'bg-primary text-white' : 'text-neutral-500'}`}>ID</span>
                </button>

                <div className="flex items-center gap-1">
                  {[
                    { key: 'light' as const, icon: '☀️' },
                    { key: 'dark' as const, icon: '🌙' },
                    { key: 'yellow' as const, icon: '⚡' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      onClick={() => { setTheme(t.key); sounds.playSwitch(); }}
                      className={`theme-btn ${theme === t.key ? 'active' : ''}`}
                    >
                      {t.icon}
                    </button>
                  ))}
                </div>
              </div>

              <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />

              {/* Nav links */}
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                          : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.label}</span>
                      {isActive && (
                        <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
