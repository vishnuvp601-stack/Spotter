import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, X, Plus, Minus, BellRing } from 'lucide-react';
import { playRestTimerChime } from '../utils/audio';

interface RestTimerProps {
  initialSeconds?: number;
  isActive: boolean;
  onClose: () => void;
}

export function RestTimer({ initialSeconds = 90, isActive, onClose }: RestTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  useEffect(() => {
    if (isActive) {
      setTotalSeconds(initialSeconds);
      setSecondsLeft(initialSeconds);
      setIsPaused(false);
      setHasFinished(false);
    }
  }, [isActive, initialSeconds]);

  useEffect(() => {
    if (!isActive || isPaused || hasFinished) return;

    if (secondsLeft <= 0) {
      setHasFinished(true);
      playRestTimerChime();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setHasFinished(true);
          playRestTimerChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isPaused, secondsLeft, hasFinished]);

  if (!isActive) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent =
    totalSeconds > 0 ? Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100)) : 100;

  const addTime = (delta: number) => {
    setSecondsLeft((prev) => {
      const next = Math.max(0, prev + delta);
      if (next > totalSeconds) {
        setTotalSeconds(next);
      }
      return next;
    });
    if (hasFinished && delta > 0) {
      setHasFinished(false);
    }
  };

  const resetTimer = () => {
    setSecondsLeft(90);
    setTotalSeconds(90);
    setIsPaused(false);
    setHasFinished(false);
  };

  return (
    <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200 select-none">
      <div className="bg-[#18181c]/95 border border-[#28282e] rounded-2xl p-4 sm:p-5 backdrop-blur-md">
        <div className="w-full bg-[#121214] h-1.5 rounded-full overflow-hidden mb-3.5">
          <div
            className={`h-full transition-all duration-500 ease-linear ${
              hasFinished ? 'bg-emerald-400/90' : 'bg-emerald-600/85'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1 leading-normal">
                {hasFinished ? (
                  <span className="text-emerald-400/90 font-bold flex items-center gap-1">
                    <BellRing className="w-3.5 h-3.5 animate-bounce" /> Time's up! Ready for next set
                  </span>
                ) : isPaused ? (
                  'Rest Paused'
                ) : (
                  'Rest Timer'
                )}
              </span>
              <span className="text-2xl font-black tracking-tight text-[#e0e0e0] tabular-numbers leading-tight">
                {formattedTime}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => addTime(-15)}
              className="min-w-[36px] sm:min-w-[40px] h-8 sm:h-9 px-2 rounded-lg bg-[#222226] hover:bg-[#2c2c32] text-zinc-300 border border-[#28282e] text-xs font-semibold flex items-center justify-center tabular-nums focus:outline-none focus:ring-0 select-none cursor-pointer"
              title="-15 seconds"
              aria-label="Subtract 15 seconds"
            >
              <Minus className="w-3 h-3" />
              15s
            </button>

            <button
              type="button"
              onClick={() => addTime(30)}
              className="min-w-[36px] sm:min-w-[40px] h-8 sm:h-9 px-2 rounded-lg bg-[#222226] hover:bg-[#2c2c32] text-zinc-300 border border-[#28282e] text-xs font-semibold flex items-center justify-center tabular-nums focus:outline-none focus:ring-0 select-none cursor-pointer"
              title="+30 seconds"
              aria-label="Add 30 seconds"
            >
              <Plus className="w-3 h-3" />
              30s
            </button>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-emerald-600/90 hover:bg-emerald-500/90 text-white flex items-center justify-center focus:outline-none focus:ring-0 select-none cursor-pointer"
              title={isPaused ? 'Resume' : 'Pause'}
              aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
            >
              {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={resetTimer}
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-[#222226] hover:bg-[#2c2c32] text-zinc-400 hover:text-white border border-[#28282e] flex items-center justify-center focus:outline-none focus:ring-0 select-none cursor-pointer"
              title="Reset to 90s"
              aria-label="Reset timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-[#222226] hover:bg-[#2c2c32] text-zinc-400 hover:text-white border border-[#28282e] flex items-center justify-center focus:outline-none focus:ring-0 select-none cursor-pointer"
              title="Dismiss timer"
              aria-label="Dismiss timer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
