import { createClient } from '@/lib/supabase/server';
import { MediaLibrary } from '@/components/admin/MediaLibrary.client';
import type { MediaItem } from '@/lib/types';

export default async function MediaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);
  return (
    <div>
      <div className="adm-head">
        <h1>Media library</h1>
        <p className="adm-sub">Images are compressed automatically on upload. Always add alt text.</p>
      </div>
      <MediaLibrary initial={(data ?? []) as MediaItem[]} />
    </div>
  );
}
