import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);

        if (newSession?.user) {
          // Sync display name & avatar from Google metadata to profiles
          const meta = newSession.user.user_metadata;
          const fullName = meta?.full_name || meta?.name || null;
          const avatar = meta?.avatar_url || meta?.picture || null;
          setDisplayName(fullName || newSession.user.email || null);
          setAvatarUrl(avatar);

          // Update profile in background (don't block)
          setTimeout(() => {
            supabase
              .from('profiles')
              .update({
                display_name: fullName || newSession.user.email,
                avatar_url: avatar,
              })
              .eq('id', newSession.user.id)
              .then();
          }, 0);
        } else {
          setDisplayName(null);
          setAvatarUrl(null);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        const meta = initialSession.user.user_metadata;
        const fullName = meta?.full_name || meta?.name || null;
        const avatar = meta?.avatar_url || meta?.picture || null;
        setDisplayName(fullName || initialSession.user.email || null);
        setAvatarUrl(avatar);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/learn' },
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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    session,
    loading,
    displayName,
    avatarUrl,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}
