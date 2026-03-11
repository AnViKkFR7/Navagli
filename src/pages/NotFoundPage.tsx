import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="text-8xl font-black text-blue-900/10 mb-6 select-none">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('common.not_found')}</h1>
        <p className="text-gray-500 mb-8">{t('common.not_found_desc')}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold rounded-xl transition-colors"
        >
          <Home size={18} />
          {t('common.go_home')}
        </Link>
      </div>
    </div>
  );
}
