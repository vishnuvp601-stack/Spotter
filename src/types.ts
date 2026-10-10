export type User = 'vishnu' | 'amy';

export type WeightUnit = 'kg' | 'lbs';

export interface Profile {
  id: User;
  displayName: string;
  isAdmin: boolean;
  unit: WeightUnit;
  weeklyTargetDays: number;
  theme: 'dark' | 'light';
}

export interface ExerciseTemplate {
  id: string;
  name: string;
  targetMuscle: string;
  defaultSets: number;
  defaultReps: number;
  defaultWeight: number; // in current unit default (e.g. kg)
}

export interface Routine {
  id: string;
  name: string;
  dayNumber: number; // 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 0 = Custom/Weekend
  targetCategory: string;
  description: string;
  exercises: ExerciseTemplate[];
  isCustom?: boolean;
  createdBy?: User | null;
}

export interface LoggedSet {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  isPR?: boolean;
  previousWeight?: number;
  previousReps?: number;
}

export interface LoggedExercise {
  exerciseId: string;
  exerciseName: string;
  targetMuscle: string;
  sets: LoggedSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  userId: User;
  routineId: string;
  routineName: string;
  date: string; // YYYY-MM-DD
  startTime: number;
  endTime?: number;
  durationMinutes?: number;
  exercises: LoggedExercise[];
  notes?: string;
  prCount?: number;
  totalVolume?: number;
  completedSets?: number;
}

export interface SessionReaction {
  sessionId: string;
  reactorId: User;
  createdAt: string;
}
