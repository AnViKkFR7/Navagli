import { blogConfig } from './_lib/blog.js';
import { escapeHtml, validSlug } from '../src/lib/blog.js';

export async function GET() {
  try {
    const { client, companyId, siteUrl } = blogConfig();
    const posts = [];
    for (let offset = 0; ; offset += 500) {
      const { data, error } = await client.from('blog_posts').select('id,slug,updated_at')
        .eq('company_id', companyId).eq('status', 'published').not('slug', 'is', null)
        .order('id').range(offset, offset + 499);
      if (error) throw error;
      posts.push(...(data || []));
      if (!data || data.length < 500) break;
    }
    const origin = new URL(siteUrl).origin;
    const paths = ['/', '/reformas-integrales', '/pintura-decorativa', '/asesoramiento-profesional', '/proyectos', '/quienes-somos', '/contacto', '/blog'];
    const urls = [...paths, ...posts.filter((post) => validSlug(post.slug)).map((post) => `/blog/${post.slug}`)];
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((path) => `<url><loc>${escapeHtml(origin + path)}</loc></url>`).join('')}</urlset>`, {
      headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=60' },
    });
  } catch {
    return new Response('Sitemap unavailable', { status: 503 });
  }
}
