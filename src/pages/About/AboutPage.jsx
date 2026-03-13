import { useTranslation } from 'react-i18next';
import { Shield, Clock, Star, Lightbulb } from 'lucide-react';
import CTASection from '../../components/CTASection/CTASection';

const VALUES = [
  { key: 'quality', Icon: Star },
  { key: 'commitment', Icon: Clock },
  { key: 'trust', Icon: Shield },
  { key: 'innovation', Icon: Lightbulb },
];

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-32 pb-16 px-4 md:px-8 lg:px-16 bg-[#151515]">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-3">
            Navagli
          </p>
          <h1 className="text-4xl md:text-5xl font-light text-white">
            {t('aboutPage.heroTitle')}
          </h1>
          <p className="mt-3 text-[#8f999b] text-lg">{t('aboutPage.heroSubtitle')}</p>
        </div>
      </section>

      {/* History */}
      <section className="py-24 px-4 md:px-8 lg:px-16 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-4">
              {t('aboutPage.historyLabel')}
            </p>
            <h2 className="text-3xl font-light text-[#151515] mb-6">
              {t('aboutPage.historyTitle')}
            </h2>
            <p className="text-[#8f999b] leading-relaxed text-base md:text-lg">
              {t('aboutPage.historyText')}
            </p>
          </div>
          <div className="overflow-hidden">
            <img
              src="/img/landing-image1.jpg"
              alt="Historia Navagli"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-4 md:px-8 lg:px-16 bg-[#151515]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-4">
            {t('aboutPage.philosophyLabel')}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
            {t('aboutPage.philosophyTitle')}
          </h2>
          <p className="text-[#8f999b] leading-relaxed text-base md:text-xl">
            {t('aboutPage.philosophyText')}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 md:px-8 lg:px-16 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-[0.3em] uppercase text-[#da9a4d] mb-3">
              {t('aboutPage.valuesLabel')}
            </p>
            <h2 className="text-3xl font-light text-[#151515]">{t('aboutPage.valuesTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map(({ key, Icon }) => (
              <div key={key} className="bg-white p-8 text-center border border-[#e7ded2]">
                <div className="flex justify-center mb-4">
                  <Icon size={32} className="text-[#da9a4d]" />
                </div>
                <h3 className="text-lg font-medium text-[#151515] mb-2">
                  {t(`aboutPage.values.${key}`)}
                </h3>
                <p className="text-sm text-[#8f999b]">
                  {t(`aboutPage.values.${key}Text`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience stats */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#e7ded2]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { num: '+20', labelKey: 'aboutPage.stats.yearsLabel' },
            { num: '+500', labelKey: 'aboutPage.stats.projectsLabel' },
            { num: '+30', labelKey: 'aboutPage.stats.professionalsLabel' },
            { num: '100%', labelKey: 'aboutPage.stats.clientsLabel' },
          ].map(({ num, labelKey }) => (
            <div key={labelKey}>
              <p className="text-4xl md:text-5xl font-light text-[#151515] mb-2">{num}</p>
              <p className="text-sm text-[#8f999b] uppercase tracking-widest">{t(labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
