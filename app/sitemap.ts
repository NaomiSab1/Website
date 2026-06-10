import type { MetadataRoute } from 'next';
import { getPublishedSlugs } from '@/lib/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sabdiaconstructions.com.au';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getPublishedSlugs();
  return pages.map((p) => ({
    url: p.slug === 'home' ? SITE_URL : `${SITE_URL}/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : undefined,
    changeFrequency: 'weekly',
    priority: p.slug === 'home' ? 1 : 0.7,
  }));
}
