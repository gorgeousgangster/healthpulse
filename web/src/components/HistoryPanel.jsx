import { useApp } from '../context/AppContext';

const LEVEL_COLORS = {
  low: 'bg-emerald-100 text-emerald-700',
  moderate: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export default function HistoryPanel({ history, activeId, onSelect }) {
  const { t, lang } = useApp();

  if (!history || history.length === 0) return null;

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {t('history.title')}
      </h3>
      <p className="text-xs text-gray-400 mb-4">{t('history.subtitle')}</p>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {history.map((record) => (
          <button
            key={record.id}
            onClick={() => onSelect(record)}
            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
              activeId === record.id
                ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-100'
                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-800">
                  {t('history.record')} {formatDate(record.created_at)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t('history.riskScore')}: {record.overall_risk}%
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${LEVEL_COLORS[record.risk_level] || ''}`}>
                {record.risk_level}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
