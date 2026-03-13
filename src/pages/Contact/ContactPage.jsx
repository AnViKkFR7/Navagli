import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import CTAForm from '../../components/CTAForm/CTAForm';

export default function ContactPage() {
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
            {t('contactPage.heroTitle')}
          </h1>
          <p className="mt-3 text-[#8f999b] text-lg">{t('contactPage.heroSubtitle')}</p>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-20 px-4 md:px-8 lg:px-16 bg-[#fefefe]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Inline form */}
          <div>
            <h2 className="text-2xl font-light text-[#151515] mb-8">
              {t('contactPage.writeUs')}
            </h2>
            <CTAForm isOpen={true} onClose={() => {}} inline={true} />
          </div>

          {/* Right - Company info */}
          <div className="lg:pl-8">
            <h2 className="text-2xl font-light text-[#151515] mb-8">
              {t('contactPage.contactInfo')}
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-[#e7ded2] p-3 flex-shrink-0">
                  <Phone size={20} className="text-[#da9a4d]" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#8f999b] mb-1">
                    {t('contactPage.phone')}
                  </p>
                  <p className="text-[#151515]">+34 XXX XXX XXX</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#e7ded2] p-3 flex-shrink-0">
                  <Mail size={20} className="text-[#da9a4d]" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#8f999b] mb-1">
                    {t('contactPage.email')}
                  </p>
                  <p className="text-[#151515]">info@navagli.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#e7ded2] p-3 flex-shrink-0">
                  <MapPin size={20} className="text-[#da9a4d]" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#8f999b] mb-1">
                    {t('contactPage.office')}
                  </p>
                  <p className="text-[#151515]">Direccion, Barcelona</p>
                  <p className="text-[#8f999b] text-sm">08XXX Barcelona, Espana</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-[#e7ded2] p-3 flex-shrink-0">
                  <Clock size={20} className="text-[#da9a4d]" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-[#8f999b] mb-1">
                    {t('contactPage.schedule')}
                  </p>
                  <p className="text-[#151515]">{t('contactPage.scheduleText')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
