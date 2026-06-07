const FALLBACK = [
  { key: 'years',      value: 10,  suffix: '+',  label: 'Years in Brisbane' },
  { key: 'residences', value: 100, suffix: '+',  label: 'Residences Delivered' },
  { key: 'awards',     value: 5,   suffix: '★',  label: 'Multi-Award Winning' },
  { key: 'inhouse',    value: 100, suffix: '%',  label: 'In-House Delivery', no_counter: true }
];

module.exports = async function () {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return FALLBACK;
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('stats').select('*').order('sort_order');
    if (error) throw error;
    return data && data.length > 0 ? data : FALLBACK;
  } catch (err) {
    console.warn('[stats] Supabase fetch failed, using fallback:', err.message);
    return FALLBACK;
  }
};
