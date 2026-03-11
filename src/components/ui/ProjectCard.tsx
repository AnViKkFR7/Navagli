import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Calendar } from 'lucide-react';
import type { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80';

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useTranslation();

  const statusColors: Record<Project['status'], string> = {
    planning: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  };

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={project.main_image_url ?? PLACEHOLDER}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span
          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}
        >
          {t(`projects.status.${project.status}`)}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-900 transition-colors">
          {project.title}
        </h3>

        {project.city && (
          <p className="flex items-center gap-1 text-sm text-gray-500 mb-2">
            <MapPin size={14} />
            {project.city}
          </p>
        )}

        {project.end_date && (
          <p className="flex items-center gap-1 text-sm text-gray-400">
            <Calendar size={14} />
            {new Date(project.end_date).toLocaleDateString()}
          </p>
        )}

        {project.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
        )}
      </div>
    </Link>
  );
}
