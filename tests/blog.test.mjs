import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { listPosts, findPost, blogMetadata, validSlug } from '../src/lib/blog.js';
import { renderBlogHtml, GET as blogPage } from '../api/blog-page.js';
import { GET as sitemap } from '../api/sitemap.js';

const companyId = '0aad4a59-d6ee-47c9-bb9e-da5e2bb3fb48';
const posts = [
  { id: '1', company_id: companyId, status: 'published', slug: 'reforma-cocina', title: 'Cocina <script>', body: '**Hola**\n\n<script>alert(1)</script>\n\n[mal](javascript:alert%281%29)', intro: 'Ideas & materiales', published_at: '2026-10-26' },
  { id: '2', company_id: companyId, status: 'draft', slug: 'borrador' },
  { id: '3', company_id: 'another-company', status: 'published', slug: 'otra-empresa' },
  { id: '4', company_id: companyId, status: 'published', slug: null },
];
let failed = false;
const requests = [];
globalThis.fetch = async (url, options) => {
  const parsed = new URL(url);
  requests.push(parsed);
  assert.equal(new Headers(options.headers).get('apikey'), 'public-anon-key');
  if (failed) return Response.json({ message: 'Unavailable' }, { status: 500 });
  const query = parsed.searchParams;
  if (parsed.pathname.endsWith('/blog_posts')) {
    assert.equal(query.get('company_id'), `eq.${companyId}`);
    assert.equal(query.get('status'), 'eq.published');
    let rows = posts.filter((post) => post.company_id === companyId && post.status === 'published');
    if (query.get('slug') === 'not.is.null') rows = rows.filter((post) => post.slug !== null);
    else if (query.get('slug')?.startsWith('eq.')) rows = rows.filter((post) => post.slug === query.get('slug').slice(3));
    if (new Headers(options.headers).get('accept')?.includes('object+json')) return rows.length ? Response.json(rows[0]) : new Response(null, { status: 406 });
    return Response.json(rows);
  }
  if (parsed.pathname.endsWith('/blog_media')) {
    assert.equal(query.get('post_id'), 'in.(1)');
    assert.equal(query.get('file_type'), 'eq.image');
    return Response.json([{ id: 'cover', post_id: '1', is_cover_image: true, url_externa: 'https://example.com/cover.jpg', alt_text: 'Cocina renovada' }]);
  }
  throw new Error('Unexpected request');
};
const client = createClient('https://example.supabase.co', 'public-anon-key');

test('public blog isolates company and publication state and loads media only for returned posts', async () => {
  const result = await listPosts(client, companyId);
  assert.equal(result.posts.length, 1);
  assert.equal(result.posts[0].cover.alt_text, 'Cocina renovada');
  assert.equal(result.hasNext, false);
  assert.equal((await findPost(client, companyId, 'reforma-cocina')).slug, 'reforma-cocina');
  for (const slug of ['borrador', 'otra-empresa', 'inexistente', '../draft', 'No valido']) assert.equal(await findPost(client, companyId, slug), null);
  await listPosts(client, companyId, 2);
  assert.equal(requests.filter((url) => url.pathname.endsWith('/blog_posts')).at(-1).searchParams.get('offset'), '9');
  failed = true;
  await assert.rejects(listPosts(client, companyId));
  failed = false;
});

test('initial HTML contains escaped SEO, canonical, real content and safe Markdown', () => {
  const post = { ...posts[0], cover: { url_externa: 'https://example.com/cover.jpg', alt_text: 'Cocina "nueva"' }, seo_title: 'Reforma "ideal"', seo_og_image_url: 'javascript:alert(1)' };
  const meta = blogMetadata(post, 'https://navagli.com');
  const html = renderBlogHtml('<html><head><title>Old</title></head><body><div id="root"></div><script src="/assets/app.js"></script></body></html>', post, null, meta);
  assert.ok(html.includes('<title>Reforma &quot;ideal&quot;</title>'));
  assert.ok(html.includes('rel="canonical" href="https://navagli.com/blog/reforma-cocina"'));
  assert.ok(html.includes('property="og:image" content="https://example.com/cover.jpg"'));
  assert.ok(html.includes('<strong>Hola</strong>'));
  assert.ok(html.includes('Cocina &lt;script&gt;'));
  assert.ok(!html.includes('href="javascript:'));
  assert.ok(!html.includes('<script>alert(1)'));
  assert.ok(html.includes('src="/assets/app.js"'));
  assert.equal(validSlug(null), false, 'legacy published posts without a slug fail preflight');
});

test('unpublished and foreign slugs return HTTP 404; sitemap contains only published company posts', async () => {
  process.env.VITE_BLOG_SUPABASE_URL = 'https://example.supabase.co';
  process.env.VITE_BLOG_SUPABASE_ANON_KEY = 'public-anon-key';
  process.env.VITE_COMPANY_ID = companyId;
  process.env.VITE_SITE_URL = 'https://navagli.com';
  for (const slug of ['borrador', 'otra-empresa', 'inexistente']) {
    assert.equal((await blogPage(new Request(`https://navagli.com/blog/${slug}`))).status, 404);
  }
  const response = await sitemap();
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.ok(xml.includes('https://navagli.com/blog/reforma-cocina'));
  assert.ok(!xml.includes('borrador'));
  assert.ok(!xml.includes('otra-empresa'));
  assert.ok(!xml.includes('/null'));
});
