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
              <motion.div key={item.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: i * 0.05 }} layout className="group p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors leading-snug">{item.title}</h3>
                    <p className="text-xs text-primary/80 font-medium mt-1">{item.org}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">{item.type}</span>
                      {item.year && <span className="text-[10px] text-neutral-400 dark:text-neutral-500">{item.year}</span>}
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

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-neutral-500 dark:text-neutral-400">Aktif — Semester {currentSemester}</span>
                </div>
                <p><span className="text-neutral-500 dark:text-neutral-400">Nama</span> <span className="font-semibold">: Felich Pehagasa Ginting</span></p>
                <p><span className="text-neutral-500 dark:text-neutral-400">Program Studi</span> <span className="font-semibold">: Teknologi Rekayasa Perangkat Lunak</span></p>
                <p><span className="text-neutral-500 dark:text-neutral-400">Jenjang</span> <span className="font-semibold">: D4 (Sarjana Terapan)</span></p>
                <p><span className="text-neutral-500 dark:text-neutral-400">Tahun Kuliah</span> <span className="font-semibold">: 2025 – 2029</span></p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <IPKRing value={academicStats.ipk} />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex items-center gap-1.5">
                  <span className="text-sm">{predikat.emoji}</span>
                  <span className={`text-xs font-semibold ${predikat.color}`}>{predikat.label}</span>
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
                  <motion.div key={sem.semester} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }} className={`relative p-4 rounded-2xl border transition-all duration-300 ${isCompleted ? 'border-emerald-200 dark:border-emerald-800/50 bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/20 dark:to-neutral-900/50 hover:shadow-md hover:-translate-y-0.5' : isCurrent ? 'border-blue-200 dark:border-blue-800/50 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-neutral-900/50 border-dashed' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 opacity-50'}`}>
                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mb-2 ${isCompleted ? 'bg-emerald-500 text-white' : isCurrent ? 'bg-blue-500 text-white animate-pulse' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'}`}>{sem.semester}</div>
                    {isCompleted ? (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 + i * 0.06 }}>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{sem.ips!.toFixed(2)}</p>
                        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">{sem.sks} SKS</p>
                      </motion.div>
                    ) : isCurrent ? (
                      <div><p className="text-sm font-medium text-blue-500 dark:text-blue-400">Ongoing</p><p className="text-[10px] text-neutral-400">In progress</p></div>
                    ) : (
                      <div><p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">—</p><p className="text-[10px] text-neutral-400">Upcoming</p></div>
                    )}
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 leading-tight">{sem.label}</p>
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
              <motion.div key={org.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }} className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${org.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>{org.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base">{org.name}</h3>
                    <p className="text-sm text-primary font-semibold mt-0.5">{org.role}</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">{org.desc}</p>
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
