'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';

type Command = {
  text: string;
  output: React.ReactNode;
};

export default function Terminal() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([
    {
      text: 'whoami',
      output: 'Felich - Software Engineer, AI Enthusiast, Fullstack Developer.'
    }
  ]);
  const [cmdHistory, setCmdHistory] = useState<string[]>(['whoami']);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const commands = ['help', 'whoami', 'skills', 'projects', 'contact', 'fetch', 'echo', 'date', 'clear', 'ls', 'cat', 'matrix', 'whois', 'ai', 'socials', 'repo', 'theme'];

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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const currentInput = input.trim().toLowerCase();
      const match = commands.find(c => c.startsWith(currentInput));
      if (match) setInput(match);
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
              <span>SYSTEM DOCUMENTATION (v2.1)</span>
              <span className="text-[10px] text-neutral-500 font-normal">felich.dev/help</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <div className="flex flex-col">
                <span className="text-primary font-bold mt-2 mb-1 underline">Core Commands</span>
                <span className="text-blue-400">whoami  <span className="text-neutral-500">- Identity summary</span></span>
                <span className="text-blue-400">skills  <span className="text-neutral-500">- Technical stack</span></span>
                <span className="text-blue-400">projects<span className="text-neutral-500">- Featured work</span></span>
                <span className="text-blue-400">socials <span className="text-neutral-500">- Digital presence</span></span>
                <span className="text-blue-400">contact <span className="text-neutral-500">- Communication info</span></span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-primary font-bold mt-2 mb-1 underline">File System</span>
                <span className="text-blue-400">ls      <span className="text-neutral-500">- List directory</span></span>
                <span className="text-blue-400">cat     <span className="text-neutral-500">- Read local file</span></span>
                <span className="text-blue-400">clear   <span className="text-neutral-500">- Flush terminal</span></span>
                <span className="text-blue-400">repo    <span className="text-neutral-500">- Source control</span></span>
              </div>

              <div className="flex flex-col">
                <span className="text-primary font-bold mt-2 mb-1 underline">Intelligence</span>
                <span className="text-blue-400">ai      <span className="text-neutral-500">- Gemini Insight</span></span>
                <span className="text-blue-400">matrix  <span className="text-neutral-500">- Decrypt reality</span></span>
                <span className="text-blue-400">whois   <span className="text-neutral-500">- Domain lookup</span></span>
              </div>

              <div className="flex flex-col">
                <span className="text-primary font-bold mt-2 mb-1 underline">Utilities</span>
                <span className="text-blue-400">fetch   <span className="text-neutral-500">- System overview</span></span>
                <span className="text-blue-400">date    <span className="text-neutral-500">- Runtime clock</span></span>
                <span className="text-blue-400">echo    <span className="text-neutral-500">- Output string</span></span>
                <span className="text-blue-400">sudo    <span className="text-neutral-500">- Elevated access</span></span>
              </div>
            </div>
            
            <div className="mt-2 p-2 bg-white/5 rounded border border-neutral-800 text-[10px]">
              <span className="text-yellow-500 font-bold">PRO TIP:</span> Use <kbd className="text-white px-1 bg-neutral-700 rounded">Tab</kbd> for auto-complete and <kbd className="text-white px-1 bg-neutral-700 rounded">↑</kbd> <kbd className="text-white px-1 bg-neutral-700 rounded">↓</kbd> for history.
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
            <a href="https://github.com/felichpehagasaginting-code/felich.dev" target="_blank" className="text-blue-400 underline">felichpehagasaginting-code/felich.dev</a>
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
        // Trigger a custom event or store change if needed, 
        // for now just visual feedback in terminal
        break;
      case 'ls':
        output = (
          <div className="flex gap-4 text-blue-400 font-bold">
            <span>about.md</span>
            <span>projects/</span>
            <span>resume.pdf</span>
            <span className="text-green-400">secret.txt</span>
          </div>
        );
        break;
      case 'cat':
        if (args[0] === 'about.md') {
          output = 'Software Engineer focused on high-performance web systems and AI integration.';
        } else if (args[0] === 'secret.txt') {
          output = <span className="text-yellow-500 italic">&quot;The best way to predict the future is to invent it.&quot; - Alan Kay</span>;
        } else {
          output = `cat: ${args[0] || 'no file specified'}: No such file or directory`;
        }
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
        output = 'Next.js, React, Node.js, Python, PostgreSQL, Three.js, TailwindCSS, Docker, Go, Gemini AI, GSAP.';
        break;
      case 'projects':
        output = (
          <div className="flex flex-col gap-1">
            <span className="text-green-400">1. FinTech Dashboard (Fullstack Web)</span>
            <span className="text-purple-400">2. AI/ML Platform (Data Engineering)</span>
            <span className="text-pink-400">3. Felich.dev (Next.js Portfolio)</span>
            <span className="text-blue-400">4. E-Commerce Backend (Scalable Systems)</span>
          </div>
        );
        break;
      case 'contact':
        output = (
          <div className="flex flex-col gap-1">
            <span>Email: <a href="mailto:hello@felich.dev" className="text-blue-400 hover:underline">hello@felich.dev</a></span>
            <span>GitHub: <a href="https://github.com/felichpehagasaginting-code" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">github.com/felichpehagasaginting-code</a></span>
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
                <span className="text-neutral-400 text-[10px]">v2.5.0-stable</span>
              </div>
              <div className="h-[1px] w-full bg-gradient-to-r from-primary/50 to-transparent mb-2" />
              
              <div className="grid grid-cols-[85px_1fr] gap-x-2 text-[11px] sm:text-xs">
                <span className="text-neutral-500 uppercase font-bold tracking-tighter">OS</span>
                <span className="text-white font-medium">LiquidOS (Next.js 16)</span>
                
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

    setHistory([...history, { text: fullCmd, output }]);
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
              <span className="text-[#A6E22E] font-bold">~</span>
              <span className="text-white ml-1">{cmd.text}</span>
            </div>
            <div className="pl-5 text-neutral-400 border-l border-white/5 ml-[7px] py-1">
              {cmd.output}
            </div>
          </div>
        ))}

        <form onSubmit={handleCommand} className="flex items-center gap-2 relative z-20 pb-8">
          <span className="text-[#5DBEFE] font-bold animate-pulse">➜</span>
          <span className="text-[#A6E22E] font-bold">~</span>
          <div className="relative flex-1 ml-1">
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
              className="w-full bg-transparent outline-none text-white border-none focus:ring-0 p-0 caret-transparent font-mono"
              autoComplete="off"
              spellCheck="false"
            />
            {/* macOS Style Bar Cursor */}
            <motion.div 
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }}
              className="absolute top-0.5 w-2 h-[18px] bg-primary/60 shadow-[0_0_8px_rgba(37,99,235,0.4)]"
              style={{ left: `${input.length}ch` }}
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
}
