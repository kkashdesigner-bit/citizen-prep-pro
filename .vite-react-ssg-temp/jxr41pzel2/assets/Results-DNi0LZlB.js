import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { u as useLanguage, a as useAuth } from "../main.mjs";
import { C as CATEGORY_LABELS } from "./types-CapR02YX.js";
import { S as SubscriptionGate } from "./SubscriptionGate-BJBE68cr.js";
import { H as Header } from "./Header-CzgIuffk.js";
import { u as useParcours } from "./useParcours-C7eYJyqa.js";
import { ArrowRight, LayoutDashboard, ChevronRight, RotateCcw, AlertTriangle, ChevronUp, ChevronDown, Medal, Check, X, Landmark, Scale, HeartHandshake } from "lucide-react";
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
import "./button-AT0XyJsk.js";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
import "./useSubscription-Cz7bDEZd.js";
import "./avatar-aMrL2e85.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./Logo-RLfqH6ZW.js";
import "./use-mobile-BsFue-bT.js";
import "./useUserProfile-BcVuiJUg.js";
const passImage = "/examen-civique-resultat-passe.jpg";
const failImage = "/examen-civique-resultat-nonpasse.jpg";
function Results() {
  const navigate = useNavigate();
  useSearchParams();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState([]);
  const [showErrors, setShowErrors] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const errorsRef = useRef(null);
  const [classId, setClassId] = useState(null);
  const { classes } = useParcours();
  useEffect(() => {
    const stored = sessionStorage.getItem("quizResults");
    if (stored) {
      setResult(JSON.parse(stored));
      const storedErrors = sessionStorage.getItem("quizErrors");
      if (storedErrors) setErrors(JSON.parse(storedErrors));
      const storedClassId = sessionStorage.getItem("quizClassId");
      if (storedClassId) setClassId(storedClassId);
    } else {
      navigate("/");
    }
  }, [navigate]);
  const handleToggleErrors = () => {
    setShowErrors((prev) => !prev);
    if (!showErrors) {
      setTimeout(() => {
        var _a;
        return (_a = errorsRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };
  if (!result) return null;
  const scorePercent = result.totalQuestions > 0 ? Math.round(result.score / result.totalQuestions * 100) : 0;
  const entries = result.categoryBreakdown ? Object.entries(result.categoryBreakdown) : [];
  const currentClass = classId ? classes.find((c) => c.id === classId) : null;
  const nextClass = currentClass ? classes.find((c) => c.class_number === currentClass.class_number + 1) : null;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#f6f6f8] text-slate-900 font-sans flex flex-col overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(SEOHead, { noindex: true }),
    /* @__PURE__ */ jsx("style", { children: `
 .font-display { font-family: 'Lexend', sans-serif; }
 .confetti-bg {
 background-image: 
 radial-gradient(circle at 20% 30%, #135bec 2px, transparent 2px),
 radial-gradient(circle at 80% 10%, #ef4444 2px, transparent 2px),
 radial-gradient(circle at 50% 50%, #135bec 3px, transparent 3px),
 radial-gradient(circle at 10% 80%, #ef4444 2px, transparent 2px),
 radial-gradient(circle at 90% 70%, #135bec 2px, transparent 2px),
 radial-gradient(circle at 30% 90%, #ef4444 3px, transparent 3px);
 background-size: 200px 200px;
 }
 .tricolor-fill {
 background: linear-gradient(90deg, #135bec 0%, #135bec 33%, #ffffff 33%, #ffffff 66%, #ef4444 66%, #ef4444 100%);
 }
 ` }),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex flex-1 justify-center py-6 px-4 lg:px-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col max-w-[1000px] flex-1 gap-8 w-full mt-4", children: [
      /* @__PURE__ */ jsx("section", { className: `relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] shadow-2xl ${result.passed ? "bg-gradient-to-br from-emerald-50 to-blue-50" : "bg-gradient-to-br from-red-50 to-slate-100"}`, children: /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col items-center px-5 py-8 sm:px-10 sm:py-12 lg:px-16 lg:py-14", children: [
        /* @__PURE__ */ jsx("span", { className: `px-6 py-2 ${result.passed ? "bg-green-500" : "bg-red-500"} text-white rounded-full text-sm font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 shadow-lg`, children: result.passed ? "Examen Réussi" : "Examen Échoué" }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:gap-14 w-full justify-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: result.passed ? passImage : failImage,
                alt: result.passed ? "examen-civique réussite mascotte" : "examen-civique échec mascotte",
                className: "w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-3xl shadow-xl"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: `absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 ${result.passed ? "bg-emerald-500" : "bg-red-500"} text-white rounded-2xl px-4 py-2 sm:px-5 sm:py-3 shadow-lg`, children: [
              /* @__PURE__ */ jsxs("span", { className: "block text-2xl sm:text-4xl font-black font-display tracking-tighter leading-none", children: [
                scorePercent,
                "%"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "block text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-80", children: "Score" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center lg:text-left max-w-md", children: [
            /* @__PURE__ */ jsx("h1", { className: `text-3xl sm:text-5xl lg:text-6xl font-black mb-3 sm:mb-5 font-display leading-tight ${result.passed ? "text-emerald-700" : "text-red-600"}`, children: result.passed ? t("results.congratulations") : t("results.tooBad") }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-600 text-sm sm:text-lg font-medium leading-relaxed", children: result.passed ? "Bravo ! Continuez comme ça, vous progressez bien vers votre objectif." : "Vous n'avez pas atteint le score nécessaire. Continuez à vous entraîner !" }),
            /* @__PURE__ */ jsx("div", { className: "mt-6 sm:mt-8 flex flex-wrap gap-4 justify-center lg:justify-start", children: /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  sessionStorage.removeItem("quizResults");
                  sessionStorage.removeItem("quizErrors");
                  if (classId && nextClass) {
                    sessionStorage.removeItem("quizClassId");
                    navigate(`/parcours/classe/${nextClass.id}`);
                  } else {
                    navigate("/quiz?mode=exam");
                  }
                },
                className: "bg-[#135bec] text-white py-4 px-10 rounded-2xl font-black flex items-center gap-4 hover:scale-105 transition-all shadow-xl",
                children: [
                  /* @__PURE__ */ jsx("span", { children: classId && nextClass ? "Classe suivante" : t("results.nextExam") }),
                  /* @__PURE__ */ jsx(ArrowRight, { size: 24 })
                ]
              }
            ) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-black font-display italic text-slate-800", children: "Résultats par catégorie" }),
            /* @__PURE__ */ jsxs("span", { className: "bg-blue-100 text-[#135bec] text-xs font-bold px-3 py-1 rounded-full", children: [
              entries.length,
              " catégories"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl border-2 border-slate-100 shadow-lg overflow-hidden divide-y divide-slate-100", children: entries.map(([cat, data], idx) => {
            var _a;
            const catPercent = data.total > 0 ? Math.round(data.correct / data.total * 100) : 0;
            const categoryName = ((_a = CATEGORY_LABELS[language]) == null ? void 0 : _a[cat]) || cat;
            let Icon = Landmark;
            if (cat.toLowerCase().includes("valeur")) Icon = Scale;
            if (cat.toLowerCase().includes("droit") || cat.toLowerCase().includes("devoir")) Icon = HeartHandshake;
            return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 hover:bg-slate-50 transition-colors", children: [
              /* @__PURE__ */ jsx("div", { className: "size-10 shrink-0 rounded-xl bg-blue-50 text-[#135bec] flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { size: 20 }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-1.5", children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-bold text-sm text-slate-800 truncate pr-2", children: categoryName }),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm font-black text-[#135bec] font-display shrink-0", children: [
                    catPercent,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "w-full bg-slate-100 rounded-full overflow-hidden h-2 border border-slate-200", children: /* @__PURE__ */ jsx("div", { className: "h-full tricolor-fill rounded-full", style: { width: `${catPercent}%` } }) })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-slate-400 font-bold shrink-0 hidden sm:block", children: [
                data.correct,
                "/",
                data.total
              ] })
            ] }, idx);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-black px-1 font-display uppercase tracking-widest text-slate-400", children: "Actions" }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                if (!user) {
                  navigate("/auth");
                  return;
                }
                navigate("/learn");
              },
              className: "w-full bg-slate-100 text-slate-700 py-4 px-6 rounded-2xl font-bold flex items-center gap-4 hover:bg-slate-200 transition-all border-b-4 border-slate-300 active:border-b-0 active:translate-y-1",
              children: [
                /* @__PURE__ */ jsx(LayoutDashboard, { className: "text-[#135bec]" }),
                t("results.dashboard")
              ]
            }
          ),
          classId && (() => {
            const currentClass2 = classes.find((c) => c.id === classId);
            const nextClass2 = currentClass2 ? classes.find((c) => c.class_number === currentClass2.class_number + 1) : null;
            return nextClass2 ? /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  sessionStorage.removeItem("quizResults");
                  sessionStorage.removeItem("quizErrors");
                  sessionStorage.removeItem("quizClassId");
                  navigate(`/parcours/classe/${nextClass2.id}`);
                },
                className: "w-full bg-[#135bec] text-white py-4 px-6 rounded-2xl font-bold flex items-center gap-4 hover:bg-[#0d4fd4] transition-all shadow-lg shadow-blue-500/20 border-b-4 border-blue-700 active:border-b-0 active:translate-y-1",
                children: [
                  /* @__PURE__ */ jsx(ChevronRight, { className: "text-white" }),
                  "Classe suivante"
                ]
              }
            ) : null;
          })(),
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => {
                const storedIds = sessionStorage.getItem("quizQuestionIds");
                const storedMode = sessionStorage.getItem("quizMode") || "exam";
                sessionStorage.removeItem("quizResults");
                sessionStorage.removeItem("quizErrors");
                sessionStorage.removeItem("quizQuestionIds");
                sessionStorage.removeItem("quizMode");
                if (storedIds) {
                  sessionStorage.setItem("retakeQuestionIds", storedIds);
                }
                navigate(`/quiz?mode=${storedMode}&retake=1`);
              },
              className: "w-full border-2 border-slate-200 text-slate-600 py-4 px-6 rounded-2xl font-bold flex items-center gap-4 hover:bg-slate-50 transition-all border-b-4 border-slate-200 active:border-b-0 active:translate-y-1",
              children: [
                /* @__PURE__ */ jsx(RotateCcw, { className: "text-[#ef4444]" }),
                t("results.retakeExam")
              ]
            }
          ),
          errors.length > 0 && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: handleToggleErrors,
              className: "w-full bg-slate-100 text-slate-700 py-4 px-6 rounded-2xl font-bold flex items-center gap-4 hover:bg-slate-200 transition-all border-b-4 border-slate-300 active:border-b-0 active:translate-y-1",
              children: [
                /* @__PURE__ */ jsx(AlertTriangle, { className: "text-yellow-500 fill-yellow-500" }),
                showErrors ? "Masquer mes erreurs" : "Revoir mes erreurs",
                showErrors ? /* @__PURE__ */ jsx(ChevronUp, { className: "h-5 w-5 ml-auto text-slate-400" }) : /* @__PURE__ */ jsx(ChevronDown, { className: "h-5 w-5 ml-auto text-slate-400" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 p-6 rounded-[2rem] bg-gradient-to-br from-slate-900 to-[#135bec] text-white relative overflow-hidden group", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-2", children: /* @__PURE__ */ jsx(Medal, { className: "text-yellow-400 text-4xl opacity-30 w-12 h-12" }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-black font-display mb-2 italic", children: "Passez au Pass Premium" }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-xs mb-6 font-medium", children: "Débloquez 2000+ questions et simulations d'entretiens." }),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowGate(true), className: "w-full bg-white text-[#135bec] py-3 rounded-xl font-black text-sm hover:scale-[1.02] transition-transform shadow-xl", children: "Débloquer maintenant" })
          ] })
        ] })
      ] }),
      showErrors && errors.length > 0 && /* @__PURE__ */ jsx("div", { ref: errorsRef, className: "w-full mb-8 pt-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-[2.5rem] p-8 md:p-10 w-full bg-white border-2 border-slate-100 shadow-xl", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-black font-display text-slate-900 mb-6 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-6 w-6 text-[#ef4444] fill-[#ef4444]" }),
          "Vos erreurs (",
          errors.length,
          ")"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: errors.map((err, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-[#f6f6f8] p-6 border-l-4 border-[#ef4444] shadow-sm", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-[#135bec] mb-2", children: err.category }),
          /* @__PURE__ */ jsx("p", { className: "font-bold text-slate-900 text-lg mb-5", children: err.questionText }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3 mb-5", children: err.options.map((opt, oi) => {
            const isSelected = opt.trim() === err.selectedAnswer.trim();
            const isCorrect = opt.trim() === err.correctAnswer.trim();
            let cls = "border-slate-200 bg-white text-slate-600 ";
            if (isCorrect) cls = "border-green-200 bg-green-50 text-green-700 ring-1 ring-green-500";
            else if (isSelected) cls = "border-red-200 bg-red-50 text-red-600 ring-1 ring-red-500";
            return /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 p-4 rounded-xl border-2 text-sm font-bold ${cls} transition-colors`, children: [
              /* @__PURE__ */ jsx("span", { className: `w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${isCorrect ? "bg-green-100 " : isSelected ? "bg-red-100 " : "bg-slate-100 "}`, children: String.fromCharCode(65 + oi) }),
              opt,
              isCorrect && /* @__PURE__ */ jsx(Check, { className: "h-5 w-5 ml-auto text-green-600 ", strokeWidth: 3 }),
              isSelected && !isCorrect && /* @__PURE__ */ jsx(X, { className: "h-5 w-5 ml-auto text-red-500 ", strokeWidth: 3 })
            ] }, oi);
          }) }),
          err.explanation && /* @__PURE__ */ jsxs("p", { className: "text-sm text-[#135bec] bg-blue-50 rounded-xl p-4 border border-blue-100 font-medium", children: [
            "💡 ",
            err.explanation
          ] })
        ] }, idx)) })
      ] }) }),
      /* @__PURE__ */ jsxs("footer", { className: "my-8 text-center pb-8 border-t border-slate-200 pt-8", children: [
        /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm font-bold tracking-tight", children: "© 2026 GoCivique. Préparation citoyenne moderne." }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-center gap-8 mt-6", children: [
          /* @__PURE__ */ jsx("a", { className: "text-slate-400 hover:text-[#135bec] transition-colors text-[10px] uppercase tracking-[0.2em] font-black cursor-pointer", children: "Confidentialité" }),
          /* @__PURE__ */ jsx("a", { className: "text-slate-400 hover:text-[#135bec] transition-colors text-[10px] uppercase tracking-[0.2em] font-black cursor-pointer", children: "Conditions" }),
          /* @__PURE__ */ jsx("a", { className: "text-slate-400 hover:text-[#135bec] transition-colors text-[10px] uppercase tracking-[0.2em] font-black cursor-pointer", children: "Contact" })
        ] })
      ] })
    ] }) }),
    showGate && /* @__PURE__ */ jsx(SubscriptionGate, { open: showGate, onOpenChange: setShowGate, requiredTier: "premium" })
  ] });
}
export {
  Results as default
};
