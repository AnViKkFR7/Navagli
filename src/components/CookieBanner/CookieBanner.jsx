import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cookie } from 'lucide-react';
import { globalPrivacyControl, readConsent, writeConsent, measurementAllowed, needsDecision } from '../../lib/consent';
import { setMeasurement } from '../../lib/analytics';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState({ measurement: true, analytics: false, marketing: false });
  const gpc = globalPrivacyControl();

  useEffect(() => {
    const show = () => {
      const consent = readConsent();
      setOptions({
        measurement: measurementAllowed(consent),
        analytics: consent?.analytics ?? false,
        marketing: consent?.marketing ?? false,
      });
      setVisible(true);
    };
    const timer = needsDecision(readConsent()) ? setTimeout(show, 0) : null;
    window.addEventListener('moira:cookie-preferences', show);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('moira:cookie-preferences', show);
    };
  }, []);

  const decide = (decision) => {
    const saved = writeConsent({ ...decision, measurement: decision.measurement && !gpc });
    setMeasurement(measurementAllowed(saved));
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div className={styles.banner} role="dialog" aria-label={t('cookieBanner.ariaLabel')}>
      <div className={styles.inner}>
        <Cookie size={24} className={styles.icon} aria-hidden="true" />
        <div className={styles.textCol}>
          <p className={styles.title}>{t('cookieBanner.title')}</p>
          <p className={styles.body}>
            {t('cookieBanner.body')}{' '}
            <Link to="/politica-cookies" className={styles.link}>{t('cookieBanner.moreInfo')}</Link>
          </p>
          <div className={styles.options}>
            <label><input type="checkbox" checked disabled /> {t('cookieBanner.necessary')}</label>
            {['measurement', 'analytics', 'marketing'].map((key) => (
              <label key={key}>
                <input type="checkbox" checked={options[key]} disabled={key === 'measurement' && gpc}
                  onChange={(event) => setOptions((current) => ({ ...current, [key]: event.target.checked }))} />
                {' '}{t(`cookieBanner.${key}`)}
              </label>
            ))}
          </div>
          {gpc && <p className={styles.body}>{t('cookieBanner.gpc')}</p>}
        </div>
        <div className={styles.actions}>
          <button className={styles.acceptBtn} onClick={() => decide({ measurement: !gpc, analytics: true, marketing: true })}>{t('cookieBanner.accept')}</button>
          <button className={styles.declineBtn} onClick={() => decide({ ...options, analytics: false, marketing: false })}>{t('cookieBanner.onlyNecessary')}</button>
          <button className={styles.declineBtn} onClick={() => decide(options)}>{t('cookieBanner.save')}</button>
        </div>
      </div>
    </div>
  );
}
