import { useApp } from '../context/AppContext';
import { ShapTableExplainer as ShapTableExplainerCard } from './ShapExplainer';

const LEVEL_CONFIG = {
  low: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200' },
  moderate: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200' },
  high: { bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200' },
};

const DIMENSION_STYLES = {
  cardiovascular: { dot: 'bg-red-400', border: 'border-red-100', headerBg: 'bg-red-50/60' },
  diabetes: { dot: 'bg-amber-400', border: 'border-amber-100', headerBg: 'bg-amber-50/60' },
  mental_health: { dot: 'bg-blue-400', border: 'border-blue-100', headerBg: 'bg-blue-50/60' },
};

function translateFeatureName(displayName, t) {
  const translated = t(`featureNames.${displayName}`);
  if (translated && translated !== `featureNames.${displayName}`) {
    return translated;
  }
  return displayName;
}

export default function RiskResults({ data }) {
  const { t } = useApp();

  if (!data) return null;

  const config = LEVEL_CONFIG[data.risk_level] || LEVEL_CONFIG.moderate;

  return (
    <div className="space-y-6">
      {/* Main Risk Score Card */}
      <div className={`card ${config.bg} border-0`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{t('results.title')}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${config.bg} ${config.text} ring-1 ${config.ring}`}>
            {data.risk_level}
          </span>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={data.risk_level === 'low' ? '#10b981' : data.risk_level === 'moderate' ? '#f59e0b' : data.risk_level === 'high' ? '#f97316' : '#ef4444'}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${(data.overall_risk / 100) * 314} 314`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{data.overall_risk}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">{t('results.overall')}</p>
            <div className="space-y-2">
              <RiskBar label={t('results.cardiovascular')} value={data.cardiovascular_risk} />
              <RiskBar label={t('results.diabetes')} value={data.diabetes_risk} />
              <RiskBar label={t('results.mentalHealth')} value={data.mental_health_risk} />
            </div>
          </div>
        </div>
      </div>

      {/* Contributing Factors */}
      {data.contributing_factors && data.contributing_factors.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('results.factors')}
          </h3>
          <ul className="space-y-2">
            {data.contributing_factors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* SHAP Explainability - 3 Column Grid Cards with Pill Badges */}
      {data.explanation && (
        <>
          <ShapTableExplainerCard />
          <ShapGridCards explanation={data.explanation} t={t} />
        </>
      )}
    </div>
  );
}

function RiskBar({ label, value }) {
  const color = value < 20 ? 'bg-emerald-400' : value < 45 ? 'bg-amber-400' : value < 70 ? 'bg-orange-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-700 w-10 text-right">{value}%</span>
    </div>
  );
}

function ShapGridCards({ explanation, t }) {
  const targets = Object.entries(explanation).filter(([_, v]) => v && v.features);
  if (targets.length === 0) return null;

  const dimensionLabels = {
    cardiovascular: t('results.cardiovascular'),
    diabetes: t('results.diabetes'),
    mental_health: t('results.mentalHealth'),
  };

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        {t('results.shap')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {targets.map(([key, target]) => {
          const styles = DIMENSION_STYLES[key] || DIMENSION_STYLES.cardiovascular;
          const features = target.features
            ?.filter(f => f.shap_value !== 0)
            .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));

          return (
            <div key={key} className={`rounded-xl border ${styles.border} overflow-hidden`}>
              <div className={`px-4 py-2.5 ${styles.headerBg} border-b ${styles.border}`}>
                <p className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${styles.dot}`} />
                  {dimensionLabels[key] || key}
                </p>
              </div>
              <div className="p-3 space-y-2">
                {features?.map((feat, i) => {
                  const featureName = translateFeatureName(feat.display_name || feat.name, t);
                  return (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <span className="text-xs text-gray-600 truncate flex-1">{featureName}</span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                        feat.direction === 'risk'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {feat.direction === 'risk' ? '+' : '−'}{Math.abs(feat.shap_value).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
