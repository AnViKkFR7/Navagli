import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CTASection from '../../components/CTASection/CTASection';
import styles from './ReformasIntegralesPage.module.css';

const AREAS = [
  { key: 'kitchen',  img: '/img/kitchen.jpg' },
  { key: 'bathroom', img: '/img/bathroom.jpg' },
  { key: 'floors',   img: '/img/tiling.jpg' },
  { key: 'exterior', img: '/img/fachada.jpg' },
  { key: 'interior', img: '/img/interiorism.jpg' },
  { key: 'rehab',    img: '/img/rehabilitacion.jpg' },
];

const STEPS = ['s1', 's2', 's3', 's4'];

export default function ReformasIntegralesPage() {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (key) =>
    setFlipped((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      {/* Hero */}
      <section id="page-hero" className={styles.pageHero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>{t('reformas.heroLabel')}</p>
          <h1 className={styles.heroTitle}>{t('reformas.heroTitle')}</h1>
          <p className={styles.heroSubtitle}>{t('reformas.heroSubtitle')}</p>
        </div>
      </section>

      {/* Intro */}
      <section id="intro" className={styles.introSection}>
        <div className={styles.twoColGrid}>
          <div>
            <p className={styles.sectionLabel}>{t('reformas.introLabel')}</p>
            <h2 className={styles.sectionTitle}>{t('reformas.introTitle')}</h2>
            <p className={styles.bodyText}>{t('reformas.introText')}</p>
          </div>
          <div className={styles.statsBox}>
            {['s1', 's2', 's3', 's4'].map((key) => (
              <div key={key} className={styles.statItem}>
                <p className={styles.statNum}>{t(`reformas.stats.${key}.num`)}</p>
                <p className={styles.statLabel}>{t(`reformas.stats.${key}.label`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section id="areas" className={styles.areasSection}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <p className={styles.sectionLabel}>{t('reformas.areasLabel')}</p>
            <h2 className={styles.sectionTitle}>{t('reformas.areasTitle')}</h2>
          </div>
          <div className={styles.areasGrid}>
            {AREAS.map(({ key, img }) => (
              <div
                key={key}
                className={styles.cardWrapper}
                onClick={() => toggleFlip(key)}
              >
                <div
                  className={`${styles.cardInner} ${flipped[key] ? styles.cardFlipped : ''}`}
                >
                  {/* Front */}
                  <div className={styles.cardFront}>
                    <img
                      src={img}
                      alt={t(`reformas.areas.${key}.title`)}
                      className={styles.cardImg}
                    />
                    <div className={styles.cardOverlay}>
                      <h3 className={styles.cardFrontTitle}>
                        {t(`reformas.areas.${key}.title`)}
                      </h3>
                    </div>
                    <div className={styles.tapHint}>
                      <span className={styles.tapHintDot} />
                      <span className={styles.tapHintText}>ver más</span>
                    </div>
                  </div>
                  {/* Back */}
                  <div className={styles.cardBack}>
                    <h3 className={styles.cardBackTitle}>
                      {t(`reformas.areas.${key}.title`)}
                    </h3>
                    <p className={styles.cardBackDesc}>
                      {t(`reformas.areas.${key}.desc`)}
                    </p>
                    <span className={styles.cardBackClose}>✕ cerrar</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process" className={styles.processSection}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <p className={styles.sectionLabelLight}>{t('reformas.processLabel')}</p>
            <h2 className={styles.sectionTitleLight}>{t('reformas.processTitle')}</h2>
          </div>
          <div className={styles.stepsRow}>
            {STEPS.map((step, i) => (
              <div key={step} className={styles.step}>
                <div className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3 className={styles.stepTitle}>{t(`reformas.steps.${step}.title`)}</h3>
                <p className={styles.stepDesc}>{t(`reformas.steps.${step}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
