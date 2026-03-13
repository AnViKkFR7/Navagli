import { useTranslation } from 'react-i18next';
import CTASection from '../../components/CTASection/CTASection';
import styles from './ServicesPage.module.css';

const SERVICES = [
  'integral',
  'kitchen',
  'bathroom',
  'interior',
  'rehabilitation',
  'commercial',
  'office',
];

export default function ServicesPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Page hero */}
      <section id="page-hero" className={styles.pageHero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>
            {t('services.sectionLabel')}
          </p>
          <h1 className={styles.heroTitle}>
            {t('services.title')}
          </h1>
          <p className={styles.heroSubtitle}>
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Services list – alternating layout */}
      <div id="services-list" className={styles.servicesWrapper}>
        {SERVICES.map((key, i) => (
          <section
            key={key}
            className={i % 2 === 1 ? styles.serviceSectionAlt : styles.serviceSection}
          >
            <div className={styles.serviceGrid}>
              {/* Text – swap order on even/odd */}
              <div className={i % 2 === 1 ? `${styles.serviceText} ${styles.serviceTextOdd}` : styles.serviceText}>
                <p className={styles.serviceLabel}>
                  {t('services.sectionLabel')}
                </p>
                <h2 className={styles.serviceTitle}>
                  {t(`services.${key}.title`)}
                </h2>
                <p className={styles.serviceDesc}>
                  {t(`services.${key}.description`)}
                </p>
              </div>

              {/* Image */}
              <div className={i % 2 === 1 ? `${styles.serviceImgWrapper} ${styles.serviceImgWrapperOdd}` : styles.serviceImgWrapper}>
                <img
                  src="/img/landing-image1.jpg"
                  alt={t(`services.${key}.title`)}
                  className={styles.serviceImg}
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <CTASection />
    </>
  );
}
