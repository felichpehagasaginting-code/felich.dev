'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const career = [
  {
    role: 'Freelance Software Engineer',
    company: 'Self-Employed',
    location: 'Indonesia',
    period: '2024 - Present',
    icon: '💻',
    details: 'Building production web applications, AI/ML pipelines, and FinTech solutions for clients.',
  },
  {
    role: 'Fullstack Developer',
    company: 'Various Projects',
    location: 'Indonesia',
    period: '2023 - 2024',
    icon: '🔧',
    details: 'React/Next.js, Node.js, Python, database optimization, API development.',
  },
];

const education = [
  {
    school: 'Politeknik Kelapa Sawit Citra Widya Edukasi',
    degree: 'D4 Software Engineering Technology',
    period: '2025 - 2029',
    icon: '🎓',
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

        <p className="text-neutral-500 dark:text-neutral-400 mb-2">Best regards,</p>
        <p className="text-3xl font-bold italic text-primary mb-12" style={{ fontFamily: 'cursive' }}>
          felich
        </p>

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
            <span>💼</span> Career
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">My professional journey.</p>

          <div className="space-y-4">
            {career.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{item.role}</h3>
                    <p className="text-sm text-primary font-medium">{item.company}</p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      <span>{item.location}</span>
                      <span>•</span>
                      <span>{item.period}</span>
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
            <span>🎓</span> Education
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">My academic background.</p>

          <div className="space-y-4">
            {education.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg">{item.school}</h3>
                    <p className="text-sm text-primary font-medium">{item.degree}</p>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      <span>{item.location}</span>
                      <span>•</span>
                      <span>{item.period}</span>
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
            <span>💬</span> Testimonials
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">What people say about working with me.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </PageTransition>
  );
}
