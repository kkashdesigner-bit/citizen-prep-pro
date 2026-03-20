import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import { B as Button } from "./button-AT0XyJsk.js";
import { L as Label, I as Input } from "./label-CpX0ua28.js";
import { u as useLanguage, a as useAuth, b as useToast, s as supabase } from "../main.mjs";
import { u as useUserProfile } from "./useUserProfile-BcVuiJUg.js";
import { L as Logo } from "./Logo-RLfqH6ZW.js";
import { Sparkles, BarChart3, Shield, ChevronLeft, Mail, User, Lock, EyeOff, Eye, ArrowRight } from "lucide-react";
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
const AVATARS = Array.from({ length: 8 }, (_, i) => `/examen-civique-avatar-${i + 1}.webp`);
function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState("idle");
  useLanguage();
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const switchMode = (toLogin) => {
    setFormState("switching");
    setTimeout(() => {
      setIsLogin(toLogin);
      setIsForgot(false);
      setFormState("idle");
    }, 200);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
        navigate((profile == null ? void 0 : profile.onboarding_completed) ? "/learn" : "/onboarding");
      } else {
        await signUpWithEmail(email, password);
        if (displayName.trim()) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("profiles").update({ display_name: displayName.trim() }).eq("id", user.id);
          }
        }
        toast({
          title: "Compte créé !",
          description: "Vérifiez votre email pour confirmer votre compte."
        });
        navigate("/onboarding");
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin
      });
      if (error) throw error;
      toast({ title: "Email envoyé ! Vérifiez votre boîte de réception." });
      setIsForgot(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    return score;
  };
  const strength = getPasswordStrength(password);
  const strengthLabels = ["", "Faible", "Moyen", "Bon", "Fort", "Excellent"];
  const strengthColors = ["", "#EF4135", "#F59E0B", "#3B82F6", "#10B981", "#059669"];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex flex-col lg:flex-row bg-white", children: [
    /* @__PURE__ */ jsx(SEOHead, { noindex: true }),
    /* @__PURE__ */ jsxs("div", { className: "relative hidden lg:flex lg:w-[48%] bg-gradient-to-br from-[#0055A4] via-[#1B6ED6] to-[#4D94E0] p-12 flex-col justify-between overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5", style: { animation: "float 12s ease-in-out infinite" } }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-20 -left-32 w-80 h-80 rounded-full bg-white/5", style: { animation: "float 15s ease-in-out infinite reverse" } }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 right-1/4 w-48 h-48 rounded-full bg-white/3", style: { animation: "float 10s ease-in-out infinite" } })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx(Logo, { size: "sm" }) }) }),
      /* @__PURE__ */ jsx("div", { className: "relative z-10 flex-1 flex items-center justify-center my-12", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-md aspect-square", children: [
        AVATARS.map((src, i) => {
          const angle = i / AVATARS.length * 2 * Math.PI - Math.PI / 2;
          const radius = 42;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          const size = i % 3 === 0 ? "w-16 h-16" : i % 2 === 0 ? "w-14 h-14" : "w-12 h-12";
          return /* @__PURE__ */ jsx(
            "div",
            {
              className: `absolute ${size} rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl`,
              style: {
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                animation: `floatAvatar ${6 + i * 0.8}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`
              },
              children: /* @__PURE__ */ jsx("img", { src, alt: "Avatar utilisateur GoCivique", className: "w-full h-full object-cover", loading: "lazy" })
            },
            i
          );
        }),
        /* @__PURE__ */ jsxs("div", { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 flex flex-col items-center justify-center shadow-2xl", children: [
          /* @__PURE__ */ jsx("span", { className: "text-4xl mb-1", children: "🇫🇷" }),
          /* @__PURE__ */ jsx("span", { className: "text-white text-xs font-bold tracking-wide", children: "Examen 2026" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-white/90", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Sparkles, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: "+7 000 questions" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-white/60", children: "Questions officielles actualisées" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-white/90", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: "Suivi personnalisé" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-white/60", children: "Parcours adapté à votre objectif" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-white/90", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center", children: /* @__PURE__ */ jsx(Shield, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: "Conforme programme 2026" }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-white/60", children: "Ministère de l'Intérieur" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-h-screen lg:min-h-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:hidden flex items-center justify-between p-4 border-b border-[#E6EAF0] bg-white", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsx(Logo, { size: "sm" }) }),
        /* @__PURE__ */ jsx("div", { className: "flex -space-x-2", children: AVATARS.slice(0, 4).map((src, i) => /* @__PURE__ */ jsx(
          "img",
          {
            src,
            alt: "",
            className: "w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
          },
          i
        )) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 flex items-center justify-center px-5 py-8 sm:px-8 lg:px-16", children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `w-full max-w-md transition-all duration-200 ${formState === "switching" ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "mb-8", children: isForgot ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setIsForgot(false),
                  className: "flex items-center gap-1 text-sm text-[#0055A4] font-medium mb-4 hover:gap-2 transition-all",
                  children: [
                    /* @__PURE__ */ jsx(ChevronLeft, { className: "w-4 h-4" }),
                    "Retour"
                  ]
                }
              ),
              /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight", children: "Mot de passe oublié ?" }),
              /* @__PURE__ */ jsx("p", { className: "text-[#1A1A1A]/60 mt-2", children: "Entrez votre email pour réinitialiser votre mot de passe." })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight", children: isLogin ? "Bon retour !" : "Créez votre compte" }),
              /* @__PURE__ */ jsx("p", { className: "text-[#1A1A1A]/60 mt-2", children: isLogin ? "Connectez-vous pour continuer votre préparation." : "Rejoignez des milliers de candidats qui préparent leur examen civique." })
            ] }) }),
            isForgot ? /* @__PURE__ */ jsxs("form", { onSubmit: handleResetPassword, className: "space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx(Label, { htmlFor: "reset-email", className: "text-sm font-medium text-[#1A1A1A]", children: "Email" }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "reset-email",
                      type: "email",
                      placeholder: "votre@email.com",
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      required: true,
                      className: "pl-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsx(Button, { type: "submit", disabled: loading, className: "w-full h-12 rounded-xl bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold text-base transition-all hover:scale-[1.01] active:scale-[0.99]", children: loading ? /* @__PURE__ */ jsx("span", { className: "animate-pulse", children: "Envoi en cours..." }) : "Réinitialiser le mot de passe" })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  className: "w-full h-12 rounded-xl gap-3 font-semibold text-[#1A1A1A] border-[#E6EAF0] hover:border-[#0055A4]/30 hover:bg-[#F5F7FA] transition-all hover:scale-[1.01] active:scale-[0.99]",
                  onClick: signInWithGoogle,
                  children: [
                    /* @__PURE__ */ jsxs("svg", { className: "h-5 w-5", viewBox: "0 0 24 24", children: [
                      /* @__PURE__ */ jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z", fill: "#4285F4" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }),
                      /* @__PURE__ */ jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })
                    ] }),
                    "Continuer avec Google"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "relative my-6", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("span", { className: "w-full border-t border-[#E6EAF0]" }) }),
                /* @__PURE__ */ jsx("div", { className: "relative flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "bg-white px-4 text-sm text-[#1A1A1A]/40 font-medium", children: "ou" }) })
              ] }),
              /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
                !isLogin && /* @__PURE__ */ jsxs("div", { className: "space-y-2", style: { animation: "slideDown 0.3s ease-out" }, children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "name", className: "text-sm font-medium text-[#1A1A1A]", children: "Prénom" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(User, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "name",
                        type: "text",
                        placeholder: "Votre prénom",
                        value: displayName,
                        onChange: (e) => setDisplayName(e.target.value),
                        className: "pl-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "email", className: "text-sm font-medium text-[#1A1A1A]", children: "Email" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(Mail, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "email",
                        type: "email",
                        placeholder: "votre@email.com",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        required: true,
                        className: "pl-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx(Label, { htmlFor: "password", className: "text-sm font-medium text-[#1A1A1A]", children: "Mot de passe" }),
                    isLogin && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setIsForgot(true),
                        className: "text-xs text-[#0055A4] font-medium hover:underline underline-offset-2",
                        children: "Mot de passe oublié ?"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx(Lock, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/30" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        id: "password",
                        type: showPassword ? "text" : "password",
                        placeholder: isLogin ? "••••••••" : "Au moins 6 caractères",
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        required: true,
                        minLength: 6,
                        className: "pl-10 pr-10 h-12 rounded-xl border-[#E6EAF0] bg-[#F5F7FA] hover:border-[#0055A4]/30 focus:border-[#0055A4] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,85,164,0.1)] transition-all"
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setShowPassword(!showPassword),
                        className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-[#1A1A1A]/30 hover:text-[#1A1A1A]/60 transition-colors",
                        children: showPassword ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
                      }
                    )
                  ] }),
                  !isLogin && password.length > 0 && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-1", style: { animation: "slideDown 0.2s ease-out" }, children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-1 flex gap-1", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "h-1 flex-1 rounded-full transition-all duration-300",
                        style: { backgroundColor: i <= strength ? strengthColors[strength] : "#E6EAF0" }
                      },
                      i
                    )) }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium", style: { color: strengthColors[strength] }, children: strengthLabels[strength] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: loading,
                    className: "w-full h-12 rounded-xl bg-[#0055A4] hover:bg-[#1B6ED6] text-white font-bold text-base gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2",
                    children: loading ? /* @__PURE__ */ jsx("span", { className: "animate-pulse", children: isLogin ? "Connexion..." : "Création du compte..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      isLogin ? "Se connecter" : "Créer mon compte",
                      /* @__PURE__ */ jsx(ArrowRight, { className: "w-4 h-4" })
                    ] })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-center text-sm text-[#1A1A1A]/50 mt-6", children: [
                isLogin ? "Pas encore de compte ?" : "Déjà un compte ?",
                " ",
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => switchMode(!isLogin),
                    className: "font-semibold text-[#0055A4] hover:underline underline-offset-2",
                    children: isLogin ? "S'inscrire" : "Se connecter"
                  }
                )
              ] })
            ] })
          ]
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:hidden border-t border-[#E6EAF0] p-4 flex items-center justify-center gap-4 text-xs text-[#1A1A1A]/40", children: [
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Shield, { className: "w-3 h-3" }),
          " Données sécurisées"
        ] }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsx("span", { children: "+7 000 questions" }),
        /* @__PURE__ */ jsx("span", { children: "•" }),
        /* @__PURE__ */ jsx("span", { children: "Conforme 2026" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(20px, -30px); }
          66% { transform: translate(-15px, 20px); }
        }
        @keyframes floatAvatar {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-8px); }
        }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      ` })
  ] });
}
export {
  Auth as default
};
