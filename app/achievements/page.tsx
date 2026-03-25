'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';

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
    title: '3rd Place — Battle of the Brain Competition',
    org: 'World Scholar\'s Cup (WSC)',
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
    title: '1st Rank in Class (Grade 1 – Grade 10)',
    org: 'Consistently ranked top in class',
    year: '',
    icon: '⭐',
    type: 'Academic',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    title: 'Audience Favorite Award — Solo Vocal Competition',
    org: 'DekaFest, Medan',
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

const courses = [
  { no: 1, name: 'Jaringan Komputer I', code: 'RPL101', sks: 4, grade: 'A', bn: 4.00, bnxsks: 16 },
  { no: 2, name: 'Algoritma dan Pemrograman', code: 'RPL103', sks: 4, grade: 'AB', bn: 3.50, bnxsks: 14 },
  { no: 3, name: 'Statistika', code: 'RPL111', sks: 2, grade: 'A', bn: 4.00, bnxsks: 8 },
  { no: 4, name: 'Pemrograman Dasar', code: 'RPL105', sks: 3, grade: 'A', bn: 4.00, bnxsks: 12 },
  { no: 5, name: 'Organisasi dan Manajemen Perkebunan Kelapa Sawit', code: 'RPL107', sks: 3, grade: 'A', bn: 4.00, bnxsks: 12 },
  { no: 6, name: 'Bahasa Inggris I', code: 'RPL109', sks: 2, grade: 'A', bn: 4.00, bnxsks: 8 },
];

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

export default function Achievements() {
  const [activeFilter, setActiveFilter] = useState('All');
  const filtered = activeFilter === 'All'
    ? achievements
    : achievements.filter(a => a.type === activeFilter);

  const totalSKS = courses.reduce((a, c) => a + c.sks, 0);
  const totalBNxSKS = courses.reduce((a, c) => a + c.bnxsks, 0);
  const ips = (totalBNxSKS / totalSKS).toFixed(2);

  return (
    <PageTransition>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Achievements</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            A curated collection of certificates and awards I&apos;ve earned throughout my academic and professional journey.
          </p>
        </motion.div>

        <hr className="dotted-divider mb-8" />

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 self-center mr-1">Total: {achievements.length}</span>
          {filterTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`filter-pill text-xs ${activeFilter === type ? 'active' : ''}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                layout
                className="group p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-primary/80 font-medium mt-1">{item.org}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                        {item.type}
                      </span>
                      {item.year && (
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                          {item.year}
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

        {/* Campus Academic Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span>🎓</span> Campus Academic
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
            Academic transcript — Semester 1, 2025/2026
          </p>

          {/* Student Info Card */}
          <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="space-y-1">
                <p><span className="text-neutral-500 dark:text-neutral-400">Nama</span> : <span className="font-semibold">Felich Pehagasa Ginting</span></p>
                <p><span className="text-neutral-500 dark:text-neutral-400">NIM</span> : <span className="font-semibold">202515026</span></p>
                <p><span className="text-neutral-500 dark:text-neutral-400">Program Studi</span> : <span className="font-semibold">Teknologi Rekayasa Perangkat Lunak</span></p>
              </div>
              <div className="space-y-1">
                <p><span className="text-neutral-500 dark:text-neutral-400">Semester</span> : <span className="font-semibold">1</span></p>
                <p><span className="text-neutral-500 dark:text-neutral-400">Tahun Ajaran</span> : <span className="font-semibold">2025/2026</span></p>
                <p><span className="text-neutral-500 dark:text-neutral-400">Jenjang</span> : <span className="font-semibold">D4</span></p>
              </div>
            </div>
          </div>

          {/* Course Table */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-hidden mb-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50">
                    <th className="text-left px-4 py-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400">No</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400">Matakuliah</th>
                    <th className="text-center px-4 py-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400">Kode</th>
                    <th className="text-center px-4 py-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400">SKS</th>
                    <th className="text-center px-4 py-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400">Nilai</th>
                    <th className="text-center px-4 py-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400">Bobot</th>
                    <th className="text-center px-4 py-3 font-semibold text-xs text-neutral-500 dark:text-neutral-400">BN×SKS</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.no} className="border-b border-neutral-100 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="px-4 py-3 text-neutral-500">{c.no}</td>
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-center text-neutral-500 font-mono text-xs">{c.code}</td>
                      <td className="px-4 py-3 text-center">{c.sks}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          c.grade === 'A' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        }`}>
                          {c.grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{c.bn.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center font-semibold">{c.bnxsks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
              <p className="text-2xl font-bold text-primary">{totalSKS}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Total SKS</p>
            </div>
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
              <p className="text-2xl font-bold text-primary">{totalBNxSKS}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">BN × SKS</p>
            </div>
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
              <p className="text-2xl font-bold text-emerald-500">{ips}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">IPS</p>
            </div>
            <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
              <p className="text-2xl font-bold text-emerald-500">{ips}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">IPK</p>
            </div>
          </div>
        </motion.section>

        <hr className="dotted-divider mb-8" />

        {/* Organization Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
            <span>🏛️</span> Organization
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-6">
            Campus organizations and community involvement.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {organizations.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
                className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${org.color} flex items-center justify-center text-2xl flex-shrink-0 shadow-lg`}>
                    {org.icon}
                  </div>
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
