import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CTAForm from '../CTAForm/CTAForm';

/**
 * CTA banner section with a modal form trigger.
 * Can be used at the bottom of any page.
 */
export default function CTASection() {
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <section className="bg-[#151515] py-20 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs md:text-lg lg:text-xl font-semibold tracking-widest uppercase text-[#da9a4d] mb-4">
            {t('cta.title')}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
            {t('cta.subtitle')}
          </h2>
          <button
            onClick={() => setFormOpen(true)}
            className="mt-4 bg-[#da9a4d] text-white px-10 py-4 text-sm font-semibold tracking-widest uppercase hover:bg-white hover:text-[#151515] transition-colors duration-300"
          >
            {t('cta.button')}
          </button>
        </div>
      </section>

      <CTAForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </>
  );
}
