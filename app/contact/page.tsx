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

      {/* Instagram Profile Embed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mb-12"
      >
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">Check out my Instagram</p>

        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden">
          {/* IG Profile Header */}
          <div className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-[3px] ring-gradient bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px] flex-shrink-0">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white dark:bg-neutral-900">
                <Image
                  src="/images/profile.jpg"
                  alt="Instagram Profile"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg">@fel.comp</h3>
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                Software Engineer • AI Enthusiast • Creative Developer
              </p>
              <a
                href="https://www.instagram.com/fel.comp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 text-white text-sm font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Follow on Instagram
              </a>
            </div>
          </div>

          {/* IG Posts Grid Preview */}
          <div className="grid grid-cols-3 gap-0.5 border-t border-neutral-200 dark:border-neutral-800">
            {[1, 2, 3, 4, 5, 6].map((_, i) => (
              <a
                key={i}
                href="https://www.instagram.com/fel.comp"
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 relative group overflow-hidden"
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>

          {/* View Profile CTA */}
          <a
            href="https://www.instagram.com/fel.comp"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-3 text-sm font-medium text-primary hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors border-t border-neutral-200 dark:border-neutral-800"
          >
            View all posts on Instagram →
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
