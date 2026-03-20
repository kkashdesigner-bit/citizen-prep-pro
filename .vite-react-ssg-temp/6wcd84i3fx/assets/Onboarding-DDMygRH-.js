import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { B as Button } from "./button-AT0XyJsk.js";
import { L as Label, I as Input } from "./label-CpX0ua28.js";
import { a as useAuth, s as supabase } from "../main.mjs";
import { u as useUserProfile } from "./useUserProfile-BcVuiJUg.js";
import { ChevronLeft, Flag, Crosshair, BarChart3, Zap, ArrowRight, User, Check, CalendarDays, HelpCircle, PartyPopper, Landmark, CreditCard, ClipboardList, Sprout, BookOpen, GraduationCap, Target, Clock, ShieldQuestion } from "lucide-react";
import { L as Logo } from "./Logo-RLfqH6ZW.js";
import "react-helmet-async";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-label";
import "react-dom/client";
import "@supabase/supabase-js";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
const TOTAL_STEPS = 7;
const AVATARS = Array.from({ length: 8 }, (_, i) => `/examen-civique-avatar-${i + 1}.webp`);
function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useUserProfile();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    first_name: "",
    avatar_url: null,
    goal_type: null,
    level: null,
    timeline: null,
    exam_date: null
  });
  const [saving, setSaving] = useState(false);
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle().then(({ data: p }) => {
      if (p == null ? void 0 : p.display_name) setData((d) => ({ ...d, first_name: p.display_name }));
    });
  }, [user]);
  useEffect(() => {
    if (authLoading || profileLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    if (profile == null ? void 0 : profile.onboarding_completed) {
      navigate("/learn");
      return;
    }
  }, [user, authLoading, profile, profileLoading, navigate]);
  const goToStep = (next) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
    }, 220);
  };
  const handleComplete = async () => {
    setSaving(true);
    await saveProfile({
      first_name: data.first_name || null,
      avatar_url: data.avatar_url,
      goal_type: data.goal_type,
      level: data.level,
      timeline: data.timeline,
      exam_date: data.exam_date,
      onboarding_completed: true
    });
    if (user) {
      await supabase.from("profiles").update({
        display_name: data.first_name || null,
        avatar_url: data.avatar_url
      }).eq("id", user.id);
    }
    setSaving(false);
    navigate("/learn");
  };
  if (authLoading || profileLoading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-white flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-4 border-[#0055A4] border-t-transparent" }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-white flex flex-col", children: [
    /* @__PURE__ */ jsx(SEOHead, { noindex: true }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#E6EAF0]", children: [
      /* @__PURE__ */ jsx(Logo, { size: "sm" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        step > 1 && /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => goToStep(step - 1),
            className: "text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors flex items-center gap-1 text-sm font-medium",
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Retour" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1.5", children: Array.from({ length: TOTAL_STEPS }).map((_, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `h-2 rounded-full transition-all duration-500 ${i + 1 <= step ? "w-6 bg-[#0055A4]" : "w-2 bg-[#E6EAF0]"}`
          },
          i
        )) }),
        /* @__PURE__ */ jsxs("span", { className: "text-xs text-[#1A1A1A]/40 font-bold tabular-nums", children: [
          step,
          "/",
          TOTAL_STEPS
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-1 bg-[#E6EAF0]", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-[#0055A4] transition-all duration-500 ease-out", style: { width: `${step / TOTAL_STEPS * 100}%` } }) }),
    /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center px-4 py-6 sm:py-8", children: /* @__PURE__ */ jsxs("div", { className: `w-full max-w-xl transition-all duration-220 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`, children: [
      step === 1 && /* @__PURE__ */ jsx(StepWelcome, { onContinue: () => goToStep(2) }),
      step === 2 && /* @__PURE__ */ jsx(
        StepProfile,
        {
          name: data.first_name,
          avatar: data.avatar_url,
          onNameChange: (n) => setData((d) => ({ ...d, first_name: n })),
          onAvatarChange: (a) => setData((d) => ({ ...d, avatar_url: a })),
          onContinue: () => goToStep(3)
        }
      ),
      step === 3 && /* @__PURE__ */ jsx(
        StepGoal,
        {
          selected: data.goal_type,
          onSelect: (g) => setData((d) => ({ ...d, goal_type: g })),
          onContinue: () => goToStep(4)
        }
      ),
      step === 4 && /* @__PURE__ */ jsx(
        StepLevel,
        {
          selected: data.level,
          onSelect: (l) => setData((d) => ({ ...d, level: l })),
          onContinue: () => goToStep(5)
        }
      ),
      step === 5 && /* @__PURE__ */ jsx(
        StepTimeline,
        {
          selected: data.timeline,
          onSelect: (t) => setData((d) => ({ ...d, timeline: t })),
          onContinue: () => goToStep(6)
        }
      ),
      step === 6 && /* @__PURE__ */ jsx(
        StepExamDate,
        {
          selected: data.exam_date,
          onSelect: (d) => setData((prev) => ({ ...prev, exam_date: d })),
          onContinue: () => goToStep(7)
        }
      ),
      step === 7 && /* @__PURE__ */ jsx(StepComplete, { data, onStart: handleComplete, saving })
    ] }) }),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes bounceIn {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ringPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(0,85,164,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(0,85,164,0); }
        }
        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      ` })
  ] });
}
function StepWelcome({ onContinue }) {
  return /* @__PURE__ */ jsxs("div", { className: "text-center space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", style: { animation: "slideUp 0.6s ease-out" }, children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-[#0055A4]/10 mx-auto", children: /* @__PURE__ */ jsx(Flag, { className: "h-10 w-10 text-[#0055A4]" }) }),
      /* @__PURE__ */ jsxs("h1", { className: "text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight", children: [
        "Commençons par comprendre",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-[#0055A4]", children: "votre objectif" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[#1A1A1A]/60 text-lg max-w-md mx-auto", children: "Répondez à quelques questions pour que nous puissions personnaliser votre parcours d'apprentissage." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3 sm:gap-4", style: { animation: "slideUp 0.6s ease-out 0.15s both" }, children: [
      { icon: /* @__PURE__ */ jsx(Crosshair, { className: "h-5 w-5 sm:h-6 sm:w-6 text-[#0055A4]" }), label: "Objectif ciblé" },
      { icon: /* @__PURE__ */ jsx(BarChart3, { className: "h-5 w-5 sm:h-6 sm:w-6 text-[#0055A4]" }), label: "Progression suivie" },
      { icon: /* @__PURE__ */ jsx(Zap, { className: "h-5 w-5 sm:h-6 sm:w-6 text-[#0055A4]" }), label: "Résultats rapides" }
    ].map((item) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-[#E6EAF0] bg-[#F5F7FA] p-4 flex flex-col items-center gap-2", children: [
      item.icon,
      /* @__PURE__ */ jsx("p", { className: "text-xs text-[#1A1A1A]/60 font-medium", children: item.label })
    ] }, item.label)) }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "lg",
        className: "w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]",
        onClick: onContinue,
        style: { animation: "slideUp 0.6s ease-out 0.3s both" },
        children: [
          "Continuer",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
        ]
      }
    )
  ] });
}
function StepProfile({ name, avatar, onNameChange, onAvatarChange, onContinue }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", style: { animation: "slideUp 0.5s ease-out" }, children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-[#1A1A1A]", children: "Personnalisez votre profil" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#1A1A1A]/60", children: "Choisissez votre avatar et entrez votre prénom" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", style: { animation: "slideUp 0.5s ease-out 0.1s both" }, children: [
      /* @__PURE__ */ jsx(Label, { htmlFor: "onboard-name", className: "text-sm font-medium text-[#1A1A1A]", children: "Comment vous appelez-vous ?" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(User, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "onboard-name",
            type: "text",
            placeholder: "Votre prénom",
            value: name,
            onChange: (e) => onNameChange(e.target.value),
            className: "pl-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all text-lg"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { animation: "slideUp 0.5s ease-out 0.2s both" }, children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-[#1A1A1A] mb-3", children: "Choisissez votre avatar" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-3 sm:gap-4", children: AVATARS.map((src, i) => {
        const isSelected = avatar === src;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onAvatarChange(src),
            className: `relative aspect-square rounded-2xl overflow-hidden border-[3px] transition-all duration-300 ${isSelected ? "border-[#0055A4] scale-105 shadow-lg" : "border-[#E6EAF0] hover:border-[#0055A4]/40 hover:scale-[1.03]"}`,
            style: {
              animation: `bounceIn 0.4s ease-out ${0.05 * i}s both`,
              ...isSelected ? { animation: `bounceIn 0.4s ease-out ${0.05 * i}s both, ringPulse 2s ease-in-out infinite` } : {}
            },
            children: [
              /* @__PURE__ */ jsx("img", { src, alt: `Avatar ${i + 1}`, className: "w-full h-full object-cover", loading: "lazy" }),
              isSelected && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#0055A4]/15 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0055A4] flex items-center justify-center shadow-lg", children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-white", strokeWidth: 3 }) }) })
            ]
          },
          i
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "lg",
        className: "w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]",
        disabled: !avatar,
        onClick: onContinue,
        style: { animation: "slideUp 0.5s ease-out 0.3s both" },
        children: [
          "Continuer",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
        ]
      }
    )
  ] });
}
const GOALS = [
  { value: "naturalisation", label: "Naturalisation française", description: "Je prépare ma demande de naturalisation", icon: /* @__PURE__ */ jsx(Landmark, { className: "h-6 w-6" }) },
  { value: "carte_resident", label: "Carte de Résident (CR)", description: "Je renouvelle ou demande ma CR 10 ans", icon: /* @__PURE__ */ jsx(CreditCard, { className: "h-6 w-6" }) },
  { value: "csp", label: "Carte de Séjour Pluriannuelle (CSP)", description: "Valeurs républicaines fondamentales", icon: /* @__PURE__ */ jsx(ClipboardList, { className: "h-6 w-6" }) }
];
function StepGoal({ selected, onSelect, onContinue }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-[#1A1A1A]", children: "Quel est votre objectif ?" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#1A1A1A]/60", children: "Sélectionnez votre situation actuelle" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: GOALS.map((goal, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onSelect(goal.value),
        className: `w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${selected === goal.value ? "border-[#0055A4] bg-[#0055A4]/5 shadow-[0_4px_16px_rgba(0,85,164,0.15)]" : "border-[#E6EAF0] bg-white hover:border-[#0055A4]/30"}`,
        style: { animation: `slideUp 0.4s ease-out ${i * 0.08}s both` },
        children: [
          /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${selected === goal.value ? "bg-[#0055A4] text-white" : "bg-[#0055A4]/10 text-[#0055A4]"}`, children: goal.icon }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#1A1A1A]", children: goal.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-[#1A1A1A]/60 mt-0.5", children: goal.description })
          ] }),
          selected === goal.value && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-6 w-6 rounded-full bg-[#0055A4] flex items-center justify-center", children: /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-white" }) })
        ]
      },
      goal.value
    )) }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "lg",
        className: "w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]",
        disabled: !selected,
        onClick: onContinue,
        children: [
          "Continuer",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
        ]
      }
    )
  ] });
}
const LEVELS = [
  { value: "beginner", label: "Débutant", description: "Je commence à apprendre les bases", icon: /* @__PURE__ */ jsx(Sprout, { className: "h-6 w-6" }) },
  { value: "intermediate", label: "Intermédiaire", description: "J'ai quelques connaissances du sujet", icon: /* @__PURE__ */ jsx(BookOpen, { className: "h-6 w-6" }) },
  { value: "advanced", label: "Avancé", description: "Je connais bien le sujet et veux affiner", icon: /* @__PURE__ */ jsx(GraduationCap, { className: "h-6 w-6" }) }
];
function StepLevel({ selected, onSelect, onContinue }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-[#1A1A1A]", children: "Quel est votre niveau actuel ?" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#1A1A1A]/60", children: "Cela nous aide à calibrer vos questions" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: LEVELS.map((level, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onSelect(level.value),
        className: `w-full flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 hover:-translate-y-0.5 ${selected === level.value ? "border-[#0055A4] bg-[#0055A4]/5 shadow-[0_4px_16px_rgba(0,85,164,0.15)]" : "border-[#E6EAF0] bg-white hover:border-[#0055A4]/30"}`,
        style: { animation: `slideUp 0.4s ease-out ${i * 0.08}s both` },
        children: [
          /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center transition-colors ${selected === level.value ? "bg-[#0055A4] text-white" : "bg-[#0055A4]/10 text-[#0055A4]"}`, children: level.icon }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#1A1A1A] text-lg", children: level.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-[#1A1A1A]/60", children: level.description })
          ] }),
          selected === level.value && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-6 w-6 rounded-full bg-[#0055A4] flex items-center justify-center", children: /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-white" }) })
        ]
      },
      level.value
    )) }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "lg",
        className: "w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]",
        disabled: !selected,
        onClick: onContinue,
        children: [
          "Continuer",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
        ]
      }
    )
  ] });
}
const TIMELINES = [
  { value: "less_1_month", label: "Moins de 1 mois", description: "Mode intensif — révision express", icon: /* @__PURE__ */ jsx(Zap, { className: "h-5 w-5" }) },
  { value: "1_3_months", label: "1 à 3 mois", description: "Préparation progressive et solide", icon: /* @__PURE__ */ jsx(Target, { className: "h-5 w-5" }) },
  { value: "more_3_months", label: "Plus de 3 mois", description: "Apprentissage approfondi et durable", icon: /* @__PURE__ */ jsx(Clock, { className: "h-5 w-5" }) },
  { value: "not_sure", label: "Pas sûr", description: "Je veux juste m'entraîner pour l'instant", icon: /* @__PURE__ */ jsx(ShieldQuestion, { className: "h-5 w-5" }) }
];
function StepTimeline({ selected, onSelect, onContinue }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-[#1A1A1A]", children: "Quand voulez-vous passer l'examen ?" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#1A1A1A]/60", children: "Adaptez le rythme à votre calendrier" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: TIMELINES.map((t, i) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onSelect(t.value),
        className: `w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${selected === t.value ? "border-[#0055A4] bg-[#0055A4]/5 shadow-[0_4px_16px_rgba(0,85,164,0.15)]" : "border-[#E6EAF0] bg-white hover:border-[#0055A4]/30"}`,
        style: { animation: `slideUp 0.4s ease-out ${i * 0.08}s both` },
        children: [
          /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${selected === t.value ? "bg-[#0055A4] text-white" : "bg-[#0055A4]/10 text-[#0055A4]"}`, children: t.icon }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#1A1A1A]", children: t.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-[#1A1A1A]/60", children: t.description })
          ] }),
          selected === t.value && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-6 w-6 rounded-full bg-[#0055A4] flex items-center justify-center", children: /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-white" }) })
        ]
      },
      t.value
    )) }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "lg",
        className: "w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]",
        disabled: !selected,
        onClick: onContinue,
        children: [
          "Continuer",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
        ]
      }
    )
  ] });
}
function StepExamDate({ selected, onSelect, onContinue }) {
  const isUnknown = selected === "unknown";
  const dateValue = selected && selected !== "unknown" ? selected : "";
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", style: { animation: "slideUp 0.5s ease-out" }, children: [
      /* @__PURE__ */ jsx("div", { className: "inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0055A4]/10 mx-auto", children: /* @__PURE__ */ jsx(CalendarDays, { className: "h-8 w-8 text-[#0055A4]" }) }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl md:text-3xl font-bold text-[#1A1A1A]", children: "Quelle est la date de votre examen ?" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#1A1A1A]/60", children: "Cela nous aide à planifier vos révisions" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { animation: "slideUp 0.5s ease-out 0.1s both" }, children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "exam-date", className: "text-sm font-medium text-[#1A1A1A] mb-2 block", children: "Date de l'examen" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          id: "exam-date",
          type: "date",
          min: today,
          value: dateValue,
          disabled: isUnknown,
          onChange: (e) => onSelect(e.target.value || null),
          className: `w-full h-12 rounded-xl border-2 px-4 text-base transition-all ${dateValue && !isUnknown ? "border-[#0055A4] bg-[#0055A4]/5" : "border-[#E6EAF0] bg-[#F5F7FA]"} ${isUnknown ? "opacity-40 cursor-not-allowed" : "hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)]"}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => onSelect(isUnknown ? null : "unknown"),
        className: `w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${isUnknown ? "border-[#0055A4] bg-[#0055A4]/5 shadow-[0_4px_16px_rgba(0,85,164,0.15)]" : "border-[#E6EAF0] bg-white hover:border-[#0055A4]/30"}`,
        style: { animation: "slideUp 0.5s ease-out 0.2s both" },
        children: [
          /* @__PURE__ */ jsx("div", { className: `flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${isUnknown ? "bg-[#0055A4] text-white" : "bg-[#0055A4]/10 text-[#0055A4]"}`, children: /* @__PURE__ */ jsx(HelpCircle, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-[#1A1A1A]", children: "Je ne sais pas encore" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-[#1A1A1A]/60", children: "Pas encore inscrit ou date non confirmée" })
          ] }),
          isUnknown && /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 h-6 w-6 rounded-full bg-[#0055A4] flex items-center justify-center", children: /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5 text-white" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "lg",
        className: "w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]",
        disabled: !selected,
        onClick: onContinue,
        style: { animation: "slideUp 0.5s ease-out 0.3s both" },
        children: [
          "Continuer",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
        ]
      }
    )
  ] });
}
function StepComplete({ data, onStart, saving }) {
  return /* @__PURE__ */ jsxs("div", { className: "text-center space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-4", style: { animation: "slideUp 0.6s ease-out" }, children: [
      /* @__PURE__ */ jsx("div", { className: "relative inline-block", children: data.avatar_url ? /* @__PURE__ */ jsx(
        "img",
        {
          src: data.avatar_url,
          alt: "Votre avatar",
          className: "w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-[#0055A4] mx-auto shadow-[0_8px_32px_rgba(0,85,164,0.3)]",
          style: { animation: "bounceIn 0.6s ease-out" }
        }
      ) : /* @__PURE__ */ jsx("div", { className: "inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-[#0055A4] mx-auto shadow-[0_8px_32px_rgba(0,85,164,0.3)]", children: /* @__PURE__ */ jsx(PartyPopper, { className: "h-12 w-12 text-white" }) }) }),
      /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-4xl font-bold text-[#1A1A1A] leading-tight", children: [
        data.first_name ? `Bienvenue, ${data.first_name} !` : "Bienvenue !",
        /* @__PURE__ */ jsx("br", {}),
        /* @__PURE__ */ jsx("span", { className: "text-[#0055A4]", children: "Tout est prêt !" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Button,
      {
        size: "lg",
        className: "w-full gap-2 h-14 text-base font-bold bg-[#0055A4] hover:bg-[#1B6ED6] rounded-xl transition-all hover:scale-[1.01]",
        onClick: onStart,
        disabled: saving,
        style: { animation: "slideUp 0.6s ease-out 0.2s both" },
        children: [
          saving ? "Préparation..." : "Commencer l'entraînement",
          !saving && /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
        ]
      }
    )
  ] });
}
export {
  Onboarding as default
};
