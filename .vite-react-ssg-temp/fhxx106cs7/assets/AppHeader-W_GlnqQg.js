import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { a as useAuth } from "../main.mjs";
import { u as useUserProfile } from "./useUserProfile-BcVuiJUg.js";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { ChevronLeft, Flame, User, BarChart3, Settings, LogOut, Crown, Sparkles } from "lucide-react";
import { D as DropdownMenu, a as DropdownMenuTrigger, A as Avatar, d as AvatarImage, e as AvatarFallback, b as DropdownMenuContent, f as DropdownMenuSeparator, c as DropdownMenuItem } from "./avatar-aMrL2e85.js";
import { L as Logo } from "./Logo-RLfqH6ZW.js";
function AppHeader({ pageTitle, pageIcon, backTo = "/learn", backLabel = "Tableau de bord" }) {
  var _a;
  const { user, displayName, avatarUrl, signOut } = useAuth();
  const { profile: userProfile } = useUserProfile();
  const { tier, isPremium, isStandardOrAbove } = useSubscription();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const finalDisplayName = (userProfile == null ? void 0 : userProfile.first_name) || displayName || ((_a = user == null ? void 0 : user.email) == null ? void 0 : _a.split("@")[0]) || "";
  const finalAvatarUrl = (userProfile == null ? void 0 : userProfile.avatar_url) || avatarUrl;
  const initials = finalDisplayName ? finalDisplayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "??";
  const tierConfig = isPremium ? { label: "Premium", icon: /* @__PURE__ */ jsx(Crown, { className: "h-3 w-3" }), color: "bg-amber-100 text-amber-700 border-amber-200" } : isStandardOrAbove ? { label: "Standard", icon: /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }), color: "bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20" } : { label: "Gratuit", icon: null, color: "bg-[#f04e42]/10 text-[#f04e42] border-[#f04e42]/20" };
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]", children: /* @__PURE__ */ jsxs("div", { className: "flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3 min-w-0", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/"),
          className: "hidden sm:block shrink-0",
          children: /* @__PURE__ */ jsx(Logo, { size: "sm" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "hidden sm:block h-6 w-px bg-slate-200" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate(backTo),
          className: "flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors shrink-0",
          children: [
            /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: backLabel })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 absolute left-1/2 -translate-x-1/2", children: [
      pageIcon && /* @__PURE__ */ jsx("span", { className: "text-[#135bec]", children: pageIcon }),
      /* @__PURE__ */ jsx("h1", { className: "text-sm sm:text-base font-bold text-slate-900 whitespace-nowrap", children: pageTitle })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 sm:gap-3", children: [
      /* @__PURE__ */ jsxs("div", { className: "hidden sm:flex items-center gap-1 text-sm font-bold text-orange-500", children: [
        /* @__PURE__ */ jsx(Flame, { className: "h-4 w-4 fill-orange-500" }),
        /* @__PURE__ */ jsx("span", { children: "0" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: `hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${tierConfig.color}`, children: [
        tierConfig.icon,
        tierConfig.label
      ] }),
      /* @__PURE__ */ jsxs(DropdownMenu, { children: [
        /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs("button", { className: "relative rounded-full ring-2 ring-slate-200 hover:ring-blue-300 transition-all focus:outline-none", children: [
          /* @__PURE__ */ jsxs(Avatar, { className: "h-8 w-8", children: [
            finalAvatarUrl && /* @__PURE__ */ jsx(AvatarImage, { src: finalAvatarUrl, alt: finalDisplayName }),
            /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-blue-50 text-blue-600 text-xs font-semibold", children: initials })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "sm:hidden absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-orange-500 text-white text-[8px] font-bold ring-2 ring-white", children: /* @__PURE__ */ jsx(Flame, { className: "h-2.5 w-2.5 fill-white" }) })
        ] }) }),
        /* @__PURE__ */ jsxs(DropdownMenuContent, { align: "end", className: "w-52 bg-white border shadow-lg rounded-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-3 py-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-900 truncate", children: finalDisplayName }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-400 truncate", children: user == null ? void 0 : user.email }),
            /* @__PURE__ */ jsxs("span", { className: `inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${tierConfig.color}`, children: [
              tierConfig.icon,
              " ",
              tierConfig.label
            ] })
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
    ] })
  ] }) });
}
export {
  AppHeader as A
};
