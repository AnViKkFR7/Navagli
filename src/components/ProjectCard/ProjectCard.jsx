import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

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
      className={`group block overflow-hidden ${className}`}
    >
      {/* Image */}
      <div className="overflow-hidden aspect-[4/3] bg-[#e7ded2]">
        <img
          src={project.cover_image || '/img/landing-image1.jpg'}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <h3 className="text-lg font-medium text-[#151515] group-hover:text-[#da9a4d] transition-colors duration-200">
          {project.title}
        </h3>
        {project.location && (
          <p className="flex items-center gap-1 text-sm text-[#8f999b] mt-1">
            <MapPin size={13} />
            {project.location}
          </p>
        )}
        <span className="inline-block mt-3 text-xs md:text-base lg:text-lg color:[#da9a4d] font-semibold tracking-widest uppercase text-[#da9a4d] border-b border-[#da9a4d] pb-0.5 transition-all group-hover:border-[#151515] group-hover:text-[#151515]">
          {t('projects.viewProject')} →
        </span>
      </div>
    </Link>
  );
}
