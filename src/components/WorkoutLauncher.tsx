import type { Routine } from '../types';
import { Play, Dumbbell, Footprints, Plus, ArrowLeft } from 'lucide-react';

interface WorkoutLauncherProps {
  recommendedRoutine: Routine;
  cardioRoutine: Routine;
  routines: Routine[];
  onStartRoutine: (routine: Routine) => void;
  onStartCardio: () => void;
  onStartEmpty: () => void;
  onManageInLibrary: () => void;
  onBackToDashboard?: () => void;
}

export function WorkoutLauncher({
  recommendedRoutine,
  cardioRoutine,
  routines,
  onStartRoutine,
  onStartCardio,
  onStartEmpty,
  onManageInLibrary,
  onBackToDashboard,
}: WorkoutLauncherProps) {
  const recommendedExercisesSummary = recommendedRoutine.exercises.map((e) => e.name).join(', ');

  return (
    <div className="space-y-8 sm:space-y-10 select-none">
      <div className="flex items-center justify-between gap-4">
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-[#e0e0e0] leading-snug">
              Workout Session
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-normal">
              Launch your scheduled workout, cardio, or an open session
            </p>
          </div>
        </div>
      </div>

      {/* 1. Recommended For Today Card */}
      <div className="border rounded-3xl p-7 sm:p-9 md:p-10 space-y-6 sm:space-y-7 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#18181c] dark:border-[#28282e] dark:text-[#e0e0e0]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold border bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-[#222226] dark:text-zinc-300 dark:border-[#2f2f35]">
              RECOMMENDED FOR TODAY
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-[#e0e0e0] leading-snug">
              {recommendedRoutine.name}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-normal">
              {recommendedRoutine.exercises.length} Exercises: {recommendedExercisesSummary}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onStartRoutine(recommendedRoutine)}
            className="self-start sm:self-center px-8 py-3.5 sm:py-4 rounded-full text-sm font-bold flex items-center gap-2.5 transition-all border border-transparent active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-900 hover:bg-black text-white dark:bg-[#e0e0e0] dark:hover:bg-white dark:text-zinc-950"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start {recommendedRoutine.name}</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="border rounded-3xl p-6 sm:p-7 space-y-4 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600/90 dark:text-emerald-400/85 flex items-center justify-center border border-emerald-500/20">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-normal">Treadmill Incline Cardio</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-normal">
                {cardioRoutine.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartCardio}
            className="w-full py-3 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800 dark:bg-[#222226] dark:hover:bg-[#28282e] dark:border-[#2f2f35] dark:text-[#e0e0e0]"
          >
            Launch Cardio Session
          </button>
        </div>

        <div className="border rounded-3xl p-6 sm:p-7 space-y-4 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center border border-blue-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-normal">Empty Open Workout</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-normal">
                Blank template to log freeform sets
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onStartEmpty}
            className="w-full py-3 rounded-xl border text-xs font-bold transition-all focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-800 dark:bg-[#222226] dark:hover:bg-[#28282e] dark:border-[#2f2f35] dark:text-[#e0e0e0]"
          >
            Start Empty Workout
          </button>
        </div>
      </div>

      {/* 3. All Routines Quick Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <Dumbbell className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>CHOOSE FROM ALL ROUTINES</span>
          </span>
          <button
            type="button"
            onClick={onManageInLibrary}
            className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white font-normal transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
          >
            Manage in Library →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          {routines.map((routine) => (
            <button
              key={routine.id}
              type="button"
              onClick={() => onStartRoutine(routine)}
              className="text-left p-5 rounded-2xl border transition-all flex flex-col justify-between focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-50 border-zinc-200 hover:border-zinc-300 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:hover:border-[#383840]"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/90 dark:text-emerald-400/85">
                  {routine.targetCategory}
                </span>
                <h4 className="text-sm font-bold mt-1 text-zinc-900 dark:text-[#e0e0e0] leading-normal">
                  {routine.name}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed font-normal">
                  {routine.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-[#28282e] flex items-center justify-between text-xs font-normal">
                <span className="text-zinc-500 dark:text-zinc-400">{routine.exercises.length} exercises</span>
                <span className="text-emerald-600/90 dark:text-emerald-400/85 font-bold">Start →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
