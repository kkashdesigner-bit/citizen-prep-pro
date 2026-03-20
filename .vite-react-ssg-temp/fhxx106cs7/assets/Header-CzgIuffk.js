import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { B as Button } from "./button-AT0XyJsk.js";
import { u as useLanguage, a as useAuth } from "../main.mjs";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { L as LANGUAGES } from "./types-CapR02YX.js";
import { Globe, LayoutDashboard, User, BarChart3, Settings, LogOut, X, Menu } from "lucide-react";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem, A as Avatar, d as AvatarImage, e as AvatarFallback, f as DropdownMenuSeparator } from "./avatar-aMrL2e85.js";
import { useState, useEffect } from "react";
import { L as Logo } from "./Logo-RLfqH6ZW.js";
import { u as useIsMobile } from "./use-mobile-BsFue-bT.js";
function Header({ animate = false }) {
  var _a;
  const { language, setLanguage, t } = useLanguage();
  const { user, displayName, avatarUrl, signOut } = useAuth();
  const { isStandardOrAbove } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [loaded, setLoaded] = useState(!animate);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setLoaded(true), 50);
      return () => clearTimeout(timer);
    }
  }, [animate]);
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const handlePricingClick = (e) => {
    var _a2;
    if (location.pathname === "/") {
      e.preventDefault();
      (_a2 = document.getElementById("pricing")) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/#pricing");
    }
    setMobileMenuOpen(false);
  };
  const initials = displayName ? displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : ((_a = user == null ? void 0 : user.email) == null ? void 0 : _a.slice(0, 2).toUpperCase()) || "??";
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: `sticky top-0 z-50 border-b border-primary/10 bg-background/60 backdrop-blur-xl transition-all duration-500 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "container flex h-14 sm:h-16 items-center justify-between", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center glow-hover rounded-lg p-1", children: /* @__PURE__ */ jsx(Logo, { size: "sm" }) }),
          /* @__PURE__ */ jsxs("nav", { className: "hidden sm:flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "glow-hover", onClick: handlePricingClick, children: t("nav.pricing") }),
            /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "glow-hover", onClick: () => navigate("/about"), children: t("nav.about") }),
            /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "gap-2 glow-hover", "aria-label": "Select language", children: [
                /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "hidden md:inline", children: LANGUAGES[language] })
              ] }) }),
              /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", className: "glass-card", children: Object.entries(LANGUAGES).map(([code, name]) => /* @__PURE__ */ jsx(
                DropdownMenuItem,
                {
                  onClick: () => setLanguage(code),
                  className: language === code ? "bg-primary/10" : "",
                  children: name
                },
                code
              )) })
            ] }),
            user ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "glow-hover", onClick: () => navigate("/learn"), children: [
                /* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-1.5 h-4 w-4" }),
                t("nav.learn") || "Tableau de bord"
              ] }),
              !isStandardOrAbove && /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "glow-hover", onClick: () => navigate("/quiz?mode=exam"), children: t("nav.demo") }),
              /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "ml-1 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all focus:outline-none", children: /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8", children: [
                  avatarUrl && /* @__PURE__ */ jsx(AvatarImage, { src: avatarUrl, alt: displayName || "" }),
                  /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary/15 text-primary text-xs font-semibold", children: initials })
                ] }) }) }),
                /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "glass-card w-48", children: [
                  /* @__PURE__ */ jsxs("div", { className: "px-3 py-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground truncate", children: displayName }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground truncate", children: user.email })
                  ] }),
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/learn"), children: [
                    /* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }),
                    "Profil"
                  ] }),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/progress"), children: [
                    /* @__PURE__ */ jsx(BarChart3, { className: "mr-2 h-4 w-4" }),
                    "Progression"
                  ] }),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/learn"), children: [
                    /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
                    "Paramètres"
                  ] }),
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleSignOut, className: "text-destructive focus:text-destructive", children: [
                    /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                    "Déconnexion"
                  ] })
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "glow-hover", onClick: () => navigate("/quiz?mode=exam"), children: t("nav.demo") }),
              /* @__PURE__ */ jsx(Button, { variant: "gradient", size: "sm", className: "btn-glow", onClick: () => navigate("/auth"), children: t("nav.login") })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex sm:hidden items-center gap-1", children: [
            user && /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all focus:outline-none", children: /* @__PURE__ */ jsxs(Avatar, { className: "h-7 w-7", children: [
                avatarUrl && /* @__PURE__ */ jsx(AvatarImage, { src: avatarUrl, alt: displayName || "" }),
                /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-primary/15 text-primary text-[10px] font-semibold", children: initials })
              ] }) }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "glass-card w-48", children: [
                /* @__PURE__ */ jsx("div", { className: "px-3 py-2", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground truncate", children: displayName }) }),
                /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/learn"), children: [
                  /* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }),
                  "Profil"
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/progress"), children: [
                  /* @__PURE__ */ jsx(BarChart3, { className: "mr-2 h-4 w-4" }),
                  "Progression"
                ] }),
                /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleSignOut, className: "text-destructive focus:text-destructive", children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                  "Déconnexion"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "glow-hover",
                onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                "aria-label": "Toggle menu",
                children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
              }
            )
          ] })
        ] }),
        mobileMenuOpen && isMobile && /* @__PURE__ */ jsx("div", { className: "sm:hidden border-t border-primary/10 bg-background/95 backdrop-blur-xl animate-fade-in", children: /* @__PURE__ */ jsxs("nav", { className: "container flex flex-col gap-1 py-3", children: [
          user && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "justify-start glow-hover",
              onClick: () => {
                navigate("/learn");
                setMobileMenuOpen(false);
              },
              children: [
                /* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-2 h-4 w-4" }),
                "Tableau de bord"
              ]
            }
          ),
          /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", className: "justify-start glow-hover", onClick: handlePricingClick, children: t("nav.pricing") }),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "justify-start glow-hover",
              onClick: () => {
                navigate("/about");
                setMobileMenuOpen(false);
              },
              children: t("nav.about")
            }
          ),
          (!user || !isStandardOrAbove) && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "justify-start glow-hover",
              onClick: () => {
                navigate("/quiz?mode=exam");
                setMobileMenuOpen(false);
              },
              children: t("nav.demo")
            }
          ),
          !user && /* @__PURE__ */ jsx(
            Button,
            {
              variant: "gradient",
              size: "sm",
              className: "btn-glow mt-1",
              onClick: () => {
                navigate("/auth");
                setMobileMenuOpen(false);
              },
              children: t("nav.login")
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5 pt-2 border-t border-border/50 mt-2", children: Object.entries(LANGUAGES).map(([code, name]) => /* @__PURE__ */ jsx(
            Button,
            {
              variant: language === code ? "secondary" : "ghost",
              size: "sm",
              className: "text-xs",
              onClick: () => {
                setLanguage(code);
                setMobileMenuOpen(false);
              },
              children: name
            },
            code
          )) })
        ] }) })
      ]
    }
  );
}
export {
  Header as H
};
