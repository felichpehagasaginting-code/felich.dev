'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

const categories = [
  {
    title: '💻 Workstation',
    items: [
      { name: 'Lenovo Legion 5', desc: 'Primary development machine', icon: '🖥️' },
      { name: '27" External Monitor', desc: 'Extended workspace for coding', icon: '🖥️' },
      { name: 'Mechanical Keyboard', desc: 'For long coding sessions', icon: '⌨️' },
      { name: 'Wireless Mouse', desc: 'Ergonomic for daily use', icon: '🖱️' },
    ],
  },
  {
    title: '🛠️ Development Tools',
    items: [
      { name: 'Visual Studio Code', desc: 'Primary code editor with extensions', icon: '📝' },
      { name: 'GitHub', desc: 'Version control & collaboration', icon: '🐙' },
      { name: 'Docker', desc: 'Containerization for dev environments', icon: '🐳' },
      { name: 'Postman', desc: 'API testing & documentation', icon: '📮' },
      { name: 'Vercel', desc: 'Deployment & hosting', icon: '▲' },
      { name: 'Terminal (PowerShell / Bash)', desc: 'Daily command-line operations', icon: '💻' },
    ],
  },
  {
    title: '🎨 Design & Productivity',
    items: [
      { name: 'Figma', desc: 'UI/UX design & prototyping', icon: '🎨' },
      { name: 'Notion', desc: 'Project management & notes', icon: '📋' },
      { name: 'Google Workspace', desc: 'Docs, Sheets, Slides for collaboration', icon: '📊' },
      { name: 'Canva', desc: 'Quick graphic design work', icon: '🖼️' },
    ],
  },
  {
    title: '🌐 Browser & Extensions',
    items: [
      { name: 'Google Chrome', desc: 'Primary browser with DevTools', icon: '🌐' },
      { name: 'React Developer Tools', desc: 'Component debugging', icon: '⚛️' },
      { name: 'Grammarly', desc: 'Writing assistance', icon: '✍️' },
      { name: 'uBlock Origin', desc: 'Ad blocking for cleaner browsing', icon: '🛡️' },
    ],
  },
  {
    title: '📱 Mobile & Communication',
    items: [
      { name: 'iPhone', desc: 'Daily driver for communication', icon: '📱' },
      { name: 'Discord', desc: 'Developer community & collaboration', icon: '💬' },
      { name: 'Slack', desc: 'Team communication', icon: '💼' },
      { name: 'Spotify', desc: 'Coding soundtrack', icon: '🎵' },
    ],
  },
];

export default function Uses() {
  return (
    <PageTransition>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Uses</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            The tools, apps, and hardware I use daily for development and productivity.
          </p>
        </motion.div>

        <hr className="dotted-divider mb-8" />

        <div className="space-y-10">
          {categories.map((cat, catIndex) => (
            <motion.section
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="text-xl font-bold mb-4">{cat.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIndex * 0.1 + i * 0.05 }}
                    className="group p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{item.name}</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
