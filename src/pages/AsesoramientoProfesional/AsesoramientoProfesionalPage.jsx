import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, FileSearch, FileText, Calculator, Package } from 'lucide-react';
import CTASection from '../../components/CTASection/CTASection';
import styles from './AsesoramientoProfesionalPage.module.css';

const PILLARS = [
  { key: 'arch',       img: '/img/proyecto_arquitectura.jpg' },
  { key: 'designer',   img: '/img/ayuda_interiorismo.jpg' },
  { key: 'specialist', img: '/img/tecnicos.jpg' },
];

const SERVICES = [
  { key: 'viability', Icon: FileSearch },
  { key: 'licenses',  Icon: FileText },
  { key: 'budget',    Icon: Calculator },
  { key: 'vendors',   Icon: Package },
];

const BENEFITS = ['b1', 'b2', 'b3', 'b4'];

export default function AsesoramientoProfesionalPage() {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState({});

  const toggleFlip = (key) =>
    setFlipped((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <>
      {/* Hero */}
      <section id="page-hero" className={styles.pageHero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>{t('asesoria.heroLabel')}</p>
          <h1 className={styles.heroTitle}>{t('asesoria.heroTitle')}</h1>
          <p className={styles.heroSubtitle}>{t('asesoria.heroSubtitle')}</p>
        </div>
      </section>

      {/* Intro */}
      <section id="intro" className={styles.introSection}>
        <div className={styles.twoColGrid}>
          <div>
            <p className={styles.sectionLabel}>{t('asesoria.introLabel')}</p>
            <h2 className={styles.sectionTitle}>{t('asesoria.introTitle')}</h2>
            <p className={styles.bodyText}>{t('asesoria.introText')}</p>
          </div>
          <div className={styles.benefitsList}>
            {BENEFITS.map((b) => (
              <div key={b} className={styles.benefitItem}>
                <Check size={18} className={styles.checkIcon} />
                <span className={styles.benefitText}>{t(`asesoria.introBenefits.${b}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className={styles.pillarsSection}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <p className={styles.sectionLabel}>{t('asesoria.pillarsLabel')}</p>
            <h2 className={styles.sectionTitle}>{t('asesoria.pillarsTitle')}</h2>
          </div>
          <div className={styles.pillarsGrid}>
            {PILLARS.map(({ key, img }) => (
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
                      alt={t(`asesoria.pillars.${key}.title`)}
                      className={styles.cardImg}
                    />
                    <div className={styles.cardOverlay}>
                      <h3 className={styles.cardFrontTitle}>
                        {t(`asesoria.pillars.${key}.title`)}
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
                      {t(`asesoria.pillars.${key}.title`)}
                    </h3>
                    <p className={styles.cardBackDesc}>
                      {t(`asesoria.pillars.${key}.desc`)}
                    </p>
                    <span className={styles.cardBackClose}>✕ cerrar</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services offered */}
      <section id="services-offered" className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.centeredHeader}>
            <p className={styles.sectionLabel}>{t('asesoria.servicesLabel')}</p>
            <h2 className={styles.sectionTitle}>{t('asesoria.servicesTitle')}</h2>
          </div>
          <div className={styles.servicesGrid}>
            {SERVICES.map(({ key, Icon }) => (
              <div key={key} className={styles.serviceItem}>
                <div className={styles.serviceIconWrapper}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className={styles.serviceItemTitle}>{t(`asesoria.servicesList.${key}.title`)}</h3>
                  <p className={styles.serviceItemDesc}>{t(`asesoria.servicesList.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
