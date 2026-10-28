import { safeImage, validSlug } from './blog.js';

// Fixed scope of the existing public catalogue. Never take these values from a visitor.
export const PROJECT_COMPANY_ID = 'b58a5ab9-dd4a-4bbe-8289-2cf3a134e49a';
export const PROJECT_ITEM_TYPE = 'proyecto-reforma-navagli';
export const PROJECT_COLUMNS = 'id,company_id,title,summary,item_type,status,slug,seo_title,seo_description,seo_og_image_url,created_at,updated_at';
export const PROJECT_PAGE_SIZE = 12;
export const isUuid = (value) => typeof value === 'string' && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(value);
export const pageNumber = (value) => Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : 1;

export function projectPath(project, seoEnabled) {
  return `/proyectos/${seoEnabled && validSlug(project.slug) ? project.slug : project.id}`;
}

function published(client, columns = PROJECT_COLUMNS) {
  if (!client) throw new Error('Public project configuration missing');
  return client.from('items').select(columns).eq('company_id', PROJECT_COMPANY_ID)
    .eq('item_type', PROJECT_ITEM_TYPE).eq('status', 'published');
}

export function publicImage(url) {
  if (typeof url === 'string' && /^\/img\/[a-z0-9_.-]+$/i.test(url)) return url;
  return safeImage(url);
}

async function enrich(client, items) {
  if (!items.length) return [];
  const ids = items.map((item) => item.id);
  const [attributes, media] = await Promise.all([
    client.from('attribute_values')
      .select('item_id,value_text,value_text_array,attribute_definitions!inner(key,data_type,company_id,item_type)')
      .in('item_id', ids).eq('attribute_definitions.company_id', PROJECT_COMPANY_ID)
      .eq('attribute_definitions.item_type', PROJECT_ITEM_TYPE)
      .in('attribute_definitions.key', ['description', 'what_was_done']),
    client.from('item_media').select('id,item_id,file_type,url_externa,title,alt_text,sort_order,is_cover')
      .in('item_id', ids).eq('file_type', 'image').order('sort_order', { ascending: true }),
  ]);
  if (attributes.error) throw attributes.error;
  if (media.error) throw media.error;
  return items.map((item) => {
    const values = {};
    for (const row of attributes.data || []) {
      if (row.item_id !== item.id) continue;
      const key = row.attribute_definitions?.key;
      if (key === 'description' && typeof row.value_text === 'string') values.description = row.value_text;
      if (key === 'what_was_done' && Array.isArray(row.value_text_array)) {
        values.what_was_done = row.value_text_array.filter((value) => typeof value === 'string');
      }
    }
    const images = (media.data || []).filter((image) => image.item_id === item.id && publicImage(image.url_externa));
    const cover = images.find((image) => image.is_cover) || images[0];
    return { ...item, location: item.summary, attributes: values, media: images,
      cover_image: cover?.url_externa || '/img/landing-image1.jpg', cover_alt: cover?.alt_text || item.title,
      images: images.map((image) => image.url_externa), image_alts: images.map((image) => image.alt_text || item.title) };
  });
}

export async function listProjects(client, { page = 1, pageSize = PROJECT_PAGE_SIZE, seoEnabled = false } = {}) {
  const offset = (pageNumber(page) - 1) * pageSize;
  let query = published(client);
  if (seoEnabled) query = query.not('slug', 'is', null);
  const { data, error } = await query.order('created_at', { ascending: false })
    .order('id', { ascending: false }).range(offset, offset + pageSize);
  if (error) throw error;
  const rows = data || [];
  if (seoEnabled && rows.some((item) => !validSlug(item.slug))) throw new Error('Items SEO preflight required');
  return { projects: await enrich(client, rows.slice(0, pageSize)), hasNext: rows.length > pageSize };
}

export async function findProject(client, identifier, { seoEnabled = false, redirects = {} } = {}) {
  const uuid = isUuid(identifier);
  if (!uuid && (!seoEnabled || !validSlug(identifier))) return null;
  const { data, error } = await published(client).eq(uuid ? 'id' : 'slug', identifier).maybeSingle();
  if (error) throw error;
  if (data) return (await enrich(client, [data]))[0];
  // Former slugs point to IDs; unpublishing the destination also removes the redirect.
  const aliasId = Object.hasOwn(redirects, identifier) ? redirects[identifier] : null;
  return !uuid && isUuid(aliasId) ? findProject(client, aliasId, { seoEnabled }) : null;
}

export async function projectSitemapPaths(client, seoEnabled) {
  if (!seoEnabled) return [];
  const paths = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await published(client, 'id,slug').not('slug', 'is', null)
      .order('id').range(offset, offset + 499);
    if (error) throw error;
    for (const item of data || []) if (validSlug(item.slug)) paths.push(`/proyectos/${item.slug}`);
    if (!data || data.length < 500) return paths;
  }
}

export function projectMetadata(project, siteUrl, seoEnabled) {
  const origin = new URL(siteUrl).origin;
  const indexable = seoEnabled && validSlug(project.slug) && project.status === 'published';
  return { title: project.seo_title || project.title,
    description: project.seo_description || project.summary || '',
    url: indexable ? `${origin}/proyectos/${project.slug}` : null,
    image: safeImage(project.seo_og_image_url) || safeImage(project.cover_image),
    robots: indexable ? 'index,follow' : 'noindex,follow' };
}
