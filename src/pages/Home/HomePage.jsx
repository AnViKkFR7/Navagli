import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProjectGrid from '../../components/ProjectGrid/ProjectGrid';
import CTAForm from '../../components/CTAForm/CTAForm';
import CTASection from '../../components/CTASection/CTASection';
import { getProjects } from '../../services/projectsService';
import styles from './HomePage.module.css';

export default function HomePage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section id="hero" className={styles.hero}>
        <img
          src="/img/landing-image3.jpg"
          alt="Navagli hero"
          className={styles.heroImg}
        />
        {/* Overlay */}
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>
            Inversiones y Construcciones Navagli S.L.
          </p>
          <h1 className={styles.heroTitle}>
            {t('hero.title')}
          </h1>
          <p className={styles.heroSubtitle}>
            {t('hero.subtitle')}
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className={styles.heroButton}
          >
            {t('hero.cta')}
          </button>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ────────────────────────────────── */}
      <section id="about-section" className={styles.aboutSection}>
        <div className={styles.aboutGrid}>
          <div>
            <p className={styles.aboutLabel}>
              {t('about.sectionLabel')}
            </p>
            <h2 className={styles.aboutTitle}>
              {t('about.title')}
            </h2>
            {t('about.text').split('\n\n').map((paragraph, i) => (
              <p key={i} className={styles.bodyText}>
                {paragraph}
              </p>
            ))}
            <Link
              to="/quienes-somos"
              className={styles.learnMoreLink}
            >
              {t('about.learnMore')} →
            </Link>
          </div>
          <div className={styles.imgWrapper}>
            <img
              src="/img/landing-image4.jpg"
              alt="Sobre Navagli"
              className={styles.aboutImg}
            />
          </div>
        </div>
      </section>

      {/* ── PROYECTOS DESTACADOS ─────────────────────────── */}
      <section id="projects-section" className={styles.projectsSection}>
        <div className={styles.projectsInner}>
          <div className={styles.projectsHeader}>
            <div>
              <p className={styles.projectsLabel}>
                {t('projects.sectionLabel')}
              </p>
              <h2 className={styles.projectsTitle}>
                {t('projects.title')}
              </h2>
            </div>
            <Link
              to="/proyectos"
              className={styles.viewAllLink}
            >
              {t('projects.viewAll')} →
            </Link>
          </div>
          <ProjectGrid projects={projects} limit={3} />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <CTASection />

      {/* Modal form */}
      <CTAForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
