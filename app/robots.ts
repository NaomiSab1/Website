import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sabdiaconstructions.com.au';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/preview', '/api'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
