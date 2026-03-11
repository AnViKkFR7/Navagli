import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { PropertyCard } from '../components/ui/PropertyCard';
import { LoadingSpinner, ErrorMessage } from '../components/ui/Loading';
import { useProperties } from '../hooks/useData';
import type { PropertyFilters, PropertyType, PropertyCategory, PropertyStatus } from '../types';

export function PropertiesPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<PropertyFilters>({ page: 1, pageSize: 12 });
  const [search, setSearch] = useState('');

  const { data, loading, error } = useProperties(filters);

  const handleSearch = useCallback(() => {
    setFilters((f) => ({ ...f, search: search || undefined, page: 1 }));
  }, [search]);

  const handleFilterChange = useCallback(
    (key: keyof PropertyFilters, value: string | undefined) => {
      setFilters((f) => ({ ...f, [key]: value || undefined, page: 1 }));
    },
    [],
  );

  const handlePage = useCallback((page: number) => {
    setFilters((f) => ({ ...f, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const propertyTypes: PropertyType[] = [
    'apartment',
    'house',
    'villa',
    'commercial',
    'office',
    'land',
  ];
  const categories: PropertyCategory[] = ['sale', 'rent', 'renovation'];
  const statuses: PropertyStatus[] = ['available', 'in_progress', 'completed', 'sold'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold">{t('properties.title')}</h1>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('properties.search_placeholder')}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* Type filter */}
            <select
              onChange={(e) =>
                handleFilterChange('type', e.target.value as PropertyType | undefined)
              }
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              aria-label={t('properties.filter_type')}
            >
              <option value="">{t('properties.filter_type')}</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {t(`properties.type.${type}`)}
                </option>
              ))}
            </select>

            {/* Category filter */}
            <select
              onChange={(e) =>
                handleFilterChange('category', e.target.value as PropertyCategory | undefined)
              }
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              aria-label={t('properties.filter_category')}
            >
              <option value="">{t('properties.filter_category')}</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {t(`properties.category.${cat}`)}
                </option>
              ))}
            </select>

            {/* Status filter */}
            <select
              onChange={(e) =>
                handleFilterChange('status', e.target.value as PropertyStatus | undefined)
              }
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              aria-label={t('properties.filter_status')}
            >
              <option value="">{t('properties.filter_status')}</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {t(`properties.status.${s}`)}
                </option>
              ))}
            </select>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-medium transition-colors"
            >
              {t('properties.search_placeholder').replace('...', '')}
            </button>
          </div>
        </div>

        {/* Results */}
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {data && data.data.length === 0 && (
          <p className="text-center text-gray-500 py-16">{t('properties.no_results')}</p>
        )}
        {data && data.data.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {data.count} {t('properties.title').toLowerCase()}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.data.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: data.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                      data.page === i + 1
                        ? 'bg-blue-900 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50'
                    }`}
                    aria-label={`Page ${i + 1}`}
                    aria-current={data.page === i + 1 ? 'page' : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
