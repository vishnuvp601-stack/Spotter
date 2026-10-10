import { LayoutDashboard, PlusCircle, Bookmark, BarChart2, History } from 'lucide-react';

export type SubTab = 'dashboard' | 'workout' | 'routines' | 'analytics' | 'history';

interface SubNavTabsProps {
  activeTab: SubTab;
  onSelectTab: (tab: SubTab) => void;
}

export function SubNavTabs({ activeTab, onSelectTab }: SubNavTabsProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workout', label: 'Workout', icon: PlusCircle },
    { id: 'routines', label: 'Routines', icon: Bookmark },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'history', label: 'History', icon: History },
  ] as const;

  return (
    <nav className="w-full flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar pb-1 select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shrink-0 transition-all focus:outline-none focus:ring-0 select-none cursor-pointer ${
              isActive
                ? 'bg-zinc-900 text-zinc-100 dark:bg-[#28282e] dark:text-[#e0e0e0] border border-zinc-700/60'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/70 dark:text-zinc-400 dark:hover:text-[#e0e0e0] dark:hover:bg-[#1a1a1e]'
            }`}
          >
            <Icon className="w-3.5 h-3.5 stroke-[2]" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
