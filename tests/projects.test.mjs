import test from 'node:test';
import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { PROJECT_COMPANY_ID, PROJECT_ITEM_TYPE, listProjects, findProject, projectMetadata, projectSitemapPaths, publicImage, pageNumber } from '../src/lib/projects.js';
import { createProjectPage } from '../api/project-page.js';
import { GET as sitemap } from '../api/sitemap.js';

const ids = Array.from({ length: 20 }, (_, i) => `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`);
const base = { company_id: PROJECT_COMPANY_ID, item_type: PROJECT_ITEM_TYPE, status: 'published', title: 'Reforma & diseño', summary: 'Resumen público', created_at: '2026-01-01' };
let items = [
  { ...base, id: ids[0], slug: 'reforma-cocina', seo_title: 'Título "SEO"', seo_description: 'Descripción <segura>', seo_og_image_url: 'https://example.com/og.jpg' },
  { ...base, id: ids[1], slug: 'reforma-fallback', seo_og_image_url: 'javascript:alert(1)' },
  { ...base, id: ids[2], slug: null },
  { ...base, id: ids[3], slug: 'draft', status: 'draft' },
  { ...base, id: ids[4], slug: 'archived', status: 'archived' },
  { ...base, id: ids[5], slug: 'foreign', company_id: 'other-company' },
  { ...base, id: ids[6], slug: 'other-type', item_type: 'another-type' },
];
let failTable = null;
const requests = [];
async function fakeFetch(url, options) {
  const parsed = new URL(url);
  const table = parsed.pathname.split('/').at(-1);
  const q = parsed.searchParams;
  requests.push({ table, query: q });
  assert.equal(new Headers(options.headers).get('apikey'), 'anon-public-test');
  if (failTable === table) return Response.json({ message: 'Database unavailable' }, { status: 500 });
  if (table === 'items') {
    assert.equal(q.get('company_id'), `eq.${PROJECT_COMPANY_ID}`);
    assert.equal(q.get('item_type'), `eq.${PROJECT_ITEM_TYPE}`);
    assert.equal(q.get('status'), 'eq.published');
    let result = items.filter((item) => item.company_id === PROJECT_COMPANY_ID && item.item_type === PROJECT_ITEM_TYPE && item.status === 'published');
    if (q.get('id')) result = result.filter((item) => item.id === q.get('id').slice(3));
    if (q.get('slug') === 'not.is.null') result = result.filter((item) => item.slug !== null);
    else if (q.get('slug')) result = result.filter((item) => item.slug === q.get('slug').slice(3));
    const offset = Number(q.get('offset') || 0);
    result = result.slice(offset, offset + Number(q.get('limit') || 500));
    return Response.json(result);
  }
  if (table === 'attribute_values' || table === 'item_media') {
    const requested = (q.get('item_id') || '').slice(4, -1).split(',');
    assert.ok(requested.every((id) => items.some((item) => item.id === id && item.company_id === PROJECT_COMPANY_ID && item.item_type === PROJECT_ITEM_TYPE && item.status === 'published')));
    if (table === 'attribute_values') {
      assert.equal(q.get('attribute_definitions.company_id'), `eq.${PROJECT_COMPANY_ID}`);
      assert.equal(q.get('attribute_definitions.item_type'), `eq.${PROJECT_ITEM_TYPE}`);
      assert.equal(q.get('attribute_definitions.key'), 'in.(description,what_was_done)');
      return Response.json(requested.flatMap((item_id) => [
        { item_id, attribute_definitions: { key: 'description' }, value_text: 'Descripción pública <script>alert(1)</script>' },
        { item_id, attribute_definitions: { key: 'what_was_done' }, value_text_array: ['Pintura', 'Cocina'] },
        { item_id, attribute_definitions: { key: 'private_note' }, value_text: 'NEVER EXPOSE' },
      ]));
    }
    assert.equal(q.get('file_type'), 'eq.image');
    return Response.json(requested.flatMap((item_id) => [
      { id: 'cover', item_id, is_cover: true, url_externa: 'https://example.com/cover.jpg', alt_text: 'Cocina "renovada"' },
      { id: 'bad', item_id, url_externa: 'javascript:alert(1)' },
    ]));
  }
  if (table === 'blog_posts') return Response.json([]);
  throw new Error(`Unexpected table ${table}`);
}
const client = createClient('https://example.supabase.co', 'anon-public-test', { global: { fetch: fakeFetch } });
const template = '<!doctype html><html lang="es"><head><title>Navagli</title></head><body><div id="root"></div><script src="/assets/app.js"></script></body></html>';
const handler = (seoEnabled = true) => createProjectPage({ getConfig: () => ({ client, siteUrl: 'https://navagli.com', seoEnabled }), loadTemplate: async () => template });
const request = (path) => new Request(`https://navagli.com${path}`);

test('published queries isolate tenant, type and state, restrict media/attributes, and paginate', async () => {
  const result = await listProjects(client, { seoEnabled: true, pageSize: 1 });
  assert.equal(result.projects.length, 1);
  assert.equal(result.hasNext, true);
  assert.equal(result.projects[0].cover_alt, 'Cocina "renovada"');
  assert.equal(result.projects[0].images.length, 1);
  assert.equal('private_note' in result.projects[0].attributes, false);
  const page = await listProjects(client, { seoEnabled: true, page: 2, pageSize: 1 });
  assert.equal(page.projects[0].id, ids[1]);
  for (const identifier of ['draft', 'archived', 'foreign', 'other-type', 'missing', ...ids.slice(3, 7)]) {
    assert.equal(await findProject(client, identifier, { seoEnabled: true }), null);
  }
  assert.equal(publicImage('javascript:alert(1)'), null);
  assert.equal(publicImage('//evil.com/a.jpg'), null);
  assert.equal(pageNumber('Infinity'), 1);
});

test('initial HTTP HTML has complete SEO, escaped equivalent content, alt and fallbacks', async () => {
  const response = await handler()(request('/proyectos/reforma-cocina'));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const html = await response.text();
  assert.match(html, /<title>Título &quot;SEO&quot;<\/title>/);
  assert.match(html, /name="description" content="Descripción &lt;segura&gt;"/);
  assert.match(html, /rel="canonical" href="https:\/\/navagli.com\/proyectos\/reforma-cocina"/);
  for (const key of ['title', 'description', 'url', 'image']) assert.ok(html.includes(`property="og:${key}"`));
  assert.match(html, /name="robots" content="index,follow"/);
  assert.match(html, /<li>Pintura<\/li>/);
  assert.match(html, /alt="Cocina &quot;renovada&quot;"/);
  assert.ok(!html.includes('<script>alert(1)'));
  assert.ok(!html.includes('NEVER EXPOSE'));
  const fallback = await handler()(request('/proyectos/reforma-fallback'));
  const fallbackHtml = await fallback.text();
  assert.ok(fallbackHtml.includes('<title>Reforma &amp; diseño</title>'));
  assert.ok(fallbackHtml.includes('name="description" content="Resumen público"'));
  assert.ok(fallbackHtml.includes('property="og:image" content="https://example.com/cover.jpg"'));
  const meta = projectMetadata({ ...base, cover_image: '/img/landing-image1.jpg' }, 'https://navagli.com', true);
  assert.equal(meta.image, null);
  assert.equal(meta.url, null);
});

test('UUIDs redirect permanently and unpublished or invalid identifiers return genuine 404/noindex', async () => {
  const redirect = await handler()(request(`/proyectos/${ids[0]}?company_id=forged`));
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('location'), 'https://navagli.com/proyectos/reforma-cocina');
  for (const slug of ['draft', 'archived', 'foreign', 'other-type', 'missing', '%3Cscript%3E']) {
    const response = await handler()(request(`/proyectos/${slug}`));
    assert.equal(response.status, 404);
    assert.match(await response.text(), /name="robots" content="noindex"/);
  }
  const previous = await findProject(client, 'previous-slug', { seoEnabled: true, redirects: { 'previous-slug': ids[0] } });
  assert.equal(previous.id, ids[0]);
  const aliasHandler = createProjectPage({ getConfig: () => ({ client, siteUrl: 'https://navagli.com', seoEnabled: true }), loadTemplate: async () => template,
    redirects: { 'previous-slug': ids[0], 'previous-draft': ids[3] } });
  const aliasResponse = await aliasHandler(request('/proyectos/previous-slug'));
  assert.equal(aliasResponse.status, 308);
  assert.equal(aliasResponse.headers.get('location'), 'https://navagli.com/proyectos/reforma-cocina');
  assert.equal((await aliasHandler(request('/proyectos/previous-draft'))).status, 404);
  assert.equal(await findProject(client, 'previous-draft', { seoEnabled: true, redirects: { 'previous-draft': ids[3] } }), null);
});

test('rollout gate retains published UUID pages without indexing before metadata approval', async () => {
  const legacy = await handler(false)(request(`/proyectos/${ids[0]}`));
  assert.equal(legacy.status, 200);
  const html = await legacy.text();
  assert.ok(html.includes('noindex,follow'));
  assert.ok(!html.includes('rel="canonical"'));
  assert.equal((await handler(false)(request('/proyectos/reforma-cocina'))).status, 404);
  assert.deepEqual(await projectSitemapPaths(client, false), []);
  const missingSlug = await handler()(request(`/proyectos/${ids[2]}`));
  assert.equal(missingSlug.status, 200);
  assert.ok((await missingSlug.text()).includes('noindex,follow'));
});

test('database/media/attribute errors are 503/noindex, never mocks, empty success or 404', async () => {
  for (const table of ['items', 'item_media', 'attribute_values']) {
    failTable = table;
    const response = await handler()(request('/proyectos/reforma-cocina'));
    assert.equal(response.status, 503);
    assert.ok((await response.text()).includes('noindex'));
    await assert.rejects(listProjects(client));
  }
  failTable = null;
  const original = items;
  items = [...items, { ...base, id: ids[7], slug: 'BAD SLUG' }];
  await assert.rejects(listProjects(client, { seoEnabled: true }), /preflight/);
  items = [];
  const before = requests.length;
  assert.deepEqual(await listProjects(client), { projects: [], hasNext: false });
  assert.deepEqual(requests.slice(before).map((entry) => entry.table), ['items']);
  items = original;
});

test('sitemap and next request reflect archival and slug changes without cached stale results', async () => {
  globalThis.fetch = fakeFetch;
  process.env.VITE_ITEMS_SEO_ENABLED = 'true';
  process.env.VITE_SITE_URL = 'https://navagli.com';
  process.env.VITE_COMPANY_ID = PROJECT_COMPANY_ID;
  process.env.VITE_SUPABASE_URL = 'https://example.supabase.co';
  process.env.VITE_SUPABASE_ANON_KEY = 'anon-public-test';
  const response = await sitemap();
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.ok(xml.includes('/proyectos/reforma-cocina'));
  for (const excluded of ['draft', 'archived', 'foreign', 'other-type', ids[0], '/null']) assert.ok(!xml.includes(excluded));
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const original = items;
  items = items.map((item) => item.id === ids[0] ? { ...item, status: 'archived' } : item.id === ids[1] ? { ...item, slug: 'nuevo-slug' } : item);
  assert.equal((await handler()(request('/proyectos/reforma-cocina'))).status, 404);
  const updated = await (await sitemap()).text();
  assert.ok(!updated.includes('reforma-cocina'));
  assert.ok(!updated.includes('reforma-fallback'));
  assert.ok(updated.includes('nuevo-slug'));
  const redirect = await handler()(request(`/proyectos/${ids[1]}`));
  assert.equal(redirect.headers.get('location'), 'https://navagli.com/proyectos/nuevo-slug');
  items = original;
});
