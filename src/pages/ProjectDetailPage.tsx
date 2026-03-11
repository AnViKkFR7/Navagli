import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Calendar, Maximize2 } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Loading';
import { useProject } from '../hooks/useData';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: project, loading, error } = useProject(slug ?? '');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!project) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('common.not_found')}</h1>
        <p className="text-gray-500 mb-6">{t('common.not_found_desc')}</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-blue-900 font-medium hover:underline"
        >
          <ArrowLeft size={16} /> {t('common.back')}
        </Link>
      </div>
    );
  }

  const allImages =
    project.images && project.images.length > 0
      ? project.images
      : [project.main_image_url ?? PLACEHOLDER];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm text-blue-900 hover:underline font-medium"
          >
            <ArrowLeft size={15} />
            {t('nav.projects')}
          </Link>
        </div>
      </div>

      {/* Hero image */}
      <div className="h-80 overflow-hidden">
        <img
          src={allImages[0]}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container-custom py-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {project.title}
              </h1>
              {project.city && (
                <p className="flex items-center gap-1.5 text-gray-500">
                  <MapPin size={16} />
                  {project.city}
                </p>
              )}
            </div>
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              {t(`projects.status.${project.status}`)}
            </span>
          </div>

          <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-gray-100">
            {project.area_m2 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Maximize2 size={16} className="text-blue-700" />
                {project.area_m2} {t('common.m2')}
              </div>
            )}
            {project.start_date && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-blue-700" />
                {new Date(project.start_date).toLocaleDateString()}
                {project.end_date && ` — ${new Date(project.end_date).toLocaleDateString()}`}
              </div>
            )}
            {project.category && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{t('projects.category_label')}:</span> {project.category}
              </div>
            )}
          </div>

          {project.description && (
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          )}

          {/* Image gallery */}
          {allImages.length > 1 && (
            <div className="mt-8">
              <h2 className="font-semibold text-gray-900 mb-4">{t('projects.gallery')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allImages.map((img, i) => (
                  <div key={i} className="aspect-video overflow-hidden rounded-xl">
                    <img
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
