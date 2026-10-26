import { createClient } from '@supabase/supabase-js';

let client;
export function blogConfig() {
  const url = process.env.VITE_BLOG_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_BLOG_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const companyId = process.env.VITE_COMPANY_ID;
  const siteUrl = process.env.VITE_SITE_URL;
  if (!url || !key || !companyId || !siteUrl || new URL(siteUrl).protocol !== 'https:') {
    throw new Error('Blog configuration missing');
  }
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return { client, companyId, siteUrl };
}
