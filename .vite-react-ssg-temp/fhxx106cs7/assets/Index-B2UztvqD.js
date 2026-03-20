import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { B as Button } from "./button-AT0XyJsk.js";
import { u as useLanguage, a as useAuth, c as cn } from "../main.mjs";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { L as LANGUAGES } from "./types-CapR02YX.js";
import { Globe, LayoutDashboard, User, BarChart3, Settings, LogOut, X, Menu, Crown, Sparkles, ArrowRight, CircleCheckBig, Check } from "lucide-react";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem, A as Avatar, d as AvatarImage, e as AvatarFallback, f as DropdownMenuSeparator } from "./avatar-aMrL2e85.js";
import { useState, useEffect, useRef } from "react";
import { L as Logo } from "./Logo-RLfqH6ZW.js";
import { u as useIsMobile } from "./use-mobile-BsFue-bT.js";
import { u as useUserProfile } from "./useUserProfile-BcVuiJUg.js";
import { B as Badge } from "./badge-DObGNgcP.js";
import { S as SubscriptionGate } from "./SubscriptionGate-BJBE68cr.js";
import { F as Footer } from "./Footer-DfL4a8kP.js";
import { S as SEOHead } from "./SEOHead--IrVA0y5.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
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
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "@radix-ui/react-dialog";
function MarketingHeader() {
  var _a;
  const { language, setLanguage, t } = useLanguage();
  const { user, displayName, avatarUrl, signOut } = useAuth();
  const { tier, isStandardOrAbove, isPremium } = useSubscription();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useIsMobile();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const scrollToSection = (id) => {
    var _a2;
    setMobileMenuOpen(false);
    if (location.pathname === "/") {
      (_a2 = document.getElementById(id)) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${id}`);
    }
  };
  const initials = displayName ? displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : ((_a = user == null ? void 0 : user.email) == null ? void 0 : _a.slice(0, 2).toUpperCase()) || "??";
  const tierBadge = isPremium ? { label: "Premium", icon: /* @__PURE__ */ jsx(Crown, { className: "h-3 w-3" }), color: "bg-amber-100 text-amber-700 border-amber-200" } : isStandardOrAbove ? { label: "Standard", icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }), color: "bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20" } : null;
  const navLinks = [
    { label: "Comment ça marche", id: "how-it-works" },
    { label: "Fonctionnalités", id: "features" },
    { label: "Tarifs", id: "pricing" }
  ];
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/85 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-slate-200/60" : "bg-transparent border-b border-transparent"}`,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "container flex h-16 items-center justify-between", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/",
              className: "flex items-center shrink-0",
              onClick: (e) => {
                if (location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              },
              children: /* @__PURE__ */ jsx(Logo, { size: "sm" })
            }
          ),
          /* @__PURE__ */ jsx("nav", { className: "hidden md:flex items-center gap-1", children: navLinks.map((link) => /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => scrollToSection(link.id),
              className: `px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${scrolled ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" : "text-slate-700 hover:text-slate-900 hover:bg-white/40"}`,
              children: link.label
            },
            link.id
          )) }),
          /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center gap-2", children: [
            /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: `p-2 rounded-lg transition-colors text-sm font-medium ${scrolled ? "text-slate-500 hover:bg-slate-100" : "text-slate-600 hover:bg-white/40"}`, children: /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }) }) }),
              /* @__PURE__ */ jsx(DropdownMenuContent, { align: "end", className: "bg-white border shadow-lg rounded-xl", children: Object.entries(LANGUAGES).map(([code, name]) => /* @__PURE__ */ jsx(
                DropdownMenuItem,
                {
                  onClick: () => setLanguage(code),
                  className: language === code ? "bg-primary text-white focus:bg-primary focus:text-white" : "",
                  children: name
                },
                code
              )) })
            ] }),
            user ? /* @__PURE__ */ jsxs(Fragment, { children: [
              tierBadge && /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${tierBadge.color}`, children: [
                tierBadge.icon,
                tierBadge.label
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "text-slate-600 hover:text-slate-900",
                  onClick: () => navigate("/learn"),
                  children: [
                    /* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-1.5 h-4 w-4" }),
                    "Tableau de bord"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(DropdownMenu, { children: [
                /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "ml-1 rounded-full ring-2 ring-slate-200 hover:ring-blue-300 transition-all focus:outline-none", children: /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8", children: [
                  avatarUrl && /* @__PURE__ */ jsx(AvatarImage, { src: avatarUrl, alt: displayName || "" }),
                  /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-blue-50 text-blue-600 text-xs font-semibold", children: initials })
                ] }) }) }),
                /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-48 bg-white border shadow-lg rounded-xl", children: [
                  /* @__PURE__ */ jsxs("div", { className: "px-3 py-2", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-900 truncate", children: displayName }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 truncate", children: user.email })
                  ] }),
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/learn"), children: [
                    /* @__PURE__ */ jsx(User, { className: "mr-2 h-4 w-4" }),
                    " Profil"
                  ] }),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/progress"), children: [
                    /* @__PURE__ */ jsx(BarChart3, { className: "mr-2 h-4 w-4" }),
                    " Progression"
                  ] }),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/learn"), children: [
                    /* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }),
                    " Paramètres"
                  ] }),
                  /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                  /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleSignOut, className: "text-red-500 focus:text-red-500", children: [
                    /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                    " Déconnexion"
                  ] })
                ] })
              ] })
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: `font-medium ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-slate-700"}`,
                  onClick: () => navigate("/auth"),
                  children: "Se connecter"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  size: "sm",
                  className: "bg-[#135bec] hover:bg-[#0f4fd4] text-white font-bold rounded-full px-5 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.03]",
                  onClick: () => navigate("/auth"),
                  children: "Essai Gratuit"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex md:hidden items-center gap-1.5", children: [
            !user && /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                className: "bg-[#135bec] hover:bg-[#0f4fd4] text-white font-bold rounded-full px-4 text-xs shadow-md",
                onClick: () => navigate("/auth"),
                children: "Essai Gratuit"
              }
            ),
            user && /* @__PURE__ */ jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx("button", { className: "rounded-full ring-2 ring-slate-200 hover:ring-blue-300 transition-all focus:outline-none", children: /* @__PURE__ */ jsxs(Avatar, { className: "h-7 w-7", children: [
                avatarUrl && /* @__PURE__ */ jsx(AvatarImage, { src: avatarUrl, alt: displayName || "" }),
                /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-blue-50 text-blue-600 text-[10px] font-semibold", children: initials })
              ] }) }) }),
              /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-48 bg-white border shadow-lg rounded-xl", children: [
                /* @__PURE__ */ jsxs("div", { className: "px-3 py-2", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-900 truncate", children: displayName }),
                  tierBadge && /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tierBadge.color}`, children: [
                    tierBadge.icon,
                    " ",
                    tierBadge.label
                  ] })
                ] }),
                /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/learn"), children: [
                  /* @__PURE__ */ jsx(LayoutDashboard, { className: "mr-2 h-4 w-4" }),
                  " Tableau de bord"
                ] }),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: () => navigate("/progress"), children: [
                  /* @__PURE__ */ jsx(BarChart3, { className: "mr-2 h-4 w-4" }),
                  " Progression"
                ] }),
                /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
                /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleSignOut, className: "text-red-500 focus:text-red-500", children: [
                  /* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }),
                  " Déconnexion"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                className: `p-2 rounded-lg transition-colors ${scrolled ? "text-slate-600 hover:bg-slate-100" : "text-slate-700 hover:bg-white/40"}`,
                "aria-label": "Menu",
                children: mobileMenuOpen ? /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
              }
            )
          ] })
        ] }),
        mobileMenuOpen && isMobile && /* @__PURE__ */ jsx("div", { className: "md:hidden fixed inset-0 top-16 z-40 bg-white/98 backdrop-blur-xl animate-fade-in", children: /* @__PURE__ */ jsxs("nav", { className: "flex flex-col h-full", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex-1 px-6 pt-6 space-y-1", children: [
            navLinks.map((link) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => scrollToSection(link.id),
                className: "w-full text-left px-4 py-3.5 text-lg font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors",
                children: link.label
              },
              link.id
            )),
            user && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => {
                  navigate("/learn");
                  setMobileMenuOpen(false);
                },
                className: "w-full text-left px-4 py-3.5 text-lg font-semibold text-slate-800 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(LayoutDashboard, { className: "h-5 w-5 text-blue-600" }),
                  "Tableau de bord"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "px-6 pb-8 space-y-3 border-t border-slate-100 pt-4", children: [
            !user && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  className: "w-full bg-[#135bec] hover:bg-[#0f4fd4] text-white font-bold rounded-xl py-6 text-base shadow-lg",
                  onClick: () => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  },
                  children: "Commencer l'essai gratuit"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  className: "w-full rounded-xl py-5 text-base font-medium border-slate-200",
                  onClick: () => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  },
                  children: "Se connecter"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 pt-2", children: Object.entries(LANGUAGES).map(([code, name]) => /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setLanguage(code);
                  setMobileMenuOpen(false);
                },
                className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${language === code ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"}`,
                children: name
              },
              code
            )) })
          ] })
        ] }) })
      ]
    }
  );
}
function ParticleMesh() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1e3, y: -1e3 });
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId;
    const particles = [];
    const rect = canvas.getBoundingClientRect();
    let cachedW = rect.width;
    let cachedH = rect.height;
    const COUNT = 70;
    const CONNECT_DIST = 120;
    const MOUSE_RADIUS = 180;
    let needsResize = true;
    const applySize = () => {
      const dpr = devicePixelRatio || 1;
      canvas.width = cachedW * dpr;
      canvas.height = cachedH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      needsResize = false;
    };
    applySize();
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const cr = entry.contentRect;
        cachedW = cr.width;
        cachedH = cr.height;
        needsResize = true;
      }
    });
    ro.observe(canvas);
    const FLAG_COLORS = ["#0055A4", "#FFFFFF", "#EF4135"];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * cachedW,
        y: Math.random() * cachedH,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 1.5 + 0.5,
        color: FLAG_COLORS[Math.floor(Math.random() * FLAG_COLORS.length)]
      });
    }
    const handleMouse = (e) => {
      const rect2 = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect2.left, y: e.clientY - rect2.top };
    };
    canvas.addEventListener("mousemove", handleMouse);
    const draw = () => {
      if (needsResize) applySize();
      const w = cachedW;
      const h = cachedH;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.2;
            const grad = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            const rgbPrimary = hexToRgb(particles[i].color);
            const rgbSecondary = hexToRgb(particles[j].color);
            grad.addColorStop(0, `rgba(${rgbPrimary}, ${alpha})`);
            grad.addColorStop(1, `rgba(${rgbSecondary}, ${alpha})`);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      for (const p of particles) {
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        const brightness = mDist < MOUSE_RADIUS ? 1 : 0.6;
        const rgbColor = hexToRgb(p.color);
        ctx.fillStyle = `rgba(${rgbColor}, ${brightness})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (mDist < MOUSE_RADIUS ? 1.8 : 1.2), 0, Math.PI * 2);
        ctx.fill();
        if (mDist < MOUSE_RADIUS) {
          const alpha = (1 - mDist / MOUSE_RADIUS) * 0.25;
          ctx.strokeStyle = `rgba(${rgbColor}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      canvas.removeEventListener("mousemove", handleMouse);
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "absolute inset-0 h-full w-full opacity-80",
      style: { pointerEvents: "auto" }
    }
  );
}
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "255, 255, 255";
}
function HeroSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);
  const handleStart = () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (profileLoading) return;
    if (!(profile == null ? void 0 : profile.onboarding_completed)) {
      navigate("/onboarding");
      return;
    }
    navigate("/learn");
  };
  return /* @__PURE__ */ jsxs("section", { id: "hero", className: "relative overflow-hidden bg-gradient-to-r from-[#0055A4]/10 via-white via-50% to-[#EF4135]/10 min-h-[80vh] sm:min-h-[90vh] flex items-center justify-center", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0", children: /* @__PURE__ */ jsx(ParticleMesh, {}) }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 pointer-events-none flex items-center justify-center", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "w-[700px] h-[700px] md:w-[900px] md:h-[900px] rounded-full opacity-25",
        style: {
          background: "radial-gradient(circle, transparent 40%, hsl(192 31% 58% / 0.1) 50%, hsl(168 35% 72% / 0.08) 65%, transparent 75%)"
        }
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[50%] rounded-full opacity-15",
          style: { background: "radial-gradient(ellipse, hsl(192 31% 58% / 0.12), hsl(225 48% 25% / 0.06), transparent 70%)" }
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[50%] h-[40%] rounded-full opacity-10",
          style: { background: "radial-gradient(ellipse, hsl(168 35% 72% / 0.1), transparent 70%)" }
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: `hidden md:block absolute top-[15%] left-[5%] xl:left-[10%] transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`, style: { transitionDelay: "600ms" }, children: /* @__PURE__ */ jsxs("div", { className: "bg-white/80 backdrop-blur-md border border-[#E6EAF0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-4 flex items-start gap-4 animate-float max-w-[280px]", style: { animationDelay: "0s" }, children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-xl bg-[#0055A4]/10 flex items-center flex-shrink-0 justify-center border border-[#0055A4]/20", children: /* @__PURE__ */ jsx("span", { className: "text-[#0055A4] font-bold text-sm tracking-widest", children: "Q" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[#1A1A1A] mb-1.5 leading-snug", children: "Quelle est la devise de la République ?" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-[#0055A4]", children: "Liberté, Égalité, Fraternité" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: `hidden md:block absolute top-[40%] right-[3%] xl:right-[6%] transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`, style: { transitionDelay: "800ms" }, children: /* @__PURE__ */ jsxs("div", { className: "bg-white/80 backdrop-blur-md border border-[#E6EAF0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-4 flex items-start gap-4 animate-float max-w-[280px]", style: { animationDelay: "1s" }, children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-xl bg-[#EF4135]/10 flex items-center flex-shrink-0 justify-center border border-[#EF4135]/20", children: /* @__PURE__ */ jsx("span", { className: "text-[#EF4135] font-bold text-sm tracking-widest", children: "Q" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[#1A1A1A] mb-1.5 leading-snug", children: "Qui a écrit La Marseillaise ?" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-[#EF4135]", children: "Rouget de Lisle" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: `hidden md:block absolute bottom-[20%] left-[8%] xl:left-[12%] transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`, style: { transitionDelay: "1000ms" }, children: /* @__PURE__ */ jsxs("div", { className: "bg-white/80 backdrop-blur-md border border-[#E6EAF0] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-2xl p-4 flex items-start gap-4 animate-float max-w-[260px]", style: { animationDelay: "2s" }, children: [
      /* @__PURE__ */ jsx("div", { className: "h-8 w-8 rounded-xl bg-[#F59E0B]/10 flex items-center flex-shrink-0 justify-center border border-[#F59E0B]/20", children: /* @__PURE__ */ jsx("span", { className: "text-[#F59E0B] font-bold text-sm tracking-widest", children: "Q" }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm font-bold text-[#1A1A1A] mb-1.5 leading-snug", children: "En quelle année a eu lieu la Révolution ?" }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] font-semibold text-[#F59E0B]", children: "1789" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 container flex flex-col items-center text-center px-4 py-16 md:py-20", children: [
      /* @__PURE__ */ jsx("div", { className: `mb-8 md:mb-12 transition-all duration-700 flex flex-col items-center justify-center ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}`, children: /* @__PURE__ */ jsx(Logo, { size: "lg", className: "!w-[280px] md:!w-[500px] !h-auto drop-shadow-2xl hover:scale-[1.02] transition-transform duration-500" }) }),
      /* @__PURE__ */ jsx(
        "h1",
        {
          className: `mb-3 font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl md:text-7xl lg:text-8xl transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`,
          style: { transitionDelay: "200ms" },
          children: t("hero.title")
        }
      ),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: `mx-auto mb-6 md:mb-8 h-[2px] w-32 sm:w-48 md:w-72 transition-all duration-700 ${loaded ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`,
          style: {
            background: "linear-gradient(90deg, transparent, hsl(225 48% 25%), hsl(192 31% 58%), hsl(168 35% 72%), transparent)",
            transitionDelay: "400ms"
          }
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `mb-6 md:mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 rounded-2xl sm:rounded-full border border-primary/15 bg-card/60 backdrop-blur-xl px-4 py-2.5 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`,
          style: { transitionDelay: "500ms" },
          children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 text-xs font-semibold", children: [
              /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[hsl(var(--success))] animate-pulse" }),
              /* @__PURE__ */ jsx("span", { className: "text-[hsl(var(--success))]", children: "LIVE" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex -space-x-2", children: [33, 47, 12, 65].map((imgId, i) => /* @__PURE__ */ jsx(
              "img",
              {
                src: `https://i.pravatar.cc/100?img=${imgId}`,
                alt: "User avatar",
                width: 28,
                height: 28,
                className: "h-6 w-6 sm:h-7 sm:w-7 rounded-full border-2 border-card object-cover"
              },
              i
            )) }),
            /* @__PURE__ */ jsx("div", { className: "text-xs sm:text-sm font-bold text-foreground", children: t("hero.subscribers") })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex flex-col items-center gap-3 transition-all duration-700 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`,
          style: { transitionDelay: "700ms" },
          children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                size: "lg",
                variant: "gradient",
                className: "gap-2 px-6 sm:px-8 text-sm sm:text-base font-semibold",
                onClick: handleStart,
                children: [
                  t("hero.startLearning"),
                  /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "lg",
                variant: "outline",
                className: "gap-2 px-6 sm:px-8 text-sm sm:text-base font-medium border-[#0055A4]/20 text-[#0055A4] hover:bg-[#0055A4]/5",
                onClick: () => navigate("/quiz?mode=demo"),
                children: t("hero.demoExam")
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" })
  ] });
}
function useScrollAnimation(options = {}) {
  const { threshold = 0.15, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.unobserve(element);
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);
  return { ref, isVisible };
}
function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up"
}) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const directionStyles = {
    up: "translate-y-8",
    down: "-translate-y-8",
    left: "translate-x-8",
    right: "-translate-x-8"
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: cn(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${directionStyles[direction]}`,
        className
      ),
      style: { transitionDelay: `${delay}ms` },
      children
    }
  );
}
function ExamModeMockup() {
  return /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md mx-auto rounded-2xl border border-border bg-card shadow-xl p-6 space-y-5", children: [
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: "Mode d'examen" }),
    /* @__PURE__ */ jsxs("label", { className: "flex items-start gap-3 cursor-default", children: [
      /* @__PURE__ */ jsx("span", { className: "mt-0.5 h-5 w-5 rounded-full border-[5px] border-[#0055A4] bg-white shrink-0" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground text-sm", children: "Mode Examen" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "40 minutes, aucun feedback pendant l'examen, résultats à la fin uniquement" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "flex items-start gap-3 cursor-default", children: [
      /* @__PURE__ */ jsx("span", { className: "mt-0.5 h-5 w-5 rounded-full border-2 border-border bg-white shrink-0" }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-foreground text-sm", children: "Mode Préparation" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Sans minuteur, choisissez quand voir les réponses" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 rounded-xl border border-border py-2.5 text-center text-sm font-medium text-muted-foreground", children: "Annuler" }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 rounded-xl bg-[#0055A4] py-2.5 text-center text-sm font-bold text-white", children: "Commencer l'examen" })
    ] })
  ] });
}
function Bullet({ children }) {
  return /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsx(CircleCheckBig, { className: "h-5 w-5 shrink-0 mt-0.5 text-[#0055A4]" }),
    /* @__PURE__ */ jsx("span", { className: "text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed", children })
  ] });
}
function ImageFrame({ children, className = "" }) {
  return /* @__PURE__ */ jsx("div", { className: `relative ${className}`, children: /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-border/60 bg-card shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden", children }) });
}
const SECTIONS = [
  {
    id: "practice",
    title: "Entraînez-vous par section",
    titleAccent: "à votre rythme",
    bullets: [
      "Progression synchronisée entre vos appareils",
      "5 sections thématiques correspondant au programme officiel",
      "Progression visible pour chaque section",
      "QCM gratuites pour commencer immédiatement",
      "Mises en situation réalistes pour une préparation complète"
    ],
    imagePosition: "right",
    renderImage: () => /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1 rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/examen-civique-qcm-valeurs-republique-francaise.jpg",
          alt: "Examen civique — quiz sur les valeurs de la République française",
          className: "w-full h-auto",
          loading: "lazy"
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 rounded-2xl border border-border/60 bg-card shadow-xl overflow-hidden", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: "/examen-civique-qcm-institutions-systeme-politique.jpg",
          alt: "Examen civique — quiz sur les institutions et le système politique",
          className: "w-full h-auto",
          loading: "lazy"
        }
      ) })
    ] })
  },
  {
    id: "modes",
    title: "Choisissez votre mode",
    titleAccent: "d'entraînement",
    bullets: [
      "Mode Examen : 45 minutes, résultats à la fin uniquement",
      "Mode Préparation : sans minuteur, voir les réponses quand vous voulez"
    ],
    imagePosition: "left",
    renderImage: () => /* @__PURE__ */ jsx(ExamModeMockup, {})
  },
  {
    id: "exams",
    title: "Testez-vous",
    titleAccent: "avec des examens blancs",
    bullets: [
      "40 questions en conditions réelles, comme le jour J",
      "Examens blancs basés sur les questions officielles",
      "Un test gratuit par niveau"
    ],
    imagePosition: "right",
    renderImage: () => /* @__PURE__ */ jsx(ImageFrame, { children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/examen-civique-resultat-passe.jpg",
        alt: "Examen civique — résultat d'un examen blanc réussi sur GoCivique",
        className: "w-full h-auto",
        loading: "lazy"
      }
    ) })
  },
  {
    id: "parcours",
    title: "Suivez votre parcours",
    titleAccent: "d'apprentissage",
    bullets: [
      "100 cours structurés du plus simple au plus complexe",
      "Flashcards et quiz interactifs dans chaque leçon",
      "3 parcours adaptés : CSP, Carte de Résident, Naturalisation"
    ],
    imagePosition: "left",
    renderImage: () => /* @__PURE__ */ jsx(ImageFrame, { children: /* @__PURE__ */ jsx(
      "img",
      {
        src: "/examen-civique-parcours-100-niveaux-desktop.jpg",
        alt: "Examen civique — parcours de 100 niveaux sur GoCivique",
        className: "w-full h-auto",
        loading: "lazy"
      }
    ) })
  }
];
function LandingFeatures() {
  const { user } = useAuth();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx(Fragment, { children: SECTIONS.map((section, i) => {
    const isImageLeft = section.imagePosition === "left";
    const bgClass = i % 2 === 0 ? "bg-background" : "bg-secondary/30";
    return /* @__PURE__ */ jsx(
      "section",
      {
        className: `${bgClass} py-16 md:py-24 overflow-hidden`,
        children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-6xl px-4", children: /* @__PURE__ */ jsxs("div", { className: "grid items-center gap-10 md:gap-16 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs(
            AnimatedSection,
            {
              direction: isImageLeft ? "right" : "left",
              delay: 100,
              className: isImageLeft ? "md:order-2" : "md:order-1",
              children: [
                /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold sm:text-3xl md:text-[2.25rem] leading-tight text-foreground", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#0055A4] font-serif", children: section.title }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "font-serif", children: section.titleAccent })
                ] }),
                /* @__PURE__ */ jsx("ul", { className: "mt-6 space-y-4", children: section.bullets.map((bullet) => /* @__PURE__ */ jsx(Bullet, { children: bullet }, bullet)) }),
                i === 0 && /* @__PURE__ */ jsx("div", { className: "mt-8", children: /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => navigate(user ? "/learn" : "/auth"),
                    className: "inline-flex items-center gap-2 rounded-xl bg-[#0055A4] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#0055A4]/25 transition-all hover:bg-[#1B6ED6] hover:-translate-y-0.5",
                    children: "Commencer gratuitement"
                  }
                ) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            AnimatedSection,
            {
              direction: isImageLeft ? "left" : "right",
              delay: 250,
              className: isImageLeft ? "md:order-1" : "md:order-2",
              children: section.renderImage()
            }
          )
        ] }) })
      },
      section.id
    );
  }) });
}
function PricingSection() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tier: userTier, isStandardOrAbove, isPremium } = useSubscription();
  const [showGate, setShowGate] = useState(false);
  const [gateTier, setGateTier] = useState("standard");
  const features = [
    { key: "pricing.feat.browse", free: true, standard: true, premium: true },
    { key: "pricing.feat.exam1", free: true, standard: true, premium: true },
    { key: "pricing.feat.classes10", free: true, standard: true, premium: true },
    { key: "pricing.feat.unlimited", free: false, standard: true, premium: true },
    { key: "pricing.feat.training", free: false, standard: true, premium: true },
    { key: "pricing.feat.progress", free: false, standard: true, premium: true },
    { key: "pricing.feat.lessons", free: false, standard: true, premium: true },
    { key: "pricing.feat.path", free: false, standard: true, premium: true },
    { key: "pricing.feat.jumpClasses", free: false, standard: false, premium: true },
    { key: "pricing.feat.translation", free: false, standard: false, premium: true },
    { key: "pricing.feat.catTraining", free: false, standard: false, premium: true }
  ];
  const tiers = [
    {
      id: "free",
      name: "Gratuit",
      price: "0 €",
      period: "",
      popular: false,
      cta: t("pricing.ctaFree"),
      onClick: () => navigate("/auth")
    },
    {
      id: "standard",
      name: "Standard",
      price: "6,99 €",
      period: "/mois",
      popular: true,
      badge: t("pricing.recommended"),
      cta: t("pricing.ctaStandard"),
      onClick: () => {
        setGateTier("standard");
        setShowGate(true);
      }
    },
    {
      id: "premium",
      name: "Premium",
      price: "10,99 €",
      period: "/mois",
      popular: false,
      cta: t("pricing.ctaPremium"),
      onClick: () => {
        setGateTier("premium");
        setShowGate(true);
      }
    }
  ];
  const isUserTier = (tierId) => user && userTier === tierId;
  const isUserAboveTier = (tierId) => {
    if (!user) return false;
    const tierOrder = { free: 0, standard: 1, premium: 2 };
    return (tierOrder[userTier] || 0) > (tierOrder[tierId] || 0);
  };
  return /* @__PURE__ */ jsxs("section", { id: "pricing", className: "relative bg-background py-12 md:py-24 section-glow", children: [
    /* @__PURE__ */ jsxs("div", { className: "container relative z-10 px-4", children: [
      /* @__PURE__ */ jsx(AnimatedSection, { children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-2xl text-center", children: /* @__PURE__ */ jsx("h2", { className: "font-serif text-2xl font-bold sm:text-3xl md:text-4xl", children: /* @__PURE__ */ jsx("span", { className: "gradient-text", children: t("pricing.title") }) }) }) }),
      /* @__PURE__ */ jsx("div", { className: "mx-auto mt-8 md:mt-12 grid max-w-5xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3", children: tiers.map((tier, i) => {
        const isCurrent = isUserTier(tier.id);
        const isBelow = isUserAboveTier(tier.id);
        return /* @__PURE__ */ jsx(AnimatedSection, { delay: i * 150, children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: `glass-card glow-hover relative flex flex-col overflow-hidden p-6 transition-all duration-300 hover:scale-[1.02] ${isCurrent ? tier.id === "free" ? "border-[#1764ac] shadow-[0_0_35px_rgba(23,100,172,0.15)] ring-2 ring-[#1764ac]/30" : "border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.15)] ring-2 ring-emerald-400/30" : tier.id === "standard" && !isBelow ? "border-[#f04e42]/40 shadow-[0_0_35px_rgba(240,78,66,0.15)]" : tier.popular && !isBelow ? "border-primary/40 shadow-[0_0_35px_hsl(var(--primary)/0.2)]" : ""}`,
            children: [
              isCurrent && /* @__PURE__ */ jsx(Badge, { className: `absolute right-4 top-4 text-white border-0 ${tier.id === "free" ? "bg-[#1764ac]" : "bg-emerald-500"}`, children: "✓ Votre forfait" }),
              tier.badge && !isCurrent && /* @__PURE__ */ jsx(
                Badge,
                {
                  className: "absolute right-4 top-4 text-white border-0",
                  style: { background: tier.id === "standard" ? "linear-gradient(135deg, #f04e42, #ff7b6b)" : "linear-gradient(135deg, hsl(263 84% 58%), hsl(239 84% 67%))" },
                  children: tier.badge
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-xl font-bold text-foreground flex items-center gap-2", children: [
                  tier.name,
                  tier.id === "premium" && /* @__PURE__ */ jsx(Crown, { className: "h-4 w-4 text-amber-500" }),
                  tier.id === "standard" && /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4 text-[#f04e42]" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-1 mt-2", children: [
                  /* @__PURE__ */ jsx("span", { className: `font-serif text-4xl font-bold ${tier.id === "free" ? "text-[#1764ac]" : tier.id === "standard" ? "text-[#f04e42]" : "gradient-text"}`, children: tier.price }),
                  tier.period && /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-muted-foreground", children: tier.period })
                ] })
              ] }),
              /* @__PURE__ */ jsx("ul", { className: "mb-6 flex-1 space-y-3 mt-4", children: features.map((feat) => {
                const included = i === 0 ? feat.free : i === 1 ? feat.standard : feat.premium;
                return /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2 text-sm", children: [
                  included ? /* @__PURE__ */ jsx(Check, { className: `h-4 w-4 shrink-0 ${tier.id === "standard" || tier.id === "free" ? "text-[#f04e42]" : "text-primary"}` }) : /* @__PURE__ */ jsx(X, { className: "h-4 w-4 shrink-0 text-muted-foreground/40" }),
                  /* @__PURE__ */ jsx("span", { className: included ? "text-foreground" : "text-muted-foreground/50", children: t(feat.key) })
                ] }, feat.key);
              }) }),
              isCurrent ? /* @__PURE__ */ jsxs(Button, { className: "w-full", variant: "outline", disabled: true, children: [
                /* @__PURE__ */ jsx(Check, { className: "h-4 w-4 mr-2" }),
                " Abonné"
              ] }) : isBelow ? /* @__PURE__ */ jsx(Button, { className: "w-full", variant: "outline", disabled: true, children: "Inclus dans votre forfait" }) : tier.id === "free" ? /* @__PURE__ */ jsx(
                Button,
                {
                  className: "w-full bg-[#0055A4] hover:bg-[#1B6ED6] text-white border-0 shadow-lg shadow-[#0055A4]/25",
                  onClick: tier.onClick,
                  children: tier.cta
                }
              ) : tier.id === "standard" ? /* @__PURE__ */ jsx(
                Button,
                {
                  className: "w-full bg-white text-[#EF4135] border-2 border-[#EF4135] hover:bg-[#EF4135] hover:text-white shadow-lg shadow-[#EF4135]/20 transition-colors",
                  variant: "outline",
                  onClick: tier.onClick,
                  children: tier.cta
                }
              ) : /* @__PURE__ */ jsx(
                Button,
                {
                  className: "w-full text-white border-0 shadow-lg font-semibold hover:opacity-90 transition-opacity",
                  style: { background: "linear-gradient(90deg, #0055A4 33%, #EF4135 100%)" },
                  onClick: tier.onClick,
                  children: tier.cta
                }
              )
            ]
          }
        ) }, tier.name);
      }) })
    ] }),
    /* @__PURE__ */ jsx(SubscriptionGate, { open: showGate, onOpenChange: setShowGate, requiredTier: gateTier })
  ] });
}
function Index() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "L'examen civique est-il obligatoire en 2026 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, à partir du 1er janvier 2026, l'examen civique devient obligatoire pour toute première demande de carte de séjour pluriannuelle, carte de résident ou naturalisation française. Le seuil de réussite est fixé à 80% (32/40)."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de questions comporte l'examen civique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'examen officiel se compose de 40 questions : 28 questions à choix multiples (QCM) et 12 mises en situation, réparties en 5 thèmes. La durée est de 45 minutes sur ordinateur."
        }
      },
      {
        "@type": "Question",
        "name": "Quels sont les 5 thèmes de l'examen civique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les 5 thèmes sont : 1) Principes et valeurs de la République (11 questions), 2) Institutions et système politique (6 questions), 3) Droits et devoirs (11 questions), 4) Histoire, géographie et culture (8 questions), 5) Vivre en société (4 questions)."
        }
      },
      {
        "@type": "Question",
        "name": "Où passer l'examen civique pour la naturalisation ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "L'examen se déroule dans des centres agréés par Le français des affaires (CCI Paris Île-de-France), désigné par le Ministère de l'Intérieur, en France métropolitaine et outre-mer."
        }
      },
      {
        "@type": "Question",
        "name": "Le résultat de l'examen civique est-il valable à vie ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, une fois l'examen civique réussi, votre résultat est valable à vie. Vous n'aurez pas besoin de le repasser."
        }
      },
      {
        "@type": "Question",
        "name": "Comment se préparer à l'examen civique 2026 ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pour préparer l'examen civique 2026, révisez les 5 thèmes officiels (principes républicains, institutions, droits et devoirs, histoire-géographie, vie en société) couvrant 40 questions en 45 minutes avec un seuil de réussite de 80%. Entraînez-vous avec des quiz par catégorie et des examens blancs chronométrés qui reproduisent les conditions réelles. 15 minutes par jour pendant une semaine suffisent généralement pour atteindre le niveau requis. GoCivique propose cette préparation complète avec un essai gratuit."
        }
      },
      {
        "@type": "Question",
        "name": "L'examen civique est-il obligatoire pour la carte de séjour temporaire ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Non, l'examen civique n'est pas obligatoire pour la carte de séjour temporaire d'un an. Il est requis uniquement pour la carte de séjour pluriannuelle, la carte de résident et la naturalisation."
        }
      },
      {
        "@type": "Question",
        "name": "Quel est le taux de réussite à l'examen civique ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le seuil de réussite est de 80%, soit 32 bonnes réponses sur 40. 1 point par bonne réponse, pas de point négatif. Avec GoCivique, nos utilisateurs atteignent un score moyen de 85% après entraînement."
        }
      }
    ]
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(
      SEOHead,
      {
        path: "/",
        descriptionKey: "seo.indexDesc",
        schema: faqSchema
      }
    ),
    /* @__PURE__ */ jsx(MarketingHeader, {}),
    /* @__PURE__ */ jsxs("main", { className: "pt-16", children: [
      /* @__PURE__ */ jsx(HeroSection, {}),
      /* @__PURE__ */ jsx(LandingFeatures, {}),
      /* @__PURE__ */ jsx(PricingSection, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Index as default
};
