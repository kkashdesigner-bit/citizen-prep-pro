import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/contexts/LanguageContext";

const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Results = lazy(() => import("./pages/Results"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const LearningDashboard = lazy(() => import("./pages/LearningDashboard"));
const ProgressPage = lazy(() => import("./pages/ProgressPage"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const ExamsPage = lazy(() => import("./pages/ExamsPage"));
const StudyMaterialPage = lazy(() => import("./pages/StudyMaterialPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const SubscriptionSuccess = lazy(() => import("./pages/SubscriptionSuccess"));
const ParcoursPage = lazy(() => import("./pages/ParcoursPage"));
const ClassDetailPage = lazy(() => import("./pages/ClassDetailPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/learn" element={<LearningDashboard />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/lesson/:id" element={<LessonPage />} />
                <Route path="/exams" element={<ExamsPage />} />
                <Route path="/study-material" element={<StudyMaterialPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/success" element={<SubscriptionSuccess />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/parcours" element={<ParcoursPage />} />
                <Route path="/parcours/classe/:id" element={<ClassDetailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
