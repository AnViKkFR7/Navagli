import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import CTASection from '../../components/CTASection/CTASection';
import styles from './PinturaDecorativaPage.module.css';

const TECHNIQUES = [
  { key: 'venetian',    img: '/img/pared-estuco-veneciano.jpg' },
  { key: 'microcement', img: '/img/pared-microcemento.png' },
  { key: 'chalk',       img: '/img/pared-mate.jpg' },
  { key: 'effects',     img: '/img/papel-pintado.png' },
];
const STEPS = ['s1', 's2', 's3', 's4'];

export default function PinturaDecorativaPage() {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (key) =>
    setFlipped((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      {/* Hero */}
      <section id="page-hero" className={styles.pageHero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>{t('pintura.heroLabel')}</p>
          <h1 className={styles.heroTitle}>{t('pintura.heroTitle')}</h1>
          <p className={styles.heroSubtitle}>{t('pintura.heroSubtitle')}</p>
        </div>
      </section>

      {/* What is it */}
      <section id="que-es" className={styles.whatSection}>
        <div className={styles.twoColGrid}>
          <div>
            <p className={styles.sectionLabel}>{t('pintura.whatLabel')}</p>
            <h2 className={styles.sectionTitle}>{t('pintura.whatTitle')}</h2>
            <p className={styles.bodyText}>{t('pintura.whatText')}</p>
          </div>
          <div className={styles.pointsList}>
            {['p1', 'p2', 'p3', 'p4'].map((p) => (
              <div key={p} className={styles.pointItem}>
                <Check size={18} className={styles.checkIcon} />
                <span className={styles.pointText}>{t(`pintura.whatPoints.${p}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Techniques */}
      <section id="techniques" className={styles.techniquesSection}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <p className={styles.sectionLabel}>{t('pintura.techniquesLabel')}</p>
            <h2 className={styles.sectionTitle}>{t('pintura.techniquesTitle')}</h2>
          </div>
          <div className={styles.techniquesGrid}>
            {TECHNIQUES.map(({ key, img }) => (
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
                      alt={t(`pintura.techniques.${key}.title`)}
                      className={styles.cardImg}
                    />
                    <div className={styles.cardOverlay}>
                      <h3 className={styles.cardFrontTitle}>
                        {t(`pintura.techniques.${key}.title`)}
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
                      {t(`pintura.techniques.${key}.title`)}
                    </h3>
                    <p className={styles.cardBackDesc}>
                      {t(`pintura.techniques.${key}.desc`)}
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
            <p className={styles.sectionLabelLight}>{t('pintura.processLabel')}</p>
            <h2 className={styles.sectionTitleLight}>{t('pintura.processTitle')}</h2>
          </div>
          <div className={styles.stepsRow}>
            {STEPS.map((step, i) => (
              <div key={step} className={styles.step}>
                <div className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3 className={styles.stepTitle}>{t(`pintura.steps.${step}.title`)}</h3>
                <p className={styles.stepDesc}>{t(`pintura.steps.${step}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
