'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { sounds } from '@/lib/sounds';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Volume2, Bot, Sparkles, X, Mic, MicOff, Send, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import AuraOrb, { AuraOrbMini } from '@/components/AuraOrb';
import { useFocusTrap } from '@/lib/useFocusTrap';

type OrbState = 'idle' | 'listening' | 'speaking' | 'thinking';

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

// ── Language detection ────────────────────────────────────────────────────
const ID_KEYWORDS = /\b(dan|yang|dengan|adalah|saya|kamu|untuk|tidak|ini|itu|di|ke|dari|pada|juga|bisa|ada|apa|bagaimana|kenapa|siapa|sudah|belum|mau|akan|karena)\b/i;
function detectLang(text: string): 'id-ID' | 'en-US' {
  const words = text.split(/\s+/).slice(0, 20).join(' ');
  return ID_KEYWORDS.test(words) ? 'id-ID' : 'en-US';
}

// ── VAD silence threshold ─────────────────────────────────────────────────
const VAD_SILENCE_MS = 1500; // stop after 1.5s of silence
const VAD_SILENCE_THRESHOLD = 10; // RMS amplitude threshold (0-128)

export default function AIChatbot({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const [open, setOpen] = useState(initiallyOpen);
  const [voiceMode, setVoiceMode] = useState(false);
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

  // Voice states
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  // Focus trap: lock Tab inside the chat window while it is open and visible
  useFocusTrap(chatRef, open && !minimized, { autoFocusFirst: false });

  useEffect(() => {
    if (initiallyOpen) {
      setOpen(true);
      setMinimized(false);
      setUnread(0);
    }
  }, [initiallyOpen]);

  // Ref to track input synchronously for SpeechRecognition callbacks
  const inputRefVal = useRef('');
  useEffect(() => {
    inputRefVal.current = input;
  }, [input]);

  // VAD refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const vadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const vadFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // ── Orb state derivation ─────────────────────────────────────────────
  useEffect(() => {
    if (loading) setOrbState('thinking');
    else if (isListening) setOrbState('listening');
    else if (isSpeaking) setOrbState('speaking');
    else setOrbState('idle');
  }, [loading, isListening, isSpeaking]);

  // ── Command palette listener ─────────────────────────────────────────
  useEffect(() => {
    const handler = () => { setOpen(true); setMinimized(false); setUnread(0); };
    document.addEventListener('open-ai-chatbot', handler);
    return () => document.removeEventListener('open-ai-chatbot', handler);
  }, []);

  // ── Auto-scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 200);
      setUnread(0);
    }
  }, [open, minimized, messages]);


  // ── speak() — upgraded with language detection + isSpeaking state ────
  const speak = useCallback((text: string, msgId?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const clean = text.replace(/\*\*/g, '').replace(/#{1,6}\s/g, '');
    const lang = detectLang(clean);

    const utterance = new SpeechSynthesisUtterance(clean);

    const assignVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(v => v.lang === lang && (v.name.includes('Google') || v.name.includes('Premium'))) ||
        voices.find(v => v.lang === lang) ||
        voices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
        voices[0];
      if (preferred) utterance.voice = preferred;
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      assignVoice();
    } else {
      // Use addEventListener instead of property assignment so we don't
      // silently overwrite any existing listener and can clean up properly.
      const onVoicesReady = () => {
        assignVoice();
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesReady);
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesReady);
    }

    utterance.lang = lang;
    utterance.pitch = 1.05;
    utterance.rate = lang === 'id-ID' ? 0.95 : 1.0;

    utterance.onstart = () => { setIsSpeaking(true); if (msgId) setSpeakingMsgId(msgId); };
    utterance.onend = () => { setIsSpeaking(false); setSpeakingMsgId(null); };
    utterance.onerror = () => { setIsSpeaking(false); setSpeakingMsgId(null); };

    window.speechSynthesis.speak(utterance);
    sounds.playSwitch();
  }, []);

  // ── VAD cleanup ──────────────────────────────────────────────────────
  const stopListeningCleanup = useCallback(() => {
    if (vadTimerRef.current) { clearTimeout(vadTimerRef.current); vadTimerRef.current = null; }
    if (vadFrameRef.current) { cancelAnimationFrame(vadFrameRef.current); vadFrameRef.current = null; }
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null; }
    analyserRef.current = null;
  }, []);

  // ── Cleanup on unmount ───────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopListeningCleanup();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopListeningCleanup]);

  // Cancel speech synthesis when voice mode is toggled off or chat is closed
  useEffect(() => {
    if (!voiceMode || !open) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      }
    }
  }, [voiceMode, open]);

  // ── Voice Activity Detection ─────────────────────────────────────────
  const startVAD = useCallback((stream: MediaStream, onSilence: () => void) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioCtxRef.current = ctx;
      analyserRef.current = analyser;

      const buf = new Uint8Array(analyser.fftSize);
      let silenceStart = Date.now();

      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        // Compute RMS amplitude
        let sum = 0;
        for (const v of buf) sum += (v - 128) * (v - 128);
        const rms = Math.sqrt(sum / buf.length);

        if (rms > VAD_SILENCE_THRESHOLD) {
          // Voice detected — reset silence timer
          silenceStart = Date.now();
        } else if (Date.now() - silenceStart > VAD_SILENCE_MS) {
          // Prolonged silence — trigger stop
          onSilence();
          return;
        }
        vadFrameRef.current = requestAnimationFrame(tick);
      };
      vadFrameRef.current = requestAnimationFrame(tick);
    } catch {
      // AudioContext not supported — skip VAD, rely on manual stop
    }
  }, []);

  // ── sendMessage() ─────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    sounds.playPop();

    const aiMsgId = (Date.now() + 1).toString();

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Chat API error:', errData);
        setMessages(prev => [...prev, {
          id: aiMsgId, role: 'assistant',
          content: "Hmm, I ran into an issue connecting to my brain 🧠 Please try again in a moment!",
          timestamp: new Date(),
        }]);
        return;
      }

      setMessages(prev => [...prev, { id: aiMsgId, role: 'assistant', content: '', timestamp: new Date() }]);
      setLoading(false);

      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          try {
            const chunk = JSON.parse(trimmed.slice(6));
            if (chunk.text) {
              fullText += chunk.text;
              setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, content: m.content + chunk.text } : m)
              );
            }
            if (chunk.done) {
              streamDone = true;
              break;
            }
          } catch { /* skip malformed */ }
        }
      }

      sounds.playSwitch();

      // Auto-speak in voice mode
      if (voiceMode && fullText) {
        speak(fullText, aiMsgId);
      }

      if (!open || minimized) setUnread(prev => prev + 1);
    } catch {
      setMessages(prev => [...prev, {
        id: aiMsgId, role: 'assistant',
        content: "Network issue! Please check your connection and try again 🔌",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, open, minimized, voiceMode, speak]);

  // ── startListening() — Web Speech API + VAD ──────────────────────────
  const startListening = useCallback(() => {
    if (isListening) {
      // Manual stop
      recognitionRef.current?.stop();
      stopListeningCleanup();
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Voice Recognition.');
      return;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    // Detect starting language: check last user message language first, fallback to browser language, fallback to en-US.
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    let startLang = 'en-US';
    if (lastUserMsg) {
      startLang = detectLang(lastUserMsg.content);
    } else if (typeof navigator !== 'undefined' && navigator.language) {
      startLang = navigator.language.startsWith('id') ? 'id-ID' : 'en-US';
    }
    recognition.lang = startLang;

    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = async () => {
      setIsListening(true);
      setInterimTranscript('');
      sounds.playPop();

      // Start VAD via microphone stream
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        startVAD(stream, () => {
          recognition.stop();
        });
      } catch {
        // getUserMedia failed — no VAD, manual stop only
      }
    };

    recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final += t;
        else interim += t;
      }
      setInterimTranscript(interim || final);
      if (final) setInput(prev => prev + final);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setInterimTranscript('');
      stopListeningCleanup();
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      stopListeningCleanup();
      // Auto-send if we have content
      const finalInput = inputRefVal.current.trim();
      if (finalInput) {
        sendMessage(finalInput);
      }
    };

    recognition.start();
  }, [isListening, startVAD, stopListeningCleanup, sendMessage, messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  // ── RENDER ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Floating area */}
      <div className="fixed bottom-24 right-6 z-[90] flex flex-col items-end gap-3">
        <AnimatePresence>
          {open && (
            <motion.div
              ref={chatRef}
              key="chatwindow"
              role="dialog"
              aria-modal="true"
              aria-label="Chat with Felich AI"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="w-[calc(100vw-3rem)] sm:w-[420px] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-2xl shadow-black/20 flex flex-col"
              style={{ height: minimized ? 'auto' : voiceMode ? '480px' : '520px', marginBottom: '0.5rem' }}
            >
              {/* ── Header ────────────────────────────────────────────── */}
              <div className="flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex-shrink-0">
                <div className="relative flex-shrink-0">
                  <AuraOrbMini state={orbState} size={36} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">Felich AI</p>
                  <p className="text-white/70 text-[10px] font-mono uppercase tracking-wider">
                    {orbState === 'idle' && 'Portfolio Assistant · Online'}
                    {orbState === 'listening' && '🎙 Listening…'}
                    {orbState === 'speaking' && '🔊 Speaking…'}
                    {orbState === 'thinking' && '⚙️ Thinking…'}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {/* Toggle voice / text mode */}
                  <button
                    onClick={() => { setVoiceMode(p => !p); sounds.playSwitch(); }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all text-sm ${voiceMode ? 'bg-white/30 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}
                    title={voiceMode ? 'Switch to Text Mode' : 'Switch to Voice Mode'}
                    aria-label={voiceMode ? 'Switch to Text Mode' : 'Switch to Voice Mode'}
                    aria-pressed={voiceMode}
                  >
                    {voiceMode ? <MessageSquare size={14} /> : <Mic size={14} />}
                  </button>
                  <button
                    onClick={() => { setMinimized(p => !p); sounds.playSwitch(); }}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
                    title={minimized ? 'Expand' : 'Minimize'}
                    aria-label={minimized ? 'Expand chat window' : 'Minimize chat window'}
                    aria-expanded={!minimized}
                  >
                    {minimized ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    onClick={() => { setOpen(false); sounds.playSwitch(); }}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-sm"
                    title="Close chat"
                    aria-label="Close chat"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              {!minimized && (
                <>
                  {/* ── VOICE MODE ────────────────────────────────────── */}
                  {voiceMode ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-6 bg-neutral-950 p-6">
                      {/* Big Orb */}
                      <div className="relative">
                        <AuraOrb state={orbState} size={130} />
                      </div>

                      {/* Transcript */}
                      <div className="text-center min-h-[48px] px-4">
                        <AnimatePresence mode="wait">
                          {interimTranscript ? (
                            <motion.p
                              key="interim"
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="text-white/60 italic text-sm"
                            >
                              &quot;{interimTranscript}&quot;
                            </motion.p>
                          ) : messages.length > 1 ? (
                            <motion.p
                              key="last"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-white/80 text-sm leading-relaxed line-clamp-3"
                            >
                              {messages[messages.length - 1]?.content?.slice(0, 160)}
                            </motion.p>
                          ) : (
                            <motion.p key="hint" className="text-white/30 text-xs">
                              Tap the mic and ask anything
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Mic button */}
                      <motion.button
                        onClick={startListening}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                          isListening
                            ? 'bg-red-500 shadow-red-500/40'
                            : 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-purple-500/40'
                        }`}
                      >
                        {isListening ? <MicOff size={26} className="text-white" /> : <Mic size={26} className="text-white" />}
                      </motion.button>

                      <p className="text-white/25 text-[10px] font-mono">
                        {isListening ? 'Tap to stop · Auto-stops on silence' : 'Tap to speak'}
                      </p>
                    </div>
                  ) : (
                    /* ── TEXT MODE ───────────────────────────────────── */
                    <>
                      {/* Messages — role="log" + aria-live allows screen readers to announce new messages */}
                      <div
                        role="log"
                        aria-live="polite"
                        aria-label="Chat messages"
                        aria-relevant="additions"
                        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
                      >
                        {messages.map(msg => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                          >
                            {msg.role === 'assistant' && (
                              <div className="flex-shrink-0 mt-0.5">
                                <AuraOrbMini state={speakingMsgId === msg.id ? 'speaking' : 'idle'} size={28} />
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
                                  onClick={() => speak(msg.content, msg.id)}
                                  className="absolute -right-10 top-0 p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 hover:text-blue-500 opacity-0 group-hover/msg:opacity-100 transition-all shadow-sm"
                                  title="Listen to response"
                                >
                                  <Volume2 size={12} />
                                </button>
                              )}
                              <div className="markdown-content text-sm">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                                    strong: ({ children }) => <strong className="font-extrabold text-blue-500 dark:text-blue-400">{children}</strong>,
                                    ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                    li: ({ children }) => React.createElement('li', { className: 'mb-0.5' }, children),
                                    code: ({ children }) => <code className="bg-black/10 dark:bg-black/30 px-1 rounded font-mono text-[11px]">{children}</code>,
                                  }}
                                >
                                  {msg.content}
                                </ReactMarkdown>
                              </div>
                              {/* Speaking wave indicator */}
                              {speakingMsgId === msg.id && (
                                <div className="flex items-center gap-0.5 mt-1.5">
                                  {[0, 1, 2, 3].map(i => (
                                    <motion.span
                                      key={i}
                                      className="w-0.5 bg-blue-400 rounded-full"
                                      animate={{ height: ['4px', '12px', '4px'] }}
                                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
                                    />
                                  ))}
                                </div>
                              )}
                              <p className={`text-[9px] mt-1.5 font-mono ${msg.role === 'user' ? 'text-white/50 text-right' : 'text-neutral-400'}`}>
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </motion.div>
                        ))}

                        {loading && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                            <AuraOrbMini state="thinking" size={28} />
                            <div className="bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                              {[0, 1, 2].map(i => (
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

                      {/* Interim transcript bar */}
                      <AnimatePresence>
                        {interimTranscript && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-4 py-2 bg-red-50 dark:bg-red-950/20 border-t border-red-100 dark:border-red-900/30 overflow-hidden"
                          >
                            <p className="text-[11px] text-red-500 italic">
                              🎙 &quot;{interimTranscript}&quot;
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Suggestions */}
                      {messages.length <= 2 && (
                        <div className="px-4 pb-2 flex gap-2 flex-wrap">
                          {SUGGESTED_QUESTIONS.map(q => (
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
                            title={isListening ? 'Stop recording' : 'Voice input'}
                          >
                            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                          </button>
                          <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isListening ? 'Listening…' : 'Ask about Felich…'}
                            disabled={loading || isListening}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-400 disabled:opacity-50"
                          />
                          <button
                            onClick={() => sendMessage(input)}
                            disabled={!input.trim() || loading}
                            className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center disabled:opacity-30 hover:scale-105 active:scale-95 transition-all flex-shrink-0 shadow-md"
                            title="Send message"
                            aria-label="Send message"
                          >
                            <Send size={14} />
                          </button>
                        </div>
                        <p className="text-[9px] text-neutral-400 text-center mt-2 font-mono flex items-center justify-center gap-1">
                          Powered by Gemini AI <Sparkles size={10} />
                        </p>
                      </div>
                    </>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FAB ──────────────────────────────────────────────────────── */}
        <motion.button
          onClick={() => { setOpen(p => !p); setMinimized(false); setUnread(0); sounds.playPop(); }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          aria-label={open ? 'Close Felich AI chat' : 'Open Felich AI chat'}
          aria-expanded={open}
          aria-haspopup="dialog"
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/40 flex items-center justify-center"
          title="Chat with Felich AI"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center">
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.2 }} className="flex items-center justify-center absolute inset-0 rounded-full overflow-hidden">
                <AuraOrbMini state={orbState} size={56} />
              </motion.span>
            )}
          </AnimatePresence>

          {!open && <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500 opacity-20" />}

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
