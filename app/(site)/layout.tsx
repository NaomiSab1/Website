import { getSiteSettings } from '@/lib/queries';
import { Header } from '@/components/site/Header';
import { Footer } from '@/components/site/Footer';

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const theme = settings.theme ?? { colors: {}, fonts: { display: 'Fraunces', body: 'Inter Tight' } };
  const vars = Object.entries(theme.colors ?? {})
    .map(([k, v]) => `--${k}: ${v};`)
    .join(' ');
  const fontVars = `--font-display: '${theme.fonts.display}', serif; --font-body: '${theme.fonts.body}', sans-serif;`;
  return (
    <div className="site">
      <style>{`:root { ${vars} ${fontVars} }`}</style>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
