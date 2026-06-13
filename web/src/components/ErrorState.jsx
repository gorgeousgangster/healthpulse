import { useApp } from '../context/AppContext';

export default function ErrorState({ message, onRetry }) {
  const { t } = useApp();

  return (
    <div className="card border-red-100 bg-red-50/50">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-800">{t('error.title')}</h3>
          <p className="text-sm text-red-600 mt-1">{message || t('error.default')}</p>
          {onRetry && (
            <button onClick={onRetry} className="mt-3 text-sm font-medium text-red-700 hover:text-red-800 underline">
              {t('error.retry')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
