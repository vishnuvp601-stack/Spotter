import type { User } from '../types';

// These are deliberately per-device preferences (NOT synced via Supabase):
// which profile this device defaults to viewing, and this browser's theme.
// Unlike workout data, it's normal and expected for these to differ per device.

const ACTIVE_USER_KEY = 'spotter_active_user';
const THEME_KEY = 'spotter_theme';

export function getStoredActiveUser(): User {
  try {
    const stored = localStorage.getItem(ACTIVE_USER_KEY);
    if (stored === 'vishnu' || stored === 'amy') return stored;
  } catch {
    // localStorage unavailable - fall through to default
  }
  return 'vishnu';
}

export function setStoredActiveUser(user: User): void {
  try {
    localStorage.setItem(ACTIVE_USER_KEY, user);
  } catch {
    // non-critical device preference, safe to ignore
  }
}

export function getStoredTheme(): 'dark' | 'light' {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
  } catch {
    // ignore
  }
  return 'dark';
}

export function setStoredTheme(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}
