import { Navigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionLimitWall from './SubscriptionLimitWall';

/** localStorage flag: set once a first-time anonymous visitor finishes the free demo exam. */
export const DEMO_USED_KEY = 'gocivique_demo_used';

export function isDemoUsed(): boolean {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(DEMO_USED_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Guard for `/quiz`.
 * - Anonymous visitor + `?mode=demo`: allowed ONCE (until they finish a demo, tracked in
 *   localStorage), then bounced to sign-up.
 * - Everything else: behaves like ProtectedRoute (auth required + question-limit wall).
 */
export function QuizGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isQuestionsLimitReached, loading: subLoading } = useSubscription();
  const location = useLocation();
  const [params] = useSearchParams();
  const isDemo = params.get('mode') === 'demo';

  if (typeof window === 'undefined') return null;
  if (authLoading || subLoading) return null;

  // First-time anonymous demo: let them through once, otherwise ask them to sign up.
  if (isDemo && !user) {
    if (isDemoUsed()) {
      return <Navigate to="/auth?redirect=/learn&reason=demo_used" replace />;
    }
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />;
  }
  if (isQuestionsLimitReached) {
    return <SubscriptionLimitWall />;
  }
  return <>{children}</>;
}

/**
 * Guard for `/results`.
 * Anonymous visitors are allowed only when they're coming from a finished demo exam
 * (a demo result is sitting in sessionStorage); otherwise auth is required.
 */
export function ResultsGuard({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();

  if (typeof window === 'undefined') return null;
  if (authLoading) return null;

  const hasDemoResult = typeof sessionStorage !== 'undefined' && sessionStorage.getItem('quizMode') === 'demo';
  if (!user && !hasDemoResult) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }
  return <>{children}</>;
}
