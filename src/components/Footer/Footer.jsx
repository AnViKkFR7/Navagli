import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin } from 'lucide-react';
import styles from './Footer.module.css';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const services = [
    { label: t('nav.servicesDropdown.integral'),   to: '/reformas-integrales' },
    { label: t('nav.servicesDropdown.painting'),   to: '/pintura-decorativa' },
    { label: t('nav.servicesDropdown.consulting'), to: '/asesoramiento-profesional' },
  ];

  return (
    <footer id="footer" className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Col 1 – Logo */}
          <div id="footer-brand">
            <Link to="/">
              <img
                src="/img/Logo_Navagli.png"
                alt="Navagli"
                className={styles.logo}
              />
            </Link>
            <p className={styles.tagline}>
              Inversiones y Construcciones Navagli S.L.<br />
              {t('footer.tagline')}
            </p>
          </div>

          {/* Col 2 – Services */}
          <div id="footer-services">
            <h3 className={styles.colHeading}>{t('footer.services')}</h3>
            <ul className={styles.serviceList}>
              {services.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className={styles.serviceLink}>{s.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 – Contact */}
          <div id="footer-contact">
            <h3 className={styles.colHeading}>{t('footer.contact')}</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <Phone size={15} className={styles.contactIcon} />
                <span>+34 XXX XXX XXX</span>
              </li>
              <li className={styles.contactItem}>
                <Mail size={15} className={styles.contactIcon} />
                <span>info@navagli.com</span>
              </li>
              <li className={styles.contactItem}>
                <MapPin size={15} className={styles.contactIcon} />
                <span>Barcelona, España</span>
              </li>
            </ul>
          </div>

          {/* Col 4 – Legal */}
          <div id="footer-legal">
            <h3 className={styles.colHeading}>{t('footer.legal')}</h3>
            <ul className={styles.legalList}>
              <li>
                <Link to="/aviso-legal" className={styles.legalLink}>
                  {t('footer.legalNotice')}
                </Link>
              </li>
              <li>
                <Link to="/politica-cookies" className={styles.legalLink}>
                  {t('footer.cookies')}
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidad" className={styles.legalLink}>
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div id="footer-bottom" className={styles.bottomBar}>
          <div style={{display: 'flex'}}>
            <p>© {year} Inversiones y Construcciones Navagli S.L.</p>
            <span style={{ margin: '0 12px', color: 'inherit' }}>|</span>
            <a
              href="https://moiraordo.es/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}
            >
              Developed by MoiraOrdo
            </a>
          </div>
          
          <div className={styles.bottomLinks}>
            <Link to="/aviso-legal" className={styles.bottomLink}>
              {t('footer.legalNotice')}
            </Link>
            <Link to="/politica-privacidad" className={styles.bottomLink}>
              {t('footer.privacy')}
            </Link>
            <Link to="/politica-cookies" className={styles.bottomLink}>
              {t('footer.cookies')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
