import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';

function SingleProjectionCard({ title, subtitle, data, disclaimerLabel, disclaimerText }) {
  const { t } = useApp();

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-8 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </span>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>

      <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-2.5 mb-4">
        <p className="text-xs text-amber-700 leading-relaxed">
          <span className="font-semibold">{disclaimerLabel}</span> {disclaimerText}
        </p>
      </div>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 15, bottom: 10, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#4b5563' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${v}%`} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }} />
            <Line
              type="monotone"
              dataKey="cardiovascular"
              name={t('projection.cardiovascular')}
              stroke="#ef4444"
              strokeWidth={2.5}
              dot={{ r: 5, fill: '#ef4444' }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="diabetes"
              name={t('projection.diabetes')}
              stroke="#f97316"
              strokeWidth={2.5}
              dot={{ r: 5, fill: '#f97316' }}
              activeDot={{ r: 7 }}
            />
            <Line
              type="monotone"
              dataKey="mental_health"
              name={t('projection.mentalHealth')}
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 5, fill: '#3b82f6' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function ProjectionChart({ currentRisks, projections }) {
  const { t } = useApp();

  if (!projections || projections.length === 0) return null;

  const fiveYearProjection = projections.find(p => p.label === '5_years');
  const tenYearProjection = projections.find(p => p.label === '10_years');

  const currentPoint = {
    label: t('projection.current'),
    cardiovascular: currentRisks.cardiovascular_risk,
    diabetes: currentRisks.diabetes_risk,
    mental_health: currentRisks.mental_health_risk,
  };

  const fiveYearData = fiveYearProjection
    ? [
        currentPoint,
        {
          label: t('projection.fiveYears'),
          cardiovascular: fiveYearProjection.cardiovascular_risk,
          diabetes: fiveYearProjection.diabetes_risk,
          mental_health: fiveYearProjection.mental_health_risk,
        },
      ]
    : null;

  const tenYearData = tenYearProjection
    ? [
        currentPoint,
        {
          label: t('projection.tenYears'),
          cardiovascular: tenYearProjection.cardiovascular_risk,
          diabetes: tenYearProjection.diabetes_risk,
          mental_health: tenYearProjection.mental_health_risk,
        },
      ]
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {fiveYearData && (
        <SingleProjectionCard
          title={t('projection.fiveYearTitle')}
          subtitle={t('projection.fiveYearSubtitle')}
          data={fiveYearData}
          disclaimerLabel={t('projection.disclaimerLabel')}
          disclaimerText={t('projection.disclaimerText')}
        />
      )}
      {tenYearData && (
        <SingleProjectionCard
          title={t('projection.tenYearTitle')}
          subtitle={t('projection.tenYearSubtitle')}
          data={tenYearData}
          disclaimerLabel={t('projection.disclaimerLabel')}
          disclaimerText={t('projection.disclaimerText')}
        />
      )}
    </div>
  );
}
