import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectGrid from '../../components/ProjectGrid/ProjectGrid';
import { getProjects } from '../../services/projectsService';
import styles from './ProjectsPage.module.css';

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
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
          ) : (
            <ProjectGrid projects={projects} />
          )}
        </div>
      </section>
    </>
  );
}
