'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { SkillIcons, Iconlenovo, Iconubuntu, Iconanthropic, Icongnometerminal, Iconfigma, Iconnotion, Icongooglechrome, Icongrammarly, Iconublockorigin, Iconapple, Iconxiaomi, Icondiscord, Iconspotify, Iconvirtualbox, Iconkalilinux, Iconalmalinux, Iconmikrotik } from '@/components/SkillIcons';
import { Search, Copy, Check, Terminal, Cpu, HardDrive, Info, Layers, ExternalLink, X } from 'lucide-react';
import { introAudio } from '@/lib/introAudio';

interface UseItem {
  name: string;
  desc: string;
  slug: string;
  color: string;
  specs?: string[];
  whyIUseIt?: string;
  configSnippet?: string;
}

interface Category {
  title: string;
  id: string;
  items: UseItem[];
}

const categories: Category[] = [
  {
    title: '💻 Workstation & Hardware',
    id: 'workstation',
    items: [
      {
        name: 'Lenovo LOQ 15',
        desc: 'Primary development & AI workstation',
        slug: 'lenovo',
        color: '#E2231A',
        specs: [
          'CPU: AMD Ryzen 7 7840HS (8 Cores, 16 Threads, up to 5.1 GHz)',
          'GPU: NVIDIA GeForce RTX 4060 8GB GDDR6 (115W TGP)',
          'RAM: 32GB DDR5 5600MHz Dual-Channel',
          'Storage: 1TB NVMe M.2 PCIe 4.0 SSD',
          'Display: 15.6" 144Hz FHD IPS 100% sRGB',
        ],
        whyIUseIt: 'Exceptional compute horsepower for local LLM inference, WebGL shaders rendering, and Docker containerized development without thermal throttling.',
        configSnippet: '# System Info (Fastfetch)\nOS: Ubuntu 24.04.1 LTS x86_64\nHost: LOQ 15APH8 (Lenovo)\nKernel: 6.8.0-generic\nUptime: 24/7 Dev Environment\nMemory: 32158MiB DDR5',
      },
      {
        name: 'Ubuntu 24.04 LTS',
        desc: 'Primary Operating System',
        slug: 'ubuntu',
        color: '#E95420',
        specs: [
          'Kernel: Linux 6.8',
          'Desktop: GNOME 46 Wayland',
          'Shell: Zsh + Starship prompt',
        ],
        whyIUseIt: 'Rock-solid Linux kernel stability, native Docker virtualization, and standard environment mirroring cloud servers.',
        configSnippet: '# .zshrc prompt snippet\neval "$(starship init zsh)"\nalias dev="npm run dev"\nalias build="npm run build"\nalias g="git"',
      },
      {
        name: 'Legion Ergonomic Mouse',
        desc: 'Precision optical daily driver',
        slug: 'lenovo',
        color: '#E2231A',
        specs: ['DPI: Up to 8000 DPI', 'RGB Chroma lighting', 'Ergonomic palm grip'],
        whyIUseIt: 'Long coding sessions without wrist fatigue and fast multi-monitor cursor tracking.',
      },
    ],
  },
  {
    title: '🛡️ Virtualization & Systems',
    id: 'virtualization',
    items: [
      {
        name: 'VirtualBox',
        desc: 'Primary Hypervisor for isolated lab testing',
        slug: 'virtualbox',
        color: '#183A61',
        specs: ['Type-2 Hypervisor', 'Guest Additions enabled', 'Bridged & NAT networking'],
        whyIUseIt: 'Safe sandbox environment to test kernels, network routes, and security auditing.',
      },
      {
        name: 'Kali Linux',
        desc: 'Security auditing & network assessment',
        slug: 'kalilinux',
        color: '#268BEE',
        specs: ['Nmap, Wireshark, Burp Suite', 'Metasploit framework'],
        whyIUseIt: 'Vulnerability assessment and web application security auditing.',
      },
      {
        name: 'AlmaLinux',
        desc: 'RHEL-compatible server & cloud testing',
        slug: 'almalinux',
        color: '#F04D22',
        specs: ['Enterprise Linux 9', 'SELinux active', 'Systemd services'],
        whyIUseIt: 'Validating server deployments and production enterprise infrastructure.',
      },
      {
        name: 'MikroTik RouterOS',
        desc: 'Network simulation & packet routing',
        slug: 'mikrotik',
        color: '#ED1C24',
        specs: ['VLAN isolation', 'BGP & OSPF simulation', 'Firewall filter rules'],
        whyIUseIt: 'Designing low-latency network topologies and bandwidth traffic engineering.',
      },
    ],
  },
  {
    title: '🛠️ Development Tools',
    id: 'devtools',
    items: [
      {
        name: 'Visual Studio Code',
        desc: 'Primary IDE with tailored configurations',
        slug: 'visualstudiocode',
        color: '#007ACC',
        specs: [
          'Theme: Tokyo Night / Catppuccin Mocha',
          'Font: JetBrains Mono (Ligatures enabled)',
          'Key Extensions: Tailwind CSS, ESLint, Prettier, GitLens, Python, Rust-analyzer',
        ],
        whyIUseIt: 'Unmatched ecosystem speed, rich extension API, and integrated debugger.',
        configSnippet: '{\n  "editor.fontFamily": "\'JetBrains Mono\', monospace",\n  "editor.fontLigatures": true,\n  "editor.tabSize": 2,\n  "editor.formatOnSave": true,\n  "workbench.colorTheme": "Tokyo Night"\n}',
      },
      {
        name: 'Claude 3.5 Sonnet',
        desc: 'AI Architecture & Pair Programming',
        slug: 'anthropic',
        color: '#D97757',
        specs: ['Context: 200k tokens', 'Artifacts & code refactoring engine'],
        whyIUseIt: 'Exceptional precision in TypeScript, system architecture design, and complex algorithmic reasoning.',
      },
      {
        name: 'Gemini 1.5 Pro',
        desc: 'Multimodal AI & 2M Context Analysis',
        slug: 'geminiai',
        color: '#1A73E8',
        specs: ['Context: 2M tokens', 'Audio & visual understanding', 'Function calling'],
        whyIUseIt: 'Deep multimodal analysis, codebase-wide refactoring, and AI chatbot embeddings.',
      },
      {
        name: 'Docker',
        desc: 'Containerization for dev & microservices',
        slug: 'docker',
        color: '#2496ED',
        specs: ['Docker Engine & Docker Compose v2', 'Multi-stage builds'],
        whyIUseIt: 'Deterministic dev environments, isolated databases (PostgreSQL, Redis), and clean CI/CD.',
      },
      {
        name: 'Postman',
        desc: 'API testing & automated suites',
        slug: 'postman',
        color: '#FF6C37',
        specs: ['REST & GraphQL testing', 'Environment variables sync'],
        whyIUseIt: 'Rapid API endpoint validation, automated integration test flows, and mock servers.',
      },
      {
        name: 'GitHub',
        desc: 'Version control & CI/CD Actions',
        slug: 'github',
        color: '#181717',
        specs: ['GitHub Actions CI', 'Dependabot', 'Code review workflows'],
        whyIUseIt: 'Open source collaboration, repository hosting, and automated deployment pipelines.',
      },
    ],
  },
  {
    title: '🎨 Design & Productivity',
    id: 'design',
    items: [
      {
        name: 'Figma',
        desc: 'UI/UX interface prototyping & design systems',
        slug: 'figma',
        color: '#F24E1E',
        specs: ['Auto Layout 5.0', 'Design Tokens', 'Interactive components'],
        whyIUseIt: 'Designing glassmorphic and accessible design tokens before writing a single line of code.',
      },
      {
        name: 'Notion',
        desc: 'Project roadmap & engineering documentation',
        slug: 'notion',
        color: '#000000',
        specs: ['Sprint boards', 'Technical specifications', 'Knowledge base'],
        whyIUseIt: 'Central hub for project roadmaps, architecture diagrams, and milestone tracking.',
      },
    ],
  },
  {
    title: '🌐 Browser & Daily Apps',
    id: 'browser',
    items: [
      {
        name: 'Google Chrome',
        desc: 'Primary browser with DevTools',
        slug: 'googlechrome',
        color: '#4285F4',
        specs: ['Chrome DevTools', 'Lighthouse audit', 'React & Redux DevTools'],
        whyIUseIt: 'Fast V8 engine performance, memory leak profiling, and WebGL shader inspection.',
      },
      {
        name: 'Spotify',
        desc: 'Deep focus soundtrack & Lo-Fi streaming',
        slug: 'spotify',
        color: '#1DB954',
        specs: ['Synced to Portfolio live widget', 'Curated lo-fi & synthwave playlists'],
        whyIUseIt: 'Music fuels uninterrupted coding flow state and deep focus.',
      },
      {
        name: 'Discord & Slack',
        desc: 'Developer communities & team sync',
        slug: 'discord',
        color: '#5865F2',
        specs: ['Engineering channels', 'Real-time pair programming voice'],
        whyIUseIt: 'Engaging with open-source communities and coordinating engineering sprints.',
      },
    ],
  },
];

export default function Uses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeItemModal, setActiveItemModal] = useState<UseItem | null>(null);
  const [copiedConfig, setCopiedConfig] = useState(false);

  const filteredCategories = useMemo(() => {
    return categories
      .map((cat) => {
        if (selectedCategory !== 'All' && cat.id !== selectedCategory) {
          return null;
        }

        const items = cat.items.filter((item) => {
          const matchName = item.name.toLowerCase().includes(searchQuery.toLowerCase());
          const matchDesc = item.desc.toLowerCase().includes(searchQuery.toLowerCase());
          const matchWhy = item.whyIUseIt?.toLowerCase().includes(searchQuery.toLowerCase());
          return matchName || matchDesc || matchWhy;
        });

        if (items.length === 0) return null;
        return { ...cat, items };
      })
      .filter(Boolean) as Category[];
  }, [searchQuery, selectedCategory]);

  const copyConfig = (snippet: string) => {
    introAudio.playTick(1.0);
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(snippet);
      setCopiedConfig(true);
      setTimeout(() => setCopiedConfig(false), 2500);
    }
  };

  const getIcon = (slug: string, color: string, name: string) => {
    const icons: Record<string, any> = {
      lenovo: Iconlenovo,
      ubuntu: Iconubuntu,
      visualstudiocode: SkillIcons.visualstudiocode,
      anthropic: Iconanthropic,
      github: SkillIcons.github,
      docker: SkillIcons.docker,
      postman: SkillIcons.postman,
      gnometerminal: Icongnometerminal,
      figma: Iconfigma,
      notion: Iconnotion,
      googlechrome: Icongooglechrome,
      discord: Icondiscord,
      spotify: Iconspotify,
      geminiai: SkillIcons.geminiai,
      virtualbox: Iconvirtualbox,
      kalilinux: Iconkalilinux,
      almalinux: Iconalmalinux,
      mikrotik: Iconmikrotik,
    };
    const Icon = icons[slug];
    return Icon ? Icon : <span className="text-[10px] font-bold">{name.substring(0, 2).toUpperCase()}</span>;
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-[var(--text-primary)]">
            Uses &amp; Workstation Setup
          </h1>
          <p className="text-[13px] md:text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl">
            A comprehensive breakdown of the hardware, virtualization stack, development tools, and configurations I use daily to build systems. Click on any item for full technical specifications.
          </p>
        </motion.div>

        {/* ── Search Bar & Category Jump ──────────────────────────────── */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search hardware, operating systems, dev tools, or configurations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 py-3 text-xs md:text-sm rounded-xl"
              aria-label="Search uses"
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

          {/* Category Jump Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold shadow-xs'
                  : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[var(--brand)] text-[var(--brand-contrast)] font-semibold shadow-xs'
                    : 'bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-default)]'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <hr className="dotted-divider" />

        {/* ── Category Sections Grid ─────────────────────────────────── */}
        <div className="space-y-10">
          {filteredCategories.length === 0 ? (
            <div className="p-12 rounded-2xl border border-dashed border-[var(--border-default)] text-center">
              <p className="text-sm font-semibold text-[var(--text-primary)]">No tools match your search</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Try searching for a different keyword or reset filters.</p>
            </div>
          ) : (
            filteredCategories.map((cat, catIndex) => (
              <motion.section
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.08 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-display font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />
                  {cat.title}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cat.items.map((item, i) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ scale: 1.01, y: -2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        introAudio.playTick(1.0);
                        setActiveItemModal(item);
                      }}
                      className="group p-5 rounded-2xl border border-[var(--border-default)] bg-[var(--bg-surface)] hover:border-[var(--brand)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-11 h-11 rounded-xl bg-[var(--bg-muted)] flex items-center justify-center flex-shrink-0 border border-[var(--border-default)] relative overflow-hidden"
                          style={{ color: item.color }}
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            {getIcon(item.slug, item.color, item.name)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors truncate">
                              {item.name}
                            </h3>
                            <span className="text-[9px] font-mono text-[var(--brand)] opacity-0 group-hover:opacity-100 transition-opacity">
                              View Specs →
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      {item.specs && (
                        <div className="mt-3 pt-3 border-t border-[var(--border-default)] flex items-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)]">
                          <Info size={11} className="text-[var(--brand)] flex-shrink-0" />
                          <span className="truncate">{item.specs[0]}</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            ))
          )}
        </div>

        {/* ── Interactive Tech Specs Modal ────────────────────────────── */}
        <AnimatePresence>
          {activeItemModal && (
            <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setActiveItemModal(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-0 cursor-pointer"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative z-10 w-full max-w-lg max-h-[85vh] bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-[var(--border-default)] pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl bg-[var(--bg-muted)] flex items-center justify-center border border-[var(--border-default)]"
                      style={{ color: activeItemModal.color }}
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        {getIcon(activeItemModal.slug, activeItemModal.color, activeItemModal.name)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
                        {activeItemModal.name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] font-mono">
                        {activeItemModal.desc}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveItemModal(null)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] bg-[var(--bg-muted)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Specs List */}
                {activeItemModal.specs && (
                  <div className="space-y-2">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                      <Cpu size={13} className="text-[var(--brand)]" />
                      <span>Technical Specifications</span>
                    </h4>
                    <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-default)] space-y-1.5 text-xs font-mono text-[var(--text-primary)]">
                      {activeItemModal.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2">
                          <span className="text-[var(--brand)] font-bold">•</span>
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why I use it */}
                {activeItemModal.whyIUseIt && (
                  <div className="space-y-1.5">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                      <Info size={13} className="text-[var(--brand)]" />
                      <span>Why I Choose This Setup</span>
                    </h4>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {activeItemModal.whyIUseIt}
                    </p>
                  </div>
                )}

                {/* Config Snippet */}
                {activeItemModal.configSnippet && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] font-semibold flex items-center gap-1.5">
                        <Terminal size={13} className="text-[var(--brand)]" />
                        <span>Setup &amp; Config Snippet</span>
                      </h4>
                      <button
                        onClick={() => copyConfig(activeItemModal.configSnippet!)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono bg-[var(--bg-muted)] hover:bg-[var(--border-default)] text-[var(--text-primary)] transition-all cursor-pointer"
                      >
                        {copiedConfig ? (
                          <>
                            <Check size={11} className="text-[var(--success)]" />
                            <span className="text-[var(--success)]">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy Config</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-default)] text-[11px] font-mono text-[var(--text-primary)] overflow-x-auto leading-relaxed">
                      {activeItemModal.configSnippet}
                    </pre>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
