import { useEffect, useState } from 'react';
import type { Routine, User, WeightUnit, WorkoutSession } from './types';
import { useSpotterData } from './state/SpotterDataContext';
import { getStoredActiveUser, setStoredActiveUser, getStoredTheme, setStoredTheme } from './utils/localPrefs';
import { computeStreak, computeWeeklySessionDays, computeTotalPRs } from './utils/workoutStats';
import { getTodayRoutineInfo } from './utils/dateSchedule';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ScheduleBar } from './components/ScheduleBar';
import { RoutinePreviewList } from './components/RoutinePreviewList';
import { SubNavTabs } from './components/SubNavTabs';
import type { SubTab } from './components/SubNavTabs';
import { DashboardFeed } from './components/DashboardFeed';
import { WorkoutLauncher } from './components/WorkoutLauncher';
import { RoutinesView } from './components/RoutinesView';
import { AnalyticsView } from './components/AnalyticsView';
import { HistoryView } from './components/HistoryView';
import { ActiveLogger } from './components/ActiveLogger';
import { RestTimer } from './components/RestTimer';
import { Settings } from './components/Settings';

const CARDIO_ROUTINE: Routine = {
  id: 'cardio-session',
  name: 'Treadmill Incline Cardio',
  dayNumber: 0,
  targetCategory: 'Cardio',
  description: '12% Incline • 3.5 km/h endurance walk',
  exercises: [
    {
      id: 'treadmill-incline',
      name: 'Treadmill Incline Walk',
      targetMuscle: 'Cardio',
      defaultSets: 1,
      defaultReps: 1,
      defaultWeight: 0,
    },
  ],
};

const EMPTY_ROUTINE: Routine = {
  id: 'empty-session',
  name: 'Open Workout',
  dayNumber: 0,
  targetCategory: 'Freeform',
  description: 'Blank template to log freeform sets',
  exercises: [],
};

function App() {
  const {
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
    addReaction,
    signOut,
  } = useSpotterData();

  const [activeUser, setActiveUser] = useState<User>(() => getStoredActiveUser());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getStoredTheme());
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('dashboard');
  const todayInfo = getTodayRoutineInfo();
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(todayInfo.routineId);
  const [activeWorkoutRoutine, setActiveWorkoutRoutine] = useState<Routine | null>(null);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSelectUser = (user: User) => {
    setActiveUser(user);
    setStoredActiveUser(user);
  };

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setStoredTheme(next);
  };

  const handleDiscardWorkoutAndSwitch = (targetUser: User) => {
    setActiveWorkoutRoutine(null);
    setSaveError(null);
    handleSelectUser(targetUser);
  };

  const handleLaunchWorkout = (routine: Routine) => {
    setSaveError(null);
    setActiveWorkoutRoutine(routine);
  };

  const handleFinishWorkout = async (session: WorkoutSession) => {
    try {
      await saveWorkoutSession(session);
      setActiveWorkoutRoutine(null);
      setSaveError(null);
      setActiveSubTab('history');
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save workout. Please try again.');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteWorkoutSession(sessionId);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete session.');
    }
  };

  const handleSaveCustomRoutine = async (routine: Routine) => {
    try {
      await saveCustomRoutine({ ...routine, createdBy: activeUser });
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to save routine.');
    }
  };

  const handleDeleteCustomRoutine = async (routineId: string) => {
    try {
      await deleteCustomRoutine(routineId);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to delete routine.');
    }
  };

  const handleUnitChange = async (unit: WeightUnit) => {
    try {
      await updateProfileUnit(activeUser, unit);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Failed to update unit.');
    }
  };

  const handleSignOut = async () => {
    setIsSettingsOpen(false);
    await signOut();
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f3] dark:bg-[#121212] text-zinc-900 dark:text-[#e0e0e0] transition-colors">
        <div className="animate-pulse text-sm text-zinc-500 dark:text-zinc-400">Loading your training data...</div>
      </div>
    );
  }

  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f3] dark:bg-[#121212] text-zinc-900 dark:text-[#e0e0e0] p-4 transition-colors">
        <div className="max-w-sm text-center space-y-2">
          <p className="text-sm font-bold text-red-500 dark:text-red-400">Couldn't load Spotter data</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{dataError}</p>
        </div>
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f3] dark:bg-[#121212] text-zinc-900 dark:text-[#e0e0e0] p-4 transition-colors">
        <div className="max-w-sm text-center space-y-2">
          <p className="text-sm font-bold">No routines found yet</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Run supabase/schema.sql against your Supabase project to seed the default PPLPP routines.
          </p>
        </div>
      </div>
    );
  }

  const activeProfile = profiles.find((p) => p.id === activeUser);
  const unit: WeightUnit = activeProfile?.unit ?? 'kg';

  const partnerUser: User = activeUser === 'vishnu' ? 'amy' : 'vishnu';
  const partnerName = partnerUser === 'vishnu' ? 'Vishnu' : 'Amy';

  const recommendedRoutine = routines.find((r) => r.id === todayInfo.routineId) ?? routines[0];
  const selectedRoutine = routines.find((r) => r.id === selectedRoutineId) ?? recommendedRoutine;

  const userSessions = sessions
    .filter((s) => s.userId === activeUser)
    .sort((a, b) => (b.startTime || 0) - (a.startTime || 0));
  const partnerSessions = sessions
    .filter((s) => s.userId === partnerUser)
    .sort((a, b) => (b.startTime || 0) - (a.startTime || 0));
  const partnerLatestSession = partnerSessions[0];

  const userStreak = computeStreak(sessions, activeUser);
  const weeklyDays = computeWeeklySessionDays(sessions, activeUser);
  const totalPRs = computeTotalPRs(sessions, activeUser);
  const partnerStreak = computeStreak(sessions, partnerUser);

  const partnerReactionCount = partnerLatestSession
    ? reactions.filter((r) => r.sessionId === partnerLatestSession.id).length
    : 0;
  const hasReactedToPartner = partnerLatestSession
    ? reactions.some((r) => r.sessionId === partnerLatestSession.id && r.reactorId === activeUser)
    : false;

  const handleFistBump = () => {
    if (!partnerLatestSession) return;
    addReaction(partnerLatestSession.id, activeUser).catch((err) => {
      window.alert(err instanceof Error ? err.message : 'Failed to react.');
    });
  };

  const isWorkoutActive = activeWorkoutRoutine !== null;

  return (
    <div className="min-h-screen bg-[#f1f1f3] dark:bg-[#121212] transition-colors">
      <Header
        activeUser={activeUser}
        onSelectUser={handleSelectUser}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        userStreak={userStreak}
        isWorkoutActive={isWorkoutActive}
        onDiscardWorkoutAndSwitch={handleDiscardWorkoutAndSwitch}
        onLogoClick={() => setActiveSubTab('dashboard')}
      />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-8">
        {saveError && (
          <div className="p-4 rounded-2xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs font-medium flex items-center justify-between gap-3">
            <span>{saveError}</span>
            <button
              type="button"
              onClick={() => setSaveError(null)}
              className="font-bold shrink-0 cursor-pointer focus:outline-none focus:ring-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeWorkoutRoutine ? (
          <ActiveLogger
            routine={activeWorkoutRoutine}
            activeUser={activeUser}
            unit={unit}
            sessions={sessions}
            onFinishWorkout={handleFinishWorkout}
            onTriggerRestTimer={() => setRestTimerActive(true)}
            onCancel={() => setActiveWorkoutRoutine(null)}
          />
        ) : (
          <>
            <SubNavTabs activeTab={activeSubTab} onSelectTab={setActiveSubTab} />

            {activeSubTab === 'dashboard' && (
              <>
                <HeroBanner
                  user={activeUser}
                  routine={recommendedRoutine}
                  lastSession={userSessions[0]}
                  onLaunchWorkout={() => handleLaunchWorkout(recommendedRoutine)}
                  isSessionActive={isWorkoutActive}
                />
                <ScheduleBar
                  selectedRoutineId={selectedRoutineId}
                  onSelectRoutineId={setSelectedRoutineId}
                  sessions={sessions}
                  activeUser={activeUser}
                  routines={routines}
                />
                <RoutinePreviewList routine={selectedRoutine} />
                <DashboardFeed
                  activeUser={activeUser}
                  currentRoutine={recommendedRoutine}
                  onLaunchRoutine={handleLaunchWorkout}
                  onStartCardio={() => handleLaunchWorkout(CARDIO_ROUTINE)}
                  onStartEmpty={() => handleLaunchWorkout(EMPTY_ROUTINE)}
                  onGoToRoutines={() => setActiveSubTab('routines')}
                  onGoToAnalytics={() => setActiveSubTab('analytics')}
                  onGoToHistory={() => setActiveSubTab('history')}
                  recentSessions={userSessions}
                  streak={userStreak}
                  weeklyDays={weeklyDays}
                  totalPRs={totalPRs}
                  partnerName={partnerName}
                  partnerStreak={partnerStreak}
                  partnerLatestSession={partnerLatestSession}
                  reactionCount={partnerReactionCount}
                  hasReacted={hasReactedToPartner}
                  onFistBump={handleFistBump}
                />
              </>
            )}

            {activeSubTab === 'workout' && (
              <WorkoutLauncher
                recommendedRoutine={recommendedRoutine}
                routines={routines}
                onStartRoutine={handleLaunchWorkout}
                onStartCardio={() => handleLaunchWorkout(CARDIO_ROUTINE)}
                onStartEmpty={() => handleLaunchWorkout(EMPTY_ROUTINE)}
                onManageInLibrary={() => setActiveSubTab('routines')}
                onBackToDashboard={() => setActiveSubTab('dashboard')}
              />
            )}

            {activeSubTab === 'routines' && (
              <RoutinesView
                routines={routines}
                onSelectRoutineToStart={handleLaunchWorkout}
                onSaveCustomRoutine={handleSaveCustomRoutine}
                onDeleteCustomRoutine={handleDeleteCustomRoutine}
                activeUser={activeUser}
                onBackToDashboard={() => setActiveSubTab('dashboard')}
                theme={theme}
              />
            )}

            {activeSubTab === 'analytics' && (
              <AnalyticsView
                sessions={sessions}
                activeUser={activeUser}
                unit={unit}
                onBackToDashboard={() => setActiveSubTab('dashboard')}
              />
            )}

            {activeSubTab === 'history' && (
              <HistoryView
                sessions={sessions}
                activeUser={activeUser}
                unit={unit}
                onDeleteSession={handleDeleteSession}
                onBackToDashboard={() => setActiveSubTab('dashboard')}
              />
            )}
          </>
        )}
      </main>

      <RestTimer isActive={restTimerActive} onClose={() => setRestTimerActive(false)} />

      {isSettingsOpen && (
        <Settings
          unit={unit}
          onUnitChange={handleUnitChange}
          onSignOut={handleSignOut}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
