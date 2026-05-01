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

      {/* macOS-Style Instagram Window */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        className="mb-20 relative group"
      >
        {/* Deep Floating Shadow */}
        <div className="absolute inset-10 bg-black/40 blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity pointer-events-none" />
        
        <div className="relative rounded-2xl border border-white/20 dark:border-white/10 bg-white/60 dark:bg-[#1c1c1e]/60 backdrop-blur-[50px] overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          
          {/* macOS Title Bar */}
          <div className="h-12 flex items-center px-4 bg-white/20 dark:bg-black/20 border-b border-black/5 dark:border-white/5 relative z-20">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 tracking-tight flex items-center gap-1.5">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.607.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.245-3.607 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.063-2.633-.333-3.608-1.308-.975-.975-1.245-2.242-1.308-3.607-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.607-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.337 2.62 6.757 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.337-.2 6.757-2.62 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.62-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram — @fel.comp
              </span>
            </div>
          </div>

          {/* Window Content */}
          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Sidebar-like Profile Area */}
            <div className="w-full md:w-[320px] p-8 md:p-10 border-r border-black/5 dark:border-white/5 bg-white/20 dark:bg-black/20 relative z-10 flex flex-col items-center md:items-start">
              <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] rounded-full blur-[2px]" />
                <div className="relative w-24 h-24 rounded-full bg-white dark:bg-black p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <span className="text-3xl font-black bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] bg-clip-text text-transparent">F</span>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0095f6] rounded-full border-4 border-white dark:border-[#1c1c1e] flex items-center justify-center text-white">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>

              <div className="text-center md:text-left w-full">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">fel.comp</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 font-medium leading-relaxed">
                  Building the future of AI & Web3. Senior Software Engineer.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Posts</span>
                    <span className="text-sm font-black text-neutral-900 dark:text-white">12</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Followers</span>
                    <span className="text-sm font-black text-neutral-900 dark:text-white">516</span>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-black/5 dark:bg-white/5">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Following</span>
                    <span className="text-sm font-black text-neutral-900 dark:text-white">488</span>
                  </div>
                </div>

                <a
                  href="https://www.instagram.com/fel.comp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold text-center transition-all active:scale-95 shadow-lg shadow-primary/20"
                >
                  Follow on Instagram
                </a>
              </div>
            </div>

            {/* Main Content Area (Grid) */}
            <div className="flex-1 p-6 md:p-8 bg-white/10 dark:bg-black/10">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                {[
                  { id: 1, color: 'from-blue-600/20 to-indigo-600/20', label: 'NEURAL_CORE' },
                  { id: 2, color: 'from-emerald-600/20 to-teal-600/20', label: 'ARCHITECTURE' },
                  { id: 3, color: 'from-orange-600/20 to-rose-600/20', label: 'UX_PROTOCOL' },
                  { id: 4, color: 'from-pink-600/20 to-fuchsia-600/20', label: 'DATA_STREAM' },
                  { id: 5, color: 'from-violet-600/20 to-purple-600/20', label: 'AI_LOGIC' },
                  { id: 6, color: 'from-cyan-600/20 to-blue-600/20', label: 'CLOUD_NEXUS' },
                ].map((post, idx) => (
                  <motion.a
                    key={post.id}
                    href="https://www.instagram.com/fel.comp"
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    className="aspect-square relative group/post rounded-xl overflow-hidden bg-white/5 dark:bg-black/20 border border-black/5 dark:border-white/5"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${post.color}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 text-white/20 group-hover/post:text-white/80 transition-colors">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      </div>
                    </div>
                    {/* Caption Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover/post:opacity-100 transition-opacity">
                      <span className="text-[9px] font-bold text-white tracking-wider truncate block">{post.label}</span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Toolbar/Status Bar */}
          <div className="h-8 flex items-center justify-between px-4 bg-white/10 dark:bg-black/10 border-t border-black/5 dark:border-white/5">
            <div className="flex gap-4">
              <span className="text-[9px] font-medium text-neutral-400">12 Items</span>
              <span className="text-[9px] font-medium text-neutral-400">2.4 GB available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Live Sync</span>
            </div>
          </div>
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
