/**
 * Admin auth + data helpers (server-side only).
 *
 * Sessions are Supabase Auth sessions stored in httpOnly cookies.
 * Admin users are created in the Supabase dashboard:
 * Authentication → Users → Add user.
 */
import { createClient } from '@supabase/supabase-js';

const env = (key) => import.meta.env[key] ?? process.env[key];

const url = env('SUPABASE_URL');
const anonKey = env('SUPABASE_ANON_KEY');
const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY');

export const supabaseConfigured = Boolean(url && anonKey);
export const writesConfigured = Boolean(url && serviceKey);

const clientOpts = { auth: { persistSession: false, autoRefreshToken: false } };

export function anonClient() {
  return createClient(url, anonKey, clientOpts);
}

/** Full-access client for admin writes. Only call after verifying a user. */
export function serviceClient() {
  return createClient(url, serviceKey, clientOpts);
}

const ACCESS_COOKIE = 'sb-access';
const REFRESH_COOKIE = 'sb-refresh';

export function setSessionCookies(cookies, session) {
  const opts = { path: '/', httpOnly: true, secure: true, sameSite: 'lax' };
  cookies.set(ACCESS_COOKIE, session.access_token, { ...opts, maxAge: session.expires_in ?? 3600 });
  cookies.set(REFRESH_COOKIE, session.refresh_token, { ...opts, maxAge: 60 * 60 * 24 * 30 });
}

export function clearSessionCookies(cookies) {
  cookies.delete(ACCESS_COOKIE, { path: '/' });
  cookies.delete(REFRESH_COOKIE, { path: '/' });
}

/** Returns the logged-in admin user, refreshing the session if needed. */
export async function getAdminUser(cookies) {
  if (!supabaseConfigured) return null;
  const access = cookies.get(ACCESS_COOKIE)?.value;
  const refresh = cookies.get(REFRESH_COOKIE)?.value;
  if (!access && !refresh) return null;

  const supa = anonClient();
  if (access) {
    const { data, error } = await supa.auth.getUser(access);
    if (!error && data?.user) return data.user;
  }
  if (refresh) {
    const { data, error } = await supa.auth.refreshSession({ refresh_token: refresh });
    if (!error && data?.session) {
      setSessionCookies(cookies, data.session);
      return data.session.user;
    }
  }
  return null;
}
