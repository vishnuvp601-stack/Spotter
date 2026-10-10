import type { Routine } from '../types';
import { Barbell } from '@phosphor-icons/react';

interface RoutinePreviewListProps {
  routine: Routine;
}

export function RoutinePreviewList({ routine }: RoutinePreviewListProps) {
  const count = routine.exercises.length;

  return (
    <div className="w-full space-y-3.5 select-none">
      <div className="flex items-center justify-between text-xs px-0.5">
        <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
          <Barbell className="w-3.5 h-3.5" weight="fill" />
          <span>
            {routine.name} · {count} exercises
          </span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {routine.exercises.map((exercise, index) => {
          const targetStr =
            exercise.exerciseType === 'cardio'
              ? `${exercise.defaultIncline ?? 0}% Inc • ${exercise.defaultSpeed ?? 0} km/h`
              : `${exercise.defaultSets}×${exercise.defaultReps}`;

          return (
            <div
              key={exercise.id || index}
              className="py-3 border-b flex items-center justify-between gap-4 border-zinc-100 dark:border-[#232327]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs font-medium tabular-nums text-zinc-400 dark:text-zinc-600 w-4 shrink-0">
                  {index + 1}
                </span>

                <h4 className="text-sm font-medium truncate text-zinc-900 dark:text-[#e0e0e0] leading-normal">
                  {exercise.name}
                </h4>
              </div>

              <span className="text-xs tabular-nums shrink-0 text-zinc-500 dark:text-zinc-400 leading-normal">
                {targetStr}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
