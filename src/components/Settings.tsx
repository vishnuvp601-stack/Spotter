import { useState } from 'react';
import { Settings as SettingsIcon, X, LogOut } from 'lucide-react';
import type { WeightUnit } from '../types';

interface SettingsProps {
  unit: WeightUnit;
  onUnitChange: (unit: WeightUnit) => void;
  onSignOut: () => void;
  onClose: () => void;
}

export function Settings({ unit, onUnitChange, onSignOut, onClose }: SettingsProps) {
  const [confirmingSignOut, setConfirmingSignOut] = useState(false);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-scrollbar"
    >
      <div className="border rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-7 relative select-none animate-in fade-in zoom-in-95 duration-150 bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#18181c] dark:border-[#28282e] dark:text-[#e0e0e0]">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-[#28282e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border flex items-center justify-center bg-zinc-100 border-zinc-300 text-emerald-600/90 dark:bg-[#222226] dark:border-[#28282e] dark:text-emerald-400/85">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold leading-normal">Settings</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal leading-normal">
                Manage units &amp; this device's session
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-600 hover:text-zinc-950 dark:bg-[#222226] dark:hover:bg-[#2c2c32] dark:border-[#28282e] dark:text-zinc-400 dark:hover:text-white"
            title="Close Settings"
            aria-label="Close Settings"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Weight Units Toggle */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Weight Units
          </label>
          <div className="grid grid-cols-2 p-1 rounded-xl border bg-zinc-100 border-zinc-300 dark:bg-[#121214] dark:border-[#28282e]">
            <button
              type="button"
              onClick={() => onUnitChange('kg')}
              className={`py-2.5 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer ${
                unit === 'kg'
                  ? 'bg-zinc-900 text-white dark:bg-[#2b2b30] dark:text-[#e0e0e0] border-transparent dark:border-[#383840]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              Kilograms (kg)
            </button>
            <button
              type="button"
              onClick={() => onUnitChange('lbs')}
              className={`py-2.5 rounded-lg text-xs font-bold border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer ${
                unit === 'lbs'
                  ? 'bg-zinc-900 text-white dark:bg-[#2b2b30] dark:text-[#e0e0e0] border-transparent dark:border-[#383840]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              Pounds (lbs)
            </button>
          </div>
        </div>

        {/* Sign out */}
        <div className="pt-2 border-t border-zinc-200 dark:border-[#28282e] space-y-3">
          {!confirmingSignOut ? (
            <button
              type="button"
              onClick={() => setConfirmingSignOut(true)}
              className="w-full py-2.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer border-zinc-300 text-zinc-600 hover:bg-zinc-100 dark:border-[#2f2f35] dark:text-zinc-400 dark:hover:bg-[#202025]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5">
              <p className="flex-1 text-xs text-zinc-500 dark:text-zinc-400">Sign out of Spotter?</p>
              <button
                type="button"
                onClick={() => setConfirmingSignOut(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700 dark:bg-[#202025] dark:hover:bg-[#28282e] dark:border-[#2f2f35] dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onSignOut}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
