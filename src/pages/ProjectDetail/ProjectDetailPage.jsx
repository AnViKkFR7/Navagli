import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Carousel from '../../components/Carousel/Carousel';
import CTASection from '../../components/CTASection/CTASection';
import { getProject, PROJECT_SEO_ENABLED } from '../../services/projectsService';
import { projectMetadata, projectPath } from '../../lib/projects';
import ProjectSeo from '../../components/ProjectSeo/ProjectSeo';
import NotFoundPage from '../NotFound/NotFoundPage';
import styles from './ProjectDetailPage.module.css';

export default function ProjectDetailPage() {
  const { identifier } = useParams();
  const { t } = useTranslation();
  const [state, setState] = useState({ identifier: null, status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    getProject(identifier).then((project) => {
      if (!cancelled) setState({ identifier, status: 'ready', project });
    }).catch(() => {
      if (!cancelled) setState({ identifier, status: 'error' });
    });
    return () => { cancelled = true; };
  }, [identifier]);

  if (state.identifier !== identifier) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (state.status === 'error') {
    return <section className={styles.loadingScreen} role="alert">
      <ProjectSeo metadata={{ title: 'Error al cargar el proyecto | Navagli', robots: 'noindex' }} />
      <p>{t('projects.loadError')}</p><button onClick={() => window.location.reload()}>{t('projects.retry')}</button>
    </section>;
  }
  const project = state.project;
  if (!project) return <><ProjectSeo metadata={{ title: 'Proyecto no encontrado | Navagli', robots: 'noindex' }} /><NotFoundPage /></>;
  const canonicalPath = projectPath(project, PROJECT_SEO_ENABLED);
  if (PROJECT_SEO_ENABLED && canonicalPath !== `/proyectos/${identifier}`) return <Navigate to={canonicalPath} replace />;

  const images =
    project.images && project.images.length > 0
      ? project.images
      : [project.cover_image || '/img/landing-image1.jpg'];

  const worksDone = project.attributes?.what_was_done || [];
  const description =
    project.attributes?.description || project.summary || '';

  return (
    <>
      <ProjectSeo metadata={projectMetadata(project, import.meta.env.VITE_SITE_URL || window.location.origin, PROJECT_SEO_ENABLED)} />
      {/* Carousel */}
      <div id="project-carousel" className={styles.carouselWrapper}>
        <Carousel key={project.id} images={images} alts={project.image_alts} />
      </div>

      {/* Back link */}
      <div className={styles.backRow}>
        <Link to="/proyectos" className={styles.backLink}>
          <ArrowLeft size={16} />
          {t('projects.viewAll')}
        </Link>
      </div>

      {/* Project info */}
      <section id="project-info" className={styles.projectInfo}>
        <div className={styles.contentGrid}>
          {/* Main content */}
          <div>
            <h1 className={styles.projectTitle}>
              {project.title}
            </h1>

            {description && (
              <>
                <h2 className={styles.sectionLabel}>
                  {t('projects.description')}
                </h2>
                <p className={styles.descriptionText}>
                  {description.replace(/\\n/g, '\n')}
                </p>
              </>
            )}

            {worksDone.length > 0 && (
              <>
                <h2 className={styles.sectionLabel}>
                  {t('projects.worksDone')}
                </h2>
                <ul className={styles.worksList}>
                  {worksDone.map((work, i) => (
                    <li key={i} className={styles.workItem}>
                      <CheckCircle2
                        size={18}
                        className={styles.workIcon}
                      />
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection sourceItem={`${project.title} · ${project.slug || project.id}`} />
    </>
  );
}
