import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/lib/types';

export interface ClassDetailData {
    class_number: number;
    title: string;
    description: string;
    estimated_minutes: number;
    content_markdown: string;
    questions: Question[];
}

export function useClassDetail(classId?: string) {
    const [data, setData] = useState<ClassDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClassData = useCallback(async () => {
        if (!classId) return;

        setLoading(true);
        try {
            // Fetch core class info
            const { data: classInfo, error: classInfoErr } = await supabase
                .from('classes')
                .select('*')
                .eq('id', classId)
                .maybeSingle();

            if (classInfoErr) throw classInfoErr;
            if (!classInfo) {
                throw new Error("Classe introuvable.");
            }

            // Fetch markdown content
            const { data: lessonData, error: lessonErr } = await supabase
                .from('class_lessons')
                .select('content_markdown')
                .eq('class_id', classId)
                .maybeSingle();

            if (lessonErr) throw lessonErr;

            // Fetch questions mapped to this class
            const { data: qLinks, error: qLinksErr } = await supabase
                .from('class_questions')
                .select('question_id')
                .eq('class_id', classId);

            if (qLinksErr) throw qLinksErr;

            let validQuestions: Question[] = [];
            if (qLinks && qLinks.length > 0) {
                const questionIds = qLinks.map(q => q.question_id);
                const { data: rawQuestions, error: qErr } = await supabase
                    .from('questions')
                    .select('*')
                    .in('id', questionIds);

                if (qErr) throw qErr;
                validQuestions = (rawQuestions || []) as Question[];
            }

            setData({
                class_number: classInfo.class_number,
                title: classInfo.title,
                description: classInfo.description || '',
                estimated_minutes: classInfo.estimated_minutes,
                content_markdown: lessonData?.content_markdown || '# Contenu à venir...',
                questions: validQuestions,
            });

        } catch (err: any) {
            console.error("Failed to load class data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [classId]);

    useEffect(() => {
        fetchClassData();
    }, [fetchClassData]);

    return { data, loading, error };
}
