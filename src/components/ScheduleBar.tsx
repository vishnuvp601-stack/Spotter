import { getCurrentDayIndex, getScheduleWithStatus } from '../utils/dateSchedule';
import type { WorkoutSession, User } from '../types';
import { Calendar, Check, Minus } from 'lucide-react';

interface ScheduleBarProps {
  selectedRoutineId: string;
  onSelectRoutineId: (routineId: string) => void;
  sessions: WorkoutSession[];
  activeUser: User;
}

export function ScheduleBar({ selectedRoutineId, onSelectRoutineId, sessions, activeUser }: ScheduleBarProps) {
  const currentDayIndex = getCurrentDayIndex(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const scheduleWithStatus = getScheduleWithStatus(sessions, activeUser);

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-2 select-none">
          <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>5-DAY SPLIT SCHEDULE</span>
        </span>
        <span className="text-zinc-500 dark:text-zinc-400 font-normal select-none text-[11px] sm:text-xs">
          {currentDayIndex === 0 || currentDayIndex === 6
            ? 'Weekend Rest • Mon–Fri Cycle'
            : 'Mon–Fri Cycle • Sat/Sun Rest'}
        </span>
      </div>

      <div className="overflow-x-auto no-scrollbar -mx-1 px-1 sm:mx-0 sm:px-0 pb-1">
        <div className="grid grid-cols-5 gap-2.5 sm:gap-3.5 min-w-[500px] sm:min-w-0">
          {scheduleWithStatus.map((item) => {
            const isSelected = selectedRoutineId === item.routineId;

            return (
              <button
                key={item.dayNumber}
                type="button"
                onClick={() => onSelectRoutineId(item.routineId)}
                className={`text-left p-3 sm:p-4 rounded-2xl border transition-all flex flex-col justify-between min-h-[96px] sm:min-h-[115px] focus:outline-none focus:ring-0 select-none cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-200/90 border-emerald-600/70 dark:bg-[#222227] dark:border-emerald-500/60'
                    : 'bg-zinc-100 border-zinc-200 hover:border-zinc-300 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:hover:border-[#383840]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] sm:text-xs font-bold tracking-wider ${
                      item.status === 'today'
                        ? 'text-emerald-600/90 dark:text-emerald-400/90'
                        : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {item.shortLabel}
                  </span>

                  {item.status === 'today' ? (
                    <span className="font-bold px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] leading-tight bg-zinc-900 text-zinc-100 dark:bg-[#28282e] dark:text-[#e0e0e0] border border-zinc-700/60">
                      Today
                    </span>
                  ) : item.status === 'done' ? (
                    <span className="text-emerald-700 dark:text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                      <span>Done</span>
                    </span>
                  ) : item.status === 'skipped' ? (
                    <span className="text-zinc-500 dark:text-zinc-400 bg-zinc-200/80 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700/60 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium flex items-center gap-0.5">
                      <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[2.5]" />
                      <span>Skipped</span>
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 space-y-0.5 min-w-0">
                  <p className="text-xs sm:text-sm font-bold leading-normal truncate text-zinc-900 dark:text-[#e0e0e0]">
                    {item.routineName}
                  </p>
                  <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-normal truncate leading-normal">
                    {item.focus}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
