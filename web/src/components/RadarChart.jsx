import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';

const HEALTHY_BASELINES = {
  bmi: { ideal: 22, max: 40, label: 'BMI' },
  blood_pressure_systolic: { ideal: 120, max: 200, label: 'Systolic BP' },
  blood_pressure_diastolic: { ideal: 80, max: 130, label: 'Diastolic BP' },
  cholesterol: { ideal: 180, max: 300, label: 'Cholesterol' },
  glucose: { ideal: 85, max: 200, label: 'Glucose' },
  stress_level: { ideal: 3, max: 10, label: 'Stress' },
};

function normalize(value, max) {
  return Math.min(Math.round((value / max) * 100), 100);
}

export default function RadarChartPanel({ profile }) {
  const { t } = useApp();

  if (!profile) return null;

  const data = Object.entries(HEALTHY_BASELINES).map(([key, { ideal, max, label }]) => ({
    metric: label,
    you: normalize(profile[key] || 0, max),
    healthy: normalize(ideal, max),
  }));

  return (
    <div className="card shadow-lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        {t('radar.title')}
      </h3>
      <p className="text-xs text-gray-400 mb-4">{t('radar.subtitle')}</p>

      <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-4">
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsRadar cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="#d1d5db" strokeWidth={1} />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: '#374151', fontWeight: 500 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Radar name={t('radar.you')} dataKey="you" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2.5} />
              <Radar name={t('radar.healthy')} dataKey="healthy" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2.5} strokeDasharray="4 4" />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
            </RechartsRadar>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
