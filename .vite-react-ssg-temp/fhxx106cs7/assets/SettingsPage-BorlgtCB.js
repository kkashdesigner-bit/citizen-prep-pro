import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { c as cn, a as useAuth, s as supabase } from "../main.mjs";
import { u as useUserProfile, a as GOAL_LABELS } from "./useUserProfile-BcVuiJUg.js";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { L as LearnSidebar } from "./LearnSidebar-BzOBVmNx.js";
import { b as buttonVariants, B as Button } from "./button-AT0XyJsk.js";
import { L as Label, I as Input } from "./label-CpX0ua28.js";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Shield, CreditCard, Check, Loader2, Save, EyeOff, Eye, Crown, ChevronRight, ExternalLink, XCircle, Sparkles } from "lucide-react";
import { S as SubscriptionGate } from "./SubscriptionGate-BJBE68cr.js";
import "react-dom/client";
import "@supabase/supabase-js";
import "react-helmet-async";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "./Logo-RLfqH6ZW.js";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "@radix-ui/react-dialog";
const Tabs = TabsPrimitive.Root;
const TabsList = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.List,
  {
    ref,
    className: cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = TabsPrimitive.List.displayName;
const TabsTrigger = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
const TabsContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  TabsPrimitive.Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = TabsPrimitive.Content.displayName;
const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogPortal = AlertDialogPrimitive.Portal;
const AlertDialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
const AlertDialogContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
  /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
  /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      ),
      ...props
    }
  )
] }));
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
const AlertDialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
AlertDialogHeader.displayName = "AlertDialogHeader";
const AlertDialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className), ...props });
AlertDialogFooter.displayName = "AlertDialogFooter";
const AlertDialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Title, { ref, className: cn("text-lg font-semibold", className), ...props }));
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Description, { ref, className: cn("text-sm text-muted-foreground", className), ...props }));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
const AlertDialogAction = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AlertDialogPrimitive.Action, { ref, className: cn(buttonVariants(), className), ...props }));
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
const AlertDialogCancel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  AlertDialogPrimitive.Cancel,
  {
    ref,
    className: cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className),
    ...props
  }
));
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
const TIER_CONFIG = {
  free: { label: "Gratuit", color: "slate", icon: null, price: "Gratuit" },
  standard: { label: "Standard", color: "red", icon: Sparkles, price: "6,99€/mois" },
  premium: { label: "Premium", color: "amber", icon: Crown, price: "10,99€/mois" }
};
const TIER_FEATURES = {
  free: ["10 classes gratuites", "1 examen complet/jour", "Progression séquentielle"],
  standard: ["Parcours complet 1→100", "Examens blancs illimités", "Mode entraînement"],
  premium: ["Tout dans Standard", "Accès libre entre classes", "Traduction instantanée", "Catégories ciblées"]
};
function SettingsPage() {
  var _a;
  const navigate = useNavigate();
  const { user, displayName, avatarUrl } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useUserProfile();
  const { tier, isPremium, isStandardOrAbove, loading: subLoading } = useSubscription();
  const [firstName, setFirstName] = useState("");
  const [goal, setGoal] = useState("");
  const [profileDirty, setProfileDirty] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileInitialized, setProfileInitialized] = useState(false);
  if (profile && !profileInitialized) {
    setFirstName(profile.first_name || "");
    setGoal(profile.goal_type || "");
    setProfileInitialized(true);
  }
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const isGoogleUser = ((_a = user == null ? void 0 : user.app_metadata) == null ? void 0 : _a.provider) === "google";
  const [showSubGate, setShowSubGate] = useState(false);
  const [billingLoading, setBillingLoading] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await saveProfile({
        first_name: firstName || null,
        goal_type: goal || null
      });
      setProfileDirty(false);
      toast.success("Profil mis à jour !");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setSavingProfile(false);
    }
  };
  const handleChangePassword = async () => {
    if (!currentPw) {
      toast.error("Veuillez entrer votre mot de passe actuel");
      return;
    }
    if (newPw.length < 6) {
      toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }
    setSavingPw(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (user == null ? void 0 : user.email) || "",
        password: currentPw
      });
      if (signInError) {
        toast.error("Mot de passe actuel incorrect");
        setSavingPw(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) throw error;
      toast.success("Mot de passe modifié avec succès !");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err) {
      toast.error(err.message || "Erreur lors du changement de mot de passe");
    } finally {
      setSavingPw(false);
    }
  };
  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(
        `${"https://jblhxpzqbbarpqstcbvq.supabase.co"}/functions/v1/stripe-portal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session == null ? void 0 : session.access_token}`
          },
          body: JSON.stringify({ action: "portal", return_url: window.location.href })
        }
      );
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Impossible d'ouvrir le portail de facturation");
      }
    } catch {
      toast.error("Erreur de connexion au service de paiement");
    } finally {
      setBillingLoading(false);
    }
  };
  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(
        `${"https://jblhxpzqbbarpqstcbvq.supabase.co"}/functions/v1/stripe-portal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session == null ? void 0 : session.access_token}`
          },
          body: JSON.stringify({ action: "cancel" })
        }
      );
      const data = await resp.json();
      if (data.success) {
        toast.success("Votre abonnement sera annulé à la fin de la période de facturation");
        setShowCancelDialog(false);
      } else {
        toast.error(data.error || "Erreur lors de l'annulation");
      }
    } catch {
      toast.error("Erreur de connexion");
    } finally {
      setCancelling(false);
    }
  };
  if (!user && !profileLoading && !subLoading) {
    navigate("/auth");
    return null;
  }
  const userInitial = ((profile == null ? void 0 : profile.first_name) || displayName || (user == null ? void 0 : user.email) || "U").charAt(0).toUpperCase();
  const tierConf = TIER_CONFIG[tier] || TIER_CONFIG.free;
  const TierIcon = tierConf.icon;
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-[var(--dash-bg)] transition-colors duration-300 overflow-x-hidden", children: [
    /* @__PURE__ */ jsx(LearnSidebar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 md:ml-[260px] pb-24 md:pb-8 flex justify-center overflow-x-hidden", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[800px] px-4 md:px-6 lg:px-8 py-6 md:py-8 overflow-x-hidden", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          className: "mb-6",
          children: [
            /* @__PURE__ */ jsx("h1", { className: "text-2xl md:text-3xl font-bold text-[var(--dash-text)] tracking-tight", children: "Paramètres" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--dash-text-muted)] mt-1", children: "Gérez votre profil, sécurité et abonnement" })
          ]
        }
      ),
      /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 }, children: /* @__PURE__ */ jsxs(Tabs, { defaultValue: "profile", className: "w-full", children: [
        /* @__PURE__ */ jsxs(TabsList, { className: "w-full grid grid-cols-3 bg-[var(--dash-surface)] border border-[var(--dash-card-border)] rounded-xl h-11 p-1", children: [
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "profile", className: "rounded-lg text-xs sm:text-sm font-bold gap-1.5 data-[state=active]:bg-[var(--dash-card)] data-[state=active]:text-[#0055A4] data-[state=active]:shadow-sm", children: [
            /* @__PURE__ */ jsx(User, { className: "h-4 w-4 hidden sm:block" }),
            " Profil"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "security", className: "rounded-lg text-xs sm:text-sm font-bold gap-1.5 data-[state=active]:bg-[var(--dash-card)] data-[state=active]:text-[#0055A4] data-[state=active]:shadow-sm", children: [
            /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 hidden sm:block" }),
            " Sécurité"
          ] }),
          /* @__PURE__ */ jsxs(TabsTrigger, { value: "billing", className: "rounded-lg text-xs sm:text-sm font-bold gap-1.5 data-[state=active]:bg-[var(--dash-card)] data-[state=active]:text-[#0055A4] data-[state=active]:shadow-sm", children: [
            /* @__PURE__ */ jsx(CreditCard, { className: "h-4 w-4 hidden sm:block" }),
            " Abonnement"
          ] })
        ] }),
        /* @__PURE__ */ jsx(TabsContent, { value: "profile", className: "mt-6 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-[var(--dash-text)] mb-5", children: "Informations personnelles" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
            avatarUrl || (profile == null ? void 0 : profile.avatar_url) ? /* @__PURE__ */ jsx(
              "img",
              {
                src: avatarUrl || (profile == null ? void 0 : profile.avatar_url) || "",
                alt: "Avatar",
                className: "w-16 h-16 rounded-full border-4 border-white shadow-lg object-cover"
              }
            ) : /* @__PURE__ */ jsx("div", { className: "w-16 h-16 rounded-full border-4 border-white bg-[#0055A4] text-white flex items-center justify-center font-bold text-2xl shadow-lg", children: userInitial }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[var(--dash-text)]", children: (profile == null ? void 0 : profile.first_name) || displayName || "Utilisateur" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-[var(--dash-text-muted)]", children: user == null ? void 0 : user.email })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "firstName", className: "text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider", children: "Prénom" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "firstName",
                  value: firstName,
                  onChange: (e) => {
                    setFirstName(e.target.value);
                    setProfileDirty(true);
                  },
                  placeholder: "Votre prénom",
                  className: "mt-1.5 bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text)] focus:border-[#0055A4] focus:ring-[#0055A4]/20 rounded-xl h-11"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider", children: "Email" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "email",
                  value: (user == null ? void 0 : user.email) || "",
                  disabled: true,
                  className: "mt-1.5 bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text-muted)] rounded-xl h-11 cursor-not-allowed opacity-60"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { className: "text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider", children: "Objectif d'examen" }),
              /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5", children: Object.entries(GOAL_LABELS).map(([key, label]) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => {
                    setGoal(key);
                    setProfileDirty(true);
                  },
                  className: `flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${goal === key ? "border-[#0055A4] bg-blue-500/10 text-[#0055A4]" : "border-[var(--dash-card-border)] bg-[var(--dash-surface)] text-[var(--dash-text-muted)] hover:border-[#0055A4]/40"}`,
                  children: [
                    goal === key && /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-[#0055A4] shrink-0" }),
                    /* @__PURE__ */ jsx("span", { className: "truncate", children: label })
                  ]
                },
                key
              )) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              disabled: !profileDirty || savingProfile,
              onClick: handleSaveProfile,
              className: "mt-6 w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 px-8 shadow-[0_4px_14px_rgba(0,85,164,0.25)] hover:-translate-y-0.5 transition-all",
              children: [
                savingProfile ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(Save, { className: "h-4 w-4 mr-2" }),
                "Enregistrer"
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "security", className: "mt-6 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-[var(--dash-text)] mb-2", children: "Changer le mot de passe" }),
          isGoogleUser ? /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-blue-800 font-medium", children: "🔒 Votre compte utilise la connexion Google. Le mot de passe est géré par Google." }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "currentPw", className: "text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider", children: "Mot de passe actuel" }),
              /* @__PURE__ */ jsxs("div", { className: "relative mt-1.5", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "currentPw",
                    type: showCurrent ? "text" : "password",
                    value: currentPw,
                    onChange: (e) => setCurrentPw(e.target.value),
                    placeholder: "Votre mot de passe actuel",
                    className: "bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text)] focus:border-[#0055A4] focus:ring-[#0055A4]/20 rounded-xl h-11 pr-10"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowCurrent(!showCurrent),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]",
                    children: showCurrent ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "newPw", className: "text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider", children: "Nouveau mot de passe" }),
              /* @__PURE__ */ jsxs("div", { className: "relative mt-1.5", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "newPw",
                    type: showNew ? "text" : "password",
                    value: newPw,
                    onChange: (e) => setNewPw(e.target.value),
                    placeholder: "Min. 6 caractères",
                    className: "bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text)] focus:border-[#0055A4] focus:ring-[#0055A4]/20 rounded-xl h-11 pr-10"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowNew(!showNew),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]",
                    children: showNew ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "confirmPw", className: "text-xs font-bold text-[var(--dash-text-muted)] uppercase tracking-wider", children: "Confirmer le nouveau mot de passe" }),
              /* @__PURE__ */ jsxs("div", { className: "relative mt-1.5", children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    id: "confirmPw",
                    type: showConfirm ? "text" : "password",
                    value: confirmPw,
                    onChange: (e) => setConfirmPw(e.target.value),
                    placeholder: "Retapez le nouveau mot de passe",
                    className: "bg-[var(--dash-surface)] border-[var(--dash-card-border)] text-[var(--dash-text)] focus:border-[#0055A4] focus:ring-[#0055A4]/20 rounded-xl h-11 pr-10"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowConfirm(!showConfirm),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]",
                    children: showConfirm ? /* @__PURE__ */ jsx(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Eye, { className: "h-4 w-4" })
                  }
                )
              ] }),
              confirmPw && confirmPw !== newPw && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: "Les mots de passe ne correspondent pas" })
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                disabled: !currentPw || !newPw || newPw !== confirmPw || savingPw,
                onClick: handleChangePassword,
                className: "w-full sm:w-auto bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 px-8 shadow-[0_4px_14px_rgba(0,85,164,0.25)] hover:-translate-y-0.5 transition-all",
                children: [
                  savingPw ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin mr-2" }) : /* @__PURE__ */ jsx(Shield, { className: "h-4 w-4 mr-2" }),
                  "Modifier le mot de passe"
                ]
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(TabsContent, { value: "billing", className: "mt-6 space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--dash-card)] rounded-2xl border border-[var(--dash-card-border)] p-5 md:p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)]", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-[var(--dash-text)] mb-5", children: "Votre abonnement" }),
          /* @__PURE__ */ jsxs("div", { className: `rounded-xl border-2 p-5 transition-colors ${tier === "premium" ? "border-amber-300 bg-amber-50/50" : tier === "standard" ? "border-blue-300 bg-blue-50/50" : "border-[#1764ac]/30 bg-[#1764ac]/5"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                TierIcon && /* @__PURE__ */ jsx(TierIcon, { className: `h-6 w-6 ${tier === "premium" ? "text-amber-600" : "text-blue-600"}` }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("span", { className: "text-lg font-bold text-[var(--dash-text)]", children: [
                    "Forfait ",
                    tierConf.label
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-[var(--dash-text-muted)]", children: tierConf.price })
                ] })
              ] }),
              /* @__PURE__ */ jsx("span", { className: `text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${tier === "premium" ? "bg-amber-100 text-amber-700" : tier === "standard" ? "bg-blue-100 text-blue-700" : "bg-[#1764ac]/10 text-[#1764ac]"}`, children: "Actif" })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2", children: (TIER_FEATURES[tier] || TIER_FEATURES.free).map((f, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm text-[var(--dash-text)]", children: [
              /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 text-green-500 shrink-0" }),
              " ",
              f
            ] }, i)) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-6 flex flex-col sm:flex-row gap-3", children: !isStandardOrAbove ? (
            /* Free user → upgrade */
            /* @__PURE__ */ jsxs(
              Button,
              {
                onClick: () => setShowSubGate(true),
                className: "flex-1 bg-gradient-to-r from-[#0055A4] to-[#1B6ED6] hover:from-[#1B6ED6] hover:to-[#0055A4] text-white font-bold rounded-xl h-11 shadow-[0_4px_14px_rgba(0,85,164,0.25)] transition-all gap-2",
                children: [
                  /* @__PURE__ */ jsx(Crown, { className: "h-4 w-4" }),
                  " Passer au Premium ",
                  /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
                ]
              }
            )
          ) : (
            /* Paying user → manage + cancel */
            /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: handleManageBilling,
                  disabled: billingLoading,
                  className: "flex-1 bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold rounded-xl h-11 shadow-[0_4px_14px_rgba(0,85,164,0.25)] transition-all gap-2",
                  children: [
                    billingLoading ? /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx(ExternalLink, { className: "h-4 w-4" }),
                    "Gérer la facturation"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: () => setShowCancelDialog(true),
                  variant: "outline",
                  className: "flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold rounded-xl h-11 transition-all gap-2",
                  children: [
                    /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
                    " Annuler l'abonnement"
                  ]
                }
              )
            ] })
          ) })
        ] }) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx(SubscriptionGate, { open: showSubGate, onOpenChange: setShowSubGate, requiredTier: "standard" }),
    /* @__PURE__ */ jsx(AlertDialog, { open: showCancelDialog, onOpenChange: setShowCancelDialog, children: /* @__PURE__ */ jsxs(AlertDialogContent, { className: "bg-[var(--dash-card)] border-[var(--dash-card-border)] rounded-2xl max-w-md", children: [
      /* @__PURE__ */ jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { className: "text-[var(--dash-text)] text-lg", children: "Annuler votre abonnement ?" }),
        /* @__PURE__ */ jsxs(AlertDialogDescription, { className: "text-[var(--dash-text-muted)] text-sm space-y-2", children: [
          /* @__PURE__ */ jsx("p", { children: "En annulant, vous perdrez l'accès à :" }),
          /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
            /* @__PURE__ */ jsx("li", { children: "Le parcours complet 1→100" }),
            /* @__PURE__ */ jsx("li", { children: "Les examens blancs illimités" }),
            isPremium && /* @__PURE__ */ jsx("li", { children: "La traduction instantanée" }),
            isPremium && /* @__PURE__ */ jsx("li", { children: "Les catégories ciblées" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "font-medium pt-2", children: "Votre accès sera maintenu jusqu'à la fin de votre période de facturation actuelle." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(AlertDialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsx(AlertDialogCancel, { className: "border-[var(--dash-card-border)] text-[var(--dash-text)] rounded-xl font-bold", children: "Garder mon abonnement" }),
        /* @__PURE__ */ jsxs(
          AlertDialogAction,
          {
            onClick: handleCancelSubscription,
            disabled: cancelling,
            className: "bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold gap-2",
            children: [
              cancelling && /* @__PURE__ */ jsx(Loader2, { className: "h-4 w-4 animate-spin" }),
              "Confirmer l'annulation"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  SettingsPage as default
};
