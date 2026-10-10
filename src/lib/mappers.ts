import type { LoggedExercise, Profile, Routine, User, WeightUnit, WorkoutSession } from '../types';

// ---------------------------------------------------------------------------
// Supabase rows use snake_case columns; the app's TS types use camelCase.
// These mappers are the single place that translates between the two shapes.
// ---------------------------------------------------------------------------

export interface ProfileRow {
  id: string;
  display_name: string;
  is_admin: boolean;
  unit: string;
  weekly_target_days: number;
  theme: string;
}

export function rowToProfile(row: ProfileRow): Profile {
  return {
    id: row.id as User,
    displayName: row.display_name,
    isAdmin: row.is_admin,
    unit: row.unit as WeightUnit,
    weeklyTargetDays: row.weekly_target_days,
    theme: row.theme as 'dark' | 'light',
  };
}

export interface RoutineRow {
  id: string;
  name: string;
  day_number: number;
  target_category: string;
  description: string;
  exercises: Routine['exercises'];
  is_custom: boolean;
  created_by: string | null;
}

export function rowToRoutine(row: RoutineRow): Routine {
  return {
    id: row.id,
    name: row.name,
    dayNumber: row.day_number,
    targetCategory: row.target_category,
    description: row.description,
    exercises: row.exercises,
    isCustom: row.is_custom,
    createdBy: (row.created_by as User | null) ?? null,
  };
}

export function routineToInsertRow(routine: Routine) {
  return {
    id: routine.id,
    name: routine.name,
    day_number: routine.dayNumber,
    target_category: routine.targetCategory,
    description: routine.description,
    exercises: routine.exercises,
    is_custom: routine.isCustom ?? false,
    created_by: routine.createdBy ?? null,
  };
}

export interface WorkoutSessionRow {
  id: string;
  user_id: string;
  routine_id: string;
  routine_name: string;
  date: string;
  start_time: number;
  end_time: number | null;
  duration_minutes: number | null;
  exercises: LoggedExercise[];
  notes: string | null;
  pr_count: number | null;
  total_volume: number | null;
  completed_sets: number | null;
}

export function rowToSession(row: WorkoutSessionRow): WorkoutSession {
  return {
    id: row.id,
    userId: row.user_id as User,
    routineId: row.routine_id,
    routineName: row.routine_name,
    date: row.date,
    startTime: row.start_time,
    endTime: row.end_time ?? undefined,
    durationMinutes: row.duration_minutes ?? undefined,
    exercises: row.exercises,
    notes: row.notes ?? undefined,
    prCount: row.pr_count ?? 0,
    totalVolume: row.total_volume ?? 0,
    completedSets: row.completed_sets ?? 0,
  };
}

export function sessionToInsertRow(session: WorkoutSession) {
  return {
    id: session.id,
    user_id: session.userId,
    routine_id: session.routineId,
    routine_name: session.routineName,
    date: session.date,
    start_time: session.startTime,
    end_time: session.endTime ?? null,
    duration_minutes: session.durationMinutes ?? null,
    exercises: session.exercises,
    notes: session.notes ?? '',
    pr_count: session.prCount ?? 0,
    total_volume: session.totalVolume ?? 0,
    completed_sets: session.completedSets ?? 0,
  };
}
