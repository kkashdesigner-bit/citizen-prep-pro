import { jsxs, jsx } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { B as Button } from "./button-AT0XyJsk.js";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { L as LearnSidebar } from "./LearnSidebar-BzOBVmNx.js";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
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
function AnalyticsPage() {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(SEOHead, { noindex: true }),
    /* @__PURE__ */ jsx(LearnSidebar, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1 md:ml-64 pb-20 md:pb-8", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl px-4 md:px-8 py-6 md:py-8", children: [
      /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "mb-4 gap-2", onClick: () => navigate("/learn"), children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Tableau de bord"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsx(BarChart3, { className: "h-7 w-7 text-primary" }),
        /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Analyses" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mb-4", children: "Pour une vue détaillée de votre progression, consultez la page Progression." }),
      /* @__PURE__ */ jsxs(Button, { className: "gap-2", onClick: () => navigate("/progress"), children: [
        /* @__PURE__ */ jsx(BarChart3, { className: "h-4 w-4" }),
        " Voir ma progression"
      ] })
    ] }) })
  ] });
}
export {
  AnalyticsPage as default
};
