import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import * as React from "react";
import { useState } from "react";
import { c as cn, u as useLanguage, a as useAuth, s as supabase } from "../main.mjs";
import { B as Button } from "./button-AT0XyJsk.js";
import { L as Label, I as Input } from "./label-CpX0ua28.js";
import { toast } from "sonner";
import { Mail, MessageSquare, Send, AlertCircle } from "lucide-react";
import { H as Header } from "./Header-CzgIuffk.js";
import { F as Footer } from "./Footer-DfL4a8kP.js";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import "react-dom/client";
import "react-router-dom";
import "@supabase/supabase-js";
import "react-helmet-async";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "@radix-ui/react-slot";
import "@radix-ui/react-label";
import "./useSubscription-Cz7bDEZd.js";
import "./types-CapR02YX.js";
import "./avatar-aMrL2e85.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./Logo-RLfqH6ZW.js";
import "./use-mobile-BsFue-bT.js";
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      className: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ref,
      ...props
    }
  );
});
Textarea.displayName = "Textarea";
function Contact() {
  useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: (user == null ? void 0 : user.email) || "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          type: "contact",
          data: {
            name: formData.name,
            email: formData.email,
            subject: formData.subject || "Nouveau message de contact",
            message: formData.message,
            userId: user == null ? void 0 : user.id
          }
        }
      });
      if (error) throw error;
      toast.success("Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.");
      setFormData({
        name: "",
        email: (user == null ? void 0 : user.email) || "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error(
        "Erreur d'envoi. Vous pouvez nous contacter directement à gocivique@gmail.com",
        { duration: 8e3 }
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        path: "/contact",
        title: "Contact — GoCivique",
        description: "Contactez l'équipe GoCivique pour toute question, remarque ou demande d'assistance concernant votre préparation à l'évaluation civique."
      }
    ),
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 pt-24 pb-16", children: /* @__PURE__ */ jsxs("div", { className: "container px-4 max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-12 animate-fade-in-up", children: [
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl md:text-5xl font-black font-serif text-slate-900 mb-4 tracking-tight", children: [
          "Contactez-",
          /* @__PURE__ */ jsx("span", { className: "text-[#135bec]", children: "nous" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-slate-500 max-w-2xl mx-auto", children: "Une question ? Un problème technique ? Une suggestion ? N'hésitez pas à nous écrire, notre équipe vous répondra dans les meilleurs délais." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-3 gap-8 md:gap-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-8 md:col-span-1 animate-fade-in-up", style: { animationDelay: "100ms" }, children: [
          /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-6 border-l-4 border-[#135bec]", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-[#135bec]/10 p-3 rounded-full", children: /* @__PURE__ */ jsx(Mail, { className: "h-6 w-6 text-[#135bec]" }) }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-slate-800", children: "Email" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm mb-1", children: "Notre équipe de support" }),
            /* @__PURE__ */ jsx("a", { href: "mailto:gocivique@gmail.com", className: "text-[#135bec] font-semibold hover:underline", children: "gocivique@gmail.com" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "glass-card rounded-2xl p-6 border-l-4 border-emerald-500", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-3", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-emerald-500/10 p-3 rounded-full", children: /* @__PURE__ */ jsx(MessageSquare, { className: "h-6 w-6 text-emerald-600" }) }),
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-lg text-slate-800", children: "Support Client" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-slate-500 text-sm", children: "Nous répondons généralement en moins de 24 heures les jours ouvrés." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-2 glass-card rounded-3xl p-6 md:p-8 animate-fade-in-up", style: { animationDelay: "200ms" }, children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "name", className: "text-slate-700 font-semibold", children: [
                "Nom complet ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "name",
                  name: "name",
                  placeholder: "Jean Dupont",
                  value: formData.name,
                  onChange: handleChange,
                  className: "border-slate-200 bg-white/50 focus-visible:ring-[#135bec]",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxs(Label, { htmlFor: "email", className: "text-slate-700 font-semibold", children: [
                "Adresse email ",
                /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "email",
                  name: "email",
                  type: "email",
                  placeholder: "jean.dupont@email.com",
                  value: formData.email,
                  onChange: handleChange,
                  className: "border-slate-200 bg-white/50 focus-visible:ring-[#135bec]",
                  required: true
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "subject", className: "text-slate-700 font-semibold", children: "Sujet Optionnel" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "subject",
                name: "subject",
                placeholder: "Ex: Problème de facturation, Question sur une leçon...",
                value: formData.subject,
                onChange: handleChange,
                className: "border-slate-200 bg-white/50 focus-visible:ring-[#135bec]"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs(Label, { htmlFor: "message", className: "text-slate-700 font-semibold", children: [
              "Votre message ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsx(
              Textarea,
              {
                id: "message",
                name: "message",
                placeholder: "Comment pouvons-nous vous aider ?",
                rows: 6,
                value: formData.message,
                onChange: handleChange,
                className: "border-slate-200 bg-white/50 focus-visible:ring-[#135bec] resize-none",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              className: "w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold h-12 rounded-xl text-lg flex items-center gap-2",
              disabled: isSubmitting,
              children: isSubmitting ? "Envoi en cours..." : /* @__PURE__ */ jsxs(Fragment, { children: [
                "Envoyer le message ",
                /* @__PURE__ */ jsx(Send, { className: "h-5 w-5" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-center text-slate-400 mt-4 flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsx(AlertCircle, { className: "h-3 w-3" }),
            " Vos données sont protégées et ne seront utilisées que pour vous répondre."
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Contact as default
};
