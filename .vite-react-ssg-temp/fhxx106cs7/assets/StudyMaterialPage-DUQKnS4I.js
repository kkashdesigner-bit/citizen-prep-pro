import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { B as Button } from "./button-AT0XyJsk.js";
import { ArrowLeft, BookOpen, Construction } from "lucide-react";
import { L as LearnSidebar } from "./LearnSidebar-BzOBVmNx.js";
import "react";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "../main.mjs";
import "react-dom/client";
import "@supabase/supabase-js";
import "react-helmet-async";
import "@radix-ui/react-toast";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "./useUserProfile-BcVuiJUg.js";
import "./useSubscription-Cz7bDEZd.js";
import "./Logo-RLfqH6ZW.js";
import "framer-motion";
function StudyMaterialPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(LearnSidebar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 md:ml-64 pb-20 md:pb-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 md:px-8 py-6 md:py-8", children: [
      /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "mb-4 gap-2", onClick: () => navigate("/learn"), children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Tableau de bord"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "h-7 w-7 text-primary" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Matériel d'étude" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border/40 bg-card p-8 text-center", children: [
        /* @__PURE__ */ jsx(Construction, { className: "mx-auto h-12 w-12 text-muted-foreground mb-4" }),
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-foreground mb-2", children: "Page en construction" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Les fiches de révision, résumés et supports d'étude seront bientôt disponibles." }),
        /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => navigate("/learn"), children: "Retour au tableau de bord" })
      ] })
    ] }) })
  ] });
}
export {
  StudyMaterialPage as default
};
