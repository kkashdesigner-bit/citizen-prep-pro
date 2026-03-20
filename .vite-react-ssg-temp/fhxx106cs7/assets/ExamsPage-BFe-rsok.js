import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { B as Button } from "./button-AT0XyJsk.js";
import { GraduationCap, Clock, CheckCircle, Target, Trophy, TrendingUp, XCircle, PlayCircle, Shield, Sparkles } from "lucide-react";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { u as useUserProfile, a as GOAL_LABELS, G as GOAL_TO_LEVEL } from "./useUserProfile-BcVuiJUg.js";
import { u as useDashboardStats, L as LearnSidebar } from "./LearnSidebar-BzOBVmNx.js";
import { S as SubscriptionGate } from "./SubscriptionGate-BJBE68cr.js";
import { A as AppHeader } from "./AppHeader-W_GlnqQg.js";
import { useState } from "react";
import { motion } from "framer-motion";
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
import "@radix-ui/react-slot";
import "./Logo-RLfqH6ZW.js";
import "@radix-ui/react-dialog";
import "./avatar-aMrL2e85.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
const EXAM_CATEGORIES = [
  { label: "Fondamentaux", color: "#3B82F6", icon: Shield },
  { label: "Institutions", color: "#8B5CF6", icon: Target },
  { label: "Droits & Devoirs", color: "#22C55E", icon: CheckCircle },
  { label: "Histoire & Culture", color: "#F59E0B", icon: TrendingUp },
  { label: "Vie en société", color: "#06B6D4", icon: Sparkles }
];
const LEVEL_DESCRIPTIONS = {
  Naturalisation: {
    tagline: "Niveau le plus complet",
    detail: "Inclut les questions CSP, CR et Naturalisation — couvre l'ensemble des connaissances requises."
  },
  CR: {
    tagline: "Niveau intermédiaire",
    detail: "Inclut les questions CSP et Carte de Résident — adapté à votre démarche."
  },
  CSP: {
    tagline: "Niveau fondamental",
    detail: "Questions sur les valeurs républicaines fondamentales — l'essentiel pour la CSP."
  }
};
function ExamsPage() {
  const navigate = useNavigate();
  const { tier, isStandardOrAbove, isPremium } = useSubscription();
  const { profile } = useUserProfile();
  const { examHistory, successRate, examsToday, domainMastery } = useDashboardStats();
  const [showGate, setShowGate] = useState(false);
  const isFree = tier === "free";
  const goalType = profile == null ? void 0 : profile.goal_type;
  const examLevel = goalType ? GOAL_TO_LEVEL[goalType] : "CSP";
  const goalLabel = goalType ? GOAL_LABELS[goalType] : "Carte de Séjour Pluriannuelle (CSP)";
  const levelInfo = LEVEL_DESCRIPTIONS[examLevel] || LEVEL_DESCRIPTIONS["CSP"];
  const totalExams = examHistory.filter((e) => !e.mode || e.mode === "exam").length;
  const passedExams = examHistory.filter((e) => (!e.mode || e.mode === "exam") && e.passed).length;
  const bestScore = totalExams > 0 ? Math.max(...examHistory.filter((e) => !e.mode || e.mode === "exam").map((e) => Math.round(e.score / e.totalQuestions * 100))) : 0;
  const weakest = domainMastery.filter((d) => d.total > 0).sort((a, b) => a.percent - b.percent)[0];
  const handleStartExam = () => {
    if (isFree && examsToday >= 1) {
      setShowGate(true);
      return;
    }
    if (!isFree && !isStandardOrAbove) {
      setShowGate(true);
      return;
    }
    navigate("/quiz?mode=exam&limit=40");
  };
  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-[var(--dash-bg)]", children: [
    /* @__PURE__ */ jsx(SEOHead, { titleKey: "seo.examsTitle", descriptionKey: "seo.examsDesc", path: "/exams" }),
    /* @__PURE__ */ jsx(LearnSidebar, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 md:ml-[260px] flex flex-col", children: [
      /* @__PURE__ */ jsx(
        AppHeader,
        {
          pageTitle: "Examens Blancs",
          pageIcon: /* @__PURE__ */ jsx(GraduationCap, { className: "h-5 w-5" }),
          backTo: "/learn",
          backLabel: "Tableau de bord"
        }
      ),
      /* @__PURE__ */ jsx("main", { className: "flex-1 pb-20 md:pb-8", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          animate: "visible",
          variants: stagger,
          className: "mx-auto max-w-3xl px-4 md:px-8 py-6 md:py-8 space-y-5",
          children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                variants: fadeUp,
                className: "relative overflow-hidden rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-6 md:p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0055A4] via-[#3B82F6] to-[#EF4135]" }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start gap-5", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-14 w-14 rounded-2xl bg-[#0055A4]/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(GraduationCap, { className: "h-7 w-7 text-[#0055A4]" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-[var(--dash-text)] mb-1", children: "Examen blanc complet" }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-3", children: [
                        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 text-xs font-semibold bg-[#0055A4]/10 text-[#0055A4] px-2.5 py-1 rounded-full", children: "40 questions" }),
                        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-semibold bg-[var(--dash-surface)] text-[var(--dash-text-muted)] px-2.5 py-1 rounded-full", children: [
                          /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                          " 45 min"
                        ] }),
                        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs font-semibold bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full", children: [
                          /* @__PURE__ */ jsx(CheckCircle, { className: "h-3 w-3" }),
                          " 80% pour réussir"
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-[var(--dash-surface)] border border-[var(--dash-card-border)] p-4 mb-4", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                          /* @__PURE__ */ jsx(Target, { className: "h-4 w-4 text-[#0055A4]" }),
                          /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-[var(--dash-text)]", children: "Adapté à votre profil" })
                        ] }),
                        /* @__PURE__ */ jsxs("p", { className: "text-xs text-[var(--dash-text-muted)] mb-2", children: [
                          "Objectif : ",
                          /* @__PURE__ */ jsx("strong", { className: "text-[var(--dash-text)]", children: goalLabel }),
                          " — ",
                          levelInfo.tagline
                        ] }),
                        /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[var(--dash-text-muted)] leading-relaxed", children: [
                          levelInfo.detail,
                          " Chaque examen est unique : 40 questions tirées aléatoirement d'une banque de plus de 7 000 questions."
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
                        /* @__PURE__ */ jsxs(
                          Button,
                          {
                            size: "lg",
                            className: "gap-2 font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]",
                            onClick: handleStartExam,
                            children: [
                              /* @__PURE__ */ jsx(GraduationCap, { className: "h-4 w-4" }),
                              " Lancer l'examen"
                            ]
                          }
                        ),
                        isFree && /* @__PURE__ */ jsx("span", { className: "text-xs text-[var(--dash-text-muted)]", children: examsToday >= 1 ? "Limite atteinte (1/jour) — revenez demain" : `${1 - examsToday} examen restant aujourd'hui` })
                      ] })
                    ] })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                variants: fadeUp,
                className: "rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
                children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[var(--dash-text)] mb-3", children: "5 domaines évalués — 8 questions chacun" }),
                  /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-2", children: EXAM_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "flex flex-col items-center gap-1.5 rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-surface)] p-3 text-center",
                        children: [
                          /* @__PURE__ */ jsx(
                            "div",
                            {
                              className: "h-8 w-8 rounded-lg flex items-center justify-center",
                              style: { backgroundColor: `${cat.color}15` },
                              children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4", style: { color: cat.color } })
                            }
                          ),
                          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-[var(--dash-text-muted)] leading-tight", children: cat.label })
                        ]
                      },
                      cat.label
                    );
                  }) })
                ]
              }
            ),
            totalExams > 0 && /* @__PURE__ */ jsxs(
              motion.div,
              {
                variants: fadeUp,
                className: "rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
                children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[var(--dash-text)] mb-4", children: "Vos résultats" }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
                    /* @__PURE__ */ jsx(StatCard, { icon: Trophy, color: "#F59E0B", label: "Examens passés", value: totalExams }),
                    /* @__PURE__ */ jsx(StatCard, { icon: CheckCircle, color: "#22C55E", label: "Taux de réussite", value: `${successRate}%` }),
                    /* @__PURE__ */ jsx(StatCard, { icon: TrendingUp, color: "#3B82F6", label: "Meilleur score", value: `${bestScore}%` }),
                    /* @__PURE__ */ jsx(
                      StatCard,
                      {
                        icon: XCircle,
                        color: weakest && weakest.percent < 70 ? "#EF4444" : "#06B6D4",
                        label: "Point faible",
                        value: weakest ? weakest.label : "—",
                        small: true
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-1 h-2 bg-[var(--dash-surface)] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "h-full bg-emerald-500 rounded-full transition-all",
                        style: { width: `${totalExams > 0 ? passedExams / totalExams * 100 : 0}%` }
                      }
                    ) }),
                    /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold text-[var(--dash-text-muted)]", children: [
                      passedExams,
                      "/",
                      totalExams,
                      " réussis"
                    ] })
                  ] })
                ]
              }
            ),
            !isStandardOrAbove && /* @__PURE__ */ jsx(
              motion.div,
              {
                variants: fadeUp,
                className: "rounded-2xl border border-[var(--dash-card-border)] bg-[var(--dash-card)] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-[#EF4135]/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(PlayCircle, { className: "h-5 w-5 text-[#EF4135]" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-[var(--dash-text)]", children: "Démo gratuite" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--dash-text-muted)]", children: "20 questions pour découvrir le format de l'examen" })
                  ] }),
                  /* @__PURE__ */ jsxs(
                    Button,
                    {
                      variant: "outline",
                      size: "sm",
                      className: "gap-1.5 flex-shrink-0 rounded-xl",
                      onClick: () => navigate("/quiz?mode=demo"),
                      children: [
                        /* @__PURE__ */ jsx(PlayCircle, { className: "h-3.5 w-3.5" }),
                        " Essayer"
                      ]
                    }
                  )
                ] })
              }
            )
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx(SubscriptionGate, { open: showGate, onOpenChange: setShowGate, requiredTier: "standard", featureLabel: "Examens blancs illimités" })
  ] });
}
function StatCard({ icon: Icon, color, label, value, small }) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-[var(--dash-card-border)] bg-[var(--dash-surface)] p-3 flex flex-col gap-2", children: [
    /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-lg flex items-center justify-center", style: { backgroundColor: `${color}15` }, children: /* @__PURE__ */ jsx(Icon, { className: "h-4 w-4", style: { color } }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: `font-bold text-[var(--dash-text)] ${small ? "text-xs" : "text-lg"} leading-tight`, children: value }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[var(--dash-text-muted)] font-medium", children: label })
    ] })
  ] });
}
export {
  ExamsPage as default
};
