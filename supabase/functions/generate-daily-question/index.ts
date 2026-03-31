import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const CATEGORIES = [
  'Principles and values of the Republic',
  'Institutional and political system',
  'Rights and duties',
  'History, geography and culture',
  'Living in French society',
];

serve(async (_req) => {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const today = new Date().toISOString().split('T')[0];

    // Check if today already has a daily question
    const { data: existing } = await supabase
      .from('daily_questions')
      .select('id')
      .eq('active_date', today)
      .maybeSingle();

    if (existing) {
      return new Response(JSON.stringify({ message: 'Daily question already exists', id: existing.id }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Determine category: rotate through categories based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const category = CATEGORIES[dayOfYear % CATEGORIES.length];

    // Get questions used in the last 60 days
    const sixtyDaysAgo = new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0];
    const { data: recentDailyQs } = await supabase
      .from('daily_questions')
      .select('question_id')
      .gte('active_date', sixtyDaysAgo);

    const recentIds = (recentDailyQs || []).map((r: any) => r.question_id);

    // Fetch a random question from the category, excluding recent ones
    let query = supabase
      .from('questions')
      .select('id')
      .eq('category', category);

    if (recentIds.length > 0) {
      query = query.not('id', 'in', `(${recentIds.join(',')})`);
    }

    const { data: candidates } = await query.limit(100);

    if (!candidates || candidates.length === 0) {
      // Fallback: any question from category
      const { data: fallback } = await supabase
        .from('questions')
        .select('id')
        .eq('category', category)
        .limit(100);

      if (!fallback || fallback.length === 0) {
        return new Response(JSON.stringify({ error: 'No questions available' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const picked = fallback[Math.floor(Math.random() * fallback.length)];
      const { data: dq } = await supabase
        .from('daily_questions')
        .insert({ question_id: picked.id, active_date: today, category })
        .select('id')
        .single();

      return new Response(JSON.stringify({ message: 'Created (fallback)', id: dq?.id }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const picked = candidates[Math.floor(Math.random() * candidates.length)];

    // Insert daily question
    const { data: dq } = await supabase
      .from('daily_questions')
      .insert({ question_id: picked.id, active_date: today, category })
      .select('id')
      .single();

    // Create notifications for active users (active in last 14 days)
    const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();
    const { data: activeUsers } = await supabase
      .from('user_answers')
      .select('user_id')
      .gte('created_at', fourteenDaysAgo);

    const uniqueUserIds = [...new Set((activeUsers || []).map((u: any) => u.user_id))];

    if (uniqueUserIds.length > 0) {
      const notifications = uniqueUserIds.map((userId: string) => ({
        user_id: userId,
        type: 'daily_question',
        title: 'Question du jour disponible !',
        body: 'Une nouvelle question vous attend. Testez vos connaissances !',
        metadata: { daily_question_id: dq?.id },
      }));

      // Insert in batches of 500
      for (let i = 0; i < notifications.length; i += 500) {
        await supabase.from('notifications').insert(notifications.slice(i, i + 500));
      }
    }

    return new Response(JSON.stringify({ message: 'Created', id: dq?.id, notified: uniqueUserIds.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
