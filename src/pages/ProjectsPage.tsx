import { useTranslation } from 'react-i18next';
import { ProjectCard } from '../components/ui/ProjectCard';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Loading';
import { useProjects } from '../hooks/useData';

export function ProjectsPage() {
  const { t } = useTranslation();
  const { data: projects, loading, error } = useProjects();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('projects.title')}</h1>
          <p className="text-blue-200">{t('projects.subtitle')}</p>
        </div>
      </div>

      <div className="container-custom py-10">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {projects && projects.length === 0 && (
          <p className="text-center text-gray-500 py-16">{t('projects.no_results')}</p>
        )}
        {projects && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
