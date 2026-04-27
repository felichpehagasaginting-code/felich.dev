'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CopyButton from '@/components/CopyButton';

const socials = [
  {
    title: 'Stay in Touch',
    subtitle: 'Reach out via email for inquiries or collaborations.',
    cta: 'Go to Gmail',
    href: 'mailto:felichpehagasaginting@gmail.com',
    gradient: 'from-red-600 to-red-700',
    icon: '✉️',
    fullWidth: true,
  },
  {
    title: 'Follow My Journey',
    subtitle: 'Follow my creative journey.',
    cta: 'Go to Instagram',
    href: 'https://www.instagram.com/fel.comp',
    gradient: 'from-pink-500 via-purple-500 to-orange-400',
    icon: '📸',
  },
  {
    title: "Let's Connect",
    subtitle: 'Connect with me professionally.',
    cta: 'Go to LinkedIn',
    href: 'https://www.linkedin.com/in/felich-pehagasa-ginting-...',
    gradient: 'from-blue-600 to-cyan-600',
    icon: '💼',
  },
  {
    title: 'Explore the Code',
    subtitle: 'Explore my open-source work.',
    cta: 'Go to GitHub',
    href: 'https://github.com/felichpehagasaginting-code',
    gradient: 'from-neutral-800 to-neutral-900',
    icon: '🐙',
  },
  {
    title: 'Google Sites',
    subtitle: 'View my portfolio site.',
    cta: 'Go to Google Sites',
    href: 'https://sites.google.com/view/felichs-portfolio',
    gradient: 'from-emerald-600 to-teal-700',
    icon: '🌐',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus('✅ Message sent successfully! Thanks 🚀');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('❌ Failed to send message. Try again.');
      }
    } catch {
      setStatus('❌ Network error. Try again or email directly.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Let&apos;s get in touch.
        </p>
      </motion.div>

      <hr className="dotted-divider mb-8" />

      {/* Social media label */}
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Find me on social media</p>

      {/* Social cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        {socials.map((social, i) => (
          <motion.a
            key={social.title}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`social-card bg-gradient-to-br ${social.gradient} ${social.fullWidth ? 'md:col-span-2' : ''}`}
          >
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">{social.title}</h3>
              <p className="text-sm text-white/70 mb-4">{social.subtitle}</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-sm font-medium hover:bg-white/30 transition-colors">
                  {social.cta}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </span>
                {social.href.startsWith('mailto:') && (
                  <CopyButton
                    text={social.href.replace('mailto:', '')}
                    label="email"
                    className="text-white/80 hover:text-white"
                  />
                )}
              </div>
            </div>
            <div className="absolute top-4 right-4 text-4xl opacity-30">
              {social.icon}
            </div>
          </motion.a>
        ))}
      </div>

      <hr className="dotted-divider mb-8" />

      {/* Enhanced Instagram Profile Embed (Pure Code Version) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, type: 'spring' }}
        className="mb-12 relative group"
      >
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 animate-pulse" />
        
        <div className="relative rounded-[2rem] border border-white/20 dark:border-white/10 bg-white/40 dark:bg-black/40 backdrop-blur-3xl overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)]">
          {/* Top Decorative Bar */}
          <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 opacity-50" />

          {/* Profile Header */}
          <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Avatar with Rotating Glow */}
            <div className="relative group/avatar">
              <div className="absolute -inset-1 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full animate-spin-slow opacity-75 blur-[2px]" />
              <div className="relative w-24 h-24 rounded-full bg-white dark:bg-neutral-900 p-1">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 flex items-center justify-center border border-white/20">
                  <span className="text-2xl font-black bg-gradient-to-br from-pink-500 to-purple-600 bg-clip-text text-transparent">F</span>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full border-4 border-white dark:border-neutral-950 flex items-center justify-center text-white">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h3 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-300 dark:to-white bg-clip-text text-transparent">
                  fel.comp
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-500 text-[10px] font-bold uppercase tracking-widest border border-pink-500/20">
                  PRO
                </span>
              </div>
              <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
                Building the future of <span className="text-primary font-bold">AI</span> and <span className="text-purple-500 font-bold">Web3</span>. 
                Senior Software Engineer & Tech Visionary.
              </p>
              
              <div className="flex items-center justify-center md:justify-start gap-8">
                <div className="text-center md:text-left">
                  <div className="text-lg font-black text-neutral-900 dark:text-white">12</div>
                  <div className="text-[10px] uppercase tracking-tighter text-neutral-500 font-bold">Posts</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-lg font-black text-neutral-900 dark:text-white">511</div>
                  <div className="text-[10px] uppercase tracking-tighter text-neutral-500 font-bold">Followers</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-lg font-black text-neutral-900 dark:text-white">481</div>
                  <div className="text-[10px] uppercase tracking-tighter text-neutral-500 font-bold">Following</div>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            <a
              href="https://www.instagram.com/fel.comp"
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative px-8 py-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold overflow-hidden transition-all active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                Follow <span className="opacity-50 group-hover/btn:translate-x-1 transition-transform">→</span>
              </span>
            </a>
          </div>

          {/* Grid Preview */}
          <div className="p-2 grid grid-cols-3 gap-2 bg-neutral-50/50 dark:bg-black/20 border-t border-white/10">
            {[
              { id: 1, color: 'from-blue-500/20 to-purple-600/20', label: 'Neural_Core' },
              { id: 2, color: 'from-emerald-500/20 to-blue-600/20', label: 'Sys_Architecture' },
              { id: 3, color: 'from-orange-500/20 to-pink-600/20', label: 'UX_Protocol' },
              { id: 4, color: 'from-pink-500/20 to-rose-600/20', label: 'Data_Stream' },
              { id: 5, color: 'from-indigo-500/20 to-blue-600/20', label: 'AI_Logic' },
              { id: 6, color: 'from-violet-500/20 to-purple-600/20', label: 'Cloud_Nexus' },
              { id: 7, color: 'from-cyan-500/20 to-blue-600/20', label: 'Deep_Learning' },
              { id: 8, color: 'from-amber-500/20 to-orange-600/20', label: 'Cyber_Sec' },
              { id: 9, color: 'from-fuchsia-500/20 to-purple-600/20', label: 'Kernel_Panic' },
            ].map((post) => (
              <motion.a
                key={post.id}
                href="https://www.instagram.com/fel.comp"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -4 }}
                className="aspect-square relative group/post rounded-xl overflow-hidden border border-white/20 dark:border-white/5 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md"
              >
                {/* Abstract Code Art Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${post.color}`} />
                <div className="absolute inset-0 opacity-10 group-hover/post:opacity-20 transition-opacity overflow-hidden font-mono text-[6px] p-2 break-all pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="mb-1">
                      {Math.random() > 0.5 ? '010110101101' : 'const_void_main()'}
                    </div>
                  ))}
                </div>

                {/* SVG Visual Elements */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full h-full relative opacity-40 group-hover/post:opacity-100 group-hover/post:scale-110 transition-all duration-500">
                    {post.id % 4 === 0 ? (
                      <svg className="w-full h-full text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ) : post.id % 3 === 0 ? (
                      <svg className="w-full h-full text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" strokeWidth={1} />
                        <path d="M12 6v12M6 12h12" strokeWidth={1} />
                      </svg>
                    ) : post.id % 2 === 0 ? (
                      <svg className="w-full h-full text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-full h-full text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} />
                        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeWidth={1} />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Glass Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover/post:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                  <div className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-2 translate-y-4 group-hover/post:translate-y-0 transition-transform">
                    {post.label}
                  </div>
                  <div className="flex gap-4 translate-y-4 group-hover/post:translate-y-0 transition-transform delay-75">
                    <div className="flex items-center gap-1 text-white text-[10px] font-bold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                      </svg>
                      {Math.floor(Math.random() * 500 + 100)}
                    </div>
                    <div className="flex items-center gap-1 text-white text-[10px] font-bold">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm4 0H9v2h2V9zm4 0h-2v2h2V9z" />
                      </svg>
                      {Math.floor(Math.random() * 50 + 10)}
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Footer CTA */}
          <a
            href="https://www.instagram.com/fel.comp"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-white/50 dark:bg-white/5 hover:bg-primary/10 transition-colors text-center text-[10px] font-black uppercase tracking-[0.5em] text-neutral-400 hover:text-primary"
          >
            Load More Data Protocol
          </a>
        </div>
      </motion.div>


      <hr className="dotted-divider mb-8" />

      {/* Contact form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Or send me a message</p>

        {status && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-4 rounded-xl text-sm font-medium mb-4 ${
              status.includes('✅')
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            {status}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
            />
          </div>
          <textarea
            placeholder="Message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="form-input resize-vertical"
          />
          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-dark disabled:bg-neutral-400 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
