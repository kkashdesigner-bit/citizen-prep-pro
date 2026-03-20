import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-BbwBU_1g.js";
import { B as Button } from "./button-AT0XyJsk.js";
import { B as Badge } from "./badge-DObGNgcP.js";
import { a as useAuth, u as useLanguage, s as supabase } from "../main.mjs";
import { u as useSubscription } from "./useSubscription-Cz7bDEZd.js";
import { H as Header } from "./Header-CzgIuffk.js";
import { F as Footer } from "./Footer-DfL4a8kP.js";
import { S as SubscriptionGate } from "./SubscriptionGate-BJBE68cr.js";
import { ArrowLeft, Clock, Lightbulb, CheckCircle, Play, BookOpen, ArrowRight } from "lucide-react";
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
import "./types-CapR02YX.js";
import "./avatar-aMrL2e85.js";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./Logo-RLfqH6ZW.js";
import "./use-mobile-BsFue-bT.js";
import "@radix-ui/react-dialog";
function renderContent(content) {
  return content.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      return /* @__PURE__ */ jsx("h3", { className: "mt-6 mb-2 text-lg font-bold text-foreground", children: trimmed.slice(4) }, i);
    }
    if (trimmed.startsWith("## ")) {
      return /* @__PURE__ */ jsx("h2", { className: "mt-8 mb-3 text-xl font-bold text-foreground", children: trimmed.slice(3) }, i);
    }
    if (trimmed.startsWith("# ")) {
      return /* @__PURE__ */ jsx("h1", { className: "mt-8 mb-3 text-2xl font-bold text-foreground", children: trimmed.slice(2) }, i);
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      return /* @__PURE__ */ jsx("li", { className: "ml-4 list-disc text-sm text-foreground/90 leading-relaxed", children: renderInline(trimmed.slice(2)) }, i);
    }
    if (trimmed === "") return /* @__PURE__ */ jsx("div", { className: "h-2" }, i);
    return /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/90 leading-relaxed break-words overflow-wrap-anywhere", children: renderInline(trimmed) }, i);
  });
}
function renderInline(text) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map(
    (part, i) => i % 2 === 1 ? /* @__PURE__ */ jsx("strong", { className: "font-semibold text-foreground", children: part }, i) : part
  );
}
function extractKeyPoints(content) {
  const lines = content.split("\n");
  const points = [];
  let inKeySection = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (/^#{1,3}\s.*(?:key|point|résumé|essentiel|retenir)/i.test(trimmed)) {
      inKeySection = true;
      continue;
    }
    if (inKeySection && (trimmed.startsWith("- ") || trimmed.startsWith("* "))) {
      points.push(trimmed.slice(2));
    } else if (inKeySection && trimmed.startsWith("#")) {
      break;
    }
  }
  return points;
}
function LessonPage() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { isStandardOrAbove, loading: tierLoading } = useSubscription();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [status, setStatus] = useState("not_started");
  const [loading, setLoading] = useState(true);
  const [showGate, setShowGate] = useState(false);
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth");
      return;
    }
    const fetchLesson = async () => {
      var _a;
      const [lessonRes, allLessonsRes, progressRes] = await Promise.all([
        supabase.from("lessons").select("*").eq("id", id).maybeSingle(),
        supabase.from("lessons").select("id, category, level, title, estimated_minutes, order_index, content").order("order_index"),
        supabase.from("lesson_progress").select("status, score_last").eq("user_id", user.id).eq("lesson_id", id).maybeSingle()
      ]);
      if (!lessonRes.data) {
        navigate("/learn");
        return;
      }
      const currentLesson = lessonRes.data;
      setLesson(currentLesson);
      setStatus(((_a = progressRes.data) == null ? void 0 : _a.status) || "not_started");
      const allLessons = allLessonsRes.data || [];
      const currentIdx = allLessons.findIndex((l) => l.id === id);
      if (currentIdx >= 0 && currentIdx < allLessons.length - 1) {
        setNextLesson(allLessons[currentIdx + 1]);
      }
      setLoading(false);
    };
    fetchLesson();
  }, [id, user, authLoading, navigate]);
  useEffect(() => {
    if (!tierLoading && !isStandardOrAbove) {
      setShowGate(true);
    }
  }, [tierLoading, isStandardOrAbove]);
  const handleMarkComplete = async () => {
    if (!user || !lesson) return;
    const { error } = await supabase.from("lesson_progress").upsert(
      { user_id: user.id, lesson_id: lesson.id, status: "completed" },
      { onConflict: "user_id,lesson_id" }
    );
    if (!error) setStatus("completed");
  };
  if (authLoading || loading || tierLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("div", { className: "container flex items-center justify-center py-20", children: /* @__PURE__ */ jsx("div", { className: "mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" }) })
    ] });
  }
  if (!lesson) return null;
  const keyPoints = extractKeyPoints(lesson.content);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("div", { className: "container max-w-3xl py-8", children: [
      /* @__PURE__ */ jsxs(Button, { variant: "ghost", className: "mb-4 gap-2", onClick: () => navigate("/learn"), children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "h-4 w-4" }),
        t("learn.backToLearn")
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground mb-2", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
            lesson.estimated_minutes,
            " min",
            /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "ml-2", children: lesson.category }),
            /* @__PURE__ */ jsx(Badge, { variant: "outline", children: lesson.level })
          ] }),
          /* @__PURE__ */ jsx(CardTitle, { className: "font-serif text-2xl", children: lesson.title })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "mb-8 overflow-hidden break-words", children: renderContent(lesson.content) }),
          keyPoints.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-8 rounded-xl border border-primary/20 bg-primary/5 p-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsx(Lightbulb, { className: "h-5 w-5 text-primary" }),
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-foreground", children: "Points clés" })
            ] }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: keyPoints.map((point, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2 text-sm text-foreground/90", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }),
              point
            ] }, i)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row", children: [
            status === "completed" ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-primary", children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "font-medium", children: t("learn.completed") })
            ] }) : /* @__PURE__ */ jsxs(Button, { className: "btn-glow gap-2", onClick: handleMarkComplete, children: [
              /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4" }),
              t("learn.markComplete")
            ] }),
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "outline",
                className: "gap-2 glow-hover",
                onClick: () => navigate(`/quiz?mode=study&category=${lesson.category}&mini=1`),
                children: [
                  /* @__PURE__ */ jsx(Play, { className: "h-4 w-4" }),
                  "Mini Quiz"
                ]
              }
            )
          ] }),
          status === "completed" && nextLesson && /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-xl border border-border/50 bg-card p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Leçon suivante" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-4 w-4 text-primary" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: nextLesson.title }),
                  /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    nextLesson.category,
                    " · ",
                    nextLesson.estimated_minutes,
                    " min"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-1.5", onClick: () => navigate(`/lesson/${nextLesson.id}`), children: [
                "Continuer",
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(SubscriptionGate, { open: showGate, onOpenChange: (open) => {
      setShowGate(open);
      if (!open && !isStandardOrAbove) navigate("/learn");
    }, requiredTier: "standard" })
  ] });
}
export {
  LessonPage as default
};
