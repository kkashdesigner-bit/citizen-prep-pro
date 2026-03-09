import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/* ──────────────────────────────────────────────
 * Types
 * ─────────────────────────────────────────────── */

export interface ExamHistoryEntry {
    date: string;
    score: number;
    totalQuestions: number;
    passed: boolean;
    category?: string;
}

interface UserAnswer {
    answered_at: string;
    category: string | null;
    is_correct: boolean;
}

export interface DomainMastery {
    label: string;
    percent: number;
    color: string;
    total: number;
    correct: number;
    dbCategory: string;
}

export interface WeaknessAlert {
    domain: string;
    message: string;
    category: string;
    color: string;
}

export interface ActivityItem {
    type: 'exam' | 'answer' | 'milestone';
    title: string;
    date: string;
    detail?: string;
}

export interface DashboardStats {
    // Core
    loading: boolean;
    displayName: string;
    avatarUrl: string | null;
    examHistory: ExamHistoryEntry[];

    // Computed
    successRate: number;
    streak: number;
    dailyGoalCurrent: number;
    dailyGoalTarget: number;
    weeklyActivity: number[];   // 7 days (Mon→Sun)
    domainMastery: DomainMastery[];
    weaknessAlerts: WeaknessAlert[];
    recentActivity: ActivityItem[];
    examsToday: number;
    canTakeExamFree: boolean;
    totalXP: number;
}

/* ──────────────────────────────────────────────
 * Category mappings
 * ─────────────────────────────────────────────── */

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    'Principles and values of the Republic': { label: 'Fondamentaux', color: '#3B82F6' },
    'Institutional and political system': { label: 'Institutions', color: '#8B5CF6' },
    'Rights and duties': { label: 'Droits & Devoirs', color: '#22C55E' },
    'History, geography and culture': { label: 'Histoire & Culture', color: '#F59E0B' },
    'Living in French society': { label: 'Vie en société', color: '#06B6D4' },
};

const ALL_DB_CATEGORIES = Object.keys(CATEGORY_LABELS);

/* ──────────────────────────────────────────────
 * Helpers
 * ─────────────────────────────────────────────── */

function computeStreak(examHistory: ExamHistoryEntry[]): number {
    if (examHistory.length === 0) return 0;

    // Get unique dates sorted descending
    const dates = [...new Set(examHistory.map(e => e.date?.split('T')[0]).filter(Boolean))].sort().reverse();
    if (dates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    for (let i = 0; i < dates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        const expected = expectedDate.toISOString().split('T')[0];

        if (dates[i] === expected) {
            streak++;
        } else if (i === 0) {
            // Allow yesterday if no activity today
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            if (dates[i] === yesterday.toISOString().split('T')[0]) {
                streak = 1;
            } else {
                break;
            }
        } else {
            break;
        }
    }
    return streak;
}

function computeWeeklyActivity(answers: UserAnswer[]): number[] {
    const result = [0, 0, 0, 0, 0, 0, 0]; // Mon→Sun
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, etc.
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    for (const ans of answers) {
        const ansDate = new Date(ans.answered_at);
        if (ansDate >= monday) {
            const ansDay = ansDate.getDay();
            const idx = (ansDay + 6) % 7; // Convert Sun=0 to Mon=0 index
            result[idx]++;
        }
    }
    return result;
}

function computeDomainMastery(answers: UserAnswer[]): DomainMastery[] {
    const catMap: Record<string, { correct: number; total: number }> = {};

    for (const cat of ALL_DB_CATEGORIES) {
        catMap[cat] = { correct: 0, total: 0 };
    }

    for (const ans of answers) {
        if (ans.category && catMap[ans.category]) {
            catMap[ans.category].total++;
            if (ans.is_correct) catMap[ans.category].correct++;
        }
    }

    return ALL_DB_CATEGORIES.map(cat => {
        const data = catMap[cat];
        const percent = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
        const info = CATEGORY_LABELS[cat];
        return { label: info.label, percent, color: info.color, total: data.total, correct: data.correct, dbCategory: cat };
    });
}

function computeWeaknessAlerts(mastery: DomainMastery[]): WeaknessAlert[] {
    const WEAKNESS_MESSAGES: Record<string, string> = {
        'Fondamentaux': 'Réviser les valeurs et principes républicains',
        'Institutions': 'Revoir le fonctionnement des institutions françaises',
        'Droits & Devoirs': 'Approfondir les droits et devoirs du citoyen',
        'Histoire & Culture': 'Consolider les repères historiques et culturels',
        'Vie en société': 'Compléter les connaissances sur la vie quotidienne',
    };

    return mastery
        .filter(d => d.total > 0 && d.percent < 70)
        .sort((a, b) => a.percent - b.percent)
        .slice(0, 3)
        .map(d => ({
            domain: d.label,
            message: WEAKNESS_MESSAGES[d.label] || 'Points à améliorer',
            category: d.dbCategory,
            color: d.color,
        }));
}

function buildRecentActivity(examHistory: ExamHistoryEntry[], answers: UserAnswer[], classProgress: { class_number: number; title: string; completed_at: string; score: number }[]): ActivityItem[] {
    const items: ActivityItem[] = [];

    // Exams
    for (const exam of examHistory.slice(-10).reverse()) {
        const date = exam.date?.split('T')[0] || '';
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const relativeDate = date === today ? 'Aujourd\'hui' : date === yesterday ? 'Hier' : date;

        items.push({
            type: 'exam',
            title: exam.category ? `Quiz : ${CATEGORY_LABELS[exam.category]?.label || exam.category}` : 'Examen Blanc',
            date: relativeDate,
            detail: `${exam.score}/${exam.totalQuestions} — ${Math.round((exam.score / exam.totalQuestions) * 100)}%`,
        });
    }

    // Parcours class completions
    for (const cp of classProgress.slice(0, 5)) {
        const date = cp.completed_at?.split('T')[0] || '';
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        const relativeDate = date === today ? 'Aujourd\'hui' : date === yesterday ? 'Hier' : date;

        items.push({
            type: 'milestone',
            title: `Classe ${cp.class_number} : ${cp.title}`,
            date: relativeDate,
            detail: `Score : ${cp.score}%`,
        });
    }

    // Sort by date descending
    items.sort((a, b) => (b.date > a.date ? 1 : -1));

    if (items.length === 0) {
        items.push({
            type: 'milestone',
            title: 'Commencez votre premier quiz !',
            date: 'Aujourd\'hui',
            detail: '🚀 Prêt à démarrer',
        });
    }

    return items.slice(0, 5);
}

/* ──────────────────────────────────────────────
 * Main Hook
 * ─────────────────────────────────────────────── */

export function useDashboardStats(): DashboardStats {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [displayName, setDisplayName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [examHistory, setExamHistory] = useState<ExamHistoryEntry[]>([]);
    const [allAnswers, setAllAnswers] = useState<UserAnswer[]>([]);
    const [classCompletions, setClassCompletions] = useState<{ class_number: number; title: string; completed_at: string; score: number }[]>([]);

    useEffect(() => {
        if (authLoading || !user) {
            if (!authLoading) setLoading(false);
            return;
        }

        const fetchAll = async () => {
            // Fetch profile + exam history
            const [profileResult, answersResult] = await Promise.all([
                supabase
                    .from('profiles')
                    .select('display_name, email, exam_history, total_questions_seen, avatar_url')
                    .eq('id', user.id)
                    .maybeSingle(),
                supabase
                    .from('user_answers')
                    .select('answered_at, category, is_correct')
                    .eq('user_id', user.id)
                    .order('answered_at', { ascending: false })
                    .limit(500),
            ]);

            // Profile data
            const p = profileResult.data;
            setDisplayName(p?.display_name || p?.email || '');
            setAvatarUrl(p?.avatar_url || null);

            const history = p?.exam_history;
            setExamHistory(Array.isArray(history) ? (history as unknown as ExamHistoryEntry[]) : []);

            // User answers
            setAllAnswers((answersResult.data as UserAnswer[]) || []);

            // Fetch parcours class completions for recent activity
            const { data: progressData } = await (supabase as any)
                .from('user_class_progress')
                .select('class_id, score, completed_at')
                .eq('user_id', user.id)
                .eq('status', 'completed')
                .order('completed_at', { ascending: false })
                .limit(10);

            if (progressData && progressData.length > 0) {
                const classIds = progressData.map(p => p.class_id);
                const { data: classInfo } = await (supabase as any)
                    .from('classes')
                    .select('id, class_number, title')
                    .in('id', classIds);

                const classMap: Record<string, { class_number: number; title: string }> = {};
                (classInfo || []).forEach((c: any) => { classMap[c.id] = c; });

                setClassCompletions(
                    progressData
                        .filter(p => classMap[p.class_id])
                        .map(p => ({
                            class_number: classMap[p.class_id].class_number,
                            title: classMap[p.class_id].title,
                            completed_at: p.completed_at || '',
                            score: p.score || 0,
                        }))
                );
            }

            setLoading(false);
        };

        fetchAll();
    }, [user, authLoading]);

    // Compute everything from real data
    const today = new Date().toISOString().split('T')[0];
    const examsToday = examHistory.filter(e => e.date?.startsWith(today)).length;
    const answeredToday = allAnswers.filter(a => a.answered_at?.startsWith(today)).length;

    const successRate = allAnswers.length > 0
        ? Math.round(allAnswers.filter(a => a.is_correct).length / allAnswers.length * 100)
        : 0;

    const streak = computeStreak(examHistory);
    const dailyGoalTarget = 100;
    const dailyGoalCurrent = Math.min(answeredToday, dailyGoalTarget);

    const weeklyActivity = computeWeeklyActivity(allAnswers);
    const domainMastery = computeDomainMastery(allAnswers);
    const weaknessAlerts = computeWeaknessAlerts(domainMastery);
    const recentActivity = buildRecentActivity(examHistory, allAnswers, classCompletions);

    const totalXP = allAnswers.filter(a => a.is_correct).length * 10;

    return {
        loading: loading || authLoading,
        displayName,
        avatarUrl,
        examHistory,
        successRate,
        streak,
        dailyGoalCurrent,
        dailyGoalTarget,
        weeklyActivity,
        domainMastery,
        weaknessAlerts,
        recentActivity,
        examsToday,
        canTakeExamFree: examsToday < 1,
        totalXP,
    };
}
