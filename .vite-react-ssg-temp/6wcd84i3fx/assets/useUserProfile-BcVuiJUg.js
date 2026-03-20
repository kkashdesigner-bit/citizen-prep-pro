import { useState, useCallback, useEffect } from "react";
import { a as useAuth, s as supabase } from "../main.mjs";
const GOAL_TO_LEVEL = {
  naturalisation: "Naturalisation",
  carte_resident: "CR",
  csp: "CSP"
};
const GOAL_LABELS = {
  naturalisation: "Naturalisation française",
  carte_resident: "Carte de Résident (CR)",
  csp: "Carte de Séjour Pluriannuelle (CSP)"
};
function useUserProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const { data } = await supabase.from("user_profile").select("*").eq("user_id", user.id).maybeSingle();
    setProfile(data || null);
    setLoading(false);
  }, [user]);
  useEffect(() => {
    if (authLoading) return;
    fetchProfile();
  }, [authLoading, fetchProfile]);
  const saveProfile = useCallback(async (updates) => {
    if (!user) return;
    const { data: existing } = await supabase.from("user_profile").select("id").eq("user_id", user.id).maybeSingle();
    if (existing) {
      const { data } = await supabase.from("user_profile").update(updates).eq("user_id", user.id).select().single();
      setProfile(data);
    } else {
      const { data } = await supabase.from("user_profile").insert({ user_id: user.id, ...updates }).select().single();
      setProfile(data);
    }
  }, [user]);
  return { profile, loading, saveProfile, refetch: fetchProfile };
}
export {
  GOAL_TO_LEVEL as G,
  GOAL_LABELS as a,
  useUserProfile as u
};
