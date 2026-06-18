import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionLimitWall from './SubscriptionLimitWall';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isQuestionsLimitReached, loading: subLoading } = useSubscription();
  const location = useLocation();

  // During SSG/SSR, render nothing — auth resolves client-side after hydration
  if (typeof window === 'undefined') return null;
  if (authLoading || subLoading) return null;
  if (!user) {
    return <Navigate to={`/auth?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (isQuestionsLimitReached) {
    return <SubscriptionLimitWall />;
  }

  return <>{children}</>;
}
