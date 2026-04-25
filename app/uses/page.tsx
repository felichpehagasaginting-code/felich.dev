'use client';

import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { SkillIcons, Iconlenovo, Iconubuntu, Iconanthropic, Icongnometerminal, Iconfigma, Iconnotion, Icongooglechrome, Icongrammarly, Iconublockorigin, Iconapple, Iconxiaomi, Icondiscord, Iconspotify, Iconvirtualbox, Iconkalilinux, Iconalmalinux, Iconmikrotik } from '@/components/SkillIcons';

const categories = [
  {
    title: '💻 Workstation',
    items: [
      { name: 'Lenovo LOQ 15', desc: 'Primary development machine', slug: 'lenovo', color: '#E2231A' },
      { name: 'Ubuntu', desc: 'Primary Operating System', slug: 'ubuntu', color: '#E95420' },
      { name: 'Legion Mouse', desc: 'Ergonomic for daily use', slug: 'lenovo', color: '#E2231A' },
    ],
  },
  {
    title: '🛡️ Virtualization & Systems',
    items: [
      { name: 'VirtualBox', desc: 'Primary Hypervisor for testing', slug: 'virtualbox', color: '#183A61' },
      { name: 'Kali Linux', desc: 'Penetration testing environment', slug: 'kalilinux', color: '#268BEE' },
      { name: 'AlmaLinux', desc: 'Server & Enterprise testing', slug: 'almalinux', color: '#F04D22' },
      { name: 'MikroTikOS', desc: 'Network simulation & routing', slug: 'mikrotik', color: '#ED1C24' },
    ],
  },
  {
    title: '🛠️ Development Tools',
    items: [
      { name: 'Visual Studio Code', desc: 'Primary code editor with extensions', slug: 'visualstudiocode', color: '#007ACC' },
      { name: 'Claude', desc: 'AI Coding Assistant & Pair Programming', slug: 'anthropic', color: '#D97757' },
      { name: 'GitHub', desc: 'Version control & collaboration', slug: 'github', color: '#181717' },
      { name: 'Docker', desc: 'Containerization for dev environments', slug: 'docker', color: '#2496ED' },
      { name: 'Postman', desc: 'API testing & documentation', slug: 'postman', color: '#FF6C37' },
      { name: 'Vercel', desc: 'Deployment & hosting', slug: 'vercel', color: '#000000' },
      { name: 'Terminal / CLI', desc: 'Daily bash & system operations', slug: 'gnometerminal', color: '#4E9A06' },
      { name: 'Gemini AI', desc: 'Advanced reasoning & creative coding', slug: 'geminiai', color: '#1A73E8' },
      { name: 'Sanity CMS', desc: 'Structured content management', slug: 'sanity', color: '#F03E2F' },
    ],
  },
  {
    title: '🎨 Design & Productivity',
    items: [
      { name: 'Figma', desc: 'UI/UX design & prototyping', slug: 'figma', color: '#F24E1E' },
      { name: 'Notion', desc: 'Project management & notes', slug: 'notion', color: '#000000' },
      { name: 'Google Workspace', desc: 'Docs, Sheets, Slides', slug: 'googleworkspace', color: '#4285F4' },
      { name: 'Canva', desc: 'Quick graphic design work', slug: 'canva', color: '#00C4CC' },
    ],
  },
  {
    title: '🌐 Browser & Extensions',
    items: [
      { name: 'Google Chrome', desc: 'Primary browser with DevTools', slug: 'googlechrome', color: '#4285F4' },
      { name: 'React DevTools', desc: 'Component debugging', slug: 'react', color: '#61DAFB' },
      { name: 'Grammarly', desc: 'Writing assistance', slug: 'grammarly', color: '#15A362' },
      { name: 'uBlock Origin', desc: 'Ad blocking for cleaner browsing', slug: 'ublockorigin', color: '#800000' },
    ],
  },
  {
    title: '📱 Mobile & Communication',
    items: [
      { name: 'iPhone 15 Plus', desc: 'Main daily driver', slug: 'apple', color: '#000000' },
      { name: 'Poco F3', desc: 'Secondary device & testing', slug: 'xiaomi', color: '#FF6900' },
      { name: 'Discord', desc: 'Developer community & collaboration', slug: 'discord', color: '#5865F2' },
      { name: 'Slack', desc: 'Team communication', slug: 'slack', color: '#4A154B' },
      { name: 'Spotify', desc: 'Coding soundtrack', slug: 'spotify', color: '#1DB954' },
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
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2">
                <span className="text-primary/50 text-base">⸺</span> {cat.title}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cat.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: catIndex * 0.1 + i * 0.05 }}
                    className="group flex flex-col justify-between p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden h-full"
                  >
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-900 shadow-inner flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 border border-neutral-100 dark:border-neutral-800 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300" style={{ backgroundColor: item.color }} />
                        <div
                           className="w-6 h-6 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-105"
                           style={{ color: item.color, filter: `drop-shadow(0 4px 6px ${item.color}40)` }}
                        >
                           {(() => {
                             const icons: Record<string, any> = {
                               lenovo: Iconlenovo,
                               ubuntu: Iconubuntu,
                               visualstudiocode: SkillIcons.visualstudiocode,
                               anthropic: Iconanthropic,
                               github: SkillIcons.github,
                               docker: SkillIcons.docker,
                               postman: SkillIcons.postman,
                               vercel: SkillIcons.vercel,
                               gnometerminal: Icongnometerminal,
                               figma: Iconfigma,
                               notion: Iconnotion,
                               googlechrome: Icongooglechrome,
                               react: SkillIcons.react,
                               grammarly: Icongrammarly,
                               ublockorigin: Iconublockorigin,
                               apple: Iconapple,
                               xiaomi: Iconxiaomi,
                               discord: Icondiscord,
                               spotify: Iconspotify,
                               geminiai: SkillIcons.geminiai,
                               sanity: SkillIcons.sanity,
                             };
                             const Icon = icons[item.slug];
                             return Icon ? Icon : <span className="text-[10px] font-bold">{item.name.substring(0, 2).toUpperCase()}</span>;
                           })()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <h3 className="font-extrabold text-sm md:text-base group-hover:text-primary transition-colors tracking-tight leading-snug">{item.name}</h3>
                        <p className="text-xs font-mono tracking-widest uppercase text-neutral-400 dark:text-neutral-500 mt-1">{item.desc}</p>
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
