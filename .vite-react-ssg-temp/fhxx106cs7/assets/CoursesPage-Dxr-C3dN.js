import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { a as useAuth } from "../main.mjs";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { u as useParcours } from "./useParcours-C7eYJyqa.js";
import { u as useClassDetail } from "./useClassDetail-DQmVPAQr.js";
import { g as getCorrectAnswerText } from "./types-CapR02YX.js";
import { L as LearnSidebar } from "./LearnSidebar-BzOBVmNx.js";
import { A as AppHeader } from "./AppHeader-W_GlnqQg.js";
import { S as SubscriptionGate } from "./SubscriptionGate-BJBE68cr.js";
import { B as Button } from "./button-AT0XyJsk.js";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Play, BookOpen, CheckCircle2, TrendingUp, Bookmark, Search, X, Filter, Lock, BookmarkCheck, Clock, ArrowRight, Layers, Star, Sparkles, FileText, BrainCircuit, ChevronLeft, ChevronRight, FolderOpen, RotateCcw } from "lucide-react";
import "react-helmet-async";
import "react-dom/client";
import "@supabase/supabase-js";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "./useUserProfile-BcVuiJUg.js";
import "./Logo-RLfqH6ZW.js";
import "./avatar-aMrL2e85.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
const CATEGORIES = [
  { key: "all", label: "Tous les cours", icon: Layers, color: "#0055A4" },
  { key: "valeurs", label: "Valeurs", icon: Star, range: [1, 10], color: "#0055A4" },
  { key: "symboles", label: "Symboles", icon: Sparkles, range: [11, 20], color: "#1B6ED6" },
  { key: "executif", label: "Exécutif", icon: GraduationCap, range: [21, 30], color: "#7C3AED" },
  { key: "legislatif", label: "Législatif", icon: FileText, range: [31, 40], color: "#6D28D9" },
  { key: "droits", label: "Droits", icon: BookOpen, range: [41, 50], color: "#0891B2" },
  { key: "devoirs", label: "Devoirs", icon: FileText, range: [51, 60], color: "#059669" },
  { key: "histoire", label: "Histoire", icon: BookOpen, range: [61, 70], color: "#D97706" },
  { key: "geo", label: "Géographie", icon: Layers, range: [71, 80], color: "#B45309" },
  { key: "economie", label: "Économie", icon: BrainCircuit, range: [81, 90], color: "#DC2626" },
  { key: "quotidien", label: "Quotidien", icon: GraduationCap, range: [91, 100], color: "#EF4135" }
];
const TABS = [
  { key: "contenu", label: "Contenu", icon: BookOpen },
  { key: "flashcards", label: "Flashcards", icon: Layers },
  { key: "quiz", label: "Quiz Rapide", icon: BrainCircuit },
  { key: "documents", label: "Documents", icon: FolderOpen }
];
function CircleProgress({ value, size = 44, strokeWidth = 4, color }) {
  const [displayValue, setDisplayValue] = useState(0);
  const animRef = useRef();
  useEffect(() => {
    const start = displayValue;
    const end = Math.min(100, Math.max(0, value));
    const duration = 600;
    let startTime;
    const animate = (time) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(start + (end - start) * eased));
      if (progress < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [value]);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - displayValue / 100 * circumference;
  const fillColor = color || (displayValue >= 86 ? "#D97706" : displayValue >= 60 ? "#059669" : "#DC2626");
  return /* @__PURE__ */ jsxs("div", { className: "relative inline-flex items-center justify-center", style: { width: size, height: size }, children: [
    /* @__PURE__ */ jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: "currentColor",
          strokeWidth,
          className: "text-slate-100"
        }
      ),
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: size / 2,
          cy: size / 2,
          r: radius,
          fill: "none",
          stroke: fillColor,
          strokeWidth,
          strokeLinecap: "round",
          strokeDasharray: circumference,
          strokeDashoffset: offset,
          style: { transition: "stroke-dashoffset 0.3s ease" }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("span", { className: "absolute text-[10px] font-bold", style: { color: fillColor }, children: [
      displayValue,
      "%"
    ] })
  ] });
}
function extractTerms(md) {
  const results = [];
  const seen = /* @__PURE__ */ new Set();
  for (const line of md.split("\n")) {
    for (const m of line.matchAll(/\*\*([^*]+)\*\*/g)) {
      const t = m[1].trim();
      if (t.length > 1 && t.length < 80 && !seen.has(t.toLowerCase())) {
        seen.add(t.toLowerCase());
        results.push({ term: t, context: line.replace(/[#*_]/g, "").trim() });
      }
    }
  }
  return results;
}
function getBookmarks() {
  try {
    const r = localStorage.getItem("bookmarked_courses");
    return r ? new Set(JSON.parse(r)) : /* @__PURE__ */ new Set();
  } catch {
    return /* @__PURE__ */ new Set();
  }
}
function toggleBookmark(id) {
  const b = getBookmarks();
  b.has(id) ? b.delete(id) : b.add(id);
  localStorage.setItem("bookmarked_courses", JSON.stringify([...b]));
  return new Set(b);
}
function renderInline(text) {
  const parts = [];
  let i = 0, lastIndex = 0;
  const rx = /\*\*([^*]+)\*\*/g;
  let m;
  while ((m = rx.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    parts.push(
      /* @__PURE__ */ jsx("span", { className: "inline-block px-1.5 py-0.5 bg-blue-50 border border-blue-200 rounded text-[#0055A4] font-semibold text-[0.92em]", children: m[1] }, `v-${i++}`)
    );
    lastIndex = rx.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}
function renderMarkdown(md) {
  const lines = md.split("\n");
  const els = [];
  let list = [];
  let k = 0;
  const flush = () => {
    if (!list.length) return;
    els.push(
      /* @__PURE__ */ jsx("ul", { className: "space-y-2 my-4 ml-4", children: list.map((li, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-2 text-slate-700 leading-relaxed", children: [
        /* @__PURE__ */ jsx("span", { className: "mt-1.5 h-1.5 w-1.5 rounded-full bg-[#0055A4] flex-shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: renderInline(li) })
      ] }, i)) }, `ul-${k++}`)
    );
    list = [];
  };
  for (const raw of lines) {
    const l = raw.trimEnd();
    if (l.startsWith("### ")) {
      flush();
      els.push(/* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-slate-900 mt-6 mb-2", children: l.slice(4) }, `h-${k++}`));
    } else if (l.startsWith("## ")) {
      flush();
      els.push(/* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-slate-900 mt-8 mb-3 pb-2 border-b border-slate-100", children: l.slice(3) }, `h-${k++}`));
    } else if (l.startsWith("# ")) {
      flush();
      els.push(/* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-900 mt-8 mb-4", children: l.slice(2) }, `h-${k++}`));
    } else if (/^[-*]\s/.test(l)) list.push(l.replace(/^[-*]\s+/, ""));
    else if (!l.trim()) flush();
    else {
      flush();
      els.push(/* @__PURE__ */ jsx("p", { className: "text-slate-700 leading-relaxed my-3", children: renderInline(l) }, `p-${k++}`));
    }
  }
  flush();
  return els;
}
function InlineQuiz({ questions }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const pool = useMemo(() => questions.slice(0, 5), [questions]);
  if (!pool.length) return /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
    /* @__PURE__ */ jsx(BrainCircuit, { className: "w-12 h-12 text-slate-300 mx-auto mb-4" }),
    /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium", children: "Aucune question disponible pour cette leçon." })
  ] });
  const q = pool[idx], correct = getCorrectAnswerText(q);
  const opts = [{ k: "a", t: q.option_a }, { k: "b", t: q.option_b }, { k: "c", t: q.option_c }, { k: "d", t: q.option_d }].filter((o) => o.t);
  const pick = (t) => {
    if (selected) return;
    setSelected(t);
    if (t === correct) setScore((s) => s + 1);
  };
  const next = () => {
    if (idx + 1 >= pool.length) setFinished(true);
    else {
      setIdx((i) => i + 1);
      setSelected(null);
    }
  };
  const reset = () => {
    setIdx(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };
  if (finished) {
    const pct = Math.round(score / pool.length * 100);
    return /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "text-center py-12", children: [
      /* @__PURE__ */ jsx("div", { className: `inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${pct >= 60 ? "bg-emerald-50" : "bg-red-50"}`, children: /* @__PURE__ */ jsxs("span", { className: "text-4xl font-black", style: { color: pct >= 60 ? "#059669" : "#DC2626" }, children: [
        pct,
        "%"
      ] }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900 mb-2", children: pct >= 60 ? "Bien joué !" : "Continuez vos efforts !" }),
      /* @__PURE__ */ jsxs("p", { className: "text-slate-500 mb-6", children: [
        score,
        "/",
        pool.length,
        " réponses correctes"
      ] }),
      /* @__PURE__ */ jsxs(Button, { onClick: reset, variant: "outline", className: "gap-2 rounded-xl", children: [
        /* @__PURE__ */ jsx(RotateCcw, { className: "w-4 h-4" }),
        " Recommencer"
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-400 uppercase tracking-wider", children: [
        "Question ",
        idx + 1,
        "/",
        pool.length
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-[#0055A4]", children: [
        score,
        " correct",
        score > 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-slate-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-[#0055A4] rounded-full transition-all", style: { width: `${(idx + 1) / pool.length * 100}%` } }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, children: [
      /* @__PURE__ */ jsx("p", { className: "text-base font-semibold text-slate-900 mb-5 leading-relaxed", children: q.question_text }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: opts.map((o) => {
        const ic = o.t === correct, is = selected === o.t;
        let s = "bg-white border-slate-200 hover:border-[#0055A4]/40 hover:bg-blue-50/30 cursor-pointer";
        if (selected) {
          if (ic) s = "bg-emerald-50 border-emerald-400 text-emerald-800";
          else if (is) s = "bg-red-50 border-red-400 text-red-800";
          else s = "bg-white border-slate-100 opacity-50";
        }
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => pick(o.t),
            disabled: !!selected,
            className: `w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all text-sm font-medium ${s}`,
            children: [
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-xs uppercase mr-3 opacity-50", children: [
                o.k,
                "."
              ] }),
              o.t
            ]
          },
          o.k
        );
      }) }),
      selected && q.explanation && /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, className: "mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-slate-700", children: [
        /* @__PURE__ */ jsx("span", { className: "font-bold text-[#0055A4]", children: "Explication :" }),
        " ",
        q.explanation
      ] }),
      selected && /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "mt-5 flex justify-end", children: /* @__PURE__ */ jsxs(Button, { onClick: next, className: "bg-[#0055A4] hover:bg-[#1B6ED6] text-white rounded-xl gap-2", children: [
        idx + 1 >= pool.length ? "Voir le résultat" : "Suivant",
        " ",
        /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
      ] }) })
    ] }, idx) })
  ] });
}
function Flashcards({ terms }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!terms.length) return /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
    /* @__PURE__ */ jsx(Layers, { className: "w-12 h-12 text-slate-300 mx-auto mb-4" }),
    /* @__PURE__ */ jsx("p", { className: "text-slate-500 font-medium", children: "Aucun terme clé trouvé dans cette leçon." }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 mt-1", children: "Les termes en gras dans le contenu apparaîtront ici." })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-6", children: [
    /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-slate-400 mb-6", children: [
      idx + 1,
      " / ",
      terms.length
    ] }),
    /* @__PURE__ */ jsx("div", { className: "relative w-full max-w-md cursor-pointer", style: { perspective: 1e3 }, onClick: () => setFlipped((f) => !f), children: /* @__PURE__ */ jsxs(motion.div, { animate: { rotateY: flipped ? 180 : 0 }, transition: { duration: 0.5, type: "spring", stiffness: 200, damping: 25 }, style: { transformStyle: "preserve-3d" }, className: "relative w-full h-56", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0055A4] to-[#1B6ED6] shadow-xl flex items-center justify-center p-8 text-center", style: { backfaceVisibility: "hidden" }, children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-white/50 mb-3 block", children: "Terme clé" }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-bold text-white", children: terms[idx].term }),
        /* @__PURE__ */ jsx("span", { className: "text-xs text-white/40 mt-4 block", children: "Cliquez pour retourner" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-2xl bg-white border-2 border-slate-200 shadow-xl flex items-center justify-center p-8 text-center", style: { backfaceVisibility: "hidden", transform: "rotateY(180deg)" }, children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 block", children: "Contexte" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-700 leading-relaxed", children: terms[idx].context })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mt-8", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setFlipped(false);
            setIdx((i) => Math.max(0, i - 1));
          },
          disabled: idx === 0,
          className: "h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0055A4] hover:border-[#0055A4]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
          children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setFlipped(false);
            setIdx((i) => Math.min(terms.length - 1, i + 1));
          },
          disabled: idx === terms.length - 1,
          className: "h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0055A4] hover:border-[#0055A4]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
          children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })
        }
      )
    ] })
  ] });
}
function CourseDetail({ classId, onBack }) {
  const navigate = useNavigate();
  const { data, loading, error } = useClassDetail(classId);
  const [activeTab, setActiveTab] = useState("contenu");
  const [bookmarks, setBookmarks] = useState(getBookmarks);
  const terms = useMemo(() => data ? extractTerms(data.content_markdown) : [], [data]);
  const isBookmarked = bookmarks.has(classId);
  const cat = data ? CATEGORIES.find((c) => "range" in c && data.class_number >= c.range[0] && data.class_number <= c.range[1]) : null;
  if (loading) return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center py-32", children: /* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" }) });
  if (error || !data) return /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
    /* @__PURE__ */ jsx(X, { className: "w-12 h-12 text-red-300 mx-auto mb-4" }),
    /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900", children: "Erreur de chargement" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 mt-1", children: error || "Cours introuvable." }),
    /* @__PURE__ */ jsx(Button, { onClick: onBack, variant: "outline", className: "mt-6 rounded-xl", children: "Retour" })
  ] });
  return /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, children: [
    /* @__PURE__ */ jsxs("div", { className: "relative bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] rounded-2xl p-6 md:p-8 mb-8 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
          /* @__PURE__ */ jsx("button", { onClick: onBack, className: "h-8 w-8 rounded-full bg-white/15 flex items-center justify-center text-white/80 hover:bg-white/25 transition-colors", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-white/60 font-medium", children: [
            /* @__PURE__ */ jsx("button", { onClick: onBack, className: "hover:text-white/90 transition-colors", children: "Cours" }),
            /* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsx("span", { className: "text-white/90", children: (cat == null ? void 0 : cat.label) || "Module" }),
            /* @__PURE__ */ jsx(ChevronRight, { className: "w-3 h-3" }),
            /* @__PURE__ */ jsxs("span", { className: "text-white", children: [
              "Classe ",
              data.class_number
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold text-white leading-tight mb-3", children: data.title }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 flex-wrap", children: [
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-white/70 font-medium bg-white/10 px-3 py-1.5 rounded-full", children: [
            /* @__PURE__ */ jsx(Clock, { className: "w-3.5 h-3.5" }),
            " ",
            data.estimated_minutes,
            " min"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-white/70 font-medium bg-white/10 px-3 py-1.5 rounded-full", children: [
            /* @__PURE__ */ jsx(BrainCircuit, { className: "w-3.5 h-3.5" }),
            " ",
            data.questions.length,
            " questions"
          ] }),
          terms.length > 0 && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs text-white/70 font-medium bg-white/10 px-3 py-1.5 rounded-full", children: [
            /* @__PURE__ */ jsx(Layers, { className: "w-3.5 h-3.5" }),
            " ",
            terms.length,
            " termes clés"
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setBookmarks(toggleBookmark(classId)),
              className: "relative ml-auto h-9 w-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all",
              "aria-label": isBookmarked ? "Retirer le signet" : "Ajouter un signet",
              children: [
                /* @__PURE__ */ jsx(AnimatePresence, { children: isBookmarked && /* @__PURE__ */ jsx(
                  motion.span,
                  {
                    initial: { scale: 0, opacity: 0.8 },
                    animate: { scale: 2.5, opacity: 0 },
                    transition: { duration: 0.5 },
                    className: "absolute inset-0 rounded-full",
                    style: { background: "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)" }
                  },
                  "pulse"
                ) }),
                isBookmarked ? /* @__PURE__ */ jsx(BookmarkCheck, { className: "w-4 h-4 text-amber-300 fill-amber-300" }) : /* @__PURE__ */ jsx(Bookmark, { className: "w-4 h-4 text-white/60" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-background rounded-lg border shadow-sm mb-6", children: /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto scrollbar-hide", children: TABS.map((tab) => {
      const Icon = tab.icon;
      const active = activeTab === tab.key;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setActiveTab(tab.key),
          className: `relative flex-1 min-w-0 flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${active ? "text-primary" : "text-muted-foreground hover:bg-muted"}`,
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: tab.label }),
            active && /* @__PURE__ */ jsx(
              motion.div,
              {
                layoutId: "activeTab",
                className: "absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full",
                transition: { type: "spring", stiffness: 500, damping: 30 }
              }
            )
          ]
        },
        tab.key
      );
    }) }) }),
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.2 }, children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border border-[var(--dash-card-border)] shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 md:p-10", children: [
      activeTab === "contenu" && renderMarkdown(data.content_markdown),
      activeTab === "flashcards" && /* @__PURE__ */ jsx(Flashcards, { terms }),
      activeTab === "quiz" && /* @__PURE__ */ jsx(InlineQuiz, { questions: data.questions }),
      activeTab === "documents" && /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx(FolderOpen, { className: "w-12 h-12 text-slate-300 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 mb-2", children: "Documents officiels à venir" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500 max-w-sm mx-auto", children: "Les fiches de révision et documents officiels pour cette leçon seront disponibles prochainement." })
      ] })
    ] }) }, activeTab) }),
    /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: () => navigate(`/quiz?mode=training&classId=${classId}&limit=10`),
        className: "w-full bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold py-6 rounded-xl text-base shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] gap-2",
        children: [
          "Passer au Quiz complet (",
          data.questions.length,
          " questions) ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5" })
        ]
      }
    ) })
  ] });
}
function CoursesPage() {
  const { loading: authLoading } = useAuth();
  const { tier, loading: tierLoading } = useSubscription();
  const { classes, progress, loading: parcoursLoading } = useParcours();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [showGate, setShowGate] = useState(false);
  const [bookmarks, setBookmarks] = useState(getBookmarks);
  const isLoading = authLoading || tierLoading || parcoursLoading;
  useEffect(() => {
    if (!selectedClassId) setBookmarks(getBookmarks());
  }, [selectedClassId]);
  const completedCount = useMemo(() => Object.values(progress).filter((p) => p.status === "completed").length, [progress]);
  const avgScore = useMemo(() => {
    const scores = Object.values(progress).filter((p) => p.status === "completed" && p.score > 0).map((p) => p.score);
    return scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  }, [progress]);
  const firstIncomplete = useMemo(() => {
    return classes.find((c) => {
      const p = progress[c.id];
      return !p || p.status !== "completed";
    });
  }, [classes, progress]);
  const filteredClasses = useMemo(() => {
    let result = classes;
    if (activeCategory !== "all") {
      const cat = CATEGORIES.find((c) => c.key === activeCategory);
      if (cat && "range" in cat) result = result.filter((c) => c.class_number >= cat.range[0] && c.class_number <= cat.range[1]);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => {
        var _a;
        return c.title.toLowerCase().includes(q) || ((_a = c.description) == null ? void 0 : _a.toLowerCase().includes(q)) || `classe ${c.class_number}`.includes(q);
      });
    }
    return result;
  }, [classes, activeCategory, search]);
  const categoryCounts = useMemo(() => {
    const counts = { all: classes.length };
    CATEGORIES.forEach((cat) => {
      if ("range" in cat) counts[cat.key] = classes.filter((c) => c.class_number >= cat.range[0] && c.class_number <= cat.range[1]).length;
    });
    return counts;
  }, [classes]);
  const isUnlocked = useCallback((clazz) => {
    if (tier === "premium") return true;
    if (tier === "free" && clazz.class_number > 10) return false;
    if (clazz.class_number === 1) return true;
    const prev = classes.find((c) => c.class_number === clazz.class_number - 1);
    if (!prev) return false;
    const pp = progress[prev.id];
    return (pp == null ? void 0 : pp.status) === "completed" && ((pp == null ? void 0 : pp.score) ?? 0) >= 60;
  }, [tier, classes, progress]);
  const handleCardClick = (clazz) => {
    if (isUnlocked(clazz)) setSelectedClassId(clazz.id);
    else setShowGate(true);
  };
  const getCat = (n) => CATEGORIES.find((c) => "range" in c && n >= c.range[0] && n <= c.range[1]);
  if (isLoading) return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-[var(--dash-bg)]", children: [
    /* @__PURE__ */ jsx(LearnSidebar, {}),
    /* @__PURE__ */ jsx("div", { className: "flex-1 md:ml-[260px] flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" }) })
  ] });
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-[var(--dash-bg)]", children: [
    /* @__PURE__ */ jsx(SEOHead, { noindex: true }),
    /* @__PURE__ */ jsx(LearnSidebar, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 md:ml-[260px] flex flex-col", children: [
      /* @__PURE__ */ jsx(AppHeader, { pageTitle: "Cours", pageIcon: /* @__PURE__ */ jsx(GraduationCap, { className: "w-5 h-5" }), backTo: "/learn", backLabel: "Tableau de bord" }),
      /* @__PURE__ */ jsx("main", { className: "flex-1 pb-24 md:pb-8", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-6xl px-4 md:px-8 py-6 md:py-8", children: selectedClassId ? /* @__PURE__ */ jsx(CourseDetail, { classId: selectedClassId, onBack: () => setSelectedClassId(null) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            className: "relative bg-gradient-to-r from-[#0055A4] via-[#1B6ED6] to-[#4D94E0] rounded-2xl p-6 md:p-8 mb-10 overflow-hidden",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/5" }),
                /* @__PURE__ */ jsx("div", { className: "absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-white/5" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold text-white mb-1", children: "Explorez les cours" }),
                    /* @__PURE__ */ jsx("p", { className: "text-white/60 text-sm", children: "Apprenez à votre rythme, révisez et testez vos connaissances" })
                  ] }),
                  firstIncomplete && /* @__PURE__ */ jsxs(
                    motion.button,
                    {
                      initial: { opacity: 0, scale: 0.9 },
                      animate: { opacity: 1, scale: 1 },
                      transition: { delay: 0.3 },
                      onClick: () => setSelectedClassId(firstIncomplete.id),
                      className: "inline-flex items-center gap-2 px-5 py-2.5 bg-[#F97316] hover:bg-[#EA580C] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer whitespace-nowrap",
                      children: [
                        /* @__PURE__ */ jsx(Play, { className: "w-4 h-4 fill-white" }),
                        " Reprendre"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
                  { icon: BookOpen, label: "Cours", value: classes.length, color: "bg-white/15" },
                  { icon: CheckCircle2, label: "Terminés", value: completedCount, color: "bg-emerald-500/20" },
                  { icon: TrendingUp, label: "Score moy.", value: `${avgScore}%`, color: "bg-amber-500/20" },
                  { icon: Bookmark, label: "Signets", value: bookmarks.size, color: "bg-white/15" }
                ].map((stat, i) => /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 12 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.1 + i * 0.05 },
                    className: `${stat.color} backdrop-blur-sm rounded-xl px-4 py-3.5 flex items-center gap-3`,
                    children: [
                      /* @__PURE__ */ jsx(stat.icon, { className: "w-5 h-5 text-white/70 flex-shrink-0" }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("div", { className: "text-2xl font-black text-white leading-none", children: stat.value }),
                        /* @__PURE__ */ jsx("div", { className: "text-[10px] font-medium text-white/50 uppercase tracking-wider mt-1", children: stat.label })
                      ] })
                    ]
                  },
                  i
                )) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.1 },
            className: "flex flex-col sm:flex-row gap-3 mb-6",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "relative flex-1 max-w-lg", children: [
                /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: search,
                    onChange: (e) => setSearch(e.target.value),
                    placeholder: "Rechercher un cours...",
                    className: "w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0055A4] focus:ring-2 focus:ring-[#0055A4]/10 transition-all shadow-sm"
                  }
                ),
                search && /* @__PURE__ */ jsx("button", { onClick: () => setSearch(""), className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm", children: [
                /* @__PURE__ */ jsx(Filter, { className: "w-3.5 h-3.5" }),
                /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
                  filteredClasses.length,
                  " cours"
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.15 },
            className: "mb-10 overflow-x-auto scrollbar-hide -mx-4 px-4",
            children: /* @__PURE__ */ jsx("div", { className: "flex gap-2 pb-1", children: CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const active = activeCategory === cat.key;
              const count = categoryCounts[cat.key] || 0;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setActiveCategory(cat.key),
                  className: `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 shadow-sm cursor-pointer ${active ? "text-white shadow-md scale-[1.02]" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:shadow"}`,
                  style: active ? { backgroundColor: cat.color } : {},
                  children: [
                    /* @__PURE__ */ jsx(Icon, { className: "w-3.5 h-3.5" }),
                    cat.label,
                    count > 0 && /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-slate-100 text-slate-400"}`, children: count })
                  ]
                },
                cat.key
              );
            }) })
          }
        ),
        filteredClasses.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm", children: [
          /* @__PURE__ */ jsx(Search, { className: "w-12 h-12 text-slate-300 mx-auto mb-4" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-slate-900 mb-2", children: "Aucun cours trouvé" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-500", children: "Essayez d'autres termes de recherche ou catégories." })
        ] }) : /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: "hidden",
            animate: "visible",
            variants: { hidden: {}, visible: { transition: { staggerChildren: 0.03 } } },
            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6",
            children: filteredClasses.map((clazz) => {
              const unlocked = isUnlocked(clazz);
              const p = progress[clazz.id];
              const done = (p == null ? void 0 : p.status) === "completed";
              const bm = bookmarks.has(clazz.id);
              const cat = getCat(clazz.class_number);
              return /* @__PURE__ */ jsxs(
                motion.div,
                {
                  variants: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } },
                  whileHover: unlocked ? { y: -8, transition: { type: "spring", stiffness: 400, damping: 25 } } : {},
                  whileTap: unlocked ? { scale: 0.97 } : {},
                  onClick: () => handleCardClick(clazz),
                  className: `group relative bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${unlocked ? "cursor-pointer border-slate-200/80 hover:shadow-xl hover:border-slate-300" : "cursor-not-allowed border-slate-100"}`,
                  children: [
                    unlocked && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[1]" }),
                    !unlocked && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2", children: [
                      /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center", children: /* @__PURE__ */ jsx(Lock, { className: "w-5 h-5 text-slate-400" }) }),
                      /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-slate-400", children: "Cours verrouillé" })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full", style: { backgroundColor: (cat == null ? void 0 : cat.color) || "#0055A4" } }),
                    /* @__PURE__ */ jsxs("div", { className: "p-5 relative z-[2]", children: [
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg flex items-center justify-center", style: { backgroundColor: `${(cat == null ? void 0 : cat.color) || "#0055A4"}15` }, children: cat ? /* @__PURE__ */ jsx(cat.icon, { className: "w-4 h-4", style: { color: cat.color } }) : /* @__PURE__ */ jsx(BookOpen, { className: "w-4 h-4 text-[#0055A4]" }) }),
                          /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold uppercase tracking-wider text-slate-400", children: [
                            "Classe ",
                            clazz.class_number
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                          unlocked && /* @__PURE__ */ jsxs(
                            "button",
                            {
                              onClick: (e) => {
                                e.stopPropagation();
                                setBookmarks(toggleBookmark(clazz.id));
                              },
                              className: "relative h-7 w-7 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer",
                              "aria-label": bm ? "Retirer le signet" : "Ajouter un signet",
                              children: [
                                /* @__PURE__ */ jsx(AnimatePresence, { children: bm && /* @__PURE__ */ jsx(
                                  motion.span,
                                  {
                                    initial: { scale: 0, opacity: 0.7 },
                                    animate: { scale: 2.5, opacity: 0 },
                                    transition: { duration: 0.5 },
                                    className: "absolute inset-0 rounded-full",
                                    style: { background: "radial-gradient(circle, rgba(251,191,36,0.5) 0%, transparent 70%)" }
                                  },
                                  "bmpulse"
                                ) }),
                                bm ? /* @__PURE__ */ jsx(BookmarkCheck, { className: "w-4 h-4 text-amber-400 fill-amber-400" }) : /* @__PURE__ */ jsx(Bookmark, { className: "w-3.5 h-3.5 text-slate-300" })
                              ]
                            }
                          ),
                          done && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx("h3", { className: `font-bold text-[15px] leading-snug mb-2 line-clamp-2 ${unlocked ? "text-slate-900 group-hover:text-[#0055A4]" : "text-slate-400"} transition-colors duration-200`, children: clazz.title }),
                      clazz.description && /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed", children: clazz.description }),
                      /* @__PURE__ */ jsx("div", { className: "h-px bg-slate-100 mb-3" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-[11px] text-slate-400 font-medium", children: [
                          /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                          " ",
                          clazz.estimated_minutes,
                          " min"
                        ] }),
                        done && (p == null ? void 0 : p.score) != null && /* @__PURE__ */ jsx(CircleProgress, { value: p.score, size: 38, strokeWidth: 3.5 }),
                        unlocked && !done && /* @__PURE__ */ jsxs("span", { className: "text-[11px] font-bold text-[#0055A4] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1", children: [
                          "Explorer ",
                          /* @__PURE__ */ jsx(ArrowRight, { className: "w-3 h-3" })
                        ] })
                      ] })
                    ] })
                  ]
                },
                clazz.id
              );
            })
          }
        )
      ] }) }) })
    ] }),
    showGate && /* @__PURE__ */ jsx(
      SubscriptionGate,
      {
        open: showGate,
        onOpenChange: setShowGate,
        requiredTier: tier === "free" ? "standard" : "premium",
        featureLabel: "Accès à tous les cours"
      }
    )
  ] });
}
export {
  CoursesPage as default
};
