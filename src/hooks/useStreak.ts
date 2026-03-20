import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

/**
 * Lightweight hook that computes the user's daily activity streak
 * from `user_answers`. Counts consecutive days with at least one answer.
 */
export function useStreak(): number {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user) return;

    const compute = async () => {
      // Fetch distinct dates with activity (last 60 days max)
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const { data } = await supabase
        .from('user_answers')
        .select('answered_at')
        .eq('user_id', user.id)
        .gte('answered_at', sixtyDaysAgo.toISOString())
        .order('answered_at', { ascending: false });

      if (!data || data.length === 0) { setStreak(0); return; }

      // Get unique dates
      const dates = [...new Set(
        data.map(r => r.answered_at?.split('T')[0]).filter(Boolean)
      )].sort().reverse();

      if (dates.length === 0) { setStreak(0); return; }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let count = 0;
      for (let i = 0; i < dates.length; i++) {
        const expected = new Date(today);
        expected.setDate(expected.getDate() - i);
        const expectedStr = expected.toISOString().split('T')[0];

        if (dates.includes(expectedStr)) {
          count++;
        } else if (i === 0) {
          // No activity today — check if yesterday starts the streak
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          if (dates.includes(yesterday.toISOString().split('T')[0])) {
            count = 1;
            // Shift: next iteration should check day before yesterday
            today.setDate(today.getDate() - 1);
          } else {
            break;
          }
        } else {
          break;
        }
      }

      setStreak(count);
    };

    compute();
  }, [user]);

  return streak;
}
