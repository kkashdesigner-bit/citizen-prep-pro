import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { useParcours, type ParcoursClass } from '@/hooks/useParcours';
import { useClassDetail } from '@/hooks/useClassDetail';
import { Question, getCorrectAnswerText } from '@/lib/types';
import LearnSidebar from '@/components/learn/LearnSidebar';
import AppHeader from '@/components/AppHeader';
import SubscriptionGate from '@/components/SubscriptionGate';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Search, Clock, CheckCircle2, Lock, Bookmark, BookmarkCheck,
  ChevronLeft, ChevronRight, ArrowRight, FileText, Layers, BrainCircuit,
  FolderOpen, RotateCcw, Sparkles, GraduationCap, X, TrendingUp,
  Star, Filter, Play,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  { key: 'all', label: 'Tous les cours', icon: Layers, color: '#0055A4' },
  { key: 'valeurs', label: 'Valeurs', icon: Star, range: [1, 10] as [number, number], color: '#0055A4' },
  { key: 'symboles', label: 'Symboles', icon: Sparkles, range: [11, 20] as [number, number], color: '#1B6ED6' },
  { key: 'executif', label: 'Exécutif', icon: GraduationCap, range: [21, 30] as [number, number], color: '#7C3AED' },
  { key: 'legislatif', label: 'Législatif', icon: FileText, range: [31, 40] as [number, number], color: '#6D28D9' },
  { key: 'droits', label: 'Droits', icon: BookOpen, range: [41, 50] as [number, number], color: '#0891B2' },
  { key: 'devoirs', label: 'Devoirs', icon: FileText, range: [51, 60] as [number, number], color: '#059669' },
  { key: 'histoire', label: 'Histoire', icon: BookOpen, range: [61, 70] as [number, number], color: '#D97706' },
  { key: 'geo', label: 'Géographie', icon: Layers, range: [71, 80] as [number, number], color: '#B45309' },
  { key: 'economie', label: 'Économie', icon: BrainCircuit, range: [81, 90] as [number, number], color: '#DC2626' },
  { key: 'quotidien', label: 'Quotidien', icon: GraduationCap, range: [91, 100] as [number, number], color: '#EF4135' },
];

const TABS = [
  { key: 'contenu', label: 'Contenu', icon: BookOpen },
  { key: 'flashcards', label: 'Flashcards', icon: Layers },
  { key: 'quiz', label: 'Quiz Rapide', icon: BrainCircuit },
  { key: 'documents', label: 'Documents', icon: FolderOpen },
] as const;

type TabKey = typeof TABS[number]['key'];

/* ═══════════════════════════════════════════════════════════════
   CIRCLE PROGRESS (Magic MCP — animated SVG ring)
   ═══════════════════════════════════════════════════════════════ */

function CircleProgress({ value, size = 44, strokeWidth = 4, color }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const animRef = useRef<number>();

  useEffect(() => {
    const start = displayValue;
    const end = Math.min(100, Math.max(0, value));
    const duration = 600;
    let startTime: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (end - start) * eased));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayValue / 100) * circumference;
  const fillColor = color || (displayValue >= 86 ? '#D97706' : displayValue >= 60 ? '#059669' : '#DC2626');

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth}
          className="text-slate-100" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={fillColor} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color: fillColor }}>{displayValue}%</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════════════════════════ */

function extractTerms(md: string): { term: string; context: string }[] {
  const results: { term: string; context: string }[] = [];
  const seen = new Set<string>();
  for (const line of md.split('\n')) {
    // Skip headings — they don't make good flashcard context
    if (line.trimStart().startsWith('#')) continue;
    const cleanLine = line.replace(/[#_]/g, '').trim();
    if (!cleanLine) continue;

    for (const m of line.matchAll(/\*\*([^*]+)\*\*/g)) {
      const t = m[1].trim();
      if (t.length > 1 && t.length < 80 && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase());

        // Build context: remove the current term's bold markers so it reads as a definition
        // Replace **current term** with "___" so the card back is a fill-in-the-blank
        const ctx = cleanLine
          .replace(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '___')
          .replace(/\*\*/g, '')
          .trim();

        // Truncate long contexts
        const maxLen = 150;
        const context = ctx.length > maxLen ? ctx.slice(0, maxLen).replace(/\s\S*$/, '') + '…' : ctx;

        results.push({ term: t, context });
      }
    }
  }
  return results;
}

function getBookmarks(): Set<string> {
  try { const r = localStorage.getItem('bookmarked_courses'); return r ? new Set(JSON.parse(r)) : new Set(); }
  catch { return new Set(); }
}

function toggleBookmark(id: string): Set<string> {
  const b = getBookmarks();
  b.has(id) ? b.delete(id) : b.add(id);
  localStorage.setItem('bookmarked_courses', JSON.stringify([...b]));
  return new Set(b);
}

/* ═══════════════════════════════════════════════════════════════
   MARKDOWN RENDERER
   ═══════════════════════════════════════════════════════════════ */

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let i = 0, lastIndex = 0;
  const rx = /\*\*([^*]+)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = rx.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push(
      <span key={`v-${i++}`} className="inline-block px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded text-[#0055A4] font-semibold text-[0.92em]">
        {m[1]}
      </span>
    );
    lastIndex = rx.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function renderMarkdown(md: string) {
  const lines = md.split('\n');
  const els: React.ReactNode[] = [];
  let list: string[] = [];
  let k = 0;
  const flush = () => {
    if (!list.length) return;
    els.push(
      <ul key={`ul-${k++}`} className="space-y-2 my-4 ml-4">
        {list.map((li, i) => (
          <li key={i} className="flex gap-2 text-slate-700 leading-relaxed">
            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0055A4] flex-shrink-0" />
            <span>{renderInline(li)}</span>
          </li>
        ))}
      </ul>
    );
    list = [];
  };
  for (const raw of lines) {
    const l = raw.trimEnd();
    if (l.startsWith('### ')) { flush(); els.push(<h3 key={`h-${k++}`} className="text-lg font-bold text-slate-900 mt-6 mb-2">{l.slice(4)}</h3>); }
    else if (l.startsWith('## ')) { flush(); els.push(<h2 key={`h-${k++}`} className="text-xl font-bold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-100">{l.slice(3)}</h2>); }
    else if (l.startsWith('# ')) { flush(); els.push(<h1 key={`h-${k++}`} className="text-2xl font-bold text-slate-900 mt-8 mb-4">{l.slice(2)}</h1>); }
    else if (/^[-*]\s/.test(l)) list.push(l.replace(/^[-*]\s+/, ''));
    else if (!l.trim()) flush();
    else { flush(); els.push(<p key={`p-${k++}`} className="text-slate-700 leading-relaxed my-3">{renderInline(l)}</p>); }
  }
  flush();
  return els;
}

/* ═══════════════════════════════════════════════════════════════
   INLINE QUIZ
   ═══════════════════════════════════════════════════════════════ */

function InlineQuiz({ questions }: { questions: Question[] }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const pool = useMemo(() => questions.slice(0, 5), [questions]);

  if (!pool.length) return (
    <div className="text-center py-16">
      <BrainCircuit className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <p className="text-slate-500 font-medium">Aucune question disponible pour cette leçon.</p>
    </div>
  );

  const q = pool[idx], correct = getCorrectAnswerText(q);
  const opts = [{ k: 'a', t: q.option_a }, { k: 'b', t: q.option_b }, { k: 'c', t: q.option_c }, { k: 'd', t: q.option_d }].filter(o => o.t);

  const pick = (t: string) => { if (selected) return; setSelected(t); if (t === correct) setScore(s => s + 1); };
  const next = () => { if (idx + 1 >= pool.length) setFinished(true); else { setIdx(i => i + 1); setSelected(null); } };
  const reset = () => { setIdx(0); setSelected(null); setScore(0); setFinished(false); };

  if (finished) {
    const pct = Math.round((score / pool.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${pct >= 60 ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <span className="text-4xl font-black" style={{ color: pct >= 60 ? '#059669' : '#DC2626' }}>{pct}%</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{pct >= 60 ? 'Bien joué !' : 'Continuez vos efforts !'}</h3>
        <p className="text-slate-500 mb-6">{score}/{pool.length} réponses correctes</p>
        <Button onClick={reset} variant="outline" className="gap-2 rounded-xl"><RotateCcw className="w-4 h-4" /> Recommencer</Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Question {idx + 1}/{pool.length}</span>
        <span className="text-xs font-bold text-[#0055A4]">{score} correct{score > 1 ? 's' : ''}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#0055A4] rounded-full transition-all" style={{ width: `${((idx + 1) / pool.length) * 100}%` }} />
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <p className="text-base font-semibold text-slate-900 mb-5 leading-relaxed">{q.question_text}</p>
          <div className="space-y-3">
            {opts.map(o => {
              const ic = o.t === correct, is = selected === o.t;
              let s = 'bg-white border-slate-200 hover:border-[#0055A4]/40 hover:bg-blue-50/30 cursor-pointer';
              if (selected) { if (ic) s = 'bg-emerald-50 border-emerald-400 text-emerald-800'; else if (is) s = 'bg-red-50 border-red-400 text-red-800'; else s = 'bg-white border-slate-100 opacity-50'; }
              return (
                <button key={o.k} onClick={() => pick(o.t)} disabled={!!selected}
                  className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all text-sm font-medium ${s}`}>
                  <span className="font-bold text-xs uppercase mr-3 opacity-50">{o.k}.</span>{o.t}
                </button>
              );
            })}
          </div>
          {selected && q.explanation && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-slate-700">
              <span className="font-bold text-[#0055A4]">Explication :</span> {q.explanation}
            </motion.div>
          )}
          {selected && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5 flex justify-end">
              <Button onClick={next} className="bg-[#0055A4] hover:bg-[#1B6ED6] text-white rounded-xl gap-2">
                {idx + 1 >= pool.length ? 'Voir le résultat' : 'Suivant'} <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLASHCARDS
   ═══════════════════════════════════════════════════════════════ */

function Flashcards({ terms }: { terms: { term: string; context: string }[] }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [exitX, setExitX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);

  const SWIPE_THRESHOLD = 80;

  const goNext = useCallback(() => {
    if (idx < terms.length - 1) {
      setFlipped(false);
      setIdx(i => i + 1);
    }
  }, [idx, terms.length]);

  const goPrev = useCallback(() => {
    if (idx > 0) {
      setFlipped(false);
      setIdx(i => i - 1);
    }
  }, [idx]);

  const handleDragEnd = useCallback((_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const swipePower = Math.abs(info.offset.x) * Math.abs(info.velocity.x);
    if (info.offset.x > SWIPE_THRESHOLD || swipePower > 8000) {
      setExitX(300);
      goPrev();
    } else if (info.offset.x < -SWIPE_THRESHOLD || swipePower > 8000) {
      setExitX(-300);
      goNext();
    }
    setIsDragging(false);
    setDragX(0);
  }, [goNext, goPrev]);

  if (!terms.length) return (
    <div className="text-center py-16">
      <Layers className="w-12 h-12 text-slate-300 mx-auto mb-4" />
      <p className="text-slate-500 font-medium">Aucun terme clé trouvé dans cette leçon.</p>
      <p className="text-sm text-slate-400 mt-1">Les termes en gras dans le contenu apparaîtront ici.</p>
    </div>
  );

  const progress = ((idx + 1) / terms.length) * 100;

  return (
    <div className="flex flex-col items-center py-6 select-none">
      {/* Progress bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">Carte {idx + 1} sur {terms.length}</span>
          <span className="text-xs font-bold text-[#0055A4]">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Card stack area */}
      <div className="relative w-full max-w-md h-64" style={{ perspective: 1200 }}>
        {/* Background cards (stack effect) */}
        {idx + 2 < terms.length && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0055A4]/20 to-[#1B6ED6]/20 border border-slate-200/50"
            style={{ top: 12, scale: 0.92 }}
          />
        )}
        {idx + 1 < terms.length && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0055A4]/40 to-[#1B6ED6]/40 border border-slate-200/60"
            style={{ top: 6, scale: 0.96 }}
          />
        )}

        {/* Active card */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={idx}
            initial={{ scale: 0.9, opacity: 0, x: exitX > 0 ? -100 : 100 }}
            animate={{
              scale: 1, opacity: 1, x: 0,
              rotate: isDragging ? dragX * 0.05 : 0,
            }}
            exit={{ x: exitX, opacity: 0, rotate: exitX * 0.05, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDrag={(_, info) => { setIsDragging(true); setDragX(info.offset.x); }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{ zIndex: 10 }}
            onClick={() => { if (!isDragging) setFlipped(f => !f); }}
          >
            {/* Swipe direction indicator */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none z-20"
              animate={{
                boxShadow: dragX > 40
                  ? 'inset 0 0 40px rgba(16, 185, 129, 0.3)'
                  : dragX < -40
                    ? 'inset 0 0 40px rgba(239, 68, 68, 0.3)'
                    : 'inset 0 0 0px transparent',
              }}
              transition={{ duration: 0.15 }}
            />

            {/* Flip container */}
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative w-full h-full"
            >
              {/* Front face */}
              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0055A4] via-[#1764ac] to-[#1B6ED6] shadow-[0_8px_32px_rgba(0,85,164,0.25)] flex items-center justify-center p-8 text-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4"
                  >
                    <BrainCircuit className="w-5 h-5 text-white/70" />
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-bold text-white leading-tight"
                  >
                    {terms[idx].term}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xs text-white/40 mt-5 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" /> Touchez pour retourner
                  </motion.p>
                </div>
              </div>

              {/* Back face */}
              <div
                className="absolute inset-0 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.08)] flex items-center justify-center p-8 text-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <div className="max-w-[85%]">
                  <div className="w-10 h-10 rounded-full bg-[#0055A4]/5 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-5 h-5 text-[#0055A4]/60" />
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{terms[idx].context}</p>
                  <p className="text-xs text-slate-300 mt-5 flex items-center justify-center gap-1.5">
                    <RotateCcw className="w-3 h-3" /> Touchez pour retourner
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center gap-3 mt-8">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goPrev}
          disabled={idx === 0}
          className="h-11 w-11 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0055A4] hover:border-[#0055A4]/40 hover:bg-blue-50/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Dots */}
        <div className="flex items-center gap-1.5 px-2">
          {terms.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setFlipped(false); setIdx(i); }}
              className="rounded-full transition-colors"
              animate={{
                width: i === idx ? 20 : 6,
                height: 6,
                backgroundColor: i === idx ? '#0055A4' : i < idx ? '#93c5fd' : '#e2e8f0',
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            />
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goNext}
          disabled={idx === terms.length - 1}
          className="h-11 w-11 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0055A4] hover:border-[#0055A4]/40 hover:bg-blue-50/50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Swipe hint */}
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-slate-300 mt-4"
      >
        Glissez pour naviguer
      </motion.p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COURSE DETAIL VIEW
   ═══════════════════════════════════════════════════════════════ */

function CourseDetail({ classId, onBack }: { classId: string; onBack: () => void }) {
  const navigate = useNavigate();
  const { data, loading, error } = useClassDetail(classId);
  const [activeTab, setActiveTab] = useState<TabKey>('contenu');
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  const terms = useMemo(() => data ? extractTerms(data.content_markdown) : [], [data]);
  const isBookmarked = bookmarks.has(classId);
  const cat = data ? CATEGORIES.find(c => 'range' in c && data.class_number >= c.range![0] && data.class_number <= c.range![1]) : null;

  if (loading) return <div className="flex items-center justify-center py-32"><div className="h-10 w-10 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" /></div>;
  if (error || !data) return (
    <div className="text-center py-20">
      <X className="w-12 h-12 text-red-300 mx-auto mb-4" />
      <h3 className="font-bold text-slate-900">Erreur de chargement</h3>
      <p className="text-sm text-slate-500 mt-1">{error || 'Cours introuvable.'}</p>
      <Button onClick={onBack} variant="outline" className="mt-6 rounded-xl">Retour</Button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] rounded-2xl p-6 md:p-8 mb-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack} className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center text-white/80 hover:bg-white/25 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs text-white/60 font-medium">
              <button onClick={onBack} className="hover:text-white/90 transition-colors">Cours</button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/90">{cat?.label || 'Module'}</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">Classe {data.class_number}</span>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-3">{data.title}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs text-white/70 font-medium bg-white/10 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" /> {data.estimated_minutes} min
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/70 font-medium bg-white/10 px-3 py-1.5 rounded-full">
              <BrainCircuit className="w-3.5 h-3.5" /> {data.questions.length} questions
            </span>
            {terms.length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs text-white/70 font-medium bg-white/10 px-3 py-1.5 rounded-full">
                <Layers className="w-3.5 h-3.5" /> {terms.length} termes clés
              </span>
            )}
            <button
              onClick={() => setBookmarks(toggleBookmark(classId))}
              className="relative ml-auto h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
              aria-label={isBookmarked ? 'Retirer le signet' : 'Ajouter un signet'}
            >
              <AnimatePresence>
                {isBookmarked && (
                  <motion.span key="pulse" initial={{ scale: 0, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 0.5 }}
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)' }} />
                )}
              </AnimatePresence>
              {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-300 fill-amber-300" /> : <Bookmark className="w-4 h-4 text-white/60" />}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Bar — enhanced with bordered card + spring underline */}
      <div className="bg-background rounded-lg border shadow-sm mb-6">
        <div className="flex overflow-x-auto scrollbar-hide">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 min-w-0 flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  active ? 'text-primary' : 'text-muted-foreground hover:bg-muted'
                }`}>
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {active && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
          <div className="bg-white rounded-2xl border border-[var(--dash-card-border)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-10">
            {activeTab === 'contenu' && renderMarkdown(data.content_markdown)}
            {activeTab === 'flashcards' && <Flashcards terms={terms} />}
            {activeTab === 'quiz' && <InlineQuiz questions={data.questions} />}
            {activeTab === 'documents' && (
              <div className="text-center py-16">
                <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Documents officiels à venir</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">Les fiches de révision et documents officiels pour cette leçon seront disponibles prochainement.</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom CTA */}
      <div className="mt-8">
        <Button onClick={() => navigate(`/quiz?mode=training&classId=${classId}&limit=10`)}
          className="w-full bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold py-6 rounded-xl text-base shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] gap-2">
          Passer au Quiz complet ({data.questions.length} questions) <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function CoursesPage() {
  const { loading: authLoading } = useAuth();
  const { tier, loading: tierLoading } = useSubscription();
  const { classes, progress, loading: parcoursLoading } = useParcours();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [showGate, setShowGate] = useState(false);
  const [bookmarks, setBookmarks] = useState(getBookmarks);

  const isLoading = authLoading || tierLoading || parcoursLoading;

  useEffect(() => { if (!selectedClassId) setBookmarks(getBookmarks()); }, [selectedClassId]);

  // Stats
  const completedCount = useMemo(() => Object.values(progress).filter(p => p.status === 'completed').length, [progress]);
  const avgScore = useMemo(() => {
    const scores = Object.values(progress).filter(p => p.status === 'completed' && p.score > 0).map(p => p.score);
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }, [progress]);

  // Find first incomplete course for CTA
  const firstIncomplete = useMemo(() => {
    return classes.find(c => {
      const p = progress[c.id];
      return !p || p.status !== 'completed';
    });
  }, [classes, progress]);

  // Filtering
  const filteredClasses = useMemo(() => {
    let result = classes;
    if (activeCategory !== 'all') {
      const cat = CATEGORIES.find(c => c.key === activeCategory);
      if (cat && 'range' in cat) result = result.filter(c => c.class_number >= cat.range![0] && c.class_number <= cat.range![1]);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q) || `classe ${c.class_number}`.includes(q));
    }
    return result;
  }, [classes, activeCategory, search]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: classes.length };
    CATEGORIES.forEach(cat => {
      if ('range' in cat) counts[cat.key] = classes.filter(c => c.class_number >= cat.range![0] && c.class_number <= cat.range![1]).length;
    });
    return counts;
  }, [classes]);

  const isUnlocked = useCallback((clazz: ParcoursClass) => {
    if (tier === 'premium') return true;
    if (tier === 'free' && clazz.class_number > 10) return false;
    if (clazz.class_number === 1) return true;
    const prev = classes.find(c => c.class_number === clazz.class_number - 1);
    if (!prev) return false;
    const pp = progress[prev.id];
    return pp?.status === 'completed' && (pp?.score ?? 0) >= 60;
  }, [tier, classes, progress]);

  const handleCardClick = (clazz: ParcoursClass) => {
    if (isUnlocked(clazz)) setSelectedClassId(clazz.id);
    else setShowGate(true);
  };

  const getCat = (n: number) => CATEGORIES.find(c => 'range' in c && n >= c.range![0] && n <= c.range![1]);

  if (isLoading) return (
    <div className="flex min-h-screen bg-[var(--dash-bg)]">
      <LearnSidebar />
      <div className="flex-1 md:ml-[260px] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[var(--dash-bg)]">
      <SEOHead noindex />
      <LearnSidebar />

      <div className="flex-1 md:ml-[260px] flex flex-col">
        <AppHeader pageTitle="Cours" pageIcon={<GraduationCap className="w-5 h-5" />} backTo="/learn" backLabel="Tableau de bord" />

        <main className="flex-1 pb-24 md:pb-8">
          <div className="mx-auto max-w-6xl px-4 md:px-8 py-6 md:py-8">

            {selectedClassId ? (
              <CourseDetail classId={selectedClassId} onBack={() => setSelectedClassId(null)} />
            ) : (
              <>
                {/* ─── Hero Stats ─── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  className="relative bg-gradient-to-r from-[#0055A4] via-[#1B6ED6] to-[#4D94E0] rounded-2xl p-6 md:p-8 mb-10 overflow-hidden">
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-white/5" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Explorez les cours</h1>
                        <p className="text-white/60 text-sm">Apprenez à votre rythme, révisez et testez vos connaissances</p>
                      </div>
                      {firstIncomplete && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                          onClick={() => setSelectedClassId(firstIncomplete.id)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer whitespace-nowrap"
                        >
                          <Play className="w-4 h-4 fill-white" /> Reprendre
                        </motion.button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { icon: BookOpen, label: 'Cours', value: classes.length, color: 'bg-white/15' },
                        { icon: CheckCircle2, label: 'Terminés', value: completedCount, color: 'bg-emerald-500/20' },
                        { icon: TrendingUp, label: 'Score moy.', value: `${avgScore}%`, color: 'bg-amber-500/20' },
                        { icon: Bookmark, label: 'Signets', value: bookmarks.size, color: 'bg-white/15' },
                      ].map((stat, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                          className={`${stat.color} backdrop-blur-sm rounded-xl px-4 py-3.5 flex items-center gap-3`}>
                          <stat.icon className="w-5 h-5 text-white/70 flex-shrink-0" />
                          <div>
                            <div className="text-2xl font-black text-white leading-none">{stat.value}</div>
                            <div className="text-[10px] font-medium text-white/50 uppercase tracking-wider mt-1">{stat.label}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* ─── Search + Filter Row ─── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="flex flex-col sm:flex-row gap-3 mb-6">
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un cours..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0055A4] focus:ring-2 focus:ring-[#0055A4]/10 transition-all shadow-sm" />
                    {search && (
                      <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                    <Filter className="w-3.5 h-3.5" />
                    <span className="font-medium">{filteredClasses.length} cours</span>
                  </div>
                </motion.div>

                {/* ─── Category Filters — enhanced touch targets + category colors ─── */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="mb-10 overflow-x-auto scrollbar-hide -mx-4 px-4">
                  <div className="flex gap-2 pb-1">
                    {CATEGORIES.map(cat => {
                      const Icon = cat.icon;
                      const active = activeCategory === cat.key;
                      const count = categoryCounts[cat.key] || 0;
                      return (
                        <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-sm cursor-pointer ${
                            active
                              ? 'text-white shadow-md scale-[1.02]'
                              : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:shadow'
                          }`}
                          style={active ? { backgroundColor: cat.color } : {}}>
                          <Icon className="w-3.5 h-3.5" />
                          {cat.label}
                          {count > 0 && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              active ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-400'
                            }`}>{count}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* ─── Course Cards Grid ─── */}
                {filteredClasses.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-bold text-slate-900 mb-2">Aucun cours trouvé</h3>
                    <p className="text-sm text-slate-500">Essayez d'autres termes de recherche ou catégories.</p>
                  </div>
                ) : (
                  <motion.div initial="hidden" animate="visible"
                    variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {filteredClasses.map(clazz => {
                      const unlocked = isUnlocked(clazz);
                      const p = progress[clazz.id];
                      const done = p?.status === 'completed';
                      const bm = bookmarks.has(clazz.id);
                      const cat = getCat(clazz.class_number);

                      return (
                        <motion.div key={clazz.id}
                          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                          whileHover={unlocked ? { y: -8, transition: { type: 'spring', stiffness: 400, damping: 25 } } : {}}
                          whileTap={unlocked ? { scale: 0.97 } : {}}
                          onClick={() => handleCardClick(clazz)}
                          className={`group relative bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                            unlocked
                              ? 'cursor-pointer border-slate-200/80 hover:shadow-xl hover:border-slate-300'
                              : 'cursor-not-allowed border-slate-100'
                          }`}>

                          {/* Hover gradient overlay */}
                          {unlocked && (
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[1]" />
                          )}

                          {/* Lock overlay — blur + centered lock */}
                          {!unlocked && (
                            <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                <Lock className="w-5 h-5 text-slate-400" />
                              </div>
                              <span className="text-xs font-semibold text-slate-400">Cours verrouillé</span>
                            </div>
                          )}

                          {/* Category color accent */}
                          <div className="h-1.5 w-full" style={{ backgroundColor: cat?.color || '#0055A4' }} />

                          <div className="p-5 relative z-[2]">
                            {/* Top: badge + bookmark */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat?.color || '#0055A4'}15` }}>
                                  {cat ? <cat.icon className="w-4 h-4" style={{ color: cat.color }} /> : <BookOpen className="w-4 h-4 text-[#0055A4]" />}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Classe {clazz.class_number}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                {unlocked && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setBookmarks(toggleBookmark(clazz.id)); }}
                                    className="relative h-7 w-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer"
                                    aria-label={bm ? 'Retirer le signet' : 'Ajouter un signet'}
                                  >
                                    <AnimatePresence>
                                      {bm && (
                                        <motion.span key="bmpulse" initial={{ scale: 0, opacity: 0.7 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 0.5 }}
                                          className="absolute inset-0 rounded-full"
                                          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)' }} />
                                      )}
                                    </AnimatePresence>
                                    {bm ? <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" /> : <Bookmark className="w-3.5 h-3.5 text-slate-300" />}
                                  </button>
                                )}
                                {done && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              </div>
                            </div>

                            {/* Title */}
                            <h3 className={`font-bold text-[15px] leading-snug mb-2 line-clamp-2 ${unlocked ? 'text-slate-900 group-hover:text-[#0055A4]' : 'text-slate-400'} transition-colors duration-200`}>
                              {clazz.title}
                            </h3>

                            {/* Description */}
                            {clazz.description && (
                              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{clazz.description}</p>
                            )}

                            {/* Divider */}
                            <div className="h-px bg-slate-100 mb-3" />

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                                <Clock className="w-3 h-3" /> {clazz.estimated_minutes} min
                              </span>

                              {/* CircleProgress for completed courses */}
                              {done && p?.score != null && (
                                <CircleProgress value={p.score} size={38} strokeWidth={3.5} />
                              )}

                              {/* "Explorer" on hover for unlocked, not done */}
                              {unlocked && !done && (
                                <span className="text-[11px] font-bold text-[#0055A4] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                                  Explorer <ArrowRight className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {showGate && (
        <SubscriptionGate open={showGate} onOpenChange={setShowGate}
          requiredTier={tier === 'free' ? 'standard' : 'premium'} featureLabel="Accès à tous les cours" />
      )}
    </div>
  );
}
