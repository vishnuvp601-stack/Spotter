import { SquaresFour, PlusCircle, BookmarkSimple, ChartBar, ClockCounterClockwise } from '@phosphor-icons/react';

export type SubTab = 'dashboard' | 'workout' | 'routines' | 'analytics' | 'history';

interface SubNavTabsProps {
  activeTab: SubTab;
  onSelectTab: (tab: SubTab) => void;
}

export function SubNavTabs({ activeTab, onSelectTab }: SubNavTabsProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: SquaresFour },
    { id: 'workout', label: 'Workout', icon: PlusCircle },
    { id: 'routines', label: 'Routines', icon: BookmarkSimple },
    { id: 'analytics', label: 'Analytics', icon: ChartBar },
    { id: 'history', label: 'History', icon: ClockCounterClockwise },
  ] as const;

  return (
    <nav className="w-full flex items-center gap-1.5 sm:gap-2.5 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            aria-label={tab.label}
            title={tab.label}
            className={`flex-1 sm:flex-none min-w-0 px-2 sm:px-5 py-2.5 rounded-xl text-[9px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-0.5 sm:gap-2 border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer ${
              isActive
                ? 'bg-zinc-900 text-zinc-100 border-zinc-700/60 dark:bg-[#28282e] dark:text-[#e0e0e0] dark:border-[#3a3a42]'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-[#e0e0e0] dark:hover:bg-[#1a1a1e]'
            }`}
          >
            <Icon className="w-4 h-4 sm:w-3.5 sm:h-3.5 shrink-0" weight="fill" />
            <span className="truncate max-w-full leading-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
