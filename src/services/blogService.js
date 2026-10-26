import { createClient } from '@supabase/supabase-js';
import { listPosts, findPost } from '../lib/blog.js';

const url = import.meta.env.VITE_BLOG_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_BLOG_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
const client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
const companyId = import.meta.env.VITE_COMPANY_ID;

export const getBlogPosts = (page) => listPosts(client, companyId, page);
export const getBlogPost = (slug) => findPost(client, companyId, slug);
