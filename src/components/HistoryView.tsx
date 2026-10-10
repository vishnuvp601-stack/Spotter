import { useState } from 'react';
import type { User, WeightUnit, WorkoutSession } from '../types';
import { Calendar, ChevronDown, ChevronUp, Trash2, AlertTriangle, ArrowLeft, Crown } from 'lucide-react';
import { formatDatePretty } from '../utils/dateSchedule';

interface HistoryViewProps {
  sessions: WorkoutSession[];
  activeUser: User;
  unit: WeightUnit;
  onDeleteSession: (sessionId: string) => void;
  onBackToDashboard?: () => void;
}

export function HistoryView({ sessions, activeUser, unit, onDeleteSession, onBackToDashboard }: HistoryViewProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const userSessions = sessions
    .filter((s) => s.userId === activeUser)
    .sort((a, b) => (b.startTime || 0) - (a.startTime || 0));

  return (
    <div className="space-y-8 sm:space-y-10 select-none">
      <div className="flex items-center justify-between gap-4">
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
              Workout History
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 font-normal leading-normal">
              Logs for{' '}
              <strong className="text-zinc-900 dark:text-[#e0e0e0] font-bold">
                {activeUser === 'vishnu' ? 'Vishnu' : 'Amy'}
              </strong>{' '}
              ({userSessions.length} total sessions)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {userSessions.length === 0 ? (
          <div className="border rounded-3xl p-10 text-center space-y-2 bg-white border-zinc-200 text-zinc-600 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-zinc-400">
            <p className="text-sm font-bold">No logged workouts yet for {activeUser === 'vishnu' ? 'Vishnu' : 'Amy'}.</p>
            <p className="text-xs text-zinc-500 font-normal leading-normal">
              Tap Launch on the dashboard to complete your first session!
            </p>
          </div>
        ) : (
          userSessions.map((session) => {
            const isExpanded = expandedSessionId === session.id;

            const sessionVolume = session.exercises.reduce((acc, ex) => {
              return acc + ex.sets.filter((s) => s.completed).reduce((sAcc, s) => sAcc + s.weight * s.reps, 0);
            }, 0);

            const completedSetsCount = session.exercises.reduce(
              (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
              0
            );

            return (
              <div
                key={session.id}
                className="border rounded-3xl p-6 sm:p-7 transition-colors bg-white border-zinc-200 text-zinc-900 dark:bg-[#1a1a1e] dark:border-[#28282e] dark:text-[#e0e0e0]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base sm:text-lg font-bold leading-normal">{session.routineName}</h3>
                      {session.prCount && session.prCount > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-500 text-[10px] font-bold flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          <span>
                            {session.prCount} PR{session.prCount > 1 ? 's' : ''}
                          </span>
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-normal leading-normal">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{formatDatePretty(session.date)}</span>
                      </span>
                      <span>·</span>
                      <span className="tabular-nums font-semibold text-zinc-700 dark:text-zinc-300">
                        {completedSetsCount} sets
                      </span>
                      <span>·</span>
                      <span className="tabular-nums font-semibold text-zinc-700 dark:text-zinc-300">
                        {sessionVolume.toLocaleString()} {unit}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                      className="px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer border-zinc-300 bg-zinc-100 text-zinc-700 hover:text-zinc-950 dark:border-[#2f2f35] dark:bg-[#202025] dark:text-zinc-300 dark:hover:text-white"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Sets'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setSessionToDelete(session.id)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-5 pt-4 border-t border-zinc-200 dark:border-[#28282e] space-y-4">
                    {session.notes && (
                      <div className="p-3.5 rounded-2xl text-xs bg-zinc-100/80 text-zinc-700 dark:bg-[#151518] dark:text-zinc-300 leading-relaxed font-normal">
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">Notes: </span>
                        {session.notes}
                      </div>
                    )}

                    <div className="space-y-3">
                      {session.exercises.map((ex, exIdx) => (
                        <div key={ex.exerciseId || exIdx} className="p-4 rounded-2xl bg-zinc-100/70 dark:bg-[#151518] space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-zinc-900 dark:text-[#e0e0e0] leading-normal">{ex.exerciseName}</span>
                            <span className="text-zinc-500 dark:text-zinc-400 font-normal leading-normal">{ex.targetMuscle}</span>
                          </div>

                          <div className="flex flex-wrap gap-2 pt-1">
                            {ex.sets.map((set) => (
                              <div
                                key={set.setNumber}
                                className={`px-3 py-1.5 rounded-xl text-xs font-normal tabular-nums ${
                                  set.completed
                                    ? set.isPR
                                      ? 'bg-amber-500/15 text-amber-500 font-semibold'
                                      : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400/90 font-medium'
                                    : 'opacity-40 bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                                }`}
                              >
                                <span>
                                  Set {set.setNumber}: {set.weight} {unit} × {set.reps}
                                </span>
                                {set.isPR && <Crown className="w-3 h-3 inline ml-1 text-amber-500" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {sessionToDelete && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSessionToDelete(null);
          }}
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="border rounded-3xl max-w-sm w-full p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150 relative bg-white border-zinc-200 text-zinc-900 dark:bg-[#18181c] dark:border-[#28282e] dark:text-[#e0e0e0]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold leading-normal">Delete Session?</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">This log entry will be permanently removed.</p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Are you sure you want to delete this workout from your permanent training history?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteSession(sessionToDelete);
                  setSessionToDelete(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
