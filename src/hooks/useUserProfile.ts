import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export type GoalType = 'naturalisation' | 'carte_resident' | 'csp';
export type LevelType = 'beginner' | 'intermediate' | 'advanced';
export type TimelineType = 'less_1_month' | '1_3_months' | 'more_3_months' | 'not_sure';

export interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  goal_type: GoalType | null;
  level: LevelType | null;
  timeline: TimelineType | null;
  onboarding_completed: boolean;
}

/** Map goal_type to exam level for question filtering */
export const GOAL_TO_LEVEL: Record<GoalType, string> = {
  naturalisation: 'Naturalisation',
  carte_resident: 'CR',
  csp: 'CSP',
};

export const GOAL_LABELS: Record<GoalType, string> = {
  naturalisation: 'Naturalisation française',
  carte_resident: 'Carte de Résident (CR)',
  csp: 'Carte de Séjour Pluriannuelle (CSP)'
};

export function useUserProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) { setProfile(null); setLoading(false); return; }
    const { data } = await (supabase as any)
      .from('user_profile')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    setProfile((data as UserProfile) || null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    fetchProfile();
  }, [authLoading, fetchProfile]);

  const saveProfile = useCallback(async (updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return;
    const { data: existing } = await (supabase as any)
      .from('user_profile')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      const { data } = await (supabase as any)
        .from('user_profile')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      setProfile(data as unknown as UserProfile);
    } else {
      const { data } = await (supabase as any)
        .from('user_profile')
        .insert({ user_id: user.id, ...updates })
        .select()
        .single();
      setProfile(data as unknown as UserProfile);
    }
  }, [user]);

  return { profile, loading, saveProfile, refetch: fetchProfile };
}
