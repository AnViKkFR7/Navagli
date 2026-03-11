import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { PropertyCard } from '../components/ui/PropertyCard';
import { ProjectCard } from '../components/ui/ProjectCard';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Loading';
import { useFeaturedProperties, useProjects, useTestimonials } from '../hooks/useData';

const HERO_BG =
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80';

export function HomePage() {
  const { t } = useTranslation();
  const {
    data: featuredProps,
    loading: propsLoading,
    error: propsError,
  } = useFeaturedProperties(6);
  const {
    data: featuredProjects,
    loading: projLoading,
    error: projError,
  } = useProjects(true);
  const { data: testimonials } = useTestimonials(true);

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative min-h-[90vh] flex items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG})` }}
        aria-label="Hero"
      >
        <div className="absolute inset-0 bg-blue-950/70" />
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-white font-semibold rounded-xl transition-colors"
              >
                {t('hero.cta_primary')}
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-xl backdrop-blur-sm transition-colors"
              >
                {t('hero.cta_secondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-blue-900 text-white py-8">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Star size={28} className="text-amber-400" />
              <span className="font-semibold">+500 Proyectos</span>
              <span className="text-sm text-blue-200">Realizados con éxito</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Shield size={28} className="text-amber-400" />
              <span className="font-semibold">+20 Años</span>
              <span className="text-sm text-blue-200">De experiencia</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Clock size={28} className="text-amber-400" />
              <span className="font-semibold">Garantía</span>
              <span className="text-sm text-blue-200">En todos los trabajos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('home.featured_properties')}
            </h2>
            <Link
              to="/properties"
              className="text-sm font-medium text-blue-900 hover:underline flex items-center gap-1"
            >
              {t('home.view_all')} <ArrowRight size={14} />
            </Link>
          </div>
          {propsLoading && <LoadingSpinner />}
          {propsError && <ErrorMessage message={propsError} />}
          {featuredProps && featuredProps.length === 0 && (
            <p className="text-gray-500 text-center py-10">{t('properties.no_results')}</p>
          )}
          {featuredProps && featuredProps.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProps.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {t('home.featured_projects')}
            </h2>
            <Link
              to="/projects"
              className="text-sm font-medium text-blue-900 hover:underline flex items-center gap-1"
            >
              {t('home.view_all')} <ArrowRight size={14} />
            </Link>
          </div>
          {projLoading && <LoadingSpinner />}
          {projError && <ErrorMessage message={projError} />}
          {featuredProjects && featuredProjects.length === 0 && (
            <p className="text-gray-500 text-center py-10">{t('projects.no_results')}</p>
          )}
          {featuredProjects && featuredProjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 6).map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-16 bg-blue-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              {t('home.testimonials')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((t_) => (
                <div
                  key={t_.id}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100"
                >
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < t_.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">
                    &ldquo;{t_.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    {t_.avatar_url ? (
                      <img
                        src={t_.avatar_url}
                        alt={t_.author_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-900 font-bold text-sm">
                        {t_.author_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{t_.author_name}</p>
                      {t_.author_role && (
                        <p className="text-xs text-gray-500">{t_.author_role}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
