import type { Routine } from '../types';
import { Dumbbell } from 'lucide-react';

interface RoutinePreviewListProps {
  routine: Routine;
}

export function RoutinePreviewList({ routine }: RoutinePreviewListProps) {
  const count = routine.exercises.length;

  return (
    <div className="w-full space-y-4 select-none">
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <Dumbbell className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>
            WORKOUTS IN {routine.name.toUpperCase()} ({count})
          </span>
        </span>
        <span className="text-zinc-500 dark:text-zinc-400 font-normal">{count} Exercises Scheduled</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {routine.exercises.map((exercise, index) => {
          let targetStr = `${exercise.defaultSets}×${exercise.defaultReps}`;
          if (exercise.id === 'treadmill-incline' || exercise.name.toLowerCase().includes('treadmill')) {
            targetStr = '12% Inc • 3.5k';
          }

          return (
            <div
              key={exercise.id || index}
              className="rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 transition-colors bg-zinc-100/80 hover:bg-zinc-200/50 dark:bg-[#1a1a1e] dark:hover:bg-[#222226]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 tabular-nums bg-zinc-200 text-zinc-700 dark:bg-[#28282e] dark:text-[#e0e0e0]">
                  {index + 1}
                </span>

                <h4 className="text-sm font-bold truncate text-zinc-900 dark:text-[#e0e0e0] leading-normal">
                  {exercise.name}
                </h4>
              </div>

              <span className="text-xs sm:text-sm font-normal tabular-nums shrink-0 text-zinc-600 dark:text-[#9e9ea6] leading-normal">
                {targetStr}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
