import { getCurrentDayIndex, getScheduleWithStatus } from '../utils/dateSchedule';
import type { WorkoutSession, User } from '../types';
import { Calendar, Check, Minus } from '@phosphor-icons/react';

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
    <div className="w-full space-y-3.5">
      <div className="flex items-center justify-between text-xs px-0.5">
        <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 select-none">
          <Calendar className="w-3.5 h-3.5" weight="fill" />
          <span>5-day split</span>
        </span>
        <span className="text-zinc-500 dark:text-zinc-400 select-none">
          {currentDayIndex === 0 || currentDayIndex === 6
            ? 'Weekend rest · Mon–Fri cycle'
            : 'Mon–Fri cycle · Sat/Sun rest'}
        </span>
      </div>

      <div className="-mx-1 px-1 sm:mx-0 sm:px-0 pb-1">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {scheduleWithStatus.map((item) => {
            const isSelected = selectedRoutineId === item.routineId;

            return (
              <button
                key={item.dayNumber}
                type="button"
                onClick={() => onSelectRoutineId(item.routineId)}
                className={`text-left p-1.5 sm:p-3.5 rounded-lg border-t-2 transition-colors flex flex-col justify-between min-h-[76px] sm:min-h-[108px] focus:outline-none focus:ring-0 select-none cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 border-t-emerald-500 dark:bg-[#1c1c20] dark:border-t-emerald-500'
                    : 'bg-zinc-50 border-t-transparent hover:bg-zinc-100 dark:bg-[#18181b] dark:hover:bg-[#1c1c20]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-[10px] sm:text-xs font-semibold tracking-wide ${
                      item.status === 'today'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {item.shortLabel}
                  </span>

                  {item.status === 'today' ? (
                    <span className="font-semibold text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 sm:hidden" />
                      <span className="hidden sm:inline">Today</span>
                    </span>
                  ) : item.status === 'done' ? (
                    <span className="text-zinc-500 dark:text-zinc-400 text-[9px] sm:text-[10px] flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" weight="bold" />
                      <span className="hidden sm:inline">Done</span>
                    </span>
                  ) : item.status === 'skipped' ? (
                    <span className="text-zinc-400 dark:text-zinc-600 text-[9px] sm:text-[10px] flex items-center gap-0.5">
                      <Minus className="w-2.5 h-2.5" weight="bold" />
                      <span className="hidden sm:inline">Skipped</span>
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 space-y-0.5 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold leading-normal truncate text-zinc-900 dark:text-[#e0e0e0]">
                    {item.routineName}
                  </p>
                  <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 truncate leading-normal">
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
