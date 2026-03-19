import { lazy, Suspense } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ClientOnlyRoute } from "@/components/ClientOnlyRoute";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Results = lazy(() => import("./pages/Results"));
const About = lazy(() => import("./pages/About"));
const LearningDashboard = lazy(() => import("./pages/LearningDashboard"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const ExamsPage = lazy(() => import("./pages/ExamsPage"));
const StudyMaterialPage = lazy(() => import("./pages/StudyMaterialPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const ParcoursPage = lazy(() => import("./pages/ParcoursPage"));
const ClassDetailPage = lazy(() => import("./pages/ClassDetailPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CoursPreview = lazy(() => import("./pages/seo/CoursPreview"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Refunds = lazy(() => import("./pages/Refunds"));

// SEO content pages
const GuideExamen = lazy(() => import("./pages/seo/GuideExamen"));
const ThemeValeurs = lazy(() => import("./pages/seo/ThemeValeurs"));
const ThemeHistoire = lazy(() => import("./pages/seo/ThemeHistoire"));
const ThemeInstitutions = lazy(() => import("./pages/seo/ThemeInstitutions"));
const ThemeDroitsDevoits = lazy(() => import("./pages/seo/ThemeDroitsDevoits"));

const queryClient = new QueryClient();

function Root() {
  const isServer = import.meta.env.SSR;

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>
            <TooltipProvider>
              {!isServer && (
                <>
                  <Toaster />
                  <Sonner />
                </>
              )}
              <Suspense fallback={null}>
                <ClientOnlyRoute>
                  <Outlet />
                </ClientOnlyRoute>
              </Suspense>
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Index /> },
      { path: "auth", element: <Auth /> },
      { path: "learn", element: <ProtectedRoute><LearningDashboard /></ProtectedRoute> },
      { path: "onboarding", element: <Onboarding /> },
      { path: "lesson/:id", element: <ProtectedRoute><LessonPage /></ProtectedRoute> },
      { path: "exams", element: <ProtectedRoute><ExamsPage /></ProtectedRoute> },
      { path: "study-material", element: <ProtectedRoute><StudyMaterialPage /></ProtectedRoute> },
      { path: "analytics", element: <ProtectedRoute><AnalyticsPage /></ProtectedRoute> },
      { path: "quiz", element: <Quiz /> },
      { path: "results", element: <Results /> },
      { path: "success", element: <SubscriptionSuccess /> },
      { path: "dashboard", element: <Navigate to="/learn" replace /> },
      { path: "about", element: <About /> },
      { path: "parcours", element: <ProtectedRoute><ParcoursPage /></ProtectedRoute> },
      { path: "parcours/classe/:id", element: <ProtectedRoute><ClassDetailPage /></ProtectedRoute> },
      { path: "settings", element: <ProtectedRoute><SettingsPage /></ProtectedRoute> },
      { path: "courses", element: <ProtectedRoute><CoursesPage /></ProtectedRoute> },
      { path: "cours/:slug", element: <CoursPreview /> },
      { path: "contact", element: <Contact /> },
      { path: "terms", element: <Terms /> },
      { path: "privacy", element: <Privacy /> },
      { path: "refunds", element: <Refunds /> },
      // SEO content pages
      { path: "guide-examen-civique", element: <GuideExamen /> },
      { path: "themes/valeurs-republique", element: <ThemeValeurs /> },
      { path: "themes/histoire-geographie", element: <ThemeHistoire /> },
      { path: "themes/institutions", element: <ThemeInstitutions /> },
      { path: "themes/droits-devoirs", element: <ThemeDroitsDevoits /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];
