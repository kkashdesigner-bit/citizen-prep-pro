import { useState, useCallback, useEffect } from "react";
import { a as useAuth, s as supabase } from "../main.mjs";
import { u as useUserProfile } from "./useUserProfile-BcVuiJUg.js";
function useParcours() {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [classes, setClasses] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchParcoursData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const goalType = (profile == null ? void 0 : profile.goal_type) || "naturalisation";
      const { data: pathData, error: pathError } = await supabase.from("learning_paths").select("id").eq("persona_goal", goalType).limit(1).maybeSingle();
      if (pathError) throw pathError;
      let pathId = pathData == null ? void 0 : pathData.id;
      if (!pathId) {
        const { data: fallbackPath } = await supabase.from("learning_paths").select("id").limit(1).maybeSingle();
        pathId = fallbackPath == null ? void 0 : fallbackPath.id;
      }
      if (!pathId) {
        setClasses([]);
        setProgress({});
        setLoading(false);
        return;
      }
      const { data: classData, error: classError } = await supabase.from("classes").select("id, class_number, title, description, estimated_minutes").eq("path_id", pathId).order("class_number", { ascending: true });
      if (classError) throw classError;
      setClasses(classData || []);
      const { data: progressData, error: progressError } = await supabase.from("user_class_progress").select("*").eq("user_id", user.id);
      if (progressError) throw progressError;
      const progressMap = {};
      (progressData || []).forEach((p) => {
        progressMap[p.class_id] = p;
      });
      setProgress(progressMap);
    } catch (err) {
      console.error("Error fetching parcours:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, profile]);
  useEffect(() => {
    fetchParcoursData();
  }, [fetchParcoursData]);
  const updateProgress = async (classId, score, passed) => {
    if (!user) return;
    try {
      const status = passed ? "completed" : "in_progress";
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const { data: existing } = await supabase.from("user_class_progress").select("attempts_count, score, completed_at").eq("user_id", user.id).eq("class_id", classId).maybeSingle();
      if (existing) {
        await supabase.from("user_class_progress").update({
          status,
          score: Math.max(existing.score || 0, score),
          attempts_count: (existing.attempts_count || 0) + 1,
          completed_at: passed && !existing.completed_at ? now : existing.completed_at
        }).eq("user_id", user.id).eq("class_id", classId);
      } else {
        await supabase.from("user_class_progress").insert({
          user_id: user.id,
          class_id: classId,
          status,
          score,
          attempts_count: 1,
          completed_at: passed ? now : null
        });
      }
      await fetchParcoursData();
    } catch (err) {
      console.error("Failed to update progress", err);
      throw err;
    }
  };
  return { classes, progress, loading, error, updateProgress, refetch: fetchParcoursData };
}
export {
  useParcours as u
};
