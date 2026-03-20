import { useState, useCallback, useEffect } from "react";
import { a as useAuth, s as supabase } from "../main.mjs";
const QUESTIONS_PER_CLASS = 5;
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function useClassDetail(classId) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchClassData = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const { data: classInfo, error: classInfoErr } = await supabase.from("classes").select("*").eq("id", classId).maybeSingle();
      if (classInfoErr) throw classInfoErr;
      if (!classInfo) {
        throw new Error("Classe introuvable.");
      }
      let usedIds = [];
      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("used_questions").eq("id", user.id).maybeSingle();
        if (profileData == null ? void 0 : profileData.used_questions) {
          usedIds = profileData.used_questions.map(Number).filter((n) => !isNaN(n));
        }
      }
      let validQuestions = [];
      const { data: qLinks } = await supabase.from("class_questions").select("question_id").eq("class_id", classId);
      if (qLinks && qLinks.length > 0) {
        const questionIds = qLinks.map((q) => q.question_id);
        const { data: rawQuestions } = await supabase.from("questions").select("*").in("id", questionIds);
        validQuestions = rawQuestions || [];
      } else {
        let query = supabase.from("questions").select("*").limit(50);
        if (usedIds.length > 0) {
          query = query.not("id", "in", `(${usedIds.join(",")})`);
        }
        const { data: poolQuestions, error: poolErr } = await query;
        if (poolErr) throw poolErr;
        validQuestions = shuffle(poolQuestions || []).slice(0, QUESTIONS_PER_CLASS);
      }
      setData({
        class_number: classInfo.class_number,
        title: classInfo.title,
        description: classInfo.description || "",
        estimated_minutes: classInfo.estimated_minutes,
        content_markdown: classInfo.content || "## Contenu à venir\n\nCette leçon sera disponible prochainement.",
        questions: validQuestions
      });
    } catch (err) {
      console.error("Failed to load class data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [classId, user]);
  useEffect(() => {
    fetchClassData();
  }, [fetchClassData]);
  return { data, loading, error };
}
export {
  useClassDetail as u
};
