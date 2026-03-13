import { useTranslation } from 'react-i18next';
import { Shield, Clock, Star, Lightbulb } from 'lucide-react';
import CTASection from '../../components/CTASection/CTASection';
import styles from './AboutPage.module.css';

const VALUES = [
  { key: 'quality', Icon: Star },
  { key: 'commitment', Icon: Clock },
  { key: 'trust', Icon: Shield },
  { key: 'innovation', Icon: Lightbulb },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Page hero */}
      <section id="page-hero" className={styles.pageHero}>
        <div className={styles.heroInner}>
          <p className={styles.heroPageLabel}>
            Navagli
          </p>
          <h1 className={styles.heroTitle}>
            {t('aboutPage.heroTitle')}
          </h1>
          <p className={styles.heroSubtitle}>{t('aboutPage.heroSubtitle')}</p>
        </div>
      </section>

      {/* History */}
      <section id="history" className={styles.historySection}>
        <div className={styles.twoColGrid}>
          <div>
            <p className={styles.historyLabel}>
              {t('aboutPage.historyLabel')}
            </p>
            <h2 className={styles.sectionTitle}>
              {t('aboutPage.historyTitle')}
            </h2>
            <p className={styles.bodyText}>
              {t('aboutPage.historyText')}
            </p>
          </div>
          <div className={styles.imgWrapper}>
            <img
              src="/img/landing-image1.jpg"
              alt="Historia Navagli"
              className={styles.historyImg}
            />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section id="philosophy" className={styles.philosophySection}>
        <div className={styles.philosophyInner}>
          <p className={styles.philosophyLabel}>
            {t('aboutPage.philosophyLabel')}
          </p>
          <h2 className={styles.philosophyTitle}>
            {t('aboutPage.philosophyTitle')}
          </h2>
          <p className={styles.philosophyText}>
            {t('aboutPage.philosophyText')}
          </p>
        </div>
      </section>

      {/* Values */}
      <section id="values" className={styles.valuesSection}>
        <div className={styles.valuesInner}>
          <div className={styles.valuesHeader}>
            <p className={styles.valuesLabel}>
              {t('aboutPage.valuesLabel')}
            </p>
            <h2 className={styles.valuesTitle}>{t('aboutPage.valuesTitle')}</h2>
          </div>
          <div className={styles.valuesGrid}>
            {VALUES.map(({ key, Icon }) => (
              <div key={key} className={styles.valueCard}>
                <div className={styles.iconWrapper}>
                  <Icon size={32} className={styles.valueIcon} />
                </div>
                <h3 className={styles.valueTitle}>
                  {t(`aboutPage.values.${key}`)}
                </h3>
                <p className={styles.valueText}>
                  {t(`aboutPage.values.${key}Text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience stats */}
      <section id="stats" className={styles.statsSection}>
        <div className={styles.statsGrid}>
          {[
            { num: '+20', labelKey: 'aboutPage.stats.yearsLabel' },
            { num: '+500', labelKey: 'aboutPage.stats.projectsLabel' },
            { num: '+30', labelKey: 'aboutPage.stats.professionalsLabel' },
            { num: '100%', labelKey: 'aboutPage.stats.clientsLabel' },
          ].map(({ num, labelKey }) => (
            <div key={labelKey}>
              <p className={styles.statNum}>{num}</p>
              <p className={styles.statLabel}>{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
