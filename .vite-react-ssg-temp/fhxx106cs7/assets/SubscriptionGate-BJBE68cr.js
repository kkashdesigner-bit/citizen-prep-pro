import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { B as Button } from "./button-AT0XyJsk.js";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, CheckCircle2, Lock, Check, Loader2, ArrowRight } from "lucide-react";
import { c as cn, a as useAuth } from "../main.mjs";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { toast } from "sonner";
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
const plans = [
  {
    id: "free",
    name: "Gratuit",
    iconSymbol: "🎓",
    price: "0",
    currency: "€",
    period: "Forever",
    periodLabel: "",
    popular: false,
    colorClass: "blue",
    features: ["1 examen complet/jour", "10 premières classes", "Progression séquentielle"]
  },
  {
    id: "standard",
    name: "Standard",
    iconSymbol: "✨",
    price: "6,99",
    currency: "€",
    period: "/mo",
    periodLabel: "Facturé mensuellement",
    popular: true,
    colorClass: "blue",
    features: ["Examens illimités", "Parcours complet 1→100", "Mode entraînement", "Accès aux leçons", "Suivi de progression"]
  },
  {
    id: "premium",
    name: "Premium",
    iconSymbol: "👑",
    price: "10,99",
    currency: "€",
    period: "/mo",
    periodLabel: "Facturé mensuellement",
    popular: false,
    colorClass: "red",
    features: ["Tout dans Standard", "Accès libre entre classes", "Traduction instantanée (5 langues)", "Entraînement ciblé par catégorie"]
  }
];
function SubscriptionGate({ open, onOpenChange, requiredTier = "standard", featureLabel }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState(requiredTier === "premium" ? "premium" : "standard");
  const [isProcessing, setIsProcessing] = useState(false);
  if (isPremium) return null;
  const handleSubscribe = async () => {
    if (!user) {
      onOpenChange(false);
      navigate("/auth");
      return;
    }
    setIsProcessing(true);
    try {
      localStorage.setItem("pending_subscription_tier", selectedPlan);
      const premiumLink = "https://buy.stripe.com/cNiaEZ9QRcHz44i1gR6EU01";
      const standardLink = "https://buy.stripe.com/8x2dRb4wxfTLfN02kV6EU00";
      const baseUrl = selectedPlan === "premium" ? premiumLink : standardLink;
      const url = new URL(baseUrl);
      url.searchParams.set("client_reference_id", user.id);
      if (user.email) {
        url.searchParams.set("prefilled_email", user.email);
      }
      window.location.href = url.toString();
    } catch (err) {
      toast.error("Erreur lors de l'activation de l'abonnement");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "p-0 sm:max-w-[920px] max-h-[90vh] overflow-y-auto bg-white border-0 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-0 rounded-3xl shadow-2xl", children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: () => onOpenChange(false),
        className: "absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-slate-100/80 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors",
        "aria-label": "Fermer",
        children: /* @__PURE__ */ jsx(X, { className: "w-4 h-4" })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden text-center bg-[#F7F9FC]", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#0055A4]/8 blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-[#EF4135]/8 blur-3xl" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative mb-8", style: { animation: "subFloat 6s ease-in-out infinite" }, children: /* @__PURE__ */ jsxs("svg", { width: "180", height: "220", viewBox: "0 0 200 240", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
        /* @__PURE__ */ jsx("path", { d: "M60 220 L140 220 L130 180 L70 180 Z", fill: "#CBD5E1" }),
        /* @__PURE__ */ jsx("path", { d: "M75 180 L125 180 L115 120 L85 120 Z", fill: "#94A3B8" }),
        /* @__PURE__ */ jsx("path", { d: "M85 120 L115 120 L100 40 Z", fill: "#64748B" }),
        /* @__PURE__ */ jsx("circle", { cx: "130", cy: "140", r: "22", fill: "#FFE4C4" }),
        /* @__PURE__ */ jsx("path", { d: "M130 162 C112 162 103 215 103 215 L157 215 C157 215 148 162 130 162 Z", fill: "#EF4135", opacity: "0.85" }),
        /* @__PURE__ */ jsx("path", { d: "M150 140 L150 80 L190 80 L190 108 L150 108", fill: "none", stroke: "#334155", strokeWidth: "2" }),
        /* @__PURE__ */ jsx("rect", { x: "152", y: "80", width: "12", height: "28", fill: "#0055A4" }),
        /* @__PURE__ */ jsx("rect", { x: "164", y: "80", width: "12", height: "28", fill: "#FFFFFF" }),
        /* @__PURE__ */ jsx("rect", { x: "176", y: "80", width: "12", height: "28", fill: "#EF4135" }),
        /* @__PURE__ */ jsx("path", { d: "M30 60 L35 50 L40 60 L50 65 L40 70 L35 80 L30 70 L20 65 Z", fill: "#FBBF24", opacity: "0.8", style: { animation: "subPulse 3s ease-in-out infinite" } }),
        /* @__PURE__ */ jsx("path", { d: "M170 38 L173 33 L176 38 L181 40 L176 42 L173 47 L170 42 L165 40 Z", fill: "#FBBF24", opacity: "0.7", style: { animation: "subPulse 3s ease-in-out infinite 0.5s" } })
      ] }) }),
      /* @__PURE__ */ jsx("h2", { className: "relative z-10 font-serif text-3xl font-bold text-slate-900 leading-tight mb-4", children: "Maîtrisez votre destin." }),
      /* @__PURE__ */ jsx("p", { className: "relative z-10 text-sm text-slate-500 max-w-[260px] leading-relaxed mb-8", children: "Rejoignez des milliers de futurs citoyens se préparant de manière interactive à leur entretien de naturalisation." }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 inline-flex items-center gap-2 text-xs font-medium text-slate-500 bg-white/70 px-4 py-2 rounded-full shadow-sm border border-slate-100", children: [
        /* @__PURE__ */ jsx(CheckCircle2, { className: "w-4 h-4 text-emerald-500" }),
        "Approuvé par +5 000 candidats"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative p-6 md:p-8 flex flex-col bg-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-slate-900", children: "Choisissez votre voie" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-400 mt-0.5", children: "Annulation libre. Sans frais cachés." }),
        featureLabel && /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-2.5", children: [
          /* @__PURE__ */ jsx(Lock, { className: "h-4 w-4 text-[#0055A4] shrink-0" }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-700", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold", children: featureLabel }),
            " nécessite le forfait",
            " ",
            /* @__PURE__ */ jsx("span", { className: "font-bold text-[#0055A4]", children: requiredTier === "premium" ? "Premium" : "Standard" }),
            "."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6", children: plans.map((plan) => {
        const isSelected = selectedPlan === plan.id;
        const isSelectable = plan.id !== "free";
        const accentColor = plan.id === "premium" ? "#EF4135" : plan.id === "standard" ? "#f04e42" : "#94A3B8";
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => isSelectable && setSelectedPlan(plan.id),
            className: `
                    relative flex flex-col p-5 rounded-2xl border-2 transition-all duration-300
                    ${isSelectable ? "cursor-pointer hover:-translate-y-1 hover:shadow-md" : "opacity-70"}
                    ${isSelected ? "shadow-lg" : "border-slate-100 bg-white"}
                  `,
            style: isSelected ? {
              borderColor: accentColor,
              backgroundColor: `${accentColor}05`,
              boxShadow: `0 8px 24px ${accentColor}18`
            } : {},
            children: [
              plan.popular && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-full whitespace-nowrap z-10",
                  style: { backgroundColor: accentColor },
                  children: "Plus Populaire"
                }
              ),
              !plan.popular && isSelectable && /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 rounded-t-2xl", style: { backgroundColor: accentColor, opacity: 0.7 } }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-serif font-bold text-base text-slate-900", children: plan.name }),
                /* @__PURE__ */ jsx("span", { className: "text-lg", children: plan.iconSymbol })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mb-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-0.5", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-3xl font-extrabold text-slate-900", children: plan.price }),
                  /* @__PURE__ */ jsx("span", { className: "text-base font-bold text-slate-900 ml-0.5", children: plan.currency }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400 ml-1", children: plan.period })
                ] }),
                plan.periodLabel && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-0.5", children: plan.periodLabel })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "flex-1 space-y-2 my-4", children: plan.features.map((feat, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-xs text-slate-600", children: [
                /* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5 shrink-0 mt-0.5", style: { color: isSelectable ? accentColor : "#94A3B8" } }),
                /* @__PURE__ */ jsx("span", { className: "leading-tight", children: feat })
              ] }, i)) }),
              /* @__PURE__ */ jsx("div", { className: "mt-auto flex justify-center pt-2", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                  style: { borderColor: isSelected ? accentColor : "#CBD5E1" },
                  children: isSelected && /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full", style: { backgroundColor: accentColor } })
                }
              ) })
            ]
          },
          plan.id
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-auto", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            disabled: isProcessing,
            onClick: handleSubscribe,
            className: "w-full text-white rounded-full font-bold text-base py-6 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-[#0055A4] to-[#4D94E0] hover:from-[#003d7a] hover:to-[#3a7cc7]",
            style: {
              animation: "subBtnPulse 2.5s infinite"
            },
            children: isProcessing ? /* @__PURE__ */ jsx(Loader2, { className: "w-6 h-6 animate-spin" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              "Débloquer maintenant",
              /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 mt-4 text-center", children: "Paiement sécurisé via Stripe. En continuant, vous acceptez nos CGU." })
      ] })
    ] })
  ] }) });
}
export {
  Dialog as D,
  SubscriptionGate as S,
  DialogContent as a
};
