import type { User, Routine, WorkoutSession } from '../types';
import { Play, Plus, Barbell, ChartBar, Flame, Trophy, Calendar, Footprints, ThumbsUp, Crown } from '@phosphor-icons/react';

interface DashboardFeedProps {
  activeUser: User;
  currentRoutine: Routine;
  onLaunchRoutine: (routine: Routine) => void;
  onStartCardio: () => void;
  onStartEmpty: () => void;
  onGoToRoutines: () => void;
  onGoToAnalytics: () => void;
  onGoToHistory: () => void;
  recentSessions: WorkoutSession[];
  streak: number;
  weeklyDays: number;
  totalPRs: number;
  partnerName: string;
  partnerStreak: number;
  partnerLatestSession?: WorkoutSession;
  reactionCount: number;
  hasReacted: boolean;
  onFistBump: () => void;
}

export function DashboardFeed({
  currentRoutine,
  onLaunchRoutine,
  onStartCardio,
  onStartEmpty,
  onGoToRoutines,
  onGoToAnalytics,
  onGoToHistory,
  recentSessions,
  streak,
  weeklyDays,
  totalPRs,
  partnerName,
  partnerStreak,
  partnerLatestSession,
  reactionCount,
  hasReacted,
  onFistBump,
}: DashboardFeedProps) {
  const partnerSessionMinutes = partnerLatestSession
    ? Math.max(1, Math.round(((partnerLatestSession.endTime ?? partnerLatestSession.startTime) - partnerLatestSession.startTime) / 60000))
    : 0;

  return (
    <div className="space-y-8 pt-2 select-none">
      {/* 1. Stat row */}
      <div className="grid grid-cols-3 divide-x divide-zinc-200 dark:divide-[#28282e] border-b border-zinc-200 dark:border-[#28282e] pb-6">
        <div className="pr-4">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Flame className="w-3.5 h-3.5 text-amber-500" weight="fill" />
            <span>Streak</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tabular-nums">{streak}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">days</span>
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Calendar className="w-3.5 h-3.5" weight="fill" />
            <span>This week</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tabular-nums">{weeklyDays}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">/ 5 days</span>
          </div>
        </div>

        <div className="pl-4">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <Trophy className="w-3.5 h-3.5 text-amber-500" weight="fill" />
            <span>PRs hit</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold tabular-nums">{totalPRs}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">records</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions */}
      <div className="space-y-3">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Quick actions</span>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            type="button"
            onClick={() => onLaunchRoutine(currentRoutine)}
            className="rounded-lg p-4 text-left transition-colors flex flex-col justify-between min-h-[100px] focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-[#18181b] dark:hover:bg-[#1c1c20]"
          >
            <Play className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mb-2" weight="fill" />
            <div>
              <p className="text-sm font-medium leading-normal text-zinc-900 dark:text-[#e0e0e0]">Start PPL Routine</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate leading-normal">
                {currentRoutine.name} next
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onStartCardio}
            className="rounded-lg p-4 text-left transition-colors flex flex-col justify-between min-h-[100px] focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-[#18181b] dark:hover:bg-[#1c1c20]"
          >
            <Footprints className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mb-2" weight="fill" />
            <div>
              <p className="text-sm font-medium leading-normal text-zinc-900 dark:text-[#e0e0e0]">Incline Cardio</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">12% Inc • 3.5k</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onStartEmpty}
            className="rounded-lg p-4 text-left transition-colors flex flex-col justify-between min-h-[100px] focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-[#18181b] dark:hover:bg-[#1c1c20]"
          >
            <Plus className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mb-2" weight="bold" />
            <div>
              <p className="text-sm font-medium leading-normal text-zinc-900 dark:text-[#e0e0e0]">Empty Log</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">Freeform session</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onGoToRoutines}
            className="rounded-lg p-4 text-left transition-colors flex flex-col justify-between min-h-[100px] focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-50 hover:bg-zinc-100 dark:bg-[#18181b] dark:hover:bg-[#1c1c20]"
          >
            <Barbell className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mb-2" weight="fill" />
            <div>
              <p className="text-sm font-medium leading-normal text-zinc-900 dark:text-[#e0e0e0]">Routines</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">5-Day PPL split</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onGoToAnalytics}
            className="rounded-lg p-4 text-left transition-colors flex flex-col justify-between min-h-[100px] focus:outline-none focus:ring-0 select-none cursor-pointer col-span-2 sm:col-span-1 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#18181b] dark:hover:bg-[#1c1c20]"
          >
            <ChartBar className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mb-2" weight="fill" />
            <div>
              <p className="text-sm font-medium leading-normal text-zinc-900 dark:text-[#e0e0e0]">Analytics</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal">Track PR curves</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Partner Activity Feed */}
      <div className="py-5 border-t border-b border-zinc-200 dark:border-[#28282e]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-[#1c1c20] text-zinc-600 dark:text-zinc-300 flex items-center justify-center font-semibold text-sm shrink-0">
              {partnerName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-zinc-900 dark:text-[#e0e0e0] leading-normal">{partnerName}'s latest session</h4>
                <span className="text-xs text-emerald-600 dark:text-emerald-400">{partnerStreak}d streak</span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                {partnerLatestSession
                  ? `Completed ${partnerLatestSession.routineName} • ${partnerLatestSession.exercises.length} exercises • ${partnerSessionMinutes} min`
                  : `${partnerName} hasn't logged a session yet.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onFistBump}
            disabled={!partnerLatestSession}
            className={`self-start sm:self-auto px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              hasReacted
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-[#1c1c20] dark:hover:bg-[#232327] dark:text-zinc-300'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" weight="fill" />
            <span className="tabular-nums">{reactionCount}</span>
          </button>
        </div>
      </div>

      {/* 4. Recent Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs px-0.5">
          <span className="text-zinc-500 dark:text-zinc-400">Recent sessions</span>
          <button
            type="button"
            onClick={onGoToHistory}
            className="transition-colors text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white focus:outline-none focus:ring-0 select-none cursor-pointer"
          >
            View all →
          </button>
        </div>

        {recentSessions.length > 0 && (
          <div
            onClick={onGoToHistory}
            className="rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors bg-zinc-50 hover:bg-zinc-100 dark:bg-[#18181b] dark:hover:bg-[#1c1c20] text-zinc-900 dark:text-[#e0e0e0]"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium leading-normal">{recentSessions[0].routineName}</h4>
                {recentSessions[0].prCount && recentSessions[0].prCount > 0 ? (
                  <span className="text-xs text-amber-500 flex items-center gap-1">
                    <Crown className="w-3 h-3" weight="fill" />
                    <span>{recentSessions[0].prCount} PRs</span>
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2 leading-normal">
                <span>{recentSessions[0].date}</span>
                <span>•</span>
                <span>{recentSessions[0].completedSets || 0} sets finished</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-[#e0e0e0]">
                {(recentSessions[0].totalVolume || 0).toLocaleString()} kg
              </span>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">total volume</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
