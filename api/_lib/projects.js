import { createClient } from '@supabase/supabase-js';

export function projectsConfig() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  const siteUrl = process.env.VITE_SITE_URL;
  if (!url || !key || !siteUrl || new URL(siteUrl).protocol !== 'https:') throw new Error('Public project configuration missing');
  return { client: createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }),
    siteUrl, seoEnabled: process.env.VITE_ITEMS_SEO_ENABLED === 'true' };
}
