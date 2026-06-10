-- Rate limiting infrastructure
-- 1. rate_limits: fixed-window counters used by edge functions (service role only)
-- 2. login_attempts: failed-login tracking enforcing max 5 attempts / 15 min per email

create table if not exists public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (key, window_start)
);

alter table public.rate_limits enable row level security;
-- No policies on purpose: clients get no direct access. Edge functions use the
-- service role; browser flows go through the SECURITY DEFINER functions below.

create table if not exists public.login_attempts (
  identifier text not null,
  attempted_at timestamptz not null default now(),
  success boolean not null default false
);

create index if not exists login_attempts_ident_time_idx
  on public.login_attempts (identifier, attempted_at desc);

alter table public.login_attempts enable row level security;
-- No policies: access only via the functions below.

-- ── Generic fixed-window counter (edge functions, service role only) ──
create or replace function public.consume_rate_limit(
  p_key text,
  p_max integer,
  p_window_seconds integer
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_window_start timestamptz;
  v_count integer;
begin
  if p_key is null or length(p_key) > 200 or p_max < 1 or p_window_seconds < 1 then
    return jsonb_build_object('allowed', false, 'error', 'invalid arguments');
  end if;

  v_window_start := to_timestamp(
    floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds
  );

  insert into public.rate_limits as rl (key, window_start, count)
  values (p_key, v_window_start, 1)
  on conflict (key, window_start)
  do update set count = rl.count + 1
  returning count into v_count;

  -- opportunistic cleanup of stale windows (cheap, bounded)
  delete from public.rate_limits
  where key = p_key and window_start < now() - make_interval(secs => p_window_seconds * 2);

  return jsonb_build_object(
    'allowed', v_count <= p_max,
    'remaining', greatest(p_max - v_count, 0),
    'retry_after_seconds',
      case when v_count <= p_max then 0
           else ceil(extract(epoch from (v_window_start + make_interval(secs => p_window_seconds) - now())))::int
      end
  );
end;
$$;

revoke all on function public.consume_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

-- ── Login: max 5 failed attempts per 15 minutes per identifier ──
create or replace function public.check_login_allowed(p_identifier text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_ident text := lower(trim(coalesce(p_identifier, '')));
  v_failed integer;
  v_oldest timestamptz;
begin
  if v_ident = '' or length(v_ident) > 320 then
    return jsonb_build_object('allowed', false, 'error', 'invalid identifier');
  end if;

  select count(*), min(attempted_at)
    into v_failed, v_oldest
    from public.login_attempts
   where identifier = v_ident
     and success = false
     and attempted_at > now() - interval '15 minutes';

  if v_failed >= 5 then
    return jsonb_build_object(
      'allowed', false,
      'retry_after_seconds',
        greatest(ceil(extract(epoch from (v_oldest + interval '15 minutes' - now())))::int, 1)
    );
  end if;

  return jsonb_build_object('allowed', true, 'remaining', 5 - v_failed);
end;
$$;

create or replace function public.record_login_attempt(p_identifier text, p_success boolean)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_ident text := lower(trim(coalesce(p_identifier, '')));
begin
  if v_ident = '' or length(v_ident) > 320 then
    return;
  end if;

  if p_success then
    -- successful login clears the failure window
    delete from public.login_attempts where identifier = v_ident;
  else
    insert into public.login_attempts (identifier, success) values (v_ident, false);
  end if;

  -- opportunistic cleanup
  delete from public.login_attempts where attempted_at < now() - interval '1 hour';
end;
$$;

grant execute on function public.check_login_allowed(text) to anon, authenticated;
grant execute on function public.record_login_attempt(text, boolean) to anon, authenticated;
