'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Volume2, VolumeX, Bot, Sparkles, X, Mic, Send, ChevronUp, ChevronDown } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What are Felich's top skills?",
  'Open to work?',
  'Show me projects',
  'How to contact?',
];

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi! I'm **Felich AI** 👋 — your guide to Felich's portfolio. Ask me anything about his skills, projects, or how to get in touch!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [unread, setUnread] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for command palette trigger
  useEffect(() => {
    const handleOpenFromPalette = () => {
      setOpen(true);
      setMinimized(false);
      setUnread(0);
    };
    document.addEventListener('open-ai-chatbot', handleOpenFromPalette);
    return () => document.removeEventListener('open-ai-chatbot', handleOpenFromPalette);
  }, []);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 200);
      setUnread(0);
    }
  }, [open, minimized, messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    sounds.playPop();

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();

      // Handle API-level errors
      if (!res.ok || data.error) {
        console.error('Chat API error:', data);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Hmm, I ran into an issue connecting to my brain 🧠 Please try again in a moment!",
            timestamp: new Date(),
          },
        ]);
        return;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || "I'm not sure how to answer that. Ask me about Felich's skills or projects!",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      sounds.playSwitch();

      if (!open || minimized) {
        setUnread((prev) => prev + 1);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "Network issue! Please check your connection and try again 🔌",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Voice Recognition.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const speak = (text: string) => {
    if (typeof window === 'undefined') return;
    
    // Stop any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.replace(/\*\*/g, ''));
    
    // Try to find a good English/Indonesian voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Premium')) || voices[0];
    
    if (preferredVoice) utterance.voice = preferredVoice;
    utterance.pitch = 1.1;
    utterance.rate = 1;
    
    window.speechSynthesis.speak(utterance);
    sounds.playSwitch();
  };

  return (
    <>
      {/* Floating Button - Positioned to avoid QuickConnect */}
      <div className="fixed bottom-[110px] right-6 md:bottom-[90px] md:right-6 z-[90] flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              key="chatwindow"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="w-[calc(100vw-3rem)] sm:w-[400px] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl shadow-black/20 flex flex-col"
              style={{ height: minimized ? 'auto' : '520px', marginBottom: '0.5rem' }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex-shrink-0">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Bot size={20} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">Felich AI</p>
                  <p className="text-white/70 text-[10px] font-mono uppercase tracking-wider">Portfolio Assistant · Online</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setMinimized((p) => !p); sounds.playSwitch(); }}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
                    title={minimized ? 'Expand' : 'Minimize'}
                  >
                    {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={() => { setOpen(false); sounds.playSwitch(); }}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {!minimized && (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-blue-500/20">
                            <Bot size={14} />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed relative group/msg ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-sm border border-neutral-200/50 dark:border-neutral-700/50'
                          }`}
                        >
                          {msg.role === 'assistant' && (
                            <button 
                              onClick={() => speak(msg.content)}
                              className="absolute -right-10 top-0 p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-blue-500 opacity-0 group-hover/msg:opacity-100 transition-all shadow-sm"
                              title="Listen to response"
                            >
                              <Volume2 size={12} />
                            </button>
                          )}

                          <div className="markdown-content prose-invert text-sm">
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({children}) => <p className="mb-1 last:mb-0">{children}</p>,
                                strong: ({children}) => <strong className="font-extrabold text-blue-500 dark:text-blue-400">{children}</strong>,
                                ul: ({children}) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                li: ({children}) => <li className="mb-0.5">{children}</li>,
                                code: ({children}) => <code className="bg-black/10 dark:bg-black/30 px-1 rounded font-mono text-[11px]">{children}</code>
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>

                          <p className={`text-[9px] mt-1.5 font-mono ${msg.role === 'user' ? 'text-white/50 text-right' : 'text-neutral-400'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))}

                    {loading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-2.5"
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                          <Bot size={14} />
                        </div>
                        <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="w-1.5 h-1.5 bg-neutral-400 rounded-full"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                    <div ref={bottomRef} />
                  </div>

                  {/* Suggestions (only when few messages) */}
                  {messages.length <= 2 && (
                    <div className="px-4 pb-2 flex gap-2 flex-wrap">
                      {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="text-[11px] px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <div className="px-4 pb-4 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800 rounded-2xl px-3 py-2 border border-neutral-200 dark:border-neutral-700 focus-within:border-blue-500/50 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.1)] transition-all">
                      <button
                        onClick={startListening}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-neutral-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-neutral-700'}`}
                        title="Voice Input"
                      >
                        <Mic size={16} />
                      </button>
                      <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about Felich..."
                        disabled={loading || isListening}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400 disabled:opacity-50"
                      />
                      <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center disabled:opacity-30 hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-md"
                      >
                        <Send size={14} />
                      </button>
                    </div>
                    <p className="text-[9px] text-neutral-400 text-center mt-2 font-mono flex items-center justify-center gap-1">Powered by Gemini AI <Sparkles size={10} /></p>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB */}
        <motion.button
          onClick={() => {
            setOpen((p) => !p);
            setMinimized(false);
            setUnread(0);
            sounds.playPop();
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/40 flex items-center justify-center text-2xl"
          title="Chat with Felich AI"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center">
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center">
                <Bot size={24} />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Pulse ring */}
          {!open && (
            <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500 opacity-20" />
          )}

          {/* Unread badge */}
          {unread > 0 && !open && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md"
            >
              {unread}
            </motion.span>
          )}
        </motion.button>
      </div>
    </>
  );
}
