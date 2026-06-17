import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const SESSION_KEY = 'gocivique_session_id';

/** A stable per-browser session id, persisted so reloads keep the same session. */
function getOrCreateSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      (typeof crypto !== 'undefined' && 'randomUUID' in crypto)
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Enforces a single active session per account (anti account-sharing).
 *
 * On login this browser claims the account's `active_sessions` row with its own
 * session id. If the same account logs in elsewhere, that newer login overwrites
 * the row; via Postgres realtime, every older session sees a session_id that no
 * longer matches its own and is signed out. Reloading the same browser reuses the
 * stored id, so it never logs itself out.
 *
 * Renders nothing.
 */
export default function SingleSessionGuard() {
  const { user, signOut } = useAuth();
  const signedOutRef = useRef(false);

  useEffect(() => {
    if (!user) {
      signedOutRef.current = false;
      return;
    }

    const mySession = getOrCreateSessionId();
    let cancelled = false;

    // Claim this session as the authoritative one for the account.
    const claim = async () => {
      try {
        await (supabase as any).from('active_sessions').upsert(
          {
            user_id: user.id,
            session_id: mySession,
            user_agent: navigator.userAgent.slice(0, 300),
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' },
        );
      } catch {
        // Fail open — never block access if the claim write fails.
      }
    };
    claim();

    // Unique channel name per mount (avoids stale-channel collisions).
    const channel = supabase
      .channel(`active-session-${user.id}-${Math.random().toString(36).slice(2)}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'active_sessions', filter: `user_id=eq.${user.id}` },
        (payload) => {
          const next = (payload.new ?? {}) as { session_id?: string };
          if (
            next.session_id &&
            next.session_id !== mySession &&
            !signedOutRef.current &&
            !cancelled
          ) {
            signedOutRef.current = true;
            toast.error(
              'Votre compte vient d’être utilisé sur un autre appareil. Vous avez été déconnecté pour des raisons de sécurité.',
            );
            setTimeout(() => {
              signOut().catch(() => {});
            }, 1800);
          }
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user, signOut]);

  return null;
}
