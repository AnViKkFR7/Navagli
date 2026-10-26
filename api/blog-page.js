import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import { blogConfig } from './_lib/blog.js';
import { listPosts, findPost, blogMetadata, metadataHtml, escapeHtml } from '../src/lib/blog.js';

export function renderBlogHtml(template, post, result, meta, page = 1) {
  const e = escapeHtml;
  const content = post
    ? `<article><h1>${e(post.title)}</h1>${post.heading ? `<h2>${e(post.heading)}</h2>` : ''}<p>${e(post.intro)}</p>${post.cover ? `<img src="${e(post.cover.url_externa)}" alt="${e(post.cover.alt_text)}">` : ''}${renderToStaticMarkup(createElement(Markdown, { skipHtml: true }, post.body || ''))}</article>`
    : `<h1>Blog Navagli</h1>${result.posts.map((item) => `<article><h2><a href="/blog/${e(item.slug)}">${e(item.title)}</a></h2><p>${e(item.intro || item.heading)}</p></article>`).join('')}${page > 1 ? `<a href="/blog?page=${page - 1}">Anterior</a>` : ''}${result.hasNext ? `<a href="/blog?page=${page + 1}">Siguiente</a>` : ''}`;
  return template.replace(/<title>[\s\S]*?<\/title>/i, () => metadataHtml(meta))
    .replace('<div id="root"></div>', () => `<div id="root"><main style="max-width:1000px;margin:100px auto;padding:24px">${content}</main></div>`);
}

export async function GET(req) {
  try {
    const { client, companyId, siteUrl } = blogConfig();
    const url = new URL(req.url);
    const slug = url.searchParams.get('slug') || (url.pathname.startsWith('/blog/') ? url.pathname.slice(6).replace(/\/$/, '') : '');
    const page = Math.max(1, Math.floor(Number(url.searchParams.get('page')) || 1));
    const post = slug ? await findPost(client, companyId, slug) : null;
    if (slug && !post) {
      return new Response('<!doctype html><html lang="es"><meta name="robots" content="noindex"><title>Artículo no encontrado | Navagli</title><h1>Artículo no encontrado</h1><a href="/blog">Volver al blog</a></html>', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    const result = post ? null : await listPosts(client, companyId, page);
    const meta = blogMetadata(post, siteUrl, page);
    // Both crawlers and visitors receive real content before the SPA loads.
    const template = await readFile(join(process.cwd(), 'dist', 'index.html'), 'utf8');
    const html = renderBlogHtml(template, post, result, meta, page);
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60' } });
  } catch {
    return new Response('No se puede cargar el blog. Inténtalo de nuevo más tarde.', { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
