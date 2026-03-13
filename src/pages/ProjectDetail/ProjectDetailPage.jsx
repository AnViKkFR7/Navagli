import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Carousel from '../../components/Carousel/Carousel';
import CTASection from '../../components/CTASection/CTASection';
import { getProjectById } from '../../services/projectsService';
import styles from './ProjectDetailPage.module.css';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectById(id).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.notFoundScreen}>
        <p className={styles.notFoundText}>Proyecto no encontrado</p>
        <Link to="/proyectos" className={styles.notFoundLink}>
          ← {t('projects.viewAll')}
        </Link>
      </div>
    );
  }

  const images =
    project.images && project.images.length > 0
      ? project.images
      : [project.cover_image || '/img/landing-image1.jpg'];

  const worksDone = project.attributes?.what_was_done || [];
  const description =
    project.attributes?.description || project.summary || '';

  return (
    <>
      {/* Carousel */}
      <div id="project-carousel" className={styles.carouselWrapper}>
        <Carousel images={images} />
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
                  {description}
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
      <CTASection />
    </>
  );
}
