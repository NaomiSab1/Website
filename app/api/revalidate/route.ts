import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

/**
 * External cache busting, e.g. after editing content directly in Supabase.
 * POST /api/revalidate  { "secret": "...", "tags": ["page:home", "site-settings"] }
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!process.env.REVALIDATE_SECRET || body.secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }
  const tags: string[] = Array.isArray(body.tags) ? body.tags : [];
  tags.forEach((tag) => revalidateTag(String(tag)));
  return NextResponse.json({ revalidated: tags });
}
