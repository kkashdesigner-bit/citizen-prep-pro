import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const MILESTONE_THRESHOLDS = [100, 250, 500, 1000, 2000, 5000];

serve(async (_req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Get users active in last 14 days
    const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();
    const { data: recentUsers } = await supabase
      .from('user_answers')
      .select('user_id')
      .gte('created_at', fourteenDaysAgo);

    const uniqueUserIds = [...new Set((recentUsers || []).map((u: any) => u.user_id))];
    let totalCreated = 0;

    for (const userId of uniqueUserIds) {
      // Rate limit: check how many notifications today
      const { count: todayCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`);

      if ((todayCount || 0) >= 3) continue;

      const notifications: Array<{ user_id: string; type: string; title: string; body: string; metadata: any }> = [];

      // ── Streak Risk ──
      // Check if user has streak >= 2 but no activity yesterday
      const { data: streakData } = await supabase
        .from('streaks')
        .select('current_streak')
        .eq('user_id', userId)
        .maybeSingle();

      if (streakData && streakData.current_streak >= 2) {
        const { count: yesterdayActivity } = await supabase
          .from('user_answers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .gte('created_at', `${yesterday}T00:00:00`)
          .lt('created_at', `${today}T00:00:00`);

        if (yesterdayActivity === 0) {
          // Check no streak_risk notification today
          const { count: existing } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .eq('type', 'streak_risk')
            .gte('created_at', `${today}T00:00:00`);

          if (existing === 0) {
            notifications.push({
              user_id: userId,
              type: 'streak_risk',
              title: `Votre série de ${streakData.current_streak} jours est en danger !`,
              body: 'Répondez à une question pour maintenir votre série.',
              metadata: { streak: streakData.current_streak },
            });
          }
        }
      }

      // ── Milestones ──
      const { count: totalAnswers } = await supabase
        .from('user_answers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (totalAnswers) {
        for (const threshold of MILESTONE_THRESHOLDS) {
          if (totalAnswers >= threshold) {
            // Check if this milestone was already notified
            const { count: milestoneExists } = await supabase
              .from('notifications')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', userId)
              .eq('type', 'milestone')
              .contains('metadata', { threshold });

            if (milestoneExists === 0) {
              notifications.push({
                user_id: userId,
                type: 'milestone',
                title: `Félicitations ! ${threshold} questions répondues !`,
                body: `Vous avez franchi le cap des ${threshold} questions. Continuez comme ça !`,
                metadata: { threshold, actual: totalAnswers },
              });
              break; // Only notify one milestone at a time
            }
          }
        }
      }

      // ── Weakness Drill ──
      // Find categories below 60% (max 1 per 3 days)
      const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString();
      const { count: recentDrillNotif } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('type', 'weakness_drill')
        .gte('created_at', threeDaysAgo);

      if (recentDrillNotif === 0) {
        const { data: categoryStats } = await supabase
          .from('user_answers')
          .select('category, is_correct')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(200);

        if (categoryStats && categoryStats.length > 0) {
          const catMap: Record<string, { total: number; correct: number }> = {};
          for (const ans of categoryStats) {
            if (!catMap[ans.category]) catMap[ans.category] = { total: 0, correct: 0 };
            catMap[ans.category].total++;
            if (ans.is_correct) catMap[ans.category].correct++;
          }

          let worstCat = '';
          let worstPct = 100;
          for (const [cat, stats] of Object.entries(catMap)) {
            if (stats.total >= 5) {
              const pct = Math.round((stats.correct / stats.total) * 100);
              if (pct < 60 && pct < worstPct) {
                worstPct = pct;
                worstCat = cat;
              }
            }
          }

          if (worstCat) {
            notifications.push({
              user_id: userId,
              type: 'weakness_drill',
              title: `${worstCat} : votre point faible`,
              body: `Votre taux de réussite est de ${worstPct}%. Lancez un exercice ciblé !`,
              metadata: { category: worstCat, percent: worstPct },
            });
          }
        }
      }

      // Insert notifications (respecting daily limit of 3)
      const toInsert = notifications.slice(0, 3 - (todayCount || 0));
      if (toInsert.length > 0) {
        await supabase.from('notifications').insert(toInsert);
        totalCreated += toInsert.length;
      }
    }

    return new Response(JSON.stringify({ message: 'Done', users: uniqueUserIds.length, created: totalCreated }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
