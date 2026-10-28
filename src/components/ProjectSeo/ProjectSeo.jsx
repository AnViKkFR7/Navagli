import { useEffect } from 'react';

export default function ProjectSeo({ metadata }) {
  useEffect(() => {
    document.querySelectorAll('[data-project-seo]').forEach((node) => node.remove());
    document.title = metadata.title;
    const nodes = [];
    const add = (tag, attributes) => {
      const node = document.createElement(tag);
      for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
      node.setAttribute('data-project-seo', '');
      document.head.append(node);
      nodes.push(node);
    };
    add('meta', { name: 'description', content: metadata.description || '' });
    add('meta', { name: 'robots', content: metadata.robots || 'noindex' });
    if (metadata.url) add('link', { rel: 'canonical', href: metadata.url });
    for (const key of ['title', 'description', 'url', 'image']) {
      if (metadata[key]) add('meta', { property: `og:${key}`, content: metadata[key] });
    }
    return () => {
      nodes.forEach((node) => node.remove());
      document.title = 'Navagli Inversiones y Construcciones';
    };
  }, [metadata]);
  return null;
}
