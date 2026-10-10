import { useState } from 'react';
import { Barbell, Sun, Moon, GearSix, ShieldCheck, Flame, WarningCircle, X } from '@phosphor-icons/react';
import type { User } from '../types';

interface HeaderProps {
  activeUser: User;
  onSelectUser: (user: User) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  userStreak: number;
  isWorkoutActive: boolean;
  onDiscardWorkoutAndSwitch: (targetUser: User) => void;
  onLogoClick?: () => void;
}

export function Header({
  activeUser,
  onSelectUser,
  theme,
  onToggleTheme,
  onOpenSettings,
  userStreak,
  isWorkoutActive,
  onDiscardWorkoutAndSwitch,
  onLogoClick,
}: HeaderProps) {
  const [pendingSwitchUser, setPendingSwitchUser] = useState<User | null>(null);

  const handleUserClick = (targetUser: User) => {
    if (targetUser === activeUser) return;

    if (isWorkoutActive) {
      setPendingSwitchUser(targetUser);
    } else {
      onSelectUser(targetUser);
    }
  };

  const isDark = theme === 'dark';

  return (
    <>
      <header className="sticky top-0 z-30 border-b backdrop-blur-md transition-colors select-none bg-[#f1f1f3]/95 border-zinc-200 text-zinc-900 dark:bg-[#161619]/95 dark:border-[#28282e] dark:text-[#e0e0e0] pt-[env(safe-area-inset-top)]">
        <div className="max-w-6xl w-full mx-auto px-3 sm:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo: Dumbbell icon inside rounded square badge + SPOTTER */}
          <button
            type="button"
            onClick={onLogoClick}
            className="flex items-center gap-2.5 shrink-0 text-left focus:outline-none focus:ring-0 select-none cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors bg-zinc-100 border-zinc-300 text-emerald-600/90 group-hover:border-emerald-600/80 dark:bg-[#202024] dark:border-[#2f2f35] dark:text-emerald-400/90 dark:group-hover:border-emerald-400/60">
              <Barbell className="w-5 h-5" weight="fill" />
            </div>
            <span className="text-lg sm:text-xl font-black tracking-wide sm:tracking-wider uppercase font-sans">SPOTTER</span>
          </button>

          {/* User Switcher Pill (circular avatars 'V' & 'A') + Standard Sun/Moon Theme Toggle + Settings Gear */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Switcher Pill */}
            <div className="border rounded-xl p-1 flex items-center gap-1 transition-colors bg-zinc-200/60 border-zinc-300/80 dark:bg-[#1a1a1e] dark:border-[#28282e]">
              {/* Vishnu Tab */}
              <button
                type="button"
                onClick={() => handleUserClick('vishnu')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer ${
                  activeUser === 'vishnu'
                    ? 'bg-zinc-900 text-zinc-100 border-zinc-700/50 dark:bg-[#28282e] dark:text-[#e0e0e0] dark:border-[#3a3a42]'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/80 dark:text-zinc-400 dark:hover:text-[#e0e0e0] dark:hover:bg-zinc-800/60'
                }`}
                title="Switch to Vishnu"
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                    activeUser === 'vishnu'
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-[#1a1a1e] dark:text-[#e0e0e0]'
                      : 'bg-zinc-300/70 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  V
                </span>
                <span className="hidden min-[480px]:inline">Vishnu</span>
                {activeUser === 'vishnu' && (
                  <span className="hidden min-[480px]:flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/90" weight="fill" />
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Flame className="w-3.5 h-3.5" weight="fill" />
                      <span className="tabular-nums">{userStreak}</span>
                    </span>
                  </span>
                )}
              </button>

              {/* Amy Tab */}
              <button
                type="button"
                onClick={() => handleUserClick('amy')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer ${
                  activeUser === 'amy'
                    ? 'bg-zinc-900 text-zinc-100 border-zinc-700/50 dark:bg-[#28282e] dark:text-[#e0e0e0] dark:border-[#3a3a42]'
                    : 'border-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/80 dark:text-zinc-400 dark:hover:text-[#e0e0e0] dark:hover:bg-zinc-800/60'
                }`}
                title="Switch to Amy"
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                    activeUser === 'amy'
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-[#1a1a1e] dark:text-[#e0e0e0]'
                      : 'bg-zinc-300/70 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  A
                </span>
                <span className="hidden min-[480px]:inline">Amy</span>
                {activeUser === 'amy' && (
                  <span className="hidden min-[480px]:flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/90" weight="fill" />
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <Flame className="w-3.5 h-3.5" weight="fill" />
                      <span className="tabular-nums">{userStreak}</span>
                    </span>
                  </span>
                )}
              </button>
            </div>

            {/* Standard Sun / Moon Theme Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200/90 border-zinc-300 text-zinc-700 hover:text-zinc-950 dark:bg-[#1a1a1e] dark:hover:bg-[#222226] dark:border-[#28282e] dark:text-[#e0e0e0]"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4" weight="fill" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" weight="fill" />
              )}
            </button>

            {/* Settings Gear Icon */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200/90 border-zinc-300 text-zinc-700 hover:text-zinc-950 dark:bg-[#1a1a1e] dark:hover:bg-[#222226] dark:border-[#28282e] dark:text-[#e0e0e0]"
              title="Settings & Preferences"
              aria-label="Settings"
            >
              <GearSix className="w-4 h-4" weight="fill" />
            </button>
          </div>
        </div>
      </header>

      {/* Validation Dialog when switching athlete during an active session */}
      {pendingSwitchUser && (
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-scrollbar">
          <div className="border rounded-2xl max-w-sm w-full p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150 relative bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#2f2f35] dark:text-[#e0e0e0]">
            <button
              type="button"
              onClick={() => setPendingSwitchUser(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-[#e0e0e0] dark:hover:bg-zinc-800"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" weight="bold" />
            </button>

            <div className="flex items-center gap-3 pr-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                <WarningCircle className="w-5 h-5" weight="fill" />
              </div>
              <div>
                <h3 className="text-base font-bold leading-normal">Active Workout Running</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                  {activeUser === 'vishnu' ? 'Vishnu' : 'Amy'} is currently logging a workout.
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Switching athletes will discard the current workout session. Do you want to discard and switch to{' '}
              <strong className="text-zinc-900 dark:text-[#e0e0e0] font-bold">
                {pendingSwitchUser === 'vishnu' ? 'Vishnu' : 'Amy'}
              </strong>
              ?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPendingSwitchUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                Keep Workout
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = pendingSwitchUser;
                  setPendingSwitchUser(null);
                  onDiscardWorkoutAndSwitch(target);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
              >
                Discard & Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
