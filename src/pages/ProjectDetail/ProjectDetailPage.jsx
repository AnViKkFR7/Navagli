import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Carousel from '../../components/Carousel/Carousel';
import CTASection from '../../components/CTASection/CTASection';
import { getProjectById } from '../../services/projectsService';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjectById(id).then((data) => {
      setProject(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fefefe]">
        <div className="w-12 h-12 border-4 border-[#da9a4d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fefefe] gap-4">
        <p className="text-2xl text-[#151515]">Proyecto no encontrado</p>
        <Link to="/proyectos" className="text-[#da9a4d] underline">
          ← {t('projects.viewAll')}
        </Link>
      </div>
    );
  }

  const images =
    project.images && project.images.length > 0
      ? project.images
      : [project.cover_image || '/img/landing-image1.jpg'];

  const worksDone = project.attributes?.what_was_done || [];
  const description =
    project.attributes?.description || project.summary || '';

  return (
    <>
      {/* Carousel */}
      <div className="pt-20">
        <Carousel images={images} />
      </div>

      {/* Back link */}
      <div className="px-4 md:px-8 lg:px-16 py-6 max-w-7xl mx-auto">
        <Link
          to="/proyectos"
          className="inline-flex items-center gap-2 text-sm text-[#8f999b] hover:text-[#da9a4d] transition-colors"
        >
          <ArrowLeft size={16} />
          {t('projects.viewAll')}
        </Link>
      </div>

      {/* Project info */}
      <section className="px-4 md:px-8 lg:px-16 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-light text-[#151515] mb-4">
              {project.title}
            </h1>
            {project.location && (
              <p className="text-[#8f999b] text-sm mb-8">{project.location}</p>
            )}

            {description && (
              <>
                <h2 className="text-xs md:text-lg lg:text-xl font-semibold tracking-widest uppercase text-[#da9a4d] mb-3">
                  {t('projects.description')}
                </h2>
                <p className="text-[#151515] leading-relaxed text-base md:text-lg mb-10">
                  {description}
                </p>
              </>
            )}

            {worksDone.length > 0 && (
              <>
                <h2 className="text-xs md:text-lg lg:text-xl font-semibold tracking-widest uppercase text-[#da9a4d] mb-4">
                  {t('projects.worksDone')}
                </h2>
                <ul className="space-y-3">
                  {worksDone.map((work, i) => (
                    <li key={i} className="flex items-start gap-3 text-[#151515]">
                      <CheckCircle2
                        size={18}
                        className="text-[#da9a4d] mt-0.5 flex-shrink-0"
                      />
                      <span>{work}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Sidebar – project meta */}
          <div className="bg-[#e7ded2] p-8 h-fit">
            <h3 className="text-xs font-semibold tracking-widest uppercase text-[#8f999b] mb-6">
              Ficha del proyecto
            </h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-xs md:text-base lg:text-lg font-semibold tracking-widest uppercase text-[#da9a4d]">
                  {t('projects.location')}
                </dt>
                <dd className="mt-1 text-sm text-[#151515]">{project.location || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs md:text-base lg:text-lg font-semibold tracking-widest uppercase text-[#da9a4d]">
                  Tipo
                </dt>
                <dd className="mt-1 text-sm text-[#151515] capitalize">
                  {project.item_type?.replace('proyecto-reforma-', '') || '—'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
