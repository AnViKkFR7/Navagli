import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProjectGrid from '../../components/ProjectGrid/ProjectGrid';
import CTAForm from '../../components/CTAForm/CTAForm';
import CTASection from '../../components/CTASection/CTASection';
import { getProjects } from '../../services/projectsService';

export default function HomePage() {
  const { t } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
        <img
          src="/img/landing-image3.jpg"
          alt="Navagli hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-10 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto w-full">
          <p className="text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-5 animate-fade-in">
            Inversiones y Construcciones Navagli S.L.
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white max-w-3xl leading-tight mb-8">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-white/80 max-w-xl mb-10">
            {t('hero.subtitle')}
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="bg-[#da9a4d] text-white px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-white hover:text-[#151515] transition-colors duration-300"
          >
            {t('hero.cta')}
          </button>
        </div>
      </section>

      {/* ── QUIÉNES SOMOS ────────────────────────────────── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-4">
              {t('about.sectionLabel')}
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-[#151515] mb-6 leading-snug">
              {t('about.title')}
            </h2>
            <p className="text-[#8f999b] leading-relaxed text-base md:text-lg">
              {t('about.text')}
            </p>
            <Link
              to="/quienes-somos"
              className="inline-block mt-8 text-xs font-semibold tracking-widest uppercase text-[#151515] border-b border-[#151515] pb-0.5 hover:text-[#da9a4d] hover:border-[#da9a4d] transition-colors"
            >
              {t('about.learnMore')} →
            </Link>
          </div>
          <div className="overflow-hidden">
            <img
              src="/img/landing-image4.jpg"
              alt="Sobre Navagli"
              className="w-full h-[460px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── PROYECTOS DESTACADOS ─────────────────────────── */}
      <section className="py-24 px-4 md:px-8 lg:px-16 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-3">
                {t('projects.sectionLabel')}
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-[#151515]">
                {t('projects.title')}
              </h2>
            </div>
            <Link
              to="/proyectos"
              className="text-xs font-semibold tracking-widest uppercase text-[#151515] border-b border-[#151515] pb-0.5 hover:text-[#da9a4d] hover:border-[#da9a4d] transition-colors whitespace-nowrap"
            >
              {t('projects.viewAll')} →
            </Link>
          </div>
          <ProjectGrid projects={projects} limit={3} />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <CTASection />

      {/* Modal form */}
      <CTAForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
