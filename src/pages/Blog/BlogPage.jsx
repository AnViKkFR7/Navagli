import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { getBlogPosts, getBlogPost } from '../../services/blogService';
import { blogMetadata } from '../../lib/blog';
import CTASection from '../../components/CTASection/CTASection';
import NotFoundPage from '../NotFound/NotFoundPage';
import styles from './BlogPage.module.css';

function useMetadata(post, page, ready) {
  useEffect(() => {
    if (!ready) return;
    const previousTitle = document.title;
    const meta = blogMetadata(post, import.meta.env.VITE_SITE_URL || window.location.origin, page);
    document.title = meta.title;
    const previous = [...document.querySelectorAll('[data-blog-seo]')];
    previous.forEach((node) => node.remove());
    const nodes = [];
    const add = (tag, attributes) => {
      const node = document.createElement(tag);
      Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
      node.setAttribute('data-blog-seo', '');
      document.head.append(node);
      nodes.push(node);
    };
    add('meta', { name: 'description', content: meta.description });
    add('link', { rel: 'canonical', href: meta.url });
    for (const key of ['title', 'description', 'url', 'image']) {
      if (meta[key]) add('meta', { property: `og:${key}`, content: meta[key] });
    }
    return () => {
      nodes.forEach((node) => node.remove());
      // The server's initial metadata belongs to this route only.
      document.title = previous.length ? 'Navagli Inversiones y Construcciones' : previousTitle;
    };
  }, [post, page, ready]);
}

export default function BlogPage() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const { t, i18n } = useTranslation();
  const page = Math.max(1, Math.floor(Number(params.get('page')) || 1));
  const key = `${slug || ''}:${page}`;
  const [state, setState] = useState({ key: '', status: 'loading' });
  useEffect(() => {
    let cancelled = false;
    const load = slug ? getBlogPost(slug).then((post) => ({ post })) : getBlogPosts(page);
    load.then((data) => {
      if (!cancelled) setState({ key, status: 'ready', ...data });
    }).catch(() => {
      if (!cancelled) setState({ key, status: 'error' });
    });
    return () => { cancelled = true; };
  }, [slug, page, key]);
  const ready = state.key === key && state.status === 'ready';
  useMetadata(state.post, page, ready && (!slug || Boolean(state.post)));
  if (state.key !== key || state.status === 'loading') return <section className={styles.container} role="status">{t('blog.loading')}</section>;
  if (state.status === 'error') return <section className={styles.container} role="alert"><h1>{t('blog.error')}</h1><button onClick={() => window.location.reload()}>{t('blog.retry')}</button></section>;
  if (slug && !state.post) return <NotFoundPage />;
  const post = state.post;
  const date = (value) => {
    const parsed = new Date(value);
    return value && Number.isFinite(parsed.getTime()) ? parsed.toLocaleDateString(i18n.language, { dateStyle: 'long', timeZone: 'Europe/Madrid' }) : '';
  };
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.inner}>
          <p className={styles.label}>Navagli · Blog</p>
          <h1>{post ? post.title : t('blog.title')}</h1>
          {!post && <p>{t('blog.subtitle')}</p>}
          {post?.published_at && <time dateTime={post.published_at}>{date(post.published_at)}</time>}
        </div>
      </section>
      <section className={styles.content}>
        {post ? <article className={styles.article}>
          <Link to="/blog" className={styles.back}>← {t('blog.back')}</Link>
          {post.cover && <img className={styles.cover} src={post.cover.url_externa} alt={post.cover.alt_text || ''} />}
          {post.heading && <h2>{post.heading}</h2>}
          {post.intro && <p className={styles.intro}>{post.intro}</p>}
          <div className={styles.markdown}><Markdown skipHtml>{post.body || ''}</Markdown></div>
          {post.media.filter((item) => item.id !== post.cover?.id).map((item) => <figure key={item.id}>
            <img src={item.url_externa} alt={item.alt_text || ''} loading="lazy" />
            {item.title && <figcaption>{item.title}</figcaption>}
          </figure>)}
        </article> : <>
          {state.posts.length ? <div className={styles.grid}>{state.posts.map((item) => <article key={item.id} className={styles.card}>
            <Link to={`/blog/${item.slug}`}>
              {item.cover && <img src={item.cover.url_externa} alt={item.cover.alt_text || ''} loading="lazy" />}
              <div className={styles.cardBody}>
                {item.published_at && <time dateTime={item.published_at}>{date(item.published_at)}</time>}
                <h2>{item.title}</h2><p>{item.intro || item.heading}</p>
                <span>{t('blog.read')} →</span>
              </div>
            </Link>
          </article>)}</div> : <p>{t('blog.empty')}</p>}
          <nav className={styles.pagination} aria-label={t('blog.pagination')}>
            {page > 1 && <Link to={`/blog?page=${page - 1}`}>← {t('blog.previous')}</Link>}
            {state.hasNext && <Link to={`/blog?page=${page + 1}`}>{t('blog.next')} →</Link>}
          </nav>
        </>}
      </section>
      <CTASection />
    </>
  );
}
