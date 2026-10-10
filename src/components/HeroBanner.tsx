import type { User, Routine, WorkoutSession } from '../types';
import { Play, ArrowRight, Calendar, Shield } from '@phosphor-icons/react';
import { getTodayRoutineInfo, formatFriendlyTimeAgo } from '../utils/dateSchedule';

interface HeroBannerProps {
  user: User;
  routine: Routine;
  lastSession?: WorkoutSession;
  onLaunchWorkout: () => void;
  isSessionActive: boolean;
}

export function HeroBanner({ user, routine, lastSession, onLaunchWorkout }: HeroBannerProps) {
  const userName = user === 'vishnu' ? 'Vishnu' : 'Amy';
  const todayInfo = getTodayRoutineInfo();

  const getLastSessionMarkup = () => {
    if (!lastSession) {
      return <span>No sessions logged yet. Launch your first workout below!</span>;
    }

    const sessionTime = lastSession.startTime || new Date(lastSession.date).getTime();
    const timeAgoStr = formatFriendlyTimeAgo(sessionTime);

    return (
      <span>
        Last session was{' '}
        <strong className="font-semibold text-zinc-800 dark:text-zinc-200">{lastSession.routineName}</strong> (
        {timeAgoStr}).
      </span>
    );
  };

  const heroHeading = todayInfo.isWeekend
    ? `Hi ${userName}, today is your Rest Day!`
    : `Hi ${userName}, today is your day for ${routine.name}!`;

  return (
    <div className="w-full pb-7 sm:pb-8 border-b transition-colors select-none border-zinc-200 text-zinc-900 dark:border-[#28282e] dark:text-[#e0e0e0]">
      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 mb-5">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" weight="fill" />
          <span>PPLPP schedule</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Shield className="w-3 h-3 text-emerald-600/80 dark:text-emerald-400/80" weight="fill" />
          <span>Admin</span>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2.5 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
            {heroHeading}
          </h1>

          <p className="text-sm text-zinc-600 dark:text-[#a8a8b2] font-normal leading-relaxed">
            {getLastSessionMarkup()}
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={onLaunchWorkout}
            className="inline-flex items-center justify-center gap-2 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors active:scale-[0.98] focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-900 text-zinc-100 hover:bg-black dark:bg-[#e0e0e0] dark:text-zinc-950 dark:hover:bg-white"
          >
            <Play className="w-3.5 h-3.5" weight="fill" />
            <span>Launch {routine.name}</span>
            <ArrowRight className="w-3.5 h-3.5" weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
