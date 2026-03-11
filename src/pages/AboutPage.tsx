import { useTranslation } from 'react-i18next';
import { Shield, Star, Clock, Users } from 'lucide-react';

const TEAM_IMAGE =
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80';

export function AboutPage() {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Star size={28} className="text-amber-500" />,
      title: t('about.values.quality'),
      desc: t('about.values.quality_desc'),
    },
    {
      icon: <Clock size={28} className="text-amber-500" />,
      title: t('about.values.experience'),
      desc: t('about.values.experience_desc'),
    },
    {
      icon: <Shield size={28} className="text-amber-500" />,
      title: t('about.values.trust'),
      desc: t('about.values.trust_desc'),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('about.title')}</h1>
          <p className="text-blue-200">{t('about.subtitle')}</p>
        </div>
      </div>

      {/* About Content */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Navagli — Reformas Integrales
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t('about.description')}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Con un equipo altamente cualificado y la tecnología más avanzada, ofrecemos
                soluciones personalizadas para cada proyecto, garantizando los mejores
                resultados en tiempo y forma.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={TEAM_IMAGE}
                alt="Navagli team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-blue-900 text-white">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: <Users size={28} />, value: '+500', label: 'Clientes satisfechos' },
              { icon: <Star size={28} />, value: '+500', label: 'Proyectos completados' },
              { icon: <Clock size={28} />, value: '+20', label: 'Años de experiencia' },
              { icon: <Shield size={28} />, value: '100%', label: 'Garantía de calidad' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-amber-400">{stat.icon}</div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-10">
            {t('about.values_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center"
              >
                <div className="flex justify-center mb-4">{v.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
