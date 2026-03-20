import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { a as useAuth } from "../main.mjs";
import { u as useUserProfile, a as GOAL_LABELS } from "./useUserProfile-BcVuiJUg.js";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { u as useParcours } from "./useParcours-C7eYJyqa.js";
import { L as LearnSidebar } from "./LearnSidebar-BzOBVmNx.js";
import { S as SubscriptionGate } from "./SubscriptionGate-BJBE68cr.js";
import { B as Button } from "./button-AT0XyJsk.js";
import { motion } from "framer-motion";
import { ArrowLeft, Route, Trophy, Sparkles, Lock, BookOpen, CheckCircle2, Clock, Play, ShieldCheck, Star } from "lucide-react";
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
import "./Logo-RLfqH6ZW.js";
import "@radix-ui/react-dialog";
import "@radix-ui/react-slot";
const MODULES = [
  { number: 1, label: "Module 1 : Les Valeurs Fondamentales de la République", range: [1, 10], icon: "⚖️", color: "#0055A4" },
  { number: 2, label: "Module 2 : Les Symboles et Principes Républicains", range: [11, 20], icon: "🇫🇷", color: "#1B6ED6" },
  { number: 3, label: "Module 3 : Le Pouvoir Exécutif", range: [21, 30], icon: "🏛️", color: "#7C3AED" },
  { number: 4, label: "Module 4 : Le Pouvoir Législatif et Judiciaire", range: [31, 40], icon: "⚖️", color: "#6D28D9" },
  { number: 5, label: "Module 5 : Les Droits Fondamentaux", range: [41, 50], icon: "🛡️", color: "#0891B2" },
  { number: 6, label: "Module 6 : Les Devoirs et la Citoyenneté", range: [51, 60], icon: "🤝", color: "#059669" },
  { number: 7, label: "Module 7 : L'Histoire de France", range: [61, 70], icon: "📜", color: "#D97706" },
  { number: 8, label: "Module 8 : La Géographie et la Culture Française", range: [71, 80], icon: "🗺️", color: "#B45309" },
  { number: 9, label: "Module 9 : Économie, Travail et Protection Sociale", range: [81, 90], icon: "💼", color: "#DC2626" },
  { number: 10, label: "Module 10 : Vie Quotidienne et Intégration", range: [91, 100], icon: "🏠", color: "#EF4135" }
];
function getMasteryInfo(score) {
  if (score >= 86) return { label: "Maîtrisé", color: "bg-amber-400/15", textColor: "text-amber-500", icon: Trophy };
  if (score >= 70) return { label: "En cours d'acquisition", color: "bg-emerald-500/10", textColor: "text-emerald-500", icon: ShieldCheck };
  return { label: "Non acquis", color: "bg-red-500/10", textColor: "text-red-500", icon: Star };
}
function ParcoursPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { tier, loading: tierLoading } = useSubscription();
  const { classes, progress, loading: parcoursLoading } = useParcours();
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState("standard");
  const nextClassRef = useRef(null);
  const isLoading = authLoading || profileLoading || tierLoading || parcoursLoading;
  const completedCount = useMemo(
    () => Object.values(progress).filter((p) => p.status === "completed").length,
    [progress]
  );
  const totalClasses = classes.length || 100;
  const progressPercent = totalClasses > 0 ? Math.round(completedCount / totalClasses * 100) : 0;
  const nextClass = useMemo(
    () => classes.find((c) => {
      var _a;
      return ((_a = progress[c.id]) == null ? void 0 : _a.status) !== "completed";
    }) || classes[0],
    [classes, progress]
  );
  const isUnlocked = (clazz) => {
    if (tier === "premium") return true;
    if (tier === "free") {
      if (clazz.class_number > 10) return false;
    }
    if (clazz.class_number === 1) return true;
    const prevClass = classes.find((c) => c.class_number === clazz.class_number - 1);
    if (!prevClass) return false;
    const prevProgress = progress[prevClass.id];
    return (prevProgress == null ? void 0 : prevProgress.status) === "completed" && ((prevProgress == null ? void 0 : prevProgress.score) ?? 0) >= 60;
  };
  const handleClassClick = (clazz) => {
    if (isUnlocked(clazz)) {
      navigate(`/parcours/classe/${clazz.id}`);
    } else {
      setGateTier(tier === "free" ? "standard" : "premium");
      setShowGate(true);
    }
  };
  useEffect(() => {
    if (!isLoading && nextClassRef.current) {
      setTimeout(() => {
        var _a;
        (_a = nextClassRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 600);
    }
  }, [isLoading, nextClass]);
  const personaGoalLabel = (profile == null ? void 0 : profile.goal_type) ? GOAL_LABELS[profile.goal_type] : "Naturalisation";
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-white", children: [
      /* @__PURE__ */ jsx(LearnSidebar, {}),
      /* @__PURE__ */ jsx("div", { className: "flex-1 md:ml-[260px] flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-white overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(SEOHead, { noindex: true }),
    /* @__PURE__ */ jsx(LearnSidebar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 md:ml-[260px] pb-24 md:pb-8 flex justify-center overflow-x-hidden", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-4xl px-3 sm:px-4 md:px-8 py-6 md:py-8", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          className: "mb-6 flex items-center gap-4",
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => navigate("/learn"),
                className: "h-10 w-10 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-[#0055A4] hover:border-[#0055A4]/30 transition-colors",
                children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h1", { className: "text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Route, { className: "w-6 h-6 text-[#0055A4]" }),
                "Parcours Citoyen"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-gray-500 mt-0.5", children: [
                personaGoalLabel,
                " · ",
                /* @__PURE__ */ jsxs("span", { className: "text-[#0055A4] font-bold", children: [
                  completedCount,
                  "/",
                  totalClasses,
                  " classes"
                ] })
              ] })
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
          className: "bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] rounded-2xl p-6 md:p-8 mb-10 shadow-lg text-white relative overflow-hidden",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-y-0 right-0 w-[55%] hidden md:block pointer-events-none overflow-hidden rounded-r-2xl", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/examen-civique-parcours-progression-desktop.jpg",
                  alt: "",
                  "aria-hidden": "true",
                  className: "h-full w-full object-cover object-left"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0055A4] via-[#0055A4]/60 to-transparent" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-y-0 right-0 w-[50%] md:hidden pointer-events-none overflow-hidden rounded-r-2xl", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: "/examen-civique-parcours-progression-mobile.jpg",
                  alt: "",
                  "aria-hidden": "true",
                  className: "h-full w-full object-cover object-center"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-[#0055A4] via-[#0055A4]/50 to-transparent" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-lg font-bold mb-1 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Trophy, { className: "w-5 h-5 text-amber-300" }),
                " Votre Progression"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-white/70 text-sm mb-4", children: "Avancez pas à pas vers la maîtrise." }),
              /* @__PURE__ */ jsxs("div", { className: "mb-2 flex justify-between items-end", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-4xl font-black", children: [
                  progressPercent,
                  /* @__PURE__ */ jsx("span", { className: "text-lg text-white/60", children: "%" })
                ] }),
                nextClass && /* @__PURE__ */ jsxs("span", { className: "text-sm text-white/80 font-bold", children: [
                  "Niveau actuel : Classe ",
                  nextClass.class_number
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "h-3 w-full bg-white/20 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                motion.div,
                {
                  initial: { width: 0 },
                  animate: { width: `${progressPercent}%` },
                  transition: { duration: 1.2, ease: "easeOut" },
                  className: "h-full bg-white rounded-full"
                }
              ) }),
              tier === "premium" && /* @__PURE__ */ jsxs("div", { className: "mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-white/10 px-3 py-1 rounded-full", children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "w-3.5 h-3.5" }),
                " Accès libre à toutes les classes"
              ] }),
              tier === "free" && /* @__PURE__ */ jsxs("div", { className: "mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white/70 bg-white/10 px-3 py-1 rounded-full", children: [
                /* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5" }),
                " Accès gratuit : Classes 1 à 10"
              ] })
            ] })
          ]
        }
      ),
      classes.length === 0 && /* @__PURE__ */ jsxs("div", { className: "text-center py-20 bg-gray-50 rounded-2xl border border-gray-100", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "w-12 h-12 text-gray-300 mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: "Parcours en cours de construction" }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-500 max-w-sm mx-auto", children: [
          `Les classes pour l'objectif "`,
          personaGoalLabel,
          `" sont en cours d'élaboration. Revenez bientôt !`
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-12", children: MODULES.map((mod, modIdx) => {
        const moduleClasses = classes.filter(
          (c) => c.class_number >= mod.range[0] && c.class_number <= mod.range[1]
        );
        if (moduleClasses.length === 0) return null;
        const modCompleted = moduleClasses.filter((c) => {
          var _a;
          return ((_a = progress[c.id]) == null ? void 0 : _a.status) === "completed";
        }).length;
        const modPercent = moduleClasses.length > 0 ? Math.round(modCompleted / moduleClasses.length * 100) : 0;
        return /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: modIdx * 0.1 },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "h-11 w-11 rounded-xl flex items-center justify-center text-white text-lg shadow-sm",
                    style: { backgroundColor: mod.color },
                    children: mod.icon
                  }
                ),
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-base sm:text-lg font-bold text-gray-900 truncate", children: mod.label }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-1", children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs", children: /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "h-full rounded-full transition-all duration-700",
                        style: { width: `${modPercent}%`, backgroundColor: mod.color }
                      }
                    ) }),
                    /* @__PURE__ */ jsxs("span", { className: "text-xs font-bold text-gray-400", children: [
                      modCompleted,
                      "/",
                      moduleClasses.length
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "relative ml-3 sm:ml-5 md:ml-[22px] border-l-2 border-gray-100 pl-6 sm:pl-8 md:pl-10 space-y-1", children: moduleClasses.map((clazz, idx) => {
                const clazzProgress = progress[clazz.id];
                const status = (clazzProgress == null ? void 0 : clazzProgress.status) || "not_started";
                const isCompleted = status === "completed";
                const unlocked = isUnlocked(clazz);
                const isNext = (nextClass == null ? void 0 : nextClass.id) === clazz.id;
                const score = (clazzProgress == null ? void 0 : clazzProgress.score) || 0;
                const mastery = isCompleted ? getMasteryInfo(score) : null;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    ref: isNext ? nextClassRef : void 0,
                    className: "relative",
                    children: [
                      /* @__PURE__ */ jsx("div", { className: `absolute -left-[33px] sm:-left-[41px] md:-left-[49px] top-4 w-4 h-4 rounded-full border-2 z-10 ${isCompleted ? "bg-emerald-500 border-emerald-500" : isNext && unlocked ? "bg-[#0055A4] border-[#0055A4] ring-4 ring-[#0055A4]/20 animate-pulse" : unlocked ? "bg-white border-[#0055A4]" : "bg-gray-100 border-gray-200"}`, children: isCompleted && /* @__PURE__ */ jsx(CheckCircle2, { className: "w-3 h-3 text-white absolute top-0 left-0" }) }),
                      isNext && unlocked && /* @__PURE__ */ jsx("div", { className: "absolute -left-[90px] sm:-left-[100px] md:-left-[112px] top-3 text-[9px] font-bold text-[#0055A4] uppercase tracking-wider whitespace-nowrap hidden sm:block", children: "← Vous êtes ici" }),
                      /* @__PURE__ */ jsx(
                        motion.div,
                        {
                          whileHover: unlocked ? { x: 4 } : {},
                          onClick: () => handleClassClick(clazz),
                          className: `group relative py-3.5 px-5 rounded-xl border transition-all duration-200 mb-2 ${unlocked ? "cursor-pointer" : "cursor-not-allowed"} ${isCompleted ? "bg-white border-emerald-200 hover:border-emerald-300" : isNext && unlocked ? "bg-[#0055A4]/[0.03] border-[#0055A4]/30 hover:border-[#0055A4]/50 shadow-sm" : unlocked ? "bg-white border-gray-150 hover:border-[#0055A4]/30 hover:shadow-sm" : "bg-gray-50/70 border-gray-100 opacity-60"}`,
                          children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                            /* @__PURE__ */ jsx("span", { className: `text-lg font-black font-mono w-8 text-center flex-shrink-0 ${isCompleted ? "text-emerald-500" : isNext && unlocked ? "text-[#0055A4]" : unlocked ? "text-gray-800" : "text-gray-300"}`, children: clazz.class_number }),
                            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                              /* @__PURE__ */ jsx("h3", { className: `font-semibold text-sm leading-tight truncate ${!unlocked ? "text-gray-400" : "text-gray-900"}`, children: clazz.title }),
                              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-0.5", children: [
                                unlocked && /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-gray-400 flex items-center gap-1", children: [
                                  /* @__PURE__ */ jsx(Clock, { className: "w-3 h-3" }),
                                  " ",
                                  clazz.estimated_minutes,
                                  " min"
                                ] }),
                                mastery && /* @__PURE__ */ jsxs("span", { className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${mastery.color} ${mastery.textColor}`, children: [
                                  score,
                                  "% · ",
                                  mastery.label
                                ] }),
                                !isCompleted && status !== "not_started" && ((clazzProgress == null ? void 0 : clazzProgress.score) ?? 0) < 60 && ((clazzProgress == null ? void 0 : clazzProgress.score) ?? 0) > 0 && /* @__PURE__ */ jsxs("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-500", children: [
                                  clazzProgress == null ? void 0 : clazzProgress.score,
                                  "% · Non réussi — Réessayez"
                                ] })
                              ] })
                            ] }),
                            /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: isCompleted ? /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-emerald-500" }) : isNext && unlocked ? /* @__PURE__ */ jsxs(
                              Button,
                              {
                                size: "sm",
                                className: "bg-[#0055A4] hover:bg-[#1B6ED6] text-white text-xs font-bold rounded-lg h-8 px-4 shadow-sm",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  handleClassClick(clazz);
                                },
                                children: [
                                  "Commencer ",
                                  /* @__PURE__ */ jsx(Play, { className: "w-3 h-3 ml-1 fill-current" })
                                ]
                              }
                            ) : !unlocked ? /* @__PURE__ */ jsx(Lock, { className: "w-4 h-4 text-gray-300" }) : status === "in_progress" ? /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider bg-[#0055A4]/10 text-[#0055A4] px-2.5 py-1 rounded-full", children: "En cours" }) : null })
                          ] })
                        }
                      )
                    ]
                  },
                  clazz.id
                );
              }) })
            ]
          },
          modIdx
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsx(SubscriptionGate, { open: showGate, onOpenChange: setShowGate, requiredTier: gateTier, featureLabel: "90 niveaux supplémentaires, 1 500+ questions, examens blancs, entraînement par catégories et suivi de progression" })
  ] });
}
export {
  ParcoursPage as default
};
