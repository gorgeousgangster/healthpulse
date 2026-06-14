import { useApp } from '../context/AppContext';

export default function HistoryModal({ record, onClose }) {
  const { t, lang } = useApp();

  if (!record) return null;

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(lang === 'vi' ? 'vi-VN' : 'en-US', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }

  const LEVEL_COLORS = {
    low: 'bg-emerald-100 text-emerald-700',
    moderate: 'bg-amber-100 text-amber-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  const metrics = [
    { label: t('form.age'), value: record.payload.age, unit: t('form.years') },
    { label: t('form.bmi'), value: record.payload.bmi?.toFixed(1), unit: t('form.kgm2') },
    { label: t('form.systolic'), value: record.payload.blood_pressure_systolic, unit: t('form.mmHg') },
    { label: t('form.diastolic'), value: record.payload.blood_pressure_diastolic, unit: t('form.mmHg') },
    { label: t('form.cholesterol'), value: record.payload.cholesterol, unit: t('form.mgdl') },
    { label: t('form.glucose'), value: record.payload.glucose, unit: t('form.mgdl') },
    { label: t('form.smoking'), value: record.payload.smoking ? '✓' : '✗', unit: '' },
    { label: t('form.alcohol'), value: record.payload.alcohol_weekly_units, unit: t('form.units') },
    { label: t('form.exercise'), value: record.payload.exercise_hours_weekly, unit: t('form.hours') },
    { label: t('form.sleep'), value: record.payload.sleep_hours_daily, unit: t('form.hours') },
    { label: t('form.stress'), value: record.payload.stress_level, unit: t('form.of10') },
    { label: t('form.familyHeart'), value: record.payload.family_history_heart_disease ? '✓' : '✗', unit: '' },
    { label: t('form.familyDiabetes'), value: record.payload.family_history_diabetes ? '✓' : '✗', unit: '' },
  ];

  const risks = [
    { label: t('results.overall') ? 'Overall' : 'Overall', value: `${record.overall_risk?.toFixed(1)}%` },
    { label: t('results.cardiovascular'), value: `${record.cardiovascular_risk?.toFixed(1)}%` },
    { label: t('results.diabetes'), value: `${record.diabetes_risk?.toFixed(1)}%` },
    { label: t('results.mentalHealth'), value: `${record.mental_health_risk?.toFixed(1)}%` },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-2xl flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{t('history.record')} {formatDate(record.created_at)}</h2>
            <span className={`inline-block mt-1 text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${LEVEL_COLORS[record.risk_level] || ''}`}>
              {record.risk_level}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Health Metrics Table */}
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('form.title')}</h3>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {metrics.map((m, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                    <td className="px-4 py-2.5 text-gray-600 font-medium">{m.label}</td>
                    <td className="px-4 py-2.5 text-right text-gray-900 font-semibold">
                      {m.value} <span className="text-xs text-gray-400 font-normal">{m.unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Risk Results */}
        <div className="px-6 pb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('results.title')}</h3>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {risks.map((r, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                    <td className="px-4 py-2.5 text-gray-600 font-medium">{r.label}</td>
                    <td className="px-4 py-2.5 text-right text-gray-900 font-bold">{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 rounded-b-2xl">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-xl transition-colors"
          >
            {lang === 'vi' ? 'Đóng' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
