'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';

type Command = {
  text: string;
  output: React.ReactNode;
  path: string;
};

type FileNode = {
  type: 'file';
  content: React.ReactNode;
};

type DirectoryNode = {
  type: 'dir';
  children: Record<string, FileNode | DirectoryNode>;
};

type VFSNode = FileNode | DirectoryNode;

const VFS: Record<string, VFSNode> = {
  'about.md': {
    type: 'file',
    content: (
      <div className="space-y-1">
        <p className="text-white font-bold">Felich Pehagasa Ginting</p>
        <p className="text-neutral-400">D4 Software Engineering Technology student at Politeknik Kelapa Sawit Citra Widya Edukasi.</p>
        <p className="text-neutral-400">Focused on building intelligent AI-driven systems and scalable financial platforms.</p>
      </div>
    )
  },
  'resume.md': {
    type: 'file',
    content: (
      <div className="space-y-2">
        <p className="text-white font-bold">[ EXPERIENCE / EDUCATION ]</p>
        <p className="text-neutral-400">• <span className="text-blue-400">Politeknik CWE</span> (2025 - 2029) - D4 Software Engineering Technology</p>
        <p className="text-neutral-400">• <span className="text-blue-400">BPDP Scholar</span> - Full scholarship recipient</p>
      </div>
    )
  },
  'secret.txt': {
    type: 'file',
    content: <span className="text-yellow-500 italic">&quot;The best way to predict the future is to invent it.&quot; - Alan Kay</span>
  },
  'contact.md': {
    type: 'file',
    content: (
      <div className="flex flex-col gap-1">
        <span>Email: <a href="mailto:hello@felich.dev" className="text-blue-400 hover:underline">hello@felich.dev</a></span>
        <span>GitHub: <a href="https://github.com/felichpehagasaginting-code" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/felichpehagasaginting-code</a></span>
        <span>Instagram: <a href="https://instagram.com/fel.comp" className="text-blue-400 hover:underline">@fel.comp</a></span>
        <span>LinkedIn: <a href="https://linkedin.com/in/felich-pehagasa-ginting" className="text-blue-400 hover:underline">Felich Ginting</a></span>
      </div>
    )
  },
  'projects': {
    type: 'dir',
    children: {
      'fintech.md': {
        type: 'file',
        content: (
          <div>
            <span className="text-green-400 font-bold">FinTech Dashboard</span>
            <p className="text-neutral-400 mt-1">A real-time financial tracking dashboard built with Next.js and Firebase. Supports bank statement parsing and analytics.</p>
          </div>
        )
      },
      'aiml.md': {
        type: 'file',
        content: (
          <div>
            <span className="text-purple-400 font-bold">AI/ML Platform</span>
            <p className="text-neutral-400 mt-1">A data-engineering platform for model optimization and training monitoring. Integrated with Gemini and Claude APIs.</p>
          </div>
        )
      },
      'portfolio.md': {
        type: 'file',
        content: (
          <div>
            <span className="text-pink-400 font-bold">Felich.dev v2</span>
            <p className="text-neutral-400 mt-1">This website! High-fidelity Next.js portfolio featuring Framer Motion, Lenis scroll, Three.js, and simulated widgets.</p>
          </div>
        )
      },
      'ecommerce.md': {
        type: 'file',
        content: (
          <div>
            <span className="text-blue-400 font-bold">E-Commerce Backend</span>
            <p className="text-neutral-400 mt-1">Scalable microservices-based API gateway and payment service written in Go and Dockerized for AWS deployment.</p>
          </div>
        )
      }
    }
  },
  'skills': {
    type: 'dir',
    children: {
      'frontend.md': {
        type: 'file',
        content: <p className="text-neutral-400">Next.js, React, HTML5, CSS3, JavaScript, TypeScript, TailwindCSS, Bootstrap, Framer Motion, Vite, Redux, GSAP, Canvas API, Svelte, React Query.</p>
      },
      'backend.md': {
        type: 'file',
        content: <p className="text-neutral-400">Node.js, Express, Python, Go, PHP, Laravel, Prisma, Sanity CMS, Rust, PyTorch, TensorFlow, tRPC.</p>
      },
      'database.md': {
        type: 'file',
        content: <p className="text-neutral-400">PostgreSQL, MySQL, MongoDB, Firebase, Supabase, Redis.</p>
      },
      'tools.md': {
        type: 'file',
        content: <p className="text-neutral-400">Git, GitHub, Docker, VS Code, Postman, npm, Vercel, Vitest, Playwright, Gemini AI, Claude, Linux, Cloudflare, Langflow.</p>
      }
    }
  }
};

const resolveVFSPath = (pathStr: string, currentDir: string) => {
  if (pathStr === '') return { node: resolveVFSPathNode(currentDir), path: currentDir };

  let segments: string[] = [];
  if (pathStr.startsWith('~') || pathStr.startsWith('/')) {
    segments = pathStr.replace(/^~?\/+/, '').split('/').filter(Boolean);
  } else {
    const base = currentDir.replace(/^~?\/+/, '').split('/').filter(Boolean);
    segments = [...base, ...pathStr.split('/')].filter(Boolean);
  }

  const resolvedSegments: string[] = [];
  for (const seg of segments) {
    if (seg === '.') continue;
    if (seg === '..') {
      resolvedSegments.pop();
    } else {
      resolvedSegments.push(seg);
    }
  }

  let current: VFSNode = { type: 'dir', children: VFS };
  let pathString = '~';
  for (const seg of resolvedSegments) {
    if (current.type !== 'dir') return null;
    const next: VFSNode | undefined = current.children[seg];
    if (!next) return null;
    current = next;
    pathString += '/' + seg;
  }
  return { node: current, path: pathString };
};

const resolveVFSPathNode = (pathStr: string): VFSNode | null => {
  const segments = pathStr.replace(/^~?\/+/, '').split('/').filter(Boolean);
  let current: VFSNode = { type: 'dir', children: VFS };
  for (const seg of segments) {
    if (current.type !== 'dir') return null;
    const next: VFSNode | undefined = current.children[seg];
    if (!next) return null;
    current = next;
  }
  return current;
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const [history, setHistory] = useState<Command[]>([
    {
      text: 'whoami',
      output: 'Felich - Software Engineer, AI Enthusiast, Fullstack Developer.',
      path: '~'
    }
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>(['whoami']);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const commands = [
    'help', 'whoami', 'skills', 'projects', 'contact', 'fetch', 'echo', 'date', 
    'clear', 'ls', 'cat', 'matrix', 'whois', 'ai', 'socials', 'repo', 'theme',
    'cd', 'pwd', 'sudo', 'unlock-elite'
  ];

  const getSuggestion = (inputVal: string, currentDir: string): string => {
    if (!inputVal) return '';

    const trimmed = inputVal.trimStart();
    const parts = trimmed.split(/\s+/);
    
    if (parts.length === 1 && !trimmed.endsWith(' ')) {
      const cmdPrefix = parts[0].toLowerCase();
      const match = commands.find(c => c.startsWith(cmdPrefix));
      if (match && match !== cmdPrefix) {
        return inputVal + match.slice(cmdPrefix.length);
      }
    } else if (parts.length >= 2) {
      const cmd = parts[0].toLowerCase();
      if (cmd === 'cd' || cmd === 'cat') {
        const fullArg = trimmed.slice(cmd.length).trimStart();
        if (!fullArg) {
          const resolved = resolveVFSPath('', currentDir);
          if (resolved && resolved.node && resolved.node.type === 'dir') {
            const keys = Object.keys(resolved.node.children);
            if (keys.length > 0) {
              return inputVal + keys[0];
            }
          }
          return '';
        }

        const lastSlashIdx = fullArg.lastIndexOf('/');
        let dirPart = '';
        let filePrefix = fullArg;
        if (lastSlashIdx !== -1) {
          dirPart = fullArg.slice(0, lastSlashIdx + 1);
          filePrefix = fullArg.slice(lastSlashIdx + 1);
        }

        const resolved = resolveVFSPath(dirPart, currentDir);
        if (resolved && resolved.node && resolved.node.type === 'dir') {
          const match = Object.keys(resolved.node.children).find(k => 
            k.toLowerCase().startsWith(filePrefix.toLowerCase())
          );
          if (match && match.toLowerCase() !== filePrefix.toLowerCase()) {
            return inputVal + match.slice(filePrefix.length);
          }
        }
      }
    }
    return '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex < cmdHistory.length) {
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
      const suggestion = getSuggestion(input, currentPath);
      if (suggestion) {
        e.preventDefault();
        setInput(suggestion);
      } else if (e.key === 'Tab') {
        e.preventDefault();
      }
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sounds.playPop();
    const fullCmd = input.trim();
    const cmdParts = fullCmd.split(' ');
    const cmd = cmdParts[0].toLowerCase();
    const args = cmdParts.slice(1);
    let output: React.ReactNode = '';

    setCmdHistory([...cmdHistory, fullCmd]);
    setHistoryIndex(-1);

    switch (cmd) {
      case 'help':
        output = (
          <div className="flex flex-col gap-2 text-neutral-400">
            <div className="text-white font-bold border-b border-neutral-800 pb-1 flex justify-between items-center">
              <span>SYSTEM DOCUMENTATION (v2.6)</span>
              <span className="text-[10px] text-neutral-500 font-normal">felich.dev/help</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <div className="flex flex-col">
                <span className="text-primary font-bold mt-2 mb-1 underline">Core Commands</span>
                <span className="text-blue-400">whoami  <span className="text-neutral-500">- Identity summary</span></span>
                <span className="text-blue-400">skills  <span className="text-neutral-500">- Technical stack overview</span></span>
                <span className="text-blue-400">projects<span className="text-neutral-500">- Featured work overview</span></span>
                <span className="text-blue-400">socials <span className="text-neutral-500">- Digital presence</span></span>
                <span className="text-blue-400">contact <span className="text-neutral-500">- Communication info</span></span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-primary font-bold mt-2 mb-1 underline">File System</span>
                <span className="text-blue-400">ls      <span className="text-neutral-500">- List directory contents</span></span>
                <span className="text-blue-400">cd &lt;dir&gt;<span className="text-neutral-500">- Change active directory</span></span>
                <span className="text-blue-400">cat &lt;file&gt;<span className="text-neutral-500">- Read content of a file</span></span>
                <span className="text-blue-400">pwd     <span className="text-neutral-500">- Show current directory path</span></span>
                <span className="text-blue-400">clear   <span className="text-neutral-500">- Flush terminal history</span></span>
              </div>

              <div className="flex flex-col">
                <span className="text-primary font-bold mt-2 mb-1 underline">Intelligence</span>
                <span className="text-blue-400">ai      <span className="text-neutral-500">- Gemini Insight</span></span>
                <span className="text-blue-400">matrix  <span className="text-neutral-500">- Decrypt reality</span></span>
                <span className="text-blue-400">whois   <span className="text-neutral-500">- Domain lookup</span></span>
              </div>

              <div className="flex flex-col">
                <span className="text-primary font-bold mt-2 mb-1 underline">Utilities</span>
                <span className="text-blue-400">fetch   <span className="text-neutral-500">- System overview fetch</span></span>
                <span className="text-blue-400">date    <span className="text-neutral-500">- Runtime clock</span></span>
                <span className="text-blue-400">echo    <span className="text-neutral-500">- Output argument string</span></span>
                <span className="text-blue-400">sudo    <span className="text-neutral-500">- Elevated access</span></span>
              </div>
            </div>
            
            <div className="mt-2 p-2 bg-white/5 rounded border border-neutral-800 text-[10px]">
              <span className="text-yellow-500 font-bold">PRO TIP:</span> Type prefix & use <kbd className="text-white px-1 bg-neutral-700 rounded">Tab</kbd> or <kbd className="text-white px-1 bg-neutral-700 rounded">→</kbd> for autocomplete.
            </div>
          </div>
        );
        break;
      case 'socials':
        output = (
          <div className="flex flex-col gap-1">
            <span className="text-pink-400">Instagram: <a href="https://instagram.com/fel.comp" className="underline">@fel.comp</a></span>
            <span className="text-blue-400">LinkedIn: <a href="https://linkedin.com/in/felich-pehagasa-ginting" className="underline">Felich Ginting</a></span>
          </div>
        );
        break;
      case 'repo':
        output = (
          <div className="flex items-center gap-2">
            <span className="text-orange-400">Git Repository:</span>
            <a href="https://github.com/felichpehagasaginting-code/felich.dev" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">felichpehagasaginting-code/felich.dev</a>
          </div>
        );
        break;
      case 'theme':
        output = (
          <div className="flex flex-col gap-1">
            <span className="text-yellow-400 font-bold">[ SYSTEM THEMES ]</span>
            <span>1. <span className="text-blue-400">Dark</span> (Default)</span>
            <span>2. <span className="text-neutral-400">Light</span> (High Contrast)</span>
            <span>3. <span className="text-orange-400">Yellow</span> (Elite Amber)</span>
            <span>4. <span className="text-white font-bold">Apple</span> (Liquid Glass)</span>
            <span className="text-[10px] mt-1 opacity-70">Use the UI toggle to switch instantly.</span>
          </div>
        );
        break;
      case 'unlock-elite':
        output = (
          <div className="text-primary font-black animate-pulse">
            [!] ACCESS GRANTED. ELITE PROTOCOLS INITIALIZED. 🏆
            <div className="text-[10px] text-neutral-500 mt-1 font-mono">
              You&apos;ve discovered the hidden layer of felich.dev. 
              The system is now running at 110% capacity.
            </div>
          </div>
        );
        break;
      case 'ls':
        const lsResolved = resolveVFSPath(args[0] || '', currentPath);
        if (lsResolved && lsResolved.node && lsResolved.node.type === 'dir') {
          output = (
            <div className="flex flex-wrap gap-4 font-bold">
              {Object.entries(lsResolved.node.children).map(([name, node]) => (
                <span 
                  key={name} 
                  className={node.type === 'dir' ? 'text-blue-400' : 'text-neutral-100'}
                >
                  {name}{node.type === 'dir' ? '/' : ''}
                </span>
              ))}
            </div>
          );
        } else {
          output = `ls: ${args[0] || ''}: No such directory`;
        }
        break;
      case 'cd':
        const targetPath = args[0] || '~';
        const cdResolved = resolveVFSPath(targetPath, currentPath);
        if (cdResolved && cdResolved.node) {
          if (cdResolved.node.type === 'dir') {
            setCurrentPath(cdResolved.path);
            output = '';
          } else {
            output = `cd: not a directory: ${targetPath}`;
          }
        } else {
          output = `cd: no such file or directory: ${targetPath}`;
        }
        break;
      case 'cat':
        if (!args[0]) {
          output = 'cat: no file specified';
        } else {
          const catResolved = resolveVFSPath(args[0], currentPath);
          if (catResolved && catResolved.node) {
            if (catResolved.node.type === 'file') {
              output = catResolved.node.content;
            } else {
              output = `cat: ${args[0]}: Is a directory`;
            }
          } else {
            output = `cat: ${args[0]}: No such file or directory`;
          }
        }
        break;
      case 'pwd':
        output = currentPath;
        break;
      case 'ai':
        const insights = [
          "Gemini says: Your current stack is optimal for high-scale applications.",
          "Gemini says: Consider optimizing your 3D assets for mobile performance.",
          "Gemini says: Next.js 14 Server Actions are the future of data mutation.",
          "Gemini says: Don't forget to implement proper error boundaries in your React components."
        ];
        output = (
          <div className="text-cyan-400">
            <div className="italic mb-1 opacity-70">Connecting to Gemini API...</div>
            <div className="font-bold">「 {insights[Math.floor(Math.random() * insights.length)]} 」</div>
          </div>
        );
        break;
      case 'matrix':
        output = (
          <div className="text-green-500 font-mono text-[10px] leading-tight animate-pulse space-y-1">
            <div className="text-white mb-2 font-bold">[!] VIRTUAL REALITY INTERFACE INITIALIZED</div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="opacity-80">
                {Array.from({ length: 40 }).map(() => (Math.random() > 0.5 ? '1' : '0')).join('')}
              </div>
            ))}
            <div className="text-white mt-2 animate-bounce">Wake up, Neo... The matrix has you.</div>
          </div>
        );
        break;
      case 'whois':
        output = 'Domain: felich.dev | Registered to: Felich P. Ginting | Location: Indonesia';
        break;
      case 'whoami':
        output = 'Felich - Software Engineer, AI Enthusiast, Fullstack Developer.';
        break;
      case 'skills':
        output = (
          <div className="space-y-1">
            <p>technical stack directory. Explore with:</p>
            <p className="text-blue-400">cd skills</p>
            <p className="text-blue-400">ls</p>
            <p className="text-blue-400">cat frontend.md</p>
          </div>
        );
        break;
      case 'projects':
        output = (
          <div className="space-y-1">
            <p>featured work directory. Explore with:</p>
            <p className="text-blue-400">cd projects</p>
            <p className="text-blue-400">ls</p>
            <p className="text-blue-400">cat fintech.md</p>
          </div>
        );
        break;
      case 'contact':
        output = (
          <div className="space-y-1">
            <p>technical contact info. Explore with:</p>
            <p className="text-blue-400">cat contact.md</p>
          </div>
        );
        break;
      case 'date':
        output = new Date().toString();
        break;
      case 'fetch':
        output = (
          <div className="flex gap-6 items-start py-1">
            <div className="text-primary font-bold hidden sm:block whitespace-pre leading-[1.1] drop-shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]">
              {`
    ──────┐
    │ ┌───┘
    │ └───┐
    │ ┌───┘
    │ │
    └─┘
              `}
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-primary font-black uppercase tracking-wider">felich@portfolio</span>
                <span className="text-neutral-600">|</span>
                <span className="text-neutral-400 text-[10px]">v2.6.0-stable</span>
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-primary/50 to-transparent mb-2" />
              
              <div className="grid grid-cols-[85px_1fr] gap-x-2 text-[11px] sm:text-xs">
                <span className="text-neutral-500 uppercase font-bold tracking-tighter">OS</span>
                <span className="text-white font-medium">LiquidOS (Next.js 14)</span>
                
                <span className="text-neutral-500 uppercase font-bold tracking-tighter">HOST</span>
                <span className="text-white">Felich-Workstation-Pro</span>
                
                <span className="text-neutral-500 uppercase font-bold tracking-tighter">KERNEL</span>
                <span className="text-white">React-Server-Edge</span>
                
                <span className="text-neutral-500 uppercase font-bold tracking-tighter">UPTIME</span>
                <span className="text-white">∞ (Digital Immortality)</span>
                
                <span className="text-neutral-500 uppercase font-bold tracking-tighter">SHELL</span>
                <span className="text-white">zsh-antigravity 5.9</span>
                
                <span className="text-neutral-500 uppercase font-bold tracking-tighter">THEME</span>
                <span className="text-primary font-semibold">Apple Liquid Glass</span>
                
                <span className="text-neutral-500 uppercase font-bold tracking-tighter">MEMORY</span>
                <span className="text-white">Cloud-Sync Enabled</span>
              </div>

              <div className="flex gap-1.5 mt-3">
                {[
                  'bg-[#FF5F57]', 'bg-[#FEBC2E]', 'bg-[#28C840]', 
                  'bg-[#3B82F6]', 'bg-[#8B5CF6]', 'bg-[#EC4899]'
                ].map((bg, idx) => (
                  <div 
                    key={idx} 
                    className={`w-3.5 h-3.5 rounded-full ${bg} shadow-lg border border-white/5`} 
                  />
                ))}
              </div>
            </div>
          </div>
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'sudo':
        if (args[0] === 'rm' && args[1] === '-rf' && args[2] === '/') {
          output = <span className="text-red-500">Critical Error: System protection prevents absolute destruction. 🛡️</span>;
        } else {
          output = <span className="text-yellow-500">Permission denied. Password for &apos;felich&apos; is encrypted with 256-bit AES.</span>;
        }
        break;
      default:
        if (cmd.startsWith('echo')) {
          output = args.join(' ');
        } else {
          output = <span className="text-red-400">Command not found: {cmd}. Type &apos;help&apos; for available commands.</span>;
        }
    }

    setHistory([...history, { text: fullCmd, output, path: currentPath }]);
    setInput('');
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-neutral-800 bg-[#0A0A0A]/90 backdrop-blur-xl shadow-2xl font-mono text-xs sm:text-sm"
    >
      {/* Terminal Header - Apple Style */}
      <div className="bg-[#1A1A1A]/80 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-white/5 select-none h-10">
        <div className="flex gap-2 w-16">
          <div className="group relative w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] cursor-pointer active:scale-95 transition-all">
             <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black/40 opacity-0 group-hover:opacity-100">✕</span>
          </div>
          <div className="group relative w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89F24] cursor-pointer active:scale-95 transition-all">
             <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black/40 opacity-0 group-hover:opacity-100">−</span>
          </div>
          <div className="group relative w-3 h-3 rounded-full bg-[#28C840] border border-[#24AA35] cursor-pointer active:scale-95 transition-all">
             <span className="absolute inset-0 flex items-center justify-center text-[8px] text-black/40 opacity-0 group-hover:opacity-100">⤢</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-neutral-400 font-medium text-[11px]">
          <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <span className="opacity-80">guest — felich — zsh — 80×24</span>
        </div>

        <div className="w-16 hidden sm:block"></div>
      </div>

      {/* Terminal Body */}
      <div
        ref={containerRef}
        data-lenis-prevent
        className="p-5 h-80 overflow-y-auto scrollbar-hide text-neutral-300 relative bg-[#020202]/40 overscroll-contain"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Subtle Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 bg-[length:100%_2px,3px_100%] opacity-20" />

        <div className="mb-4 text-neutral-500 text-[11px] font-mono leading-relaxed">
          Last login: {mounted ? new Date().toDateString() : '---'} on ttys001
          <br />
          <span className="text-primary/70">Welcome to Felich Interactive Shell (zsh)</span>
        </div>

        {history.map((cmd, i) => (
          <div key={i} className="mb-4 relative z-20">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[#5DBEFE] font-bold">➜</span>
              <span className="text-[#A6E22E] font-bold">{cmd.path}</span>
              <span className="text-white ml-1">{cmd.text}</span>
            </div>
            <div className="pl-5 text-neutral-400 border-l border-white/5 ml-[7px] py-1">
              {cmd.output}
            </div>
          </div>
        ))}

        <form onSubmit={handleCommand} className="flex items-center gap-2 relative z-20 pb-8">
          <span className="text-[#5DBEFE] font-bold animate-pulse">➜</span>
          <span className="text-[#A6E22E] font-bold">{currentPath}</span>
          <div className="relative flex-1 ml-1 h-[18px] flex items-center">
            {/* Visual autocomplete ghost text overlay */}
            <div className="absolute inset-y-0 left-0 w-full pointer-events-none flex items-center font-mono whitespace-pre text-xs sm:text-sm select-none">
              <span className="text-white">{input}</span>
              <span className="text-neutral-500/70 dark:text-neutral-500/70">{getSuggestion(input, currentPath).slice(input.length)}</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // @ts-ignore
                if (sounds.playClick) sounds.playClick();
              }}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent outline-none text-transparent border-none focus:ring-0 p-0 caret-transparent font-mono select-none text-xs sm:text-sm"
              autoComplete="off"
              spellCheck="false"
              aria-label="Terminal Input"
              title="Terminal Input"
              placeholder="Enter command..."
            />
            {/* macOS Style Bar Cursor */}
            <motion.div 
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
              className="absolute top-0 w-2 h-[18px] bg-primary/60 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
              style={{ left: `${input.length}ch` }}
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
}
