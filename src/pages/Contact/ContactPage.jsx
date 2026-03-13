import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import CTAForm from '../../components/CTAForm/CTAForm';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Page hero */}
      <section id="page-hero" className={styles.pageHero}>
        <div className={styles.heroInner}>
          <p className={styles.heroLabel}>
            Navagli
          </p>
          <h1 className={styles.heroTitle}>
            {t('contactPage.heroTitle')}
          </h1>
          <p className={styles.heroSubtitle}>{t('contactPage.heroSubtitle')}</p>
        </div>
      </section>

      {/* Contact content */}
      <section id="contact-content" className={styles.contactSection}>
        <div className={styles.contentGrid}>
          {/* Left - Inline form */}
          <div>
            <h2 className={styles.colTitle}>
              {t('contactPage.writeUs')}
            </h2>
            <CTAForm isOpen={true} onClose={() => {}} inline={true} />
          </div>

          {/* Right - Company info */}
          <div className={styles.infoCol}>
            <h2 className={styles.colTitle}>
              {t('contactPage.contactInfo')}
            </h2>
            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.iconBox}>
                  <Phone size={20} className={styles.iconEl} />
                </div>
                <div>
                  <p className={styles.infoLabel}>
                    {t('contactPage.phone')}
                  </p>
                  <p className={styles.infoValue}>+34 XXX XXX XXX</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconBox}>
                  <Mail size={20} className={styles.iconEl} />
                </div>
                <div>
                  <p className={styles.infoLabel}>
                    {t('contactPage.email')}
                  </p>
                  <p className={styles.infoValue}>info@navagli.com</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconBox}>
                  <MapPin size={20} className={styles.iconEl} />
                </div>
                <div>
                  <p className={styles.infoLabel}>
                    {t('contactPage.office')}
                  </p>
                  <p className={styles.infoValue}>Direccion, Barcelona</p>
                  <p className={styles.infoValueSub}>08XXX Barcelona, Espana</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.iconBox}>
                  <Clock size={20} className={styles.iconEl} />
                </div>
                <div>
                  <p className={styles.infoLabel}>
                    {t('contactPage.schedule')}
                  </p>
                  <p className={styles.infoValue}>{t('contactPage.scheduleText')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
