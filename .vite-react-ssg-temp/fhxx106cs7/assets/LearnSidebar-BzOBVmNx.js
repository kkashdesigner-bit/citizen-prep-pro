import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { a as useAuth, s as supabase } from "../main.mjs";
import { u as useUserProfile } from "./useUserProfile-BcVuiJUg.js";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { useState, useEffect } from "react";
import { L as Logo } from "./Logo-RLfqH6ZW.js";
import { LogOut, LayoutDashboard, FileText, Route, GraduationCap, Settings, HelpCircle, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
const CATEGORY_LABELS = {
  "Principles and values of the Republic": { label: "Fondamentaux", color: "#3B82F6" },
  "Institutional and political system": { label: "Institutions", color: "#8B5CF6" },
  "Rights and duties": { label: "Droits & Devoirs", color: "#22C55E" },
  "History, geography and culture": { label: "Histoire & Culture", color: "#F59E0B" },
  "Living in French society": { label: "Vie en société", color: "#06B6D4" }
};
const ALL_DB_CATEGORIES = Object.keys(CATEGORY_LABELS);
function computeStreak(examHistory) {
  if (examHistory.length === 0) return 0;
  const dates = [...new Set(examHistory.map((e) => {
    var _a;
    return (_a = e.date) == null ? void 0 : _a.split("T")[0];
  }).filter(Boolean))].sort().reverse();
  if (dates.length === 0) return 0;
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  for (let i = 0; i < dates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = expectedDate.toISOString().split("T")[0];
    if (dates[i] === expected) {
      streak++;
    } else if (i === 0) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (dates[i] === yesterday.toISOString().split("T")[0]) {
        streak = 1;
      } else {
        break;
      }
    } else {
      break;
    }
  }
  return streak;
}
function computeWeeklyActivity(answers) {
  const result = [0, 0, 0, 0, 0, 0, 0];
  const now = /* @__PURE__ */ new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek + 6) % 7);
  monday.setHours(0, 0, 0, 0);
  for (const ans of answers) {
    const ansDate = new Date(ans.answered_at);
    if (ansDate >= monday) {
      const ansDay = ansDate.getDay();
      const idx = (ansDay + 6) % 7;
      result[idx]++;
    }
  }
  return result;
}
function computeDomainMastery(answers) {
  const catMap = {};
  for (const cat of ALL_DB_CATEGORIES) {
    catMap[cat] = { correct: 0, total: 0 };
  }
  for (const ans of answers) {
    if (ans.category && catMap[ans.category]) {
      catMap[ans.category].total++;
      if (ans.is_correct) catMap[ans.category].correct++;
    }
  }
  return ALL_DB_CATEGORIES.map((cat) => {
    const data = catMap[cat];
    const percent = data.total > 0 ? Math.round(data.correct / data.total * 100) : 0;
    const info = CATEGORY_LABELS[cat];
    return { label: info.label, percent, color: info.color, total: data.total, correct: data.correct, dbCategory: cat };
  });
}
function computeWeaknessAlerts(mastery) {
  const WEAKNESS_MESSAGES = {
    "Fondamentaux": "Réviser les valeurs et principes républicains",
    "Institutions": "Revoir le fonctionnement des institutions françaises",
    "Droits & Devoirs": "Approfondir les droits et devoirs du citoyen",
    "Histoire & Culture": "Consolider les repères historiques et culturels",
    "Vie en société": "Compléter les connaissances sur la vie quotidienne"
  };
  return mastery.filter((d) => d.total > 0 && d.percent < 70).sort((a, b) => a.percent - b.percent).slice(0, 3).map((d) => ({
    domain: d.label,
    message: WEAKNESS_MESSAGES[d.label] || "Points à améliorer",
    category: d.dbCategory,
    color: d.color
  }));
}
function buildRecentActivity(examHistory, answers, classProgress) {
  var _a, _b, _c;
  const items = [];
  for (const exam of examHistory.slice(-10).reverse()) {
    const date = ((_a = exam.date) == null ? void 0 : _a.split("T")[0]) || "";
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
    const relativeDate = date === today ? "Aujourd'hui" : date === yesterday ? "Hier" : date;
    let title = "Examen Blanc";
    if (exam.category) {
      title = `Quiz : ${((_b = CATEGORY_LABELS[exam.category]) == null ? void 0 : _b.label) || exam.category}`;
    } else if (exam.mode === "demo") {
      title = "Examen Démo";
    } else if (exam.classId) {
      title = "Quiz Parcours";
    } else if (exam.mode === "training") {
      title = "Entraînement";
    } else if (exam.mode === "study") {
      title = "Étude";
    }
    items.push({
      type: "exam",
      title,
      date: relativeDate,
      detail: `${exam.score}/${exam.totalQuestions} — ${Math.round(exam.score / exam.totalQuestions * 100)}%`
    });
  }
  for (const cp of classProgress.slice(0, 5)) {
    const date = ((_c = cp.completed_at) == null ? void 0 : _c.split("T")[0]) || "";
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0];
    const relativeDate = date === today ? "Aujourd'hui" : date === yesterday ? "Hier" : date;
    items.push({
      type: "milestone",
      title: `Classe ${cp.class_number} : ${cp.title}`,
      date: relativeDate,
      detail: `Score : ${cp.score}%`
    });
  }
  items.sort((a, b) => b.date > a.date ? 1 : -1);
  if (items.length === 0) {
    items.push({
      type: "milestone",
      title: "Commencez votre premier quiz !",
      date: "Aujourd'hui",
      detail: "🚀 Prêt à démarrer"
    });
  }
  return items.slice(0, 5);
}
function useDashboardStats() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [examHistory, setExamHistory] = useState([]);
  const [allAnswers, setAllAnswers] = useState([]);
  const [classCompletions, setClassCompletions] = useState([]);
  useEffect(() => {
    if (authLoading || !user) {
      if (!authLoading) setLoading(false);
      return;
    }
    const fetchAll = async () => {
      const [profileResult, answersResult] = await Promise.all([
        supabase.from("profiles").select("display_name, email, exam_history, total_questions_seen, avatar_url").eq("id", user.id).maybeSingle(),
        supabase.from("user_answers").select("answered_at, category, is_correct").eq("user_id", user.id).order("answered_at", { ascending: false }).limit(500)
      ]);
      const p = profileResult.data;
      setDisplayName((p == null ? void 0 : p.display_name) || (p == null ? void 0 : p.email) || "");
      setAvatarUrl((p == null ? void 0 : p.avatar_url) || null);
      const history = p == null ? void 0 : p.exam_history;
      setExamHistory(Array.isArray(history) ? history : []);
      setAllAnswers(answersResult.data || []);
      const { data: progressData } = await supabase.from("user_class_progress").select("class_id, score, completed_at").eq("user_id", user.id).eq("status", "completed").order("completed_at", { ascending: false }).limit(10);
      if (progressData && progressData.length > 0) {
        const classIds = progressData.map((p2) => p2.class_id);
        const { data: classInfo } = await supabase.from("classes").select("id, class_number, title").in("id", classIds);
        const classMap = {};
        (classInfo || []).forEach((c) => {
          classMap[c.id] = c;
        });
        setClassCompletions(
          progressData.filter((p2) => classMap[p2.class_id]).map((p2) => ({
            class_number: classMap[p2.class_id].class_number,
            title: classMap[p2.class_id].title,
            completed_at: p2.completed_at || "",
            score: p2.score || 0
          }))
        );
      }
      setLoading(false);
    };
    fetchAll();
  }, [user, authLoading]);
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const examsToday = examHistory.filter((e) => {
    var _a;
    return (_a = e.date) == null ? void 0 : _a.startsWith(today);
  }).length;
  const answeredToday = allAnswers.filter((a) => {
    var _a;
    return (_a = a.answered_at) == null ? void 0 : _a.startsWith(today);
  }).length;
  const successRate = allAnswers.length > 0 ? Math.round(allAnswers.filter((a) => a.is_correct).length / allAnswers.length * 100) : 0;
  const streak = computeStreak(examHistory);
  const dailyGoalTarget = 100;
  const dailyGoalCurrent = Math.min(answeredToday, dailyGoalTarget);
  const weeklyActivity = computeWeeklyActivity(allAnswers);
  const domainMastery = computeDomainMastery(allAnswers);
  const weaknessAlerts = computeWeaknessAlerts(domainMastery);
  const recentActivity = buildRecentActivity(examHistory, allAnswers, classCompletions);
  const totalXP = allAnswers.filter((a) => a.is_correct).length * 10;
  return {
    loading: loading || authLoading,
    displayName,
    avatarUrl,
    examHistory,
    successRate,
    streak,
    dailyGoalCurrent,
    dailyGoalTarget,
    weeklyActivity,
    domainMastery,
    weaknessAlerts,
    recentActivity,
    examsToday,
    canTakeExamFree: examsToday < 1,
    totalXP
  };
}
const NAV_ITEMS = [
  { key: "dashboard", icon: LayoutDashboard, path: "/learn", label: "Tableau de bord" },
  { key: "exams", icon: FileText, path: "/exams", label: "Examens" },
  { key: "path", icon: Route, path: "/parcours", label: "Parcours 1→100" },
  { key: "courses", icon: GraduationCap, path: "/courses", label: "Cours" },
  { key: "settings", icon: Settings, path: "/settings", label: "Paramètres" },
  { key: "help", icon: HelpCircle, path: "/about", label: "Aide" }
];
const MOBILE_NAV = [
  { key: "dashboard", icon: LayoutDashboard, path: "/learn", label: "Accueil" },
  { key: "exams", icon: FileText, path: "/exams", label: "Examens" },
  { key: "path", icon: Route, path: "/parcours", label: "Parcours" },
  { key: "profile", icon: UserCircle, path: "/settings", label: "Profil" }
];
function LearnSidebar() {
  var _a;
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { tier } = useSubscription();
  const isActive = (item) => {
    if (item.path === "/learn" && item.key === "dashboard") {
      return location.pathname === "/learn" && !location.search;
    }
    return location.pathname === item.path;
  };
  const { domainMastery, successRate } = useDashboardStats();
  const displayName = (profile == null ? void 0 : profile.first_name) || ((_a = user == null ? void 0 : user.email) == null ? void 0 : _a.split("@")[0]) || "Étudiant";
  const tierLabels = { free: "Gratuit", standard: "Standard", premium: "Premium" };
  const activeDomains = domainMastery.filter((d) => d.total > 0);
  const avgMastery = activeDomains.length > 0 ? Math.round(activeDomains.reduce((sum, d) => sum + d.percent, 0) / activeDomains.length) : 0;
  const progressPercent = activeDomains.length > 0 ? Math.round(avgMastery * 0.7 + successRate * 0.3) : 0;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      motion.aside,
      {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        transition: { type: "spring", stiffness: 100, damping: 20 },
        className: "hidden md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 z-50 bg-[var(--dash-card)] border-r border-[var(--dash-card-border)]",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex h-16 items-center justify-between px-5 border-b border-[var(--dash-card-border)]", children: /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(Logo, { size: "sm" }) }) }),
          /* @__PURE__ */ jsx(
            motion.nav,
            {
              initial: "hidden",
              animate: "visible",
              variants: { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } } },
              className: "flex-1 space-y-1 px-3 py-5 overflow-y-auto",
              children: NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return /* @__PURE__ */ jsxs(
                  motion.button,
                  {
                    variants: { hidden: { x: -16, opacity: 0 }, visible: { x: 0, opacity: 1 } },
                    onClick: () => navigate(item.path),
                    className: `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative ${active ? "bg-blue-500/10 text-[#0055A4] font-semibold" : "text-[var(--dash-text-muted)] hover:bg-[var(--dash-surface)] hover:text-[var(--dash-text)]"}`,
                    children: [
                      active && /* @__PURE__ */ jsx(
                        motion.div,
                        {
                          layoutId: "sidebarActive",
                          className: "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#0055A4] rounded-r-full",
                          transition: { type: "spring", stiffness: 300, damping: 25 }
                        }
                      ),
                      /* @__PURE__ */ jsx(Icon, { className: `h-5 w-5 transition-colors ${active ? "text-[#0055A4]" : "text-[var(--dash-text-muted)] group-hover:text-[var(--dash-text)]"}` }),
                      /* @__PURE__ */ jsx("span", { children: item.label })
                    ]
                  },
                  item.key
                );
              })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.4 },
              className: "p-3 border-t border-[var(--dash-card-border)]",
              children: /* @__PURE__ */ jsxs("div", { className: "bg-[var(--dash-surface)] rounded-2xl p-4 flex flex-col gap-3 border border-[var(--dash-card-border)] shadow-sm", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-full bg-[#0055A4] text-white flex items-center justify-center font-bold text-sm", children: displayName.charAt(0).toUpperCase() }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col text-left", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm font-bold text-[var(--dash-text)] truncate max-w-[120px]", children: displayName }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-semibold text-[#EF4135] uppercase tracking-wider", children: tierLabels[tier] || "Gratuit" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-medium text-[var(--dash-text-muted)] mb-1 uppercase tracking-wide", children: [
                    /* @__PURE__ */ jsx("span", { children: "Progression" }),
                    /* @__PURE__ */ jsxs("span", { className: "text-[#0055A4] font-bold", children: [
                      progressPercent,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "h-1.5 w-full bg-[var(--dash-card-border)] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                    motion.div,
                    {
                      initial: { width: 0 },
                      animate: { width: `${progressPercent}%` },
                      transition: { duration: 1, delay: 0.5, ease: "easeOut" },
                      className: "h-full bg-gradient-to-r from-[#0055A4] to-[#3B82F6] rounded-full"
                    }
                  ) })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: async () => {
                      await supabase.auth.signOut();
                      navigate("/");
                    },
                    className: "mt-1 flex items-center justify-center gap-2 w-full py-1.5 rounded-lg text-[11px] font-bold text-[var(--dash-text-muted)] hover:text-white hover:bg-[#EF4135] transition-all",
                    children: [
                      /* @__PURE__ */ jsx(LogOut, { className: "h-3.5 w-3.5" }),
                      "Déconnexion"
                    ]
                  }
                )
              ] })
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      motion.nav,
      {
        initial: { y: 100 },
        animate: { y: 0 },
        transition: { type: "spring", damping: 25, stiffness: 200 },
        className: "fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-[var(--dash-card-border)] bg-[var(--dash-card)] safe-area-bottom shadow-[0_-4px_24px_rgba(0,0,0,0.08)]",
        children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-around px-2 py-2", children: MOBILE_NAV.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => navigate(item.path),
              className: `relative flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-bold transition-all ${active ? "text-[#0055A4]" : "text-[var(--dash-text-muted)] hover:text-[var(--dash-text)]"}`,
              children: [
                active && /* @__PURE__ */ jsx(motion.div, { layoutId: "mobileNavActive", className: "absolute inset-0 bg-blue-500/10 rounded-xl" }),
                /* @__PURE__ */ jsx(Icon, { className: `h-5 w-5 relative z-10 transition-transform ${active ? "scale-110" : ""}` }),
                /* @__PURE__ */ jsx("span", { className: "relative z-10", children: item.label })
              ]
            },
            item.key
          );
        }) })
      }
    )
  ] });
}
export {
  LearnSidebar as L,
  useDashboardStats as u
};
