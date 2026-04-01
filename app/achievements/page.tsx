'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

/* ============================================================
   ACHIEVEMENTS DATA
   ============================================================ */
const achievements = [
  {
    title: 'Cobra Team Leader',
    org: 'Sekolah Legislatif Nasional',
    year: '2025',
    icon: '🏆',
    type: 'Leadership',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    title: '3rd Place Champion — Battle of the Brain Competition',
    org: 'Widya Science Community',
    year: '2025',
    icon: '🧠',
    type: 'Academic',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: '1st Place — Solo Vocal Competition (School Level)',
    org: 'School Competition',
    year: '',
    icon: '🎤',
    type: 'Arts',
    color: 'from-pink-500 to-rose-600',
  },
  {
    title: '1st Place Overall — GO TryOut Academic Competition',
    org: 'Batanghari Regency',
    year: '',
    icon: '📚',
    type: 'Academic',
    color: 'from-emerald-500 to-green-600',
  },
  {
    title: '1st Rank in Top Class (Grade 1 – Grade 10)',
    org: 'Consistently Ranked 1st in Top Class',
    year: '',
    icon: '⭐',
    type: 'Academic',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    title: 'Audience Favorite Award — Solo Vocal Competition',
    org: 'DekaFest Competition, Medan',
    year: '',
    icon: '🎶',
    type: 'Arts',
    color: 'from-purple-500 to-violet-600',
  },
  {
    title: '2nd Place — English Competition (PC-1 Level)',
    org: 'Harford Institute',
    year: '',
    icon: '🇬🇧',
    type: 'Academic',
    color: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Silver Medalist — National Science Olympiad (OSN)',
    org: 'Mathematics, Indonesia',
    year: '2022',
    icon: '🥈',
    type: 'Academic',
    color: 'from-slate-400 to-gray-600',
  },
];

/* ============================================================
   SEMESTER IPS DATA
   ============================================================ */
const semesterData: {
  semester: number;
  ips: number | null;
  sks: number | null;
  label: string;
}[] = [
    { semester: 1, ips: 3.89, sks: 18, label: 'Ganjil 2025/2026' },
    { semester: 2, ips: null, sks: null, label: 'Genap 2025/2026' },
    { semester: 3, ips: null, sks: null, label: 'Ganjil 2026/2027' },
    { semester: 4, ips: null, sks: null, label: 'Genap 2026/2027' },
    { semester: 5, ips: null, sks: null, label: 'Ganjil 2027/2028' },
    { semester: 6, ips: null, sks: null, label: 'Genap 2027/2028' },
    { semester: 7, ips: null, sks: null, label: 'Ganjil 2028/2029' },
    { semester: 8, ips: null, sks: null, label: 'Genap 2028/2029' },
  ];

/* ============================================================
   ORGANIZATIONS DATA
   ============================================================ */
const organizations = [
  {
    name: 'Dewan Perwakilan Mahasiswa (DPM)',
    role: 'Anggota Komisi 1 — Hukum & Legislasi',
    icon: '⚖️',
    color: 'from-blue-600 to-indigo-700',
    desc: 'Berpartisipasi dalam penyusunan regulasi dan kebijakan kampus, serta pengawasan organisasi kemahasiswaan.',
  },
  {
    name: 'Widya Science Community',
    role: 'Anggota Departemen Research',
    icon: '🔬',
    color: 'from-emerald-500 to-teal-600',
    desc: 'Terlibat aktif dalam riset ilmiah di bidang teknologi dan sains, kolaborasi paper, dan diskusi akademik.',
  },
];

const filterTypes = ['All', 'Academic', 'Leadership', 'Arts'];

function getPredikat(ipk: number): { label: string; color: string; emoji: string } {
  if (ipk >= 3.76) return { label: 'Cum Laude', color: 'text-amber-500', emoji: '🏅' };
  if (ipk >= 3.51) return { label: 'Sangat Memuaskan', color: 'text-emerald-500', emoji: '🌟' };
  if (ipk >= 2.76) return { label: 'Memuaskan', color: 'text-blue-500', emoji: '✨' };
  return { label: 'Cukup', color: 'text-neutral-500', emoji: '📌' };
}

function IPKRing({ value, max = 4.0, size = 120 }: { value: number; max?: number; size?: number }) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-neutral-200 dark:text-neutral-700/50" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ipkGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
        <defs>
          <linearGradient id="ipkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span className="text-2xl font-bold" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8 }}>
          {value.toFixed(2)}
        </motion.span>
        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">IPK</span>
      </div>
    </div>
  );
}

export default function Achievements() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All' ? achievements : achievements.filter(a => a.type === activeFilter);

  const academicStats = useMemo(() => {
    const completed = semesterData.filter(s => s.ips !== null && s.sks !== null);
    const totalSemesters = completed.length;
    if (totalSemesters === 0) return { ipk: 0, totalSKS: 0, completedSemesters: 0, latestIPS: 0 };
    const weightedSum = completed.reduce((sum, s) => sum + (s.ips! * s.sks!), 0);
    const totalSKS = completed.reduce((sum, s) => sum + s.sks!, 0);
    const ipk = weightedSum / totalSKS;
    const latestCompleted = completed[completed.length - 1];
    return { ipk, totalSKS, completedSemesters: totalSemesters, latestIPS: latestCompleted.ips! };
  }, []);

  const predikat = getPredikat(academicStats.ipk);
  const currentSemester = semesterData.filter(s => s.ips !== null).length;

  return (
    <PageTransition>
      <div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Achievements</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">A curated collection of certificates and awards I&apos;ve earned throughout my academic and professional journey.</p>
        </motion.div>

        <hr className="dotted-divider mb-8" />

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 self-center mr-1">Total: {achievements.length}</span>
          {filterTypes.map((type) => (
            <button key={type} onClick={() => setActiveFilter(type)} className={`filter-pill text-xs ${activeFilter === type ? 'active' : ''}`}>
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: i * 0.05 }} layout className="group p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl hover:bg-white dark:hover:bg-neutral-900/80 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-start gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm md:text-base group-hover:text-primary transition-colors leading-snug tracking-tight mb-0.5">{item.title}</h3>
                    <p className="text-xs text-primary/80 font-bold uppercase tracking-wider">{item.org}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">{item.type}</span>
                      {item.year && <span className="text-[10px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 px-2 py-0.5 rounded">{item.year}</span>}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <hr className="dotted-divider mb-8" />

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }} className="mb-12">
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><span>🎓</span> Campus Academic</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Academic performance overview — Teknologi Rekayasa Perangkat Lunak</p>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="p-6 md:p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl mb-6 shadow-xl shadow-blue-500/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="space-y-4 text-sm flex-1">
                <div className="flex items-center gap-2.5 inline-flex px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-widest">Aktif — Semester {currentSemester}</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-white/50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-white/20 dark:border-neutral-800/50 backdrop-blur-sm">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">Nama Mahasiswa</p>
                    <p className="font-bold text-base text-neutral-800 dark:text-neutral-200">Felich Pehagasa Ginting</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">Tahun Akademik</p>
                    <p className="font-bold text-base text-neutral-800 dark:text-neutral-200">2025 \u2013 2029</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mb-1">Program Studi & Jenjang</p>
                    <p className="font-bold text-base text-neutral-800 dark:text-neutral-200">D4 Teknologi Rekayasa Perangkat Lunak</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 bg-neutral-50 dark:bg-neutral-900/80 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800/80 shadow-inner">
                <IPKRing value={academicStats.ipk} size={130} />
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="flex items-center gap-2 bg-white dark:bg-black px-4 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 shadow-sm mt-1">
                  <span className="text-base">{predikat.emoji}</span>
                  <span className={`text-xs font-black uppercase tracking-widest ${predikat.color}`}>{predikat.label}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-4 text-neutral-600 dark:text-neutral-300 flex items-center gap-2"><span>📊</span> IPS per Semester</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {semesterData.map((sem, i) => {
                const isCompleted = sem.ips !== null;
                const isCurrent = i === currentSemester;
                return (
                  <motion.div key={sem.semester} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', duration: 0.6, delay: i * 0.08 }} className={`relative p-5 rounded-3xl border transition-all duration-300 ${isCompleted ? 'border-emerald-200 dark:border-emerald-800/50 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-md shadow-sm hover:shadow-[0_10px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 hover:border-emerald-500/40' : isCurrent ? 'border-blue-300 dark:border-blue-700/50 bg-blue-50/50 dark:bg-blue-900/10 backdrop-blur-md border-dashed shadow-inner' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/10 opacity-60 backdrop-blur-sm'}`}>
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-black mb-3 shadow-sm ${isCompleted ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' : isCurrent ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white animate-pulse' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'}`}>S{sem.semester}</div>
                    {isCompleted ? (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 + i * 0.06 }}>
                        <p className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-teal-600">{sem.ips!.toFixed(2)}</p>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-600/70 dark:text-emerald-400/70 mt-1">{sem.sks} SKS</p>
                      </motion.div>
                    ) : isCurrent ? (
                      <div><p className="text-lg font-bold text-blue-500 dark:text-blue-400 mt-1">Ongoing</p><p className="text-[10px] font-mono tracking-widest uppercase text-blue-400/70 mt-1">In progress</p></div>
                    ) : (
                      <div><p className="text-lg font-bold text-neutral-400 dark:text-neutral-600 mt-1">—</p><p className="text-[10px] font-mono tracking-widest uppercase text-neutral-400/70 mt-1">Upcoming</p></div>
                    )}
                    <div className="absolute top-4 right-4 text-[8px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500 text-right opacity-50">
                       {sem.label.split(' ').map((t, idx) => <span key={idx} className="block">{t}</span>)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0 }} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
              <p className="text-2xl font-bold text-primary">{academicStats.totalSKS}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Total SKS</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.05 }} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
              <p className="text-2xl font-bold text-primary">{academicStats.completedSemesters}<span className="text-sm font-normal text-neutral-400">/{semesterData.length}</span></p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Semester</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.1 }} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
              <p className="text-2xl font-bold text-emerald-500">{academicStats.latestIPS.toFixed(2)}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">IPS Terakhir</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.15 }} className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
              <p className="text-2xl font-bold text-emerald-500">{academicStats.ipk.toFixed(2)}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">IPK Kumulatif</p>
            </motion.div>
          </div>

          <motion.details initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 overflow-hidden">
            <summary className="px-5 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors select-none">📐 Bagaimana IPK dihitung?</summary>
            <div className="px-5 pb-4 text-xs text-neutral-500 dark:text-neutral-400 space-y-2">
              <p><span className="font-semibold text-neutral-700 dark:text-neutral-300">IPK (Indeks Prestasi Kumulatif)</span> dihitung secara weighted berdasarkan SKS:</p>
              <div className="p-3 rounded-xl bg-white dark:bg-neutral-800/50 font-mono text-center border border-neutral-200 dark:border-neutral-700">IPK = Σ(IPS<sub>i</sub> × SKS<sub>i</sub>) / Σ(SKS<sub>i</sub>)</div>
              <p className="leading-relaxed">Contoh saat ini: ({semesterData.filter(s => s.ips !== null).map(s => `${s.ips} × ${s.sks}`).join(' + ')}) / ({semesterData.filter(s => s.sks !== null && s.ips !== null).map(s => s.sks).join(' + ')}) = <span className="font-semibold text-emerald-600 dark:text-emerald-400">{academicStats.ipk.toFixed(2)}</span></p>
              <p className="text-[11px] italic text-neutral-400">* IPK akan otomatis ter-update setiap semester baru ditambahkan.</p>
            </div>
          </motion.details>
        </motion.section>

        <hr className="dotted-divider mb-8" />

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }}>
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><span>🏛️</span> Organization</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Campus organizations and community involvement.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map((org, i) => (
              <motion.div key={org.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ y: -4, scale: 1.01 }} className="group p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] hover:border-blue-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/[0.03] to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${org.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>{org.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-base md:text-lg group-hover:text-primary transition-colors">{org.name}</h3>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold mt-1 inline-block px-2 py-0.5 bg-primary/10 rounded-md border border-primary/20">{org.role}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed font-medium">{org.desc}</p>
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
