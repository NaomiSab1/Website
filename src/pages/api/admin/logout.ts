import type { APIRoute } from 'astro';
import { clearSessionCookies } from '../../../lib/admin.js';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  clearSessionCookies(cookies);
  return redirect('/admin/', 303);
};
