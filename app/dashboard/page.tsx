'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Star, GitFork, BarChart2, Music, Headphones, Folder } from 'lucide-react';
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

const contribColors = [
  'bg-neutral-100 dark:bg-neutral-800',
  'bg-green-200 dark:bg-green-900',
  'bg-green-400 dark:bg-green-700',
  'bg-green-500 dark:bg-green-500',
  'bg-green-700 dark:bg-green-400',
];

interface Repo {
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { data: spotify, progressMs } = useSpotify();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contribData, setContribData] = useState<{ level: number, count: number, date: string }[][]>(() => generateContribData());

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="relative">
        {/* Holographic Glow Background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 relative"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-xl shadow-black/10 dark:shadow-white/10">
              <GithubIcon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 dark:from-white dark:via-neutral-400 dark:to-white bg-clip-text text-transparent">
                {t('dashboard')}
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium mt-1">
                {t('dashboard_desc')}
              </p>
            </div>
          </div>
        </motion.div>

        <hr className="dotted-divider mb-10 opacity-50" />

        {/* Stats overview - Elite Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: t('dashboard_stats_repos'), value: repos.length, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
            { label: t('dashboard_stats_stars'), value: repos.reduce((a, r) => a + r.stargazers_count, 0), color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-500/20' },
            { label: t('dashboard_stats_forks'), value: repos.reduce((a, r) => a + r.forks_count, 0), color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/20' },
            { label: t('dashboard_stats_languages'), value: new Set(repos.map(r => r.language).filter(Boolean)).size, color: 'from-pink-500 to-rose-500', shadow: 'shadow-pink-500/20' }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-2xl transition-all duration-300 liquid-glass"
            >
              <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-[2rem]`} />
              <div className="relative z-10">
                <AnimatedCounter 
                  end={stat.value} 
                  className={`text-4xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent block mb-1`} 
                />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200 transition-colors">
                  {stat.label}
                </p>
              </div>
              <div className={`absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br ${stat.color} blur-2xl opacity-0 group-hover:opacity-40 transition-opacity`} />
            </motion.div>
          ))}
        </div>

        {/* GitHub Contribution Graph - Modern Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-500" /> 
              {t('dashboard_contributions')}
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-bold font-mono text-neutral-500">LIVE_FEED</span>
            </div>
          </div>
          
          <div className="p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl overflow-x-auto shadow-sm liquid-glass">
            <div className="flex gap-[3px] min-w-fit">
              {contribData.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => (
                    <motion.div
                      key={`${wi}-${di}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + (wi * 0.01) }}
                      whileHover={{ scale: 1.5, zIndex: 10 }}
                      className={`w-[11px] h-[11px] rounded-[2px] transition-colors duration-300 ${
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
            <div className="flex items-center justify-end gap-2 mt-4 text-[10px] font-bold font-mono text-neutral-400">
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
        </motion.section>

        {/* Spotify Now Playing - Premium Player */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="group p-1 rounded-[2.5rem] bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-transparent p-[1px]">
            <div className="p-6 rounded-[2.5rem] bg-white/60 dark:bg-black/40 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-2xl shadow-green-500/5 liquid-glass">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-2xl shadow-green-500/20 group-hover:scale-105 transition-transform duration-500 ring-2 ring-white/20 relative">
                    {spotify?.albumImageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img 
                        src={spotify.albumImageUrl} 
                        alt={spotify.album} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white">
                        <Headphones className="w-10 h-10 animate-bounce" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white dark:bg-black p-2 rounded-full shadow-lg">
                    <Music className={`w-4 h-4 text-green-500 ${spotify?.isPlaying ? 'animate-spin-slow' : ''}`} />
                  </div>
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <span className="flex h-2 w-2 relative">
                      {spotify?.isPlaying && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${spotify?.isPlaying ? 'bg-green-500' : 'bg-neutral-400'}`}></span>
                    </span>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${spotify?.isPlaying ? 'text-green-600 dark:text-green-400' : 'text-neutral-500'}`}>
                      {spotify?.isPlaying ? t('dashboard_spotify_streaming') : t('spotify_last_played')}
                    </p>
                  </div>
                  <h3 className="text-2xl font-black tracking-tighter mb-1 truncate">
                    {spotify?.title || 'Coding Flow & Lo-Fi'}
                  </h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium mb-4">
                    {spotify?.artist || 'Deep Focus'} • {spotify?.album || '24/7 Beats'}
                  </p>
                  
                  {/* Progress Bar Simulation */}
                  <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${spotify ? Math.min(100, (progressMs / spotify.durationMs) * 100) : 0}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                    />
                  </div>
                  <div className="flex justify-between text-[8px] font-mono font-bold text-neutral-400 tracking-widest">
                    <span>{formatTime(progressMs)}</span>
                    <span>{formatTime(spotify?.durationMs || 0)}</span>
                  </div>
                </div>
                
                <a
                  href={spotify?.songUrl || 'https://open.spotify.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 rounded-2xl bg-green-500 text-white text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-500/20 hover:-translate-y-1 active:scale-95"
                >
                  {t('dashboard_spotify_listen')}
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Repositories - Elite Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Folder className="w-7 h-7 text-blue-500" />
            {t('dashboard_active_repos')}
          </h2>
          <div className="h-px flex-1 bg-neutral-100 dark:bg-neutral-800 mx-6 hidden md:block" />
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{t('dashboard_sort_updated')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo, index) => (
            <motion.a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(59,130,246,0.1)] transition-all duration-500 relative overflow-hidden liquid-glass"
            >
              {/* Animated Border Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-inner group-hover:rotate-3">
                  <Folder className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-xl mb-1 truncate group-hover:text-primary transition-colors tracking-tight">
                    {repo.name}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {repo.description || 'No description provided for this technical architecture.'}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 text-[10px] font-black text-neutral-500 group-hover:border-blue-500/20 group-hover:bg-blue-500/5 transition-all">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      {repo.stargazers_count}
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 text-[10px] font-black text-neutral-500 group-hover:border-blue-500/20 group-hover:bg-blue-500/5 transition-all">
                      <GitFork className="w-3.5 h-3.5 text-blue-500" />
                      {repo.forks_count}
                    </div>
                    {repo.language && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 text-[10px] font-black text-neutral-500 group-hover:border-blue-500/20 group-hover:bg-blue-500/5 transition-all">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        {repo.language}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer Technical Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 p-8 rounded-[2.5rem] border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-neutral-200/50 dark:bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400 mb-4 relative z-10">
             {t('dashboard_token_note')} <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded font-mono text-xs">.env.local</code>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <a
              href="https://github.com/settings/tokens"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95"
            >
              {t('dashboard_get_token')}
            </a>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
