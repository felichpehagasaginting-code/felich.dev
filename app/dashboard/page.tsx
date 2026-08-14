'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, GitFork, BarChart2, Music, Headphones, Folder, Search, Activity, Globe, Cpu, Clock, CheckCircle2, ShieldCheck, Terminal } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useTranslation } from 'react-i18next';
import { useSpotify } from '@/lib/useSpotify';

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12C0 17.31 3.438 21.8 8.205 23.385C8.805 23.49 9.025 23.13 9.025 22.815C9.025 22.53 9.015 21.78 9.01 20.78C5.672 21.504 4.968 19.17 4.968 19.17C4.422 17.784 3.633 17.415 3.633 17.415C2.546 16.671 3.717 16.686 3.717 16.686C4.922 16.771 5.555 17.923 5.555 17.923C6.625 19.757 8.364 19.227 9.05 18.92C9.158 18.144 9.467 17.615 9.81 17.315C7.145 17.015 4.344 15.982 4.344 11.385C4.344 10.075 4.809 9.005 5.579 8.165C5.444 7.862 5.039 6.642 5.684 4.989C5.684 4.989 6.689 4.667 8.984 6.219C9.939 5.952 10.959 5.82 11.979 5.814C12.999 5.82 14.019 5.952 14.974 6.219C17.269 4.667 18.274 4.989 18.274 4.989C18.919 6.642 18.514 7.862 18.379 8.165C19.149 9.005 19.614 10.075 19.614 11.385C19.614 15.992 16.809 17.012 14.144 17.306C14.574 17.676 14.959 18.411 14.959 19.536C14.959 21.141 14.944 22.431 14.944 22.821C14.944 23.139 15.159 23.514 15.774 23.394C20.565 21.8 24 17.31 24 12C24 5.37 18.63 0 12 0Z" fill="currentColor"/>
    </svg>
  );
}

// Generate mock contribution data
function generateContribData() {
  const weeks = 20;
  const days = 7;
  const data: { level: number, count: number, date: string }[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: { level: number, count: number, date: string }[] = [];
    for (let d = 0; d < days; d++) {
      const rand = Math.random();
      let level = 0;
      let count = 0;
      if (rand > 0.8) { level = 4; count = 12; }
      else if (rand > 0.6) { level = 3; count = 8; }
      else if (rand > 0.4) { level = 2; count = 5; }
      else if (rand > 0.3) { level = 1; count = 2; }
      week.push({ level, count, date: '' });
    }
    data.push(week);
  }
  return data;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  C: '#555555',
  'C++': '#f34b7d',
  Dart: '#00B4AB',
};

interface Repo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
}

const REPO_CATEGORIES = ['All', 'AI & ML', 'Web Apps', 'FinTech', 'Tools'];

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: spotify, progressMs } = useSpotify();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contribData, setContribData] = useState<{ level: number, count: number, date: string }[][]>(() => generateContribData());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'forks'>('updated');
  const [hoveredDay, setHoveredDay] = useState<{ count: number; date: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reposRes, contribRes] = await Promise.allSettled([
          fetch('/api/github-repos').then(async (res) => {
            if (!res.ok) throw new Error(`GitHub repos fetch failed: ${res.status}`);
            return res.json();
          }),
          fetch('/api/github-contributions').then(async (res) => {
            if (!res.ok) throw new Error(`GitHub contributions fetch failed: ${res.status}`);
            return res.json();
          })
        ]);

        if (reposRes.status === 'fulfilled') {
          setRepos(reposRes.value);
        } else {
          console.error('Failed to fetch GitHub repos:', reposRes.reason);
          setError('Failed to fetch GitHub data');
        }

        if (contribRes.status === 'fulfilled' && contribRes.value && contribRes.value.weeks) {
          setContribData(contribRes.value.weeks);
        } else {
          console.warn(
            'Contributions fetch failed, using simulated data.',
            contribRes.status === 'rejected' ? contribRes.reason : 'Invalid data format'
          );
        }
      } catch (err: any) {
        setError('Failed to fetch GitHub data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute language distribution
  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    let total = 0;

    repos.forEach((r) => {
      if (r.language) {
        counts[r.language] = (counts[r.language] || 0) + 1;
        total += 1;
      }
    });

    if (total === 0) return [];

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / total) * 100),
        color: LANGUAGE_COLORS[name] || '#888888',
      }))
      .sort((a, b) => b.count - a.count);
  }, [repos]);

  // Filtered and sorted repositories
  const filteredRepos = useMemo(() => {
    return repos
      .filter((r) => {
        const matchesQuery =
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase()));

        if (!matchesQuery) return false;

        if (selectedCategory === 'All') return true;
        if (selectedCategory === 'AI & ML') {
          return (
            r.name.toLowerCase().includes('ai') ||
            r.name.toLowerCase().includes('ml') ||
            r.name.toLowerCase().includes('vision') ||
            (r.description && (r.description.toLowerCase().includes('ai') || r.description.toLowerCase().includes('model')))
          );
        }
        if (selectedCategory === 'FinTech') {
          return (
            r.name.toLowerCase().includes('fin') ||
            r.name.toLowerCase().includes('pay') ||
            (r.description && r.description.toLowerCase().includes('fintech'))
          );
        }
        if (selectedCategory === 'Web Apps') {
          return r.language === 'TypeScript' || r.language === 'JavaScript' || r.language === 'HTML';
        }
        if (selectedCategory === 'Tools') {
          return r.language === 'Python' || r.language === 'Shell' || r.name.toLowerCase().includes('tool');
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
        if (sortBy === 'forks') return b.forks_count - a.forks_count;
        return 0; // Default order is updated
      });
  }, [repos, searchQuery, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="w-full space-y-8 animate-pulse p-2">
        <div className="space-y-3">
          <div className="h-9 w-52 bg-[var(--bg-muted)] rounded-xl" />
          <div className="h-4 w-80 max-w-full bg-[var(--bg-muted)] rounded-lg" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-default)] space-y-3">
              <div className="h-3 w-20 bg-[var(--bg-muted)] rounded" />
              <div className="h-8 w-16 bg-[var(--bg-muted)] rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-[var(--danger-bg)] border border-[var(--danger-border)] text-[var(--danger)]">
        {error}
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--text-primary)] text-[var(--bg-base)]" style={{ borderRadius: '6px' }}>
              <GithubIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-bold tracking-[-0.01em] text-[var(--text-primary)]">
                {t('dashboard')}
              </h1>
              <p className="text-[13px] text-[var(--text-muted)] mt-0.5">
                {t('dashboard_desc')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── System Status & Latency Matrix ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--success)]" />
            </span>
            <span className="text-[var(--text-primary)] font-bold">All Systems Operational</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[var(--text-muted)] text-[11px]">
            <span className="flex items-center gap-1.5">
              <Activity size={13} className="text-[var(--brand)]" />
              Edge Latency: ~16ms
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-[var(--brand)]" />
              Asia/Jakarta (WIB UTC+7)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Cpu size={13} className="text-[var(--brand)]" />
              Next.js 16 Webpack SSG
            </span>
          </div>
        </motion.div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: t('dashboard_stats_repos'), value: repos.length },
            { label: t('dashboard_stats_stars'), value: repos.reduce((a, r) => a + r.stargazers_count, 0) },
            { label: t('dashboard_stats_forks'), value: repos.reduce((a, r) => a + r.forks_count, 0) },
            { label: t('dashboard_stats_languages'), value: languageStats.length }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="p-5 bg-[var(--bg-surface)] border border-[var(--border-default)] hover:border-[var(--brand)] transition-all duration-150 rounded-xl shadow-xs"
            >
              <AnimatedCounter 
                end={stat.value} 
                className="text-3xl font-display font-bold text-[var(--brand)] block mb-1" 
              />
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Language & Tech Stack Distribution ───────────────────────── */}
        {languageStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-default)] space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Terminal size={15} className="text-[var(--brand)]" />
                Language &amp; Code Distribution
              </h3>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">Public Repositories</span>
            </div>

            {/* Segmented Bar */}
            <div className="h-3 rounded-full overflow-hidden flex bg-[var(--bg-muted)] w-full">
              {languageStats.map((lang) => (
                <div
                  key={lang.name}
                  style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                  title={`${lang.name}: ${lang.percentage}%`}
                  className="h-full transition-all duration-500 first:rounded-l-full last:rounded-r-full"
                />
              ))}
            </div>

            {/* Language Legend Chips */}
            <div className="flex flex-wrap gap-3 pt-1">
              {languageStats.map((lang) => (
                <div key={lang.name} className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
                  <span className="font-semibold text-[var(--text-primary)]">{lang.name}</span>
                  <span className="text-[var(--text-muted)] text-[10px]">{lang.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── GitHub Contribution Heatmap ──────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[var(--brand)]" /> 
              {t('dashboard_contributions')}
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--bg-muted)] border border-[var(--border-default)]">
               <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
               <span className="text-[10px] font-bold font-mono text-[var(--text-muted)]">LIVE FEED</span>
            </div>
          </div>
          
          <div className="p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--glass-bg)] backdrop-blur-xl overflow-x-auto shadow-xs">
            <div className="flex gap-[3px] min-w-fit">
              {contribData.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <motion.div
                      key={`${wi}-${di}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + (wi * 0.005) }}
                      whileHover={{ scale: 1.4, zIndex: 10 }}
                      onMouseEnter={() => setHoveredDay({ count: day.count, date: day.date || `Week ${wi + 1}` })}
                      onMouseLeave={() => setHoveredDay(null)}
                      className={`w-[11px] h-[11px] rounded-[2px] transition-colors duration-200 cursor-pointer ${
                        day.level === 0 ? 'bg-[#ebedf0] dark:bg-[#161b22]' :
                        day.level === 1 ? 'bg-[#9be9a8] dark:bg-[#0e4429]' :
                        day.level === 2 ? 'bg-[#40c463] dark:bg-[#006d32]' :
                        day.level === 3 ? 'bg-[#30a14e] dark:bg-[#26a641]' :
                        'bg-[#216e39] dark:bg-[#39d353]'
                      }`}
                      title={day.count > 0 ? `${day.count} contributions${day.date ? ' on ' + day.date : ''}` : `No contributions${day.date ? ' on ' + day.date : ''}`}
                    />
                  ))}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-4 text-[10px] font-mono text-[var(--text-muted)]">
              <span>
                {hoveredDay ? `${hoveredDay.count} contributions (${hoveredDay.date})` : 'Hover on any block to view details'}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="uppercase tracking-widest mr-1">{t('less')}</span>
                <div className="flex gap-[3px]">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-[11px] h-[11px] rounded-[2px] ${
                      i === 0 ? 'bg-[#ebedf0] dark:bg-[#161b22]' :
                      i === 1 ? 'bg-[#9be9a8] dark:bg-[#0e4429]' :
                      i === 2 ? 'bg-[#40c463] dark:bg-[#006d32]' :
                      i === 3 ? 'bg-[#30a14e] dark:bg-[#26a641]' :
                      'bg-[#216e39] dark:bg-[#39d353]'
                    }`} />
                  ))}
                </div>
                <span className="uppercase tracking-widest ml-1">{t('more')}</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Spotify Now Playing Card ─────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-2xl border border-[var(--border-default)] shadow-xs">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg ring-1 ring-[var(--border-default)] relative">
                  {spotify?.albumImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img 
                      src={spotify.albumImageUrl} 
                      alt={spotify.album} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-white">
                      <Headphones className="w-8 h-8 animate-bounce" />
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[var(--bg-base)] p-1.5 rounded-full shadow-md">
                  <Music className={`w-3.5 h-3.5 text-[var(--success)] ${spotify?.isPlaying ? 'animate-spin-slow' : ''}`} />
                </div>
              </div>
              
              <div className="flex-1 w-full text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                  <span className="flex h-2 w-2 relative">
                    {spotify?.isPlaying && (
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                    )}
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${spotify?.isPlaying ? 'bg-[var(--success)]' : 'bg-[var(--text-muted)]'}`}></span>
                  </span>
                  <p className={`text-[10px] font-mono font-bold uppercase tracking-wider ${spotify?.isPlaying ? 'text-[var(--success)]' : 'text-[var(--text-muted)]'}`}>
                    {spotify?.isPlaying ? t('dashboard_spotify_streaming') : t('spotify_last_played')}
                  </p>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-0.5 truncate">
                  {spotify?.title || 'Coding Flow & Lo-Fi'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-medium mb-3">
                  {spotify?.artist || 'Deep Focus'} • {spotify?.album || '24/7 Beats'}
                </p>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-[var(--bg-muted)] rounded-full overflow-hidden mb-1.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${spotify ? Math.min(100, (progressMs / spotify.durationMs) * 100) : 0}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                  />
                </div>
                <div className="flex justify-between text-[8px] font-mono font-bold text-[var(--text-muted)]">
                  <span>{formatTime(progressMs)}</span>
                  <span>{formatTime(spotify?.durationMs || 0)}</span>
                </div>
              </div>
              
              <a
                href={spotify?.songUrl || 'https://open.spotify.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-green-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-green-600 transition-all shadow-md active:scale-95"
              >
                {t('dashboard_spotify_listen')}
              </a>
            </div>
          </div>
        </motion.section>

        {/* ── Repositories Explorer & Filters ─────────────────────────── */}
        <section className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-display font-bold tracking-tight flex items-center gap-2">
                <Folder className="w-5 h-5 text-[var(--brand)]" />
                {t('dashboard_active_repos')}
              </h2>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Showing {filteredRepos.length} of {repos.length} repositories
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search repository..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-9 py-2 text-xs"
              />
            </div>
          </div>

          {/* Category Filter Pills & Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-default)]">
            <div className="flex flex-wrap items-center gap-1.5">
              {REPO_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold shadow-xs'
                      : 'bg-[var(--bg-base)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[var(--bg-base)] border border-[var(--border-default)] rounded px-2 py-1 text-xs text-[var(--text-primary)] outline-none"
              >
                <option value="updated">Recently Updated</option>
                <option value="stars">Most Stars</option>
                <option value="forks">Most Forks</option>
              </select>
            </div>
          </div>

          {/* Repos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredRepos.map((repo, index) => (
                <motion.a
                  key={repo.name}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03 }}
                  className="group p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--brand)] hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-[var(--brand)]" />
                        <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors truncate">
                          {repo.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">Public</span>
                    </div>

                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-4">
                      {repo.description || 'Open source engineering project repository.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-default)]">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[10px] font-bold text-[var(--text-muted)]">
                      <Star className="w-3 h-3 text-[var(--warning)]" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[10px] font-bold text-[var(--text-muted)]">
                      <GitFork className="w-3 h-3 text-[var(--brand)]" />
                      <span>{repo.forks_count}</span>
                    </div>
                    {repo.language && (
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-muted)] text-[10px] font-bold text-[var(--text-muted)] ml-auto">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[repo.language] || '#888' }} />
                        <span>{repo.language}</span>
                      </div>
                    )}
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}
