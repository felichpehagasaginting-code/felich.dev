'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Briefcase, GraduationCap, Quote, MapPin, Calendar, Verified, UserCheck, MessageSquare } from 'lucide-react';

const career = [
  {
    role: 'Freelance Software Engineer',
    company: 'Self-Employed',
    location: 'Indonesia',
    period: '2024 - Present',
    icon: Briefcase,
    details: 'Building production web applications, AI/ML pipelines, and FinTech solutions for clients.',
  },
  {
    role: 'Fullstack Developer',
    company: 'Various Projects',
    location: 'Indonesia',
    period: '2023 - 2024',
    icon: Briefcase,
    details: 'React/Next.js, Node.js, Python, database optimization, API development.',
  },
];

const education = [
  {
    school: 'Politeknik Kelapa Sawit Citra Widya Edukasi',
    degree: 'D4 Software Engineering Technology',
    period: '2025 - 2029',
    icon: GraduationCap,
    location: 'Indonesia',
  },
];

const testimonials = [
  {
    name: 'Project Collaborator',
    role: 'Senior Developer',
    avatar: '👨‍💻',
    text: 'Felich demonstrates exceptional problem-solving skills and a deep understanding of modern web technologies. His code is always clean, well-documented, and scalable.',
  },
  {
    name: 'Academic Mentor',
    role: 'University Lecturer',
    avatar: '👨‍🏫',
    text: 'One of the most dedicated and talented students I\'ve had. His passion for AI and software engineering is truly inspiring, consistently going above and beyond expectations.',
  },
  {
    name: 'Client',
    role: 'Startup Founder',
    avatar: '🧑‍💼',
    text: 'Working with Felich was an excellent experience. He delivered a high-quality full-stack application on time and with great attention to detail. Highly recommended!',
  },
];

export default function About() {
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              3 min read
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
             <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5"><Verified className="w-3 h-3 text-blue-500" /> Digital Signature</p>
             <p className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm select-none" style={{ fontFamily: '"Great Vibes", cursive' }}>
               Felich
             </p>
          </div>
          <div className="w-px h-12 bg-neutral-200 dark:bg-neutral-800" />
          <div className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex flex-col gap-1.5 leading-none">
             <span className="flex items-center gap-1.5"><UserCheck className="w-3 h-3" /> SYS.AUTH: VERIFIED</span>
             <span>ID: FLCH-2026-X</span>
             <span className="opacity-50">TS: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <hr className="dotted-divider mb-8" />

        {/* Career */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" /> Career
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">My professional journey.</p>

          <div className="space-y-4">
            {career.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group p-5 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl hover:bg-white dark:hover:bg-neutral-900/80 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/[0.03] to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="flex flex-col sm:flex-row items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 group-hover:from-blue-500/20 group-hover:to-purple-500/20 shadow-inner flex items-center justify-center text-white flex-shrink-0 transition-colors">
                    <item.icon className="w-6 h-6 text-neutral-500 dark:text-neutral-400 group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{item.role}</h3>
                    <p className="text-sm text-primary font-medium">{item.company}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.period}</span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">{item.details}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-pink-500" /> Education
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">My academic background.</p>

          <div className="space-y-4">
            {education.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group p-5 md:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl hover:bg-white dark:hover:bg-neutral-900/80 hover:border-pink-500/30 transition-all duration-300 shadow-sm hover:shadow-[0_0_30px_rgba(236,72,153,0.1)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-pink-500/[0.03] to-pink-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="flex flex-col sm:flex-row items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900 group-hover:from-pink-500/20 group-hover:to-orange-500/20 shadow-inner flex items-center justify-center text-white flex-shrink-0 transition-colors">
                    <item.icon className="w-6 h-6 text-neutral-500 dark:text-neutral-400 group-hover:text-pink-500 transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{item.school}</h3>
                    <p className="text-sm text-primary font-medium">{item.degree}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.period}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <hr className="dotted-divider mb-8" />

        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
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
                  <div className="text-4xl text-purple-500/20 mb-2 font-serif group-hover:text-purple-500/40 transition-colors"><Quote className="fill-current" /></div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6 font-medium relative z-10">
                    {t.text}
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800/50">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg shadow-inner ring-2 ring-white dark:ring-neutral-900">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-neutral-800 to-neutral-600 dark:from-white dark:to-neutral-400 group-hover:from-purple-500 group-hover:to-blue-500 transition-all">{t.name}</h4>
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
