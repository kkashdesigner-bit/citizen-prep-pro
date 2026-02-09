import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

const SESSION_CHECK_INTERVAL = 30_000; // 30 seconds

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionRef = useRef<Session | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateSessionToken = useCallback(async (userId: string, accessToken: string) => {
    await supabase
      .from('profiles')
      .update({ session_token: accessToken } as any)
      .eq('id', userId);
  }, []);

  const startPolling = useCallback((userId: string) => {
    clearPolling();
    intervalRef.current = setInterval(async () => {
      const currentSession = sessionRef.current;
      if (!currentSession) return;

      const { data } = await supabase
        .from('profiles')
        .select('session_token')
        .eq('id', userId)
        .single();

      if (data && (data as any).session_token && (data as any).session_token !== currentSession.access_token) {
        clearPolling();
        toast({
          title: 'Session terminée',
          description: 'Vous avez été déconnecté car votre compte a été connecté sur un autre appareil.',
          variant: 'destructive',
        });
        await supabase.auth.signOut();
      }
    }, SESSION_CHECK_INTERVAL);
  }, [clearPolling]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        sessionRef.current = newSession;
        setLoading(false);

        if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession?.user) {
          await updateSessionToken(newSession.user.id, newSession.access_token);
          startPolling(newSession.user.id);
        }

        if (event === 'SIGNED_OUT') {
          clearPolling();
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      sessionRef.current = initialSession;
      setLoading(false);

      if (initialSession?.user) {
        updateSessionToken(initialSession.user.id, initialSession.access_token);
        startPolling(initialSession.user.id);
      }
    });

    return () => {
      subscription.unsubscribe();
      clearPolling();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  const signOut = async () => {
    clearPolling();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
