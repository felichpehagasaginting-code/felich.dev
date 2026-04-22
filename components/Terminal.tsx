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
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sounds.playPop();
    const cmd = input.trim().toLowerCase();
    let output: React.ReactNode = '';

    switch (cmd) {
      case 'help':
        output = (
          <div className="flex flex-col gap-1 text-neutral-400">
            <span>Available commands:</span>
            <span className="text-blue-400">whoami  <span className="text-neutral-500">- Display info about the author</span></span>
            <span className="text-blue-400">skills  <span className="text-neutral-500">- List core technologies</span></span>
            <span className="text-blue-400">projects<span className="text-neutral-500">- List featured projects</span></span>
            <span className="text-blue-400">contact <span className="text-neutral-500">- Show contact information</span></span>
            <span className="text-blue-400">fetch   <span className="text-neutral-500">- System information summary</span></span>
            <span className="text-blue-400">echo    <span className="text-neutral-500">- Print text to terminal</span></span>
            <span className="text-blue-400">date    <span className="text-neutral-500">- Print current system date and time</span></span>
            <span className="text-blue-400">clear   <span className="text-neutral-500">- Clear terminal output</span></span>
          </div>
        );
        break;
      case 'whoami':
        output = 'Felich - Software Engineer, AI Enthusiast, Fullstack Developer.';
        break;
      case 'skills':
        output = 'Next.js, React, Node.js, Python, PostgreSQL, Three.js, TailwindCSS, Docker, Go.';
        break;
      case 'projects':
        output = (
          <div className="flex flex-col gap-1">
            <span className="text-green-400">1. FinTech Dashboard (Fullstack Web)</span>
            <span className="text-purple-400">2. AI/ML Platform (Data Engineering)</span>
            <span className="text-pink-400">3. Felich.dev (Next.js Portfolio)</span>
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
              <span><span className="text-blue-400 font-bold">OS:</span> Next.js/Linux</span>
              <span><span className="text-blue-400 font-bold">Kernel:</span> React 18</span>
              <span><span className="text-blue-400 font-bold">Uptime:</span> ∞ days</span>
              <span><span className="text-blue-400 font-bold">Packages:</span> 1337 (npm)</span>
              <span><span className="text-blue-400 font-bold">Shell:</span> bash 5.1</span>
              <span><span className="text-blue-400 font-bold">Memory:</span> 16GB / 64GB</span>
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
      case 'sudo rm -rf /':
        output = <span className="text-red-500">Nice try! You do not have permission.</span>;
        break;
      default:
        if (cmd.startsWith('echo ')) {
          output = cmd.substring(5);
        } else if (cmd.startsWith('sudo ')) {
          output = <span className="text-yellow-500">Password required for felich. (Just kidding, permission denied).</span>;
        } else {
          output = <span className="text-red-400">Command not found: {cmd}. Type 'help' for available commands.</span>;
        }
    }

    setHistory([...history, { text: input, output }]);
    setInput('');
  };

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
      className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden border border-neutral-800 bg-[#0A0A0A] shadow-2xl font-mono text-xs sm:text-sm"
    >
      {/* Terminal Header */}
      <div className="bg-[#1A1A1A] px-4 py-2 flex items-center justify-between border-b border-neutral-800 select-none">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
        </div>
        <div className="text-neutral-500 text-[10px] uppercase tracking-wider font-bold">Terminal</div>
        <div className="w-12"></div>
      </div>

      {/* Terminal Body */}
      <div 
        ref={containerRef}
        className="p-4 h-64 overflow-y-auto scrollbar-hide text-neutral-300"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="mb-4 text-green-400 opacity-80">
          Connected to felich.dev. Type 'help' to get started.
        </div>
        
        {history.map((cmd, i) => (
          <div key={i} className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-purple-400 font-bold">guest@felich.dev</span>
              <span className="text-neutral-500">~</span>
              <span className="text-blue-400">$</span>
              <span>{cmd.text}</span>
            </div>
            <div className="pl-4">{cmd.output}</div>
          </div>
        ))}

        <form onSubmit={handleCommand} className="flex items-center gap-2">
          <span className="text-purple-400 font-bold">guest@felich.dev</span>
          <span className="text-neutral-500">~</span>
          <span className="text-blue-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white border-none focus:ring-0 p-0"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </motion.div>
  );
}
