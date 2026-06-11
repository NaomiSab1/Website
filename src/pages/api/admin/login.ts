import type { APIRoute } from 'astro';
import { supabaseConfigured, anonClient, setSessionCookies } from '../../../lib/admin.js';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!supabaseConfigured) return redirect('/admin/', 303);

  const form = await request.formData();
  const email = String(form.get('email') ?? '');
  const password = String(form.get('password') ?? '');

  const { data, error } = await anonClient().auth.signInWithPassword({ email, password });
  if (error || !data?.session) {
    return redirect('/admin/?error=1', 303);
  }
  setSessionCookies(cookies, data.session);
  return redirect('/admin/', 303);
};
