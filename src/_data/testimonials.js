const FALLBACK = [
  {
    id: 1,
    quote: 'Sabdia delivered a home that exceeded every expectation. Their integrated approach — from design through to construction — meant every detail was perfectly executed. A truly exceptional result that we will treasure for generations.',
    attribution: 'Satisfied Client — Inner Brisbane Residence',
    is_active: true,
    sort_order: 1
  }
];

module.exports = async function () {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) return FALLBACK;
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('testimonials').select('*').order('sort_order');
    if (error) throw error;
    return data && data.length > 0 ? data : FALLBACK;
  } catch (err) {
    console.warn('[testimonials] Supabase fetch failed, using fallback:', err.message);
    return FALLBACK;
  }
};
