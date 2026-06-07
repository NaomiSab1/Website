// Expose select env vars to Nunjucks templates (used by admin panel)
module.exports = {
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
};
