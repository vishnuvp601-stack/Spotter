import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { RealtimePostgresChangesPayload, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import {
  rowToProfile,
  rowToRoutine,
  rowToSession,
  routineToInsertRow,
  sessionToInsertRow,
} from '../lib/mappers';
import type { ProfileRow, RoutineRow, WorkoutSessionRow } from '../lib/mappers';
import type { Profile, Routine, SessionReaction, User, WorkoutSession } from '../types';

interface ReactionRow {
  id: string;
  session_id: string;
  reactor_id: string;
  created_at: string;
}

function rowToReaction(row: ReactionRow): SessionReaction {
  return { sessionId: row.session_id, reactorId: row.reactor_id as User, createdAt: row.created_at };
}

function applyChange<TRow extends { id: string }, TModel extends { id: string }>(
  list: TModel[],
  payload: RealtimePostgresChangesPayload<TRow>,
  toModel: (row: TRow) => TModel
): TModel[] {
  if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
    const incoming = toModel(payload.new as TRow);
    const idx = list.findIndex((item) => item.id === incoming.id);
    if (idx === -1) return [...list, incoming];
    const next = [...list];
    next[idx] = incoming;
    return next;
  }
  if (payload.eventType === 'DELETE') {
    const oldRow = payload.old as Partial<TRow>;
    const deletedId = oldRow.id;
    return list.filter((item) => item.id !== deletedId);
  }
  return list;
}

// Reactions don't have a client-side `id` field (their true identity is the
// sessionId+reactorId pair), so they use their own dedup logic instead of
// the generic id-based applyChange helper above.
function applyReactionChange(
  list: SessionReaction[],
  payload: RealtimePostgresChangesPayload<ReactionRow>
): SessionReaction[] {
  if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
    const incoming = rowToReaction(payload.new as ReactionRow);
    const idx = list.findIndex((r) => r.sessionId === incoming.sessionId && r.reactorId === incoming.reactorId);
    if (idx === -1) return [...list, incoming];
    const next = [...list];
    next[idx] = incoming;
    return next;
  }
  if (payload.eventType === 'DELETE') {
    const oldRow = payload.old as Partial<ReactionRow>;
    return list.filter((r) => !(r.sessionId === oldRow.session_id && r.reactorId === oldRow.reactor_id));
  }
  return list;
}

interface SpotterDataContextValue {
  authLoading: boolean;
  authSession: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;

  dataLoading: boolean;
  dataError: string | null;
  profiles: Profile[];
  routines: Routine[];
  sessions: WorkoutSession[];
  reactions: SessionReaction[];

  saveWorkoutSession: (session: WorkoutSession) => Promise<void>;
  deleteWorkoutSession: (sessionId: string) => Promise<void>;
  saveCustomRoutine: (routine: Routine) => Promise<void>;
  deleteCustomRoutine: (routineId: string) => Promise<void>;
  updateProfileUnit: (userId: User, unit: Profile['unit']) => Promise<void>;
  updateWeeklyTarget: (userId: User, weeklyTargetDays: number) => Promise<void>;
  addReaction: (sessionId: string, reactorId: User) => Promise<void>;
}

const SpotterDataContext = createContext<SpotterDataContextValue | null>(null);

export function SpotterDataProvider({ children }: { children: ReactNode }) {
  const [authLoading, setAuthLoading] = useState(true);
  const [authSession, setAuthSession] = useState<Session | null>(null);

  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [reactions, setReactions] = useState<SessionReaction[]>([]);

  const channelsRef = useRef<ReturnType<typeof supabase.channel>[]>([]);

  // ---- Auth bootstrap -------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setAuthSession(data.session);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setAuthSession(newSession);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // ---- Data load + realtime subscriptions ------------------------------
  useEffect(() => {
    if (!authSession) {
      setProfiles([]);
      setRoutines([]);
      setSessions([]);
      setReactions([]);
      channelsRef.current.forEach((ch) => supabase.removeChannel(ch));
      channelsRef.current = [];
      return;
    }

    let isMounted = true;
    setDataLoading(true);
    setDataError(null);

    (async () => {
      const [profilesRes, routinesRes, sessionsRes, reactionsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('routines').select('*'),
        supabase.from('workout_sessions').select('*').order('start_time', { ascending: false }),
        supabase.from('session_reactions').select('*'),
      ]);

      if (!isMounted) return;

      const firstError =
        profilesRes.error || routinesRes.error || sessionsRes.error || reactionsRes.error;
      if (firstError) {
        setDataError(firstError.message);
        setDataLoading(false);
        return;
      }

      setProfiles(((profilesRes.data as ProfileRow[]) || []).map(rowToProfile));
      setRoutines(((routinesRes.data as RoutineRow[]) || []).map(rowToRoutine));
      setSessions(((sessionsRes.data as WorkoutSessionRow[]) || []).map(rowToSession));
      setReactions(((reactionsRes.data as ReactionRow[]) || []).map(rowToReaction));
      setDataLoading(false);
    })();

    const sessionsChannel = supabase
      .channel('realtime-workout-sessions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'workout_sessions' },
        (payload: RealtimePostgresChangesPayload<WorkoutSessionRow>) => {
          setSessions((prev) => applyChange(prev, payload, rowToSession));
        }
      )
      .subscribe();

    const routinesChannel = supabase
      .channel('realtime-routines')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'routines' },
        (payload: RealtimePostgresChangesPayload<RoutineRow>) => {
          setRoutines((prev) => applyChange(prev, payload, rowToRoutine));
        }
      )
      .subscribe();

    const reactionsChannel = supabase
      .channel('realtime-session-reactions')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'session_reactions' },
        (payload: RealtimePostgresChangesPayload<ReactionRow>) => {
          setReactions((prev) => applyReactionChange(prev, payload));
        }
      )
      .subscribe();

    const profilesChannel = supabase
      .channel('realtime-profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload: RealtimePostgresChangesPayload<ProfileRow>) => {
          setProfiles((prev) => applyChange(prev, payload, rowToProfile));
        }
      )
      .subscribe();

    channelsRef.current = [sessionsChannel, routinesChannel, reactionsChannel, profilesChannel];

    return () => {
      isMounted = false;
      channelsRef.current.forEach((ch) => supabase.removeChannel(ch));
      channelsRef.current = [];
    };
  }, [authSession]);

  // ---- Mutations --------------------------------------------------------
  // Each mutation writes to Supabase AND patches local state immediately
  // (optimistic update) so the UI feels instant rather than waiting on the
  // realtime round-trip. When the realtime event for the same row arrives
  // moments later it just overwrites the same id with equivalent data.
  const saveWorkoutSession = useCallback(async (session: WorkoutSession) => {
    const row = sessionToInsertRow(session);
    const { error } = await supabase.from('workout_sessions').upsert(row);
    if (error) throw new Error(error.message);
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === session.id);
      if (idx === -1) return [session, ...prev];
      const next = [...prev];
      next[idx] = session;
      return next;
    });
  }, []);

  const deleteWorkoutSession = useCallback(async (sessionId: string) => {
    const { error } = await supabase.from('workout_sessions').delete().eq('id', sessionId);
    if (error) throw new Error(error.message);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  }, []);

  const saveCustomRoutine = useCallback(async (routine: Routine) => {
    const row = routineToInsertRow(routine);
    const { error } = await supabase.from('routines').upsert(row);
    if (error) throw new Error(error.message);
    setRoutines((prev) => {
      const idx = prev.findIndex((r) => r.id === routine.id);
      if (idx === -1) return [...prev, routine];
      const next = [...prev];
      next[idx] = routine;
      return next;
    });
  }, []);

  const deleteCustomRoutine = useCallback(async (routineId: string) => {
    const { error } = await supabase.from('routines').delete().eq('id', routineId);
    if (error) throw new Error(error.message);
    setRoutines((prev) => prev.filter((r) => r.id !== routineId));
  }, []);

  const updateProfileUnit = useCallback(async (userId: User, unit: Profile['unit']) => {
    const { error } = await supabase.from('profiles').update({ unit }).eq('id', userId);
    if (error) throw new Error(error.message);
    setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, unit } : p)));
  }, []);

  const updateWeeklyTarget = useCallback(async (userId: User, weeklyTargetDays: number) => {
    const { error } = await supabase
      .from('profiles')
      .update({ weekly_target_days: weeklyTargetDays })
      .eq('id', userId);
    if (error) throw new Error(error.message);
    setProfiles((prev) => prev.map((p) => (p.id === userId ? { ...p, weeklyTargetDays } : p)));
  }, []);

  const addReaction = useCallback(async (sessionId: string, reactorId: User) => {
    const { error } = await supabase
      .from('session_reactions')
      .upsert({ session_id: sessionId, reactor_id: reactorId }, { onConflict: 'session_id,reactor_id' });
    if (error) throw new Error(error.message);
    setReactions((prev) => {
      const exists = prev.some((r) => r.sessionId === sessionId && r.reactorId === reactorId);
      if (exists) return prev;
      return [...prev, { sessionId, reactorId, createdAt: new Date().toISOString() }];
    });
  }, []);

  const value = useMemo<SpotterDataContextValue>(
    () => ({
      authLoading,
      authSession,
      signIn,
      signOut,
      dataLoading,
      dataError,
      profiles,
      routines,
      sessions,
      reactions,
      saveWorkoutSession,
      deleteWorkoutSession,
      saveCustomRoutine,
      deleteCustomRoutine,
      updateProfileUnit,
      updateWeeklyTarget,
      addReaction,
    }),
    [
      authLoading,
      authSession,
      signIn,
      signOut,
      dataLoading,
      dataError,
      profiles,
      routines,
      sessions,
      reactions,
      saveWorkoutSession,
      deleteWorkoutSession,
      saveCustomRoutine,
      deleteCustomRoutine,
      updateProfileUnit,
      updateWeeklyTarget,
      addReaction,
    ]
  );

  return <SpotterDataContext.Provider value={value}>{children}</SpotterDataContext.Provider>;
}

export function useSpotterData(): SpotterDataContextValue {
  const ctx = useContext(SpotterDataContext);
  if (!ctx) throw new Error('useSpotterData must be used within a SpotterDataProvider');
  return ctx;
}
