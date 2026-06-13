const LEVEL_CONFIG = {
  low: { color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-200', icon: '✓' },
  moderate: { color: 'amber', bg: 'bg-amber-50', text: 'text-amber-700', ring: 'ring-amber-200', icon: '!' },
  high: { color: 'orange', bg: 'bg-orange-50', text: 'text-orange-700', ring: 'ring-orange-200', icon: '!!' },
  critical: { color: 'red', bg: 'bg-red-50', text: 'text-red-700', ring: 'ring-red-200', icon: '!!!' },
};

export default function RiskResults({ data }) {
  if (!data) return null;

  const config = LEVEL_CONFIG[data.risk_level] || LEVEL_CONFIG.moderate;

  return (
    <div className="space-y-6">
      <div className={`card ${config.bg} border-0`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Risk Assessment</h2>
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
            <p className="text-sm text-gray-600 mb-3">Overall health risk score based on your profile</p>
            <div className="space-y-2">
              <RiskBar label="Cardiovascular" value={data.cardiovascular_risk} />
              <RiskBar label="Diabetes" value={data.diabetes_risk} />
              <RiskBar label="Mental Health" value={data.mental_health_risk} />
            </div>
          </div>
        </div>
      </div>

      {data.contributing_factors && data.contributing_factors.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Contributing Factors
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

      {data.explanation && <ExplanationPanel explanation={data.explanation} />}
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

function ExplanationPanel({ explanation }) {
  const targets = Object.entries(explanation).filter(([_, v]) => v);
  if (targets.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        SHAP Explainability
      </h3>
      {targets.map(([key, target]) => (
        <div key={key} className="mb-4 last:mb-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{key.replace('_', ' ')}</p>
          <div className="space-y-1.5">
            {target.features?.slice(0, 5).map((feat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-32 truncate">{feat.display_name || feat.name}</span>
                <div className="flex-1 flex items-center">
                  <div className="relative flex-1 h-4 flex items-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-gray-200"></div>
                    </div>
                    <div
                      className={`absolute h-3 rounded-sm ${feat.direction === 'risk' ? 'bg-red-400' : 'bg-emerald-400'}`}
                      style={{
                        width: `${Math.min(Math.abs(feat.shap_value) * 300, 50)}%`,
                        left: feat.direction === 'risk' ? '50%' : undefined,
                        right: feat.direction !== 'risk' ? '50%' : undefined,
                      }}
                    />
                  </div>
                </div>
                <span className={`text-xs font-medium w-14 text-right ${feat.direction === 'risk' ? 'text-red-600' : 'text-emerald-600'}`}>
                  {feat.direction === 'risk' ? '+' : '-'}{Math.abs(feat.shap_value).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
