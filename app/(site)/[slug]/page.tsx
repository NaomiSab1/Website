import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { getPublishedPage, getPublishedSlugs } from '@/lib/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.sabdiaconstructions.com.au';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedSlugs();
    return slugs.filter((s) => s.slug !== 'home').map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) return {};
  return {
    title: page.seo_title || `${page.title} | Sabdia Constructions`,
    description: page.seo_description || undefined,
    alternates: { canonical: `${SITE_URL}/${slug}` },
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description || undefined,
      images: page.og_image ? [page.og_image] : undefined,
    },
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  if (slug === 'home') notFound(); // canonical home is "/"
  const page = await getPublishedPage(slug);
  if (!page) notFound();
  return <BlockRenderer sections={page.sections} />;
}
