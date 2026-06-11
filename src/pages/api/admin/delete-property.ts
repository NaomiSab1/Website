import type { APIRoute } from 'astro';
import { supabaseConfigured, getAdminUser, serviceClient } from '../../../lib/admin.js';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!supabaseConfigured) return redirect('/admin/', 303);
  const user = await getAdminUser(cookies);
  if (!user) return redirect('/admin/', 303);

  const form = await request.formData();
  const slug = String(form.get('slug') ?? '');
  if (!slug) return redirect('/admin/', 303);

  const { error } = await serviceClient().from('properties').delete().eq('slug', slug);
  if (error) {
    return redirect(`/admin/property/${encodeURIComponent(slug)}/?error=${encodeURIComponent(error.message)}`, 303);
  }
  return redirect(`/admin/?deleted=${encodeURIComponent(slug)}`, 303);
};
