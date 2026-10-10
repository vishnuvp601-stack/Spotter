import { useState } from 'react';
import type { ExerciseTemplate, Routine, User } from '../types';
import { Plus, Play, Dumbbell, ArrowLeft, Star, Pencil, Trash2, AlertTriangle, X } from 'lucide-react';
import { RoutineBuilder } from './RoutineBuilder';

interface RoutinesViewProps {
  routines: Routine[];
  exerciseLibrary?: ExerciseTemplate[];
  onSelectRoutineToStart: (routine: Routine) => void;
  onSaveCustomRoutine: (routine: Routine) => void;
  onDeleteCustomRoutine: (routineId: string) => void;
  activeUser: User;
  onBackToDashboard?: () => void;
  theme?: 'dark' | 'light';
}

export function RoutinesView({
  routines,
  exerciseLibrary,
  onSelectRoutineToStart,
  onSaveCustomRoutine,
  onDeleteCustomRoutine,
  activeUser,
  onBackToDashboard,
  theme,
}: RoutinesViewProps) {
  const [isBuilding, setIsBuilding] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [deletingRoutine, setDeletingRoutine] = useState<Routine | null>(null);
  const [expandedRoutineMap, setExpandedRoutineMap] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedRoutineMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isBuilding || editingRoutine) {
    return (
      <RoutineBuilder
        initialRoutine={editingRoutine ?? undefined}
        exerciseLibrary={exerciseLibrary}
        onSave={(newRoutine) => {
          onSaveCustomRoutine(newRoutine);
          setIsBuilding(false);
          setEditingRoutine(null);
        }}
        onCancel={() => {
          setIsBuilding(false);
          setEditingRoutine(null);
        }}
        theme={theme}
      />
    );
  }

  const defaultTemplates = routines.filter((r) => !r.isCustom);
  const customRoutines = routines.filter((r) => r.isCustom);

  return (
    <div className="space-y-8 sm:space-y-10 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer shrink-0 bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-950 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-zinc-300 dark:hover:text-white"
              title="Back to Dashboard"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-[#e0e0e0] leading-snug">
              Routine Library
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-normal">
              Workouts for {activeUser === 'vishnu' ? 'Vishnu' : 'Amy'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsBuilding(true)}
            className="px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-900 hover:bg-black text-white dark:bg-[#e0e0e0] dark:hover:bg-white dark:text-zinc-950"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Routine</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <Dumbbell className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>PPLPP SCHEDULE TEMPLATES (5-DAY CYCLE)</span>
          </span>
          <span className="text-zinc-500 dark:text-zinc-400 font-normal">Standard split</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {defaultTemplates.map((routine) => {
            const isExpanded = !!expandedRoutineMap[routine.id];

            return (
              <div
                key={routine.id}
                className="border rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/90 dark:text-emerald-400/85">
                        {routine.targetCategory}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold mt-1 leading-normal">{routine.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed font-normal">
                        {routine.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingRoutine(routine)}
                        className="p-3 rounded-2xl border flex items-center justify-center transition-all active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-600 dark:bg-[#222227] dark:hover:bg-[#28282e] dark:border-[#2f2f35] dark:text-zinc-300"
                        title={`Edit ${routine.name}`}
                        aria-label={`Edit ${routine.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectRoutineToStart(routine)}
                        className="p-3 rounded-2xl border flex items-center justify-center transition-all active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-emerald-600/90 dark:bg-[#222227] dark:hover:bg-[#28282e] dark:border-[#2f2f35] dark:text-emerald-400/85"
                        title={`Launch ${routine.name}`}
                      >
                        <Play className="w-4 h-4 fill-current" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-[#28282e] flex items-center justify-between text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400 font-normal tabular-nums">
                      {routine.exercises.length} exercises scheduled
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleExpand(routine.id)}
                      className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white font-bold transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
                    >
                      {isExpanded ? 'Hide exercises' : 'Show exercises'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-zinc-100 dark:border-[#28282e]">
                      {routine.exercises.map((ex, i) => (
                        <div
                          key={ex.id || i}
                          className="p-3 rounded-2xl text-xs flex items-center justify-between bg-zinc-100/80 text-zinc-800 dark:bg-[#151518] dark:text-[#e0e0e0]"
                        >
                          <span className="font-bold truncate max-w-[200px] leading-normal">
                            {i + 1}. {ex.name}
                          </span>
                          <span className="text-zinc-500 dark:text-zinc-400 tabular-nums font-normal text-xs leading-normal">
                            {ex.exerciseType === 'cardio'
                              ? `${ex.defaultIncline ?? 0}% incline • ${ex.defaultSpeed ?? 0} km/h • ${ex.defaultDurationMinutes ?? 0} min`
                              : `${ex.defaultSets} × ${ex.defaultReps}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-200 dark:border-[#28282e] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onSelectRoutineToStart(routine)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-[#222227] dark:hover:bg-[#28282e] dark:text-[#e0e0e0]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Launch {routine.name}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {customRoutines.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>CUSTOM USER ROUTINES</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {customRoutines.map((routine) => (
              <div
                key={routine.id}
                className="border rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/90 dark:text-emerald-400/85">
                    {routine.targetCategory}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold mt-1 leading-normal">{routine.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed font-normal">
                    {routine.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-200 dark:border-[#28282e] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectRoutineToStart(routine)}
                    className="flex-1 min-w-0 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 text-zinc-900 dark:bg-[#222227] dark:hover:bg-[#28282e] dark:text-[#e0e0e0]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                    <span className="truncate">Launch {routine.name}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingRoutine(routine)}
                    className="w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700 dark:bg-[#222227] dark:hover:bg-[#28282e] dark:border-[#2f2f35] dark:text-zinc-300"
                    title={`Edit ${routine.name}`}
                    aria-label={`Edit ${routine.name}`}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingRoutine(routine)}
                    className="w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-red-50 hover:bg-red-100 border-red-200 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-950/50 dark:border-red-900/50 dark:text-red-400"
                    title={`Delete ${routine.name}`}
                    aria-label={`Delete ${routine.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {deletingRoutine && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeletingRoutine(null);
          }}
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-scrollbar animate-in fade-in duration-150"
        >
          <div className="border rounded-3xl max-w-sm w-full p-6 sm:p-7 space-y-5 relative select-none animate-in zoom-in-95 duration-150 bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#18181c] dark:border-[#28282e] dark:text-[#e0e0e0]">
            <button
              type="button"
              onClick={() => setDeletingRoutine(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-[#e0e0e0] dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pr-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-normal">Delete Routine?</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal truncate">
                  {deletingRoutine.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              This can't be undone. The routine and its exercise list will be permanently deleted.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingRoutine(null)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCustomRoutine(deletingRoutine.id);
                  setDeletingRoutine(null);
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
              >
                Delete Routine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
