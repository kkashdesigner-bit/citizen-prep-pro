import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

export interface ParcoursClass {
    id: string;
    class_number: number;
    title: string;
    description: string;
    estimated_minutes: number;
}

export interface ClassProgress {
    class_id: string;
    status: 'not_started' | 'in_progress' | 'completed';
    score: number;
    attempts_count: number;
    completed_at: string | null;
}

export function useParcours() {
    const { user } = useAuth();
    const { profile } = useUserProfile();

    const [classes, setClasses] = useState<ParcoursClass[]>([]);
    const [progress, setProgress] = useState<Record<string, ClassProgress>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchParcoursData = useCallback(async () => {
        if (!user || !profile?.goal_type) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // 1. Fetch the path for the user's goal
            const { data: pathData, error: pathError } = await (supabase
                .from as any)('learning_paths')
                .select('id')
                .eq('persona_goal', profile.goal_type)
                .limit(1)
                .maybeSingle();

            if (pathError) throw pathError;

            let pathId = pathData?.id;

            // Fallback: if no specific path exists for this persona_goal yet, get ANY path (useful for testing/demo)
            if (!pathId) {
                const { data: fallbackPath } = await (supabase.from as any)('learning_paths').select('id').limit(1).maybeSingle();
                pathId = fallbackPath?.id;
            }

            if (!pathId) {
                setClasses([]);
                setProgress({});
                setLoading(false);
                return;
            }

            // 2. Fetch classes for this path
            const { data: classData, error: classError } = await (supabase
                .from as any)('classes')
                .select('id, class_number, title, description, estimated_minutes')
                .eq('path_id', pathId)
                .order('class_number', { ascending: true });

            if (classError) throw classError;
            setClasses(classData as ParcoursClass[]);

            // 3. Fetch user progress
            const { data: progressData, error: progressError } = await (supabase
                .from as any)('user_class_progress')
                .select('*')
                .eq('user_id', user.id);

            if (progressError) throw progressError;

            const progressMap: Record<string, ClassProgress> = {};
            progressData?.forEach(p => {
                progressMap[p.class_id] = p as ClassProgress;
            });
            setProgress(progressMap);

        } catch (err: any) {
            console.error('Error fetching parcours:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user, profile]);

    useEffect(() => {
        fetchParcoursData();
    }, [fetchParcoursData]);

    const updateProgress = async (classId: string, score: number, passed: boolean) => {
        if (!user) return;

        try {
            const status = passed ? 'completed' : 'in_progress';
            const now = new Date().toISOString();

            // Check if progress already exists to update it rather than insert
            const { data: existing } = await (supabase
                .from as any)('user_class_progress')
                .select('attempts_count, score, completed_at')
                .eq('user_id', user.id)
                .eq('class_id', classId)
                .maybeSingle();

            if (existing) {
                await (supabase
                    .from as any)('user_class_progress')
                    .update({
                        status,
                        score: Math.max(existing.score || 0, score),
                        attempts_count: (existing.attempts_count || 0) + 1,
                        completed_at: passed && !existing.completed_at ? now : existing.completed_at
                    })
                    .eq('user_id', user.id)
                    .eq('class_id', classId);
            } else {
                await (supabase
                    .from as any)('user_class_progress')
                    .insert({
                        user_id: user.id,
                        class_id: classId,
                        status,
                        score,
                        attempts_count: 1,
                        completed_at: passed ? now : null
                    });
            }

            // Refresh local data to match DB
            await fetchParcoursData();
        } catch (err) {
            console.error("Failed to update progress", err);
            throw err;
        }
    };

    return { classes, progress, loading, error, updateProgress, refetch: fetchParcoursData };
}
