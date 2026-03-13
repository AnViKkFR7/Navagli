import { useTranslation } from 'react-i18next';
import CTASection from '../../components/CTASection/CTASection';

const SERVICES = [
  'integral',
  'kitchen',
  'bathroom',
  'interior',
  'rehabilitation',
  'commercial',
  'office',
];

export default function ServicesPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-32 pb-16 px-4 md:px-8 lg:px-16 bg-[#151515]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-3">
            {t('services.sectionLabel')}
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-white">
            {t('services.title')}
          </h1>
          <p className="mt-4 text-[#8f999b] max-w-xl text-base md:text-lg">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Services list – alternating layout */}
      <div className="bg-[#fefefe]">
        {SERVICES.map((key, i) => (
          <section
            key={key}
            className={`py-20 px-4 md:px-8 lg:px-16 ${i % 2 === 1 ? 'bg-[#fafaf9]' : 'bg-[#fefefe]'}`}
          >
            <div
              className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center ${
                i % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text – swap order on even/odd */}
              <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-3">
                  {t('services.sectionLabel')}
                </p>
                <h2 className="text-2xl md:text-3xl font-light text-[#151515] mb-5">
                  {t(`services.${key}.title`)}
                </h2>
                <p className="text-[#8f999b] leading-relaxed">
                  {t(`services.${key}.description`)}
                </p>
              </div>

              {/* Image */}
              <div className={`overflow-hidden ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                <img
                  src="/img/landing-image1.jpg"
                  alt={t(`services.${key}.title`)}
                  className="w-full h-72 md:h-96 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <CTASection />
    </>
  );
}
