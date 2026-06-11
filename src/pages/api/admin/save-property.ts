import type { APIRoute } from 'astro';
import { supabaseConfigured, getAdminUser, serviceClient } from '../../../lib/admin.js';

export const prerender = false;

const str = (form: FormData, key: string) => String(form.get(key) ?? '').trim();
const num = (form: FormData, key: string, fallback = 0) => {
  const n = Number(form.get(key));
  return Number.isFinite(n) ? n : fallback;
};

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!supabaseConfigured) return redirect('/admin/', 303);
  const user = await getAdminUser(cookies);
  if (!user) return redirect('/admin/', 303);

  const form = await request.formData();
  const slug = str(form, 'slug').toLowerCase();
  const originalSlug = str(form, 'original-slug');
  const backTo = originalSlug || 'new';

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return redirect(`/admin/property/${backTo}/?error=${encodeURIComponent('Slug must be lowercase letters, numbers and dashes')}`, 303);
  }

  const features = str(form, 'features')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const gallery = str(form, 'gallery')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [src, ...altParts] = line.split('|');
      return { src: src.trim(), alt: altParts.join('|').trim() || str(form, 'name') };
    })
    .filter((g) => g.src);

  const row = {
    slug,
    name: str(form, 'name'),
    display_order: num(form, 'display_order', 10),
    status: str(form, 'status') === 'sold' ? 'sold' : 'for-sale',
    suburb: str(form, 'suburb'),
    state: 'Queensland',
    year: num(form, 'year', new Date().getFullYear()),
    beds: num(form, 'beds'),
    baths: num(form, 'baths'),
    cars: num(form, 'cars'),
    land: num(form, 'land'),
    land_over: form.get('land_over') != null,
    image: str(form, 'image'),
    focus: str(form, 'focus'),
    headline: str(form, 'headline'),
    seo_description: str(form, 'seo_description'),
    features,
    gallery,
    enquiry_heading: str(form, 'enquiry_heading'),
    enquiry_text: str(form, 'enquiry_text'),
    enquiry_button: str(form, 'enquiry_button') || 'Submit Enquiry',
    updated_at: new Date().toISOString(),
  };

  const db = serviceClient();
  let error;
  if (originalSlug) {
    ({ error } = await db.from('properties').update(row).eq('slug', originalSlug));
  } else {
    ({ error } = await db.from('properties').insert(row));
  }

  if (error) {
    return redirect(`/admin/property/${backTo}/?error=${encodeURIComponent(error.message)}`, 303);
  }
  return redirect(`/admin/?saved=${encodeURIComponent(row.name)}`, 303);
};
