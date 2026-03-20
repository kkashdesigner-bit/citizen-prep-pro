import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { B as Button } from "./button-AT0XyJsk.js";
import { a as useAuth, s as supabase } from "../main.mjs";
import { PartyPopper, Star, ShieldCheck, Route, GraduationCap, CheckCircle, Users } from "lucide-react";
import { L as Logo } from "./Logo-RLfqH6ZW.js";
import { toast } from "sonner";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "react-dom/client";
import "@supabase/supabase-js";
import "react-helmet-async";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(true);
  useEffect(() => {
    const updateSubscription = async () => {
      if (!user) return;
      const pendingTier = localStorage.getItem("pending_subscription_tier");
      if (pendingTier) {
        try {
          const { error } = await supabase.from("profiles").update({
            subscription_tier: pendingTier,
            is_subscribed: true
          }).eq("id", user.id);
          if (error) throw error;
          localStorage.removeItem("pending_subscription_tier");
          const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
          await supabase.functions.invoke("send-email", {
            body: {
              type: "welcome",
              data: {
                email: user.email,
                firstName: (profile == null ? void 0 : profile.display_name) || "",
                tier: pendingTier
              }
            }
          });
          toast.success(`Abonnement ${pendingTier === "premium" ? "Premium" : "Standard"} activé avec succès !`);
        } catch (err) {
          console.error("Error updating subscription:", err);
          toast.error("Erreur lors de l'activation de l'abonnement");
        }
      }
      setIsUpdating(false);
    };
    updateSubscription();
  }, [user]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-6 left-6", children: /* @__PURE__ */ jsx(Logo, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "w-full max-w-4xl mx-auto flex flex-col items-center text-center", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative w-48 h-48 mb-8", children: [
        /* @__PURE__ */ jsx(PartyPopper, { className: "absolute -top-4 -right-12 h-8 w-8 text-destructive animate-bounce", style: { animationDelay: "0.2s" } }),
        /* @__PURE__ */ jsx(Star, { className: "absolute top-12 -left-16 h-6 w-6 text-secondary animate-bounce", style: { animationDelay: "0.4s" } }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-4 right-0 h-4 w-4 bg-primary/20 rounded-full animate-ping" }),
        /* @__PURE__ */ jsxs("div", { className: "w-48 h-48 rounded-full bg-secondary/20 p-2 relative overflow-visible flex items-center justify-center shadow-xl", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: `https://api.dicebear.com/7.x/avataaars/svg?seed=${(user == null ? void 0 : user.email) || "Leo"}&backgroundColor=b6e3f4`,
              alt: "Avatar",
              className: "w-full h-full rounded-full object-cover"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute -bottom-2 -right-2 h-12 w-12 bg-white rounded-xl shadow-lg flex items-center justify-center border border-border", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-6 w-6 text-[hsl(var(--success))]" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-bold font-serif text-foreground mb-4", children: "Bienvenue à bord !" }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg md:text-xl max-w-lg mb-10", children: "Votre voyage vers la citoyenneté française commence maintenant. Vous avez débloqué un accès complet à tous les cours et examens." }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4 mb-16", children: [
        /* @__PURE__ */ jsx(
          Button,
          {
            size: "lg",
            className: "rounded-full px-8 py-6 text-base shadow-[0_8px_30px_hsl(var(--primary)/0.3)] hover:-translate-y-1 transition-all gap-2",
            onClick: () => navigate("/learn"),
            disabled: isUpdating,
            children: "Commencer l'entraînement →"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            className: "text-muted-foreground gap-2",
            onClick: () => toast.info("Un reçu a été envoyé à votre adresse e-mail."),
            children: [
              /* @__PURE__ */ jsx(Route, { className: "h-4 w-4" }),
              "Voir le reçu"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(GraduationCap, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground", children: "Accès complet" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Cours et modules culturels illimités" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-secondary/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-secondary" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground", children: "Examens blancs" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Simulations en conditions réelles incluses" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border/40 rounded-2xl p-6 shadow-sm flex flex-col items-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-10 w-10 bg-[hsl(var(--success))]/10 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5 text-[hsl(var(--success))]" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground", children: "Communauté" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Rejoignez +10 000 futurs citoyens" })
        ] })
      ] })
    ] })
  ] });
}
export {
  SubscriptionSuccess as default
};
