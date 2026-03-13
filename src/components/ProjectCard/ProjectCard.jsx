import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import styles from './ProjectCard.module.css';

/**
 * Displays a single project card.
 *
 * @param {{ project: object, className?: string }} props
 */
export default function ProjectCard({ project, className = '' }) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/proyectos/${project.id}`}
      className={`${styles.card} ${className}`}
    >
      {/* Image */}
      <div className={styles.cardImageWrapper}>
        <img
          src={project.cover_image || '/img/landing-image1.jpg'}
          alt={project.title}
          className={styles.cardImg}
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className={styles.cardInfo}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        {project.location && (
          <p className={styles.cardLocation}>
            <MapPin size={13} />
            {project.location}
          </p>
        )}
        <span className={styles.cardViewLink}>
          {t('projects.viewProject')} →
        </span>
      </div>
    </Link>
  );
}
