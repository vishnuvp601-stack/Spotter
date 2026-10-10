import { useState, useMemo } from 'react';
import type { User, WeightUnit, WorkoutSession } from '../types';
import { BarChart2, Flame, CalendarCheck, ArrowLeft, Crown, Dumbbell } from 'lucide-react';
import {
  computeStreak,
  computeWeeklySessionDays,
  computeTotalVolume,
  computeTotalSets,
  computeStrengthCurve,
  listLoggedExercises,
} from '../utils/workoutStats';
import { getCurrentWeekDates } from '../utils/dateSchedule';

interface AnalyticsViewProps {
  sessions: WorkoutSession[];
  activeUser: User;
  unit: WeightUnit;
  onBackToDashboard?: () => void;
}

const WEEKDAY_LABELS: Record<number, string> = { 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI' };

export function AnalyticsView({ sessions, activeUser, unit, onBackToDashboard }: AnalyticsViewProps) {
  const userSessions = useMemo(() => sessions.filter((s) => s.userId === activeUser), [sessions, activeUser]);

  const loggedExercises = useMemo(() => listLoggedExercises(sessions, activeUser), [sessions, activeUser]);

  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const activeExerciseId = selectedExerciseId || loggedExercises[0]?.id || '';
  const activeExerciseName = loggedExercises.find((e) => e.id === activeExerciseId)?.name;

  const strengthCurve = useMemo(
    () => (activeExerciseId ? computeStrengthCurve(sessions, activeUser, activeExerciseId) : []),
    [sessions, activeUser, activeExerciseId]
  );

  const streak = computeStreak(sessions, activeUser);
  const weeklyDays = computeWeeklySessionDays(sessions, activeUser);
  const totalVolume = computeTotalVolume(sessions, activeUser);
  const totalSets = computeTotalSets(sessions, activeUser);

  const weekDates = getCurrentWeekDates();
  const weekDays = [1, 2, 3, 4, 5].map((dayNumber) => ({
    dayNumber,
    label: WEEKDAY_LABELS[dayNumber],
    completed: userSessions.some((s) => s.date === weekDates[dayNumber]),
  }));

  const recentCurvePoints = strengthCurve.slice(-8);
  const maxCurveWeight = recentCurvePoints.reduce((m, p) => Math.max(m, p.maxWeight), 0);

  return (
    <div className="space-y-8 sm:space-y-10 select-none">
      <div className="flex items-center gap-3">
        {onBackToDashboard && (
          <button
            type="button"
            onClick={onBackToDashboard}
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer shrink-0 bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-950 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-zinc-300 dark:hover:text-white"
            title="Back to Dashboard"
            aria-label="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-[#e0e0e0] leading-snug">Analytics</h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-normal">
            Progress for {activeUser === 'vishnu' ? 'Vishnu' : 'Amy'}
          </p>
        </div>
      </div>

      {/* Stat Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="border rounded-3xl p-5 sm:p-6 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>STREAK</span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums">{streak}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">days</span>
          </div>
        </div>

        <div className="border rounded-3xl p-5 sm:p-6 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <CalendarCheck className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>THIS WEEK</span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums">{weeklyDays}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">/ 5 days</span>
          </div>
        </div>

        <div className="border rounded-3xl p-5 sm:p-6 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <BarChart2 className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>TOTAL VOLUME</span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums">{totalVolume.toLocaleString()}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">{unit}</span>
          </div>
        </div>

        <div className="border rounded-3xl p-5 sm:p-6 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <Dumbbell className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>TOTAL SETS</span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums">{totalSets.toLocaleString()}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">sets</span>
          </div>
        </div>
      </div>

      {/* Weekly Completion Grid */}
      <div className="border rounded-3xl p-6 sm:p-7 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
        <h3 className="text-sm font-bold leading-normal mb-4">This Week's Training Days</h3>
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5">
          {weekDays.map((day) => (
            <div key={day.dayNumber} className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider">{day.label}</span>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                  day.completed
                    ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-600/90 dark:text-emerald-400/85'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-400 dark:bg-[#141417] dark:border-[#28282e] dark:text-zinc-600'
                }`}
              >
                {day.completed ? '✓' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strength Curve */}
      <div className="border rounded-3xl p-6 sm:p-8 space-y-6 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold leading-normal">Strength Curve</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-normal">
              Top completed set weight per session
            </p>
          </div>

          {loggedExercises.length > 0 ? (
            <select
              value={activeExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="px-3.5 py-2 rounded-xl border text-xs font-semibold focus:outline-none focus:border-emerald-600/70 bg-zinc-100 border-zinc-300 text-zinc-800 dark:bg-[#222226] dark:border-[#2f2f35] dark:text-[#e0e0e0]"
            >
              {loggedExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          ) : null}
        </div>

        {recentCurvePoints.length === 0 ? (
          <div className="py-10 text-center space-y-1.5">
            <p className="text-sm font-bold text-zinc-600 dark:text-zinc-300">No logged sets yet{activeExerciseName ? ` for ${activeExerciseName}` : ''}.</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-normal">
              Complete a few sets in a workout and your progress will chart here.
            </p>
          </div>
        ) : (
          <div className="flex items-end justify-between gap-2 sm:gap-3 h-44 sm:h-52 px-1">
            {recentCurvePoints.map((point, idx) => {
              const heightPct = maxCurveWeight > 0 ? Math.max(6, Math.round((point.maxWeight / maxCurveWeight) * 100)) : 6;
              const isLatest = idx === recentCurvePoints.length - 1;

              return (
                <div key={`${point.date}-${idx}`} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                  <span className="text-[10px] sm:text-xs font-bold tabular-nums text-zinc-700 dark:text-zinc-300">
                    {point.maxWeight}
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      isLatest ? 'bg-emerald-500/80' : 'bg-zinc-300 dark:bg-[#33333a]'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-normal tabular-nums">
                    {point.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {recentCurvePoints.length > 0 && (
          <div className="pt-3 border-t border-zinc-200 dark:border-[#28282e] flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-normal">
              {recentCurvePoints.length} session{recentCurvePoints.length > 1 ? 's' : ''} shown
            </span>
            <span className="font-bold flex items-center gap-1.5 text-amber-500">
              <Crown className="w-3.5 h-3.5" />
              Latest: {recentCurvePoints[recentCurvePoints.length - 1].maxWeight} {unit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
