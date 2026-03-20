import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { B as Button } from "./button-AT0XyJsk.js";
import { a as useAuth, u as useLanguage, s as supabase, c as cn } from "../main.mjs";
import { u as useUserProfile, G as GOAL_TO_LEVEL } from "./useUserProfile-BcVuiJUg.js";
import { g as getCorrectAnswerText, a as LANGUAGE_TO_DB, D as DB_CATEGORIES, b as getQuestionOptions, C as CATEGORY_LABELS } from "./types-CapR02YX.js";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { u as useParcours } from "./useParcours-C7eYJyqa.js";
import { B as Badge } from "./badge-DObGNgcP.js";
import { Loader2, X, Globe, Lock, Crown, ArrowRight, Flag, AlertTriangle, Send, CheckCircle, XCircle, Info, CircleDot, ChevronLeft, ChevronRight } from "lucide-react";
import { D as Dialog, a as DialogContent, S as SubscriptionGate } from "./SubscriptionGate-BJBE68cr.js";
import { toast } from "sonner";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { L as Logo } from "./Logo-RLfqH6ZW.js";
import "react-helmet-async";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "react-dom/client";
import "@supabase/supabase-js";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@radix-ui/react-dialog";
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const DEMO_QUESTIONS_PER_EXAM = 20;
const LANG_TO_XLSX = {
  ar: "/demo_questions%20ar.xlsx",
  en: "/demo_questions%20en-US.xlsx",
  es: "/demo_questions%20es-ES.xlsx",
  pt: "/demo_questions%20pt-PT.xlsx",
  tr: "/demo_questions%20tr.xlsx",
  zh: "/demo_questions%20zh-Hans.xlsx"
};
function rowToQuestion(cols, idx) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  return {
    id: idx + 9e3,
    question_text: ((_a = cols[0]) == null ? void 0 : _a.trim()) || "",
    option_a: ((_b = cols[1]) == null ? void 0 : _b.trim()) || "",
    option_b: ((_c = cols[2]) == null ? void 0 : _c.trim()) || "",
    option_c: ((_d = cols[3]) == null ? void 0 : _d.trim()) || "",
    option_d: ((_e = cols[4]) == null ? void 0 : _e.trim()) || "",
    correct_answer: ((_f = cols[5]) == null ? void 0 : _f.trim()) || "",
    explanation: ((_g = cols[6]) == null ? void 0 : _g.trim()) || "",
    language: ((_h = cols[7]) == null ? void 0 : _h.trim()) || "fr",
    category: ((_i = cols[8]) == null ? void 0 : _i.trim()) || "Principles and values of the Republic",
    subcategory: null,
    level: "CSP",
    question_translated: null,
    option_a_translated: null,
    option_b_translated: null,
    option_c_translated: null,
    option_d_translated: null
  };
}
async function parseDemoCSV() {
  const res = await fetch("/demo_questions.csv");
  const text = await res.text();
  const lines = text.trim().split("\n");
  return lines.slice(1).map((line, idx) => rowToQuestion(line.split(";"), idx));
}
async function parseDemoXLSX(url) {
  const XLSX = await import("xlsx");
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  return rows.slice(1).map((row, idx) => rowToQuestion(row.map(String), idx));
}
async function fetchDemoQuestionsFromCSV(lang = "fr") {
  const xlsxUrl = LANG_TO_XLSX[lang];
  if (!xlsxUrl) return parseDemoCSV();
  try {
    const questions = await parseDemoXLSX(xlsxUrl);
    if (questions.length > 0) return questions;
  } catch {
  }
  return parseDemoCSV();
}
function getQuestionLimit(mode, isMiniQuiz) {
  if (isMiniQuiz) return 5;
  switch (mode) {
    case "demo":
      return DEMO_QUESTIONS_PER_EXAM;
    case "exam":
      return 40;
    case "training":
      return 50;
    case "study":
      return 20;
    default:
      return 20;
  }
}
function useQuiz({
  category,
  level,
  mode = "exam",
  isMiniQuiz = false,
  questionLimit,
  retryKey = 0,
  classId,
  retakeIds
} = {}) {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { profile: userProfile } = useUserProfile();
  const resolvedLevel = level || ((userProfile == null ? void 0 : userProfile.goal_type) ? GOAL_TO_LEVEL[userProfile.goal_type] : "CSP");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shouldSaveAnswers = mode !== "demo";
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        if (retakeIds && retakeIds.length > 0) {
          const csvIds = retakeIds.filter((id) => id >= 9e3);
          const dbIds = retakeIds.filter((id) => id < 9e3);
          let retakeQuestions = [];
          if (csvIds.length > 0) {
            const allDemo = await fetchDemoQuestionsFromCSV("fr");
            const csvMatches = allDemo.filter((q) => csvIds.includes(q.id));
            retakeQuestions = [...retakeQuestions, ...csvMatches];
          }
          if (dbIds.length > 0) {
            const { data: dbRows } = await supabase.from("questions").select("*").in("id", dbIds);
            retakeQuestions = [...retakeQuestions, ...dbRows || []];
          }
          const idOrder = retakeIds;
          retakeQuestions.sort((a, b) => idOrder.indexOf(a.id) - idOrder.indexOf(b.id));
          setQuestions(retakeQuestions);
          setLoading(false);
          return;
        }
        if (classId) {
          const { data: qLinks } = await supabase.from("class_questions").select("question_id").eq("class_id", classId);
          let classQuestions = [];
          const classLimit = typeof questionLimit === "number" && questionLimit > 0 ? questionLimit : 5;
          if (qLinks && qLinks.length > 0) {
            const questionIds = qLinks.map((q) => q.question_id);
            const { data: rawQuestions } = await supabase.from("questions").select("*").in("id", questionIds);
            classQuestions = shuffle(rawQuestions || []).slice(0, classLimit);
          } else {
            const { data: classInfo } = await supabase.from("classes").select("class_number").eq("id", classId).maybeSingle();
            const classNum = (classInfo == null ? void 0 : classInfo.class_number) ?? 0;
            const getModuleCategory = (n) => {
              if (n <= 20) return "Principles and values of the Republic";
              if (n <= 40) return "Institutional and political system";
              if (n <= 60) return "Rights and duties";
              if (n <= 80) return "History, geography and culture";
              return "Living in French society";
            };
            const moduleCategory = getModuleCategory(classNum);
            const poolSize = Math.min(classLimit * 6, 120);
            const { data: poolQuestions, error: poolErr } = await supabase.from("questions").select("*").eq("category", moduleCategory).eq("language", "fr").limit(poolSize);
            if (poolErr) throw poolErr;
            classQuestions = shuffle(poolQuestions || []).slice(0, classLimit);
          }
          setQuestions(classQuestions);
          setLoading(false);
          return;
        }
        if (mode === "demo") {
          const dbLang2 = LANGUAGE_TO_DB[language] || "fr";
          const allDemo = await fetchDemoQuestionsFromCSV(dbLang2);
          const picked = shuffle(allDemo).slice(0, DEMO_QUESTIONS_PER_EXAM);
          setQuestions(picked);
          setLoading(false);
          return;
        }
        let dbLang = LANGUAGE_TO_DB[language] || "fr";
        if (user) {
          const { data: profile } = await supabase.from("profiles").select("preferred_language").eq("id", user.id).maybeSingle();
          if (profile == null ? void 0 : profile.preferred_language) {
            dbLang = profile.preferred_language;
          }
        }
        const modeLimit = getQuestionLimit(mode, isMiniQuiz);
        const resolvedLimit = typeof questionLimit === "number" && Number.isFinite(questionLimit) && questionLimit > 0 ? questionLimit : modeLimit;
        const resolveLevelsToFetch = (targetLevel) => {
          if (targetLevel === "Naturalisation") return ["Naturalisation", "CR", "CSP"];
          if (targetLevel === "CR") return ["CR", "CSP"];
          return ["CSP"];
        };
        const fetchWithLevelFallback = async (baseQuery, levelVal, limit) => {
          const allowedLevels = resolveLevelsToFetch(levelVal);
          const { data, error: err } = await baseQuery().in("level", allowedLevels).limit(limit);
          if (err) throw err;
          if (data && data.length > 0) return data;
          const { data: fallback, error: err2 } = await baseQuery().limit(limit);
          if (err2) throw err2;
          return fallback || [];
        };
        let allQuestions = [];
        if (mode === "exam" && !category) {
          const cats = [...DB_CATEGORIES];
          const perCat = Math.floor(resolvedLimit / cats.length);
          let remainder = resolvedLimit - perCat * cats.length;
          const fetches = cats.map(async (cat) => {
            const count = perCat + (remainder-- > 0 ? 1 : 0);
            const pool = Math.min(count * 4, 100);
            const baseQ = () => supabase.from("questions").select("*").eq("language", dbLang).eq("category", cat);
            const data = await fetchWithLevelFallback(baseQ, resolvedLevel, pool);
            return shuffle(data).slice(0, count);
          });
          const results = await Promise.all(fetches);
          const seen = /* @__PURE__ */ new Set();
          allQuestions = shuffle(results.flat()).filter((q) => {
            if (seen.has(q.id)) return false;
            seen.add(q.id);
            return true;
          });
        } else {
          const fetchSize = Math.min(resolvedLimit * 4, 500);
          const baseQ = () => {
            let q = supabase.from("questions").select("*").eq("language", dbLang);
            if (category) q = q.eq("category", category);
            return q;
          };
          const data = await fetchWithLevelFallback(baseQ, resolvedLevel, fetchSize);
          allQuestions = shuffle(data).slice(0, resolvedLimit);
        }
        setQuestions(allQuestions);
      } catch (e) {
        console.error("Error fetching questions:", e);
        setError(e.message || "Failed to load questions");
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [category, user, resolvedLevel, mode, isMiniQuiz, questionLimit, retryKey, classId, retakeIds == null ? void 0 : retakeIds.join(",")]);
  const saveAnswer = useCallback(
    async (question, selectedAnswer) => {
      if (!user || !shouldSaveAnswers) return;
      const correctText = getCorrectAnswerText(question);
      const isCorrect = selectedAnswer === correctText;
      await supabase.from("user_answers").insert({
        user_id: user.id,
        question_id: question.id,
        selected_answer: selectedAnswer,
        is_correct: isCorrect,
        category: question.category
      });
    },
    [user, shouldSaveAnswers]
  );
  return {
    questions,
    loading,
    error,
    saveAnswer,
    isMiniQuiz: !!isMiniQuiz,
    mode,
    shouldSaveAnswers
  };
}
function TranslateButton({ questionId, onTranslated, allowFree = false }) {
  const { isPremium } = useSubscription();
  const canTranslate = isPremium || allowFree;
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [shown, setShown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const prevLangRef = useRef(language);
  useEffect(() => {
    setShown(false);
  }, [questionId]);
  useEffect(() => {
    if (language === prevLangRef.current) return;
    prevLangRef.current = language;
    if (!shown || !canTranslate) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const { data, error } = await supabase.from("question_translations").select("*").eq("question_id", questionId).eq("language", language).single();
        if (cancelled) return;
        if (error) {
          console.error("Translation fetch error", error);
          toast.error("Traduction indisponible pour cette langue.");
          setShown(false);
          onTranslated(null);
        } else if (data) {
          onTranslated(data);
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setShown(false);
          onTranslated(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [language, shown, canTranslate, questionId, onTranslated]);
  async function handleClick() {
    if (!canTranslate) {
      setShowPopup(true);
      return;
    }
    if (shown) {
      setShown(false);
      onTranslated(null);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from("question_translations").select("*").eq("question_id", questionId).eq("language", language).single();
      if (error) {
        console.error("Translation fetch error", error);
        toast.error("Traduction indisponible pour le moment.");
      } else if (data) {
        setShown(true);
        onTranslated(data);
      }
    } catch (e) {
      console.error(e);
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }
  const handleSubscribe = async () => {
    if (!user) {
      setShowPopup(false);
      navigate("/auth");
      return;
    }
    setIsProcessing(true);
    try {
      localStorage.setItem("pending_subscription_tier", "premium");
      const premiumLink = "https://buy.stripe.com/cNiaEZ9QRcHz44i1gR6EU01";
      const url = new URL(premiumLink);
      url.searchParams.set("client_reference_id", user.id);
      if (user.email) {
        url.searchParams.set("prefilled_email", user.email);
      }
      window.location.href = url.toString();
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'activation de l'abonnement");
      setIsProcessing(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2", children: /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: handleClick,
        variant: "outline",
        size: "sm",
        className: "gap-2 self-start",
        disabled: loading,
        children: [
          loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : shown ? /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
          shown ? "Masquer la traduction" : "Traduire",
          !canTranslate && /* @__PURE__ */ jsx("span", { className: "ml-1 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-600", children: "Premium" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(Dialog, { open: showPopup, onOpenChange: setShowPopup, children: /* @__PURE__ */ jsxs(DialogContent, { className: "p-0 sm:max-w-[440px] bg-white border-0 rounded-3xl shadow-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowPopup(false),
          className: "absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-white/80 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-colors",
          "aria-label": "Fermer",
          children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "relative bg-gradient-to-br from-[#0055A4] via-[#1B6ED6] to-[#0055A4] px-8 pt-10 pb-8 text-center overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -top-6 -left-6 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-8 w-16 h-16 bg-[#EF4135]/10 rounded-full blur-xl pointer-events-none" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative mx-auto mb-5 w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20",
            style: { animation: "subFloat 4s ease-in-out infinite" },
            children: [
              /* @__PURE__ */ jsx(Globe, { className: "w-10 h-10 text-white" }),
              /* @__PURE__ */ jsx("div", { className: "absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-md border-2 border-white", children: /* @__PURE__ */ jsx(Lock, { className: "w-3.5 h-3.5 text-white" }) })
            ]
          }
        ),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white mb-2", children: "Besoin d'aide avec le français ?" }),
        /* @__PURE__ */ jsx("p", { className: "text-white/70 text-sm max-w-[300px] mx-auto leading-relaxed", children: "Traduisez instantanément chaque question dans votre langue maternelle." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "px-8 py-6", children: [
        /* @__PURE__ */ jsx("div", { className: "space-y-3 mb-4", children: [
          { icon: Globe, text: "Traduction instantanée de toutes les questions" },
          { icon: Crown, text: "Accès à toutes les fonctionnalités Premium" }
        ].map(({ icon: Icon, text }, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-lg bg-[#0055A4]/10 flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { className: "w-4 h-4 text-[#0055A4]" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-700 font-medium", children: text })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "mb-5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2", children: "Langues disponibles" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: ["🇬🇧 Anglais", "🇸🇦 Arabe", "🇪🇸 Espagnol", "🇧🇷 Portugais", "🇨🇳 Chinois"].map((lang) => /* @__PURE__ */ jsx("span", { className: "text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium", children: lang }, lang)) })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            disabled: isProcessing,
            onClick: handleSubscribe,
            className: "w-full bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] hover:from-[#003F7F] hover:to-[#0055A4] text-white font-bold rounded-xl h-12 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] text-base gap-2",
            children: isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Crown, { className: "w-5 h-5 text-amber-300" }),
              "Passer au forfait Premium",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-center text-xs text-slate-400 mt-3", children: "Annulation libre · Sans engagement" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes subFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      ` })
  ] });
}
function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  showFeedback,
  showTranslateButton = false,
  allowFreeTranslate = false
}) {
  var _a;
  const { language, setLanguage } = useLanguage();
  const [translatedData, setTranslatedData] = useState(null);
  const baseOptions = getQuestionOptions(question);
  const displayOptions = translatedData ? [translatedData.option_a, translatedData.option_b, translatedData.option_c, translatedData.option_d].filter(Boolean) : baseOptions;
  const correctAnswerText = getCorrectAnswerText(question);
  const isCorrect = selectedAnswer === correctAnswerText;
  const hasAnswered = selectedAnswer !== void 0;
  const soundPlayed = useRef(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const { user } = useAuth();
  const categoryLabel = ((_a = CATEGORY_LABELS[language]) == null ? void 0 : _a[question.category]) || question.category;
  useEffect(() => {
    if (showFeedback && hasAnswered && !soundPlayed.current) {
      soundPlayed.current = true;
    }
  }, [showFeedback, hasAnswered, isCorrect]);
  useEffect(() => {
    soundPlayed.current = false;
    setTranslatedData(null);
  }, [question.id]);
  return /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: "text-sm border-border/50", children: [
        "Question ",
        questionNumber,
        " sur ",
        totalQuestions
      ] }),
      /* @__PURE__ */ jsx(Badge, { variant: "secondary", children: categoryLabel })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-4 text-xl font-bold text-foreground md:text-2xl", children: (translatedData == null ? void 0 : translatedData.question_text) || question.question_text }),
      showTranslateButton && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-wrap mt-3", children: [
        /* @__PURE__ */ jsx(
          TranslateButton,
          {
            questionId: question.id,
            onTranslated: setTranslatedData,
            allowFree: allowFreeTranslate
          }
        ),
        /* @__PURE__ */ jsxs(
          "select",
          {
            value: language,
            onChange: (e) => setLanguage(e.target.value),
            className: "text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 cursor-pointer hover:border-[#0055A4] focus:outline-none focus:ring-1 focus:ring-[#0055A4] transition-colors",
            "aria-label": "Langue",
            children: [
              /* @__PURE__ */ jsx("option", { value: "fr", children: "🇫🇷 Français" }),
              /* @__PURE__ */ jsx("option", { value: "en", children: "🇬🇧 English" }),
              /* @__PURE__ */ jsx("option", { value: "ar", children: "🇸🇦 العربية" }),
              /* @__PURE__ */ jsx("option", { value: "es", children: "🇪🇸 Español" }),
              /* @__PURE__ */ jsx("option", { value: "pt", children: "🇧🇷 Português" }),
              /* @__PURE__ */ jsx("option", { value: "zh", children: "🇨🇳 中文" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-2", children: !showReportForm ? /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowReportForm(true),
          className: "inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-orange-500 transition-colors font-medium",
          children: [
            /* @__PURE__ */ jsx(Flag, { className: "h-3.5 w-3.5" }),
            "Signaler un problème"
          ]
        }
      ) : /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-orange-200 bg-orange-50/50 p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm font-semibold text-slate-700", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4 text-orange-500" }),
          "Signaler cette question"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: [
          { value: "typo", label: "Faute de frappe" },
          { value: "wrong_answer", label: "Réponse incorrecte" },
          { value: "unclear", label: "Question floue" },
          { value: "other", label: "Autre problème" }
        ].map((opt) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setReportReason(opt.value),
            className: `text-xs font-medium px-3 py-2 rounded-lg border transition-all ${reportReason === opt.value ? "border-orange-400 bg-orange-100 text-orange-700" : "border-slate-200 bg-white text-slate-600 hover:border-orange-300"}`,
            children: opt.label
          },
          opt.value
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              variant: "ghost",
              className: "text-xs",
              onClick: () => {
                setShowReportForm(false);
                setReportReason("");
              },
              children: "Annuler"
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              size: "sm",
              className: "text-xs bg-orange-500 hover:bg-orange-600 text-white gap-1.5",
              disabled: !reportReason || isSubmittingReport,
              onClick: async () => {
                setIsSubmittingReport(true);
                try {
                  const { error } = await supabase.functions.invoke("send-email", {
                    body: {
                      type: "report",
                      data: {
                        questionId: question.id,
                        questionText: question.question_text,
                        reason: reportReason,
                        userId: user == null ? void 0 : user.id
                      }
                    }
                  });
                  if (error) throw error;
                  toast.success("Merci pour votre signalement ! Notre équipe va vérifier cette question.");
                  setShowReportForm(false);
                  setReportReason("");
                } catch (err) {
                  console.error("Error reporting question:", err);
                  toast.error("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
                } finally {
                  setIsSubmittingReport(false);
                }
              },
              children: [
                /* @__PURE__ */ jsx(Send, { className: "h-3 w-3" }),
                isSubmittingReport ? "Envoi..." : "Envoyer"
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: baseOptions.map((option, index) => {
      const isSelected = selectedAnswer === option;
      const isCorrectOption = option === correctAnswerText;
      const showCorrectHighlight = showFeedback && hasAnswered && isCorrectOption;
      const showIncorrectHighlight = showFeedback && isSelected && !isCorrect;
      const displayText = displayOptions[index] || option;
      return /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onAnswer(option),
          disabled: showFeedback && hasAnswered,
          className: `glass-card flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-all ${showCorrectHighlight ? "heartbeat border-primary/50" : showIncorrectHighlight ? "glitch border-destructive/50" : isSelected ? "border-primary/50 bg-primary/5" : "border-border/30 hover:border-primary/30 hover:bg-primary/5"}`,
          style: showCorrectHighlight ? { boxShadow: "0 0 25px -5px hsl(var(--success) / 0.4)" } : showIncorrectHighlight ? { boxShadow: "0 0 25px -5px hsl(var(--destructive) / 0.4)" } : void 0,
          children: [
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${showCorrectHighlight ? "border-primary bg-primary text-primary-foreground" : showIncorrectHighlight ? "border-destructive bg-destructive text-destructive-foreground" : isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border/50 text-muted-foreground"}`,
                children: String.fromCharCode(65 + index)
              }
            ),
            /* @__PURE__ */ jsx("span", { className: `text-base ${isSelected ? "font-medium text-foreground" : "text-foreground"}`, children: displayText }),
            showCorrectHighlight && /* @__PURE__ */ jsx(CheckCircle, { className: "ml-auto h-5 w-5 text-primary" }),
            showIncorrectHighlight && /* @__PURE__ */ jsx(XCircle, { className: "ml-auto h-5 w-5 text-destructive" })
          ]
        },
        index
      );
    }) }),
    showFeedback && hasAnswered && ((translatedData == null ? void 0 : translatedData.explanation) || question.explanation) && /* @__PURE__ */ jsxs(
      "div",
      {
        className: `mt-6 glass-card p-4 ${isCorrect ? "shadow-[0_0_20px_hsl(var(--success)/0.15)]" : "shadow-[0_0_20px_hsl(var(--destructive)/0.15)]"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
            isCorrect ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-primary" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5 text-destructive" }),
            /* @__PURE__ */ jsx("span", { className: `font-bold ${isCorrect ? "text-primary" : "text-destructive"}`, children: isCorrect ? "Bonne réponse !" : "Mauvaise réponse" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground", children: (translatedData == null ? void 0 : translatedData.explanation) || question.explanation })
          ] })
        ]
      }
    )
  ] });
}
function ExamNavigator({
  totalQuestions,
  currentIndex,
  answers,
  questionIds,
  flagged,
  onJump
}) {
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flagged.size;
  const remainingCount = totalQuestions - answeredCount;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border/60 bg-card p-3 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1", children: "Answered" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-extrabold text-foreground", children: String(answeredCount).padStart(2, "0") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border/60 bg-card p-3 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1", children: "Flagged" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-extrabold text-[#EF4135]", children: String(flaggedCount).padStart(2, "0") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border/60 bg-card p-3 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1", children: "Remaining" }),
        /* @__PURE__ */ jsx("p", { className: "text-2xl font-extrabold text-foreground", children: String(remainingCount).padStart(2, "0") })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-sm font-bold text-foreground mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(CircleDot, { className: "h-4 w-4 text-primary" }),
        "Exam Navigator"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-2", children: questionIds.map((qId, idx) => {
        const isCurrent = idx === currentIndex;
        const isAnswered = answers[qId] !== void 0;
        const isFlagged = flagged.has(qId);
        let bgClass = "bg-card text-muted-foreground border-border/60 hover:border-primary/40";
        if (isCurrent) {
          bgClass = "bg-primary text-primary-foreground border-primary shadow-md";
        } else if (isFlagged) {
          bgClass = "bg-card text-[#EF4135] border-[#EF4135]/50";
        } else if (isAnswered) {
          bgClass = "bg-card text-primary border-primary/40";
        }
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onJump(idx),
            className: `relative h-10 w-full rounded-lg border-2 text-xs font-bold transition-all duration-200 hover:scale-105 ${bgClass}`,
            children: [
              String(idx + 1).padStart(2, "0"),
              isFlagged && !isCurrent && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#EF4135] rounded-full border border-white" })
            ]
          },
          idx
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-sm bg-primary" }),
        "Current"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-sm border-2 border-primary/40" }),
        "Answered"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-sm border-2 border-[#EF4135]/50 relative", children: /* @__PURE__ */ jsx("span", { className: "absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#EF4135] rounded-full" }) }),
        "Flagged"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-3 h-3 rounded-sm border-2 border-border/60" }),
        "Unvisited"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-blue-50 border border-blue-100 p-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5", children: "💡 Study Tip" }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 leading-relaxed", children: "Take deep breaths and read each question carefully. Flag questions you're unsure about and come back to them at the end." })
    ] })
  ] });
}
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    "aria-label": props["aria-label"] || "Progress",
    className: cn("relative h-4 w-full overflow-hidden rounded-full bg-[hsl(220,25,92)]", className),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-[hsl(192,31,58)] transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
const QUIZ_TIME = 45 * 60;
function Quiz() {
  const [searchParams] = useSearchParams();
  const rawMode = searchParams.get("mode") || "exam";
  const categoryParam = searchParams.get("category");
  const levelParam = searchParams.get("level") || "CSP";
  const isMiniQuiz = searchParams.get("mini") === "1";
  const limitParam = searchParams.get("limit");
  const questionLimit = limitParam && Number.isFinite(Number(limitParam)) && Number(limitParam) > 0 ? Number(limitParam) : void 0;
  const classIdParam = searchParams.get("classId");
  const isRetake = searchParams.get("retake") === "1";
  const [retakeIds] = useState(() => {
    if (!isRetake || typeof window === "undefined") return null;
    const stored = window.sessionStorage.getItem("retakeQuestionIds");
    window.sessionStorage.removeItem("retakeQuestionIds");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { tier, isStandardOrAbove, isPremium, loading: tierLoading } = useSubscription();
  const isFreeUser = tier === "free";
  const { user } = useAuth();
  const { updateProgress: updateClassProgress } = useParcours();
  const [examsTakenToday, setExamsTakenToday] = useState(null);
  useEffect(() => {
    if (!user) {
      setExamsTakenToday(0);
      return;
    }
    const fetchExams = async () => {
      const { data } = await supabase.from("profiles").select("exam_history").eq("id", user.id).maybeSingle();
      if (data == null ? void 0 : data.exam_history) {
        const history = data.exam_history;
        const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
        const count = history.filter((e) => {
          var _a;
          return (_a = e.date) == null ? void 0 : _a.startsWith(today);
        }).length;
        setExamsTakenToday(count);
      } else {
        setExamsTakenToday(0);
      }
    };
    fetchExams();
  }, [user]);
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState("standard");
  useEffect(() => {
    if (tierLoading || examsTakenToday === null) return;
    if (isPremium) return;
    if (isFreeUser && rawMode !== "demo" && rawMode !== "exam" && !classIdParam) {
      setGateTier("standard");
      setShowGate(true);
    } else if (isFreeUser && (rawMode === "exam" || rawMode === "demo") && examsTakenToday >= 1) {
      setGateTier("standard");
      setShowGate(true);
    } else if (isStandardOrAbove && !isPremium && rawMode === "study") {
      setGateTier("premium");
      setShowGate(true);
    }
  }, [tierLoading, isFreeUser, isStandardOrAbove, isPremium, rawMode, examsTakenToday]);
  const effectiveMode = rawMode;
  const [retryKey, setRetryKey] = useState(0);
  useEffect(() => {
    if (!isRetake) {
      sessionStorage.removeItem("quizResults");
      sessionStorage.removeItem("quizErrors");
      sessionStorage.removeItem("quizQuestionIds");
      sessionStorage.removeItem("quizMode");
    }
  }, []);
  const { questions, loading, saveAnswer } = useQuiz({
    category: categoryParam || void 0,
    level: levelParam,
    isMiniQuiz,
    mode: effectiveMode,
    questionLimit,
    retryKey,
    classId: classIdParam || void 0,
    retakeIds: retakeIds || void 0
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(/* @__PURE__ */ new Set());
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_TIME);
  const [startTime, setStartTime] = useState(Date.now());
  const prevQuestionSetKey = useRef("");
  const questionSetKey = questions.map((q) => q.id).join(",");
  useEffect(() => {
    if (questionSetKey === "" || questionSetKey === prevQuestionSetKey.current) return;
    if (prevQuestionSetKey.current !== "") {
      setAnswers({});
      setCurrentIndex(0);
      setFlagged(/* @__PURE__ */ new Set());
      setTimeRemaining(QUIZ_TIME);
      setStartTime(Date.now());
    }
    prevQuestionSetKey.current = questionSetKey;
  }, [questionSetKey]);
  const [warpState, setWarpState] = useState("idle");
  const pendingIndex = useRef(null);
  const [showResults, setShowResults] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [resultErrors, setResultErrors] = useState([]);
  useEffect(() => {
    if (effectiveMode !== "exam" || isMiniQuiz) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1e3);
    return () => clearInterval(interval);
  }, [effectiveMode, isMiniQuiz]);
  const handleAnswer = (answer) => {
    const question = questions[currentIndex];
    if (!question) return;
    setAnswers((prev) => ({ ...prev, [question.id]: answer }));
    saveAnswer(question, answer);
  };
  const toggleFlag = () => {
    var _a;
    const qId = (_a = questions[currentIndex]) == null ? void 0 : _a.id;
    if (qId === void 0) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };
  const warpTo = (newIndex) => {
    if (newIndex === currentIndex || warpState !== "idle") return;
    pendingIndex.current = newIndex;
    setWarpState("exit");
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setWarpState("enter");
      setTimeout(() => setWarpState("idle"), 250);
    }, 200);
  };
  const handleFinish = useCallback(() => {
    var _a;
    const timeSpent = Math.floor((Date.now() - startTime) / 1e3);
    const results = questions.map((q) => ({
      questionId: q.id,
      category: q.category,
      correct: answers[q.id] === getCorrectAnswerText(q),
      selectedAnswer: answers[q.id],
      correctAnswer: q.correct_answer
    }));
    const score = results.filter((r) => r.correct).length;
    const answeredTotal = results.filter((r) => r.selectedAnswer !== void 0).length;
    const unansweredCount = questions.length - answeredTotal;
    const categoryBreakdown = {};
    results.forEach((r) => {
      if (!categoryBreakdown[r.category]) {
        categoryBreakdown[r.category] = { correct: 0, total: 0 };
      }
      categoryBreakdown[r.category].total++;
      if (r.correct) categoryBreakdown[r.category].correct++;
    });
    const resultPayload = {
      id: ((_a = crypto.randomUUID) == null ? void 0 : _a.call(crypto)) || String(Date.now()),
      date: (/* @__PURE__ */ new Date()).toISOString(),
      score,
      totalQuestions: questions.length,
      answeredCount: answeredTotal,
      unansweredCount,
      passed: score / questions.length >= 0.8,
      timeSpent,
      categoryBreakdown
    };
    const quizErrors = results.filter((r) => !r.correct && r.selectedAnswer !== void 0).map((r) => {
      const q = questions.find((qq) => qq.id === r.questionId);
      return {
        questionText: q.question_text,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        selectedAnswer: r.selectedAnswer || "—",
        correctAnswer: getCorrectAnswerText(q),
        category: r.category,
        explanation: q.explanation || ""
      };
    });
    sessionStorage.setItem("quizResults", JSON.stringify(resultPayload));
    sessionStorage.setItem("quizErrors", JSON.stringify(quizErrors));
    sessionStorage.setItem("quizQuestionIds", JSON.stringify(questions.map((q) => q.id)));
    sessionStorage.setItem("quizMode", rawMode);
    if (user) {
      (async () => {
        try {
          const { data: profileData } = await supabase.from("profiles").select("exam_history").eq("id", user.id).maybeSingle();
          const existingHistory = Array.isArray(profileData == null ? void 0 : profileData.exam_history) ? profileData.exam_history : [];
          const newEntry = {
            date: (/* @__PURE__ */ new Date()).toISOString(),
            score,
            totalQuestions: questions.length,
            passed: score / questions.length >= 0.8,
            category: categoryParam || void 0,
            mode: rawMode,
            classId: classIdParam || void 0
          };
          await supabase.from("profiles").update({
            exam_history: [...existingHistory, newEntry]
          }).eq("id", user.id);
        } catch (e) {
          console.error(e);
        }
      })();
    }
    if (classIdParam) {
      sessionStorage.setItem("quizClassId", classIdParam);
      const percent = Math.round(score / questions.length * 100);
      const passed = score / questions.length >= 0.7;
      updateClassProgress(classIdParam, percent, passed).catch(console.error);
      if (user && passed) {
        const newIds = questions.map((q) => String(q.id));
        supabase.from("profiles").select("used_questions").eq("id", user.id).maybeSingle().then(({ data: profileData }) => {
          const existing = (profileData == null ? void 0 : profileData.used_questions) || [];
          const merged = [.../* @__PURE__ */ new Set([...existing, ...newIds])];
          supabase.from("profiles").update({ used_questions: merged }).eq("id", user.id);
        });
      }
    } else {
      sessionStorage.removeItem("quizClassId");
    }
    navigate("/results");
  }, [answers, questions, startTime, classIdParam, updateClassProgress, user, rawMode, navigate]);
  useCallback(() => {
    sessionStorage.removeItem("quizResults");
    sessionStorage.removeItem("quizErrors");
    setShowResults(false);
    setResultData(null);
    setResultErrors([]);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(/* @__PURE__ */ new Set());
    setTimeRemaining(QUIZ_TIME);
    setStartTime(Date.now());
    setRetryKey((prev) => prev + 1);
  }, []);
  useCallback(() => {
    sessionStorage.removeItem("quizResults");
    sessionStorage.removeItem("quizErrors");
    navigate("/");
  }, [navigate]);
  if (loading || tierLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-50 bg-white border-b border-slate-200 h-14 flex items-center px-4", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/learn"), className: "text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium", children: [
        /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
        " Quitter"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "container flex items-center justify-center py-20", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Chargement des questions..." })
      ] }) })
    ] });
  }
  if (questions.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-50 bg-white border-b border-slate-200 h-14 flex items-center px-4", children: /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/learn"), className: "text-slate-500 hover:text-slate-800 flex items-center gap-2 text-sm font-medium", children: [
        /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
        " Quitter"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "container flex flex-col items-center justify-center py-20 gap-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground", children: "Aucune question disponible." }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => navigate("/"), children: "Retour à l'accueil" })
      ] })
    ] });
  }
  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const showFeedback = effectiveMode === "study" || effectiveMode === "training" || !!classIdParam;
  const progressPercent = (currentIndex + 1) / questions.length * 100;
  const completedPercent = Math.round(answeredCount / questions.length * 100);
  const timerMinutes = Math.floor(timeRemaining / 60);
  const timerSeconds = timeRemaining % 60;
  const modeLabel = classIdParam ? t("quiz.parcours") : effectiveMode === "exam" ? t("quiz.exam") : effectiveMode === "demo" ? t("quiz.demo") : effectiveMode === "study" ? t("quiz.study") : t("quiz.training");
  const isFlaggedCurrent = flagged.has(currentQuestion.id);
  const flaggedCount = flagged.size;
  const remainingCount = questions.length - answeredCount;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        titleKey: "seo.quizTitle",
        descriptionKey: "seo.quizDesc",
        path: "/quiz"
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-50 bg-white border-b border-[#E6EAF0] shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2.5 px-3 sm:py-3 sm:px-4 md:px-6 max-w-7xl mx-auto w-full", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3 min-w-0", children: [
        /* @__PURE__ */ jsx(Logo, { size: "sm" }),
        /* @__PURE__ */ jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsx("p", { className: "text-[10px] sm:text-xs text-slate-400 truncate", children: modeLabel }) })
      ] }),
      effectiveMode === "exam" && !isMiniQuiz && /* @__PURE__ */ jsxs("div", { className: "text-center mx-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 hidden sm:block", children: "Temps restant" }),
        /* @__PURE__ */ jsxs("p", { className: "text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight tabular-nums text-slate-900", children: [
          String(timerMinutes).padStart(2, "0"),
          ":",
          String(timerSeconds).padStart(2, "0")
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "secondary",
          size: "sm",
          onClick: handleFinish,
          className: "gap-1.5 sm:gap-2 rounded-full bg-[#0055A4] text-white font-bold hover:bg-[#1B6ED6] px-3 sm:px-5 text-xs sm:text-sm shrink-0",
          children: [
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: t("quiz.finishExam") }),
            /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: t("quiz.finish") }),
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-3.5 w-3.5 sm:h-4 sm:w-4" })
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 w-full max-w-7xl mx-auto py-4 sm:py-6 px-3 sm:px-4 md:px-6", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-6 items-start", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-3 sm:p-4 mb-4 sm:mb-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm font-bold text-foreground", children: [
              "Question ",
              /* @__PURE__ */ jsx("span", { className: "text-primary", children: currentIndex + 1 }),
              " sur ",
              questions.length
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-xs sm:text-sm font-bold text-primary", children: [
              completedPercent,
              "% Complété"
            ] })
          ] }),
          /* @__PURE__ */ jsx(Progress, { value: progressPercent, className: "h-1.5 sm:h-2" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6", children: [
          /* @__PURE__ */ jsx("div", { className: "hidden sm:flex justify-end mb-4", children: /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: toggleFlag,
              className: `flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${isFlaggedCurrent ? "text-[#EF4135]" : "text-muted-foreground hover:text-[#EF4135]"}`,
              children: [
                /* @__PURE__ */ jsx(Flag, { className: `h-3.5 w-3.5 ${isFlaggedCurrent ? "fill-current" : ""}` }),
                isFlaggedCurrent ? "Marquée" : "Marquer pour révision"
              ]
            }
          ) }),
          /* @__PURE__ */ jsx("div", { className: warpState === "exit" ? "warp-exit" : warpState === "enter" ? "warp-enter" : "", children: /* @__PURE__ */ jsx(
            QuizQuestion,
            {
              question: currentQuestion,
              questionNumber: currentIndex + 1,
              totalQuestions: questions.length,
              selectedAnswer: answers[currentQuestion.id],
              onAnswer: handleAnswer,
              showFeedback,
              showTranslateButton: true,
              allowFreeTranslate: effectiveMode === "demo"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "sm:hidden mb-3", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: toggleFlag,
            className: `w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-bold text-sm uppercase tracking-widest transition-all ${isFlaggedCurrent ? "border-[#EF4135] bg-red-50 text-[#EF4135]" : "border-border/60 bg-card text-muted-foreground hover:border-[#EF4135] hover:text-[#EF4135]"}`,
            children: [
              /* @__PURE__ */ jsx(Flag, { className: `h-4 w-4 ${isFlaggedCurrent ? "fill-current" : ""}` }),
              isFlaggedCurrent ? "🚩 Marquée" : "🏳️ Marquer la question"
            ]
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 sm:gap-3", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => warpTo(Math.max(0, currentIndex - 1)),
              disabled: currentIndex === 0,
              className: "gap-1 sm:gap-2 text-xs sm:text-sm px-3 sm:px-4 h-10 sm:h-11 rounded-xl",
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Question précédente" }),
                /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Précédent" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              onClick: () => warpTo(Math.min(questions.length - 1, currentIndex + 1)),
              disabled: currentIndex === questions.length - 1,
              className: "gap-1 sm:gap-2 text-muted-foreground text-xs sm:text-sm h-10 sm:h-11",
              children: "Passer"
            }
          ),
          currentIndex === questions.length - 1 ? /* @__PURE__ */ jsxs(Button, { onClick: handleFinish, className: "gap-1 sm:gap-2 btn-glow text-xs sm:text-sm px-4 sm:px-6 h-10 sm:h-11 rounded-xl", children: [
            t("quiz.finishExam"),
            /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" })
          ] }) : /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: () => warpTo(Math.min(questions.length - 1, currentIndex + 1)),
              className: "gap-1 sm:gap-2 btn-glow text-xs sm:text-sm px-4 sm:px-6 h-10 sm:h-11 rounded-xl",
              children: [
                /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Enregistrer &" }),
                " Suivant",
                /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:hidden mt-5 space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2 sm:gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border/60 bg-card p-3 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5", children: "Répondu" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-2xl font-extrabold text-foreground", children: String(answeredCount).padStart(2, "0") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border/60 bg-card p-3 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5", children: "Marqué" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-2xl font-extrabold text-[#EF4135]", children: String(flaggedCount).padStart(2, "0") })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border/60 bg-card p-3 text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5", children: "Restant" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl sm:text-2xl font-extrabold text-foreground", children: String(remainingCount).padStart(2, "0") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border/60 bg-card p-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xs font-bold text-foreground mb-3 uppercase tracking-widest", children: "Navigation" }),
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-5 gap-1.5", children: questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = answers[q.id] !== void 0;
              const isFlagged = flagged.has(q.id);
              let cls = "bg-muted/50 text-muted-foreground border-transparent";
              if (isCurrent) cls = "bg-primary text-primary-foreground border-primary shadow-md";
              else if (isFlagged) cls = "bg-card text-[#EF4135] border-[#EF4135]/50";
              else if (isAnswered) cls = "bg-card text-primary border-primary/40";
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => warpTo(idx),
                  className: `relative h-9 rounded-lg border-2 text-[11px] font-bold transition-all ${cls}`,
                  children: [
                    String(idx + 1).padStart(2, "0"),
                    isFlagged && !isCurrent && /* @__PURE__ */ jsx("span", { className: "absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#EF4135] rounded-full border border-white" })
                  ]
                },
                q.id
              );
            }) }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-1.5 mt-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-primary" }),
                " Actuelle"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-sm border-2 border-primary/40" }),
                " Répondu"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-sm border-2 border-[#EF4135]/50 relative", children: /* @__PURE__ */ jsx("span", { className: "absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#EF4135] rounded-full" }) }),
                "Marquée"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx("span", { className: "w-2.5 h-2.5 rounded-sm bg-muted/50" }),
                " Non visité"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-20", children: /* @__PURE__ */ jsx(
        ExamNavigator,
        {
          totalQuestions: questions.length,
          currentIndex,
          answers,
          questionIds: questions.map((q) => q.id),
          flagged,
          onJump: warpTo
        }
      ) })
    ] }) }),
    /* @__PURE__ */ jsx(
      SubscriptionGate,
      {
        open: showGate,
        onOpenChange: (open) => {
          setShowGate(open);
          if (!open) navigate(-1);
        },
        requiredTier: gateTier,
        featureLabel: gateTier === "premium" ? "Entraînement par catégorie" : "Examens illimités"
      }
    )
  ] });
}
export {
  Quiz as default
};
