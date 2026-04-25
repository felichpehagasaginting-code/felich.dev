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
              You've discovered the hidden layer of felich.dev. 
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
          output = <span className="text-yellow-500 italic">"The best way to predict the future is to invent it." - Alan Kay</span>;
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
          <div className="flex gap-4">
            <div className="text-blue-500 font-bold hidden sm:block whitespace-pre leading-tight">
              {`
   /\\   
  /  \\  
 /____\\ 
/      \\
              `}
            </div>
            <div className="flex flex-col">
              <span className="text-purple-400 font-bold">felich@dev-machine</span>
              <span>--------------</span>
              <span><span className="text-blue-400 font-bold">OS:</span> Next.js 14 / Linux</span>
              <span><span className="text-blue-400 font-bold">Kernel:</span> React Server Components</span>
              <span><span className="text-blue-400 font-bold">Uptime:</span> ∞ days</span>
              <span><span className="text-blue-400 font-bold">Terminal:</span> Antigravity v2.1</span>
              <span><span className="text-blue-400 font-bold">Shell:</span> custom-sh 5.1</span>
              <span><span className="text-blue-400 font-bold">Memory:</span> 32GB / 64GB</span>
              <div className="flex gap-1 mt-2">
                <div className="w-3 h-3 bg-red-500"></div><div className="w-3 h-3 bg-green-500"></div><div className="w-3 h-3 bg-yellow-500"></div><div className="w-3 h-3 bg-blue-500"></div><div className="w-3 h-3 bg-purple-500"></div><div className="w-3 h-3 bg-cyan-500"></div>
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
          output = <span className="text-yellow-500">Permission denied. Password for 'felich' is encrypted with 256-bit AES.</span>;
        }
        break;
      default:
        if (cmd.startsWith('echo')) {
          output = args.join(' ');
        } else {
          output = <span className="text-red-400">Command not found: {cmd}. Type 'help' for available commands.</span>;
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
      {/* Terminal Header */}
      <div className="bg-[#1A1A1A] px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 select-none">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.3)]"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.3)]"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
        </div>
        <div className="text-neutral-500 text-[10px] uppercase tracking-[0.2em] font-black">Felich-OS Terminal</div>
        <div className="text-neutral-600 text-[10px] hidden sm:block">ssh guest@felich.dev</div>
      </div>

      {/* Terminal Body */}
      <div
        ref={containerRef}
        className="p-5 h-72 overflow-y-auto scrollbar-hide text-neutral-300 relative"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Subtle Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] z-10 bg-[length:100%_2px,3px_100%]" />

        <div className="mb-4 text-green-400/80 flex items-center gap-2">
          <span className="animate-pulse">●</span>
          <span>Session started: {mounted ? new Date().toLocaleTimeString() : '--:--:--'} - Type 'help' to explore.</span>
        </div>

        {history.map((cmd, i) => (
          <div key={i} className="mb-3 relative z-20">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-400 font-bold">guest@felich</span>
              <span className="text-neutral-500">~</span>
              <span className="text-blue-400">$</span>
              <span className="text-white">{cmd.text}</span>
            </div>
            <div className="pl-4 text-neutral-400">{cmd.output}</div>
          </div>
        ))}

        <form onSubmit={handleCommand} className="flex items-center gap-2 relative z-20 pb-4">
          <span className="text-purple-400 font-bold">guest@felich</span>
          <span className="text-neutral-500">~</span>
          <span className="text-blue-400">$</span>
          <div className="relative flex-1">
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
              className="w-full bg-transparent outline-none text-white border-none focus:ring-0 p-0 caret-transparent"
              autoComplete="off"
              spellCheck="false"
            />
            {/* Custom Blinking Cursor */}
            <motion.div 
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute top-0 w-2 h-4 sm:h-5 bg-primary/80"
              style={{ left: `${input.length}ch` }}
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
}
