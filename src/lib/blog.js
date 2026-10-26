export const BLOG_COLUMNS = 'id,company_id,title,heading,intro,body,status,slug,seo_title,seo_description,seo_og_image_url,published_at,created_at,updated_at';
export const BLOG_PAGE_SIZE = 9;
export const validSlug = (slug) => typeof slug === 'string' && slug.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export function safeImage(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !parsed.username && !parsed.password ? parsed.href : null;
  } catch { return null; }
}

function published(client, companyId) {
  if (!client || !companyId) throw new Error('Blog configuration missing');
  return client.from('blog_posts').select(BLOG_COLUMNS)
    .eq('company_id', companyId).eq('status', 'published');
}

async function withMedia(client, posts) {
  if (!posts.length) return [];
  const { data, error } = await client.from('blog_media')
    .select('id,post_id,file_type,url_externa,title,alt_text,sort_order,is_cover_image')
    .in('post_id', posts.map((post) => post.id)).eq('file_type', 'image')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return posts.map((post) => {
    const media = (data || []).filter((item) => item.post_id === post.id && safeImage(item.url_externa));
    return { ...post, media, cover: media.find((item) => item.is_cover_image) || null };
  });
}

export async function listPosts(client, companyId, page = 1) {
  const offset = (Math.max(1, page) - 1) * BLOG_PAGE_SIZE;
  const { data, error } = await published(client, companyId).not('slug', 'is', null)
    .order('published_at', { ascending: false }).order('id', { ascending: false })
    .range(offset, offset + BLOG_PAGE_SIZE);
  if (error) throw error;
  const rows = data || [];
  if (rows.some((post) => !validSlug(post.slug))) throw new Error('Blog slug preflight required');
  return { posts: await withMedia(client, rows.slice(0, BLOG_PAGE_SIZE)), hasNext: rows.length > BLOG_PAGE_SIZE };
}

export async function findPost(client, companyId, slug) {
  if (!validSlug(slug)) return null;
  const { data, error } = await published(client, companyId).eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data ? (await withMedia(client, [data]))[0] : null;
}

export function blogMetadata(post, siteUrl, page = 1) {
  const origin = new URL(siteUrl).origin;
  const path = post ? `/blog/${post.slug}` : `/blog${page > 1 ? `?page=${page}` : ''}`;
  return {
    title: post?.seo_title || post?.title || 'Blog | Navagli',
    description: post?.seo_description || post?.intro || post?.heading || 'Ideas e inspiración sobre reformas, interiorismo y construcción de Navagli.',
    url: `${origin}${path}`,
    image: safeImage(post?.seo_og_image_url) || safeImage(post?.cover?.url_externa),
  };
}

export const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function metadataHtml(meta) {
  const e = escapeHtml;
  return `<title>${e(meta.title)}</title>
<meta name="description" content="${e(meta.description)}" data-blog-seo>
<link rel="canonical" href="${e(meta.url)}" data-blog-seo>
<meta property="og:title" content="${e(meta.title)}" data-blog-seo>
<meta property="og:description" content="${e(meta.description)}" data-blog-seo>
<meta property="og:url" content="${e(meta.url)}" data-blog-seo>
<meta property="og:type" content="article" data-blog-seo>
${meta.image ? `<meta property="og:image" content="${e(meta.image)}" data-blog-seo>` : ''}`;
}
