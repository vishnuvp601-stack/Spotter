import type { User, Routine, WorkoutSession } from '../types';
import { Play, Plus, Dumbbell, BarChart2, Flame, Trophy, Calendar, Footprints, ThumbsUp, Crown } from 'lucide-react';

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
    <div className="space-y-8 sm:space-y-10 pt-4 select-none">
      {/* 1. Three Stat Cards in a Row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Streak */}
        <div className="border rounded-3xl p-5 sm:p-7 transition-colors bg-zinc-100 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>STREAK</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums">{streak}</span>
            <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">days</span>
          </div>
        </div>

        {/* This Week */}
        <div className="border rounded-3xl p-5 sm:p-7 transition-colors bg-zinc-100 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>THIS WEEK</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tabular-nums">{weeklyDays}</span>
            <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">/ 5 days</span>
          </div>
        </div>

        {/* PRs Hit */}
        <div className="border rounded-3xl p-5 sm:p-7 transition-colors bg-zinc-100 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>PRS HIT</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-500 tabular-nums">{totalPRs}</span>
            <span className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-normal">records</span>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">QUICK ACTIONS</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal">One-tap triggers</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => onLaunchRoutine(currentRoutine)}
            className="border rounded-2xl p-4 sm:p-5 text-left transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[125px] focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 border-zinc-200 hover:border-zinc-300 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:hover:border-[#383840]"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-zinc-200 text-emerald-600/90 dark:bg-[#28282e] dark:text-emerald-400/85">
              <Play className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <p className="text-sm font-bold leading-normal text-zinc-900 dark:text-[#e0e0e0]">Start PPL Routine</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate leading-normal font-normal">
                {currentRoutine.name} next
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={onStartCardio}
            className="border rounded-2xl p-4 sm:p-5 text-left transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[125px] focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 border-zinc-200 hover:border-zinc-300 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:hover:border-[#383840]"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-zinc-200 text-zinc-700 dark:bg-[#28282e] dark:text-zinc-300">
              <Footprints className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-normal text-zinc-900 dark:text-[#e0e0e0]">Incline Cardio</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-normal">12% Inc • 3.5k</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onStartEmpty}
            className="border rounded-2xl p-4 sm:p-5 text-left transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[125px] focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 border-zinc-200 hover:border-zinc-300 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:hover:border-[#383840]"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-zinc-200 text-zinc-700 dark:bg-[#28282e] dark:text-zinc-300">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-normal text-zinc-900 dark:text-[#e0e0e0]">Empty Log</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-normal">Freeform session</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onGoToRoutines}
            className="border rounded-2xl p-4 sm:p-5 text-left transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[125px] focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 border-zinc-200 hover:border-zinc-300 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:hover:border-[#383840]"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-zinc-200 text-zinc-700 dark:bg-[#28282e] dark:text-zinc-300">
              <Dumbbell className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-normal text-zinc-900 dark:text-[#e0e0e0]">Routines</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-normal">5-Day PPL split</p>
            </div>
          </button>

          <button
            type="button"
            onClick={onGoToAnalytics}
            className="border rounded-2xl p-4 sm:p-5 text-left transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[125px] focus:outline-none focus:ring-0 select-none cursor-pointer col-span-2 sm:col-span-1 bg-zinc-100 border-zinc-200 hover:border-zinc-300 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:hover:border-[#383840]"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2 bg-zinc-200 text-zinc-700 dark:bg-[#28282e] dark:text-zinc-300">
              <BarChart2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-normal text-zinc-900 dark:text-[#e0e0e0]">Analytics</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-normal">Track PR curves</p>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Partner Activity Feed */}
      <div className="border rounded-3xl p-6 sm:p-8 transition-colors bg-zinc-100 border-zinc-200 dark:bg-[#1a1a1e] dark:border-[#28282e]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-emerald-500/10 text-emerald-600/90 dark:text-emerald-400/85 flex items-center justify-center font-black text-sm shrink-0 border border-emerald-500/20">
              {partnerName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-[#e0e0e0] leading-normal">{partnerName}'s Latest Session</h4>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600/90 dark:text-emerald-400/85 border border-emerald-500/25">
                  {partnerStreak}d Streak
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-relaxed">
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
            className={`self-start sm:self-auto px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 transition-all focus:outline-none focus:ring-0 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              hasReacted
                ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-600/90 dark:text-emerald-400/85'
                : 'bg-white hover:bg-zinc-50 border-zinc-300 text-zinc-800 dark:bg-[#242429] dark:hover:bg-[#2c2c32] dark:border-[#34343c] dark:text-[#e0e0e0]'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="tabular-nums">{reactionCount}</span>
          </button>
        </div>
      </div>

      {/* 4. Recent Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400">RECENT SESSIONS</span>
          <button
            type="button"
            onClick={onGoToHistory}
            className="font-normal transition-colors text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white focus:outline-none focus:ring-0 select-none cursor-pointer"
          >
            View all history →
          </button>
        </div>

        {recentSessions.length > 0 && (
          <div
            onClick={onGoToHistory}
            className="border rounded-3xl p-5 sm:p-7 flex items-center justify-between cursor-pointer transition-colors bg-zinc-100 hover:border-zinc-300 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:hover:border-[#383840] dark:border-[#28282e] dark:text-[#e0e0e0]"
          >
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold leading-normal">{recentSessions[0].routineName}</h4>
                {recentSessions[0].prCount && recentSessions[0].prCount > 0 ? (
                  <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    <span>{recentSessions[0].prCount} PRS</span>
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-2 font-normal leading-normal">
                <Calendar className="w-3 h-3" />
                <span>{recentSessions[0].date}</span>
                <span>•</span>
                <span>{recentSessions[0].completedSets || 0} sets finished</span>
              </p>
            </div>

            <div className="text-right">
              <span className="text-base sm:text-lg font-extrabold tabular-nums text-emerald-600/90 dark:text-emerald-400/85">
                {(recentSessions[0].totalVolume || 0).toLocaleString()} kg
              </span>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-normal leading-normal">total volume</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
