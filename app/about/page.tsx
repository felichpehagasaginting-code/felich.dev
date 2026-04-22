'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Quote, Verified, ShieldCheck, MessageSquare, Clock, Sparkles } from 'lucide-react';
import CareerTimeline from '@/components/CareerTimeline';

const testimonials = [
  {
    name: 'Project Collaborator',
    role: 'Senior Developer',
    initials: 'PC',
    text: 'Felich demonstrates exceptional problem-solving skills and a deep understanding of modern web technologies. His code is always clean, well-documented, and scalable.',
  },
  {
    name: 'Academic Mentor',
    role: 'University Lecturer',
    initials: 'AM',
    text: "One of the most dedicated and talented students I've had. His passion for AI and software engineering is truly inspiring, consistently going above and beyond expectations.",
  },
  {
    name: 'Client',
    role: 'Startup Founder',
    initials: 'CL',
    text: 'Working with Felich was an excellent experience. He delivered a high-quality full-stack application on time and with great attention to detail. Highly recommended!',
  },
];

const bioContent = `
  I'm Felich, an Indonesia-based Software Engineer dedicated to building impactful digital solutions.
  I specialize in developing scalable web platforms and mobile applications using a modern tech stack,
  including Next.js, TypeScript, Python, and Node.js.
  My primary focus is crafting software architecture that doesn't just work but is well-structured,
  maintainable, and scalable to meet business needs. I believe that high-quality code must go hand-in-hand
  with system efficiency and logical clarity.
  I blend technical expertise with proactive communication, critical thinking, and effective time management.
  I thrive in collaborative environments and leverage leadership skills to ensure every project delivers
  optimal results and a real-world impact.
`;

export default function About() {
  const readingTime = Math.ceil(bioContent.split(' ').length / 200);

  return (
    <PageTransition>
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">About</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            A brief introduction to who I am.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-3 h-3" />
              {readingTime} min read
            </span>
          </div>
        </motion.div>

        <hr className="dotted-divider mb-8" />

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4 text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8"
        >
          <p>
            I&apos;m Felich, an Indonesia-based Software Engineer dedicated to building impactful digital solutions.
            I specialize in developing scalable web platforms and mobile applications using a modern tech stack,
            including Next.js, TypeScript, Python, and Node.js.
          </p>
          <p>
            My primary focus is crafting software architecture that doesn&apos;t just work but is well-structured,
            maintainable, and scalable to meet business needs. I believe that high-quality code must go hand-in-hand
            with system efficiency and logical clarity.
          </p>
          <p>
            I blend technical expertise with proactive communication, critical thinking, and effective time management.
            I thrive in collaborative environments and leverage leadership skills to ensure every project delivers
            optimal results and a real-world impact.
          </p>
        </motion.div>

        <div className="flex items-center gap-6 mb-12 p-6 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800 w-fit">
          <div className="flex flex-col">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
              <Verified className="w-3 h-3 text-blue-500" /> Digital Signature
            </p>
            <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm select-none" style={{ fontFamily: '"Great Vibes", cursive' }}>
              Felich
            </p>
          </div>
          <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-800" />
          <div className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex flex-col gap-1.5 leading-none">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-green-500" /> SYS.AUTH: VERIFIED</span>
            <span>ID: FLCH-2026-X</span>
            <span className="opacity-50">TS: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <hr className="dotted-divider mb-12" />

        {/* Career Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              Journey
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              My career & education timeline — scroll to explore.
            </p>
          </div>

          <CareerTimeline />
        </motion.section>

        <hr className="dotted-divider mb-8" />

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-purple-500" /> Testimonials
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">What people say about working with me.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(168,85,247,0.15)] flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl text-purple-500/20 mb-2 font-serif group-hover:text-purple-500/40 transition-colors">
                    <Quote className="fill-current" />
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6 font-medium relative z-10">
                    {t.text}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700/50 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-white dark:to-neutral-400 group-hover:from-purple-500 group-hover:to-blue-500 transition-all">
                      {t.name}
                    </h4>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </PageTransition>
  );
}
