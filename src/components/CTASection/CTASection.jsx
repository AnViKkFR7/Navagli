import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CTAForm from '../CTAForm/CTAForm';
import styles from './CTASection.module.css';

/**
 * CTA banner section with a modal form trigger.
 * Can be used at the bottom of any page.
 */
export default function CTASection() {
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <section id="cta-section" className={styles.section}>
        <div className={styles.container}>
          <p className={styles.label}>{t('cta.title')}</p>
          <h2 className={styles.heading}>{t('cta.subtitle')}</h2>
          <button
            onClick={() => setFormOpen(true)}
            className={styles.button}
          >
            {t('cta.button')}
          </button>
        </div>
      </section>

      <CTAForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
