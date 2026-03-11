import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text }: { text?: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-500">
      <Loader2 size={36} className="animate-spin text-blue-700" />
      <p className="text-sm">{text ?? t('common.loading')}</p>
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-2 text-red-500">
      <p className="font-semibold">{t('common.error')}</p>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
