import { useState, useEffect } from 'react';
import type { Routine, User, WeightUnit, LoggedExercise, LoggedSet, WorkoutSession } from '../types';
import { getSmartDefaults, checkIfPR, getHistoricalMax } from '../utils/workoutStats';
import { getLocalDateString } from '../utils/dateSchedule';
import { Check, Plus, Trash2, Trophy, Clock, CheckCircle2, History, ArrowLeft, AlertTriangle, X, Crown } from 'lucide-react';

interface ActiveLoggerProps {
  routine: Routine;
  activeUser: User;
  unit: WeightUnit;
  sessions: WorkoutSession[];
  onFinishWorkout: (session: WorkoutSession) => void;
  onTriggerRestTimer: () => void;
  onCancel: () => void;
}

export function ActiveLogger({
  routine,
  activeUser,
  unit,
  sessions,
  onFinishWorkout,
  onTriggerRestTimer,
  onCancel,
}: ActiveLoggerProps) {
  const [exercises, setExercises] = useState<LoggedExercise[]>([]);
  const [sessionNotes, setSessionNotes] = useState('');
  const [startTime] = useState<number>(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [showDiscardModal, setShowDiscardModal] = useState<boolean>(false);

  // Initialize exercises with Smart Defaults from user's previous session
  useEffect(() => {
    const initialized: LoggedExercise[] = routine.exercises.map((template) => {
      const smartDefault = getSmartDefaults(sessions, activeUser, template.id, template.defaultWeight, template.defaultReps);

      const sets: LoggedSet[] = Array.from({ length: template.defaultSets }, (_, idx) => ({
        setNumber: idx + 1,
        weight: smartDefault.weight,
        reps: smartDefault.reps,
        completed: false,
        previousWeight: smartDefault.isFromPreviousSession ? smartDefault.weight : undefined,
        previousReps: smartDefault.isFromPreviousSession ? smartDefault.reps : undefined,
      }));

      return {
        exerciseId: template.id,
        exerciseName: template.name,
        targetMuscle: template.targetMuscle,
        sets,
      };
    });

    setExercises(initialized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routine, activeUser]);

  // Elapsed workout timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const updateSetWeight = (exerciseIdx: number, setIdx: number, newWeight: number) => {
    const safeWeight = Math.max(0, parseFloat(newWeight.toFixed(1)));
    setExercises((prev) => {
      const copy = [...prev];
      const ex = { ...copy[exerciseIdx] };
      const sets = [...ex.sets];
      const currentSet = { ...sets[setIdx], weight: safeWeight };

      if (currentSet.completed) {
        currentSet.isPR = checkIfPR(sessions, activeUser, ex.exerciseId, currentSet.weight, currentSet.reps);
      }

      sets[setIdx] = currentSet;
      ex.sets = sets;
      copy[exerciseIdx] = ex;
      return copy;
    });
  };

  const updateSetReps = (exerciseIdx: number, setIdx: number, newReps: number) => {
    const safeReps = Math.max(0, Math.round(newReps));
    setExercises((prev) => {
      const copy = [...prev];
      const ex = { ...copy[exerciseIdx] };
      const sets = [...ex.sets];
      const currentSet = { ...sets[setIdx], reps: safeReps };

      if (currentSet.completed) {
        currentSet.isPR = checkIfPR(sessions, activeUser, ex.exerciseId, currentSet.weight, currentSet.reps);
      }

      sets[setIdx] = currentSet;
      ex.sets = sets;
      copy[exerciseIdx] = ex;
      return copy;
    });
  };

  const toggleSetComplete = (exerciseIdx: number, setIdx: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      const ex = { ...copy[exerciseIdx] };
      const sets = [...ex.sets];
      const targetSet = { ...sets[setIdx] };

      const nextCompleted = !targetSet.completed;
      targetSet.completed = nextCompleted;

      if (nextCompleted) {
        const isPrSet = checkIfPR(sessions, activeUser, ex.exerciseId, targetSet.weight, targetSet.reps);
        targetSet.isPR = isPrSet;
        onTriggerRestTimer();
      } else {
        targetSet.isPR = false;
      }

      sets[setIdx] = targetSet;
      ex.sets = sets;
      copy[exerciseIdx] = ex;
      return copy;
    });
  };

  const addSet = (exerciseIdx: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      const ex = { ...copy[exerciseIdx] };
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSet: LoggedSet = {
        setNumber: ex.sets.length + 1,
        weight: lastSet ? lastSet.weight : 20,
        reps: lastSet ? lastSet.reps : 10,
        completed: false,
      };
      ex.sets = [...ex.sets, newSet];
      copy[exerciseIdx] = ex;
      return copy;
    });
  };

  const removeSet = (exerciseIdx: number, setIdx: number) => {
    setExercises((prev) => {
      const copy = [...prev];
      const ex = { ...copy[exerciseIdx] };
      if (ex.sets.length <= 1) return prev;
      const filtered = ex.sets.filter((_, i) => i !== setIdx).map((s, idx) => ({ ...s, setNumber: idx + 1 }));
      ex.sets = filtered;
      copy[exerciseIdx] = ex;
      return copy;
    });
  };

  const totalCompletedSets = exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed).length, 0);

  const totalPlannedSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);

  const totalVolume = exercises.reduce((acc, ex) => {
    return acc + ex.sets.filter((s) => s.completed).reduce((sAcc, s) => sAcc + s.weight * s.reps, 0);
  }, 0);

  const prSetsCount = exercises.reduce((acc, ex) => acc + ex.sets.filter((s) => s.completed && s.isPR).length, 0);

  const formatElapsedTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const handleBackOrCancelClick = () => {
    if (totalCompletedSets === 0) {
      onCancel();
    } else {
      setShowDiscardModal(true);
    }
  };

  const handleFinish = () => {
    const finishedSession: WorkoutSession = {
      id: `session-${Date.now()}`,
      userId: activeUser,
      routineId: routine.id,
      routineName: routine.name,
      date: getLocalDateString(),
      startTime,
      endTime: Date.now(),
      exercises,
      notes: sessionNotes.trim(),
      totalVolume,
      completedSets: totalCompletedSets,
      prCount: prSetsCount,
    };
    onFinishWorkout(finishedSession);
  };

  return (
    <div className="space-y-8 pb-36 select-none">
      {/* Active Workout Header Bar */}
      <div className="border rounded-2xl p-4 sm:p-6 flex flex-wrap items-center justify-between gap-4 sticky top-[calc(4rem+env(safe-area-inset-top))] z-20 backdrop-blur-md transition-colors bg-zinc-50/95 border-zinc-200 text-zinc-900 dark:bg-[#161619]/95 dark:border-[#28282e] dark:text-[#e0e0e0]">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={handleBackOrCancelClick}
            className="w-9 h-9 rounded-xl border flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer shrink-0 bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 dark:bg-[#202025] dark:border-[#2c2c34] dark:text-zinc-200 dark:hover:text-white dark:hover:bg-zinc-800"
            title="Exit workout"
            aria-label="Exit workout"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse shrink-0" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight truncate leading-normal">{routine.name}</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-[#a0a0a8] mt-0.5 leading-normal">
              <span className="tabular-nums font-semibold">
                {totalCompletedSets}/{totalPlannedSets} sets
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 tabular-nums font-semibold">
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                {formatElapsedTime(elapsedSeconds)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {prSetsCount > 0 && (
            <div className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-500 text-xs font-bold flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5" />
              <span className="tabular-nums">
                {prSetsCount} PR{prSetsCount > 1 ? 's' : ''}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleBackOrCancelClick}
            className="px-4 py-2 rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer border-zinc-300 bg-zinc-100 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200 dark:border-[#2f2f35] dark:bg-[#202025] dark:text-[#e0e0e0] dark:hover:bg-[#28282e]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => setShowSummaryModal(true)}
            className="px-5 sm:px-6 py-2 rounded-full text-xs font-bold transition-all active:scale-95 border border-transparent focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-900 hover:bg-black text-zinc-100 dark:bg-[#e0e0e0] dark:hover:bg-white dark:text-zinc-950"
          >
            Finish Workout
          </button>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-6 sm:space-y-8">
        {exercises.map((exercise, exerciseIdx) => {
          const historical = getHistoricalMax(sessions, activeUser, exercise.exerciseId);

          return (
            <div
              key={exercise.exerciseId}
              className="border rounded-3xl p-6 sm:p-8 space-y-6 transition-colors bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#18181c] dark:border-[#28282e] dark:text-[#e0e0e0]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold leading-normal">{exercise.exerciseName}</h3>
                  <p className="text-xs text-zinc-500 dark:text-[#9e9ea6] font-normal mt-0.5 leading-normal">
                    {exercise.targetMuscle}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 self-start sm:self-auto">
                  {historical.maxWeight > 0 ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border font-normal bg-zinc-100 border-zinc-300 text-zinc-700 dark:bg-[#222226] dark:border-[#2c2c34] dark:text-zinc-300">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span className="tabular-nums">
                        Best: {historical.maxWeight} {unit} × {historical.maxRepsAtWeight}
                      </span>
                    </div>
                  ) : (
                    <span className="font-normal text-zinc-400">First session</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-3.5">
                <div className="grid grid-cols-12 gap-2 sm:gap-3 text-[10px] sm:text-xs uppercase tracking-wider text-zinc-400 px-2 font-semibold">
                  <div className="col-span-1 text-center">Set</div>
                  <div className="col-span-5 text-center">Weight ({unit})</div>
                  <div className="col-span-4 text-center">Reps</div>
                  <div className="col-span-2 text-center">Done</div>
                </div>

                {exercise.sets.map((set, setIdx) => {
                  return (
                    <div
                      key={set.setNumber}
                      className={`grid grid-cols-12 gap-2 sm:gap-3 items-center p-3 rounded-2xl transition-colors ${
                        set.completed ? 'bg-emerald-500/10 dark:bg-emerald-950/25' : 'bg-zinc-100/80 dark:bg-[#141417]'
                      }`}
                    >
                      <div className="col-span-1 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold tabular-nums text-zinc-500 dark:text-zinc-400">
                          {set.setNumber}
                        </span>
                        {set.isPR && (
                          <span className="text-[10px] font-bold text-amber-500 leading-tight flex items-center gap-0.5">
                            <Crown className="w-2.5 h-2.5" /> PR
                          </span>
                        )}
                      </div>

                      <div className="col-span-5 flex items-center justify-center gap-1 sm:gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateSetWeight(exerciseIdx, setIdx, set.weight - 2.5)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-50 border border-zinc-300/80 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:bg-[#202025] dark:border-[#2f2f35] dark:text-[#e0e0e0] dark:hover:bg-[#28282e]"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          step="0.5"
                          value={set.weight}
                          onChange={(e) => updateSetWeight(exerciseIdx, setIdx, parseFloat(e.target.value) || 0)}
                          className="w-14 sm:w-16 text-center text-base sm:text-sm font-bold tabular-nums rounded-lg py-1.5 border focus:outline-none focus:border-emerald-600/70 bg-zinc-50 border-zinc-300 text-zinc-900 dark:bg-[#121214] dark:border-[#2a2a30] dark:text-[#e0e0e0]"
                        />
                        <button
                          type="button"
                          onClick={() => updateSetWeight(exerciseIdx, setIdx, set.weight + 2.5)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-50 border border-zinc-300/80 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:bg-[#202025] dark:border-[#2f2f35] dark:text-[#e0e0e0] dark:hover:bg-[#28282e]"
                        >
                          +
                        </button>
                      </div>

                      <div className="col-span-4 flex items-center justify-center gap-1 sm:gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateSetReps(exerciseIdx, setIdx, set.reps - 1)}
                          className="w-7 h-7 sm:w-7 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-50 border border-zinc-300/80 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:bg-[#202025] dark:border-[#2f2f35] dark:text-[#e0e0e0] dark:hover:bg-[#28282e]"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => updateSetReps(exerciseIdx, setIdx, parseInt(e.target.value, 10) || 0)}
                          className="w-12 sm:w-12 text-center text-base sm:text-sm font-bold tabular-nums rounded-lg py-1.5 border focus:outline-none focus:border-emerald-600/70 bg-zinc-50 border-zinc-300 text-zinc-900 dark:bg-[#121214] dark:border-[#2a2a30] dark:text-[#e0e0e0]"
                        />
                        <button
                          type="button"
                          onClick={() => updateSetReps(exerciseIdx, setIdx, set.reps + 1)}
                          className="w-7 h-7 sm:w-7 sm:h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-50 border border-zinc-300/80 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:bg-[#202025] dark:border-[#2f2f35] dark:text-[#e0e0e0] dark:hover:bg-[#28282e]"
                        >
                          +
                        </button>
                      </div>

                      <div className="col-span-2 flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleSetComplete(exerciseIdx, setIdx)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg border flex items-center justify-center transition-all focus:outline-none focus:ring-0 select-none cursor-pointer ${
                            set.completed
                              ? 'bg-[#2f855a] border-[#2f855a] text-white'
                              : 'bg-zinc-50 border-zinc-300 text-zinc-400 hover:text-zinc-900 hover:border-zinc-400 dark:bg-[#202025] dark:border-[#2f2f35] dark:text-zinc-400 dark:hover:text-[#e0e0e0]'
                          }`}
                          title={set.completed ? 'Mark incomplete' : 'Complete set (triggers 90s timer)'}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>

                        {exercise.sets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSet(exerciseIdx, setIdx)}
                            className="text-zinc-400 hover:text-red-500 p-1 transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
                            title="Delete set"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => addSet(exerciseIdx)}
                  className="text-xs font-semibold flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 dark:border-[#2c2c34] dark:bg-[#202025] dark:hover:bg-[#26262c] dark:text-[#e0e0e0]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Set</span>
                </button>

                {exercise.sets[0]?.previousWeight !== undefined && (
                  <span className="text-[11px] text-zinc-500 dark:text-[#a0a0a8] flex items-center gap-1 tabular-nums font-normal">
                    <History className="w-3 h-3 text-zinc-400" />
                    Last session: {exercise.sets[0].previousWeight} {unit} × {exercise.sets[0].previousReps}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Notes */}
      <div className="border rounded-3xl p-6 sm:p-7 space-y-3 transition-colors bg-zinc-50 border-zinc-200 dark:bg-[#18181c] dark:border-[#28282e]">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Workout Notes
        </label>
        <textarea
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          placeholder="How did today's session feel? Any soreness, energy levels, or gym highlights..."
          rows={3}
          className="w-full p-3.5 rounded-xl border text-base leading-relaxed focus:outline-none focus:border-emerald-600/70 bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400 dark:bg-[#121214] dark:border-[#28282e] dark:text-[#e0e0e0] dark:placeholder-zinc-500 font-normal"
        />
      </div>

      {/* Bottom Session Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleBackOrCancelClick}
          className="w-full sm:w-auto px-7 py-3.5 rounded-full border text-xs font-bold transition-all focus:outline-none focus:ring-0 select-none cursor-pointer border-red-300 text-red-600 hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          Cancel Workout
        </button>
        <button
          type="button"
          onClick={() => setShowSummaryModal(true)}
          className="w-full sm:w-auto px-9 py-3.5 rounded-full text-xs font-bold transition-all border border-transparent active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-900 hover:bg-black text-white dark:bg-[#e0e0e0] dark:hover:bg-white dark:text-zinc-950"
        >
          Finish Workout
        </button>
      </div>

      {/* Discard Confirmation Modal */}
      {showDiscardModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDiscardModal(false);
          }}
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-scrollbar animate-in fade-in duration-150"
        >
          <div className="border rounded-3xl max-w-sm w-full p-6 sm:p-7 space-y-5 relative select-none animate-in zoom-in-95 duration-150 bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#18181c] dark:border-[#28282e] dark:text-[#e0e0e0]">
            <button
              type="button"
              onClick={() => setShowDiscardModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-[#e0e0e0] dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 pr-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold leading-normal">Exit Workout?</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                  {totalCompletedSets} completed set{totalCompletedSets > 1 ? 's' : ''} in this session.
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              Would you like to discard this session and return to the dashboard, or keep logging?
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-100 hover:bg-zinc-200 border-zinc-300 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                Keep Logging
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardModal(false);
                  onCancel();
                }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
              >
                Discard & Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Finish Confirmation / Summary Modal */}
      {showSummaryModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSummaryModal(false);
          }}
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto no-scrollbar animate-in fade-in duration-150"
        >
          <div className="border rounded-3xl max-w-md w-full p-7 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150 relative select-none bg-zinc-50 border-zinc-200 text-zinc-900 dark:bg-[#18181c] dark:border-[#28282e] dark:text-[#e0e0e0]">
            <button
              type="button"
              onClick={() => setShowSummaryModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-[#e0e0e0] dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500/90 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold leading-normal">Save {routine.name} Session?</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed font-normal">
                Workout will sync to Supabase instantly and update your smart defaults and PRs on every device.
              </p>
            </div>

            <div className="border rounded-2xl p-4 space-y-3 text-xs bg-zinc-50 border-zinc-200 dark:bg-[#141417] dark:border-[#28282e]">
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400 leading-normal font-normal">
                <span>Duration</span>
                <span className="font-bold tabular-nums text-zinc-900 dark:text-[#e0e0e0]">
                  {Math.max(1, Math.round(elapsedSeconds / 60))} minutes
                </span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400 leading-normal font-normal">
                <span>Completed Sets</span>
                <span className="font-bold tabular-nums text-zinc-900 dark:text-[#e0e0e0]">
                  {totalCompletedSets} / {totalPlannedSets}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500 dark:text-zinc-400 leading-normal font-normal">
                <span>Total Volume</span>
                <span className="font-bold tabular-nums text-zinc-900 dark:text-[#e0e0e0]">
                  {totalVolume.toLocaleString()} {unit}
                </span>
              </div>
              {prSetsCount > 0 && (
                <div className="flex justify-between text-amber-500 font-bold pt-2 border-t border-zinc-200 dark:border-zinc-800 tabular-nums">
                  <span className="flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5" /> New Records
                  </span>
                  <span>
                    {prSetsCount} PR{prSetsCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="px-4 py-2.5 rounded-full border text-xs font-semibold focus:outline-none focus:ring-0 select-none cursor-pointer border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300"
              >
                Back to Session
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 rounded-full text-xs font-bold border border-transparent focus:outline-none focus:ring-0 select-none cursor-pointer bg-zinc-900 hover:bg-black text-white dark:bg-[#e0e0e0] dark:hover:bg-white dark:text-zinc-950"
              >
                Confirm & Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
