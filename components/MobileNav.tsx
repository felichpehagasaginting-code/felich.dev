'use client';

import { useLayoutStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { sounds } from '@/lib/sounds';
import { triggerImpact } from '@/lib/impact';

import { AnimatePresence, motion } from 'framer-motion';
import Magnetic from '@/components/Magnetic';
import Logo from '@/components/Logo';

const navLinks = [
  {
    href: '/', label: 'Home', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    )
  },
  {
    href: '/about', label: 'About', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    )
  },
  {
    href: '/achievements', label: 'Achievements', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    )
  },
  {
    href: '/projects', label: 'Projects', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
    )
  },
  {
    href: '/blog', label: 'Blog', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    )
  },
  {
    href: '/dashboard', label: 'Dashboard', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
    )
  },
  {
    href: '/contact', label: 'Contact', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    )
  },
  {
    href: '/guestbook', label: 'Guestbook', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    )
  },
  {
    href: '/uses', label: 'Uses', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )
  },
  {
    href: '/links', label: 'Links', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
    )
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { mobileMenuOpen, setMobileMenuOpen, theme, setTheme, language, toggleLanguage, triggerWarp } = useLayoutStore();

  return (
    <>
      <div className="fixed top-3 left-3 right-3 z-50 lg:hidden pointer-events-none">
        <div className="flex items-center justify-between px-5 py-3 glass-panel shadow-apple pointer-events-auto liquid-glass !rounded-[1.5rem]">
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-tighter">
            <Logo className="w-6 h-6" />
            <span>Felich<span className="text-primary">.dev</span></span>
          </Link>
          <button
            onClick={() => { setMobileMenuOpen(!mobileMenuOpen); sounds.playPop(); }}
            onMouseEnter={() => sounds.playHover()}
            className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%', scale: 0.95 }}
              animate={{ x: 0, scale: 1 }}
              exit={{ x: '-100%', scale: 0.95 }}
              transition={{ type: 'spring', damping: 24, stiffness: 250 }}
              className="fixed left-3 top-3 bottom-3 w-[calc(100vw-1.5rem)] max-w-sm z-50 overflow-y-auto p-6 lg:hidden glass-panel shadow-apple custom-scrollbar liquid-glass !rounded-[2.5rem]"
              data-lenis-prevent
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Magnetic>
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
                  </Magnetic>
                  <div>
                    <h2 className="font-bold flex items-center gap-1">
                      Felich
                      <svg className="w-3.5 h-3.5 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => { setMobileMenuOpen(false); sounds.playPop(); }}
                  onMouseEnter={() => sounds.playHover()}
                  className="p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => { toggleLanguage(); sounds.playSwitch(); }}
                  onMouseEnter={() => sounds.playHover()}
                  className="relative flex items-center p-1 rounded-full bg-neutral-100/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5 group"
                >
                  <div 
                    className={`absolute inset-1 w-[calc(50%-4px)] bg-primary rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                      language === 'id' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'
                    }`}
                  />
                  <span className={`relative z-10 px-4 py-1.5 text-[10px] font-black tracking-widest transition-colors duration-300 ${language === 'en' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    US
                  </span>
                  <span className={`relative z-10 px-4 py-1.5 text-[10px] font-black tracking-widest transition-colors duration-300 ${language === 'id' ? 'text-white' : 'text-neutral-500 dark:text-neutral-400'}`}>
                    ID
                  </span>
                </button>

                <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-neutral-100/50 dark:bg-white/5 border border-neutral-200 dark:border-white/5">
                  {[
                    { 
                      key: 'light' as const, 
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="5" strokeWidth={2} />
                          <path strokeWidth={2} strokeLinecap="round" d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42" />
                        </svg>
                      ), 
                      color: '#ffffff' 
                    },
                    { 
                      key: 'dark' as const, 
                      icon: (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                        </svg>
                      ), 
                      color: '#171717' 
                    },
                    { 
                      key: 'yellow' as const, 
                      icon: (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 1v3M10 1v3M14 1v3" />
                        </svg>
                      ), 
                      color: '#fef9ed' 
                    },
                    { 
                      key: 'apple' as const, 
                      icon: (
                        <svg className="w-4 h-4" viewBox="0 0 384 512" fill="currentColor">
                          <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                        </svg>
                      ), 
                      color: '#ffffff' 
                    },
                  ].map((t) => (
                    <Magnetic key={t.key}>
                      <button
                        onClick={(e) => { 
                          setTheme(t.key); 
                          triggerWarp(e.clientX, e.clientY, t.color);
                          triggerImpact();
                          sounds.playSwitch(); 
                        }}
                        onMouseEnter={() => sounds.playHover()}
                        className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300 ${
                          theme === t.key 
                            ? 'bg-white dark:bg-white/10 text-primary shadow-apple ring-1 ring-black/5 dark:ring-white/10' 
                            : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <motion.div whileTap={{ scale: 0.9 }}>
                          {t.icon}
                        </motion.div>
                      </button>
                    </Magnetic>
                  ))}
                </div>
              </div>

              <hr className="border-neutral-200 dark:border-neutral-800 mb-4" />

              <nav className="space-y-1">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => { setMobileMenuOpen(false); sounds.playPop(); }}
                        onMouseEnter={() => sounds.playHover()}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                          }`}
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.label}</span>
                        {isActive && (
                          <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </Link>
                    </motion.div>
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