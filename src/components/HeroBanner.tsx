import type { User, Routine, WorkoutSession } from '../types';
import { Play, ArrowRight, Calendar, Shield } from 'lucide-react';
import { getTodayRoutineInfo } from '../utils/dateSchedule';

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
    const diffMs = Date.now() - sessionTime;
    const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));

    let timeAgoStr = `${diffHours}h ago`;
    if (diffHours >= 24) {
      const days = Math.floor(diffHours / 24);
      timeAgoStr = days === 1 ? 'yesterday' : `${days}d ago`;
    }

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
    <div className="w-full border rounded-3xl p-8 sm:p-10 md:p-12 space-y-7 sm:space-y-8 transition-colors select-none bg-white border-zinc-200 text-zinc-900 dark:bg-[#18181c] dark:border-[#28282e] dark:text-[#e0e0e0]">
      {/* Tags: PPLPP SCHEDULE and ADMIN */}
      <div className="flex items-center gap-2.5">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-[#222226] dark:border-[#2f2f35] dark:text-zinc-300">
          <Calendar className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <span>PPLPP SCHEDULE</span>
        </span>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase border bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-[#222226] dark:border-[#2f2f35] dark:text-zinc-300">
          <Shield className="w-3 h-3 text-emerald-500/90 dark:text-emerald-400/85" />
          <span>ADMIN</span>
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-snug">
            {heroHeading}
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-[#a8a8b2] font-normal leading-relaxed">
            {getLastSessionMarkup()}
          </p>
        </div>

        <div className="shrink-0 self-start sm:self-center">
          <button
            type="button"
            onClick={onLaunchWorkout}
            className="inline-flex items-center justify-center gap-2.5 font-bold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base transition-all transform active:scale-95 border border-transparent focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-900 text-zinc-100 hover:bg-black dark:bg-[#e0e0e0] dark:text-zinc-950 dark:hover:bg-white"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch {routine.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
