import { useState, useEffect } from "react";
import { a as useAuth, s as supabase } from "../main.mjs";
function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [tier, setTier] = useState("free");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setTier("free");
      setLoading(false);
      return;
    }
    const fetchTier = async () => {
      const { data } = await supabase.from("profiles").select("subscription_tier, is_subscribed").eq("id", user.id).maybeSingle();
      if (data) {
        const t = data.subscription_tier;
        if (t === "standard" || t === "premium") {
          setTier(t);
        } else if (t === "tier_1") {
          setTier("standard");
        } else if (t === "tier_2") {
          setTier("premium");
        } else if (data.is_subscribed) {
          setTier("standard");
        } else {
          setTier("free");
        }
      }
      setLoading(false);
    };
    fetchTier();
  }, [user, authLoading]);
  return {
    tier,
    isStandardOrAbove: tier === "standard" || tier === "premium",
    isPremium: tier === "premium",
    // backward compat aliases
    isTier1OrAbove: tier === "standard" || tier === "premium",
    isTier2: tier === "premium",
    loading
  };
}
export {
  useSubscription as u
};
