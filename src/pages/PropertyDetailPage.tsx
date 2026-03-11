import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Maximize2, Calendar } from 'lucide-react';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Loading';
import { useProperty } from '../hooks/useData';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80';

export function PropertyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const { data: property, loading, error } = useProperty(slug ?? '');

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!property) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('common.not_found')}</h1>
        <p className="text-gray-500 mb-6">{t('common.not_found_desc')}</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-blue-900 font-medium hover:underline"
        >
          <ArrowLeft size={16} /> {t('common.back')}
        </Link>
      </div>
    );
  }

  const formatPrice = (price: number | null, currency: string) => {
    if (price === null) return '—';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const allImages =
    property.images && property.images.length > 0
      ? property.images
      : [property.main_image_url ?? PLACEHOLDER];

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-sm text-blue-900 hover:underline font-medium"
          >
            <ArrowLeft size={15} />
            {t('nav.properties')}
          </Link>
        </div>
      </div>

      {/* Main Image Gallery */}
      <div className="bg-black">
        <div className="container-custom py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-96">
            <div className="md:col-span-2 h-full overflow-hidden rounded-xl">
              <img
                src={allImages[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
              {allImages.slice(1, 3).map((img, i) => (
                <div key={i} className="overflow-hidden rounded-xl">
                  <img
                    src={img}
                    alt={`${property.title} ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Content */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  {(property.city || property.province) && (
                    <p className="flex items-center gap-1.5 text-gray-500">
                      <MapPin size={16} />
                      {[property.location, property.city, property.province]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-blue-900">
                    {formatPrice(property.price, property.price_currency)}
                  </p>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {t(`properties.category.${property.category}`)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 py-4 border-t border-b border-gray-100 mb-4">
                {property.area_m2 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Maximize2 size={16} className="text-blue-700" />
                    <span>
                      {property.area_m2} {t('common.m2')}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar size={16} className="text-blue-700" />
                  <span>{new Date(property.created_at).toLocaleDateString()}</span>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {t(`properties.status.${property.status}`)}
                </span>
              </div>

              {property.description && (
                <div>
                  <h2 className="font-semibold text-gray-900 mb-2">{t('properties.description_label')}</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Contact CTA */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">{t('contact.interested')}</h3>
              <Link
                to={`/contact?property=${property.id}`}
                className="block w-full text-center px-5 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors mb-3"
              >
                {t('contact.send')}
              </Link>
              <a
                href="tel:+34600000000"
                className="block w-full text-center px-5 py-3 border border-blue-900 text-blue-900 hover:bg-blue-50 font-semibold rounded-xl transition-colors"
              >
                +34 600 000 000
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
