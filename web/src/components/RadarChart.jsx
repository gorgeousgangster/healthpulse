import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

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
  if (!profile) return null;

  const data = Object.entries(HEALTHY_BASELINES).map(([key, { ideal, max, label }]) => ({
    metric: label,
    you: normalize(profile[key] || 0, max),
    healthy: normalize(ideal, max),
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Health Metrics vs. Healthy Baseline
      </h3>
      <p className="text-xs text-gray-400 mb-4">Normalized comparison — lower is better for most metrics</p>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: '#9ca3af' }} />
            <Radar name="You" dataKey="you" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="Healthy" dataKey="healthy" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
