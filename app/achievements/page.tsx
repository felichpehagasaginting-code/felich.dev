'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Bot, Library, Trophy, Brain, Mic2, BookOpen, Star, Music, Globe, Medal, Scale, Microscope, GraduationCap, BarChart2, Calculator, Building2, Server, Network, Verified } from 'lucide-react';

/* ============================================================
   ACHIEVEMENTS DATA
   ============================================================ */
const achievements = [
  {
    title: 'IBM Build an AI Agent',
    org: 'IBM Skills Network',
    year: '2026',
    icon: Bot,
    type: 'Certification',
    color: 'from-blue-600 to-indigo-800',
    link: 'https://skills.yourlearning.ibm.com/certificate/share/0616ad10f5ewogICJsZWFybmVyQ05VTSIgOiAiNzU2NjI3OVJFRyIsCiAgIm9iamVjdElkIiA6ICJBTE0tQ09VUlNFXzM5NDYzNTkiLAogICJvYmplY3RUeXBlIiA6ICJBQ1RJVklUWSIKfQc05d49d606-10'
  },
  {
    title: 'IBM : Large Language Model',
    org: 'IBM Skills Network',
    year: '2026',
    icon: Library,
    type: 'Certification',
    color: 'from-blue-600 to-indigo-800',
    link: 'https://skills.yourlearning.ibm.com/certificate/share/e126387438ewogICJvYmplY3RJZCIgOiAiQUxNLUNPVVJTRV80MDU4OTE1IiwKICAib2JqZWN0VHlwZSIgOiAiQUNUSVZJVFkiLAogICJsZWFybmVyQ05VTSIgOiAiNzU2NjI3OVJFRyIKfQ5d8f3bc11b-10'
  },
  {
    title: 'RedHat Certified System Administrator',
    org: 'RedHat (In Progress)',
    year: 'Ongoing',
    icon: Server,
    type: 'Certification',
    color: 'from-red-500 to-red-700',
  },
  {
    title: 'Cisco : Network Professional Track',
    org: 'Cisco Networking Academy',
    year: 'Ongoing',
    icon: Network,
    type: 'Certification',
    color: 'from-cyan-500 to-blue-700',
  },
  {
    title: 'Cobra Team Leader',
    org: 'Sekolah Legislatif Nasional',
    year: '2025',
    icon: Trophy,
    type: 'Leadership',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    title: '3rd Place Champion — Battle of the Brain Competition',
    org: 'Widya Science Community',
    year: '2025',
    icon: Brain,
    type: 'Academic',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    title: '1st Place — Solo Vocal Competition (School Level)',
    org: 'School Competition',
    year: '',
    icon: Mic2,
    type: 'Arts',
    color: 'from-pink-500 to-rose-600',
  },
  {
    title: '1st Place Overall — GO TryOut Academic Competition',
    org: 'Batanghari Regency',
    year: '',
    icon: BookOpen,
    type: 'Academic',
    color: 'from-emerald-500 to-green-600',
  },
  {
    title: '1st Rank in Top Class (Grade 1 – Grade 10)',
    org: 'Consistently Ranked 1st in Top Class',
    year: '',
    icon: Star,
    type: 'Academic',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    title: 'Audience Favorite Award — Solo Vocal Competition',
    org: 'DekaFest Competition, Medan',
    year: '',
    icon: Music,
    type: 'Arts',
    color: 'from-purple-500 to-violet-600',
  },
  {
    title: '2nd Place — English Competition (PC-1 Level)',
    org: 'Harford Institute',
    year: '',
    icon: Globe,
    type: 'Academic',
    color: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Silver Medalist — National Science Olympiad (OSN)',
    org: 'Mathematics, Indonesia',
    year: '2022',
    icon: Medal,
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
    icon: Scale,
    color: 'from-blue-600 to-indigo-700',
    desc: 'Berpartisipasi dalam penyusunan regulasi dan kebijakan kampus, serta pengawasan organisasi kemahasiswaan.',
  },
  {
    name: 'Widya Science Community',
    role: 'Anggota Departemen Research',
    icon: Microscope,
    color: 'from-emerald-500 to-teal-600',
    desc: 'Terlibat aktif dalam riset ilmiah di bidang teknologi dan sains, kolaborasi paper, dan diskusi akademik.',
  },
];

const filterTypes = ['All', 'Academic', 'Leadership', 'Arts', 'Certification'];

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
            {filtered.map((item: any, i) => (
              <motion.div 
                key={item.title} 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }} 
                transition={{ duration: 0.3, delay: i * 0.05 }} 
                layout 
                onClick={() => item.link && window.open(item.link, '_blank')}
                className={`group p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl hover:bg-white dark:hover:bg-neutral-900/80 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden ${item.link ? 'cursor-pointer' : ''}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="flex items-start gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ring-2 ring-white/20 dark:ring-black/20 inset-shadow-sm`}>
                    <item.icon className="w-7 h-7 drop-shadow-md" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm md:text-base group-hover:text-primary transition-colors leading-snug tracking-tight mb-0.5">{item.title}</h3>
                    <p className="text-xs text-primary/80 font-bold uppercase tracking-wider">{item.org}</p>
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">{item.type}</span>
                      {item.year && <span className="text-[10px] font-mono font-semibold text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-neutral-900/50 px-2 py-0.5 rounded">{item.year}</span>}
                      {item.link && (
                        <span className="text-[10px] font-bold text-blue-500 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md uppercase tracking-widest ml-auto flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Credential <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <hr className="dotted-divider mb-8" />

        <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5 }} className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                <GraduationCap className="w-8 h-8 text-primary" /> 
                Campus Academic
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Teknologi Rekayasa Perangkat Lunak — Academic Index</p>
            </div>
            <div className="hidden sm:flex flex-col items-end">
               <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Auth Level</span>
               <span className="text-xs font-black text-emerald-500 uppercase">Administrator</span>
            </div>
          </div>

          {/* Student Digital ID Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }} 
            className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent mb-10 group"
          >
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none" />
            
            <div className="relative p-6 md:p-10 rounded-[2.5rem] bg-white/70 dark:bg-neutral-900/60 backdrop-blur-3xl border border-white/20 dark:border-white/5 overflow-hidden shadow-2xl shadow-blue-500/5 liquid-glass">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                {/* ID Photo & IPK */}
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-3xl bg-neutral-200 dark:bg-neutral-800 p-1 ring-4 ring-white/30 dark:ring-white/10 shadow-2xl">
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-neutral-800 to-black flex items-center justify-center text-white overflow-hidden">
                         <img src="/images/profile.jpg" alt="Student" className="w-full h-full object-cover opacity-80" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white dark:border-neutral-900 flex items-center justify-center shadow-lg">
                       <Verified className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <IPKRing value={academicStats.ipk} size={140} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.8 }}
                      className="mt-4 px-4 py-1.5 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center gap-2 shadow-xl"
                    >
                      <span className="text-base">{predikat.emoji}</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{predikat.label}</span>
                    </motion.div>
                  </div>
                </div>

                {/* ID Details */}
                <div className="flex-1 w-full space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1">Student Name</p>
                      <h3 className="text-2xl md:text-3xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">Felich Pehagasa Ginting</h3>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1">Student ID</p>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200 font-mono tracking-tighter">FLCH-2025-REXP</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1">Major & Program</p>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200">D4 Teknologi Rekayasa Perangkat Lunak</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1">Academic Year</p>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200">2025 — 2029 (Cohort X)</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1">Active Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Regular Semester {currentSemester}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-1">Total Credits Earned</p>
                      <p className="font-bold text-neutral-800 dark:text-neutral-200">{academicStats.totalSKS} SKS Completed</p>
                    </div>
                  </div>
                  
                  {/* Barcode Deco */}
                  <div className="pt-6 flex items-center justify-between opacity-30 grayscale hover:grayscale-0 transition-all">
                     <div className="flex flex-col">
                        <div className="h-8 w-48 bg-black dark:bg-white [mask-image:repeating-linear-gradient(90deg,black,black_2px,transparent_2px,transparent_4px)]" />
                        <span className="text-[8px] font-mono mt-1 text-neutral-600 dark:text-neutral-400 tracking-[0.5em]">AUTH-SECURE-256-AES</span>
                     </div>
                     <Building2 className="w-10 h-10 text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Semester Progress Cards */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
               <h3 className="text-xl font-black tracking-tight">Academic Milestone</h3>
               <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {semesterData.map((sem, i) => {
                const isCompleted = sem.ips !== null;
                const isCurrent = i === currentSemester;
                return (
                  <motion.div 
                    key={sem.semester} 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: i * 0.05 }} 
                    className={`relative p-6 rounded-3xl border transition-all duration-500 group ${
                      isCompleted 
                        ? 'border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl hover:border-emerald-500/30 liquid-glass' 
                        : isCurrent 
                        ? 'border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20 shadow-xl shadow-blue-500/5' 
                        : 'border-neutral-100 dark:border-neutral-900 bg-neutral-50/20 dark:bg-neutral-900/10 opacity-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black mb-4 ${
                      isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                      isCurrent ? 'bg-blue-500 text-white animate-pulse shadow-lg shadow-blue-500/20' : 
                      'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'
                    }`}>
                      S{sem.semester}
                    </div>
                    
                    {isCompleted ? (
                      <div>
                        <p className="text-4xl font-black bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">{sem.ips!.toFixed(2)}</p>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400 mt-2">{sem.sks} SKS Index</p>
                      </div>
                    ) : isCurrent ? (
                      <div className="flex flex-col gap-1">
                        <p className="text-xl font-black text-blue-500 tracking-tighter">ONGOING</p>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">Current Phase</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <p className="text-xl font-black text-neutral-300 dark:text-neutral-700 tracking-tighter">—</p>
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">Pending</p>
                      </div>
                    )}
                    
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-10 transition-opacity">
                       <Calculator className="w-10 h-10" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Quick Metrics Footer */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-[2rem] bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-200 dark:border-neutral-800 backdrop-blur-md">
            {[
              { label: 'Total Credits', value: academicStats.totalSKS, icon: Calculator, color: 'text-blue-500' },
              { label: 'Progression', value: `${academicStats.completedSemesters}/${semesterData.length}`, icon: BarChart2, color: 'text-purple-500' },
              { label: 'Latest IPS', value: academicStats.latestIPS.toFixed(2), icon: Star, color: 'text-emerald-500' },
              { label: 'Cumulative GPA', value: academicStats.ipk.toFixed(2), icon: Trophy, color: 'text-amber-500' }
            ].map((metric, i) => (
              <div key={metric.label} className="text-center p-2">
                <p className="text-2xl font-black text-neutral-800 dark:text-white tracking-tighter">{metric.value}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center justify-center gap-1">
                   <metric.icon className={`w-2.5 h-2.5 ${metric.color}`} />
                   {metric.label}
                </p>
              </div>
            ))}
          </div>

          <motion.details initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 overflow-hidden">
            <summary className="px-5 py-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors select-none flex items-center gap-2"><Calculator className="w-3.5 h-3.5" /> Bagaimana IPK dihitung?</summary>
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
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><Building2 className="w-6 h-6 text-purple-500" /> Organization</h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">Campus organizations and community involvement.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map((org, i) => (
              <motion.div key={org.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} whileHover={{ y: -4, scale: 1.01 }} className="group p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] hover:border-blue-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/[0.03] to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <div className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${org.color} flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ring-2 ring-white/20 dark:ring-black/20 inset-shadow-sm`}>
                    <org.icon className="w-7 h-7 drop-shadow-md" strokeWidth={2} />
                  </div>
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
