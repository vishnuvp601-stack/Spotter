import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Dumbbell, Lock, AlertTriangle } from 'lucide-react';
import { useSpotterData } from '../state/SpotterDataContext';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export function AuthGate({ children }: { children: ReactNode }) {
  const { authLoading, authSession, signIn } = useSpotterData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-[#e0e0e0] p-4 select-none">
        <div className="w-full max-w-md border border-[#28282e] bg-[#18181c] rounded-3xl p-7 sm:p-8 space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold">Supabase isn't configured yet</h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Copy <code className="text-zinc-300">.env.local.example</code> to <code className="text-zinc-300">.env.local</code> in the{' '}
            <code className="text-zinc-300">app</code> folder, fill in your Supabase Project URL and anon key, then
            restart <code className="text-zinc-300">npm run dev</code>.
          </p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-[#e0e0e0]">
        <div className="animate-pulse text-sm text-zinc-400">Loading Spotter...</div>
      </div>
    );
  }

  if (authSession) {
    return <>{children}</>;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error: signInError } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (signInError) setError(signInError);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] text-[#e0e0e0] p-4 select-none">
      <div className="w-full max-w-sm border border-[#28282e] bg-[#18181c] rounded-3xl p-7 sm:p-8 space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#202024] border border-[#2f2f35] text-emerald-400/90 flex items-center justify-center">
            <Dumbbell className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wider uppercase">Spotter</h1>
            <p className="text-xs text-zinc-400 mt-1">Unlock to see Vishnu &amp; Amy's training log</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">{error}</div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              className="w-full rounded-xl p-3 text-sm border bg-[#121214] border-[#28282e] text-[#e0e0e0] focus:outline-none focus:border-emerald-600/70"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-xl p-3 text-sm border bg-[#121214] border-[#28282e] text-[#e0e0e0] focus:outline-none focus:border-emerald-600/70"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full text-sm font-bold bg-[#e0e0e0] hover:bg-white text-zinc-950 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none focus:ring-0 select-none cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>{submitting ? 'Unlocking...' : 'Unlock Spotter'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
