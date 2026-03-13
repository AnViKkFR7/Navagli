import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const services = [
    t('services.integral.title'),
    t('services.kitchen.title'),
    t('services.bathroom.title'),
    t('services.interior.title'),
    t('services.rehabilitation.title'),
    t('services.commercial.title'),
  ];

  return (
    <footer className="bg-[#151515] text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 – Logo */}
          <div>
            <Link to="/">
              <img
                src="/img/Logo_Navagli.png"
                alt="Navagli"
                className="h-14 brightness-0 invert mb-4"
              />
            </Link>
            <p className="text-[#8f999b] text-sm leading-relaxed">
              Inversiones y Construcciones Navagli S.L.<br />
              {t('footer.tagline')}
            </p>
          </div>

          {/* Col 2 – Services */}
          <div>
            <h3 className="text-xs md:text-lg lg:text-xl font-semibold tracking-widest uppercase text-[#da9a4d] mb-5">
              {t('footer.services')}
            </h3>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    to="/servicios"
                    className="text-[#8f999b] text-sm hover:text-white transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 – Contact */}
          <div>
            <h3 className="text-xs md:text-lg lg:text-xl font-semibold tracking-widest uppercase text-[#da9a4d] mb-5">
              {t('footer.contact')}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-[#8f999b] text-sm">
                <Phone size={15} className="mt-0.5 flex-shrink-0" />
                <span>+34 XXX XXX XXX</span>
              </li>
              <li className="flex items-start gap-2 text-[#8f999b] text-sm">
                <Mail size={15} className="mt-0.5 flex-shrink-0" />
                <span>info@navagli.com</span>
              </li>
              <li className="flex items-start gap-2 text-[#8f999b] text-sm">
                <MapPin size={15} className="mt-0.5 flex-shrink-0" />
                <span>Barcelona, España</span>
              </li>
            </ul>
          </div>

          {/* Col 4 – Legal */}
          <div>
            <h3 className="text-xs md:text-lg lg:text-xl font-semibold tracking-widest uppercase text-[#da9a4d] mb-5">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/aviso-legal"
                  className="text-[#8f999b] text-sm hover:text-white transition-colors"
                >
                  {t('footer.legalNotice')}
                </Link>
              </li>
              <li>
                <Link
                  to="/politica-cookies"
                  className="text-[#8f999b] text-sm hover:text-white transition-colors"
                >
                  {t('footer.cookies')}
                </Link>
              </li>
              <li>
                <Link
                  to="/politica-privacidad"
                  className="text-[#8f999b] text-sm hover:text-white transition-colors"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-2 text-[#8f999b] text-xs">
          <p>© {year} Inversiones y Construcciones Navagli S.L. — {t('footer.rights')}</p>
          <div className="flex gap-4">
            <Link to="/aviso-legal" className="hover:text-white transition-colors">
              {t('footer.legalNotice')}
            </Link>
            <Link to="/politica-privacidad" className="hover:text-white transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
