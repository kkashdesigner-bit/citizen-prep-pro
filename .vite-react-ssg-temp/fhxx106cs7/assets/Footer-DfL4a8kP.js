import { jsx, jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { u as useLanguage } from "../main.mjs";
import { ShieldCheck, Mail, AlertTriangle, MapPin } from "lucide-react";
import { L as Logo } from "./Logo-RLfqH6ZW.js";
const Footer = forwardRef(function Footer2(_, ref) {
  const { t } = useLanguage();
  const location = useLocation();
  const handlePricingClick = (e) => {
    var _a;
    if (location.pathname === "/") {
      e.preventDefault();
      (_a = document.getElementById("pricing")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }
  };
  return /* @__PURE__ */ jsx("footer", { ref, className: "border-t border-border/50 bg-white pt-16 pb-8", children: /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center gap-1 mb-2", children: /* @__PURE__ */ jsx(Logo, { size: "sm" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: t("footer.desc") }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "w-5 h-5 text-[hsl(var(--success))]" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground", children: t("footer.securePayment") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 mt-1 opacity-70", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider", children: "VISA" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider", children: "MASTERCARD" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider", children: "APPLE PAY" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider", children: "GOOGLE PAY" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-foreground/60 border border-foreground/20 rounded px-2 py-0.5 tracking-wider", children: "PAYPAL" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground mb-2 uppercase tracking-wider text-xs", children: t("footer.preparation") }),
        /* @__PURE__ */ jsx(Link, { to: "/exams", className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: t("footer.exams") }),
        /* @__PURE__ */ jsx(Link, { to: "/quiz", className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: t("footer.quiz") }),
        /* @__PURE__ */ jsx(Link, { to: "/about", className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: t("footer.understand") }),
        /* @__PURE__ */ jsx("a", { href: "#", className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: t("footer.booklet") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground mb-2 uppercase tracking-wider text-xs", children: t("footer.nav") }),
        /* @__PURE__ */ jsx(Link, { to: "/#pricing", onClick: handlePricingClick, className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: t("footer.offers") }),
        /* @__PURE__ */ jsx(Link, { to: "/auth", className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: t("footer.memberSpace") }),
        /* @__PURE__ */ jsxs(Link, { to: "/contact", className: "text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
          " ",
          t("footer.support")
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground mb-2 uppercase tracking-wider text-xs", children: t("footer.legal") }),
        /* @__PURE__ */ jsx(Link, { to: "/terms", className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: t("footer.terms") }),
        /* @__PURE__ */ jsx(Link, { to: "/privacy", className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: t("footer.privacy") }),
        /* @__PURE__ */ jsx(Link, { to: "/refunds", className: "text-sm text-muted-foreground hover:text-primary transition-colors", children: t("footer.refunds") })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-[#F5F7FA] rounded-2xl p-5 mb-8 border border-[#E6EAF0]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "mt-0.5 h-5 w-5 shrink-0 text-amber-500" }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
        /* @__PURE__ */ jsx("strong", { children: t("footer.warning") }),
        " ",
        t("footer.disclaimerFull")
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "border-t border-border/50 pt-8 flex flex-col items-center justify-center text-center gap-2", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: t("footer.rights") }),
      /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground/60 flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(MapPin, { className: "w-3 h-3" }),
        " ",
        t("footer.madeWith")
      ] })
    ] })
  ] }) });
});
Footer.displayName = "Footer";
export {
  Footer as F
};
