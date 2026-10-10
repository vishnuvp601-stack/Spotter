import { useState } from 'react';
import type { Routine, ExerciseTemplate } from '../types';
import { Plus, Trash2, X, Check, Dumbbell } from 'lucide-react';

interface RoutineBuilderProps {
  onSave: (routine: Routine) => void;
  onCancel: () => void;
  theme?: 'dark' | 'light';
}

export function RoutineBuilder({ onSave, onCancel, theme = 'dark' }: RoutineBuilderProps) {
  const [name, setName] = useState('');
  const [targetCategory, setTargetCategory] = useState('');
  const [description, setDescription] = useState('');
  const [dayNumber] = useState(0);
  const [exercises, setExercises] = useState<ExerciseTemplate[]>([
    {
      id: `custom-ex-${Date.now()}-1`,
      name: '',
      targetMuscle: '',
      defaultSets: 3,
      defaultReps: 10,
      defaultWeight: 20,
    },
  ]);
  const [error, setError] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const addExerciseRow = () => {
    setExercises((prev) => [
      ...prev,
      {
        id: `custom-ex-${Date.now()}-${prev.length + 1}`,
        name: '',
        targetMuscle: '',
        defaultSets: 3,
        defaultReps: 10,
        defaultWeight: 20,
      },
    ]);
  };

  const removeExerciseRow = (index: number) => {
    if (exercises.length <= 1) return;
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const updateExerciseField = (index: number, field: keyof ExerciseTemplate, value: string | number) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a routine name.');
      return;
    }

    const validExercises = exercises.filter((ex) => ex.name.trim().length > 0);
    if (validExercises.length === 0) {
      setError('Please add at least one exercise with a name.');
      return;
    }

    const newRoutine: Routine = {
      id: `custom-routine-${Date.now()}`,
      name: name.trim(),
      dayNumber,
      targetCategory: targetCategory.trim() || 'Custom Split',
      description: description.trim() || 'Custom designed workout routine.',
      exercises: validExercises.map((ex, i) => ({
        ...ex,
        id: ex.id || `ex-${i}-${Date.now()}`,
      })),
      isCustom: true,
    };

    onSave(newRoutine);
  };

  return (
    <div
      className={`border rounded-3xl p-7 sm:p-9 md:p-10 space-y-8 select-none transition-colors ${
        isDark ? 'bg-[#18181c] border-[#28282e] text-[#e0e0e0]' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
      }`}
    >
      <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-[#28282e]' : 'border-zinc-200'}`}>
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark ? 'bg-[#222226] text-emerald-400/85' : 'bg-zinc-100 text-emerald-600/90'
            }`}
          >
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold leading-normal">Custom Routine Builder</h2>
            <p className="text-xs text-zinc-400 font-normal leading-normal">
              Design a personalized split with custom targets
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer ${
            isDark
              ? 'bg-[#222226] text-zinc-400 hover:text-white hover:bg-zinc-700'
              : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200'
          }`}
          title="Cancel & Go Back"
          aria-label="Cancel & Go Back"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Routine Title *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              placeholder="E.g., Upper Power or Arms & Delts"
              className={`w-full rounded-xl p-3 text-sm border focus:outline-none focus:border-emerald-600/70 font-normal ${
                isDark
                  ? 'bg-[#121214] border-[#28282e] text-[#e0e0e0] placeholder-zinc-500'
                  : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
              }`}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Muscle Group Focus</label>
            <input
              type="text"
              value={targetCategory}
              onChange={(e) => setTargetCategory(e.target.value)}
              placeholder="E.g., Chest & Arms, Quads & Glutes"
              className={`w-full rounded-xl p-3 text-sm border focus:outline-none focus:border-emerald-600/70 font-normal ${
                isDark
                  ? 'bg-[#121214] border-[#28282e] text-[#e0e0e0] placeholder-zinc-500'
                  : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
              }`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Description / Overview</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="E.g., 4 exercises focusing on high-volume hypertrophy"
            className={`w-full rounded-xl p-3 text-sm border focus:outline-none focus:border-emerald-600/70 font-normal ${
              isDark
                ? 'bg-[#121214] border-[#28282e] text-[#e0e0e0] placeholder-zinc-500'
                : 'bg-zinc-50 border-zinc-300 text-zinc-900 placeholder-zinc-400'
            }`}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Exercises ({exercises.length})
            </label>
            <button
              type="button"
              onClick={addExerciseRow}
              className={`text-xs font-semibold flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer ${
                isDark ? 'text-emerald-400/90 hover:text-emerald-300' : 'text-emerald-600/90 hover:text-emerald-700'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Exercise</span>
            </button>
          </div>

          <div className="space-y-4">
            {exercises.map((ex, index) => (
              <div
                key={ex.id || index}
                className={`p-4 sm:p-5 rounded-2xl space-y-3 transition-colors ${isDark ? 'bg-[#141417]' : 'bg-zinc-100/80'}`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-1 text-center hidden sm:block">
                    <span
                      className={`w-7 h-7 rounded-lg text-xs font-bold inline-flex items-center justify-center ${
                        isDark ? 'bg-[#222227] text-zinc-300' : 'bg-zinc-200 text-zinc-700'
                      }`}
                    >
                      {index + 1}
                    </span>
                  </div>

                  <div className="sm:col-span-5">
                    <input
                      type="text"
                      placeholder="Exercise name (e.g., Incline DB Press)"
                      value={ex.name}
                      onChange={(e) => updateExerciseField(index, 'name', e.target.value)}
                      className={`w-full rounded-xl p-2.5 text-xs sm:text-sm border focus:outline-none focus:border-emerald-600/70 font-normal ${
                        isDark ? 'bg-[#101012] border-[#2a2a30] text-[#e0e0e0]' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Target muscle"
                      value={ex.targetMuscle}
                      onChange={(e) => updateExerciseField(index, 'targetMuscle', e.target.value)}
                      className={`w-full rounded-xl p-2.5 text-xs sm:text-sm border focus:outline-none focus:border-emerald-600/70 font-normal ${
                        isDark ? 'bg-[#101012] border-[#2a2a30] text-[#e0e0e0]' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      }`}
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-zinc-400 mb-0.5 font-normal">Sets</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={ex.defaultSets}
                        onChange={(e) => updateExerciseField(index, 'defaultSets', parseInt(e.target.value) || 1)}
                        className={`w-full rounded-xl p-2 text-center text-xs sm:text-sm border focus:outline-none focus:border-emerald-600/70 font-bold ${
                          isDark ? 'bg-[#101012] border-[#2a2a30] text-[#e0e0e0]' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                        }`}
                      />
                    </div>

                    <div className="flex-1">
                      <label className="block text-[10px] text-zinc-400 mb-0.5 font-normal">Reps</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={ex.defaultReps}
                        onChange={(e) => updateExerciseField(index, 'defaultReps', parseInt(e.target.value) || 1)}
                        className={`w-full rounded-xl p-2 text-center text-xs sm:text-sm border focus:outline-none focus:border-emerald-600/70 font-bold ${
                          isDark ? 'bg-[#101012] border-[#2a2a30] text-[#e0e0e0]' : 'bg-zinc-50 border-zinc-300 text-zinc-900'
                        }`}
                      />
                    </div>
                  </div>

                  {exercises.length > 1 && (
                    <div className="sm:col-span-1 text-right">
                      <button
                        type="button"
                        onClick={() => removeExerciseRow(index)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer"
                        title="Remove exercise"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`flex items-center justify-end gap-3 pt-5 border-t ${isDark ? 'border-[#28282e]' : 'border-zinc-200'}`}>
          <button
            type="button"
            onClick={onCancel}
            className={`px-5 py-2.5 rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-0 select-none cursor-pointer ${
              isDark
                ? 'border-[#2f2f35] bg-[#202025] hover:bg-[#28282e] text-zinc-300'
                : 'border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 border border-transparent active:scale-95 focus:outline-none focus:ring-0 select-none cursor-pointer ${
              isDark ? 'bg-[#e0e0e0] hover:bg-white text-zinc-950' : 'bg-zinc-900 hover:bg-black text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Save Routine</span>
          </button>
        </div>
      </form>
    </div>
  );
}
