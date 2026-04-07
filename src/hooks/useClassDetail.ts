import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export interface ClassDetailData {
    class_number: number;
    title: string;
    description: string;
    estimated_minutes: number;
    content_markdown: string;
    questions: Question[];
}

const QUESTIONS_PER_CLASS = 5;

/** Shuffle an array (Fisher-Yates) */
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function useClassDetail(classId?: string) {
    const { user } = useAuth();
    const [data, setData] = useState<ClassDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClassData = useCallback(async () => {
        if (!classId) return;

        setLoading(true);
        try {
            // 1. Fetch core class info
            const { data: classInfo, error: classInfoErr } = await (supabase as any)
                .from('classes')
                .select('*')
                .eq('id', classId)
                .maybeSingle();

            if (classInfoErr) throw classInfoErr;
            if (!classInfo) {
                throw new Error("Classe introuvable.");
            }

            // 2. Content is stored directly on the classes row

            // 3. Fetch the user's already-used question IDs to avoid repeats
            let usedIds: number[] = [];
            if (user) {
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('used_questions')
                    .eq('id', user.id)
                    .maybeSingle();

                if (profileData?.used_questions) {
                    usedIds = (profileData.used_questions as string[]).map(Number).filter(n => !isNaN(n));
                }
            }

            // 4. Pull a pool of random questions from the `questions` table, excluding used ones
            let validQuestions: Question[] = [];

            // First check if there are manually mapped questions for this class
            const { data: qLinks } = await (supabase as any)
                .from('class_questions')
                .select('question_id')
                .eq('class_id', classId);

            if (qLinks && qLinks.length > 0) {
                // Use manually mapped questions
                const questionIds = qLinks.map(q => q.question_id);
                const { data: rawQuestions } = await supabase
                    .from('questions')
                    .select('*')
                    .in('id', questionIds);
                // Deduplicate by question_text — keep one per unique question
                const seenTexts = new Set<string>();
                validQuestions = shuffle((rawQuestions || []) as Question[]).filter(q => {
                    if (seenTexts.has(q.question_text)) return false;
                    seenTexts.add(q.question_text);
                    return true;
                });
            } else {
                // Dynamic: fetch random unseen questions from the full pool
                let query = supabase
                    .from('questions')
                    .select('*')
                    .limit(200);

                // Exclude already-used questions if any
                if (usedIds.length > 0) {
                    query = query.not('id', 'in', `(${usedIds.join(',')})`);
                }

                const { data: poolQuestions, error: poolErr } = await query;
                if (poolErr) throw poolErr;

                // Deduplicate and shuffle
                const seen = new Set<string>();
                validQuestions = shuffle((poolQuestions || []) as Question[]).filter(q => {
                    if (seen.has(q.question_text)) return false;
                    seen.add(q.question_text);
                    return true;
                });
            }

            setData({
                class_number: classInfo.class_number,
                title: classInfo.title,
                description: classInfo.description || '',
                estimated_minutes: classInfo.estimated_minutes,
                content_markdown: classInfo.content || '## Contenu à venir\n\nCette leçon sera disponible prochainement.',
                questions: validQuestions,
            });

        } catch (err: any) {
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

