import { useTranslation } from 'react-i18next';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Loading';
import { useServices } from '../hooks/useData';

const DEFAULT_ICONS: Record<number, string> = {
  0: '🏗️',
  1: '🪟',
  2: '🚿',
  3: '⚡',
  4: '🎨',
  5: '🔧',
  6: '🏠',
  7: '🌿',
};

export function ServicesPage() {
  const { t } = useTranslation();
  const { data: services, loading, error } = useServices();

  const STATIC_SERVICES = [
    {
      id: 'static-1',
      title: 'Reformas Integrales',
      description:
        'Renovación completa de espacios residenciales y comerciales con los mejores materiales.',
      icon: '🏗️',
    },
    {
      id: 'static-2',
      title: 'Instalaciones Eléctricas',
      description: 'Instalación y mantenimiento de sistemas eléctricos con garantía.',
      icon: '⚡',
    },
    {
      id: 'static-3',
      title: 'Fontanería',
      description: 'Reparación e instalación de sistemas de fontanería y sanitarios.',
      icon: '🚿',
    },
    {
      id: 'static-4',
      title: 'Pintura y Decoración',
      description: 'Acabados de alta calidad para dar vida a tus espacios.',
      icon: '🎨',
    },
    {
      id: 'static-5',
      title: 'Carpintería',
      description: 'Puertas, armarios y mobiliario a medida.',
      icon: '🔨',
    },
    {
      id: 'static-6',
      title: 'Suelos y Alicatados',
      description: 'Instalación de suelos, azulejos y revestimientos.',
      icon: '🏠',
    },
  ];

  const displayServices =
    services && services.length > 0
      ? services.map((s, i) => ({
          id: s.id,
          title: s.title,
          description: s.description ?? '',
          icon: s.icon ?? DEFAULT_ICONS[i % 8] ?? '🔧',
          image_url: s.image_url,
        }))
      : STATIC_SERVICES;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('services.title')}</h1>
          <p className="text-blue-200">{t('services.subtitle')}</p>
        </div>
      </div>

      <div className="container-custom py-12">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
