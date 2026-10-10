import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Barbell } from '@phosphor-icons/react';
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
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f3] text-zinc-900 dark:bg-[#121212] dark:text-[#e0e0e0] p-4 select-none">
        <div className="w-full max-w-md border border-zinc-200 bg-zinc-50 dark:border-[#28282e] dark:bg-[#18181c] rounded-3xl p-7 sm:p-8 space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-bold">Supabase isn't configured yet</h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Copy <code className="text-zinc-700 dark:text-zinc-300">.env.local.example</code> to{' '}
            <code className="text-zinc-700 dark:text-zinc-300">.env.local</code> in the{' '}
            <code className="text-zinc-700 dark:text-zinc-300">app</code> folder, fill in your Supabase Project URL and anon key, then
            restart <code className="text-zinc-700 dark:text-zinc-300">npm run dev</code>.
          </p>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f1f3] text-zinc-900 dark:bg-[#121212] dark:text-[#e0e0e0]">
        <div className="animate-pulse text-sm text-zinc-500 dark:text-zinc-400">Loading Spotter...</div>
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
    <div className="min-h-screen flex items-center justify-center bg-[#f1f1f3] text-zinc-900 dark:bg-[#121212] dark:text-[#e0e0e0] p-4 select-none">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-300 text-emerald-600/90 dark:bg-[#1c1c20] dark:border-[#2a2a30] dark:text-emerald-400/90 flex items-center justify-center shrink-0">
            <Barbell className="w-4 h-4" weight="fill" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-zinc-800 dark:text-zinc-200">Spotter</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-3 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900/50 dark:text-red-300 text-[13px]">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-zinc-600 dark:text-zinc-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="you@example.com"
              className="w-full rounded-lg px-3 py-2.5 text-sm border bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:bg-[#18181b] dark:border-[#2a2a30] dark:text-[#e0e0e0] dark:placeholder:text-zinc-600 dark:focus:border-zinc-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-zinc-600 dark:text-zinc-500">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-lg px-3 py-2.5 text-sm border bg-zinc-50 border-zinc-300 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:bg-[#18181b] dark:border-[#2a2a30] dark:text-[#e0e0e0] dark:placeholder:text-zinc-600 dark:focus:border-zinc-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-lg text-sm font-medium bg-zinc-900 hover:bg-black text-zinc-100 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 focus:outline-none select-none cursor-pointer"
          >
            <span>{submitting ? 'Signing in…' : 'Log in'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
