import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { trackNotFound } from '../../lib/analytics';
import styles from '../Legal/Legal.module.css';

export default function NotFoundPage() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  useEffect(() => { trackNotFound(); }, [pathname]);
  return (
    <section className={styles.pageWrapper}>
      <h1 className={styles.pageTitle}>{t('notFound.title')}</h1>
      <Link to="/" className={styles.accentLink}>{t('notFound.home')}</Link>
    </section>
  );
}
