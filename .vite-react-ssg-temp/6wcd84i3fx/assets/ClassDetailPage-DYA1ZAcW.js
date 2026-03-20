import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { a as useAuth } from "../main.mjs";
import { u as useClassDetail } from "./useClassDetail-DQmVPAQr.js";
import { u as useParcours } from "./useParcours-C7eYJyqa.js";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { B as Button } from "./button-AT0XyJsk.js";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, Trophy, ChevronRight, BookOpen, BrainCircuit } from "lucide-react";
import { S as SubscriptionGate } from "./SubscriptionGate-BJBE68cr.js";
import "react-dom/client";
import "@supabase/supabase-js";
import "react-helmet-async";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "./useUserProfile-BcVuiJUg.js";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
function ClassDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  useAuth();
  const { tier, loading: tierLoading } = useSubscription();
  const { data: classData, loading: detailLoading, error } = useClassDetail(id);
  const { classes, progress } = useParcours();
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState("standard");
  const [gateLabel, setGateLabel] = useState("");
  useEffect(() => {
    var _a;
    if (tierLoading || !classData) return;
    if (tier === "free" && classData.class_number > 10) {
      setGateLabel(`Classe ${classData.class_number} — ${classData.title}`);
      setGateTier("standard");
      setShowGate(true);
    }
    if (tier !== "premium" && classData.class_number > 1) {
      const prevClass = classes.find((c) => c.class_number === classData.class_number - 1);
      if (prevClass && ((_a = progress[prevClass.id]) == null ? void 0 : _a.status) !== "completed") {
        setGateLabel(`Classe ${classData.class_number} — Terminez d'abord la classe précédente`);
        setGateTier(tier === "free" ? "standard" : "standard");
        setShowGate(true);
      }
    }
  }, [tierLoading, tier, classData, classes, progress]);
  const renderInline = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return /* @__PURE__ */ jsx("strong", { className: "font-bold text-[#0055A4]", children: part.slice(2, -2) }, index);
      }
      return part;
    });
  };
  const renderMarkdown = (md) => {
    return md.replace(/\r\n/g, "\n").split("\n\n").map((block, idx) => {
      const p = block.trim();
      if (!p) return null;
      if (p.startsWith("# "))
        return /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-gray-900 mb-4 mt-8 pb-3 border-b border-gray-100 tracking-tight", children: renderInline(p.slice(2)) }, idx);
      if (p.startsWith("### "))
        return /* @__PURE__ */ jsx("h4", { className: "text-base font-bold text-gray-700 mb-3 mt-6", children: renderInline(p.slice(4)) }, idx);
      if (p.startsWith("## "))
        return /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-gray-800 mb-4 mt-8 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-[#0055A4]" }),
          renderInline(p.slice(3))
        ] }, idx);
      if (p.includes("\n") && p.split("\n").some((l) => l.trim().startsWith("- "))) {
        const items = p.split("\n").filter((l) => l.trim().startsWith("- "));
        return /* @__PURE__ */ jsx("div", { className: "bg-[#F8FAFC] rounded-2xl p-5 mb-6 border border-gray-100", children: /* @__PURE__ */ jsx("ul", { className: "list-none space-y-3 m-0 p-0", children: items.map((item, i) => /* @__PURE__ */ jsxs("li", { className: "text-gray-700 leading-relaxed text-[15px] flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-blue-300" }),
          /* @__PURE__ */ jsx("span", { children: renderInline(item.trim().slice(2)) })
        ] }, i)) }) }, idx);
      }
      if (p.startsWith("- ")) {
        const items = p.split("\n").filter((l) => l.trim().startsWith("- "));
        return /* @__PURE__ */ jsx("div", { className: "bg-[#F8FAFC] rounded-2xl p-5 mb-6 border border-gray-100", children: /* @__PURE__ */ jsx("ul", { className: "list-none space-y-3 m-0 p-0", children: items.map((item, i) => /* @__PURE__ */ jsxs("li", { className: "text-gray-700 leading-relaxed text-[15px] flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-blue-300" }),
          /* @__PURE__ */ jsx("span", { children: renderInline(item.trim().slice(2)) })
        ] }, i)) }) }, idx);
      }
      return /* @__PURE__ */ jsx("p", { className: "mb-6 text-gray-700 text-[15px] leading-relaxed break-words", children: renderInline(p) }, idx);
    }).filter(Boolean);
  };
  if (detailLoading || tierLoading) {
    return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-white", children: /* @__PURE__ */ jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" }) });
  }
  if (error || !classData) {
    return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col items-center justify-center bg-white gap-4", children: [
      /* @__PURE__ */ jsx(XCircle, { className: "w-12 h-12 text-red-400" }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: "Classe introuvable" }),
      /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/parcours"), variant: "outline", children: "Retour au parcours" })
    ] });
  }
  const totalQuestions = classData.questions.length;
  const isRecapQuiz = classData.class_number % 10 === 0 && classData.class_number !== 100 || classData.class_number === 95;
  const isExamenBlanc = classData.class_number >= 97 && classData.class_number <= 99;
  const isConseilsJourJ = classData.class_number === 100;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white flex flex-col", children: [
    /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center px-4 shadow-sm", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/parcours"),
          className: "p-2 mr-2 text-gray-400 hover:text-[#0055A4] transition-colors",
          children: /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-bold text-[#0055A4] uppercase tracking-widest", children: [
          "Classe ",
          classData.class_number.toString().padStart(2, "0"),
          " / 100"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-sm font-bold text-gray-900 truncate", children: classData.title })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-3 ml-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-[#0055A4] rounded-full transition-all",
            style: { width: `${classData.class_number / 100 * 100}%` }
          }
        ) }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400 font-bold", children: [
          classData.class_number,
          "%"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 w-full max-w-3xl mx-auto px-4 md:px-8 py-6 pb-32 md:pb-8", children: isExamenBlanc ? (
      /* ── Examen Blanc UI (classes 97-99) ── */
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "bg-gradient-to-br from-slate-900 to-[#0055A4] rounded-2xl p-8 md:p-12 text-white text-center shadow-lg",
          children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Trophy, { className: "w-10 h-10 text-yellow-300" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-white/50 mb-2", children: "Entraînement Final" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-black mb-3", children: classData.title }),
            /* @__PURE__ */ jsx("p", { className: "text-white/70 text-sm mb-3 max-w-md mx-auto leading-relaxed", children: "Entraînez-vous dans les conditions réelles de l'examen officiel." }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6 mb-8 text-sm font-bold text-white/80", children: [
              /* @__PURE__ */ jsx("span", { children: "📋 40 questions" }),
              /* @__PURE__ */ jsx("span", { children: "⏱️ 45 minutes" }),
              /* @__PURE__ */ jsx("span", { children: "🎯 80% pour réussir" })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: () => navigate(`/quiz?mode=exam&limit=40`),
                size: "lg",
                className: "bg-white text-[#0055A4] hover:bg-white/90 font-black rounded-xl shadow-sm px-10 text-base",
                children: [
                  /* @__PURE__ */ jsx(Trophy, { className: "w-5 h-5 mr-2 text-yellow-500" }),
                  "Lancer l'examen blanc",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 ml-1" })
                ]
              }
            )
          ]
        }
      )
    ) : isRecapQuiz ? (
      /* ── Quiz Récapitulatif UI ── */
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          className: "bg-gradient-to-br from-[#0055A4] to-[#1B6ED6] rounded-2xl p-8 md:p-12 text-white text-center shadow-lg",
          children: [
            /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 w-20 h-20 rounded-full bg-white/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Trophy, { className: "w-10 h-10 text-amber-300" }) }),
            /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-white/60 mb-2", children: "Quiz Récapitulatif" }),
            /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-black mb-3", children: classData.title }),
            /* @__PURE__ */ jsx("p", { className: "text-white/75 text-sm mb-8 max-w-md mx-auto leading-relaxed", children: "Testez vos connaissances sur l'ensemble du module avec 40 questions aléatoires. Obtenez au moins 80% pour valider le module." }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: () => navigate(`/quiz?mode=exam&classId=${id}&limit=40`),
                size: "lg",
                className: "bg-white text-[#0055A4] hover:bg-white/90 font-bold rounded-xl shadow-sm px-8",
                children: [
                  /* @__PURE__ */ jsx(Trophy, { className: "w-5 h-5 mr-2 text-amber-500" }),
                  "Lancer le Quiz Récapitulatif",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 ml-1" })
                ]
              }
            )
          ]
        }
      )
    ) : (
      /* ── Regular Lesson UI (+ Conseils jour J with no quiz button) ── */
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          className: "bg-white rounded-2xl p-6 md:p-10 border border-gray-100 shadow-sm",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-6 text-[#0055A4]", children: [
              /* @__PURE__ */ jsx(BookOpen, { className: "w-5 h-5" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-bold uppercase tracking-widest", children: isConseilsJourJ ? "Conseils" : "Leçon" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "max-w-none prose-sm overflow-hidden break-words", children: renderMarkdown(classData.content_markdown) }),
            !isConseilsJourJ && /* @__PURE__ */ jsx("div", { className: "mt-10 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3", children: /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: () => navigate(`/quiz?mode=training&classId=${id}&limit=10`),
                size: "lg",
                className: "bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl shadow-sm",
                children: [
                  /* @__PURE__ */ jsx(BrainCircuit, { className: "w-5 h-5 mr-2" }),
                  "Passer au Quiz (",
                  Math.min(totalQuestions, 10),
                  " questions)",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5 ml-1" })
                ]
              }
            ) })
          ]
        }
      )
    ) }),
    /* @__PURE__ */ jsx(
      SubscriptionGate,
      {
        open: showGate,
        onOpenChange: (open) => {
          setShowGate(open);
          if (!open) navigate("/parcours");
        },
        requiredTier: gateTier,
        featureLabel: gateLabel
      }
    )
  ] });
}
export {
  ClassDetailPage as default
};
