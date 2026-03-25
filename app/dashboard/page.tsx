'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Star, GitFork } from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import AnimatedCounter from '@/components/AnimatedCounter';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

// Generate mock contribution data
function generateContribData() {
  const weeks = 20;
  const days = 7;
  const data: number[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: number[] = [];
    for (let d = 0; d < days; d++) {
      const rand = Math.random();
      if (rand < 0.3) week.push(0);
      else if (rand < 0.6) week.push(1);
      else if (rand < 0.8) week.push(2);
      else if (rand < 0.95) week.push(3);
      else week.push(4);
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
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const contribData = useMemo(() => generateContribData(), []);

  useEffect(() => {
    const username = 'felichpehagasaginting-code';
    const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

    const fetchData = async () => {
      try {
        const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
          headers: token ? { Authorization: `token ${token}` } : {}
        });
        setRepos(reposRes.data);
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
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <GithubIcon className="w-8 h-8" />
            Dashboard
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            GitHub repository overview & activity.
          </p>
        </motion.div>

        <hr className="dotted-divider mb-8" />

        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
            <AnimatedCounter end={repos.length} className="text-2xl font-bold text-primary" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Repositories</p>
          </div>
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
            <AnimatedCounter end={repos.reduce((a, r) => a + r.stargazers_count, 0)} className="text-2xl font-bold text-primary" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Stars</p>
          </div>
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
            <AnimatedCounter end={repos.reduce((a, r) => a + r.forks_count, 0)} className="text-2xl font-bold text-primary" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Total Forks</p>
          </div>
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 text-center hover-lift">
            <AnimatedCounter end={new Set(repos.map(r => r.language).filter(Boolean)).size} className="text-2xl font-bold text-primary" />
            <p className="text-xs text-neutral-500 dark:text-neutral-400">Languages</p>
          </div>
        </div>

        {/* GitHub Contribution Graph */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            📊 Contribution Graph
          </h2>
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 overflow-x-auto">
            <div className="flex gap-[3px] min-w-fit">
              {contribData.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((level, di) => (
                    <div
                      key={`${wi}-${di}`}
                      className={`w-3 h-3 contrib-cell ${contribColors[level]}`}
                      title={`${level} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3 text-[10px] text-neutral-500">
              <span>Less</span>
              {contribColors.map((color, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
              ))}
              <span>More</span>
            </div>
          </div>
        </motion.section>

        {/* Spotify Now Playing */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🎵 Now Playing
          </h2>
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg">
                🎧
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  LISTENING TO SPOTIFY
                </p>
                <h3 className="font-bold text-sm truncate">Coding Lo-Fi Mix</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">Lo-Fi Beats • Focus Flow</p>
              </div>
              <a
                href="https://open.spotify.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors flex-shrink-0"
              >
                Open
              </a>
            </div>
          </div>
        </motion.section>

        {/* Repositories */}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Star className="w-5 h-5" />
          Repositories
        </h2>

        <div className="space-y-3">
          {repos.map((repo, index) => (
            <motion.a
              key={repo.name}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="group flex items-start gap-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50 hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">📁</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold group-hover:text-primary transition-colors truncate">{repo.name}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">{repo.description || 'No description'}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" />
                    {repo.forks_count}
                  </span>
                  {repo.language && (
                    <span className="capitalize">{repo.language}</span>
                  )}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-center"
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            Add to <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-xs font-mono">.env.local</code>: <code className="px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 rounded text-xs font-mono">NEXT_PUBLIC_GITHUB_TOKEN=ghp_...</code>
          </p>
          <a
            href="https://github.com/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            Generate Token
          </a>
        </motion.div>
      </div>
    </PageTransition>
  );
}
