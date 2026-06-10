import { createClient } from '@/lib/supabase/server';
import type { Profile } from '@/lib/types';

/** Current user's profile (id, email, role) or null. Server-side only. */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (!data) return null;
  return { ...data, email: data.email ?? user.email ?? null } as Profile;
}

export async function requireStaff(): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) throw new Error('Not authenticated');
  return profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await requireStaff();
  if (profile.role !== 'admin') throw new Error('Admin role required');
  return profile;
}
