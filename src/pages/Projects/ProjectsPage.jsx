import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProjectGrid from '../../components/ProjectGrid/ProjectGrid';
import { getProjects } from '../../services/projectsService';

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-32 pb-16 px-4 md:px-8 lg:px-16 bg-[#151515]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-3">
            {t('projects.sectionLabel')}
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-white">
            {t('projects.title')}
          </h1>
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#e7ded2] aspect-[4/3] w-full mb-4" />
                  <div className="h-5 bg-[#e7ded2] w-3/4 mb-2" />
                  <div className="h-4 bg-[#e7ded2] w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <ProjectGrid projects={projects} />
          )}
        </div>
      </section>
    </>
  );
}
