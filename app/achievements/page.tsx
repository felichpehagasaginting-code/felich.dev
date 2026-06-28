'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';
import { Bot, Library, Trophy, Brain, Mic2, BookOpen, Star, Music, Globe, Medal, Scale, Microscope, GraduationCap, BarChart2, Calculator, Building2, Server, Network, Verified, Sparkles } from 'lucide-react';

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
    id: 'firebase-studio',
    title: 'Firebase Studio Developer',
    org: 'Firebase',
    date: 'Apr 3, 2026',
    color: 'from-[#FFCA28]/20 via-[#F57C00]/10 to-transparent',
    borderColor: 'hover:border-[#FFCA28]/50',
    iconColor: '#FFCA28',
  },
  {
    id: 'code-wiki',
    title: 'Code Wiki',
    org: 'Google Developer Program',
    date: 'Apr 3, 2026',
    color: 'from-[#34A853]/20 via-[#4285F4]/10 to-transparent',
    borderColor: 'hover:border-[#34A853]/50',
    iconColor: '#34A853',
  },
  {
    id: 'gcp-nvidia',
    title: 'Google Cloud & NVIDIA community',
    org: 'Google Cloud & NVIDIA',
    date: 'Apr 3, 2026',
    color: 'from-[#34A853]/20 via-[#76B900]/10 to-transparent',
    borderColor: 'hover:border-[#76B900]/50',
    iconColor: '#76B900',
  },
  {
    id: 'gdg-member',
    title: 'Google Developer Group member',
    org: 'Google Developer Groups',
    date: 'Apr 3, 2026',
    color: 'from-[#4285F4]/20 via-[#34A853]/10 to-transparent',
    borderColor: 'hover:border-[#4285F4]/50',
    iconColor: '#4285F4',
  },
  {
    id: 'gdg-discovery',
    title: 'Google Developer Group discovery',
    org: 'Google Developer Groups',
    date: 'Apr 3, 2026',
    color: 'from-[#EA4335]/20 via-[#FBBC05]/10 to-transparent',
    borderColor: 'hover:border-[#EA4335]/50',
    iconColor: '#EA4335',
  },
  {
    id: 'chrome-devtools',
    title: 'Chrome DevTools User',
    org: 'Google Chrome',
    date: 'Jan 6, 2026',
    color: 'from-[#4285F4]/20 via-[#FBBC05]/10 to-transparent',
    borderColor: 'hover:border-[#4285F4]/50',
    iconColor: '#4285F4',
  },
];

function renderBadgeIcon(id: string) {
  switch (id) {
    case 'gdg-jakarta':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="url(#gdgGrad)" opacity="0.15" />
          <circle cx="60" cy="60" r="45" stroke="url(#gdgGrad)" strokeWidth="2" strokeDasharray="4 4" />
          <path d="M42 42 L28 60 L42 78" stroke="#4285F4" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M78 42 L92 60 L78 78" stroke="#34A853" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M52 80 L68 40" stroke="#EA4335" strokeWidth="6" strokeLinecap="round" />
          <circle cx="60" cy="60" r="6" fill="#FBBC05" />
          <defs>
            <linearGradient id="gdgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="33%" stopColor="#EA4335" />
              <stop offset="66%" stopColor="#FBBC05" />
              <stop offset="100%" stopColor="#34A853" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'google-dev-premium':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="60,15 95,35 95,85 60,105 25,85 25,35" fill="url(#premiumGrad)" opacity="0.15" />
          <polygon points="60,18 92,37 92,83 60,102 28,83 28,37" stroke="url(#premiumGrad)" strokeWidth="2" />
          <path d="M60 38 L65 52 L80 52 L68 61 L72 76 L60 67 L48 76 L52 61 L40 52 L55 52 Z" fill="#FBBC05" stroke="#EA4335" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="60" cy="60" r="38" stroke="#4285F4" strokeWidth="2" strokeDasharray="6 6" />
          <defs>
            <linearGradient id="premiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FBBC05" />
              <stop offset="50%" stopColor="#EA4335" />
              <stop offset="100%" stopColor="#4285F4" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'io-2026':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="80" height="80" rx="15" fill="url(#ioGrad)" opacity="0.15" />
          <rect x="22" y="22" width="76" height="76" rx="13" stroke="url(#ioGrad)" strokeWidth="2" />
          <path d="M35 45 C35 37, 45 37, 45 45 L45 75 C45 83, 35 83, 35 75 Z" stroke="#4285F4" strokeWidth="6" strokeLinecap="round" />
          <path d="M62 40 L82 80" stroke="#EA4335" strokeWidth="7" strokeLinecap="round" />
          <circle cx="78" cy="45" r="7" fill="#34A853" />
          <circle cx="55" cy="75" r="6" fill="#FBBC05" />
          <defs>
            <linearGradient id="ioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="100%" stopColor="#EA4335" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'gemini-agent':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="url(#geminiGrad)" opacity="0.15" />
          <path d="M60 25 C60 45, 45 60, 25 60 C45 60, 60 75, 60 95 C60 75, 75 60, 95 60 C75 60, 60 45, 60 25 Z" fill="url(#geminiGrad)" />
          <path d="M60 25 C60 45, 45 60, 25 60 C45 60, 60 75, 60 95 C60 75, 75 60, 95 60 C75 60, 60 45, 60 25 Z" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="40" cy="40" r="3" fill="#ffffff" />
          <circle cx="80" cy="80" r="4" fill="#a855f7" />
          <defs>
            <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'firebase-studio':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="25" width="70" height="70" rx="12" fill="url(#fbGrad)" opacity="0.12" />
          <rect x="25" y="25" width="70" height="70" rx="12" stroke="url(#fbGrad)" strokeWidth="2" />
          <path d="M38 82 L52 35 C52 33, 55 33, 56 35 L64 51 L81 82 C82 84, 80 86, 78 86 L41 86 C39 86, 37 84, 38 82 Z" fill="#FFCA28" />
          <path d="M38 82 L48 48 C48 46, 51 46, 52 48 L58 59 L72 82 C73 84, 71 85, 69 85 L41 85 C39 85, 37 84, 38 82 Z" fill="#F57C00" />
          <path d="M52 35 L58 59 L48 48 Z" fill="#FFA000" opacity="0.8" />
          <circle cx="85" cy="35" r="4" fill="#FFCA28" />
          <defs>
            <linearGradient id="fbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFCA28" />
              <stop offset="100%" stopColor="#F57C00" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'code-wiki':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="20" width="70" height="80" rx="8" fill="url(#wikiGrad)" opacity="0.15" />
          <rect x="25" y="20" width="70" height="80" rx="8" stroke="url(#wikiGrad)" strokeWidth="2" />
          <line x1="90" y1="30" x2="90" y2="90" stroke="#cbd5e1" strokeWidth="2" />
          <path d="M48 50 L38 60 L48 70" stroke="#34A853" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M72 50 L82 60 L72 70" stroke="#4285F4" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M63 45 L57 75" stroke="#EA4335" strokeWidth="5" strokeLinecap="round" />
          <defs>
            <linearGradient id="wikiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34A853" />
              <stop offset="100%" stopColor="#4285F4" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'gcp-nvidia':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="60,15 99,37.5 99,82.5 60,105 21,82.5 21,37.5" fill="url(#gcpNvidiaGrad)" opacity="0.15" />
          <polygon points="60,18 96,39 96,81 60,102 24,81 24,39" stroke="url(#gcpNvidiaGrad)" strokeWidth="2" />
          <path d="M60 35 C74 35, 85 46, 85 60 C85 74, 74 85, 60 85 C46 85, 38 74, 38 60" stroke="#76B900" strokeWidth="4" strokeLinecap="round" />
          <path d="M60 43 C69 43, 77 51, 77 60 C77 69, 69 77, 60 77 C51 77, 46 69, 46 60" stroke="#34A853" strokeWidth="4" strokeLinecap="round" />
          <path d="M52 64 C52 58, 62 50, 70 56 C74 53, 80 58, 78 64 Z" fill="#4285F4" />
          <defs>
            <linearGradient id="gcpNvidiaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34A853" />
              <stop offset="50%" stopColor="#4285F4" />
              <stop offset="100%" stopColor="#76B900" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'gdg-member':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="url(#memberGrad)" opacity="0.12" />
          <circle cx="60" cy="60" r="48" stroke="url(#memberGrad)" strokeWidth="1.5" strokeDasharray="3 6" />
          <line x1="35" y1="40" x2="60" y2="75" stroke="#4285F4" strokeWidth="3" />
          <line x1="85" y1="40" x2="60" y2="75" stroke="#34A853" strokeWidth="3" />
          <line x1="60" y1="75" x2="60" y2="100" stroke="#FBBC05" strokeWidth="3" />
          <line x1="35" y1="40" x2="85" y2="40" stroke="#EA4335" strokeWidth="3" />
          <circle cx="35" cy="40" r="10" fill="#4285F4" stroke="#ffffff" strokeWidth="2" />
          <circle cx="85" cy="40" r="10" fill="#34A853" stroke="#ffffff" strokeWidth="2" />
          <circle cx="60" cy="75" r="12" fill="#EA4335" stroke="#ffffff" strokeWidth="2" />
          <circle cx="60" cy="100" r="8" fill="#FBBC05" stroke="#ffffff" strokeWidth="2" />
          <path d="M57 72 L53 75 L57 78" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M63 72 L67 75 L63 78" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="memberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="50%" stopColor="#EA4335" />
              <stop offset="100%" stopColor="#34A853" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'gdg-discovery':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="50" fill="url(#discGrad)" opacity="0.15" />
          <circle cx="60" cy="60" r="46" stroke="url(#discGrad)" strokeWidth="2" />
          <path d="M60 28 L66 54 L92 60 L66 66 L60 92 L54 66 L28 60 L54 54 Z" fill="#EA4335" stroke="#FBBC05" strokeWidth="1.5" strokeLinejoin="round" />
          <circle cx="60" cy="60" r="6" fill="#ffffff" />
          <circle cx="60" cy="60" r="3" fill="#4285F4" />
          <path d="M40 40 A 28 28 0 0 1 80 40" stroke="#34A853" strokeWidth="2" fill="none" />
          <defs>
            <linearGradient id="discGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA4335" />
              <stop offset="100%" stopColor="#FBBC05" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'chrome-devtools':
      return (
        <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="25" width="80" height="70" rx="10" fill="url(#chromeGrad)" opacity="0.15" />
          <rect x="20" y="25" width="80" height="70" rx="10" stroke="url(#chromeGrad)" strokeWidth="2" />
          <line x1="20" y1="42" x2="100" y2="42" stroke="url(#chromeGrad)" strokeWidth="2" />
          <line x1="45" y1="42" x2="45" y2="95" stroke="url(#chromeGrad)" strokeWidth="1.5" />
          <circle cx="30" cy="33" r="4" fill="#EA4335" />
          <circle cx="42" cy="33" r="4" fill="#FBBC05" />
          <circle cx="54" cy="33" r="4" fill="#34A853" />
          <rect x="53" y="52" width="38" height="6" rx="2" fill="#4285F4" opacity="0.8" />
          <rect x="53" y="66" width="28" height="6" rx="2" fill="#FBBC05" opacity="0.8" />
          <rect x="53" y="80" width="34" height="6" rx="2" fill="#34A853" opacity="0.8" />
          <path d="M30 65 L38 80 L34 82 L26 69 Z" fill="#4285F4" />
          <defs>
            <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" />
              <stop offset="50%" stopColor="#34A853" />
              <stop offset="100%" stopColor="#FBBC05" />
            </linearGradient>
          </defs>
        </svg>
      );
    default:
      return null;
  }
}

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

        {/* ============================================================
           GOOGLE DEVELOPER PROFILE SECTION
           ============================================================ */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-50px" }} 
          transition={{ duration: 0.5 }} 
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.415 0-6.19-2.775-6.19-6.19s2.775-6.19 6.19-6.19c1.554 0 2.969.578 4.056 1.528l3.1-3.1C19.23 2.19 16.03.785 12.24.785 5.926.785.785 5.926.785 12.24s5.14 11.455 11.455 11.455c6.602 0 10.978-4.636 10.978-11.182 0-.756-.08-1.488-.22-2.228H12.24z" />
                </svg>
                Google Developer Profile
              </h2>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold mt-1">
                Verified member credentials & badges • AI, Firebase & Go
              </p>
            </div>
            
            {/* Short Interest tags */}
            <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end">
              {['AI & Machine Learning', 'Firebase', 'Go', 'JavaScript', 'Python'].map((interest) => (
                <span 
                  key={interest} 
                  className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800/50 select-none cursor-default"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Badges Grid - Simple and Minimalist */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {googleBadges.map((badge, idx) => (
              <motion.div 
                key={badge.id}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 rounded-2xl transition-all duration-300 relative group flex flex-col items-center justify-center text-center h-[140px] select-none hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 border border-transparent hover:border-neutral-200/30 dark:hover:border-neutral-800/30 shadow-none hover:shadow-sm"
              >
                {/* Soft ambient glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${badge.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="flex justify-center items-center h-14 w-full group-hover:scale-105 transition-transform duration-300 relative z-10">
                  {renderBadgeIcon(badge.id)}
                </div>
                
                <div className="mt-2.5 relative z-10 w-full">
                  <h4 className="font-bold text-[10px] leading-tight text-neutral-600 dark:text-neutral-300 tracking-tight line-clamp-2 min-h-[1.5rem]">
                    {badge.title}
                  </h4>
                  <p className="text-[8px] font-mono text-neutral-400 dark:text-neutral-500 font-semibold mt-1">
                    {badge.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

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
            initial={{ opacity: 0, y: 15 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="p-1 rounded-[2rem] bg-gradient-to-br from-neutral-200/50 via-neutral-100/30 to-transparent dark:from-neutral-800/40 dark:via-neutral-900/20 dark:to-transparent mb-8"
          >
            <div className="p-6 md:p-8 rounded-[2rem] bg-white/40 dark:bg-neutral-900/30 backdrop-blur-2xl border border-white/20 dark:border-white/5 overflow-hidden shadow-xl liquid-glass">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 relative z-10">
                {/* Left side: Photo and details */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 p-0.5 ring-2 ring-neutral-200 dark:ring-neutral-800 shadow-lg overflow-hidden">
                       <Image
                         src="/images/profile.jpg"
                         alt="Student Profile"
                         width={96}
                         height={96}
                         sizes="6rem"
                         className="w-full h-full object-cover animate-fade-in"
                       />
                    </div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-900 flex items-center justify-center shadow">
                       <Verified className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 dark:text-white uppercase">Felich Pehagasa Ginting</h3>
                      <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">D4 Teknologi Rekayasa Perangkat Lunak</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 dark:text-neutral-500 font-medium justify-center sm:justify-start">
                      <span>ID: FLCH-2025-REXP</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                      <span>Cohort 2025</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Semester {currentSemester}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right side: GPA Widget */}
                <div className="flex flex-col items-center md:items-end justify-center gap-2.5 bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-4 min-w-[160px] text-center md:text-right shadow-inner">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black bg-gradient-to-br from-emerald-500 to-teal-500 bg-clip-text text-transparent">{academicStats.ipk.toFixed(2)}</span>
                    <span className="text-xs font-semibold text-neutral-400">/ 4.0</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-emerald-500/20">
                    <span>{predikat.emoji}</span>
                    <span>{predikat.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Semester Progress Cards */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
               <h3 className="text-lg font-extrabold tracking-tight uppercase text-neutral-500 dark:text-neutral-400">Academic Milestone</h3>
               <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800" />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {semesterData.map((sem, i) => {
                const isCompleted = sem.ips !== null;
                const isCurrent = i === currentSemester;
                return (
                  <motion.div 
                    key={sem.semester} 
                    initial={{ opacity: 0, y: 15 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }} 
                    transition={{ delay: i * 0.04 }} 
                    className={`p-5 rounded-2xl border transition-all duration-300 relative group flex flex-col justify-between min-h-[120px] ${
                      isCompleted 
                        ? 'border-neutral-200 dark:border-neutral-800/80 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl hover:border-emerald-500/20 hover:shadow-sm' 
                        : isCurrent 
                        ? 'border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/10 shadow-sm' 
                        : 'border-neutral-100 dark:border-neutral-900 bg-neutral-50/10 dark:bg-neutral-900/5 opacity-40'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                      Semester {sem.semester}
                    </span>
                    
                    {isCompleted ? (
                      <div className="mt-2">
                        <p className="text-3xl font-black bg-gradient-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">{sem.ips!.toFixed(2)}</p>
                        <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 mt-1 uppercase tracking-wider">{sem.sks} SKS Completed</p>
                      </div>
                    ) : isCurrent ? (
                      <div className="mt-2 flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-blue-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          ACTIVE
                        </p>
                        <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">In Progress</p>
                      </div>
                    ) : (
                      <div className="mt-2 flex flex-col gap-0.5">
                        <p className="text-sm font-bold text-neutral-300 dark:text-neutral-700">—</p>
                        <p className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">Pending</p>
                      </div>
                    )}
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
