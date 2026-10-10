-- ============================================================================
-- Spotter gym tracker - Supabase schema
-- ============================================================================
-- HOW TO USE:
-- 1. Create a free project at https://supabase.com
-- 2. Open your project -> SQL Editor -> New query
-- 3. Paste this ENTIRE file and click Run
-- Safe to re-run: every statement below is idempotent (uses IF NOT EXISTS /
-- ON CONFLICT / DROP ... IF EXISTS guards), so running it again after a
-- partial failure will not error out.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Tables
-- ----------------------------------------------------------------------------

create table if not exists profiles (
  id text primary key, -- 'vishnu' | 'amy'
  display_name text not null,
  is_admin boolean not null default false,
  unit text not null default 'kg' check (unit in ('kg', 'lbs')),
  weekly_target_days int not null default 5,
  theme text not null default 'dark' check (theme in ('dark', 'light'))
);

create table if not exists routines (
  id text primary key,
  name text not null,
  day_number int not null default 0, -- 1=Mon .. 5=Fri, 0=custom/unscheduled
  target_category text not null default '',
  description text not null default '',
  exercises jsonb not null default '[]'::jsonb,
  is_custom boolean not null default false,
  created_by text references profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists workout_sessions (
  id text primary key,
  user_id text not null references profiles(id) on delete cascade,
  routine_id text not null,
  routine_name text not null,
  date date not null,
  start_time bigint not null,
  end_time bigint,
  duration_minutes int,
  exercises jsonb not null default '[]'::jsonb,
  notes text default '',
  pr_count int default 0,
  total_volume numeric default 0,
  completed_sets int default 0,
  created_at timestamptz not null default now()
);

create table if not exists session_reactions (
  id uuid primary key default gen_random_uuid(),
  session_id text not null references workout_sessions(id) on delete cascade,
  reactor_id text not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (session_id, reactor_id)
);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- This is a 2-person household app sitting behind ONE shared login (see
-- SETUP.md). Anyone signed in (authenticated) can read/write everything;
-- everyone else (the public internet) is blocked entirely.
-- ----------------------------------------------------------------------------

alter table profiles enable row level security;
alter table routines enable row level security;
alter table workout_sessions enable row level security;
alter table session_reactions enable row level security;

drop policy if exists "authenticated read profiles" on profiles;
create policy "authenticated read profiles" on profiles for select to authenticated using (true);
drop policy if exists "authenticated update profiles" on profiles;
create policy "authenticated update profiles" on profiles for update to authenticated using (true);

drop policy if exists "authenticated read routines" on routines;
create policy "authenticated read routines" on routines for select to authenticated using (true);
drop policy if exists "authenticated insert routines" on routines;
create policy "authenticated insert routines" on routines for insert to authenticated with check (true);
drop policy if exists "authenticated update routines" on routines;
create policy "authenticated update routines" on routines for update to authenticated using (true);
drop policy if exists "authenticated delete routines" on routines;
create policy "authenticated delete routines" on routines for delete to authenticated using (true);

drop policy if exists "authenticated read sessions" on workout_sessions;
create policy "authenticated read sessions" on workout_sessions for select to authenticated using (true);
drop policy if exists "authenticated insert sessions" on workout_sessions;
create policy "authenticated insert sessions" on workout_sessions for insert to authenticated with check (true);
drop policy if exists "authenticated update sessions" on workout_sessions;
create policy "authenticated update sessions" on workout_sessions for update to authenticated using (true);
drop policy if exists "authenticated delete sessions" on workout_sessions;
create policy "authenticated delete sessions" on workout_sessions for delete to authenticated using (true);

drop policy if exists "authenticated read reactions" on session_reactions;
create policy "authenticated read reactions" on session_reactions for select to authenticated using (true);
drop policy if exists "authenticated insert reactions" on session_reactions;
create policy "authenticated insert reactions" on session_reactions for insert to authenticated with check (true);
drop policy if exists "authenticated delete reactions" on session_reactions;
create policy "authenticated delete reactions" on session_reactions for delete to authenticated using (true);

-- ----------------------------------------------------------------------------
-- Realtime - so both devices get instant live updates
-- ----------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'workout_sessions') then
    alter publication supabase_realtime add table workout_sessions;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'routines') then
    alter publication supabase_realtime add table routines;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'session_reactions') then
    alter publication supabase_realtime add table session_reactions;
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- Seed data: the two household profiles
-- ----------------------------------------------------------------------------

insert into profiles (id, display_name, is_admin, unit, weekly_target_days, theme) values
  ('vishnu', 'Vishnu', true, 'kg', 5, 'dark'),
  ('amy', 'Amy', false, 'kg', 5, 'dark')
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Seed data: default PPLPP 5-day split templates
-- (exact same exercises/sets/reps as the original app, so nothing is lost)
-- ----------------------------------------------------------------------------

insert into routines (id, name, day_number, target_category, description, exercises, is_custom) values
('push-a', 'Push A', 1, 'Chest & Triceps', 'Chest emphasis with heavy benching and triceps', '[
  {"id":"incline-db-press","name":"Incline Dumbbell Press","targetMuscle":"Upper Chest","defaultSets":3,"defaultReps":10,"defaultWeight":28},
  {"id":"cable-chest-flyes","name":"Cable Chest Flyes","targetMuscle":"Mid Chest","defaultSets":3,"defaultReps":12,"defaultWeight":15},
  {"id":"machine-chest-press","name":"Machine Chest Press","targetMuscle":"Chest / Triceps","defaultSets":3,"defaultReps":10,"defaultWeight":65},
  {"id":"db-lateral-raise","name":"Dumbbell Lateral Raise","targetMuscle":"Lateral Delts","defaultSets":4,"defaultReps":12,"defaultWeight":12},
  {"id":"tricep-pushdown","name":"Triceps Cable Pushdown","targetMuscle":"Triceps Lateral Head","defaultSets":3,"defaultReps":12,"defaultWeight":25},
  {"id":"cable-overhead-ext","name":"Cable Overhead Extension","targetMuscle":"Triceps Long Head","defaultSets":3,"defaultReps":12,"defaultWeight":20}
]'::jsonb, false),
('pull-a', 'Pull A', 2, 'Back & Deadlift', 'Back thickness & deadlift focus with biceps', '[
  {"id":"lat-pulldown","name":"Lat Pulldown","targetMuscle":"Lats","defaultSets":3,"defaultReps":10,"defaultWeight":60},
  {"id":"seated-cable-row","name":"Seated Cable Row","targetMuscle":"Mid-Back / Rhomboids","defaultSets":3,"defaultReps":10,"defaultWeight":55},
  {"id":"face-pull","name":"Face Pull","targetMuscle":"Rear Delts / Rotator Cuff","defaultSets":4,"defaultReps":15,"defaultWeight":17.5},
  {"id":"back-extension","name":"Back Extension (Hyperextension)","targetMuscle":"Lower Back / Glutes","defaultSets":3,"defaultReps":10,"defaultWeight":20},
  {"id":"barbell-biceps-curl","name":"Barbell Biceps Curl","targetMuscle":"Biceps","defaultSets":3,"defaultReps":10,"defaultWeight":30},
  {"id":"hammer-curl","name":"Dumbbell Hammer Curl","targetMuscle":"Brachialis / Forearms","defaultSets":3,"defaultReps":12,"defaultWeight":16}
]'::jsonb, false),
('legs', 'Legs', 3, 'Squats & Quads', 'Squat strength, posterior chain, and calves', '[
  {"id":"leg-press","name":"Leg Press","targetMuscle":"Quads / Glutes","defaultSets":3,"defaultReps":12,"defaultWeight":160},
  {"id":"leg-extension","name":"Leg Extension","targetMuscle":"Quads","defaultSets":3,"defaultReps":12,"defaultWeight":55},
  {"id":"seated-leg-curl","name":"Seated Leg Curl","targetMuscle":"Hamstrings","defaultSets":3,"defaultReps":12,"defaultWeight":50},
  {"id":"standing-calf-raise","name":"Standing Calf Raise","targetMuscle":"Calves","defaultSets":3,"defaultReps":35,"defaultWeight":60},
  {"id":"treadmill-incline","name":"Treadmill Incline Walk","targetMuscle":"Cardio & Posterior Chain","defaultSets":1,"defaultReps":1,"defaultWeight":0}
]'::jsonb, false),
('push-b', 'Push B', 4, 'Shoulders & OHP', 'Overhead shoulder power, upper chest, and triceps', '[
  {"id":"overhead-bb-press","name":"Overhead Barbell Press (OHP)","targetMuscle":"Shoulders / Core","defaultSets":4,"defaultReps":6,"defaultWeight":52.5},
  {"id":"incline-bb-bench","name":"Incline Barbell Bench","targetMuscle":"Upper Chest","defaultSets":3,"defaultReps":8,"defaultWeight":65},
  {"id":"chest-dips","name":"Chest Dips","targetMuscle":"Chest / Triceps","defaultSets":3,"defaultReps":10,"defaultWeight":10},
  {"id":"cable-lat-raise","name":"Cable Lateral Raise","targetMuscle":"Lateral Delts","defaultSets":4,"defaultReps":12,"defaultWeight":10},
  {"id":"overhead-tricep-ext","name":"Cable Overhead Triceps Ext","targetMuscle":"Triceps Long Head","defaultSets":3,"defaultReps":12,"defaultWeight":22.5}
]'::jsonb, false),
('pull-b', 'Pull B', 5, 'Lats & Arms', 'Lat width, upper back rows, and arms', '[
  {"id":"pull-ups","name":"Pull-ups","targetMuscle":"Lats & Upper Back","defaultSets":4,"defaultReps":8,"defaultWeight":0},
  {"id":"barbell-bent-row","name":"Barbell Bent-Over Row","targetMuscle":"Mid-Back / Rhomboids","defaultSets":3,"defaultReps":8,"defaultWeight":70},
  {"id":"chest-supported-row","name":"Chest-Supported Row","targetMuscle":"Mid Back / Upper Lats","defaultSets":3,"defaultReps":10,"defaultWeight":55},
  {"id":"rear-delt-fly","name":"Rear Delt Fly","targetMuscle":"Rear Delts","defaultSets":4,"defaultReps":15,"defaultWeight":14},
  {"id":"incline-db-curl","name":"Incline Dumbbell Curl","targetMuscle":"Biceps Long Head","defaultSets":3,"defaultReps":10,"defaultWeight":14}
]'::jsonb, false)
on conflict (id) do nothing;
