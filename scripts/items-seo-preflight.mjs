// Read-only. Run deliberately with the site's public anon configuration; no service-role access.
import { writeFile } from 'node:fs/promises';
import { projectsConfig } from '../api/_lib/projects.js';
import { PROJECT_COMPANY_ID, PROJECT_ITEM_TYPE, PROJECT_COLUMNS, listProjects } from '../src/lib/projects.js';
import { validSlug, safeImage } from '../src/lib/blog.js';

try {
  const { client } = projectsConfig();
  const rows = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await client.from('items').select(PROJECT_COLUMNS)
      .eq('company_id', PROJECT_COMPANY_ID).eq('item_type', PROJECT_ITEM_TYPE)
      .eq('status', 'published').order('id').range(offset, offset + 499);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < 500) break;
  }
  const seen = new Set();
  const issues = [];
  for (const row of rows) {
    const slug = row.slug?.toLowerCase();
    if (!validSlug(row.slug)) issues.push({ id: row.id, issue: 'missing_or_invalid_slug' });
    if (slug && seen.has(slug)) issues.push({ id: row.id, issue: 'duplicate_slug' });
    if (slug) seen.add(slug);
    if (!row.seo_title || row.seo_title.length > 70) issues.push({ id: row.id, issue: 'seo_title' });
    if (!row.seo_description || row.seo_description.length > 160) issues.push({ id: row.id, issue: 'seo_description' });
    if (row.seo_og_image_url && (!safeImage(row.seo_og_image_url) || row.seo_og_image_url.length > 2048)) issues.push({ id: row.id, issue: 'og_image' });
  }
  const exportIndex = process.argv.indexOf('--export');
  if (exportIndex !== -1) {
    const path = process.argv[exportIndex + 1];
    if (!path) throw new Error('Missing --export output path');
    const items = [];
    for (let page = 1; ; page++) {
      const result = await listProjects(client, { page, pageSize: 100, seoEnabled: false });
      items.push(...result.projects.map((item) => ({
        id: item.id, company_id: item.company_id, item_type: item.item_type, title: item.title, summary: item.summary,
        slug: item.slug, seo_title: item.seo_title, seo_description: item.seo_description,
        seo_og_image_url: item.seo_og_image_url, updated_at: item.updated_at,
        attributes: item.attributes, cover_image: item.cover_image, cover_alt: item.cover_alt,
      })));
      if (!result.hasNext) break;
    }
    await writeFile(path, JSON.stringify({ company_id: PROJECT_COMPANY_ID, item_type: PROJECT_ITEM_TYPE, exported_at: new Date().toISOString(), items }, null, 2));
  }
  console.log(JSON.stringify({ company_id: PROJECT_COMPANY_ID, item_type: PROJECT_ITEM_TYPE, published: rows.length, issues,
    note: 'Anon RLS limits this audit. Run the SQL audit for collisions across every item type in this company. No remote writes.' }, null, 2));
  if (issues.length) process.exitCode = 1;
} catch (error) {
  console.error('Items SEO preflight failed:', error.message);
  process.exitCode = 1;
}
