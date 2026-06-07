const FALLBACK = [
  { key: 'location',          value: 'Brisbane, Queensland, Australia' },
  { key: 'instagram_url',     value: 'https://www.instagram.com/_sabdia/' },
  { key: 'instagram_handle',  value: '@_sabdia' },
  { key: 'facebook_url',      value: 'https://www.facebook.com/sabdiaconstructions/' },
  { key: 'facebook_label',    value: 'Sabdia Constructions' },
  { key: 'linkedin_url',      value: 'https://www.linkedin.com/company/sabdia-constructions/' },
  { key: 'linkedin_label',    value: 'Sabdia Constructions' },
  { key: 'website_url',       value: 'https://www.sabdiaconstructions.com.au' },
  { key: 'copyright_year',    value: '2025' },
  { key: 'company_name',      value: 'Sabdia Constructions Pty Ltd' },
  { key: 'footer_tagline',    value: 'Boutique luxury home builder & developer delivering award-winning residences across inner Brisbane since 2013.' },
  { key: 'vercel_deploy_hook', value: '' }
];

module.exports = async function () {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return FALLBACK;
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('site_settings').select('*');
    if (error) throw error;
    return data && data.length > 0 ? data : FALLBACK;
  } catch (err) {
    console.warn('[settings] Supabase fetch failed, using fallback:', err.message);
    return FALLBACK;
  }
};
