import type { User, WorkoutSession } from '../types';
import { getCurrentWeekDates } from './dateSchedule';

function toDateStr(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function userSessionsSorted(sessions: WorkoutSession[], userId: User): WorkoutSession[] {
  return sessions
    .filter((s) => s.userId === userId)
    .sort((a, b) => (b.startTime || 0) - (a.startTime || 0));
}

/**
 * Smart Defaults: returns the weight/reps from the user's most recent previous
 * session for this exercise, falling back to the routine template default.
 */
export function getSmartDefaults(
  sessions: WorkoutSession[],
  userId: User,
  exerciseId: string,
  fallbackWeight: number,
  fallbackReps: number
): { weight: number; reps: number; isFromPreviousSession: boolean } {
  for (const session of userSessionsSorted(sessions, userId)) {
    const exercise = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (exercise && exercise.sets.length > 0) {
      const completedSets = exercise.sets.filter((s) => s.completed);
      const targetSet = completedSets.length > 0 ? completedSets[completedSets.length - 1] : exercise.sets[0];
      if (targetSet && targetSet.weight > 0 && targetSet.reps > 0) {
        return { weight: targetSet.weight, reps: targetSet.reps, isFromPreviousSession: true };
      }
    }
  }
  return { weight: fallbackWeight, reps: fallbackReps, isFromPreviousSession: false };
}

/** Historical maximum weight (and reps at that weight) ever logged for an exercise. */
export function getHistoricalMax(
  sessions: WorkoutSession[],
  userId: User,
  exerciseId: string
): { maxWeight: number; maxRepsAtWeight: number } {
  let maxWeight = 0;
  let maxRepsAtWeight = 0;

  for (const s of sessions) {
    if (s.userId !== userId) continue;
    const ex = s.exercises.find((e) => e.exerciseId === exerciseId);
    if (!ex) continue;
    for (const set of ex.sets) {
      if (!set.completed) continue;
      if (set.weight > maxWeight) {
        maxWeight = set.weight;
        maxRepsAtWeight = set.reps;
      } else if (set.weight === maxWeight && set.reps > maxRepsAtWeight) {
        maxRepsAtWeight = set.reps;
      }
    }
  }

  return { maxWeight, maxRepsAtWeight };
}

/** Whether weight/reps beats the user's historical record for this exercise. */
export function checkIfPR(sessions: WorkoutSession[], userId: User, exerciseId: string, weight: number, reps: number): boolean {
  if (weight <= 0 || reps <= 0) return false;
  const { maxWeight, maxRepsAtWeight } = getHistoricalMax(sessions, userId, exerciseId);
  if (maxWeight === 0) return false;
  if (weight > maxWeight) return true;
  if (weight === maxWeight && reps > maxRepsAtWeight) return true;
  return false;
}

/**
 * Real consecutive-day streak, counted over scheduled training days only
 * (Sat/Sun are rest days in the PPLPP split and never break the streak).
 * Today doesn't break the streak if it's simply not logged yet.
 */
export function computeStreak(sessions: WorkoutSession[], userId: User): number {
  const userDates = new Set(sessions.filter((s) => s.userId === userId).map((s) => s.date));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!userDates.has(toDateStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  // Safety cap so a bug can never spin this into an infinite loop.
  for (let i = 0; i < 3650; i++) {
    const dow = cursor.getDay();
    if (dow === 0 || dow === 6) {
      cursor.setDate(cursor.getDate() - 1);
      continue;
    }
    if (userDates.has(toDateStr(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

/** Distinct calendar days this Mon-Fri week that have at least one logged session. */
export function computeWeeklySessionDays(sessions: WorkoutSession[], userId: User): number {
  const weekDates = new Set(Object.values(getCurrentWeekDates()));
  const daysWithSessions = new Set(
    sessions.filter((s) => s.userId === userId && weekDates.has(s.date)).map((s) => s.date)
  );
  return daysWithSessions.size;
}

/** Lifetime total PRs ever hit by this user. */
export function computeTotalPRs(sessions: WorkoutSession[], userId: User): number {
  return sessions.filter((s) => s.userId === userId).reduce((acc, s) => acc + (s.prCount || 0), 0);
}

/** Lifetime total volume (weight x reps summed over completed sets) for this user. */
export function computeTotalVolume(sessions: WorkoutSession[], userId: User): number {
  return sessions.filter((s) => s.userId === userId).reduce((acc, s) => acc + (s.totalVolume || 0), 0);
}

/** Lifetime total completed sets for this user. */
export function computeTotalSets(sessions: WorkoutSession[], userId: User): number {
  return sessions.filter((s) => s.userId === userId).reduce((acc, s) => acc + (s.completedSets || 0), 0);
}

export interface StrengthCurvePoint {
  date: string;
  maxWeight: number;
  repsAtMaxWeight: number;
}

/**
 * Real strength-curve data points: for each of the user's sessions that
 * logged this exercise, the top completed set's weight, oldest to newest.
 */
export function computeStrengthCurve(sessions: WorkoutSession[], userId: User, exerciseId: string): StrengthCurvePoint[] {
  const points: StrengthCurvePoint[] = [];

  const relevant = sessions
    .filter((s) => s.userId === userId)
    .sort((a, b) => (a.startTime || 0) - (b.startTime || 0));

  for (const session of relevant) {
    const ex = session.exercises.find((e) => e.exerciseId === exerciseId);
    if (!ex) continue;

    let topWeight = 0;
    let repsAtTop = 0;
    for (const set of ex.sets) {
      if (!set.completed) continue;
      if (set.weight > topWeight) {
        topWeight = set.weight;
        repsAtTop = set.reps;
      }
    }
    if (topWeight > 0) {
      points.push({ date: session.date, maxWeight: topWeight, repsAtMaxWeight: repsAtTop });
    }
  }

  return points;
}

/** All distinct exercise names+ids the user has ever logged, for the analytics dropdown. */
export function listLoggedExercises(sessions: WorkoutSession[], userId: User): { id: string; name: string }[] {
  const seen = new Map<string, string>();
  for (const s of sessions) {
    if (s.userId !== userId) continue;
    for (const ex of s.exercises) {
      if (!seen.has(ex.exerciseId)) seen.set(ex.exerciseId, ex.exerciseName);
    }
  }
  return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
}
