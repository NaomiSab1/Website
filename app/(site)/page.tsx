import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { getPublishedPage } from '@/lib/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sabdiaconstructions.com.au';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPublishedPage('home');
  if (!page) return {};
  return {
    title: page.seo_title || page.title,
    description: page.seo_description || undefined,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description || undefined,
      images: page.og_image ? [page.og_image] : undefined,
      type: 'website',
    },
  };
}

export default async function HomePage() {
  const page = await getPublishedPage('home');
  if (!page) notFound();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#org`,
    name: 'Sabdia Constructions',
    url: SITE_URL,
    image: page.og_image || undefined,
    description: page.seo_description || undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Brisbane',
      addressRegion: 'QLD',
      addressCountry: 'AU',
    },
    foundingDate: '2013',
    areaServed: 'Brisbane, Queensland, Australia',
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlockRenderer sections={page.sections} />
    </>
  );
}
