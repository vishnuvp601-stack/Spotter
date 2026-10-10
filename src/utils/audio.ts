/**
 * Lightweight rest timer chime synthesizer using the Web Audio API.
 * Fully client-side, zero network requests.
 */
export function playRestTimerChime(): void {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const tones = [
      { freq: 880, start: 0, duration: 0.15 },
      { freq: 1174.66, start: 0.16, duration: 0.3 },
    ];

    tones.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0.0001, now + start);
      gain.gain.exponentialRampToValueAtTime(0.25, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + duration);
    });

    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch (err) {
    console.warn('Audio chime unsupported or muted:', err);
  }
}
