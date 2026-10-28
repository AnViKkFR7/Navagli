import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { projectsConfig } from './_lib/projects.js';
import { findProject, listProjects, projectMetadata, projectPath, pageNumber } from '../src/lib/projects.js';
import { escapeHtml, validSlug } from '../src/lib/blog.js';
import { PROJECT_REDIRECTS } from '../src/data/projectRedirects.js';

const headers = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' };

export function renderProjectHtml(template, project, meta) {
  const e = escapeHtml;
  const works = project.attributes?.what_was_done || [];
  const description = (project.attributes?.description || project.summary || '').replace(/\\n/g, '\n');
  const images = project.media?.length ? project.media : [{ url_externa: project.cover_image, alt_text: project.cover_alt }];
  const head = `<title>${e(meta.title)}</title>
<meta name="description" content="${e(meta.description)}" data-project-seo>
<meta name="robots" content="${e(meta.robots)}" data-project-seo>
${meta.url ? `<link rel="canonical" href="${e(meta.url)}" data-project-seo><meta property="og:url" content="${e(meta.url)}" data-project-seo>` : ''}
<meta property="og:type" content="article" data-project-seo>
<meta property="og:title" content="${e(meta.title)}" data-project-seo>
<meta property="og:description" content="${e(meta.description)}" data-project-seo>
${meta.image ? `<meta property="og:image" content="${e(meta.image)}" data-project-seo>` : ''}`;
  const body = `<main style="max-width:1000px;margin:6rem auto;padding:1.5rem"><a href="/proyectos">Volver a proyectos</a><article><h1>${e(project.title)}</h1><p style="white-space:pre-line">${e(description)}</p>${works.length ? `<h2>Trabajos realizados</h2><ul>${works.map((work) => `<li>${e(work)}</li>`).join('')}</ul>` : ''}${images.map((image) => `<img src="${e(image.url_externa)}" alt="${e(image.alt_text || project.title)}" style="max-width:100%;height:auto">`).join('')}</article><a href="/contacto">Solicitar presupuesto</a></main>`;
  return template.replace(/<title>[\s\S]*?<\/title>/i, () => head)
    .replace('<div id="root"></div>', () => `<div id="root">${body}</div>`);
}

export function createProjectPage({ getConfig = projectsConfig, loadTemplate = () => readFile(join(process.cwd(), 'dist', 'index.html'), 'utf8'), redirects = PROJECT_REDIRECTS } = {}) {
  return async function GET(req) {
    try {
      const { client, siteUrl, seoEnabled } = getConfig();
      const url = new URL(req.url);
      const identifier = url.searchParams.get('identifier') || (url.pathname.startsWith('/proyectos/') ? decodeURIComponent(url.pathname.slice('/proyectos/'.length)).replace(/\/$/, '') : '');
      if (!identifier) {
        const page = pageNumber(url.searchParams.get('page'));
        const { projects, hasNext } = await listProjects(client, { page, seoEnabled });
        const template = await loadTemplate();
        const e = escapeHtml;
        const content = `<main style="max-width:1000px;margin:6rem auto;padding:1.5rem"><h1>Proyectos de Navagli</h1>${projects.map((project) => `<article><h2><a href="${e(projectPath(project, seoEnabled))}">${e(project.title)}</a></h2><p>${e(project.summary)}</p><img src="${e(project.cover_image)}" alt="${e(project.cover_alt)}" style="max-width:100%;height:auto"></article>`).join('')}${page > 1 ? `<a href="/proyectos?page=${page - 1}">Anterior</a>` : ''}${hasNext ? `<a href="/proyectos?page=${page + 1}">Siguiente</a>` : ''}</main>`;
        const html = template.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>Proyectos | Navagli</title><link rel="canonical" href="${e(new URL(siteUrl).origin)}/proyectos${page > 1 ? `?page=${page}` : ''}" data-project-seo>`)
          .replace('<div id="root"></div>', () => `<div id="root">${content}</div>`);
        return new Response(html, { headers });
      }
      const project = await findProject(client, identifier, { seoEnabled, redirects });
      if (!project) return new Response('<!doctype html><html lang="es"><head><meta name="robots" content="noindex"><title>Proyecto no encontrado | Navagli</title></head><body><h1>Proyecto no encontrado</h1><a href="/proyectos">Volver a proyectos</a></body></html>', { status: 404, headers });
      if (seoEnabled && validSlug(project.slug) && identifier !== project.slug) {
        return new Response(null, { status: 308, headers: { Location: new URL(`/proyectos/${project.slug}`, siteUrl).href, 'Cache-Control': 'no-store' } });
      }
      return new Response(renderProjectHtml(await loadTemplate(), project, projectMetadata(project, siteUrl, seoEnabled)), { headers });
    } catch {
      return new Response('<!doctype html><html lang="es"><head><meta name="robots" content="noindex"><title>Error al cargar proyectos | Navagli</title></head><body><h1>No se pueden cargar los proyectos</h1><p>Inténtalo de nuevo más tarde.</p></body></html>', { status: 503, headers });
    }
  };
}

export const GET = createProjectPage();
