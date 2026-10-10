import type { WorkoutSession, User, Routine } from '../types';

export interface ScheduleDayStatus {
  dayNumber: number; // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri
  shortLabel: string;
  fullDayName: string;
  routineId: string;
  routineName: string;
  focus: string;
  status: 'today' | 'done' | 'skipped' | 'upcoming';
  dateStr: string; // YYYY-MM-DD
}

export function getCurrentDayIndex(): number {
  return new Date().getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
}

// Local calendar date (not UTC) as YYYY-MM-DD - avoids an off-by-one near midnight.
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns the YYYY-MM-DD date string for Monday-Friday of the current week.
 */
export function getCurrentWeekDates(): Record<number, string> {
  const now = new Date();
  const currentDayIndex = now.getDay(); // 0 = Sun, 1 = Mon, ...

  // Calculate difference to Monday
  const diffToMonday = currentDayIndex === 0 ? -6 : 1 - currentDayIndex;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const dates: Record<number, string> = {};
  for (let i = 1; i <= 5; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + (i - 1));
    const year = dayDate.getFullYear();
    const month = String(dayDate.getMonth() + 1).padStart(2, '0');
    const day = String(dayDate.getDate()).padStart(2, '0');
    dates[i] = `${year}-${month}-${day}`;
  }

  return dates;
}

const BASE_SCHEDULE_CONFIG = [
  { dayNumber: 1, shortLabel: 'MON', fullDayName: 'Monday', routineId: 'push-a', routineName: 'Push A', focus: 'Chest & Triceps' },
  { dayNumber: 2, shortLabel: 'TUE', fullDayName: 'Tuesday', routineId: 'pull-a', routineName: 'Pull A', focus: 'Back & Deadlift' },
  { dayNumber: 3, shortLabel: 'WED', fullDayName: 'Wednesday', routineId: 'legs', routineName: 'Legs', focus: 'Squats & Quads' },
  { dayNumber: 4, shortLabel: 'THU', fullDayName: 'Thursday', routineId: 'push-b', routineName: 'Push B', focus: 'Shoulders & OHP' },
  { dayNumber: 5, shortLabel: 'FRI', fullDayName: 'Friday', routineId: 'pull-b', routineName: 'Pull B', focus: 'Lats & Arms' },
] as const;

/**
 * Accurately determines whether each day in the 5-day Mon-Fri cycle is:
 * - 'today': if dayNumber matches today's day of the week
 * - 'done': if the day is in the past AND a session exists for that day/routine
 * - 'skipped': if the day is in the past AND NO session exists
 * - 'upcoming': if the day is in the future
 */
export function getScheduleWithStatus(
  sessions: WorkoutSession[],
  activeUser: User,
  routines: Routine[] = []
): ScheduleDayStatus[] {
  const currentDayIndex = getCurrentDayIndex();
  const weekDates = getCurrentWeekDates();
  const userSessions = sessions.filter((s) => s.userId === activeUser);

  return BASE_SCHEDULE_CONFIG.map((item) => {
    const dayDateStr = weekDates[item.dayNumber];

    // Exact date match only - a session from a different day must not mark this day done.
    const hasCompletedWorkout = userSessions.some((s) => s.date === dayDateStr);

    let status: 'today' | 'done' | 'skipped' | 'upcoming';

    if (currentDayIndex >= 1 && currentDayIndex <= 5 && item.dayNumber === currentDayIndex) {
      status = 'today';
    } else {
      const isPastDay =
        currentDayIndex === 0 ||
        currentDayIndex === 6 ||
        item.dayNumber < currentDayIndex;

      status = isPastDay ? (hasCompletedWorkout ? 'done' : 'skipped') : 'upcoming';
    }

    // Prefer the live routine's name/category so edits made in the Routines tab show up here too.
    const liveRoutine = routines.find((r) => r.id === item.routineId);

    return {
      ...item,
      routineName: liveRoutine?.name ?? item.routineName,
      focus: liveRoutine?.targetCategory ?? item.focus,
      status,
      dateStr: dayDateStr,
    };
  });
}

export function getTodayRoutineInfo(): {
  isWeekend: boolean;
  dayNumber: number;
  dayName: string;
  routineName: string;
  routineId: string;
} {
  const dayIndex = getCurrentDayIndex();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[dayIndex];

  switch (dayIndex) {
    case 1:
      return { isWeekend: false, dayNumber: 1, dayName, routineName: 'Push A', routineId: 'push-a' };
    case 2:
      return { isWeekend: false, dayNumber: 2, dayName, routineName: 'Pull A', routineId: 'pull-a' };
    case 3:
      return { isWeekend: false, dayNumber: 3, dayName, routineName: 'Legs', routineId: 'legs' };
    case 4:
      return { isWeekend: false, dayNumber: 4, dayName, routineName: 'Push B', routineId: 'push-b' };
    case 5:
      return { isWeekend: false, dayNumber: 5, dayName, routineName: 'Pull B', routineId: 'pull-b' };
    default:
      return { isWeekend: true, dayNumber: dayIndex, dayName, routineName: 'Push A', routineId: 'push-a' };
  }
}

export function formatDatePretty(dateStr: string): string {
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    }
  } catch {
    // fallback below
  }
  return dateStr;
}

export function formatFriendlyTimeAgo(timestampOrDate: number | string): string {
  try {
    const timeMs = typeof timestampOrDate === 'number' ? timestampOrDate : new Date(timestampOrDate).getTime();
    if (isNaN(timeMs)) return 'yesterday';

    const diffMs = Date.now() - timeMs;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 0 || diffHours > 24 * 30) return 'yesterday';
    if (diffHours === 0) return 'earlier today';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return diffDays === 1 ? 'yesterday' : `${diffDays} days ago`;
  } catch {
    return 'yesterday';
  }
}
