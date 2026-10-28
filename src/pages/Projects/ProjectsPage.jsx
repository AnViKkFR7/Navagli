import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import ProjectGrid from '../../components/ProjectGrid/ProjectGrid';
import { getProjects } from '../../services/projectsService';
import styles from './ProjectsPage.module.css';
import { pageNumber } from '../../lib/projects';
import ProjectSeo from '../../components/ProjectSeo/ProjectSeo';

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const page = pageNumber(params.get('page'));
  const [state, setState] = useState({ page: null, status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    getProjects(page).then((data) => {
      if (!cancelled) setState({ page, status: 'ready', ...data });
    }).catch(() => {
      if (!cancelled) setState({ page, status: 'error' });
    });
    return () => { cancelled = true; };
  }, [page]);
  const loading = state.page !== page;

  return (
    <>
      <ProjectSeo metadata={{ title: 'Proyectos | Navagli', description: '',
        robots: !loading && state.status === 'error' ? 'noindex' : 'index,follow',
        url: `${new URL(import.meta.env.VITE_SITE_URL || window.location.origin).origin}/proyectos${page > 1 ? `?page=${page}` : ''}` }} />
      {/* Page hero */}
      <section id="page-hero" className={styles.pageHero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>
            {t('projects.sectionLabel')}
          </p>
          <h1 className={styles.heroTitle}>
            {t('projects.title')}
          </h1>
        </div>
      </section>

      {/* Grid */}
      <section id="projects-grid-section" className={styles.gridSection}>
        <div className={styles.gridInner}>
          {loading ? (
            <div className={styles.skeletonGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonItem}>
                  <div className={styles.skeletonImg} />
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonSubtitle} />
                </div>
              ))}
            </div>
          ) : state.status === 'error' ? (
            <div role="alert"><p>{t('projects.loadError')}</p><button onClick={() => window.location.reload()}>{t('projects.retry')}</button></div>
          ) : (
            <>
              {state.projects.length ? <ProjectGrid projects={state.projects} /> : <p>{t('projects.empty')}</p>}
              <nav aria-label={t('projects.pagination')} style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '2rem' }}>
                {page > 1 && <Link to={`/proyectos?page=${page - 1}`}>← {t('projects.previous')}</Link>}
                {state.hasNext && <Link to={`/proyectos?page=${page + 1}`}>{t('projects.next')} →</Link>}
              </nav>
            </>
          )}
        </div>
      </section>
    </>
  );
}
