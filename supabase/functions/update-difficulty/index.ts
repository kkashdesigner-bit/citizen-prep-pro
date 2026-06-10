import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { json, isServiceRoleRequest } from './shared.ts';

serve(async (req) => {
  // Internal cron/admin endpoint: service-role callers only.
  if (!isServiceRoleRequest(req)) return json(req, { error: 'Forbidden' }, 403);

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Recompute difficulty for all questions with >= 3 answers
    const { error } = await supabase.rpc('refresh_question_difficulty');
    if (error) {
      console.error('[update-difficulty] RPC error:', error);
      return json(req, { error: 'refresh_question_difficulty failed' }, 500);
    }

    return json(req, { success: true });
  } catch (err) {
    console.error('[update-difficulty] Error:', err);
    return json(req, { error: 'Internal error' }, 500);
  }
});
