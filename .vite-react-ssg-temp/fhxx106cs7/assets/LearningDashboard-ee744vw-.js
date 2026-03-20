import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { useNavigate } from "react-router-dom";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { u as useUserProfile, a as GOAL_LABELS } from "./useUserProfile-BcVuiJUg.js";
import { u as useDashboardStats, L as LearnSidebar } from "./LearnSidebar-BzOBVmNx.js";
import { motion } from "framer-motion";
import { FileText, BookOpen, Sparkles, Zap, Globe, ArrowRight, CheckCircle, Lock, Flame, Target, AlertTriangle, TrendingUp, MapPin, CheckCircle2, Play, Crown, ChevronLeft, ChevronRight, Clock, X, Check } from "lucide-react";
import { B as Button } from "./button-AT0XyJsk.js";
import { S as SubscriptionGate, D as Dialog, a as DialogContent } from "./SubscriptionGate-BJBE68cr.js";
import { u as useParcours } from "./useParcours-C7eYJyqa.js";
import "react-helmet-async";
import "../main.mjs";
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
import "./Logo-RLfqH6ZW.js";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
function ActivityIcon({ type }) {
  const base = "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0";
  if (type === "exam") return /* @__PURE__ */ jsx("div", { className: `${base} bg-blue-500/10`, children: /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-blue-500" }) });
  if (type === "answer") return /* @__PURE__ */ jsx("div", { className: `${base} bg-emerald-500/10`, children: /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 text-emerald-500" }) });
  return /* @__PURE__ */ jsx("div", { className: `${base} bg-amber-500/10`, children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-amber-500" }) });
}
function RecentActivityLog({ activities }) {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      variants: { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
      className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
      children: [
        /* @__PURE__ */ jsx("h3", { className: "font-bold text-[var(--dash-text)] text-sm mb-4", children: "Activité récente" }),
        activities.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--dash-text-muted)] text-center py-4", children: "Aucune activité pour le moment" }) : /* @__PURE__ */ jsx("div", { className: "space-y-3", children: activities.map((item, i) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 6 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.3 + i * 0.06 },
            className: "flex items-center gap-3",
            children: [
              /* @__PURE__ */ jsx(ActivityIcon, { type: item.type }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--dash-text)] truncate", children: item.title }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--dash-text-muted)]", children: item.date })
              ] }),
              item.detail && /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-[var(--dash-text-muted)] flex-shrink-0", children: item.detail })
            ]
          },
          i
        )) })
      ]
    }
  );
}
const STAGES = [
  { key: "fundamentals", label: "Fondamentaux", desc: "Valeurs de la République", status: "completed" },
  { key: "institutions", label: "Institutions", desc: "Système politique", status: "completed" },
  { key: "rights", label: "Droits & Devoirs", desc: "Citoyenneté active", status: "current" },
  { key: "history", label: "Histoire & Culture", desc: "Repères historiques", status: "locked" },
  { key: "society", label: "Vie en société", desc: "Quotidien en France", status: "locked" }
];
function StatusDot({ status }) {
  if (status === "completed") {
    return /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-[#22C55E] flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.3)]", children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-white" }) });
  }
  if (status === "current") {
    return /* @__PURE__ */ jsxs("div", { className: "relative h-8 w-8 rounded-full bg-[#0055A4] flex items-center justify-center shadow-[0_0_12px_rgba(0,85,164,0.3)]", children: [
      /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-white" }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          className: "absolute inset-0 rounded-full border-2 border-[#0055A4]/40",
          animate: { scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-full bg-[var(--dash-card-border)] flex items-center justify-center", children: /* @__PURE__ */ jsx(Lock, { className: "h-3.5 w-3.5 text-[var(--dash-text-muted)]" }) });
}
function DashboardRightSidebar({ tier, onUpgrade, recentActivity, totalXP }) {
  return /* @__PURE__ */ jsxs(
    motion.aside,
    {
      initial: "hidden",
      animate: "visible",
      variants: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } } },
      className: "w-full xl:w-[340px] flex-shrink-0 flex flex-col gap-6",
      children: [
        /* @__PURE__ */ jsx(
          motion.div,
          {
            variants: { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
            className: "bg-gradient-to-br from-[#0055A4] to-[#3B82F6] rounded-2xl p-5 shadow-md text-white",
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-white/70 uppercase tracking-widest mb-1", children: "Score total" }),
                /* @__PURE__ */ jsxs("p", { className: "text-3xl font-black text-white", children: [
                  totalXP.toLocaleString("fr-FR"),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-white/80", children: "XP" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-white/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Zap, { className: "h-6 w-6 text-amber-300" }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            variants: { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
            className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
            children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-[var(--dash-text)] mb-5 text-sm", children: "Votre Parcours" }),
              /* @__PURE__ */ jsx("div", { className: "relative", children: STAGES.map((stage, idx) => {
                const isLast = idx === STAGES.length - 1;
                return /* @__PURE__ */ jsxs("div", { className: "flex gap-3 relative", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
                    /* @__PURE__ */ jsx(StatusDot, { status: stage.status }),
                    !isLast && /* @__PURE__ */ jsx("div", { className: `w-0.5 flex-1 min-h-[36px] ${stage.status === "completed" ? "bg-[#22C55E]" : "bg-[var(--dash-card-border)]"}` })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: `pb-5 flex-1 ${isLast ? "pb-0" : ""}`, children: [
                    /* @__PURE__ */ jsx("p", { className: `text-sm font-bold mb-0.5 ${stage.status === "locked" ? "text-[var(--dash-text-muted)]" : "text-[var(--dash-text)]"}`, children: stage.label }),
                    /* @__PURE__ */ jsx("p", { className: `text-xs font-medium ${stage.status === "locked" ? "text-[var(--dash-text-muted)] opacity-50" : "text-[var(--dash-text-muted)]"}`, children: stage.desc }),
                    stage.status === "current" && /* @__PURE__ */ jsx("span", { className: "inline-block mt-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0055A4] bg-blue-500/10 px-2 py-0.5 rounded-full", children: "En cours" })
                  ] })
                ] }, stage.key);
              }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx(RecentActivityLog, { activities: recentActivity }),
        tier !== "premium" && /* @__PURE__ */ jsxs(
          motion.div,
          {
            variants: { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } },
            className: "bg-gradient-to-br from-[#0055A4] to-[#3B82F6] rounded-2xl p-5 shadow-md text-white relative overflow-hidden group hover:shadow-lg transition-all",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3 relative z-10", children: [
                /* @__PURE__ */ jsx(Globe, { className: "h-5 w-5 text-white/90" }),
                /* @__PURE__ */ jsx("h3", { className: "font-bold text-base", children: "Passez au supérieur" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-white/80 mb-5 font-medium leading-relaxed relative z-10", children: "Débloquez tous les chapitres et la traduction instantanée." }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: onUpgrade,
                  className: "w-full bg-white text-[#0055A4] hover:bg-white/90 font-bold border-0 shadow-sm rounded-xl py-5 relative z-10",
                  children: [
                    "Débloquer Premium",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 ml-2" })
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 }
};
function StatCards({ successRate, streak, dailyGoalCurrent, dailyGoalTarget }) {
  const dailyPercent = Math.min(100, Math.round(dailyGoalCurrent / dailyGoalTarget * 100));
  const circumference = 2 * Math.PI * 40;
  const strokeOffset = circumference - successRate / 100 * circumference;
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: "hidden",
      animate: "visible",
      variants: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
      className: "flex sm:grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 overflow-x-auto sm:overflow-visible snap-x snap-mandatory pb-1 sm:pb-0",
      style: { scrollbarWidth: "none", msOverflowStyle: "none" },
      children: [
        /* @__PURE__ */ jsxs(motion.div, { variants: cardVariants, className: "snap-center shrink-0 w-[65vw] max-w-[240px] sm:w-auto sm:max-w-none bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative w-24 h-24 flex items-center justify-center", children: [
            /* @__PURE__ */ jsxs("svg", { className: "absolute inset-0 w-full h-full -rotate-90", children: [
              /* @__PURE__ */ jsx("circle", { cx: "48", cy: "48", r: "40", stroke: "var(--dash-card-border)", strokeWidth: "6", fill: "none" }),
              /* @__PURE__ */ jsx(
                motion.circle,
                {
                  cx: "48",
                  cy: "48",
                  r: "40",
                  stroke: "#0055A4",
                  strokeWidth: "6",
                  fill: "none",
                  strokeDasharray: circumference,
                  strokeLinecap: "round",
                  initial: { strokeDashoffset: circumference },
                  animate: { strokeDashoffset: strokeOffset },
                  transition: { duration: 1.2, delay: 0.3, ease: "easeOut" },
                  className: ""
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-2xl font-bold text-[var(--dash-text)]", children: [
              successRate,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-widest text-center", children: "Taux de réussite" })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { variants: cardVariants, className: "snap-center shrink-0 w-[65vw] max-w-[240px] sm:w-auto sm:max-w-none bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Flame, { className: `h-7 w-7 ${streak > 0 ? "text-[#F59E0B]" : "text-[var(--dash-text-muted)]"}` }),
            /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold text-[var(--dash-text)]", children: streak })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-widest text-center", children: "Série de jours" }),
          streak > 0 && /* @__PURE__ */ jsx("p", { className: "text-xs text-[#F59E0B] font-semibold", children: "🔥 Continuez comme ça !" })
        ] }),
        /* @__PURE__ */ jsxs(motion.div, { variants: cardVariants, className: "snap-center shrink-0 w-[65vw] max-w-[240px] sm:w-auto sm:max-w-none bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Target, { className: "h-5 w-5 text-[#22C55E]" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-[var(--dash-text)]", children: "Objectif quotidien" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold text-[#22C55E]", children: [
              dailyGoalCurrent,
              "/",
              dailyGoalTarget
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-3 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden border border-[var(--dash-card-border)]", children: /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { width: 0 },
              animate: { width: `${dailyPercent}%` },
              transition: { duration: 1, delay: 0.4, ease: "easeOut" },
              className: "h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full"
            }
          ) }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--dash-text-muted)] font-medium", children: dailyPercent >= 100 ? "✅ Objectif atteint !" : `Encore ${dailyGoalTarget - dailyGoalCurrent} questions` })
        ] })
      ]
    }
  );
}
const TABS = [
  { key: "overview", label: "Aperçu" },
  { key: "stats", label: "Statistiques" },
  { key: "history", label: "Historique" }
];
function DashboardTabs({ children }) {
  const [activeTab, setActiveTab] = useState("overview");
  return /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 border-b border-[var(--dash-card-border)] mb-6", children: TABS.map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.key),
        className: `relative px-4 py-3 text-sm font-semibold transition-colors ${activeTab === tab.key ? "text-[#0055A4]" : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"}`,
        children: [
          tab.label,
          activeTab === tab.key && /* @__PURE__ */ jsx(
            motion.div,
            {
              layoutId: "dashboardTabIndicator",
              className: "absolute bottom-0 left-0 right-0 h-[3px] bg-[#0055A4] rounded-t-full",
              transition: { type: "spring", stiffness: 400, damping: 30 }
            }
          )
        ]
      },
      tab.key
    )) }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25 },
        children: [
          activeTab === "overview" && children,
          activeTab === "stats" && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 text-[var(--dash-text-muted)]", children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold mb-1", children: "Statistiques détaillées" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Bientôt disponible" })
          ] }),
          activeTab === "history" && /* @__PURE__ */ jsxs("div", { className: "text-center py-16 text-[var(--dash-text-muted)]", children: [
            /* @__PURE__ */ jsx("p", { className: "text-lg font-semibold mb-1", children: "Historique des examens" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Bientôt disponible" })
          ] })
        ]
      },
      activeTab
    )
  ] });
}
function ResumeStudyCard({
  chapterTitle,
  chapterNumber,
  totalChapters,
  progressPercent
}) {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.2 },
      whileHover: { y: -2, boxShadow: "0 8px 28px rgba(0,0,0,0.08)" },
      className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8 cursor-pointer group",
      onClick: () => navigate("/parcours"),
      children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6 text-[#0055A4]" }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-widest mb-1", children: "Reprendre l'étude" }),
          /* @__PURE__ */ jsx("h3", { className: "text-base font-bold text-[var(--dash-text)] mb-3 truncate", children: chapterTitle }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs font-semibold text-[var(--dash-text-muted)] mb-2", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Chapitre ",
              chapterNumber,
              "/",
              totalChapters
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "text-[#0055A4]", children: [
              progressPercent,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-2 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden border border-[var(--dash-card-border)]", children: /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { width: 0 },
              animate: { width: `${progressPercent}%` },
              transition: { duration: 0.8, delay: 0.4, ease: "easeOut" },
              className: "h-full bg-gradient-to-r from-[#0055A4] to-[#3B82F6] rounded-full"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-10 w-10 rounded-full bg-[#0055A4] flex items-center justify-center shadow-sm self-center group-hover:bg-[#1B6ED6] transition-colors", children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 text-white group-hover:translate-x-0.5 transition-transform" }) })
      ] })
    }
  );
}
const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
function WeeklyActivityChart({ data }) {
  const max = Math.max(...data, 1);
  return /* @__PURE__ */ jsxs("div", { className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-bold text-[var(--dash-text)] text-sm mb-1", children: "Activité hebdomadaire" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--dash-text-muted)] mb-5", children: "Questions répondues cette semaine" }),
    /* @__PURE__ */ jsx("div", { className: "flex items-end justify-between gap-2 h-32", children: data.map((val, i) => {
      const height = max > 0 ? val / max * 100 : 0;
      return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-[var(--dash-text-muted)]", children: val }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-[var(--dash-surface)] rounded-md overflow-hidden", style: { height: "80px" }, children: /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { height: 0 },
            animate: { height: `${height}%` },
            transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" },
            className: "w-full bg-gradient-to-t from-[#0055A4] to-[#3B82F6] rounded-md mt-auto",
            style: { marginTop: `${100 - height}%` }
          }
        ) }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-[var(--dash-text-muted)]", children: DAYS[i] })
      ] }, i);
    }) }),
    data.every((v) => v === 0) && /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-[var(--dash-text-muted)] mt-3", children: "Aucune activité cette semaine — commencez un quiz !" })
  ] });
}
function DomainMasteryBars({ domains }) {
  const hasData = domains.some((d) => d.total > 0);
  return /* @__PURE__ */ jsxs("div", { className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-bold text-[var(--dash-text)] text-sm mb-1", children: "Maîtrise par domaine" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--dash-text-muted)] mb-5", children: "Votre niveau dans chaque catégorie" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: domains.map((d, i) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-1.5", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold text-[var(--dash-text)]", children: d.label }),
        /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", style: { color: d.color }, children: d.total > 0 ? `${d.percent}%` : "—" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-2 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { width: 0 },
          animate: { width: `${d.percent}%` },
          transition: { duration: 0.8, delay: 0.2 + i * 0.1, ease: "easeOut" },
          className: "h-full rounded-full",
          style: { backgroundColor: d.color }
        }
      ) }),
      d.total > 0 && /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-[var(--dash-text-muted)] mt-1", children: [
        d.correct,
        "/",
        d.total,
        " bonnes réponses"
      ] })
    ] }, d.label)) }),
    !hasData && /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-[var(--dash-text-muted)] mt-3", children: "Répondez à des questions pour voir votre maîtrise" })
  ] });
}
function WeaknessAlerts({ alerts }) {
  const navigate = useNavigate();
  if (alerts.length === 0) {
    return /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.3 },
        className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-[#22C55E]" }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-[var(--dash-text)] text-sm", children: "Pas de point faible détecté" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--dash-text-muted)]", children: "Continuez à répondre aux questions pour obtenir une analyse personnalisée." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.3 },
      className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-8",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-[#F59E0B]" }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-[var(--dash-text)] text-sm", children: "Points à réviser" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: alerts.map((alert, i) => /* @__PURE__ */ jsxs(
          motion.button,
          {
            initial: { opacity: 0, x: -8 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: 0.4 + i * 0.08 },
            whileHover: { x: 4 },
            onClick: () => navigate(`/quiz?category=${encodeURIComponent(alert.category)}`),
            className: "w-full flex items-center gap-3 p-3 rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-card-border)] hover:border-[var(--dash-text-muted)] transition-all text-left group",
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-2 w-2 rounded-full", style: { backgroundColor: alert.color } }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-xs font-bold text-[var(--dash-text)] mb-0.5", children: alert.domain }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[var(--dash-text-muted)] truncate", children: alert.message })
              ] }),
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5 text-[var(--dash-text-muted)] group-hover:text-[var(--dash-text)] transition-colors flex-shrink-0" })
            ]
          },
          i
        )) })
      ]
    }
  );
}
function ExamReadinessCard({ successRate, totalExams }) {
  const minExamsForReadiness = 5;
  const passThreshold = 80;
  let statusColor = "text-[var(--dash-text-muted)]";
  let bgGradient = "from-slate-500 to-slate-400";
  let message = "Commencez à vous entraîner";
  let Icon = Target;
  if (totalExams < minExamsForReadiness) {
    statusColor = "text-amber-600";
    bgGradient = "from-amber-400 to-amber-500";
    message = `Encore ${minExamsForReadiness - totalExams} examens pour évaluer votre niveau`;
  } else if (successRate >= passThreshold) {
    statusColor = "text-emerald-600";
    bgGradient = "from-emerald-400 to-emerald-500";
    message = "Vous êtes prêt pour la naturalisation !";
    Icon = TrendingUp;
  } else if (successRate >= 60) {
    statusColor = "text-blue-600";
    bgGradient = "from-blue-400 to-blue-500";
    message = "En bonne voie, continuez à réviser";
    Icon = TrendingUp;
  } else {
    statusColor = "text-red-500";
    bgGradient = "from-red-400 to-red-500";
    message = "Des révisions supplémentaires sont nécessaires";
    Icon = AlertTriangle;
  }
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] mb-6 sm:mb-8",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("div", { className: `p-1.5 rounded-lg bg-opacity-10 ${statusColor.replace("text-", "bg-")}`, children: /* @__PURE__ */ jsx(Icon, { className: `h-5 w-5 ${statusColor}` }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-base sm:text-lg font-bold text-[var(--dash-text)]", children: "Préparation à l'Examen" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("span", { className: `text-xl font-bold ${statusColor}`, children: [
              successRate,
              "%"
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--dash-text-muted)] ml-1", children: "Précision Moyenne" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative h-4 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden border border-[var(--dash-card-border)] mb-2", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 bottom-0 left-[80%] w-0.5 bg-red-400 z-10", title: "Seuil de réussite (80%)" }),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { width: 0 },
              animate: { width: `${successRate}%` },
              transition: { duration: 1, delay: 0.2, ease: "easeOut" },
              className: `absolute top-0 bottom-0 left-0 bg-gradient-to-r ${bgGradient} rounded-full z-0`
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-[var(--dash-text-muted)]", children: message }),
          /* @__PURE__ */ jsx("span", { className: "text-[var(--dash-text-muted)]", children: "Objectif: 80%" })
        ] })
      ]
    }
  );
}
function ParcoursCard() {
  const navigate = useNavigate();
  const { tier } = useSubscription();
  const { classes, progress, loading } = useParcours();
  const isFree = tier === "free";
  const totalClasses = classes.length || 100;
  const completedCount = Object.values(progress).filter((p) => p.status === "completed").length;
  const progressPercent = totalClasses > 0 ? Math.round(completedCount / totalClasses * 100) : 0;
  const nextClass = classes.find((c) => {
    var _a;
    return ((_a = progress[c.id]) == null ? void 0 : _a.status) !== "completed";
  });
  const nextClassNumber = (nextClass == null ? void 0 : nextClass.class_number) || 1;
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      whileHover: { y: -2 },
      className: "mb-6 group bg-[var(--dash-card)] rounded-2xl border-2 border-[#0055A4]/10 p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,85,164,0.08)] transition-all duration-300 relative overflow-hidden",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "absolute inset-y-0 right-0 w-[55%] hidden md:block pointer-events-none overflow-hidden rounded-r-2xl", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/examen-civique-parcours-100-niveaux-desktop.jpg",
              alt: "",
              className: "h-full w-full object-cover object-left"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "absolute top-0 right-0 w-28 h-28 md:hidden pointer-events-none overflow-hidden rounded-tr-2xl", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/examen-civique-parcours-100-niveaux-mobile.jpg",
              alt: "",
              className: "h-full w-full object-cover object-center"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
              /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg bg-[#0055A4] flex items-center justify-center", children: /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-white" }) }),
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[var(--dash-text)] tracking-tight", children: "Parcours Citoyen" }),
              isFree && /* @__PURE__ */ jsxs("span", { className: "ml-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Lock, { className: "w-3 h-3" }),
                " 10 Classes"
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[var(--dash-text-muted)] font-medium mb-4 max-w-lg text-sm", children: isFree ? "Découvrez la méthode étape par étape. Essayez les 10 premières classes gratuitement !" : "Avancez étape par étape avec des leçons courtes et des quiz de 5 questions." }),
            !isFree && /* @__PURE__ */ jsxs("div", { className: "mb-1 max-w-md", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs font-bold text-[var(--dash-text)] mb-1.5", children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  "Classe ",
                  nextClassNumber,
                  " / ",
                  totalClasses
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "text-[#0055A4]", children: [
                  progressPercent,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-2 w-full bg-gray-100 border border-gray-200 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { width: 0 },
                  animate: { width: `${progressPercent}%` },
                  transition: { duration: 1, delay: 0.3, ease: "easeOut" },
                  className: "h-full bg-gradient-to-r from-[#0055A4] to-[#3B82F6] rounded-full"
                }
              ) }),
              nextClass && /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-bold text-[var(--dash-text-muted)] mt-2 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "w-3 h-3 text-[#0055A4]" }),
                "Prochaine : ",
                nextClass.title
              ] })
            ] }),
            completedCount > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 mt-2 text-emerald-500", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold", children: [
                completedCount,
                " classe",
                completedCount > 1 ? "s" : "",
                " complétée",
                completedCount > 1 ? "s" : ""
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => navigate("/parcours"),
              className: "w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-12 px-6 shadow-[0_4px_12px_rgba(0,85,164,0.2)] hover:shadow-[0_6px_16px_rgba(0,85,164,0.3)] hover:-translate-y-0.5 transition-all",
              children: [
                isFree ? "Découvrir le parcours" : loading ? "Chargement..." : completedCount > 0 ? "Continuer" : "Commencer",
                isFree ? /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4 ml-2" }) : /* @__PURE__ */ jsx(Play, { className: "w-4 h-4 ml-2 fill-current" })
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
const CATEGORY_MAP = {
  Principles: { emoji: "⚖️", gradient: "from-blue-600 via-blue-500 to-indigo-600", shadow: "shadow-blue-500/30", label: "Fondamentaux", desc: "Valeurs et principes de la République", dbCategory: "Principles and values of the Republic", image: "/examen-civique-qcm-valeurs-republique-francaise.jpg", imageAlt: "QCM examen civique — Valeurs et principes de la République française" },
  Institutions: { emoji: "🏛️", gradient: "from-indigo-600 via-purple-500 to-violet-600", shadow: "shadow-indigo-500/30", label: "Institutions", desc: "Fonctionnement de l'État et des institutions", dbCategory: "Institutional and political system", image: "/examen-civique-qcm-institutions-systeme-politique.jpg", imageAlt: "QCM examen civique — Institutions et système politique français" },
  Rights: { emoji: "🛡️", gradient: "from-emerald-600 via-green-500 to-teal-600", shadow: "shadow-emerald-500/30", label: "Droits & Devoirs", desc: "Droits et devoirs du citoyen", dbCategory: "Rights and duties", image: "/examen-civique-qcm-droits-devoirs-citoyen.jpg", imageAlt: "QCM examen civique — Droits et devoirs du citoyen français" },
  History: { emoji: "📜", gradient: "from-amber-600 via-orange-500 to-yellow-600", shadow: "shadow-amber-500/30", label: "Histoire & Culture", desc: "Histoire de France et repères clés", dbCategory: "History, geography and culture", image: "/examen-civique-qcm-histoire-geographie-culture.jpg", imageAlt: "QCM examen civique — Histoire géographie culture de France" },
  Living: { emoji: "🏠", gradient: "from-sky-600 via-cyan-500 to-blue-600", shadow: "shadow-sky-500/30", label: "Vivre en société", desc: "Vie quotidienne, éducation, santé, emploi", dbCategory: "Living in French society", image: "/examen-civique-qcm-vivre-societe-integration.jpg", imageAlt: "QCM examen civique — Vivre en société et intégration en France" }
};
function LearningDashboard() {
  const { tier, isPremium, isStandardOrAbove, loading: tierLoading } = useSubscription();
  const navigate = useNavigate();
  const { profile: userProfile, loading: profileLoading, saveProfile } = useUserProfile();
  const stats = useDashboardStats();
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState("standard");
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [catOffset, setCatOffset] = useState(0);
  const openGate = (required) => {
    setGateTier(required);
    setShowGate(true);
  };
  if (stats.loading || tierLoading || profileLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-[var(--dash-bg)]", children: [
      /* @__PURE__ */ jsx(LearnSidebar, {}),
      /* @__PURE__ */ jsx("div", { className: "flex-1 md:ml-[260px] flex items-center justify-center pb-20 md:pb-0", children: /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" }) })
    ] });
  }
  const firstName = (userProfile == null ? void 0 : userProfile.first_name) || stats.displayName.split(" ")[0] || stats.displayName || "Apprenant";
  const displayAvatar = (userProfile == null ? void 0 : userProfile.avatar_url) || stats.avatarUrl;
  const personaGoalLabel = (userProfile == null ? void 0 : userProfile.goal_type) ? GOAL_LABELS[userProfile.goal_type] : "Naturalisation";
  const getMasteryForCategory = (dbCategory) => {
    const mastery = stats.domainMastery.find((d) => d.dbCategory === dbCategory);
    return (mastery == null ? void 0 : mastery.percent) || 0;
  };
  const handleStartExam = (category) => {
    var _a;
    if (tier === "free" && !stats.canTakeExamFree) {
      openGate("standard");
      return;
    }
    if (category && tier !== "premium") {
      openGate("premium");
      return;
    }
    if (category) {
      navigate(`/quiz?category=${encodeURIComponent(((_a = CATEGORY_MAP[category]) == null ? void 0 : _a.dbCategory) || category)}`);
    } else {
      navigate("/quiz?mode=exam&limit=40");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-[var(--dash-bg)] transition-colors duration-300 overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        titleKey: "seo.dashboardTitle",
        descriptionKey: "seo.dashboardDesc",
        path: "/learn",
        noindex: true
      }
    ),
    /* @__PURE__ */ jsx(LearnSidebar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 md:ml-[260px] pb-24 md:pb-8 flex justify-center overflow-x-hidden", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[1400px] px-4 md:px-6 lg:px-8 py-6 md:py-8 flex flex-col xl:flex-row gap-6 overflow-x-hidden", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          animate: "visible",
          variants: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } },
          className: "flex-1 min-w-0",
          children: [
            /* @__PURE__ */ jsxs(motion.div, { variants: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }, className: "mb-4 sm:mb-6 bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" }),
              /* @__PURE__ */ jsx("div", { className: "absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-6 flex items-center gap-3 sm:gap-5", children: [
                /* @__PURE__ */ jsx("div", { className: "relative shrink-0", children: displayAvatar ? /* @__PURE__ */ jsx("img", { src: displayAvatar, alt: "Avatar", className: "w-10 h-10 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 border-white object-cover shadow-lg" }) : /* @__PURE__ */ jsx("div", { className: "w-10 h-10 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 border-white bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg sm:text-2xl shadow-lg", children: firstName.charAt(0) }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 z-10", children: [
                  /* @__PURE__ */ jsxs("h1", { className: "text-base sm:text-2xl md:text-3xl font-bold text-[var(--dash-text)] tracking-tight truncate", children: [
                    "Bonjour, ",
                    firstName,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "inline-block animate-wave origin-bottom-right", children: "👋" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-3", children: [
                    isPremium ? /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border bg-amber-100 text-amber-700 border-amber-200", children: [
                      /* @__PURE__ */ jsx(Crown, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }),
                      " Premium"
                    ] }) : isStandardOrAbove ? /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20", children: [
                      /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }),
                      " Standard"
                    ] }) : /* @__PURE__ */ jsx("div", { className: "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20", children: "Gratuit" }),
                    /* @__PURE__ */ jsxs(
                      "button",
                      {
                        onClick: () => setShowGoalModal(true),
                        className: "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm",
                        children: [
                          /* @__PURE__ */ jsx(Target, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#0055A4]" }),
                          /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Objectif : " }),
                          personaGoalLabel
                        ]
                      }
                    )
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "sm:hidden border-t border-[var(--dash-card-border)] grid grid-cols-3 divide-x divide-[var(--dash-card-border)]", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-3 gap-0.5", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold text-[#0055A4]", children: [
                    stats.successRate,
                    "%"
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-[var(--dash-text-muted)] uppercase tracking-wider", children: "Réussite" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-3 gap-0.5", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Flame, { className: `h-4 w-4 ${stats.streak > 0 ? "text-[#F59E0B]" : "text-[var(--dash-text-muted)]"}` }),
                    /* @__PURE__ */ jsx("span", { className: "text-lg font-bold text-[var(--dash-text)]", children: stats.streak })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-[var(--dash-text-muted)] uppercase tracking-wider", children: "Série" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-3 gap-0.5", children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold text-[#22C55E]", children: [
                    stats.dailyGoalCurrent,
                    "/",
                    stats.dailyGoalTarget
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[9px] font-bold text-[var(--dash-text-muted)] uppercase tracking-wider", children: "Quotidien" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(motion.div, { variants: { hidden: { opacity: 0 }, visible: { opacity: 1 } }, className: "hidden sm:block", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row gap-4 mb-6 sm:mb-8", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
                StatCards,
                {
                  successRate: stats.successRate,
                  streak: stats.streak,
                  dailyGoalCurrent: stats.dailyGoalCurrent,
                  dailyGoalTarget: stats.dailyGoalTarget
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "w-full lg:w-[320px] flex-shrink-0", children: /* @__PURE__ */ jsx(
                ExamReadinessCard,
                {
                  successRate: stats.successRate,
                  totalExams: stats.examHistory.length
                }
              ) })
            ] }) }),
            /* @__PURE__ */ jsx(motion.div, { variants: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }, children: /* @__PURE__ */ jsx(ParcoursCard, {}) }),
            /* @__PURE__ */ jsx(motion.div, { variants: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }, children: /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-[var(--dash-text)]", children: "Entraînement par catégorie" }),
                /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setCatOffset((o) => Math.max(0, o - 1)),
                      disabled: catOffset === 0,
                      className: "w-8 h-8 rounded-full border border-[var(--dash-card-border)] flex items-center justify-center disabled:opacity-30 hover:border-[#0055A4] hover:text-[#0055A4] transition-all",
                      children: /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" })
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setCatOffset((o) => Math.min(Object.keys(CATEGORY_MAP).length - 3, o + 1)),
                      disabled: catOffset >= Object.keys(CATEGORY_MAP).length - 3,
                      className: "w-8 h-8 rounded-full border border-[var(--dash-card-border)] flex items-center justify-center disabled:opacity-30 hover:border-[#0055A4] hover:text-[#0055A4] transition-all",
                      children: /* @__PURE__ */ jsx(ChevronRight, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex sm:hidden gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide", children: Object.entries(CATEGORY_MAP).map(([cat, info], idx) => {
                const masteryPercent = getMasteryForCategory(info.dbCategory);
                return /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.96 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { delay: idx * 0.05 },
                    className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden snap-center shrink-0 w-[72vw] max-w-[280px]",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "relative w-full h-[150px] overflow-hidden", children: [
                        /* @__PURE__ */ jsx("img", { src: info.image, alt: info.imageAlt, className: "w-full h-full object-cover", loading: "lazy" }),
                        tier !== "premium" && /* @__PURE__ */ jsx("span", { className: "absolute top-2.5 right-2.5 bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg", children: "Premium" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col flex-1", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--dash-text-muted)] font-medium mb-4 flex-1 line-clamp-2", children: info.desc }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2.5 mt-auto", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest", children: [
                            /* @__PURE__ */ jsx("span", { children: "Progression" }),
                            /* @__PURE__ */ jsxs("span", { className: "text-[#0055A4]", children: [
                              masteryPercent,
                              "%"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(motion.div, { initial: { width: 0 }, animate: { width: `${masteryPercent}%` }, transition: { duration: 0.8, delay: 0.2 + idx * 0.1, ease: "easeOut" }, className: "h-full bg-[#0055A4] rounded-full" }) }),
                          /* @__PURE__ */ jsxs(Button, { onClick: () => handleStartExam(cat), variant: "outline", className: "w-full border-[var(--dash-card-border)] hover:border-[#0055A4] text-[var(--dash-text)] hover:text-[#0055A4] hover:bg-blue-500/5 font-bold rounded-xl h-9 text-sm transition-all gap-1.5", children: [
                            tier !== "premium" && /* @__PURE__ */ jsx(Lock, { className: "h-3.5 w-3.5 text-slate-400" }),
                            "S'entraîner"
                          ] })
                        ] })
                      ] })
                    ]
                  },
                  cat
                );
              }) }),
              /* @__PURE__ */ jsx("div", { className: "hidden sm:grid sm:grid-cols-3 gap-4", children: Object.entries(CATEGORY_MAP).slice(catOffset, catOffset + 3).map(([cat, info], idx) => {
                const masteryPercent = getMasteryForCategory(info.dbCategory);
                return /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.96 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { delay: idx * 0.05 },
                    whileHover: { y: -3, boxShadow: "0 10px 28px rgba(0,0,0,0.08)" },
                    className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden",
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "relative w-full h-[150px] overflow-hidden", children: [
                        /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: info.image,
                            alt: info.imageAlt,
                            className: "w-full h-full object-cover",
                            loading: "lazy"
                          }
                        ),
                        tier !== "premium" && /* @__PURE__ */ jsx("span", { className: "absolute top-2.5 right-2.5 bg-amber-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg", children: "Premium" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "p-4 flex flex-col flex-1", children: [
                        /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--dash-text-muted)] font-medium mb-4 flex-1 line-clamp-2", children: info.desc }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2.5 mt-auto", children: [
                          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[10px] font-bold text-[var(--dash-text-muted)] uppercase tracking-widest", children: [
                            /* @__PURE__ */ jsx("span", { children: "Progression" }),
                            /* @__PURE__ */ jsxs("span", { className: "text-[#0055A4]", children: [
                              masteryPercent,
                              "%"
                            ] })
                          ] }),
                          /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full bg-[var(--dash-surface)] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                            motion.div,
                            {
                              initial: { width: 0 },
                              animate: { width: `${masteryPercent}%` },
                              transition: { duration: 0.8, delay: 0.2 + idx * 0.1, ease: "easeOut" },
                              className: "h-full bg-[#0055A4] rounded-full"
                            }
                          ) }),
                          /* @__PURE__ */ jsxs(
                            Button,
                            {
                              onClick: () => handleStartExam(cat),
                              variant: "outline",
                              className: "w-full border-[var(--dash-card-border)] hover:border-[#0055A4] text-[var(--dash-text)] hover:text-[#0055A4] hover:bg-blue-500/5 font-bold rounded-xl h-9 text-sm transition-all gap-1.5",
                              children: [
                                tier !== "premium" && /* @__PURE__ */ jsx(Lock, { className: "h-3.5 w-3.5 text-slate-400" }),
                                "S'entraîner"
                              ]
                            }
                          )
                        ] })
                      ] })
                    ]
                  },
                  cat
                );
              }) })
            ] }) }),
            /* @__PURE__ */ jsx(motion.div, { variants: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }, children: /* @__PURE__ */ jsxs(DashboardTabs, { children: [
              /* @__PURE__ */ jsx(ResumeStudyCard, { chapterTitle: "Quiz : Histoire de France", chapterNumber: 3, totalChapters: 5, progressPercent: 65 }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6", children: [
                /* @__PURE__ */ jsx(WeeklyActivityChart, { data: stats.weeklyActivity }),
                /* @__PURE__ */ jsx(DomainMasteryBars, { domains: stats.domainMastery })
              ] }),
              /* @__PURE__ */ jsx(WeaknessAlerts, { alerts: stats.weaknessAlerts }),
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  whileHover: { y: -2 },
                  className: "bg-[var(--dash-card)] rounded-2xl border-2 border-[#0055A4] p-5 md:p-6 shadow-[0_4px_20px_rgba(0,85,164,0.06)] mb-8 relative overflow-hidden",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-3", children: /* @__PURE__ */ jsx("span", { className: "bg-blue-500/10 text-[#0055A4] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest", children: "Recommandé" }) }),
                    /* @__PURE__ */ jsx("h2", { className: "text-lg sm:text-xl font-bold text-[var(--dash-text)] mb-1.5 mt-3", children: "Examen Blanc" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs sm:text-sm text-[var(--dash-text-muted)] font-medium mb-4 sm:mb-5 max-w-lg", children: "40 questions aléatoires couvrant tous les domaines — évaluez votre niveau global." }),
                    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap items-center gap-5 mb-6", children: [
                      { icon: FileText, text: "40 Questions" },
                      { icon: Clock, text: "~ 45 min" },
                      { icon: Target, text: "Seuil : 80%" }
                    ].map(({ icon: Icon, text }) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4 text-[var(--dash-text-muted)]" }),
                      /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold text-[var(--dash-text)]", children: text })
                    ] }, text)) }),
                    /* @__PURE__ */ jsx(
                      Button,
                      {
                        onClick: () => handleStartExam(),
                        className: "w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 px-8 shadow-[0_4px_14px_rgba(0,85,164,0.25)] hover:-translate-y-0.5 transition-all",
                        children: "Commencer l'examen"
                      }
                    )
                  ]
                }
              )
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        DashboardRightSidebar,
        {
          tier,
          onUpgrade: () => openGate("premium"),
          recentActivity: stats.recentActivity,
          totalXP: stats.totalXP
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(SubscriptionGate, { open: showGate, onOpenChange: setShowGate, requiredTier: gateTier, featureLabel: gateTier === "premium" ? "Entraînement par catégorie" : "Examens illimités" }),
    /* @__PURE__ */ jsx(Dialog, { open: showGoalModal, onOpenChange: setShowGoalModal, children: /* @__PURE__ */ jsx(DialogContent, { className: "sm:max-w-md p-0 rounded-2xl overflow-hidden bg-[var(--dash-card)] border border-[var(--dash-card-border)] shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[var(--dash-text)]", children: "Modifier mon objectif" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowGoalModal(false), className: "h-8 w-8 rounded-full bg-[var(--dash-surface)] hover:bg-[var(--dash-card-border)] flex items-center justify-center text-[var(--dash-text-muted)] transition-colors", children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-3", children: [
        { value: "naturalisation", label: "Naturalisation française", desc: "Devenir citoyen français" },
        { value: "carte_resident", label: "Carte de Résident (CR)", desc: "Obtenir la carte de résident de 10 ans" },
        { value: "csp", label: "Carte de Séjour Pluriannuelle (CSP)", desc: "Renouveler votre titre de séjour" }
      ].map((goal) => {
        const isActive = (userProfile == null ? void 0 : userProfile.goal_type) === goal.value;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            disabled: savingGoal,
            onClick: async () => {
              setSavingGoal(true);
              await saveProfile({ goal_type: goal.value });
              setSavingGoal(false);
              setShowGoalModal(false);
            },
            className: `w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all hover:-translate-y-0.5 ${isActive ? "border-[#0055A4] bg-blue-500/5" : "border-[var(--dash-card-border)] hover:border-[#0055A4]/40"}`,
            children: [
              /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isActive ? "bg-[#0055A4] text-white" : "bg-blue-500/10 text-[#0055A4]"}`, children: /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "font-semibold text-[var(--dash-text)]", children: goal.label }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--dash-text-muted)] mt-0.5", children: goal.desc })
              ] }),
              isActive && /* @__PURE__ */ jsx(Check, { className: "h-5 w-5 text-[#0055A4] flex-shrink-0" })
            ]
          },
          goal.value
        );
      }) })
    ] }) }) })
  ] });
}
export {
  LearningDashboard as default
};
