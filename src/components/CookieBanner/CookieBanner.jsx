import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cookie, X } from 'lucide-react';
import styles from './CookieBanner.module.css';

const STORAGE_KEY = 'navagli_cookies_accepted';

export default function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // Small delay so it slides in after page load
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setVisible(false);
  };

  const dismiss = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label={t('cookieBanner.ariaLabel')}>
      <div className={styles.inner}>
        <div className={styles.iconCol}>
          <Cookie size={24} className={styles.icon} />
        </div>
        <div className={styles.textCol}>
          <p className={styles.title}>{t('cookieBanner.title')}</p>
          <p className={styles.body}>
            {t('cookieBanner.body')}{' '}
            <Link to="/politica-cookies" className={styles.link} onClick={dismiss}>
              {t('cookieBanner.moreInfo')}
            </Link>
          </p>
        </div>
        <div className={styles.actions}>
          <button className={styles.acceptBtn} onClick={accept}>
            {t('cookieBanner.accept')}
          </button>
          <button
            className={styles.declineBtn}
            onClick={dismiss}
            aria-label={t('cookieBanner.decline')}
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
