'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import FelichAvatar from '@/components/FelichAvatar';
import {
  Bot,
  Library,
  Trophy,
  Brain,
  Mic2,
  BookOpen,
  Star,
  Music,
  Globe,
  Medal,
  Scale,
  Microscope,
  GraduationCap,
  BarChart2,
  Server,
  Network,
  Verified,
  Sparkles,
  Search,
  ExternalLink,
  Copy,
  Check,
  X,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { introAudio } from '@/lib/introAudio';

/* ============================================================
   ACHIEVEMENTS DATA
   ============================================================ */
interface Achievement {
  title: string;
  org: string;
  year: string;
  icon: any;
  type: 'Certification' | 'Academic' | 'Leadership' | 'Arts';
  color: string;
  link?: string;
  credentialId?: string;
  skills?: string[];
  description?: string;
}

const achievements: Achievement[] = [
  {
    title: 'IBM Build an AI Agent',
    org: 'IBM Skills Network',
    year: '2026',
    icon: Bot,
    type: 'Certification',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    credentialId: '0616ad10f5e-ALM-COURSE_3946359',
    skills: ['AI Agents', 'LangChain', 'Prompt Engineering', 'Python', 'Reasoning Loops'],
    description: 'Practical certification on building autonomous AI agents, tool-calling pipelines, and multimodal reasoning loops on IBM Skills Network.',
    link: 'https://skills.yourlearning.ibm.com/certificate/share/0616ad10f5ewogICJsZWFybmVyQ05VTSIgOiAiNzU2NjI3OVJFRyIsCiAgIm9iamVjdElkIiA6ICJBTE0tQ09VUlNFXzM5NDYzNTkiLAogICJvYmplY3RUeXBlIiA6ICJBQ1RJVklUWSIKfQc05d49d606-10',
  },
  {
    title: 'IBM : Large Language Model',
    org: 'IBM Skills Network',
    year: '2026',
    icon: Library,
    type: 'Certification',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    credentialId: 'e126387438e-ALM-COURSE_4058915',
    skills: ['LLMs', 'Transformer Architecture', 'Fine-Tuning', 'Vector Embeddings', 'RAG'],
    description: 'In-depth mastery of Large Language Model architectures, transformer attention mechanisms, retrieval augmented generation, and fine-tuning paradigms.',
    link: 'https://skills.yourlearning.ibm.com/certificate/share/e126387438ewogICJvYmplY3RJZCIgOiAiQUxNLUNPVVJTRV80MDU4OTE1IiwKICAib2JqZWN0VHlwZSIgOiAiQUNUSVZJVFkiLAogICJsZWFybmVyQ05VTSIgOiAiNzU2NjI3OVJFRyIKfQ5d8f3bc11b-10',
  },
  {
    title: 'RedHat Certified System Administrator',
    org: 'RedHat (In Progress)',
    year: 'Ongoing',
    icon: Server,
    type: 'Certification',
    color: 'from-red-500 to-red-700',
    credentialId: 'RHCSA-EX200-TRACK',
    skills: ['RHEL 9', 'SELinux', 'Systemd Services', 'Storage Management', 'User Auditing'],
    description: 'Enterprise Linux systems administration, system hardening, automations, and container orchestration readiness.',
  },
  {
    title: 'Cisco : Network Professional Track',
    org: 'Cisco Networking Academy',
    year: 'Ongoing',
    icon: Network,
    type: 'Certification',
    color: 'from-cyan-500 to-blue-700',
    credentialId: 'CISCO-CCNA-NETACAD',
    skills: ['Routing & Switching', 'VLAN Isolation', 'IPv6 Subnetting', 'OSPF / BGP'],
    description: 'Network engineering curriculum encompassing packet routing, OSI layers troubleshooting, and firewall infrastructure.',
  },
  {
    title: 'Cobra Team Leader',
    org: 'Sekolah Legislatif Nasional',
    year: '2025',
    icon: Trophy,
    type: 'Leadership',
    color: 'from-amber-500 to-yellow-600',
    description: 'Led parliamentary debate simulations and drafted legislative policy framework papers at the national level.',
  },
  {
    title: '3rd Place Champion — Battle of the Brain Competition',
    org: 'Widya Science Community',
    year: '2025',
    icon: Brain,
    type: 'Academic',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    description: 'Competed in rapid algorithmic problem-solving and multidisciplinary scientific reasoning competitions.',
  },
  {
    title: '1st Place — Solo Vocal Competition (School Level)',
    org: 'School Competition',
    year: '2024',
    icon: Mic2,
    type: 'Arts',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    description: 'Awarded first place in regional solo vocal performance and artistic expression.',
  },
  {
    title: '1st Place Overall — GO TryOut Academic Competition',
    org: 'Batanghari Regency',
    year: '2024',
    icon: BookOpen,
    type: 'Academic',
    color: 'from-emerald-500 to-green-600',
    description: 'Achieved highest composite score in standard national entrance preparation tryouts across the regency.',
  },
  {
    title: '1st Rank in Top Class (Grade 1 – Grade 10)',
    org: 'Consistently Ranked 1st in Top Class',
    year: '2014 – 2024',
    icon: Star,
    type: 'Academic',
    color: 'from-yellow-500 to-amber-600',
    description: 'Maintained top academic honor roll ranking throughout elementary, junior, and senior secondary schooling.',
  },
  {
    title: 'Audience Favorite Award — Solo Vocal Competition',
    org: 'DekaFest Competition, Medan',
    year: '2023',
    icon: Music,
    type: 'Arts',
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
    description: 'Voted audience choice award winner at DekaFest creative performance festival in Medan.',
  },
  {
    title: '2nd Place — English Competition (PC-1 Level)',
    org: 'Harford Institute',
    year: '2023',
    icon: Globe,
    type: 'Academic',
    color: 'from-sky-500 to-blue-600',
    description: 'Recognized for advanced English proficiency, impromptu debate, and essay composition.',
  },
  {
    title: 'Silver Medalist — National Science Olympiad (OSN)',
    org: 'Mathematics, Indonesia',
    year: '2022',
    icon: Medal,
    type: 'Academic',
    color: 'from-slate-400 to-gray-600',
    description: 'National Science Olympiad (OSN) Silver Medalist in advanced mathematics problem solving.',
  },
];

/* ============================================================
   GOOGLE DEVELOPER BADGES DATA
   ============================================================ */
const googleBadges = [
  {
    id: 'gdg-jakarta',
    title: 'GDG Jakarta Member',
    org: 'Google Developer Groups',
    date: 'Apr 3, 2026',
    color: 'from-[#4285F4]/20 via-[#34A853]/10 to-transparent',
    borderColor: 'hover:border-[#4285F4]/50',
    iconColor: '#4285F4',
  },
  {
    id: 'google-dev-premium',
    title: 'Google Developer Program premium tier',
    org: 'Google Developers',
    date: 'Apr 1, 2026',
    color: 'from-[#FBBC05]/20 via-[#EA4335]/10 to-transparent',
    borderColor: 'hover:border-[#FBBC05]/50',
    iconColor: '#FBBC05',
  },
  {
    id: 'io-2026',
    title: 'I/O 2026 - Registered',
    org: 'Google I/O',
    date: 'Jun 5, 2026',
    color: 'from-[#4285F4]/20 via-[#EA4335]/10 to-transparent',
    borderColor: 'hover:border-[#4285F4]/50',
    iconColor: '#4285F4',
  },
  {
    id: 'gemini-agent',
    title: 'Gemini Enterprise Agent Ready',
    org: 'Google Cloud & Gemini',
    date: 'Apr 3, 2026',
    color: 'from-[#a855f7]/20 via-[#6366f1]/10 to-transparent',
    borderColor: 'hover:border-[#a855f7]/50',
    iconColor: '#a855f7',
  },
  {
    id: 'cloud-arcade',
    title: 'The Arcade Facilitator Special',
    org: 'Google Cloud Skills Boost',
    date: 'Mar 1, 2026',
    color: 'from-[#34A853]/20 via-[#4285F4]/10 to-transparent',
    borderColor: 'hover:border-[#34A853]/50',
    iconColor: '#34A853',
  },
];

function renderBadgeIcon(id: string) {
  switch (id) {
    case 'gdg-jakarta':
      return (
        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4285F4" />
          <path d="M2 17L12 22L22 17" stroke="#34A853" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="#FBBC05" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'google-dev-premium':
      return (
        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="url(#premiumGrad)" strokeWidth="2" />
          <path d="M12 6L14 10L18 10.5L15 13.5L16 18L12 15.5L8 18L9 13.5L6 10.5L10 10L12 6Z" fill="#FBBC05" />
          <defs>
            <linearGradient id="premiumGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FBBC05" />
              <stop offset="100%" stopColor="#EA4335" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'io-2026':
      return (
        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="4" stroke="#4285F4" strokeWidth="2" />
          <path d="M8 8V16M12 8V16M16 8V16" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2" fill="#34A853" />
        </svg>
      );
    case 'gemini-agent':
      return (
        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#geminiGrad)" />
          <defs>
            <linearGradient id="geminiGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'cloud-arcade':
      return (
        <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="4" width="20" height="16" rx="4" stroke="#34A853" strokeWidth="2" />
          <circle cx="8" cy="12" r="2" fill="#4285F4" />
          <path d="M14 10H18M16 8V12" stroke="#EA4335" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* ============================================================
   SEMESTER IPS DATA (UPDATED: Semester 2 = 3.89)
   ============================================================ */
const semesterData = [
  { semester: 1, ips: 3.89, sks: 18, label: 'Ganjil 2025/2026' },
  { semester: 2, ips: 3.89, sks: 20, label: 'Genap 2025/2026' },
  { semester: 3, ips: null, sks: null, label: 'Ganjil 2026/2027' },
  { semester: 4, ips: null, sks: null, label: 'Genap 2026/2027' },
  { semester: 5, ips: null, sks: null, label: 'Ganjil 2027/2028' },
  { semester: 6, ips: null, sks: null, label: 'Genap 2027/2028' },
  { semester: 7, ips: null, sks: null, label: 'Ganjil 2028/2029' },
  { semester: 8, ips: null, sks: null, label: 'Genap 2028/2029' },
];

const organizations = [
  {
    name: 'Dewan Perwakilan Mahasiswa (DPM)',
    role: 'Anggota Komisi 1 — Hukum & Legislasi',
    icon: Scale,
    color: 'from-[var(--brand)] to-[var(--brand-strong,var(--brand))]',
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

const filterTypes = ['All', 'Certification', 'Academic', 'Leadership', 'Arts'];

function getPredikat(ipk: number): { label: string; color: string; emoji: string } {
  if (ipk >= 3.76) return { label: 'Cum Laude', color: 'text-[var(--warning)]', emoji: '🏅' };
  if (ipk >= 3.51) return { label: 'Sangat Memuaskan', color: 'text-[var(--success)]', emoji: '🌟' };
  if (ipk >= 2.76) return { label: 'Memuaskan', color: 'text-[var(--brand)]', emoji: '✨' };
  return { label: 'Cukup', color: 'text-[var(--text-muted)]', emoji: '📌' };
}

export default function Achievements() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCertModal, setSelectedCertModal] = useState<Achievement | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const filtered = useMemo(() => {
    return achievements.filter((a) => {
      const matchType = activeFilter === 'All' || a.type === activeFilter;
      const matchSearch =
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.org.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.year.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchSearch;
    });
  }, [activeFilter, searchQuery]);

  const academicStats = useMemo(() => {
    const completed = semesterData.filter((s) => s.ips !== null && s.sks !== null);
    const totalSemesters = completed.length;
    if (totalSemesters === 0) return { ipk: 0, totalSKS: 0, completedSemesters: 0, latestIPS: 0 };
    const weightedSum = completed.reduce((sum, s) => sum + s.ips! * s.sks!, 0);
    const totalSKS = completed.reduce((sum, s) => sum + s.sks!, 0);
    const ipk = weightedSum / totalSKS;
    const latestCompleted = completed[completed.length - 1];
    return { ipk, totalSKS, completedSemesters: totalSemesters, latestIPS: latestCompleted.ips! };
  }, []);

  const predikat = getPredikat(academicStats.ipk);
  const currentSemester = semesterData.filter((s) => s.ips !== null).length;

  const copyCredentialId = (id: string) => {
    introAudio.playTick(1.0);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[var(--text-primary)]">
            Achievements &amp; Accreditations
          </h1>
          <p className="text-[13px] md:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
            A verified record of technical certifications, national academic olympiad awards, leadership milestones, and verified campus achievements.
          </p>
        </motion.div>

        {/* ── Search Bar & Category Filters ───────────────────────────── */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search awards, certs (e.g. IBM, OSN, RedHat, AI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 py-3 text-xs md:text-sm rounded-xl"
              aria-label="Search achievements"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono text-[var(--text-muted)] mr-1">
              Showing: {filtered.length} of {achievements.length}
            </span>
            {filterTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  introAudio.playTick(1.0);
                  setActiveFilter(type);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  activeFilter === type
                    ? 'bg-[var(--brand)] text-[var(--brand-contrast)] font-bold shadow-xs'
                    : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                }`}
              >
                {type === 'All' ? 'All Accreditations' : type}
              </button>
            ))}
          </div>
        </div>

        {/* ── Achievements Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                layout
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  introAudio.playTick(1.0);
                  setSelectedCertModal(item);
                }}
                className="group p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--brand)] hover:shadow-md transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
              >
                <div className="flex items-start gap-4 relative z-10">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white flex-shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                  >
                    <item.icon className="w-6 h-6 drop-shadow" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors leading-tight line-clamp-1">
                        {item.title}
                      </h3>
                      {item.link && (
                        <ExternalLink size={13} className="text-[var(--text-muted)] group-hover:text-[var(--brand)] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">{item.org}</p>

                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-[var(--bg-muted)] text-[var(--text-muted)] uppercase tracking-wider">
                        {item.type}
                      </span>
                      {item.year && (
                        <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-muted)] px-2 py-0.5 rounded">
                          {item.year}
                        </span>
                      )}
                      {item.credentialId && (
                        <span className="text-[9px] font-mono text-[var(--brand)] bg-[var(--brand-bg)] px-2 py-0.5 rounded ml-auto flex items-center gap-1">
                          <Verified size={11} /> Verified ID
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--border-default)]">
            <p className="text-sm font-semibold text-[var(--text-primary)]">No achievements found</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Try resetting your search query or choosing another category.</p>
          </div>
        )}

        <hr className="dotted-divider" />

        {/* ── Google Developer Profile Section ───────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
                <svg className="w-5 h-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.415 0-6.19-2.775-6.19-6.19s2.775-6.19 6.19-6.19c1.554 0 2.969.578 4.056 1.528l3.1-3.1C19.23 2.19 16.03.785 12.24.785 5.926.785.785 5.926.785 12.24s5.14 11.455 11.455 11.455c6.602 0 10.978-4.636 10.978-11.182 0-.756-.08-1.488-.22-2.228H12.24z" />
                </svg>
                Google Developer Profile Accreditations
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                Verified developer badges • Google Cloud, Gemini Agent &amp; GDG Jakarta
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['AI & ML', 'Firebase', 'Go', 'Next.js', 'Python'].map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 text-[10px] font-mono font-semibold rounded-full bg-[var(--bg-muted)] text-[var(--text-muted)] border border-[var(--border-default)]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Badges Grid with 3D Perspective Tilt */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {googleBadges.map((badge, idx) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -6, scale: 1.04 }}
                className="p-4 rounded-2xl transition-all duration-300 relative group flex flex-col items-center justify-center text-center h-[145px] select-none bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand)] shadow-xs hover:shadow-md"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${badge.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                />
                <div className="flex justify-center items-center h-14 w-full group-hover:scale-110 transition-transform duration-300 relative z-10">
                  {renderBadgeIcon(badge.id)}
                </div>
                <div className="mt-2 relative z-10 w-full">
                  <h4 className="font-bold text-[11px] leading-tight text-[var(--text-primary)] tracking-tight line-clamp-2">
                    {badge.title}
                  </h4>
                  <p className="text-[9px] font-mono text-[var(--text-muted)] font-semibold mt-1">
                    {badge.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <hr className="dotted-divider" />

        {/* ── Campus Academic Tracker (Semester 2 = 3.89) ─────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[var(--brand)]" />
                Campus Academic Milestone Tracker
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-medium mt-0.5">
                D4 Software Engineering Technology • Cumulative Academic Index
              </p>
            </div>
          </div>

          {/* Student Digital ID Card (With SVG Avatar) */}
          <div className="p-6 md:p-8 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-default)] shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              {/* Left: SVG Avatar and Bio Details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="relative">
                  <FelichAvatar size={80} showBadge={true} />
                </div>

                <div className="space-y-2">
                  <div>
                    <h3 className="text-lg md:text-xl font-display font-bold text-[var(--text-primary)]">
                      Felich Pehagasa Ginting
                    </h3>
                    <p className="text-xs font-semibold text-[var(--text-muted)]">
                      D4 Teknologi Rekayasa Perangkat Lunak
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-[var(--text-muted)] justify-center sm:justify-start">
                    <span>ID: FLCH-2025-REXP</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-default)]" />
                    <span>Cohort 2025</span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-default)]" />
                    <span className="flex items-center gap-1 text-[var(--success)] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
                      Semester {currentSemester} (Active)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Cumulative GPA widget */}
              <div className="flex flex-col items-center md:items-end justify-center gap-2 bg-[var(--bg-base)] border border-[var(--border-default)] rounded-2xl p-4 min-w-[150px] text-center md:text-right shadow-inner">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[var(--success)] font-display">
                    {academicStats.ipk.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text-muted)]">/ 4.0</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-[var(--success)]/10 text-[var(--success)] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 border border-[var(--success)]/20">
                  <span>{predikat.emoji}</span>
                  <span>{predikat.label}</span>
                </div>
              </div>
            </div>

            {/* Semester Milestone Cards Grid */}
            <div className="mt-8 pt-6 border-t border-[var(--border-default)]">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {semesterData.map((sem, i) => {
                  const isCompleted = sem.ips !== null;
                  const isCurrent = i === currentSemester - 1;

                  return (
                    <div
                      key={sem.semester}
                      className={`p-4 rounded-xl border transition-all ${
                        isCompleted
                          ? 'border-[var(--border-default)] bg-[var(--bg-base)]'
                          : 'border-[var(--border-default)]/40 bg-[var(--bg-base)]/40 opacity-40'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)]">
                        <span>Semester {sem.semester}</span>
                        {isCompleted && <span className="text-[var(--success)] font-bold">Passed</span>}
                      </div>

                      {isCompleted ? (
                        <div className="mt-2">
                          <p className="text-2xl font-display font-black text-[var(--text-primary)]">
                            {sem.ips!.toFixed(2)}
                          </p>
                          <p className="text-[9px] font-mono text-[var(--text-muted)] mt-0.5">
                            {sem.sks} SKS Completed
                          </p>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <p className="text-xs font-mono text-[var(--text-muted)]">Upcoming</p>
                          <p className="text-[9px] font-mono text-[var(--text-muted)] mt-0.5">Planning</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                <span>Total SKS Terakumulasi: <strong className="text-[var(--text-primary)]">{academicStats.totalSKS} SKS</strong></span>
                <span>Progres: <strong className="text-[var(--text-primary)]">{academicStats.completedSemesters} / {semesterData.length} Semester</strong></span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Certificate Credential Verification Modal ──────────────── */}
        <AnimatePresence>
          {selectedCertModal && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCertModal(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-0 cursor-pointer"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative z-10 w-full max-w-md bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedCertModal.color} flex items-center justify-center text-white shadow-md`}
                    >
                      <selectedCertModal.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm text-[var(--text-primary)] line-clamp-1">
                        {selectedCertModal.title}
                      </h3>
                      <p className="text-[11px] font-mono text-[var(--text-muted)]">
                        {selectedCertModal.org}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCertModal(null)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-muted)]"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Credential ID Copy Box */}
                {selectedCertModal.credentialId && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
                      <span>Credential ID</span>
                      <button
                        onClick={() => copyCredentialId(selectedCertModal.credentialId!)}
                        className="inline-flex items-center gap-1 text-[var(--brand)] hover:underline cursor-pointer"
                      >
                        {copiedId ? (
                          <>
                            <Check size={11} className="text-[var(--success)]" />
                            <span className="text-[var(--success)]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy ID</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-default)] font-mono text-xs text-[var(--text-primary)] break-all select-all">
                      {selectedCertModal.credentialId}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedCertModal.description && (
                  <div className="space-y-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                      Overview &amp; Scope
                    </h4>
                    <p>{selectedCertModal.description}</p>
                  </div>
                )}

                {/* Tested skills */}
                {selectedCertModal.skills && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold">
                      Validated Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCertModal.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-1 text-[10px] font-mono rounded-md bg-[var(--bg-muted)] border border-[var(--border-default)] text-[var(--text-primary)]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Verification CTA */}
                {selectedCertModal.link && (
                  <a
                    href={selectedCertModal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold text-xs text-center hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Verify Official Credential on Issuer Portal</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
