import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Maximize2 } from 'lucide-react';
import type { Property } from '../../types';

interface PropertyCardProps {
  property: Property;
}

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80';

export function PropertyCard({ property }: PropertyCardProps) {
  const { t } = useTranslation();

  const formatPrice = (price: number | null, currency: string) => {
    if (price === null) return '—';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'EUR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const statusColors: Record<Property['status'], string> = {
    available: 'bg-green-100 text-green-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    sold: 'bg-gray-100 text-gray-600',
  };

  return (
    <Link
      to={`/properties/${property.slug}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={property.main_image_url ?? PLACEHOLDER}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900 text-white">
            {t(`properties.category.${property.category}`)}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}
          >
            {t(`properties.status.${property.status}`)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 group-hover:text-blue-900 transition-colors">
          {property.title}
        </h3>

        {property.city && (
          <p className="flex items-center gap-1 text-sm text-gray-500 mb-3">
            <MapPin size={14} />
            {property.city}
            {property.province ? `, ${property.province}` : ''}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-blue-900">
            {formatPrice(property.price, property.price_currency)}
          </span>
          {property.area_m2 && (
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Maximize2 size={14} />
              {property.area_m2} {t('common.m2')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
